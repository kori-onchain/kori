import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';

@Injectable()
export class SolanaRelayerService {
  private readonly connection: Connection;
  private readonly rawSecret?: string;

  constructor(config: ConfigService) {
    const rpcUrl =
      config.get<string>('SOLANA_RPC_URL') || clusterApiUrl('devnet');
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.rawSecret = config.get<string>('SOLANA_RELAYER_SECRET_KEY');
  }

  get payerPublicKey() {
    return this.payer().publicKey.toBase58();
  }

  async buildTransfer(params: {
    fromWallet: string;
    toWallet: string;
    lamports: number;
  }) {
    if (params.lamports <= 0) {
      throw new BadRequestException('lamports must be positive');
    }

    const fromPubkey = this.publicKey(params.fromWallet, 'Invalid sender wallet');
    const toPubkey = this.publicKey(params.toWallet, 'Invalid recipient wallet');
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash('confirmed');

    const transaction = new Transaction({
      feePayer: this.payer().publicKey,
      recentBlockhash: blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: params.lamports,
      }),
    );

    return {
      transaction: transaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString('base64'),
      feePayer: this.payer().publicKey.toBase58(),
      fromWallet: fromPubkey.toBase58(),
      toWallet: toPubkey.toBase58(),
      lamports: params.lamports,
      sol: params.lamports / LAMPORTS_PER_SOL,
      blockhash,
      lastValidBlockHeight,
      cluster: 'devnet',
    };
  }

  async relaySignedTransaction(signedTransaction: string) {
    const tx = Transaction.from(Buffer.from(signedTransaction, 'base64'));
    tx.partialSign(this.payer());

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

    return { signature };
  }

  private publicKey(value: string, message: string) {
    try {
      return new PublicKey(value);
    } catch {
      throw new BadRequestException(message);
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
