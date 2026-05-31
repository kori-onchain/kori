use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, TransferChecked};
use kora_pool::program::KoraPool;

declare_id!("2yhkji6YeS9r3qUbUfmJQVbMmwke7zSjR2pjCam71woD");

pub const CREDIT_CONFIG_SEED: &[u8] = b"credit_config";
pub const CREDIT_AUTHORITY_SEED: &[u8] = b"credit_authority";
pub const CREDIT_PROFILE_SEED: &[u8] = b"credit_profile";
pub const MAX_INSTALLMENTS: usize = 32;

#[program]
pub mod kora_credit {
    use super::*;

    pub fn initialize_credit(ctx: Context<InitializeCredit>) -> Result<()> {
        let config = &mut ctx.accounts.credit_config;
        config.authority = ctx.accounts.authority.key();
        config.credit_authority = ctx.accounts.credit_authority.key();
        config.usdc_mint = ctx.accounts.usdc_mint.key();
        config.bump = ctx.bumps.credit_config;
        config.credit_authority_bump = ctx.bumps.credit_authority;

        emit!(CreditInitialized {
            config: config.key(),
            authority: config.authority,
            usdc_mint: config.usdc_mint,
        });
        Ok(())
    }

    pub fn create_profile(ctx: Context<CreateProfile>, credit_limit: u64) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.credit_config.authority,
            ctx.accounts.authority.key(),
            KoraCreditError::Unauthorized
        );

        let profile = &mut ctx.accounts.credit_profile;
        profile.borrower = ctx.accounts.borrower.key();
        profile.credit_limit = credit_limit;
        profile.locked_limit = 0;
        profile.installments = Vec::new();
        profile.bump = ctx.bumps.credit_profile;

        emit!(CreditProfileCreated {
            borrower: profile.borrower,
            credit_limit,
        });
        Ok(())
    }

    pub fn set_credit_limit(ctx: Context<SetCreditLimit>, credit_limit: u64) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.credit_config.authority,
            ctx.accounts.authority.key(),
            KoraCreditError::Unauthorized
        );
        require!(
            credit_limit >= ctx.accounts.credit_profile.locked_limit,
            KoraCreditError::LimitBelowLocked
        );

        ctx.accounts.credit_profile.credit_limit = credit_limit;
        emit!(CreditLimitUpdated {
            borrower: ctx.accounts.credit_profile.borrower,
            credit_limit,
        });
        Ok(())
    }

    pub fn purchase(
        ctx: Context<Purchase>,
        sale_id: u64,
        principal_amount: u64,
        interest_amount: u64,
        due_date: i64,
    ) -> Result<()> {
        require!(principal_amount > 0, KoraCreditError::InvalidAmount);
        require!(
            due_date > Clock::get()?.unix_timestamp,
            KoraCreditError::InvoiceExpired
        );
        require!(
            ctx.accounts.credit_profile.installments.len() < MAX_INSTALLMENTS,
            KoraCreditError::TooManyInstallments
        );
        require!(
            ctx.accounts
                .credit_profile
                .installments
                .iter()
                .all(|item| item.sale_id != sale_id),
            KoraCreditError::DuplicateSale
        );

        let profile = &mut ctx.accounts.credit_profile;
        let new_locked = profile
            .locked_limit
            .checked_add(principal_amount)
            .ok_or(KoraCreditError::ArithmeticOverflow)?;
        require!(new_locked <= profile.credit_limit, KoraCreditError::LimitExceeded);
        profile.locked_limit = new_locked;
        profile.installments.push(Installment {
            sale_id,
            merchant: ctx.accounts.merchant.key(),
            principal_amount,
            interest_amount,
            due_date,
            paid: false,
        });

        emit!(PurchaseCreated {
            borrower: profile.borrower,
            merchant: ctx.accounts.merchant.key(),
            sale_id,
            principal_amount,
            interest_amount,
            locked_limit: profile.locked_limit,
        });
        Ok(())
    }

    pub fn pay_invoice(ctx: Context<PayInvoice>, sale_id: u64, amount: u64) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.credit_config.usdc_mint,
            ctx.accounts.usdc_mint.key(),
            KoraCreditError::InvalidMint
        );
        require_keys_eq!(
            ctx.accounts.payer_usdc.owner,
            ctx.accounts.payer.key(),
            KoraCreditError::InvalidTokenOwner
        );
        require_keys_eq!(
            ctx.accounts.payer_usdc.mint,
            ctx.accounts.usdc_mint.key(),
            KoraCreditError::InvalidMint
        );
        require!(
            ctx.accounts.receivable_record.sale_id == sale_id,
            KoraCreditError::InvalidReceivable
        );

        let position = ctx
            .accounts
            .credit_profile
            .installments
            .iter()
            .position(|item| item.sale_id == sale_id)
            .ok_or(KoraCreditError::InstallmentNotFound)?;

        let installment = ctx.accounts.credit_profile.installments[position].clone();
        require!(!installment.paid, KoraCreditError::InstallmentAlreadyPaid);
        require!(
            Clock::get()?.unix_timestamp <= installment.due_date,
            KoraCreditError::InvoiceExpired
        );
        require_keys_eq!(
            installment.merchant,
            ctx.accounts.receivable_record.merchant,
            KoraCreditError::InvalidReceivable
        );

        let required_amount = installment
            .principal_amount
            .checked_add(installment.interest_amount)
            .ok_or(KoraCreditError::ArithmeticOverflow)?;
        require!(amount >= required_amount, KoraCreditError::InvalidAmount);

        if ctx.accounts.receivable_record.status == kora_business::ReceivableStatus::Anticipated {
            let authority_bump = ctx.accounts.credit_config.credit_authority_bump;
            let signer_seeds: &[&[&[u8]]] = &[&[CREDIT_AUTHORITY_SEED, &[authority_bump]]];
            let cpi_accounts = kora_pool::cpi::accounts::ReceiveSettlement {
                pool_config: ctx.accounts.pool_config.to_account_info(),
                liquidity_vault: ctx.accounts.liquidity_vault.to_account_info(),
                vault_usdc: ctx.accounts.pool_vault_usdc.to_account_info(),
                usdc_mint: ctx.accounts.usdc_mint.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                payer_usdc: ctx.accounts.payer_usdc.to_account_info(),
                caller_authority: ctx.accounts.credit_authority.to_account_info(),
                authorized_caller: ctx.accounts.authorized_caller.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.kora_pool_program.to_account_info(),
                cpi_accounts,
                signer_seeds,
            );
            kora_pool::cpi::receive_settlement(
                cpi_ctx,
                ctx.accounts.receivable_record.receivable_id,
                amount,
            )?;
        } else {
            require_keys_eq!(
                ctx.accounts.merchant_usdc.owner,
                installment.merchant,
                KoraCreditError::InvalidTokenOwner
            );
            require_keys_eq!(
                ctx.accounts.merchant_usdc.mint,
                ctx.accounts.usdc_mint.key(),
                KoraCreditError::InvalidMint
            );
            token::transfer_checked(
                ctx.accounts.pay_merchant_context(),
                amount,
                ctx.accounts.usdc_mint.decimals,
            )?;
        }

        let profile = &mut ctx.accounts.credit_profile;
        profile.locked_limit = profile
            .locked_limit
            .checked_sub(installment.principal_amount)
            .ok_or(KoraCreditError::ArithmeticOverflow)?;
        profile.installments[position].paid = true;

        emit!(InvoicePaid {
            borrower: profile.borrower,
            sale_id,
            amount,
            anticipated: ctx.accounts.receivable_record.status
                == kora_business::ReceivableStatus::Anticipated,
            locked_limit: profile.locked_limit,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCredit<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = authority,
        space = 8 + CreditConfig::INIT_SPACE,
        seeds = [CREDIT_CONFIG_SEED],
        bump
    )]
    pub credit_config: Account<'info, CreditConfig>,
    /// CHECK: PDA signer used for kora_pool settlement CPIs.
    #[account(seeds = [CREDIT_AUTHORITY_SEED], bump)]
    pub credit_authority: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(seeds = [CREDIT_CONFIG_SEED], bump = credit_config.bump)]
    pub credit_config: Account<'info, CreditConfig>,
    /// CHECK: Borrower identity stored in the profile.
    pub borrower: UncheckedAccount<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + CreditProfile::INIT_SPACE,
        seeds = [CREDIT_PROFILE_SEED, borrower.key().as_ref()],
        bump
    )]
    pub credit_profile: Account<'info, CreditProfile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetCreditLimit<'info> {
    pub authority: Signer<'info>,
    #[account(seeds = [CREDIT_CONFIG_SEED], bump = credit_config.bump)]
    pub credit_config: Account<'info, CreditConfig>,
    #[account(mut)]
    pub credit_profile: Account<'info, CreditProfile>,
}

