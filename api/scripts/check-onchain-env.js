const {
  PublicKey,
  connection,
  loadEnvFile,
  payer,
  pda,
  programId,
  rpcUrl,
} = require("./onchain-utils");

loadEnvFile();

const required = [
  "SOLANA_RELAYER_SECRET_KEY",
  "USDC_MINT",
  "POOL_VAULT_USDC",
  "MERKLE_TREE",
  "TREE_CONFIG",
  "POOL_BENEFICIARY",
  "BUBBLEGUM_PROGRAM_ID",
  "COMPRESSION_PROGRAM_ID",
  "LOG_WRAPPER_PROGRAM_ID",
  "MPL_CORE_PROGRAM_ID",
];

const optional = [
  "KUSDC_MINT",
  "MERCHANT_USDC",
  "RECEIVABLE_RECORD",
  "ONCHAIN_DUMMY_ROOT",
  "ONCHAIN_DUMMY_DATA_HASH",
  "ONCHAIN_DUMMY_CREATOR_HASH",
  "ONCHAIN_DUMMY_ASSET_DATA_HASH",
];

function validPubkey(value) {
  try {
    if (!value) return false;
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const conn = connection();
  let relayer = null;
  try {
    relayer = payer().publicKey;
  } catch {}

  const pool = programId("KORA_POOL_PROGRAM_ID", "kora_pool");
  const business = programId("KORA_BUSINESS_PROGRAM_ID", "kora_business");
  const credit = programId("KORA_CREDIT_PROGRAM_ID", "kora_credit");

  const accountChecks = [
    ["USDC_MINT", process.env.USDC_MINT],
    ["POOL_VAULT_USDC", process.env.POOL_VAULT_USDC],
    ["MERKLE_TREE", process.env.MERKLE_TREE],
    ["TREE_CONFIG", process.env.TREE_CONFIG],
    ["pool_config", pda(pool, "pool_config").toBase58()],
    ["business_config", pda(business, "business_config").toBase58()],
    ["credit_config", pda(credit, "credit_config").toBase58()],
  ];

  const accounts = [];
  for (const [name, value] of accountChecks) {
    accounts.push({
      name,
      address: value || null,
      exists: validPubkey(value) ? Boolean(await conn.getAccountInfo(new PublicKey(value)).catch(() => null)) : false,
    });
  }

  console.log(JSON.stringify({
    rpcUrl: rpcUrl(),
    relayer: relayer?.toBase58() || null,
    relayerSol: relayer ? (await conn.getBalance(relayer).catch(() => 0)) / 1_000_000_000 : 0,
    env: {
      required: required.map((name) => ({ name, configured: Boolean(process.env[name]) })),
      optional: optional.map((name) => ({ name, configured: Boolean(process.env[name]) })),
    },
    programs: {
      pool: pool.toBase58(),
      business: business.toBase58(),
      credit: credit.toBase58(),
    },
    accounts,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
