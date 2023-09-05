import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createAccount(
    id: string,
    accountId: string,
    name: string,
    username: string,
    profilePicture: string,
    accessToken: string,
  ): Promise<Account> {
    const account = new Account();
    account.accountId = accountId;
    account.name = name;
    account.username = username;
    account.picture_url = profilePicture;
    account.token = accessToken;

    let resAccount = await this.getAccountByAccountId(accountId);

    if (!resAccount) {
      resAccount = await this.accountRepository.save(account);
      this.userRepository.update(id, { account: resAccount });
    }

    await this.accountRepository.update(resAccount.id, {
      name,
      username,
      picture_url: profilePicture,
      token: accessToken,
    });
    return resAccount;
  }

  async getAccountByAccountId(accountId: string) {
    return await this.accountRepository.findOneBy({ accountId });
  }
}
