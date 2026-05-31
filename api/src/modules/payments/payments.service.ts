import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import {
  CreateSolanaTransferIntentDto,
  SubmitSolanaTransferDto,
  TransferDto,
} from './dto/transfer.dto';
import { SolanaRelayerService } from './solana-relayer.service';

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
    const solanaIntent = await this.solana.buildTransfer({
      fromWallet: user.walletAddress,
      toWallet: resolvedRecipient.walletAddress,
      lamports: dto.lamports,
    });

    const payment = await (this.prisma as any).payment.create({
      data: {
        userId: user.id,
        amountCents: dto.lamports,
        currency: 'SOL',
        method:
          dto.recipientType === 'username' ? 'KORA_USERNAME' : 'SOLANA_WALLET',
        status: 'PENDING',
        recipientType: dto.recipientType,
        recipientId: dto.anonymous
          ? this.maskWallet(resolvedRecipient.walletAddress)
          : resolvedRecipient.identifier,
        programStatus: 'AWAITING_USER_SIGNATURE',
      },
    });

    return {
      paymentId: payment.id,
      ...solanaIntent,
      recipient: dto.anonymous
        ? { type: 'wallet', walletAddress: this.maskWallet(resolvedRecipient.walletAddress) }
        : resolvedRecipient,
      instructions: 'Client must sign the base64 transaction with the sender wallet, then POST it to /payments/solana/submit.',
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

    const { signature } = await this.solana.relaySignedTransaction(
      dto.signedTransaction,
    );

    const updated = await (this.prisma as any).payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        txHash: signature,
        programStatus: 'CONFIRMED',
      },
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'USER_BALANCE',
      currency: 'SOL',
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
}
