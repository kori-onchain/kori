use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{
    self, Burn, Mint, MintTo, Token, TokenAccount, TransferChecked,
};

declare_id!("7i5RcmG4gwHgftiHTut2vWPsowYsAo9ZBdRvQuc6hjyB");

pub const POOL_CONFIG_SEED: &[u8] = b"pool_config";
pub const POOL_AUTHORITY_SEED: &[u8] = b"pool_authority";
pub const LIQUIDITY_VAULT_SEED: &[u8] = b"liquidity_vault";
pub const SHARE_MINT_CONFIG_SEED: &[u8] = b"share_mint_config";
pub const KUSDC_MINT_SEED: &[u8] = b"kusdc_mint";
pub const AUTHORIZED_CALLER_SEED: &[u8] = b"authorized_caller";

#[program]
pub mod kora_pool {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool_config;
        pool.authority = ctx.accounts.authority.key();
        pool.usdc_mint = ctx.accounts.usdc_mint.key();
        pool.kusdc_mint = Pubkey::default();
        pool.pool_authority = ctx.accounts.pool_authority.key();
        pool.total_liquidity = 0;
        pool.total_receivables = 0;
        pool.pool_authority_bump = ctx.bumps.pool_authority;
        pool.bump = ctx.bumps.pool_config;

