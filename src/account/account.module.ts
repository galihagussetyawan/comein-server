import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountService, JwtStrategy],
  controllers: [AccountController],
  exports: [TypeOrmModule, AccountService],
})
export class AccountModule {}
