import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisService } from '../../database/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const walletIndex = createUserDto.walletIndex ?? this.walletIndexFor(createUserDto.accountType);
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          {
            AND: [
              { privyId: createUserDto.privyId },
              { walletIndex },
            ],
          },
          {
            AND: [
              { privyId: createUserDto.privyId },
              { accountType: createUserDto.accountType },
            ],
          },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const now = new Date();
    const userEntity = new UserEntity({
      id: randomUUID(),
      privyId: createUserDto.privyId,
      name: createUserDto.name,
      email: createUserDto.email,
      username: createUserDto.username,
      accountType: createUserDto.accountType,
      walletAddress: createUserDto.walletAddress || null,
      walletIndex,
      createdAt: now,
      updatedAt: now,
    });

    const savedUser = await this.prisma.user.create({
      data: {
        id: userEntity.id,
        privyId: userEntity.privyId,
        name: userEntity.name,
        email: userEntity.email,
        username: userEntity.username,
        accountType: userEntity.accountType,
        walletAddress: userEntity.walletAddress,
        walletIndex: userEntity.walletIndex,
        createdAt: userEntity.createdAt,
        updatedAt: userEntity.updatedAt,
      },
    });

    await this.upsertStoreForUser(savedUser, createUserDto);

    await this.redis.set(
      `user:${savedUser.id}`,
      JSON.stringify(savedUser),
      'EX',
      3600,
    );
    await this.redis.set(
      `user:privy:${savedUser.privyId}:${savedUser.walletIndex}`,
      JSON.stringify(savedUser),
      'EX',
      3600,
    );

    return new UserEntity({
      ...savedUser,
      accountType: savedUser.accountType as 'PF' | 'PJ',
    });
  }

  async findOne(id: string): Promise<UserEntity | null> {
    const cached = await this.redis.get(`user:${id}`);
    if (cached) {
      const data = JSON.parse(cached);
      return new UserEntity({
        ...data,
        accountType: data.accountType as 'PF' | 'PJ',
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    }

    const dbUser = await this.prisma.user.findUnique({ where: { id } });
    if (!dbUser) return null;

    await this.redis.set(
      `user:${dbUser.id}`,
      JSON.stringify(dbUser),
      'EX',
      3600,
    );
    return new UserEntity({
      ...dbUser,
      accountType: dbUser.accountType as 'PF' | 'PJ',
    });
  }

  async findByPrivyId(privyId: string, walletIndex: number = 0): Promise<UserEntity | null> {
    const cached = await this.redis.get(`user:privy:${privyId}:${walletIndex}`);
    if (cached) {
      const data = JSON.parse(cached);
      return new UserEntity({
        ...data,
        accountType: data.accountType as 'PF' | 'PJ',
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    }

    const dbUser = await this.prisma.user.findUnique({
      where: {
        privyId_walletIndex: {
          privyId,
          walletIndex,
        },
      },
    });
    if (!dbUser) return null;

    await this.redis.set(
      `user:privy:${dbUser.privyId}:${dbUser.walletIndex}`,
      JSON.stringify(dbUser),
      'EX',
      3600,
    );
    return new UserEntity({
      ...dbUser,
      accountType: dbUser.accountType as 'PF' | 'PJ',
    });
  }

  async findByPrivyIdAndAccountType(
    privyId: string,
    accountType: 'PF' | 'PJ',
  ): Promise<UserEntity | null> {
    const cached = await this.redis.get(`user:privy:${privyId}:type:${accountType}`);
    if (cached) {
      const data = JSON.parse(cached);
      return new UserEntity({
        ...data,
        accountType: data.accountType as 'PF' | 'PJ',
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    }

    const dbUser = await this.prisma.user.findUnique({
      where: {
        privyId_accountType: {
          privyId,
          accountType,
        },
      },
    });
    if (!dbUser) return null;

    await this.redis.set(
      `user:privy:${dbUser.privyId}:type:${dbUser.accountType}`,
      JSON.stringify(dbUser),
      'EX',
      3600,
    );
    return new UserEntity({
      ...dbUser,
      accountType: dbUser.accountType as 'PF' | 'PJ',
    });
  }

  async findAllByPrivyId(privyId: string): Promise<UserEntity[]> {
    const dbUsers = await this.prisma.user.findMany({
      where: { privyId },
      orderBy: { walletIndex: 'asc' },
    });
    return dbUsers.map(
      (dbUser: any) =>
        new UserEntity({
          ...dbUser,
          accountType: dbUser.accountType as 'PF' | 'PJ',
        }),
    );
  }

  async upsertByPrivyId(data: CreateUserDto): Promise<UserEntity> {
    const walletIndex = data.walletIndex ?? this.walletIndexFor(data.accountType);
    const existing = await this.prisma.user.findUnique({
      where: {
        privyId_accountType: {
          privyId: data.privyId,
          accountType: data.accountType,
        },
      },
    });

    if (existing) {
      // Update details
      const now = new Date();
      const updatedUser = await this.prisma.user.update({
        where: {
          privyId_accountType: {
            privyId: data.privyId,
            accountType: data.accountType,
          },
        },
        data: {
          name: data.name,
          email: data.email,
          username: data.username,
          accountType: data.accountType,
          walletAddress: data.walletAddress || existing.walletAddress || null,
          walletIndex,
          updatedAt: now,
        },
      });

      await this.upsertStoreForUser(updatedUser, data);

      // Update Cache
      await this.redis.set(
        `user:${updatedUser.id}`,
        JSON.stringify(updatedUser),
        'EX',
        3600,
      );
      await this.redis.set(
        `user:privy:${updatedUser.privyId}:${updatedUser.walletIndex}`,
        JSON.stringify(updatedUser),
        'EX',
        3600,
      );
      await this.redis.set(
        `user:privy:${updatedUser.privyId}:type:${updatedUser.accountType}`,
        JSON.stringify(updatedUser),
        'EX',
        3600,
      );

      return new UserEntity({
        ...updatedUser,
        accountType: updatedUser.accountType as 'PF' | 'PJ',
      });
    }

    // Create
    return this.create(data);
  }

  async usernameExists(username: string): Promise<boolean> {
    const dbUser = await this.prisma.user.findUnique({ where: { username } });
    return !!dbUser;
  }

  async accountsWithStores(privyId: string) {
    const users = await (this.prisma as any).user.findMany({
      where: { privyId },
      include: { stores: { orderBy: { createdAt: 'asc' }, take: 1 } },
      orderBy: { walletIndex: 'asc' },
    });

    return users.map((user: any) => ({
      ...new UserEntity({
        ...user,
        accountType: user.accountType as 'PF' | 'PJ',
      }).toJSON(),
      store: user.stores[0] || null,
      businessName: user.stores[0]?.name,
      category: user.stores[0]?.category,
    }));
  }

  private walletIndexFor(accountType: 'PF' | 'PJ') {
    return accountType === 'PJ' ? 1 : 0;
  }

  private async upsertStoreForUser(user: any, data: CreateUserDto) {
    if (data.accountType !== 'PJ') return null;

    const name = data.storeName || data.businessName || user.name;
    const slug = this.slugify(data.username || name);
    const existing = await (this.prisma as any).store.findFirst({
      where: { ownerUserId: user.id },
    });

    if (existing) {
      return (this.prisma as any).store.update({
        where: { id: existing.id },
        data: {
          name,
          category: data.category || null,
          settlementWallet: data.walletAddress || user.walletAddress || null,
          enabled: true,
        },
      });
    }

    return (this.prisma as any).store.create({
      data: {
        ownerUserId: user.id,
        name,
        slug,
        category: data.category || null,
        settlementWallet: data.walletAddress || user.walletAddress || null,
      },
    });
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
