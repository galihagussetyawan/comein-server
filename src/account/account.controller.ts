import {
  Body,
  Controller,
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

interface AccountReqBody {
  accountId: string;
  name: string;
  username: string;
  profilePicture: string;
  accessToken: string;
}

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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
}