        emit!(PoolInitialized {
            pool: pool.key(),
            authority: pool.authority,
            usdc_mint: pool.usdc_mint,
        });
        Ok(())
    }

    pub fn initialize_liquidity_vault(ctx: Context<InitializeLiquidityVault>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.pool_config.authority,
            ctx.accounts.authority.key(),
            KoraPoolError::Unauthorized
        );

        let vault = &mut ctx.accounts.liquidity_vault;
        vault.pool_config = ctx.accounts.pool_config.key();
        vault.token_account = ctx.accounts.vault_usdc.key();
        vault.bump = ctx.bumps.liquidity_vault;

        emit!(LiquidityVaultInitialized {
            pool: ctx.accounts.pool_config.key(),
            vault: vault.key(),
            token_account: vault.token_account,
        });
        Ok(())
    }

    pub fn initialize_share_mint(ctx: Context<InitializeShareMint>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.pool_config.authority,
            ctx.accounts.authority.key(),
            KoraPoolError::Unauthorized
        );

        let pool = &mut ctx.accounts.pool_config;
        pool.kusdc_mint = ctx.accounts.kusdc_mint.key();

        let share = &mut ctx.accounts.share_mint_config;
        share.pool_config = pool.key();
        share.mint = ctx.accounts.kusdc_mint.key();
        share.bump = ctx.bumps.share_mint_config;

        emit!(ShareMintInitialized {
            pool: pool.key(),
            kusdc_mint: pool.kusdc_mint,
            share_mint_config: share.key(),
        });
        Ok(())
    }

    pub fn set_authorized_caller(
        ctx: Context<SetAuthorizedCaller>,
        caller_program: Pubkey,
        enabled: bool,
    ) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.pool_config.authority,
            ctx.accounts.authority.key(),
            KoraPoolError::Unauthorized
        );

        let caller = &mut ctx.accounts.authorized_caller;
        caller.pool_config = ctx.accounts.pool_config.key();
        caller.caller_program = caller_program;
        caller.caller_authority = ctx.accounts.caller_authority.key();
        caller.enabled = enabled;
        caller.bump = ctx.bumps.authorized_caller;

        emit!(AuthorizedCallerSet {
            caller_program,
            caller_authority: caller.caller_authority,
            enabled,
        });
        Ok(())
    }

    pub fn deposit_liquidity(ctx: Context<DepositLiquidity>, amount: u64) -> Result<()> {
        require!(amount > 0, KoraPoolError::InvalidAmount);
        require_keys_eq!(
            ctx.accounts.investor_usdc.mint,
            ctx.accounts.pool_config.usdc_mint,
            KoraPoolError::InvalidMint
        );
        require_keys_eq!(
            ctx.accounts.investor_usdc.owner,
            ctx.accounts.investor.key(),
            KoraPoolError::InvalidTokenOwner
        );

        token::transfer_checked(
            ctx.accounts.deposit_usdc_context(),
            amount,
            ctx.accounts.usdc_mint.decimals,
        )?;

        let pool_bump = ctx.accounts.pool_config.pool_authority_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[POOL_AUTHORITY_SEED, &[pool_bump]]];
        token::mint_to(
            ctx.accounts.mint_shares_context().with_signer(signer_seeds),
            amount,
        )?;

        let pool = &mut ctx.accounts.pool_config;
        pool.total_liquidity = pool
            .total_liquidity
            .checked_add(amount)
            .ok_or(KoraPoolError::ArithmeticOverflow)?;

        emit!(LiquidityDeposited {
            investor: ctx.accounts.investor.key(),
            amount,
            total_liquidity: pool.total_liquidity,
        });
        Ok(())
    }

    pub fn redeem_liquidity(ctx: Context<RedeemLiquidity>, amount: u64) -> Result<()> {
        require!(amount > 0, KoraPoolError::InvalidAmount);
        require!(
            ctx.accounts.pool_config.total_liquidity >= amount,
            KoraPoolError::InsufficientLiquidity
        );

        token::burn(ctx.accounts.burn_shares_context(), amount)?;

        let pool_bump = ctx.accounts.pool_config.pool_authority_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[POOL_AUTHORITY_SEED, &[pool_bump]]];
        token::transfer_checked(
            ctx.accounts
                .withdraw_usdc_context()
                .with_signer(signer_seeds),
            amount,
            ctx.accounts.usdc_mint.decimals,
        )?;

        let pool = &mut ctx.accounts.pool_config;
        pool.total_liquidity = pool
            .total_liquidity
            .checked_sub(amount)
            .ok_or(KoraPoolError::ArithmeticOverflow)?;

        emit!(LiquidityRedeemed {
            investor: ctx.accounts.investor.key(),
            amount,
            total_liquidity: pool.total_liquidity,
        });
        Ok(())
    }

    pub fn withdraw_for_anticipation(
        ctx: Context<WithdrawForAnticipation>,
        receivable_id: [u8; 32],
        gross_amount: u64,
        net_amount: u64,
    ) -> Result<()> {
        validate_authorized_caller(
            &ctx.accounts.pool_config,
            &ctx.accounts.authorized_caller,
            ctx.accounts.caller_authority.key(),
        )?;
        require!(
            gross_amount > 0 && net_amount > 0 && net_amount <= gross_amount,
            KoraPoolError::InvalidAmount
        );
        require!(
            ctx.accounts.pool_config.total_liquidity >= net_amount,
            KoraPoolError::InsufficientLiquidity
        );

        let pool_bump = ctx.accounts.pool_config.pool_authority_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[POOL_AUTHORITY_SEED, &[pool_bump]]];
        token::transfer_checked(
            ctx.accounts
                .pool_to_merchant_context()
                .with_signer(signer_seeds),
            net_amount,
            ctx.accounts.usdc_mint.decimals,
        )?;

        let pool = &mut ctx.accounts.pool_config;
        pool.total_liquidity = pool
            .total_liquidity
            .checked_sub(net_amount)
            .ok_or(KoraPoolError::ArithmeticOverflow)?;
        pool.total_receivables = pool
            .total_receivables
            .checked_add(gross_amount)
            .ok_or(KoraPoolError::ArithmeticOverflow)?;

        emit!(AnticipationWithdrawn {
            receivable_id,
            gross_amount,
            net_amount,
            destination: ctx.accounts.destination_usdc.key(),
            total_liquidity: pool.total_liquidity,
            total_receivables: pool.total_receivables,
        });
        Ok(())
    }

    pub fn receive_settlement(
        ctx: Context<ReceiveSettlement>,
        receivable_id: [u8; 32],
        amount: u64,
    ) -> Result<()> {
        validate_authorized_caller(
            &ctx.accounts.pool_config,
            &ctx.accounts.authorized_caller,
            ctx.accounts.caller_authority.key(),
        )?;
        require!(amount > 0, KoraPoolError::InvalidAmount);
        require!(
            ctx.accounts.pool_config.total_receivables >= amount,
            KoraPoolError::SettlementExceedsReceivables
        );
        require_keys_eq!(
            ctx.accounts.payer_usdc.owner,
            ctx.accounts.payer.key(),
            KoraPoolError::InvalidTokenOwner
        );

        token::transfer_checked(
            ctx.accounts.receive_settlement_context(),
            amount,
            ctx.accounts.usdc_mint.decimals,
        )?;

        let pool = &mut ctx.accounts.pool_config;
        pool.total_receivables = pool
            .total_receivables
            .checked_sub(amount)
            .ok_or(KoraPoolError::ArithmeticOverflow)?;
        pool.total_liquidity = pool
            .total_liquidity
            .checked_add(amount)
            .ok_or(KoraPoolError::ArithmeticOverflow)?;

        emit!(SettlementReceived {
            receivable_id,
            payer: ctx.accounts.payer.key(),
            amount,
            total_liquidity: pool.total_liquidity,
            total_receivables: pool.total_receivables,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub usdc_mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        payer = authority,
        space = 8 + PoolConfig::INIT_SPACE,
        seeds = [POOL_CONFIG_SEED],
        bump
    )]
    pub pool_config: Box<Account<'info, PoolConfig>>,
    /// CHECK: PDA authority used by token vault and kUSDC mint.
    #[account(seeds = [POOL_AUTHORITY_SEED], bump)]
    pub pool_authority: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeLiquidityVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Box<Account<'info, PoolConfig>>,
    /// CHECK: PDA authority used by the token vault.
    #[account(seeds = [POOL_AUTHORITY_SEED], bump = pool_config.pool_authority_bump)]
    pub pool_authority: UncheckedAccount<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + LiquidityVault::INIT_SPACE,
        seeds = [LIQUIDITY_VAULT_SEED],
        bump
    )]
    pub liquidity_vault: Box<Account<'info, LiquidityVault>>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = usdc_mint,
        associated_token::authority = pool_authority
    )]
    pub vault_usdc: Box<Account<'info, TokenAccount>>,
    #[account(address = pool_config.usdc_mint)]
    pub usdc_mint: Box<Account<'info, Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeShareMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Box<Account<'info, PoolConfig>>,
    /// CHECK: PDA authority used by the kUSDC mint.
    #[account(seeds = [POOL_AUTHORITY_SEED], bump = pool_config.pool_authority_bump)]
    pub pool_authority: UncheckedAccount<'info>,
    #[account(address = pool_config.usdc_mint)]
    pub usdc_mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        payer = authority,
        mint::decimals = usdc_mint.decimals,
        mint::authority = pool_authority,
        seeds = [KUSDC_MINT_SEED],
        bump
    )]
    pub kusdc_mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        payer = authority,
        space = 8 + ShareMintConfig::INIT_SPACE,
        seeds = [SHARE_MINT_CONFIG_SEED],
        bump
    )]
    pub share_mint_config: Box<Account<'info, ShareMintConfig>>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SetAuthorizedCaller<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Account<'info, PoolConfig>,
    /// CHECK: PDA owned by the authorized external program. It must sign CPIs.
    pub caller_authority: UncheckedAccount<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + AuthorizedCaller::INIT_SPACE,
        seeds = [AUTHORIZED_CALLER_SEED, caller_authority.key().as_ref()],
        bump
    )]
    pub authorized_caller: Account<'info, AuthorizedCaller>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(mut)]
    pub investor_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub investor_kusdc: Account<'info, TokenAccount>,
    #[account(mut, seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Account<'info, PoolConfig>,
    #[account(seeds = [POOL_AUTHORITY_SEED], bump = pool_config.pool_authority_bump)]
    /// CHECK: PDA authority validated by seeds.
    pub pool_authority: UncheckedAccount<'info>,
    #[account(seeds = [LIQUIDITY_VAULT_SEED], bump = liquidity_vault.bump)]
    pub liquidity_vault: Account<'info, LiquidityVault>,
    #[account(mut, address = liquidity_vault.token_account)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(address = pool_config.usdc_mint)]
    pub usdc_mint: Account<'info, Mint>,
    #[account(mut, address = pool_config.kusdc_mint)]
    pub kusdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

