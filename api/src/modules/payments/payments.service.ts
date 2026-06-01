import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import {
  CreateSolanaTransferIntentDto,
  SubmitSolanaTransferDto,
  TransferDto,
} from './dto/transfer.dto';
import {
  SolanaRelayerService,
  UsdcTransferMetadata,
} from './solana-relayer.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
    private readonly solana: SolanaRelayerService,
  ) {}

  async transfer(userId: string, dto: TransferDto) {
    if (dto.recipientType === 'pix') {
      throw new BadRequestException('Pix is planned but not enabled yet');
    }

    const method =
      dto.recipientType === 'username' ? 'KORA_USERNAME' : 'INTERNAL_LEDGER';
    const payment = await (this.prisma as any).payment.create({
      data: {
        userId,
        amountCents: dto.amountCents,
        currency: dto.currency,
        method,
        status: 'COMPLETED',
        recipientType: dto.recipientType,
        recipientId: dto.recipientId,
        txHash: dto.txHash,
        programStatus: dto.programStatus,
      },
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'USER_BALANCE',
      currency: dto.currency,
      direction: 'DEBIT',
      amountCents: dto.amountCents,
      referenceType: 'PAYMENT',
      referenceId: payment.id,
      description: `Transferência para ${dto.recipientId}`,
    });

    return payment;
  }

  async createSolanaIntent(user: any, dto: CreateSolanaTransferIntentDto) {
    if (!user.walletAddress) {
      throw new BadRequestException('Sender account has no walletAddress');
    }

    const resolvedRecipient = await this.resolveRecipient(dto);
    const solanaIntent = await this.solana.buildUsdcTransfer({
      fromWallet: user.walletAddress,
      toWallet: resolvedRecipient.walletAddress,
      amount: dto.amountCents ? undefined : dto.lamports,
      brlCents: dto.amountCents,
    });
    const amountCents =
      dto.amountCents ??
      Math.round((solanaIntent.amount / 10 ** solanaIntent.decimals) * 100);
    const currency = dto.amountCents ? 'BRL' : 'USDC';

    const payment = await (this.prisma as any).payment.create({
      data: {
        userId: user.id,
        amountCents,
        currency,
        method:
          dto.recipientType === 'username' ? 'KORA_USERNAME' : 'SOLANA_WALLET',
        status: 'PENDING',
        recipientType: dto.recipientType,
        recipientId: dto.anonymous
          ? this.maskWallet(resolvedRecipient.walletAddress)
          : resolvedRecipient.identifier,
        programStatus: this.encodeSolanaMetadata(solanaIntent),
      },
    });

    return {
      paymentId: payment.id,
      ...solanaIntent,
      recipient: dto.anonymous
        ? { type: 'wallet', walletAddress: this.maskWallet(resolvedRecipient.walletAddress) }
        : resolvedRecipient,
      instructions: 'Client signs the USDC transfer with the sender wallet. Relayer pays devnet SOL fees when submitted.',
    };
  }

  async submitSolanaTransfer(userId: string, dto: SubmitSolanaTransferDto) {
    const payment = await (this.prisma as any).payment.findFirst({
      where: { id: dto.paymentId, userId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Payment is not awaiting submission');
    }

    const metadata = this.decodeSolanaMetadata(payment.programStatus);
    const relay = await this.solana.relaySignedTransaction(
      dto.signedTransaction,
      metadata,
    );
    const { signature } = relay;

    const updated = await (this.prisma as any).payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        txHash: signature,
        programStatus: this.encodeSolanaMetadata({
          ...metadata,
          status: 'CONFIRMED',
          signature,
          before: relay.before,
          after: relay.after,
        }),
      },
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'USER_BALANCE',
      currency: payment.currency,
      direction: 'DEBIT',
      amountCents: payment.amountCents,
      referenceType: 'SOLANA_PAYMENT',
      referenceId: payment.id,
      description: `Solana devnet transfer ${signature}`,
    });

    return updated;
  }

  findOne(userId: string, id: string) {
    return this.ledger.findPaymentForUser(userId, id);
  }

  private async resolveRecipient(dto: CreateSolanaTransferIntentDto) {
    if (dto.recipientType === 'wallet') {
      return {
        type: 'wallet',
        identifier: dto.recipient,
        walletAddress: dto.recipient,
      };
    }

    const username = dto.recipient.replace(/^@/, '');
    const user = await (this.prisma as any).user.findUnique({
      where: { username },
    });
    if (!user?.walletAddress) {
      throw new NotFoundException('Username does not resolve to a wallet');
    }

    return {
      type: 'username',
      identifier: `@${username}`,
      userId: user.id,
      walletAddress: user.walletAddress,
    };
  }

  private maskWallet(wallet: string) {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  }

  private encodeSolanaMetadata(metadata: Record<string, unknown>) {
    return JSON.stringify({
      status: metadata.status || 'AWAITING_USER_SIGNATURE',
      mint: metadata.mint,
      decimals: metadata.decimals,
      fromWallet: metadata.fromWallet,
      toWallet: metadata.toWallet,
      fromTokenAccount: metadata.fromTokenAccount,
      toTokenAccount: metadata.toTokenAccount,
      amount: metadata.amount,
      brlCents: metadata.brlCents,
      usdcBrlRate: metadata.usdcBrlRate,
      signature: metadata.signature,
      before: metadata.before,
      after: metadata.after,
    });
  }

  private decodeSolanaMetadata(value?: string | null): UsdcTransferMetadata {
    if (!value) {
      throw new BadRequestException('Payment is missing Solana metadata');
    }

    try {
      const parsed = JSON.parse(value);
      if (!parsed.mint || !parsed.fromTokenAccount || !parsed.toTokenAccount) {
        throw new Error('Missing token metadata');
      }
      return parsed as UsdcTransferMetadata;
    } catch {
      throw new BadRequestException('Payment has invalid Solana metadata');
    }
  }
}
