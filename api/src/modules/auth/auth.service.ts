import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicKey, verify } from 'crypto';

@Injectable()
export class AuthService {
  private privyAppId: string;
  private jwksCache: any = null;
  private jwksLastFetched = 0;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const rawAppId = this.configService.get<string>('PRIVY_APP_ID') || 'cmpr1els201hw0dl4wbg6ckqw';
    this.privyAppId = rawAppId.replace(/^["']|["']$/g, '');
  }

  private async getJwks(): Promise<any> {
    const now = Date.now();
    // Cache JWKS in memory for 1 hour to avoid excessive network requests
    if (this.jwksCache && now - this.jwksLastFetched < 3600000) {
      return this.jwksCache;
    }

    try {
      const url = `https://auth.privy.io/api/v1/apps/${this.privyAppId}/jwks.json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
      }
      const data = await response.json();
      this.jwksCache = data;
      this.jwksLastFetched = now;
      return data;
    } catch (error) {
      if (this.jwksCache) {
        return this.jwksCache;
      }
      throw error;
    }
  }

  async verifyToken(token: string): Promise<{ privyId: string; email?: string }> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid JWT format');
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    try {
      // Parse header to get kid
      const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
      if (header.alg !== 'ES256') {
        throw new UnauthorizedException('Unsupported signature algorithm, expected ES256');
      }

      const jwks = await this.getJwks();
      const jwk = jwks.keys.find((key: any) => key.kid === header.kid);
      if (!jwk) {
        throw new UnauthorizedException('Public key not found in JWKS');
      }

      // Build EC public key from JWK
      const publicKey = createPublicKey({
        key: {
          kty: 'EC',
          crv: jwk.crv,
          x: jwk.x,
          y: jwk.y,
        },
        format: 'jwk',
      });

      const dataToVerify = Buffer.from(`${headerB64}.${payloadB64}`);
      const signature = Buffer.from(signatureB64, 'base64url');

      const isVerified = verify('sha256', dataToVerify, { key: publicKey, dsaEncoding: 'ieee-p1363' }, signature);
      if (!isVerified) {
        throw new UnauthorizedException('Invalid JWT signature');
      }

      // Parse payload
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

      // Validate expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new UnauthorizedException('Token has expired');
      }

      // Validate issuer
      if (payload.iss !== 'privy.io') {
        throw new UnauthorizedException('Token issuer mismatch');
      }

      // Validate audience matches our app ID
      if (payload.aud !== this.privyAppId) {
        throw new UnauthorizedException('Token audience mismatch');
      }

      return {
        privyId: payload.sub,
        email: payload.email,
      };
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'JWT verification failed');
    }
  }
}

