import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { GoogleResponse } from './google-res.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const googleRes: GoogleResponse = await this.authService.googleLogin(req);
    console.log(googleRes);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
}