impl<'info> DepositLiquidity<'info> {
    fn deposit_usdc_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.investor_usdc.to_account_info(),
                mint: self.usdc_mint.to_account_info(),
                to: self.vault_usdc.to_account_info(),
                authority: self.investor.to_account_info(),
            },
        )
    }

    fn mint_shares_context(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.kusdc_mint.to_account_info(),
                to: self.investor_kusdc.to_account_info(),
                authority: self.pool_authority.to_account_info(),
            },
        )
    }
}

#[derive(Accounts)]
pub struct RedeemLiquidity<'info> {
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(mut)]
    pub investor_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub investor_kusdc: Account<'info, TokenAccount>,
    #[account(mut, seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Account<'info, PoolConfig>,
    #[account(seeds = [POOL_AUTHORITY_SEED], bump = pool_config.pool_authority_bump)]
    /// CHECK: PDA authority validated by seeds.
    pub pool_authority: UncheckedAccount<'info>,
    #[account(seeds = [LIQUIDITY_VAULT_SEED], bump = liquidity_vault.bump)]
    pub liquidity_vault: Account<'info, LiquidityVault>,
    #[account(mut, address = liquidity_vault.token_account)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(address = pool_config.usdc_mint)]
    pub usdc_mint: Account<'info, Mint>,
    #[account(mut, address = pool_config.kusdc_mint)]
    pub kusdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

