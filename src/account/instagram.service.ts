import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountService } from './account.service';
import { InstagramMediaResponse } from './instagram-media-res.interface';

@Injectable()
export class InstagramService {
  constructor(private readonly accountService: AccountService) {}
  async getProfileInsights(id: string, since: string, until: string) {
    if (!since || !until) {
      throw new BadRequestException('required query since and until date');
    }

    const resAccount = await this.accountService.getAccount(id);
    const accountId = resAccount.accountId;
    const accessToken = resAccount.token;

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}?fields=id,username,followers_count,follows_count,media_count,insights.since(${since}).until(${until}).metric(reach,profile_views,impressions,website_clicks).period(day)&access_token=${accessToken}`,
    );

    const resJson = await res.json();
    if (resJson.error) {
      throw new BadRequestException(resJson.error.message);
    }

    return resJson;
  }

  async getMediaInsights(
    id: string,
    since: string,
    until: string,
  ): Promise<InstagramMediaResponse> {
    if (!since || !until) {
      throw new BadRequestException('required query since and until date');
    }

    const resAccount = await this.accountService.getAccount(id);
    const accountId = resAccount.accountId;
    const accessToken = resAccount.token;

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}/media?fields=media_type,timestamp,caption,insights.metric(engagement,impressions,reach)&since=${since}&until=${until}&access_token=${accessToken}`,
    );

    const resJson = res.json();
    return resJson;
  }

  async getProfileByUsername(id: string, qUsername: string) {
    if (!qUsername) {
      throw new BadRequestException('required query username');
    }

    const resAccount = await this.accountService.getAccount(id);
    const accountId = resAccount.accountId;
    const accessToken = resAccount.token;

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}?fields=business_discovery.username(${qUsername}){id,username,name,profile_picture_url,followers_count,media_count,media.limit(1){id,like_count,comments_count,media_type,timestamp,caption,permalink}}&access_token=${accessToken}`,
    );

    const resJson = await res.json();

    if (resJson.error) {
      throw new BadRequestException(resJson.error.error_user_msg);
    }

    return resJson;
  }
}
