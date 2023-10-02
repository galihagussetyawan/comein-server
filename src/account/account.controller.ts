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
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PrincipalDecorator } from 'src/auth/principal.decorator';
import { AccountService } from './account.service';
import { InstagramService } from './instagram.service';

interface AccountReqBody {
  accountId: string;
  name: string;
  username: string;
  profilePicture: string;
  accessToken: string;
}

interface CompetitorReqBody {
  accountId: string;
  name: string;
  username: string;
  profilePicture: string;
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
  async getAccount(@PrincipalDecorator() principal: any, @Res() res: Response) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'success get account',
        data: await this.accountService.getAccount(principal.sub),
      });
    } catch (error) {
      res.status(error?.status).send({
        status: error?.status,
        message: error?.message,
      });
    }
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

  @Get('/instagram/insights/media')
  @UseGuards(AuthGuard('jwt'))
  async getInstagramMediaInsights(
    @PrincipalDecorator() principal: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'success get media insights',
        data: await this.instagramService.getMediaInsights(
          principal.sub,
          req.query['since'] ? req.query['since'].toString() : null,
          req.query['until'] ? req.query['until'].toString() : null,
        ),
      });
    } catch (error) {
      res.status(error.status).send({
        status: error.status,
        message: error.message,
      });
    }
  }

  @Get('/instagram')
  @UseGuards(AuthGuard('jwt'))
  async getInstagramProfileByUsername(
    @PrincipalDecorator() principal: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'success get media insights',
        data: await this.instagramService.getProfileAndFieldsByUsername(
          principal.sub,
          req.query['q'] ? req.query['q'].toString() : null,
          req.query['fields'] ? req.query['fields'].toString() : null,
        ),
      });
    } catch (error) {
      res.status(error.status).send({
        status: error.status,
        message: error.message,
      });
    }
  }

  @Post('/competitor')
  @UseGuards(AuthGuard('jwt'))
  async addCompetitorAccount(
    @PrincipalDecorator() principal: any,
    @Body() reqBody: CompetitorReqBody,
    @Res() res: Response,
  ) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'success add your competitor',
        data: await this.accountService.addCompetitorAccount(
          principal?.sub,
          reqBody.accountId,
          reqBody.name,
          reqBody.username,
          reqBody.profilePicture,
        ),
      });
    } catch (error) {
      res.status(error.status).send({
        status: error.status,
        message: error.message,
      });
    }
  }

  @Get('/competitor')
  @UseGuards(AuthGuard('jwt'))
  async getCompetitorsAccount(
    @PrincipalDecorator() principal: any,
    @Res() res: Response,
  ) {
    try {
      res.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'success get competitors',
        data: await this.accountService.getCompetitorsByUserId(principal?.sub),
      });
    } catch (error) {
      res.status(error.status).send({
        status: error.status,
        message: error.message,
      });
    }
  }
}