impl<'info> RedeemLiquidity<'info> {
    fn burn_shares_context(&self) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                mint: self.kusdc_mint.to_account_info(),
                from: self.investor_kusdc.to_account_info(),
                authority: self.investor.to_account_info(),
            },
        )
    }

    fn withdraw_usdc_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.vault_usdc.to_account_info(),
                mint: self.usdc_mint.to_account_info(),
                to: self.investor_usdc.to_account_info(),
                authority: self.pool_authority.to_account_info(),
            },
        )
    }
}

#[derive(Accounts)]
pub struct WithdrawForAnticipation<'info> {
    #[account(mut, seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Account<'info, PoolConfig>,
    #[account(seeds = [POOL_AUTHORITY_SEED], bump = pool_config.pool_authority_bump)]
    /// CHECK: PDA authority validated by seeds.
    pub pool_authority: UncheckedAccount<'info>,
    #[account(seeds = [LIQUIDITY_VAULT_SEED], bump = liquidity_vault.bump)]
    pub liquidity_vault: Account<'info, LiquidityVault>,
    #[account(mut, address = liquidity_vault.token_account)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(address = pool_config.usdc_mint)]
    pub usdc_mint: Account<'info, Mint>,
    #[account(mut, constraint = destination_usdc.mint == pool_config.usdc_mint @ KoraPoolError::InvalidMint)]
    pub destination_usdc: Account<'info, TokenAccount>,
    pub caller_authority: Signer<'info>,
    #[account(
        seeds = [AUTHORIZED_CALLER_SEED, caller_authority.key().as_ref()],
        bump = authorized_caller.bump
    )]
    pub authorized_caller: Account<'info, AuthorizedCaller>,
    pub token_program: Program<'info, Token>,
}

impl<'info> WithdrawForAnticipation<'info> {
    fn pool_to_merchant_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.vault_usdc.to_account_info(),
                mint: self.usdc_mint.to_account_info(),
                to: self.destination_usdc.to_account_info(),
                authority: self.pool_authority.to_account_info(),
            },
        )
    }
}

