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
    // res.redirect(`${process.env.CLIENT_URL}/login`);
    try {
      res.status(HttpStatus.OK).send(googleRes);
    } catch (error) {
      res.status(error.status).send(error.message);
    }
  }

  @Get('/signin')
  async signin(@Res() res: Response) {
    res.status(HttpStatus.OK).send(await this.authService.signinWithEmail());
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  async test(@Res() res: Response) {
    res.status(HttpStatus.OK).send('success');
  }
}
