import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { encryption } from 'src/utilities/encryption';
import { AuthPayload } from './auth-payload.interface';
import { GoogleRequest } from './google-req.interface';

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
    return await this.getAuthPayload(resUser.id, resUser.roles);
  }

  async signWithFacebook(req) {
    if (!req.user) {
      return null;
    }

    return await this.fetchRetriveInstagramId(req.user.accessToken);
  }

  async signinWithEmail(): Promise<AuthPayload> {
    return await this.getAuthPayload(
      '22266966-0488-4fda-a102-58dbe8b9a59a',
      null,
    );
  }

  async getAuthPayload(id: string, roles: string[]): Promise<AuthPayload> {
    return {
      id,
      accessToken: await this.createToken(id, roles),
    };
  }

  async createToken(userId: string, roles: string[]) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        roles,
      },
      {
        secret: process.env.JWT_SECRET_TOKEN,
        expiresIn: `${3 * 30}d`,
      },
    );
  }

  /*
  fetch from META-API
  to get ID and username instagram
  */
  async fetchRetriveInstagramId(accessToken: string) {
    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/me/accounts?fields=name,id,access_token,instagram_business_account{id,username,name,profile_picture_url}&access_token=${accessToken}`,
    );
    const accounts = await res.json();
    const id = accounts?.data[0]?.instagram_business_account?.id;
    const name = accounts?.data[0]?.instagram_business_account?.name;
    const username = accounts?.data[0]?.instagram_business_account?.username;
    const profilePicture =
      accounts?.data[0]?.instagram_business_account?.profile_picture_url;

    return {
      id,
      name,
      username,
      profilePicture,
      accessToken: encryption(accessToken),
    };
  }
}
