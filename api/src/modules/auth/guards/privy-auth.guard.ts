import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PrivyAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    // Verify token
    const tokenData = await this.authService.verifyToken(token);

    // Fetch user
    const accountTypeHeader = String(request.headers['x-account-type'] || '').toUpperCase();
    const walletIndexHeader = request.headers['x-wallet-index'];
    const walletIndex = walletIndexHeader ? parseInt(walletIndexHeader, 10) : 0;
    const user =
      accountTypeHeader === 'PF' || accountTypeHeader === 'PJ'
        ? await this.usersService.findByPrivyIdAndAccountType(
            tokenData.privyId,
            accountTypeHeader,
          )
        : await this.usersService.findByPrivyId(
            tokenData.privyId,
            isNaN(walletIndex) ? 0 : walletIndex,
          );
    if (!user) {
      // Attach privyUser info for registration
      request.privyUser = tokenData;
      
      const path = request.url;
      if (path.includes('/auth/sync')) {
        return true;
      }
      if (path.includes('/auth/accounts')) {
        return true;
      }
      
      throw new UnauthorizedException('User profile not synchronized');
    }

    request.user = user;
    request.privyUser = tokenData;
    return true;
  }
}
