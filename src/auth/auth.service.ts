import { Injectable } from '@nestjs/common';
import { GoogleResponse } from './google-res.interface';

@Injectable()
export class AuthService {
  googleLogin(req): GoogleResponse {
    if (!req.user) {
      return null;
    }

    return req.user;
  }
}
