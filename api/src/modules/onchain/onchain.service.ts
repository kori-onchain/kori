import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BN } from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import {
  CardPurchaseIntentDto,
  CreditLimitIntentDto,
  CreditProfileIntentDto,
  InvoicePaymentIntentDto,
  MerchantRegisterIntentDto,
  ReceivableAdvanceIntentDto,
  ReceivableMintIntentDto,
  SubmitOnchainIntentDto,
} from './dto/onchain.dto';

type ClusterName = 'localnet' | 'devnet';
type AccountMetaInput = {
  pubkey: PublicKey;
  isSigner?: boolean;
  isWritable?: boolean;
};
type KoraIdl = {
  address: string;
  instructions: Array<{ name: string; discriminator: number[] }>;
};

@Injectable()
export class OnchainService {
  private readonly idls: Record<'credit' | 'business' | 'pool', KoraIdl>;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {
    this.idls = {
      credit: this.loadIdl('kora_credit'),
      business: this.loadIdl('kora_business'),
      pool: this.loadIdl('kora_pool'),
    };
  }

  async createCreditProfileIntent(user: any, dto: CreditProfileIntentDto) {
    const borrower = this.pubkey(dto.borrower || user.walletAddress, 'Missing borrower wallet');
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix('credit', 'create_profile', this.u64(dto.creditLimit), [
        this.meta(this.payer().publicKey, true, true),
        this.meta(this.pda(this.creditProgramId(), 'credit_config')),
        this.meta(borrower),
        this.meta(this.pda(this.creditProgramId(), 'credit_profile', borrower), false, true),
        this.meta(SystemProgram.programId),
      ]),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_credit.create_profile',
      referenceType: 'CREDIT_PROFILE',
      referenceId: user.id,
      metadata: { borrower: borrower.toBase58(), creditLimit: dto.creditLimit },
      submitImmediately: dto.submitImmediately,
    });
  }

  async createCreditLimitIntent(user: any, dto: CreditLimitIntentDto) {
    const borrower = this.pubkey(dto.borrower || user.walletAddress, 'Missing borrower wallet');
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix('credit', 'set_credit_limit', this.u64(dto.creditLimit), [
        this.meta(this.payer().publicKey, true),
        this.meta(this.pda(this.creditProgramId(), 'credit_config')),
        this.meta(this.pda(this.creditProgramId(), 'credit_profile', borrower), false, true),
      ]),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_credit.set_credit_limit',
      referenceType: 'CREDIT_LIMIT',
      referenceId: user.id,
      metadata: { borrower: borrower.toBase58(), creditLimit: dto.creditLimit },
      submitImmediately: dto.submitImmediately,
    });
  }

  async createCardPurchaseIntent(user: any, dto: CardPurchaseIntentDto) {
    const borrower = this.pubkey(user.walletAddress, 'Sender account has no walletAddress');
    const referenceId = await this.ensureCardPurchaseReference(user.id, dto);
    const dueDate = dto.dueDate || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix(
        'credit',
        'purchase',
        Buffer.concat([
          this.u64(dto.saleId),
          this.u64(dto.principalAmount),
          this.u64(dto.interestAmount),
          this.i64(dueDate),
        ]),
        [
          this.meta(borrower, true),
          this.meta(this.pda(this.creditProgramId(), 'credit_config')),
          this.meta(this.pda(this.creditProgramId(), 'credit_profile', borrower), false, true),
          this.meta(this.pubkey(dto.merchantWallet, 'Invalid merchant wallet')),
        ],
      ),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_credit.purchase',
      referenceType: 'CARD_TRANSACTION',
      referenceId,
      metadata: { ...dto },
      submitImmediately: dto.submitImmediately,
    });
  }

  async createInvoicePaymentIntent(user: any, dto: InvoicePaymentIntentDto) {
    const invoice = await (this.prisma as any).invoice.findFirst({
      where: { id: dto.invoiceId, userId: user.id },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    const payer = this.pubkey(user.walletAddress, 'Sender account has no walletAddress');
    const creditAuthority = this.pda(this.creditProgramId(), 'credit_authority');
    const saleId = dto.saleId ?? this.numericSaleId(invoice.id);
    const amount = dto.amount ?? Math.max(invoice.totalCents - invoice.paidCents, 0);
    if (amount <= 0) throw new BadRequestException('Invoice has no pending amount');
    const poolVaultUsdc = this.pubkey(dto.poolVaultUsdc || this.required('POOL_VAULT_USDC'), 'Missing pool vault USDC');
    const payerUsdc = dto.payerUsdc
      ? this.pubkey(dto.payerUsdc, 'Invalid payer USDC')
      : this.ata(this.usdcMint(), payer);
    const merchantUsdc = dto.merchantUsdc
      ? this.pubkey(dto.merchantUsdc, 'Invalid merchant USDC')
      : this.pubkey(this.required('MERCHANT_USDC'), 'Missing merchant USDC');
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix(
        'credit',
        'pay_invoice',
        Buffer.concat([this.u64(saleId), this.u64(amount)]),
        [
          this.meta(payer, true, true),
          this.meta(this.pda(this.creditProgramId(), 'credit_config')),
          this.meta(creditAuthority),
          this.meta(this.pda(this.creditProgramId(), 'credit_profile', payer), false, true),
          this.meta(payerUsdc, false, true),
          this.meta(merchantUsdc, false, true),
          this.meta(this.usdcMint()),
          this.meta(this.pubkey(dto.receivableRecord || this.required('RECEIVABLE_RECORD'), 'Missing receivable record')),
          this.meta(this.pda(this.poolProgramId(), 'pool_config'), false, true),
          this.meta(this.pda(this.poolProgramId(), 'liquidity_vault')),
          this.meta(poolVaultUsdc, false, true),
          this.meta(this.pda(this.poolProgramId(), 'authorized_caller', creditAuthority)),
          this.meta(this.poolProgramId()),
          this.meta(TOKEN_PROGRAM_ID),
        ],
      ),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_credit.pay_invoice',
      referenceType: 'INVOICE',
      referenceId: invoice.id,
      metadata: { ...dto, saleId, amount, payerUsdc: payerUsdc.toBase58(), merchantUsdc: merchantUsdc.toBase58() },
      submitImmediately: dto.submitImmediately,
    });
  }

  async createMerchantRegisterIntent(user: any, dto: MerchantRegisterIntentDto) {
    const merchant = this.pubkey(user.walletAddress, 'Merchant account has no walletAddress');
    const store = await this.findStore(user, dto.storeId);
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix('business', 'register_merchant', Buffer.alloc(0), [
        this.meta(merchant, true, true),
        this.meta(this.pda(this.businessProgramId(), 'business_config')),
        this.meta(merchant),
        this.meta(this.pubkey(dto.settlementUsdc, 'Invalid settlement USDC')),
        this.meta(this.pda(this.businessProgramId(), 'merchant_profile', merchant), false, true),
        this.meta(SystemProgram.programId),
      ]),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_business.register_merchant',
      referenceType: 'STORE',
      referenceId: store.id,
      metadata: { ...dto, merchant: merchant.toBase58() },
      submitImmediately: dto.submitImmediately,
    });
  }

  async createReceivableMintIntent(user: any, dto: ReceivableMintIntentDto) {
    const receivable = await this.findReceivable(user, dto.receivableId);
    const merchant = this.pubkey(user.walletAddress, 'Merchant account has no walletAddress');
    const saleId = dto.saleId ?? this.numericSaleId(receivable.saleId);
    const assetId = this.bytes32(dto.assetId || this.hash32(receivable.id));
    const receivableId = this.bytes32(this.hash32(receivable.id));
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix(
        'business',
        'mint_receivable_cnft',
        Buffer.concat([
          this.u64(saleId),
          this.u64(receivable.grossAmountCents),
          this.u64(receivable.netAmountCents),
          this.i64(Math.floor(new Date(receivable.dueDate).getTime() / 1000)),
          this.string(dto.metadataUri),
          assetId,
        ]),
        [
          this.meta(merchant, true, true),
          this.meta(this.pda(this.businessProgramId(), 'business_config')),
          this.meta(this.pda(this.businessProgramId(), 'business_authority')),
          this.meta(merchant),
          this.meta(this.pda(this.businessProgramId(), 'merchant_profile', merchant)),
          this.meta(this.requiredPubkey('TREE_CONFIG')),
          this.meta(this.requiredPubkey('MERKLE_TREE'), false, true),
          this.meta(this.requiredPubkey('BUBBLEGUM_PROGRAM_ID')),
          this.meta(this.requiredPubkey('LOG_WRAPPER_PROGRAM_ID')),
          this.meta(this.requiredPubkey('COMPRESSION_PROGRAM_ID')),
          this.meta(this.requiredPubkey('MPL_CORE_PROGRAM_ID')),
          this.meta(this.pda(this.businessProgramId(), 'receivable_cnft', merchant, this.u64(saleId)), false, true),
          this.meta(SystemProgram.programId),
        ],
      ),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_business.mint_receivable_cnft',
      referenceType: 'RECEIVABLE_MINT',
      referenceId: receivable.id,
      metadata: {
        ...dto,
        saleId,
        receivableId: Buffer.from(receivableId).toString('hex'),
        assetId: Buffer.from(assetId).toString('hex'),
      },
      submitImmediately: dto.submitImmediately,
    });
  }

  async createReceivableAdvanceIntent(user: any, dto: ReceivableAdvanceIntentDto) {
    const receivable = await this.findReceivable(user, dto.receivableId);
    const merchant = this.pubkey(user.walletAddress, 'Merchant account has no walletAddress');
    const businessAuthority = this.pda(this.businessProgramId(), 'business_authority');
    const tx = await this.transaction(dto.cluster);
    tx.add(
      this.ix(
        'business',
        'anticipate_cnft',
        Buffer.concat([
          this.bytes32(dto.root || this.envBytes32('ONCHAIN_DUMMY_ROOT')),
          this.bytes32(dto.dataHash || this.envBytes32('ONCHAIN_DUMMY_DATA_HASH')),
          this.bytes32(dto.creatorHash || this.envBytes32('ONCHAIN_DUMMY_CREATOR_HASH')),
          this.bytes32(dto.assetDataHash || this.envBytes32('ONCHAIN_DUMMY_ASSET_DATA_HASH')),
          this.u64(dto.nonce ?? Number(this.config.get<string>('ONCHAIN_DUMMY_NONCE') || 0)),
          this.u32(dto.index ?? Number(this.config.get<string>('ONCHAIN_DUMMY_INDEX') || 0)),
          Buffer.from([dto.flags]),
        ]),
        [
          this.meta(merchant, true, true),
          this.meta(this.pda(this.businessProgramId(), 'business_config')),
          this.meta(businessAuthority),
          this.meta(this.pda(this.businessProgramId(), 'receivable_cnft', merchant, this.u64(this.numericSaleId(receivable.saleId))), false, true),
          this.meta(this.requiredPubkey('TREE_CONFIG')),
          this.meta(this.requiredPubkey('MERKLE_TREE'), false, true),
          this.meta(this.requiredPubkey('POOL_BENEFICIARY')),
          this.meta(this.requiredPubkey('BUBBLEGUM_PROGRAM_ID')),
          this.meta(this.requiredPubkey('LOG_WRAPPER_PROGRAM_ID')),
          this.meta(this.requiredPubkey('COMPRESSION_PROGRAM_ID')),
          this.meta(dto.merchantUsdc ? this.pubkey(dto.merchantUsdc, 'Invalid merchant USDC') : this.ata(this.usdcMint(), merchant), false, true),
          this.meta(this.usdcMint()),
          this.meta(this.pda(this.poolProgramId(), 'pool_config'), false, true),
          this.meta(this.pda(this.poolProgramId(), 'pool_authority')),
          this.meta(this.pda(this.poolProgramId(), 'liquidity_vault')),
          this.meta(this.pubkey(dto.poolVaultUsdc || this.required('POOL_VAULT_USDC'), 'Missing pool vault USDC'), false, true),
          this.meta(this.pda(this.poolProgramId(), 'authorized_caller', businessAuthority)),
          this.meta(this.poolProgramId()),
          this.meta(TOKEN_PROGRAM_ID),
          this.meta(SystemProgram.programId),
        ],
      ),
    );

    return this.persistIntent(user.id, tx, {
      cluster: this.cluster(dto.cluster),
      instruction: 'kora_business.anticipate_cnft',
      referenceType: 'RECEIVABLE_ADVANCE',
      referenceId: receivable.id,
      metadata: { ...dto },
      submitImmediately: dto.submitImmediately,
    });
  }

  async submit(user: any, dto: SubmitOnchainIntentDto) {
    const intent = await (this.prisma as any).onchainIntent.findFirst({
      where: { id: dto.intentId, userId: user.id },
    });
    if (!intent) throw new NotFoundException('Onchain intent not found');
    if (!['PENDING_SIGNATURE', 'SUBMITTED'].includes(intent.status)) {
      throw new BadRequestException('Onchain intent is not awaiting submission');
    }
    return this.relayAndConfirm(intent, dto.signedTransaction);
  }

  async status() {
    const cluster = this.cluster(undefined);
    const connection = this.connection(cluster);
    const payer = this.payer();
    const requiredEnv = this.requiredEnvReport([
      'SOLANA_RELAYER_SECRET_KEY',
      'USDC_MINT',
      'POOL_VAULT_USDC',
      'MERKLE_TREE',
      'TREE_CONFIG',
      'POOL_BENEFICIARY',
      'BUBBLEGUM_PROGRAM_ID',
      'COMPRESSION_PROGRAM_ID',
      'LOG_WRAPPER_PROGRAM_ID',
      'MPL_CORE_PROGRAM_ID',
    ]);
    const optionalEnv = this.requiredEnvReport([
      'MERCHANT_USDC',
      'RECEIVABLE_RECORD',
      'ONCHAIN_DUMMY_ROOT',
      'ONCHAIN_DUMMY_DATA_HASH',
      'ONCHAIN_DUMMY_CREATOR_HASH',
      'ONCHAIN_DUMMY_ASSET_DATA_HASH',
    ]);
    const poolVault = this.optionalPubkey('POOL_VAULT_USDC');
    const usdcMint = this.optionalPubkey('USDC_MINT');
    const pdaStatus = await Promise.all([
      this.exists(connection, this.pda(this.poolProgramId(), 'pool_config')),
      this.exists(connection, this.pda(this.businessProgramId(), 'business_config')),
      this.exists(connection, this.pda(this.creditProgramId(), 'credit_config')),
      poolVault ? this.exists(connection, poolVault) : Promise.resolve(false),
      usdcMint ? this.exists(connection, usdcMint) : Promise.resolve(false),
    ]);
    const balance = await connection.getBalance(payer.publicKey).catch(() => 0);

    return {
      cluster,
      rpcUrl: this.rpcUrl(cluster),
      payer: payer.publicKey.toBase58(),
      payerSol: balance / LAMPORTS_PER_SOL,
      programs: {
        pool: this.poolProgramId().toBase58(),
        business: this.businessProgramId().toBase58(),
        credit: this.creditProgramId().toBase58(),
      },
      pdas: {
        poolConfigExists: pdaStatus[0],
        businessConfigExists: pdaStatus[1],
        creditConfigExists: pdaStatus[2],
        poolVaultUsdcExists: pdaStatus[3],
        usdcMintExists: pdaStatus[4],
      },
      env: {
        required: requiredEnv,
        optionalForDemoFallbacks: optionalEnv,
      },
    };
  }

  private async persistIntent(
    userId: string,
    tx: Transaction,
    params: {
      cluster: ClusterName;
      instruction: string;
      referenceType: string;
      referenceId: string;
      metadata: Record<string, unknown>;
      submitImmediately?: boolean;
    },
  ) {
    tx.partialSign(this.payer());
    const unsignedTransaction = tx
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString('base64');
    const intent = await (this.prisma as any).onchainIntent.create({
      data: {
        userId,
        referenceType: params.referenceType,
        referenceId: params.referenceId,
        instruction: params.instruction,
        cluster: params.cluster,
        status: 'PENDING_SIGNATURE',
        unsignedTransaction,
        metadata: params.metadata,
      },
    });

    if (params.submitImmediately) {
      return this.relayAndConfirm(intent, unsignedTransaction);
    }

    return {
      intentId: intent.id,
      transaction: unsignedTransaction,
      cluster: params.cluster,
      feePayer: this.payer().publicKey.toBase58(),
      instruction: params.instruction,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      status: intent.status,
    };
  }

  private async relayAndConfirm(intent: any, signedTransaction: string) {
    const connection = this.connection(intent.cluster as ClusterName);
    await (this.prisma as any).onchainIntent.update({
      where: { id: intent.id },
      data: { status: 'SUBMITTED', error: null },
    });

    try {
      const tx = Transaction.from(Buffer.from(signedTransaction, 'base64'));
      tx.partialSign(this.payer());
      const signature = await connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      if (confirmation.value.err) {
        throw new Error(JSON.stringify(confirmation.value.err));
      }
      const updated = await (this.prisma as any).onchainIntent.update({
        where: { id: intent.id },
        data: {
          status: 'CONFIRMED',
          txHash: signature,
          error: null,
        },
      });
      await this.applyConfirmation(updated, signature);
      return { ...updated, txHash: signature, programStatus: 'CONFIRMED' };
    } catch (error: any) {
      const updated = await (this.prisma as any).onchainIntent.update({
        where: { id: intent.id },
        data: {
          status: 'FAILED',
          error: error?.message || String(error),
        },
      });
      await this.applyFailure(updated, error?.message || String(error));
      throw new BadRequestException({
        message: 'Onchain transaction failed',
        error: updated.error,
        intentId: intent.id,
      });
    }
  }

  private async applyConfirmation(intent: any, txHash: string) {
    if (intent.referenceType === 'CARD_TRANSACTION') {
      await (this.prisma as any).cardTransaction.updateMany({
        where: { id: intent.referenceId, userId: intent.userId },
        data: { txHash, programStatus: 'CONFIRMED' },
      });
      await (this.prisma as any).installment.updateMany({
        where: { cardTransactionId: intent.referenceId, userId: intent.userId },
        data: { txHash, programStatus: 'CONFIRMED' },
      });
    }

    if (intent.referenceType === 'INVOICE') {
      await this.payInvoiceOffchain(intent.userId, intent.referenceId, txHash);
    }

    if (intent.referenceType === 'RECEIVABLE_MINT') {
      const metadata = intent.metadata || {};
      await (this.prisma as any).receivable.update({
        where: { id: intent.referenceId },
        data: {
          txHash,
          programStatus: 'CONFIRMED',
          receivableId: metadata.receivableId,
          assetId: metadata.assetId,
        },
      });
    }

    if (intent.referenceType === 'RECEIVABLE_ADVANCE') {
      await this.advanceReceivableOffchain(intent.userId, intent.referenceId, txHash);
    }

    if (intent.referenceType === 'CREDIT_PROFILE' || intent.referenceType === 'CREDIT_LIMIT') {
      const metadata = intent.metadata || {};
      await (this.prisma as any).creditProfile.upsert({
        where: { userId: intent.userId },
        create: {
          userId: intent.userId,
          creditLimitCents: metadata.creditLimit || 0,
          lockedLimitCents: 0,
          score: 650,
        },
        update: { creditLimitCents: metadata.creditLimit || 0 },
      });
    }
  }

  private async applyFailure(intent: any, error: string) {
    const data = { programStatus: `FAILED: ${error}`.slice(0, 190) };
    if (intent.referenceType === 'CARD_TRANSACTION') {
      await (this.prisma as any).cardTransaction.updateMany({
        where: { id: intent.referenceId, userId: intent.userId },
        data,
      });
    }
    if (intent.referenceType === 'RECEIVABLE_MINT' || intent.referenceType === 'RECEIVABLE_ADVANCE') {
      await (this.prisma as any).receivable.updateMany({
        where: { id: intent.referenceId },
        data,
      });
    }
  }

  private async payInvoiceOffchain(userId: string, invoiceId: string, txHash: string) {
    const invoice = await (this.prisma as any).invoice.findFirst({
      where: { id: invoiceId, userId },
    });
    if (!invoice || invoice.status === 'PAID') return;
    const remaining = invoice.totalCents - invoice.paidCents;
    if (remaining <= 0) return;

    const payment = await (this.prisma as any).$transaction(async (tx: any) => {
      const created = await tx.payment.create({
        data: {
          userId,
          invoiceId,
          amountCents: remaining,
          currency: 'USDC',
          method: 'SOLANA_WALLET',
          status: 'COMPLETED',
          txHash,
          programStatus: 'CONFIRMED',
        },
      });
      await tx.installment.updateMany({
        where: { invoiceId, userId, status: 'OPEN' },
        data: { status: 'PAID', txHash, programStatus: 'CONFIRMED' },
      });
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { paidCents: invoice.totalCents, status: 'PAID' },
      });
      return created;
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'USER_BALANCE',
      currency: 'USDC',
      direction: 'DEBIT',
      amountCents: remaining,
      referenceType: 'ONCHAIN_INVOICE_PAYMENT',
      referenceId: payment.id,
      description: `Pagamento on-chain de fatura ${invoice.cycleMonth}`,
    });
  }

  private async advanceReceivableOffchain(userId: string, receivableId: string, txHash: string) {
    const receivable = await (this.prisma as any).receivable.findFirst({
      where: { id: receivableId },
      include: { store: true, advance: true },
    });
    if (!receivable || receivable.advance) return;
    const protocol = `ANT-${new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    const advance = await (this.prisma as any).$transaction(async (tx: any) => {
      await tx.receivable.update({
        where: { id: receivable.id },
        data: { status: 'ANTICIPATED', txHash, programStatus: 'CONFIRMED' },
      });
      return tx.receivableAdvance.create({
        data: {
          storeId: receivable.storeId,
          receivableId: receivable.id,
          grossCents: receivable.grossAmountCents,
          netCents: receivable.netAmountCents,
          feeCents: receivable.grossAmountCents - receivable.netAmountCents,
          protocol,
          txHash,
          programStatus: 'CONFIRMED',
        },
      });
    });
    await this.ledger.postEntry({
      userId,
      accountType: 'MERCHANT_BALANCE',
      currency: 'USDC',
      direction: 'CREDIT',
      amountCents: advance.netCents,
      referenceType: 'ONCHAIN_RECEIVABLE_ADVANCE',
      referenceId: advance.id,
      description: `Antecipacao on-chain ${protocol}`,
    });
  }

  private async ensureCardPurchaseReference(userId: string, dto: CardPurchaseIntentDto) {
    if (dto.cardTransactionId) {
      const transaction = await (this.prisma as any).cardTransaction.findFirst({
        where: { id: dto.cardTransactionId, userId },
      });
      if (!transaction) throw new NotFoundException('Card transaction not found');
      return transaction.id;
    }
    if (dto.cardId) {
      const card = await (this.prisma as any).card.findFirst({
        where: { id: dto.cardId, userId },
      });
      if (!card) throw new NotFoundException('Card not found');
      return card.id;
    }
    throw new BadRequestException('cardTransactionId or cardId is required');
  }

  private async findStore(user: any, storeId?: string) {
    if (user.accountType !== 'PJ') throw new BadRequestException('PJ account required');
    const store = await (this.prisma as any).store.findFirst({
      where: { ownerUserId: user.id, ...(storeId ? { id: storeId } : {}) },
      orderBy: { createdAt: 'asc' },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  private async findReceivable(user: any, receivableId: string) {
    const store = await this.findStore(user);
    const receivable = await (this.prisma as any).receivable.findFirst({
      where: { id: receivableId, storeId: store.id },
      include: { sale: true },
    });
    if (!receivable) throw new NotFoundException('Receivable not found');
    return receivable;
  }

  private async transaction(cluster?: ClusterName) {
    const connection = this.connection(this.cluster(cluster));
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    const tx = new Transaction({
      feePayer: this.payer().publicKey,
      recentBlockhash: blockhash,
    });
    tx.lastValidBlockHeight = lastValidBlockHeight;
    return tx;
  }

  private ix(program: 'credit' | 'business' | 'pool', name: string, data: Buffer, accounts: AccountMetaInput[]) {
    const discriminator = this.idls[program].instructions.find((ix) => ix.name === name)?.discriminator;
    if (!discriminator) throw new Error(`Instruction ${program}.${name} not found in IDL`);
    return new TransactionInstruction({
      programId:
        program === 'credit'
          ? this.creditProgramId()
          : program === 'business'
            ? this.businessProgramId()
            : this.poolProgramId(),
      keys: accounts.map((account) => ({
        pubkey: account.pubkey,
        isSigner: Boolean(account.isSigner),
        isWritable: Boolean(account.isWritable),
      })),
      data: Buffer.concat([Buffer.from(discriminator), data]),
    });
  }

  private meta(pubkey: PublicKey, isSigner = false, isWritable = false): AccountMetaInput {
    return { pubkey, isSigner, isWritable };
  }

  private u64(value: number | string | BN) {
    return this.bn(value, 8);
  }

  private i64(value: number | string | BN) {
    return this.bn(value, 8);
  }

  private u32(value: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(value, 0);
    return buffer;
  }

  private string(value: string) {
    const raw = Buffer.from(value, 'utf8');
    return Buffer.concat([this.u32(raw.length), raw]);
  }

  private bn(value: number | string | BN, bytes: number) {
    const bn = BN.isBN(value) ? value : new BN(value);
    return bn.toArrayLike(Buffer, 'le', bytes);
  }

  private bytes32(value: string | Buffer) {
    if (Buffer.isBuffer(value)) {
      if (value.length !== 32) throw new BadRequestException('Expected 32 bytes');
      return value;
    }
    const clean = value.replace(/^0x/, '');
    const buffer =
      /^[0-9a-fA-F]{64}$/.test(clean) ? Buffer.from(clean, 'hex') : Buffer.from(value, 'base64');
    if (buffer.length !== 32) throw new BadRequestException('Expected 32-byte hex or base64 value');
    return buffer;
  }

  private hash32(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private pda(programId: PublicKey, seed: string, ...extraSeeds: Array<PublicKey | Buffer>) {
    const seeds = [Buffer.from(seed), ...extraSeeds.map((value) => (value instanceof PublicKey ? value.toBuffer() : value))];
    return PublicKey.findProgramAddressSync(seeds, programId)[0];
  }

  private numericSaleId(value: string) {
    const hex = createHash('sha256').update(value).digest('hex').slice(0, 12);
    return Number.parseInt(hex, 16);
  }

  private async exists(connection: Connection, pubkey: PublicKey) {
    return Boolean(await connection.getAccountInfo(pubkey).catch(() => null));
  }

  private connection(cluster: ClusterName) {
    return new Connection(this.rpcUrl(cluster), 'confirmed');
  }

  private rpcUrl(cluster: ClusterName) {
    if (cluster === 'localnet') {
      return this.config.get<string>('SOLANA_LOCALNET_RPC_URL') || 'http://127.0.0.1:8899';
    }
    return this.config.get<string>('SOLANA_DEVNET_RPC_URL') || clusterApiUrl('devnet');
  }

  private cluster(value?: ClusterName): ClusterName {
    const configured = this.config.get<string>('SOLANA_CLUSTER') as ClusterName | undefined;
    return value || configured || 'localnet';
  }

  private poolProgramId() {
    return this.programEnv('KORA_POOL_PROGRAM_ID', this.idls.pool.address);
  }

  private businessProgramId() {
    return this.programEnv('KORA_BUSINESS_PROGRAM_ID', this.idls.business.address);
  }

  private creditProgramId() {
    return this.programEnv('KORA_CREDIT_PROGRAM_ID', this.idls.credit.address);
  }

  private usdcMint() {
    return this.requiredPubkey('USDC_MINT');
  }

  private ata(mint: PublicKey, owner: PublicKey) {
    return getAssociatedTokenAddressSync(mint, owner, true, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
  }

  private programEnv(name: string, fallback: string) {
    const configured = this.config.get<string>(name);
    try {
      return new PublicKey(configured || fallback);
    } catch {
      return new PublicKey(fallback);
    }
  }

  private requiredPubkey(name: string) {
    return this.pubkey(this.required(name), `Invalid ${name}`);
  }

  private optionalPubkey(name: string) {
    const value = this.config.get<string>(name);
    if (!value) return null;
    return this.pubkey(value, `Invalid ${name}`);
  }

  private envBytes32(name: string) {
    return this.required(name);
  }

  private requiredEnvReport(names: string[]) {
    return names.map((name) => ({
      name,
      configured: Boolean(this.config.get<string>(name)),
    }));
  }

  private required(name: string) {
    const value = this.config.get<string>(name);
    if (!value) throw new BadRequestException(`Missing ${name}`);
    return value;
  }

  private pubkey(value: string | undefined | null, message: string) {
    if (!value) throw new BadRequestException(message);
    try {
      return new PublicKey(value);
    } catch {
      throw new BadRequestException(message);
    }
  }

  private payer() {
    const raw = this.config.get<string>('SOLANA_RELAYER_SECRET_KEY');
    if (!raw) {
      throw new BadRequestException('Missing SOLANA_RELAYER_SECRET_KEY');
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Expected JSON array');
      return Keypair.fromSecretKey(Uint8Array.from(parsed));
    } catch (error: any) {
      throw new BadRequestException(`Invalid SOLANA_RELAYER_SECRET_KEY: ${error?.message || error}`);
    }
  }

  private loadIdl(name: string): KoraIdl {
    const candidates = [
      resolve(process.cwd(), '..', 'programs', 'target', 'idl', `${name}.json`),
      resolve(process.cwd(), 'programs', 'target', 'idl', `${name}.json`),
      join(__dirname, '..', '..', '..', '..', 'programs', 'target', 'idl', `${name}.json`),
    ];
    const file = candidates.find((candidate) => existsSync(candidate));
    if (!file) throw new Error(`IDL not found for ${name}`);
    return JSON.parse(readFileSync(file, 'utf8')) as KoraIdl;
  }
}
