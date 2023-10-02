import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { Competitor } from './competitor.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Competitor)
    private readonly competitorRepository: Repository<Competitor>,
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

  async getAccount(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        account: true,
      },
    });
    return user.account;
  }

  async getAccountByAccountId(accountId: string) {
    return await this.accountRepository.findOneBy({ accountId });
  }

  async addCompetitorAccount(
    id: string,
    accountId: string,
    name: string,
    username: string,
    profilePicture: string,
  ) {
    const user = new User();
    const competitor = new Competitor();
    user.id = id;
    competitor.accountId = accountId;
    competitor.name = name;
    competitor.username = username;
    competitor.picture_url = profilePicture;
    competitor.user = user;

    const resCompetitor = await this.competitorRepository.save(competitor);
    return resCompetitor;
  }

  async getCompetitorsByUserId(id: string) {
    try {
      const competitors = await this.competitorRepository.find({
        where: {
          user: {
            id: 'asdasd',
          },
        },
      });

      return competitors;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
