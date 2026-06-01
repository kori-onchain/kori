import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateProductDto, CreateSaleDto, UpdateProductDto } from './dto/merchant.dto';

@Injectable()
export class MerchantService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureStore(user: any) {
    if (user.accountType !== 'PJ') {
      throw new BadRequestException('Merchant endpoints require a PJ account');
    }
    const store = await (this.prisma as any).store.findFirst({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'asc' },
    });
    if (store) return store;

    return (this.prisma as any).store.create({
      data: {
        ownerUserId: user.id,
        name: user.name,
        slug: this.slugify(user.username || user.name),
        settlementWallet: user.walletAddress,
      },
    });
  }

  async listProducts(user: any) {
    const store = await this.ensureStore(user);
    return (this.prisma as any).product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProduct(user: any, dto: CreateProductDto) {
    const store = await this.ensureStore(user);
    return (this.prisma as any).product.create({
      data: {
        storeId: store.id,
        ...dto,
      },
    });
  }

  async updateProduct(user: any, id: string, dto: UpdateProductDto) {
    const store = await this.ensureStore(user);
    const product = await this.findProduct(store.id, id);
    return (this.prisma as any).product.update({
      where: { id: product.id },
      data: dto,
    });
  }

  async deleteProduct(user: any, id: string) {
    const store = await this.ensureStore(user);
    const product = await this.findProduct(store.id, id);
    await (this.prisma as any).product.delete({ where: { id: product.id } });
    return { deleted: true };
  }

  async listSales(user: any) {
    const store = await this.ensureStore(user);
    return (this.prisma as any).sale.findMany({
      where: { storeId: store.id },
      include: { items: true, receivable: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSale(user: any, dto: CreateSaleDto) {
    const store = await this.ensureStore(user);
    const amountCents = dto.items.reduce(
      (sum, item) => sum + item.priceCents * item.qty,
      0,
    );
    const netAmountCents = Math.floor(amountCents * 0.97);
    const feeBps = Math.floor(((amountCents - netAmountCents) * 10_000) / amountCents);
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (this.prisma as any).$transaction(async (tx: any) => {
      const sale = await tx.sale.create({
        data: {
          storeId: store.id,
          buyerUserId: dto.buyerUserId,
          buyerName: dto.buyerName,
          amountCents,
          status: 'PAID',
          txHash: dto.txHash,
          programStatus: dto.programStatus,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              qty: item.qty,
              priceCents: item.priceCents,
            })),
          },
        },
        include: { items: true },
      });

      const receivable = await tx.receivable.create({
        data: {
          storeId: store.id,
          saleId: sale.id,
          description: `Venda ${sale.id}`,
          grossAmountCents: amountCents,
          netAmountCents,
          feeBps,
          installmentsCount: dto.installmentsCount,
          dueDate,
          status: 'REGISTERED',
          txHash: dto.txHash,
          programStatus: dto.programStatus,
        },
      });

      return { ...sale, receivable };
    });
  }

  private async findProduct(storeId: string, id: string) {
    const product = await (this.prisma as any).product.findFirst({
      where: { id, storeId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
  }
}