#[derive(Accounts)]
pub struct Purchase<'info> {
    pub borrower: Signer<'info>,
    #[account(seeds = [CREDIT_CONFIG_SEED], bump = credit_config.bump)]
    pub credit_config: Account<'info, CreditConfig>,
    #[account(
        mut,
        seeds = [CREDIT_PROFILE_SEED, borrower.key().as_ref()],
        bump = credit_profile.bump,
        constraint = credit_profile.borrower == borrower.key() @ KoraCreditError::Unauthorized
    )]
    pub credit_profile: Account<'info, CreditProfile>,
    /// CHECK: Merchant identity is copied into the installment and emitted for indexing.
    pub merchant: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct PayInvoice<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(seeds = [CREDIT_CONFIG_SEED], bump = credit_config.bump)]
    pub credit_config: Account<'info, CreditConfig>,
    /// CHECK: PDA authority validated by seeds and used as kora_pool CPI signer.
    #[account(seeds = [CREDIT_AUTHORITY_SEED], bump = credit_config.credit_authority_bump)]
    pub credit_authority: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [CREDIT_PROFILE_SEED, payer.key().as_ref()],
        bump = credit_profile.bump,
        constraint = credit_profile.borrower == payer.key() @ KoraCreditError::Unauthorized
    )]
    pub credit_profile: Account<'info, CreditProfile>,
    #[account(mut)]
    pub payer_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub merchant_usdc: Account<'info, TokenAccount>,
    pub usdc_mint: Account<'info, Mint>,
    pub receivable_record: Account<'info, kora_business::ReceivableCnftRecord>,
    /// CHECK: kora_pool account validated by the CPI target when used.
    #[account(mut)]
    pub pool_config: UncheckedAccount<'info>,
    /// CHECK: kora_pool state validated by the CPI target when used.
    pub liquidity_vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub pool_vault_usdc: Account<'info, TokenAccount>,
    /// CHECK: kora_pool AuthorizedCaller validated by the CPI target when used.
    pub authorized_caller: UncheckedAccount<'info>,
    pub kora_pool_program: Program<'info, KoraPool>,
    pub token_program: Program<'info, Token>,
}

