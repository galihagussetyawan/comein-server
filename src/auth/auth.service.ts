import { Injectable } from '@nestjs/common';
import { GoogleRequest } from './google-req.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './auth-payload.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signWithGoogle(req): Promise<AuthPayload> {
    const gReq: GoogleRequest = req.user;

    if (!gReq) {
      return null;
    }

    const user: User = new User();
    user.email = gReq.email;
    user.firstName = gReq.firstName;
    user.lastName = gReq.lastName;
    user.displayName = gReq.displayName;
    user.picture = gReq.picture;
    user.verified = gReq.verified;

    const resUser: User = await this.userService.createUser(user);
    return await this.getAuthPayload(resUser.id, resUser.email, resUser.roles);
  }

  async signWithFacebook(req: Request) {
    return req.user;
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