#[derive(Accounts)]
pub struct ReceiveSettlement<'info> {
    #[account(mut, seeds = [POOL_CONFIG_SEED], bump = pool_config.bump)]
    pub pool_config: Account<'info, PoolConfig>,
    #[account(seeds = [LIQUIDITY_VAULT_SEED], bump = liquidity_vault.bump)]
    pub liquidity_vault: Account<'info, LiquidityVault>,
    #[account(mut, address = liquidity_vault.token_account)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(address = pool_config.usdc_mint)]
    pub usdc_mint: Account<'info, Mint>,
    pub payer: Signer<'info>,
    #[account(mut, constraint = payer_usdc.mint == pool_config.usdc_mint @ KoraPoolError::InvalidMint)]
    pub payer_usdc: Account<'info, TokenAccount>,
    pub caller_authority: Signer<'info>,
    #[account(
        seeds = [AUTHORIZED_CALLER_SEED, caller_authority.key().as_ref()],
        bump = authorized_caller.bump
    )]
    pub authorized_caller: Account<'info, AuthorizedCaller>,
    pub token_program: Program<'info, Token>,
}

impl<'info> ReceiveSettlement<'info> {
    fn receive_settlement_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.payer_usdc.to_account_info(),
                mint: self.usdc_mint.to_account_info(),
                to: self.vault_usdc.to_account_info(),
                authority: self.payer.to_account_info(),
            },
        )
    }
}

fn validate_authorized_caller(
    pool: &Account<PoolConfig>,
    caller: &Account<AuthorizedCaller>,
    caller_authority: Pubkey,
) -> Result<()> {
    require!(caller.enabled, KoraPoolError::Unauthorized);
    require_keys_eq!(caller.pool_config, pool.key(), KoraPoolError::Unauthorized);
    require_keys_eq!(
        caller.caller_authority,
        caller_authority,
        KoraPoolError::Unauthorized
    );
    Ok(())
}

#[account]
#[derive(InitSpace)]
pub struct PoolConfig {
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub kusdc_mint: Pubkey,
    pub pool_authority: Pubkey,
    pub total_liquidity: u64,
    pub total_receivables: u64,
    pub pool_authority_bump: u8,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct LiquidityVault {
    pub pool_config: Pubkey,
    pub token_account: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ShareMintConfig {
    pub pool_config: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AuthorizedCaller {
    pub pool_config: Pubkey,
    pub caller_program: Pubkey,
    pub caller_authority: Pubkey,
    pub enabled: bool,
    pub bump: u8,
}

#[event]
pub struct PoolInitialized {
    pub pool: Pubkey,
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
}

#[event]
pub struct LiquidityVaultInitialized {
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub token_account: Pubkey,
}

#[event]
pub struct ShareMintInitialized {
    pub pool: Pubkey,
    pub kusdc_mint: Pubkey,
    pub share_mint_config: Pubkey,
}

#[event]
pub struct AuthorizedCallerSet {
    pub caller_program: Pubkey,
    pub caller_authority: Pubkey,
    pub enabled: bool,
}

#[event]
pub struct LiquidityDeposited {
    pub investor: Pubkey,
    pub amount: u64,
    pub total_liquidity: u64,
}

#[event]
pub struct LiquidityRedeemed {
    pub investor: Pubkey,
    pub amount: u64,
    pub total_liquidity: u64,
}

#[event]
pub struct AnticipationWithdrawn {
    pub receivable_id: [u8; 32],
    pub gross_amount: u64,
    pub net_amount: u64,
    pub destination: Pubkey,
    pub total_liquidity: u64,
    pub total_receivables: u64,
}

#[event]
pub struct SettlementReceived {
    pub receivable_id: [u8; 32],
    pub payer: Pubkey,
    pub amount: u64,
    pub total_liquidity: u64,
    pub total_receivables: u64,
}

#[error_code]
pub enum KoraPoolError {
    #[msg("The caller is not authorized for this pool")]
    Unauthorized,
    #[msg("Amount must be positive and internally consistent")]
    InvalidAmount,
    #[msg("Pool liquidity is insufficient")]
    InsufficientLiquidity,
    #[msg("Arithmetic overflow or underflow")]
    ArithmeticOverflow,
    #[msg("Token account mint does not match the pool USDC mint")]
    InvalidMint,
    #[msg("Token account owner is invalid")]
    InvalidTokenOwner,
    #[msg("Settlement exceeds outstanding receivables")]
    SettlementExceedsReceivables,
}
