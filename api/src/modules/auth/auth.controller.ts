import { Controller, Post, Body, UseGuards, Req, HttpCode, Get } from '@nestjs/common';
import { PrivyAuthGuard } from './guards/privy-auth.guard';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @UseGuards(PrivyAuthGuard)
  @HttpCode(200)
  async sync(@Req() req: any, @Body() body: Omit<CreateUserDto, 'privyId'>) {
    const privyUser = req.privyUser;
    
    const user = await this.usersService.upsertByPrivyId({
      privyId: privyUser.privyId,
      name: body.name,
      email: body.email || privyUser.email,
      username: body.username,
      accountType: body.accountType,
      storeName: body.storeName || body.businessName,
      businessName: body.businessName,
      category: body.category,
      walletAddress: body.walletAddress,
      walletIndex: body.walletIndex ?? (body.accountType === 'PJ' ? 1 : 0),
    });
    
    return user.toJSON();
  }

  @Post('switch')
  @UseGuards(PrivyAuthGuard)
  @HttpCode(200)
  async switchAccount(@Req() req: any) {
    return req.user.toJSON();
  }

  @Get('accounts')
  @UseGuards(PrivyAuthGuard)
  async accounts(@Req() req: any) {
    const privyId = req.privyUser?.privyId || req.user?.privyId;
    return this.usersService.accountsWithStores(privyId);
  }
}
