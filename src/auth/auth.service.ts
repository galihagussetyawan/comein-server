import { Injectable } from '@nestjs/common';
import { GoogleRequest } from './google-req.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './auth-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signWithGoogle(req): Promise<AuthPayload> {
    let gReq: GoogleRequest = req.user;

    if (!gReq) {
      return null;
    }

    return await this.getAuthPayload('asdasd', gReq.email, null);
  }

  async signinWithEmail(): Promise<AuthPayload> {
    return await this.getAuthPayload('id-secret', 'galih@gmail.com', ['user']);
  }

  async getAuthPayload(
    id: string,
    email: string,
    roles: string[],
  ): Promise<AuthPayload> {
    return {
      id,
      email,
      accessToken: await this.createToken(id, email, roles),
    };
  }

  async createToken(userId: string, email: string, roles: string[]) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        roles,
      },
      {
        secret: process.env.JWT_SECRET_TOKEN,
        expiresIn: `${3 * 30}d`,
      },
    );
  }
}
