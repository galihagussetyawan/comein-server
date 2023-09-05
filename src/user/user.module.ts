import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Account } from 'src/account/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
