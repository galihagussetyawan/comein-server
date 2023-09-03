import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthPayload } from './auth-payload.interface';

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
      res.status(HttpStatus.OK).send(googleRes);
    } catch (error) {
      res.status(error.status).send(error.message);
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
    res.status(200).json(await this.authService.signWithFacebook(req));
  }

  @Get('/signin')
  async signin(@Res() res: Response) {
    res.status(HttpStatus.OK).send(await this.authService.signinWithEmail());
  }
}
