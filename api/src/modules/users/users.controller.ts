import { Controller, Post, Body, Get, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user.toJSON();
  }

  @Get('me')
  @UseGuards(PrivyAuthGuard)
  async getMe(@Req() req: any) {
    return req.user.toJSON();
  }

  @Get('me/accounts')
  @UseGuards(PrivyAuthGuard)
  async getMyAccounts(@Req() req: any) {
    const accounts = await this.usersService.findAllByPrivyId(req.user.privyId);
    return accounts.map(acc => acc.toJSON());
  }

  @Get('check-username/:username')
  async checkUsername(@Param('username') username: string) {
    const exists = await this.usersService.usernameExists(username);
    return { available: !exists };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toJSON();
  }
}
