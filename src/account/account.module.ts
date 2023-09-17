import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/user/user.entity';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { InstagramService } from './instagram.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountService, JwtStrategy, InstagramService],
  controllers: [AccountController],
  exports: [TypeOrmModule, AccountService],
})
export class AccountModule {}
