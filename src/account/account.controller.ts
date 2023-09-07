import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { PrincipalDecorator } from 'src/auth/principal.decorator';
import { Request, Response } from 'express';
import { InstagramService } from './instagram.service';

interface AccountReqBody {
  accountId: string;
  name: string;
  username: string;
  profilePicture: string;
  accessToken: string;
}

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly instagramService: InstagramService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @PrincipalDecorator() principal: any,
    @Body() reqBody: AccountReqBody,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'successfully created account',
        data: await this.accountService.createAccount(
          principal.sub,
          reqBody.accountId,
          reqBody.name,
          reqBody.username,
          reqBody.profilePicture,
          reqBody.accessToken,
        ),
      });
    } catch (error) {
      res.status(error.status).send({
        status: error.status,
        message: error.message,
      });
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAccount(@PrincipalDecorator() principal: any) {
    return await this.accountService.getAccount(principal.sub);
  }

  @Get('/instagram/insights/profile')
  @UseGuards(AuthGuard('jwt'))
  async getInsightInstagramAccount(
    @PrincipalDecorator() principal: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'success get insights',
        data: await this.instagramService.getProfileInsights(
          principal.sub,
          req.query['since'] ? req.query['since'].toString() : null,
          req.query['until'] ? req.query['until'].toString() : null,
        ),
      });
    } catch (error) {
      res.status(error?.status).send({
        status: error?.status,
        message: error?.message,
      });
    }
  }
}
