import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthPayload } from './auth-payload.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const googleRes: AuthPayload = await this.authService.signWithGoogle(req);
    try {
      res.redirect(
        `${process.env.CLIENT_URL}/login?redirect=${
          process.env.CLIENT_URL
        }/dashboard&data=${JSON.stringify(googleRes)}`,
      );
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login`);
    }
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Res() res: Response) {
    res.status(HttpStatus.OK);
  }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.authService.signWithFacebook(req);

      res.redirect(
        `${
          process.env.CLIENT_URL
        }/dashboard?open=instagram&step=4&data_instagram=${JSON.stringify(
          result,
        )}`,
      );
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login`);
    }
  }

  @Get('/signin')
  async signin(@Res() res: Response) {
    res.status(HttpStatus.OK).send(await this.authService.signinWithEmail());
  }
}
