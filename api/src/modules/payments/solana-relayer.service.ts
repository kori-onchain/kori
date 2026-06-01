import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  getMint,
} from '@solana/spl-token';

export type UsdcTransferMetadata = {
  mint: string;
  decimals: number;
  fromWallet: string;
  toWallet: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  amount: number;
  brlCents?: number;
  usdcBrlRate: number;
};

@Injectable()
export class SolanaRelayerService {
  private readonly connection: Connection;
  private readonly rawSecret?: string;
  private readonly usdcMint: PublicKey;
  private readonly usdcBrlRate: number;

  constructor(config: ConfigService) {
    const rpcUrl =
      config.get<string>('SOLANA_RPC_URL') ||
      config.get<string>('SOLANA_DEVNET_RPC_URL') ||
      clusterApiUrl('devnet');
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.rawSecret = config.get<string>('SOLANA_RELAYER_SECRET_KEY');
    this.usdcMint = this.publicKey(
      config.get<string>('USDC_MINT'),
      'Missing or invalid USDC_MINT',
    );
    this.usdcBrlRate = Number(config.get<string>('USDC_BRL_RATE') || '5.20');
  }

  get payerPublicKey() {
    return this.payer().publicKey.toBase58();
  }

  async buildUsdcTransfer(params: {
    fromWallet: string;
    toWallet: string;
    amount?: number;
    brlCents?: number;
  }) {
    if ((params.amount ?? 0) <= 0 && (params.brlCents ?? 0) <= 0) {
      throw new BadRequestException('amount or brlCents must be positive');
    }

    const fromPubkey = this.publicKey(params.fromWallet, 'Invalid sender wallet');
    const toPubkey = this.publicKey(params.toWallet, 'Invalid recipient wallet');
    const tokenProgramId = await this.tokenProgramId();
    const mint = await getMint(
      this.connection,
      this.usdcMint,
      'confirmed',
      tokenProgramId,
    );
    const amount = params.brlCents
      ? this.brlCentsToRawTokenAmount(params.brlCents, mint.decimals)
      : params.amount ?? 0;

    if (amount <= 0) {
      throw new BadRequestException('Converted USDC amount must be positive');
    }
    const fromTokenAccount = getAssociatedTokenAddressSync(
      this.usdcMint,
      fromPubkey,
      true,
      tokenProgramId,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    const toTokenAccount = getAssociatedTokenAddressSync(
      this.usdcMint,
      toPubkey,
      true,
      tokenProgramId,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash('confirmed');

    const transaction = new Transaction({
      feePayer: this.payer().publicKey,
      recentBlockhash: blockhash,
    });

    const recipientTokenAccount = await this.connection.getAccountInfo(
      toTokenAccount,
      'confirmed',
    );
    if (!recipientTokenAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          this.payer().publicKey,
          toTokenAccount,
          toPubkey,
          this.usdcMint,
          tokenProgramId,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      );
    }

    transaction.add(
      createTransferCheckedInstruction(
        fromTokenAccount,
        this.usdcMint,
        toTokenAccount,
        fromPubkey,
        amount,
        mint.decimals,
        [],
        tokenProgramId,
      ),
    );

    const metadata: UsdcTransferMetadata = {
      mint: this.usdcMint.toBase58(),
      decimals: mint.decimals,
      fromWallet: fromPubkey.toBase58(),
      toWallet: toPubkey.toBase58(),
      fromTokenAccount: fromTokenAccount.toBase58(),
      toTokenAccount: toTokenAccount.toBase58(),
      amount,
      brlCents: params.brlCents,
      usdcBrlRate: this.usdcBrlRate,
    };

    return {
      transaction: transaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString('base64'),
      feePayer: this.payer().publicKey.toBase58(),
      ...metadata,
      blockhash,
      lastValidBlockHeight,
      cluster: 'devnet',
    };
  }

  async relaySignedTransaction(
    signedTransaction: string,
    expected?: UsdcTransferMetadata,
  ) {
    const tx = Transaction.from(Buffer.from(signedTransaction, 'base64'));
    if (expected) {
      await this.assertExpectedUsdcTransfer(tx, expected);
    }
    tx.partialSign(this.payer());
    const before = expected ? await this.usdcBalances(expected) : null;

    const signature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    const confirmation = await this.connection.confirmTransaction(
      signature,
      'confirmed',
    );

    if (confirmation.value.err) {
      throw new BadRequestException({
        message: 'Solana transaction failed',
        error: confirmation.value.err,
      });
    }

    const after = expected ? await this.usdcBalances(expected) : null;

    return { signature, mint: expected?.mint, before, after };
  }

  private publicKey(value: string | undefined | null, message: string) {
    try {
      if (!value) throw new Error(message);
      return new PublicKey(value);
    } catch {
      throw new BadRequestException(message);
    }
  }

  private async tokenProgramId() {
    const mintAccount = await this.connection.getAccountInfo(
      this.usdcMint,
      'confirmed',
    );
    if (!mintAccount) {
      throw new BadRequestException('USDC_MINT account not found on devnet');
    }
    if (mintAccount.owner.equals(TOKEN_PROGRAM_ID)) return TOKEN_PROGRAM_ID;
    if (mintAccount.owner.equals(TOKEN_2022_PROGRAM_ID)) {
      return TOKEN_2022_PROGRAM_ID;
    }
    throw new BadRequestException('USDC_MINT is not an SPL token mint');
  }

  private brlCentsToRawTokenAmount(brlCents: number, decimals: number) {
    if (!Number.isFinite(this.usdcBrlRate) || this.usdcBrlRate <= 0) {
      throw new BadRequestException('USDC_BRL_RATE must be positive');
    }

    const brl = brlCents / 100;
    const usdc = brl / this.usdcBrlRate;
    return Math.max(1, Math.round(usdc * 10 ** decimals));
  }

  private async usdcBalances(metadata: UsdcTransferMetadata) {
    return {
      from: await this.tokenAccountAmount(metadata.fromTokenAccount),
      to: await this.tokenAccountAmount(metadata.toTokenAccount),
    };
  }

  private async tokenAccountAmount(address: string) {
    const account = await this.connection.getAccountInfo(
      this.publicKey(address, 'Invalid token account'),
      'confirmed',
    );
    if (!account) return '0';
    return AccountLayout.decode(account.data).amount.toString();
  }

  private async assertExpectedUsdcTransfer(
    tx: Transaction,
    metadata: UsdcTransferMetadata,
  ) {
    const tokenProgramId = await this.tokenProgramId();
    const mint = this.publicKey(metadata.mint, 'Invalid expected mint');
    const source = this.publicKey(
      metadata.fromTokenAccount,
      'Invalid expected source token account',
    );
    const destination = this.publicKey(
      metadata.toTokenAccount,
      'Invalid expected destination token account',
    );

    const transferIx = tx.instructions.find((ix) => {
      const isTokenProgram = ix.programId.equals(tokenProgramId);
      const [sourceMeta, mintMeta, destinationMeta] = ix.keys;
      return (
        isTokenProgram &&
        sourceMeta?.pubkey.equals(source) &&
        mintMeta?.pubkey.equals(mint) &&
        destinationMeta?.pubkey.equals(destination)
      );
    });

    if (!transferIx) {
      throw new BadRequestException(
        `Signed transaction does not transfer expected USDC mint ${metadata.mint}`,
      );
    }
  }

  private payer() {
    if (!this.rawSecret) {
      throw new Error(
        'Missing SOLANA_RELAYER_SECRET_KEY. Set it to a JSON array secret key for a funded devnet payer.',
      );
    }

    try {
      const parsed = JSON.parse(this.rawSecret);
      if (!Array.isArray(parsed)) throw new Error('Expected JSON array');
      return Keypair.fromSecretKey(Uint8Array.from(parsed));
    } catch (error: any) {
      throw new Error(
        `Invalid SOLANA_RELAYER_SECRET_KEY: ${error?.message || error}`,
      );
    }
  }
}
