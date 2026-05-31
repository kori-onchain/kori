use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hashv;
use anchor_spl::token::{Mint, Token, TokenAccount};
use kora_pool::program::KoraPool;
use mpl_bubblegum::instructions::{MintV2CpiBuilder, TransferV2CpiBuilder};
use mpl_bubblegum::programs::MPL_BUBBLEGUM_ID;
use mpl_bubblegum::types::{Creator, MetadataArgsV2, TokenStandard};

declare_id!("E2LPGxULGzSypzM4h9H5sSXmo3DgBQuFjCUf1wpJvW4L");

pub const BUSINESS_CONFIG_SEED: &[u8] = b"business_config";
pub const BUSINESS_AUTHORITY_SEED: &[u8] = b"business_authority";
pub const MERCHANT_PROFILE_SEED: &[u8] = b"merchant_profile";
pub const RECEIVABLE_SEED: &[u8] = b"receivable_cnft";

#[program]
pub mod kora_business {
    use super::*;

    pub fn initialize_business(
        ctx: Context<InitializeBusiness>,
        pool_beneficiary: Pubkey,
    ) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.bubblegum_program.key(),
            MPL_BUBBLEGUM_ID,
            KoraBusinessError::InvalidBubblegumProgram
        );

        let config = &mut ctx.accounts.business_config;
        config.authority = ctx.accounts.authority.key();
        config.business_authority = ctx.accounts.business_authority.key();
        config.merkle_tree = ctx.accounts.merkle_tree.key();
        config.tree_config = ctx.accounts.tree_config.key();
        config.pool_beneficiary = pool_beneficiary;
        config.bump = ctx.bumps.business_config;
        config.business_authority_bump = ctx.bumps.business_authority;

        emit!(BusinessInitialized {
            config: config.key(),
            authority: config.authority,
            merkle_tree: config.merkle_tree,
            pool_beneficiary,
        });
        Ok(())
    }

    pub fn register_merchant(ctx: Context<RegisterMerchant>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.business_config.authority,
            ctx.accounts.authority.key(),
            KoraBusinessError::Unauthorized
        );
        require_keys_eq!(
            ctx.accounts.settlement_usdc.owner,
            ctx.accounts.merchant.key(),
            KoraBusinessError::InvalidSettlementAccount
        );

        let profile = &mut ctx.accounts.merchant_profile;
        profile.merchant = ctx.accounts.merchant.key();
        profile.settlement_usdc = ctx.accounts.settlement_usdc.key();
        profile.enabled = true;
        profile.bump = ctx.bumps.merchant_profile;

        emit!(MerchantRegistered {
            merchant: profile.merchant,
            settlement_usdc: profile.settlement_usdc,
        });
        Ok(())
    }

    pub fn mint_receivable_cnft(
        ctx: Context<MintReceivableCnft>,
        sale_id: u64,
        gross_amount: u64,
        net_amount: u64,
        due_date: i64,
        metadata_uri: String,
        asset_id: [u8; 32],
    ) -> Result<()> {
        require!(ctx.accounts.merchant_profile.enabled, KoraBusinessError::MerchantDisabled);
        require!(
            gross_amount > 0 && net_amount > 0 && net_amount <= gross_amount,
            KoraBusinessError::InvalidAmounts
        );
        require!(
            due_date > Clock::get()?.unix_timestamp,
            KoraBusinessError::ReceivableExpired
        );
        require!(metadata_uri.len() <= 200, KoraBusinessError::MetadataTooLarge);
        require_keys_eq!(
            ctx.accounts.merkle_tree.key(),
            ctx.accounts.business_config.merkle_tree,
            KoraBusinessError::InvalidMerkleTree
        );
        require_keys_eq!(
            ctx.accounts.tree_config.key(),
            ctx.accounts.business_config.tree_config,
            KoraBusinessError::InvalidMerkleTree
        );
        require_keys_eq!(
            ctx.accounts.bubblegum_program.key(),
            MPL_BUBBLEGUM_ID,
            KoraBusinessError::InvalidBubblegumProgram
        );

        let metadata = MetadataArgsV2 {
            name: format!("Kora Invoice #{sale_id}"),
            symbol: "KINV".to_string(),
            uri: metadata_uri,
            seller_fee_basis_points: 0,
            primary_sale_happened: true,
            is_mutable: false,
            token_standard: Some(TokenStandard::NonFungible),
            creators: vec![Creator {
                address: ctx.accounts.business_authority.key(),
                verified: true,
                share: 100,
            }],
            collection: None,
        };

        let authority_bump = ctx.accounts.business_config.business_authority_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[BUSINESS_AUTHORITY_SEED, &[authority_bump]]];
        let bubblegum_program_info = ctx.accounts.bubblegum_program.to_account_info();
        let tree_config_info = ctx.accounts.tree_config.to_account_info();
        let payer_info = ctx.accounts.payer.to_account_info();
        let business_authority_info = ctx.accounts.business_authority.to_account_info();
        let merchant_info = ctx.accounts.merchant.to_account_info();
        let merkle_tree_info = ctx.accounts.merkle_tree.to_account_info();
        let log_wrapper_info = ctx.accounts.log_wrapper.to_account_info();
        let compression_program_info = ctx.accounts.compression_program.to_account_info();
        let mpl_core_program_info = ctx.accounts.mpl_core_program.to_account_info();
        let system_program_info = ctx.accounts.system_program.to_account_info();

        MintV2CpiBuilder::new(&bubblegum_program_info)
            .tree_config(&tree_config_info)
            .payer(&payer_info)
            .tree_creator_or_delegate(Some(&business_authority_info))
            .collection_authority(Some(&business_authority_info))
            .leaf_owner(&merchant_info)
            .leaf_delegate(Some(&business_authority_info))
            .merkle_tree(&merkle_tree_info)
            .log_wrapper(&log_wrapper_info)
            .compression_program(&compression_program_info)
            .mpl_core_program(&mpl_core_program_info)
            .system_program(&system_program_info)
            .metadata(metadata)
            .invoke_signed(signer_seeds)?;

        let receivable_id = hashv(&[
            b"kora_receivable",
            ctx.accounts.merchant.key().as_ref(),
            &sale_id.to_le_bytes(),
            &asset_id,
        ])
        .to_bytes();

        let record = &mut ctx.accounts.receivable_record;
        record.config = ctx.accounts.business_config.key();
        record.merchant = ctx.accounts.merchant.key();
        record.sale_id = sale_id;
        record.receivable_id = receivable_id;
        record.asset_id = asset_id;
        record.merkle_tree = ctx.accounts.merkle_tree.key();
        record.root = [0; 32];
        record.gross_amount = gross_amount;
        record.net_amount = net_amount;
        record.fee_bps = discount_bps(gross_amount, net_amount)?;
        record.due_date = due_date;
        record.beneficiary = ctx.accounts.merchant.key();
        record.status = ReceivableStatus::Registered;
        record.bump = ctx.bumps.receivable_record;

        emit!(ReceivableMinted {
            merchant: record.merchant,
            sale_id,
            receivable_id,
            asset_id,
            gross_amount,
            net_amount,
        });
        Ok(())
    }

    pub fn anticipate_cnft<'info>(
        ctx: Context<'_, '_, '_, 'info, AnticipateCnft<'info>>,
        root: [u8; 32],
        data_hash: [u8; 32],
        creator_hash: [u8; 32],
        asset_data_hash: [u8; 32],
        nonce: u64,
        index: u32,
        flags: u8,
    ) -> Result<()> {
        let record = &mut ctx.accounts.receivable_record;
        require_keys_eq!(
            record.merchant,
            ctx.accounts.merchant.key(),
            KoraBusinessError::Unauthorized
        );
        require_keys_eq!(
            record.merkle_tree,
            ctx.accounts.merkle_tree.key(),
            KoraBusinessError::InvalidMerkleTree
        );
        require!(
            record.status == ReceivableStatus::Registered,
            KoraBusinessError::InvalidReceivableStatus
        );
        require!(
            record.due_date > Clock::get()?.unix_timestamp,
            KoraBusinessError::ReceivableExpired
        );
        require_keys_eq!(
            ctx.accounts.bubblegum_program.key(),
            MPL_BUBBLEGUM_ID,
            KoraBusinessError::InvalidBubblegumProgram
        );

        let bubblegum_program_info = ctx.accounts.bubblegum_program.to_account_info();
        let tree_config_info = ctx.accounts.tree_config.to_account_info();
        let merchant_info = ctx.accounts.merchant.to_account_info();
        let pool_beneficiary_info = ctx.accounts.pool_beneficiary.to_account_info();
        let merkle_tree_info = ctx.accounts.merkle_tree.to_account_info();
        let log_wrapper_info = ctx.accounts.log_wrapper.to_account_info();
        let compression_program_info = ctx.accounts.compression_program.to_account_info();
        let system_program_info = ctx.accounts.system_program.to_account_info();

        let mut transfer = TransferV2CpiBuilder::new(&bubblegum_program_info);
        transfer
            .tree_config(&tree_config_info)
            .payer(&merchant_info)
            .authority(Some(&merchant_info))
            .leaf_owner(&merchant_info)
            .leaf_delegate(Some(&merchant_info))
            .new_leaf_owner(&pool_beneficiary_info)
            .merkle_tree(&merkle_tree_info)
            .log_wrapper(&log_wrapper_info)
            .compression_program(&compression_program_info)
            .system_program(&system_program_info)
            .root(root)
            .data_hash(data_hash)
            .creator_hash(creator_hash)
            .asset_data_hash(asset_data_hash)
            .nonce(nonce)
            .index(index)
            .flags(flags);

        for proof in ctx.remaining_accounts.iter() {
            transfer.add_remaining_account(proof, false, false);
        }
        transfer.invoke()?;

        record.status = ReceivableStatus::Anticipated;
        record.root = root;
        record.beneficiary = ctx.accounts.pool_beneficiary.key();

        let authority_bump = ctx.accounts.business_config.business_authority_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[BUSINESS_AUTHORITY_SEED, &[authority_bump]]];
        let cpi_accounts = kora_pool::cpi::accounts::WithdrawForAnticipation {
            pool_config: ctx.accounts.pool_config.to_account_info(),
            pool_authority: ctx.accounts.pool_authority.to_account_info(),
            liquidity_vault: ctx.accounts.liquidity_vault.to_account_info(),
            vault_usdc: ctx.accounts.pool_vault_usdc.to_account_info(),
            usdc_mint: ctx.accounts.usdc_mint.to_account_info(),
            destination_usdc: ctx.accounts.merchant_usdc.to_account_info(),
            caller_authority: ctx.accounts.business_authority.to_account_info(),
            authorized_caller: ctx.accounts.authorized_caller.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.kora_pool_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        kora_pool::cpi::withdraw_for_anticipation(
            cpi_ctx,
            record.receivable_id,
            record.gross_amount,
            record.net_amount,
        )?;

        emit!(ReceivableAnticipated {
            merchant: record.merchant,
            sale_id: record.sale_id,
            receivable_id: record.receivable_id,
            gross_amount: record.gross_amount,
            net_amount: record.net_amount,
            beneficiary: record.beneficiary,
        });
        Ok(())
    }

    pub fn mark_settled(ctx: Context<MarkSettled>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.business_config.authority,
            ctx.accounts.authority.key(),
            KoraBusinessError::Unauthorized
        );
        let record = &mut ctx.accounts.receivable_record;
        require!(
            record.status == ReceivableStatus::Registered
                || record.status == ReceivableStatus::Anticipated,
            KoraBusinessError::InvalidReceivableStatus
        );
        record.status = ReceivableStatus::Settled;

        emit!(ReceivableSettled {
            sale_id: record.sale_id,
            receivable_id: record.receivable_id,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeBusiness<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + BusinessConfig::SPACE,
        seeds = [BUSINESS_CONFIG_SEED],
        bump
    )]
    pub business_config: Account<'info, BusinessConfig>,
    /// CHECK: PDA authority for Bubblegum and pool CPIs.
    #[account(seeds = [BUSINESS_AUTHORITY_SEED], bump)]
    pub business_authority: UncheckedAccount<'info>,
    /// CHECK: Bubblegum tree config for the approved receivable tree.
    pub tree_config: UncheckedAccount<'info>,
    /// CHECK: Concurrent Merkle tree controlled by Bubblegum/account-compression.
    pub merkle_tree: UncheckedAccount<'info>,
    /// CHECK: Validated against Metaplex Bubblegum program id.
    pub bubblegum_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterMerchant<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(seeds = [BUSINESS_CONFIG_SEED], bump = business_config.bump)]
    pub business_config: Account<'info, BusinessConfig>,
    /// CHECK: Merchant identity stored in profile.
    pub merchant: UncheckedAccount<'info>,
    pub settlement_usdc: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = authority,
        space = 8 + MerchantProfile::SPACE,
        seeds = [MERCHANT_PROFILE_SEED, merchant.key().as_ref()],
        bump
    )]
    pub merchant_profile: Account<'info, MerchantProfile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(sale_id: u64)]