impl<'info> PayInvoice<'info> {
    fn pay_merchant_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.payer_usdc.to_account_info(),
                mint: self.usdc_mint.to_account_info(),
                to: self.merchant_usdc.to_account_info(),
                authority: self.payer.to_account_info(),
            },
        )
    }
}

#[account]
#[derive(InitSpace)]
pub struct CreditConfig {
    pub authority: Pubkey,
    pub credit_authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub bump: u8,
    pub credit_authority_bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CreditProfile {
    pub borrower: Pubkey,
    pub credit_limit: u64,
    pub locked_limit: u64,
    #[max_len(32)]
    pub installments: Vec<Installment>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Installment {
    pub sale_id: u64,
    pub merchant: Pubkey,
    pub principal_amount: u64,
    pub interest_amount: u64,
    pub due_date: i64,
    pub paid: bool,
}

#[event]
pub struct CreditInitialized {
    pub config: Pubkey,
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
}

#[event]
pub struct CreditProfileCreated {
    pub borrower: Pubkey,
    pub credit_limit: u64,
}

#[event]
pub struct CreditLimitUpdated {
    pub borrower: Pubkey,
    pub credit_limit: u64,
}

#[event]
pub struct PurchaseCreated {
    pub borrower: Pubkey,
    pub merchant: Pubkey,
    pub sale_id: u64,
    pub principal_amount: u64,
    pub interest_amount: u64,
    pub locked_limit: u64,
}

#[event]
pub struct InvoicePaid {
    pub borrower: Pubkey,
    pub sale_id: u64,
    pub amount: u64,
    pub anticipated: bool,
    pub locked_limit: u64,
}

#[error_code]
pub enum KoraCreditError {
    #[msg("Unauthorized signer")]
    Unauthorized,
    #[msg("Amount must be positive and cover the invoice")]
    InvalidAmount,
    #[msg("Credit limit exceeded")]
    LimitExceeded,
    #[msg("New credit limit cannot be lower than locked limit")]
    LimitBelowLocked,
    #[msg("Too many open installments")]
    TooManyInstallments,
    #[msg("Sale id already exists in this profile")]
    DuplicateSale,
    #[msg("Installment was not found")]
    InstallmentNotFound,
    #[msg("Installment is already paid")]
    InstallmentAlreadyPaid,
    #[msg("Invoice is expired")]
    InvoiceExpired,
    #[msg("Receivable record does not match this invoice")]
    InvalidReceivable,
    #[msg("Token account mint is invalid")]
    InvalidMint,
    #[msg("Token account owner is invalid")]
    InvalidTokenOwner,
    #[msg("Arithmetic overflow or underflow")]
    ArithmeticOverflow,
}
