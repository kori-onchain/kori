const fs = require("fs");
const path = require("path");
const {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} = require("@solana/web3.js");
const {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
} = require("@solana/spl-token");

const ROOT = path.resolve(__dirname, "..", "..");
const API_ROOT = path.resolve(__dirname, "..");
const IDL_ROOT = path.join(ROOT, "programs", "target", "idl");
const WALLET_PATH = path.join(API_ROOT, "wallet.json");

function loadEnvFile() {
  const envPath = path.join(API_ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1).replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function loadIdl(name) {
  return JSON.parse(fs.readFileSync(path.join(IDL_ROOT, `${name}.json`), "utf8"));
}

function programId(envName, idlName) {
  const fallback = loadIdl(idlName).address;
  try {
    return new PublicKey(process.env[envName] || fallback);
  } catch {
    return new PublicKey(fallback);
  }
}

function discriminator(idlName, ixName) {
  const ix = loadIdl(idlName).instructions.find((item) => item.name === ixName);
  if (!ix) throw new Error(`Instruction ${idlName}.${ixName} not found`);
  return Buffer.from(ix.discriminator);
}

function u64(value) {
  let n = BigInt(value);
  const out = Buffer.alloc(8);
  out.writeBigUInt64LE(n);
  return out;
}

function pda(program, seed, ...extraSeeds) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(seed), ...extraSeeds.map((item) => (item instanceof PublicKey ? item.toBuffer() : item))],
    program,
  )[0];
}

function payer() {
  const raw = process.env.SOLANA_RELAYER_SECRET_KEY || (
    fs.existsSync(WALLET_PATH) ? fs.readFileSync(WALLET_PATH, "utf8") : null
  );
  if (!raw) throw new Error("Missing SOLANA_RELAYER_SECRET_KEY or api/wallet.json");
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
}

function cluster() {
  return process.env.SOLANA_CLUSTER || "localnet";
}

function rpcUrl() {
  return cluster() === "devnet"
    ? process.env.SOLANA_DEVNET_RPC_URL || clusterApiUrl("devnet")
    : process.env.SOLANA_LOCALNET_RPC_URL || "http://127.0.0.1:8899";
}

function connection() {
  return new Connection(rpcUrl(), "confirmed");
}

async function sendIx(ixs, signers = []) {
  const conn = connection();
  const feePayer = payer();
  const { blockhash } = await conn.getLatestBlockhash("confirmed");
  const tx = new Transaction({ feePayer: feePayer.publicKey, recentBlockhash: blockhash });
  tx.add(...ixs);
  tx.sign(feePayer, ...signers);
  const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: false });
  await conn.confirmTransaction(sig, "confirmed");
  return sig;
}

async function createMintIfNeeded(label, envName, decimals = 6) {
  if (process.env[envName]) return new PublicKey(process.env[envName]);
  const conn = connection();
  const mint = Keypair.generate();
  const lamports = await getMinimumBalanceForRentExemptMint(conn);
  const feePayer = payer();
  const sig = await sendIx(
    [
      SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: mint.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(mint.publicKey, decimals, feePayer.publicKey, null),
    ],
    [mint],
  );
  console.log(`${label} mint created: ${mint.publicKey.toBase58()} (${sig})`);
  return mint.publicKey;
}

async function createAtaIfNeeded(mint, owner) {
  const ata = getAssociatedTokenAddressSync(mint, owner, true, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
  const conn = connection();
  if (await conn.getAccountInfo(ata)) return ata;
  const feePayer = payer();
  const sig = await sendIx([
    createAssociatedTokenAccountInstruction(feePayer.publicKey, ata, owner, mint),
  ]);
  console.log(`ATA created: ${ata.toBase58()} (${sig})`);
  return ata;
}

function ix(idlName, program, ixName, data, accounts) {
  return new TransactionInstruction({
    programId: program,
    keys: accounts,
    data: Buffer.concat([discriminator(idlName, ixName), data || Buffer.alloc(0)]),
  });
}

module.exports = {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  SystemProgram,
  PublicKey,
  loadEnvFile,
  programId,
  u64,
  pda,
  payer,
  cluster,
  rpcUrl,
  connection,
  sendIx,
  createMintIfNeeded,
  createAtaIfNeeded,
  getAssociatedTokenAddressSync,
  ix,
};
