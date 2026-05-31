const {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  SystemProgram,
  PublicKey,
  cluster,
  createAtaIfNeeded,
  getAssociatedTokenAddressSync,
  ix,
  loadEnvFile,
  payer,
  pda,
  programId,
  rpcUrl,
  sendIx,
} = require("./onchain-utils");

loadEnvFile();

async function main() {
  const relayer = payer();
  const currentCluster = cluster();
  const pool = programId("KORA_POOL_PROGRAM_ID", "kora_pool");
  const business = programId("KORA_BUSINESS_PROGRAM_ID", "kora_business");
  const credit = programId("KORA_CREDIT_PROGRAM_ID", "kora_credit");

  if (!process.env.USDC_MINT) {
    throw new Error("Missing USDC_MINT. Create/configure the USDC mint before running setup.");
  }
  const usdcMint = new PublicKey(process.env.USDC_MINT);
  const kusdcMint = pda(pool, "kusdc_mint");
  const poolAuthority = pda(pool, "pool_authority");
  const businessAuthority = pda(business, "business_authority");
  const creditAuthority = pda(credit, "credit_authority");
  const liquidityVault = pda(pool, "liquidity_vault");
  const poolVaultUsdc = getAssociatedTokenAddressSync(
    usdcMint,
    poolAuthority,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  const merchantUsdc = await createAtaIfNeeded(usdcMint, relayer.publicKey);
  const poolBeneficiary = process.env.POOL_BENEFICIARY
    ? new PublicKey(process.env.POOL_BENEFICIARY)
    : relayer.publicKey;
  const treeConfig = process.env.TREE_CONFIG
    ? new PublicKey(process.env.TREE_CONFIG)
    : relayer.publicKey;
  const merkleTree = process.env.MERKLE_TREE
    ? new PublicKey(process.env.MERKLE_TREE)
    : relayer.publicKey;
  if (!process.env.BUBBLEGUM_PROGRAM_ID) {
    throw new Error("Missing BUBBLEGUM_PROGRAM_ID. Configure the Bubblegum program id before running setup.");
  }
  const bubblegum = new PublicKey(process.env.BUBBLEGUM_PROGRAM_ID);

  const steps = [
    {
      name: "initialize_pool",
      ix: ix("kora_pool", pool, "initialize_pool", null, [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: usdcMint, isSigner: false, isWritable: false },
        { pubkey: pda(pool, "pool_config"), isSigner: false, isWritable: true },
        { pubkey: poolAuthority, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ]),
    },
    {
      name: "initialize_share_mint",
      ix: ix("kora_pool", pool, "initialize_share_mint", null, [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: pda(pool, "pool_config"), isSigner: false, isWritable: true },
        { pubkey: poolAuthority, isSigner: false, isWritable: false },
        { pubkey: usdcMint, isSigner: false, isWritable: false },
        { pubkey: kusdcMint, isSigner: false, isWritable: true },
        { pubkey: pda(pool, "share_mint_config"), isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"), isSigner: false, isWritable: false },
      ]),
    },
    {
      name: "initialize_liquidity_vault",
      ix: ix("kora_pool", pool, "initialize_liquidity_vault", null, [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: pda(pool, "pool_config"), isSigner: false, isWritable: false },
        { pubkey: poolAuthority, isSigner: false, isWritable: false },
        { pubkey: liquidityVault, isSigner: false, isWritable: true },
        { pubkey: poolVaultUsdc, isSigner: false, isWritable: true },
        { pubkey: usdcMint, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ]),
    },
    {
      name: "set_authorized_caller_business",
      ix: ix("kora_pool", pool, "set_authorized_caller", Buffer.concat([business.toBuffer(), Buffer.from([1])]), [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: pda(pool, "pool_config"), isSigner: false, isWritable: false },
        { pubkey: businessAuthority, isSigner: false, isWritable: false },
        { pubkey: pda(pool, "authorized_caller", businessAuthority), isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ]),
    },
    {
      name: "set_authorized_caller_credit",
      ix: ix("kora_pool", pool, "set_authorized_caller", Buffer.concat([credit.toBuffer(), Buffer.from([1])]), [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: pda(pool, "pool_config"), isSigner: false, isWritable: false },
        { pubkey: creditAuthority, isSigner: false, isWritable: false },
        { pubkey: pda(pool, "authorized_caller", creditAuthority), isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ]),
    },
    {
      name: "initialize_business",
      ix: ix("kora_business", business, "initialize_business", poolBeneficiary.toBuffer(), [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: pda(business, "business_config"), isSigner: false, isWritable: true },
        { pubkey: businessAuthority, isSigner: false, isWritable: false },
        { pubkey: treeConfig, isSigner: false, isWritable: false },
        { pubkey: merkleTree, isSigner: false, isWritable: false },
        { pubkey: bubblegum, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ]),
    },
    {
      name: "initialize_credit",
      ix: ix("kora_credit", credit, "initialize_credit", null, [
        { pubkey: relayer.publicKey, isSigner: true, isWritable: true },
        { pubkey: usdcMint, isSigner: false, isWritable: false },
        { pubkey: pda(credit, "credit_config"), isSigner: false, isWritable: true },
        { pubkey: creditAuthority, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ]),
    },
  ];

  for (const step of steps) {
    try {
      const sig = await sendIx([step.ix]);
      console.log(`${step.name}: ${sig}`);
    } catch (error) {
      console.log(`${step.name}: skipped/failed - ${error.message}`);
    }
  }

  console.log("\n# Add/update these in api/.env");
  console.log(`SOLANA_CLUSTER=${currentCluster}`);
  console.log(`SOLANA_${currentCluster === "devnet" ? "DEVNET" : "LOCALNET"}_RPC_URL=${rpcUrl()}`);
  console.log(`USDC_MINT=${usdcMint.toBase58()}`);
  console.log(`KUSDC_MINT=${kusdcMint.toBase58()}`);
  console.log(`POOL_VAULT_USDC=${poolVaultUsdc.toBase58()}`);
  console.log(`POOL_BENEFICIARY=${poolBeneficiary.toBase58()}`);
  console.log(`MERCHANT_USDC=${merchantUsdc.toBase58()}`);
  console.log(`TREE_CONFIG=${treeConfig.toBase58()}`);
  console.log(`MERKLE_TREE=${merkleTree.toBase58()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
