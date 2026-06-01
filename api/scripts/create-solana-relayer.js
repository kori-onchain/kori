const fs = require("fs");
const path = require("path");
const { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } = require("@solana/web3.js");

async function main() {
  const keypair = Keypair.generate();
  const secret = Array.from(keypair.secretKey);
  const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl("devnet");
  const outDir = path.resolve(__dirname, "../../.relayer");
  const outFile = path.join(outDir, "solana-devnet-relayer.json");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: secret,
        rpcUrl,
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  console.log("Relayer devnet criado.");
  console.log(`Public key: ${keypair.publicKey.toBase58()}`);
  console.log(`Arquivo local fora do git: ${outFile}`);
  console.log("");
  console.log("Configure no api/.env:");
  console.log(`SOLANA_RPC_URL=${rpcUrl}`);
  console.log(`SOLANA_RELAYER_SECRET_KEY='${JSON.stringify(secret)}'`);
  console.log("");
  console.log("Para fundar na devnet:");
  console.log(`solana airdrop 2 ${keypair.publicKey.toBase58()} --url ${rpcUrl}`);

  try {
    const connection = new Connection(rpcUrl, "confirmed");
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`Saldo atual: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.log(`Nao consegui consultar saldo agora: ${error.message}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