pub struct MintReceivableCnft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(seeds = [BUSINESS_CONFIG_SEED], bump = business_config.bump)]
    pub business_config: Account<'info, BusinessConfig>,
    /// CHECK: PDA authority validated by seeds.
    #[account(seeds = [BUSINESS_AUTHORITY_SEED], bump = business_config.business_authority_bump)]
    pub business_authority: UncheckedAccount<'info>,
    /// CHECK: Merchant receives the cNFT leaf.
    pub merchant: UncheckedAccount<'info>,
    #[account(
        seeds = [MERCHANT_PROFILE_SEED, merchant.key().as_ref()],
        bump = merchant_profile.bump
    )]
    pub merchant_profile: Account<'info, MerchantProfile>,
    #[account(address = business_config.tree_config)]
    /// CHECK: Bubblegum tree config.
    pub tree_config: UncheckedAccount<'info>,
    #[account(mut, address = business_config.merkle_tree)]
    /// CHECK: Bubblegum Merkle tree.
    pub merkle_tree: UncheckedAccount<'info>,
    /// CHECK: Validated against Metaplex Bubblegum program id.
    pub bubblegum_program: UncheckedAccount<'info>,
    /// CHECK: SPL noop log wrapper.
    pub log_wrapper: UncheckedAccount<'info>,
    /// CHECK: SPL account compression program.
    pub compression_program: UncheckedAccount<'info>,
    /// CHECK: Metaplex Core program for Bubblegum V2.
    pub mpl_core_program: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + ReceivableCnftRecord::SPACE,
        seeds = [RECEIVABLE_SEED, merchant.key().as_ref(), &sale_id.to_le_bytes()],
        bump
    )]
    pub receivable_record: Account<'info, ReceivableCnftRecord>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AnticipateCnft<'info> {
    #[account(mut)]
    pub merchant: Signer<'info>,
    #[account(seeds = [BUSINESS_CONFIG_SEED], bump = business_config.bump)]
    pub business_config: Account<'info, BusinessConfig>,
    /// CHECK: PDA authority validated by seeds and used as pool CPI signer.
    #[account(seeds = [BUSINESS_AUTHORITY_SEED], bump = business_config.business_authority_bump)]
    pub business_authority: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [RECEIVABLE_SEED, merchant.key().as_ref(), &receivable_record.sale_id.to_le_bytes()],
        bump = receivable_record.bump
    )]
    pub receivable_record: Account<'info, ReceivableCnftRecord>,
    #[account(address = business_config.tree_config)]
    /// CHECK: Bubblegum tree config.
    pub tree_config: UncheckedAccount<'info>,
    #[account(mut, address = business_config.merkle_tree)]
    /// CHECK: Bubblegum Merkle tree.
    pub merkle_tree: UncheckedAccount<'info>,
    #[account(address = business_config.pool_beneficiary)]
    /// CHECK: Pool beneficiary leaf owner configured at initialization.
    pub pool_beneficiary: UncheckedAccount<'info>,
    /// CHECK: Validated against Metaplex Bubblegum program id.
    pub bubblegum_program: UncheckedAccount<'info>,
    /// CHECK: SPL noop log wrapper.
    pub log_wrapper: UncheckedAccount<'info>,
    /// CHECK: SPL account compression program.
    pub compression_program: UncheckedAccount<'info>,
    #[account(mut, constraint = merchant_usdc.owner == merchant.key() @ KoraBusinessError::InvalidSettlementAccount)]
    pub merchant_usdc: Account<'info, TokenAccount>,
    pub usdc_mint: Account<'info, Mint>,
    /// CHECK: kora_pool account validated by the CPI target.
    #[account(mut)]
    pub pool_config: UncheckedAccount<'info>,
    /// CHECK: kora_pool PDA authority validated by the CPI target.
    pub pool_authority: UncheckedAccount<'info>,
    /// CHECK: kora_pool state validated by the CPI target.
    pub liquidity_vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub pool_vault_usdc: Account<'info, TokenAccount>,
    /// CHECK: kora_pool AuthorizedCaller validated by the CPI target.
    pub authorized_caller: UncheckedAccount<'info>,
    pub kora_pool_program: Program<'info, KoraPool>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarkSettled<'info> {
    pub authority: Signer<'info>,
    #[account(seeds = [BUSINESS_CONFIG_SEED], bump = business_config.bump)]
    pub business_config: Account<'info, BusinessConfig>,
    #[account(
        mut,
        seeds = [RECEIVABLE_SEED, receivable_record.merchant.as_ref(), &receivable_record.sale_id.to_le_bytes()],
        bump = receivable_record.bump
    )]
    pub receivable_record: Account<'info, ReceivableCnftRecord>,
}

