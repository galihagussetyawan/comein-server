import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.META_APP_ID,
      clientSecret: process.env.META_APP_SECRET,
      callbackURL: process.env.META_APP_REDIRECT_URL,
      scope: [
        'email',
        'public_profile',
        'pages_show_list',
        'pages_read_user_content',
        'pages_read_engagement',
        'read_insights',
        'instagram_basic',
        'instagram_manage_insights',
        'business_management',
        'ads_management',
      ],
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    const { name } = profile;
    const user = {
      firstName: name?.givenName,
      lastName: name?.familyName,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