fn discount_bps(gross: u64, net: u64) -> Result<u16> {
    let discount = gross
        .checked_sub(net)
        .ok_or(KoraBusinessError::ArithmeticOverflow)?;
    let scaled = discount
        .checked_mul(10_000)
        .ok_or(KoraBusinessError::ArithmeticOverflow)?
        .checked_div(gross)
        .ok_or(KoraBusinessError::ArithmeticOverflow)?;
    u16::try_from(scaled).map_err(|_| KoraBusinessError::ArithmeticOverflow.into())
}

#[account]
pub struct BusinessConfig {
    pub authority: Pubkey,
    pub business_authority: Pubkey,
    pub merkle_tree: Pubkey,
    pub tree_config: Pubkey,
    pub pool_beneficiary: Pubkey,
    pub bump: u8,
    pub business_authority_bump: u8,
}

impl BusinessConfig {
    pub const SPACE: usize = 32 * 5 + 1 + 1;
}

#[account]
pub struct MerchantProfile {
    pub merchant: Pubkey,
    pub settlement_usdc: Pubkey,
    pub enabled: bool,
    pub bump: u8,
}

impl MerchantProfile {
    pub const SPACE: usize = 32 + 32 + 1 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ReceivableStatus {
    Registered,
    Anticipated,
    Settled,
}

#[account]
pub struct ReceivableCnftRecord {
    pub config: Pubkey,
    pub merchant: Pubkey,
    pub sale_id: u64,
    pub receivable_id: [u8; 32],
    pub asset_id: [u8; 32],
    pub merkle_tree: Pubkey,
    pub root: [u8; 32],
    pub gross_amount: u64,
    pub net_amount: u64,
    pub fee_bps: u16,
    pub due_date: i64,
    pub beneficiary: Pubkey,
    pub status: ReceivableStatus,
    pub bump: u8,
}

impl ReceivableCnftRecord {
    pub const SPACE: usize = 32 + 32 + 8 + 32 + 32 + 32 + 32 + 8 + 8 + 2 + 8 + 32 + 1 + 1;
}

#[event]
pub struct BusinessInitialized {
    pub config: Pubkey,
    pub authority: Pubkey,
    pub merkle_tree: Pubkey,
    pub pool_beneficiary: Pubkey,
}

#[event]
pub struct MerchantRegistered {
    pub merchant: Pubkey,
    pub settlement_usdc: Pubkey,
}

#[event]
pub struct ReceivableMinted {
    pub merchant: Pubkey,
    pub sale_id: u64,
    pub receivable_id: [u8; 32],
    pub asset_id: [u8; 32],
    pub gross_amount: u64,
    pub net_amount: u64,
}

#[event]
pub struct ReceivableAnticipated {
    pub merchant: Pubkey,
    pub sale_id: u64,
    pub receivable_id: [u8; 32],
    pub gross_amount: u64,
    pub net_amount: u64,
    pub beneficiary: Pubkey,
}

#[event]
pub struct ReceivableSettled {
    pub sale_id: u64,
    pub receivable_id: [u8; 32],
}

#[error_code]
pub enum KoraBusinessError {
    #[msg("Unauthorized signer")]
    Unauthorized,
    #[msg("Merchant profile is disabled")]
    MerchantDisabled,
    #[msg("Invalid receivable amounts")]
    InvalidAmounts,
    #[msg("Receivable is expired")]
    ReceivableExpired,
    #[msg("Unexpected Bubblegum program")]
    InvalidBubblegumProgram,
    #[msg("Invalid Merkle tree or tree config")]
    InvalidMerkleTree,
    #[msg("Settlement token account is invalid")]
    InvalidSettlementAccount,
    #[msg("Receivable is not in the expected status")]
    InvalidReceivableStatus,
    #[msg("Metadata URI is too large")]
    MetadataTooLarge,
    #[msg("Arithmetic overflow or underflow")]
    ArithmeticOverflow,
}
