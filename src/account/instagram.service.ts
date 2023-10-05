import { BadRequestException, Injectable } from '@nestjs/common';
import { decryption } from 'src/utilities/encryption';
import { AccountService } from './account.service';
import { IGMediaFetch } from './ig-media-fetch.interface';
import { IGProfileFetch } from './ig-profile-fetch-interface';
import { IGProfileRes, Insight } from './ig-profile-res.interface';

@Injectable()
export class InstagramService {
  constructor(private readonly accountService: AccountService) {}
  async getProfileInsights(id: string, since: string, until: string) {
    if (!since || !until) {
      throw new BadRequestException('required query since and until date');
    }

    const resAccount = await this.accountService.getAccount(id);
    const accountId = resAccount?.accountId;
    const accessToken = decryption(resAccount?.token);

    if (!accountId) {
      throw new BadRequestException('not found account connected');
    }

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}?fields=id,username,followers_count,follows_count,media_count,insights.since(${since}).until(${until}).metric(reach,profile_views,impressions,website_clicks).period(day)&access_token=${accessToken}`,
    );

    const resJson: IGProfileFetch = await res.json();
    if (resJson.error) {
      throw new BadRequestException(resJson.error.message);
    }

    const insightsMapping: Insight[] = resJson.insights.data.map((data) => {
      return {
        name: data.name,
        period: data.period,
        title: data.title,
        values: data.values,
        total_value: data.values
          .map((v) => v.value)
          .reduce((total, amount) => total + amount),
      };
    });

    const result: IGProfileRes = {
      id: resJson?.id,
      username: resJson?.username,
      followers_count: resJson?.followers_count,
      follows_count: resJson.follows_count,
      media_count: resJson?.media_count,
      insights: {
        data: insightsMapping,
        paging: resJson?.insights?.paging,
      },
    };

    return result;
  }

  async getMediaInsights(
    id: string,
    since: string,
    until: string,
  ): Promise<IGMediaFetch> {
    if (!since || !until) {
      throw new BadRequestException('required query since and until date');
    }

    const resAccount = await this.accountService.getAccount(id);
    const accountId = resAccount?.accountId;
    const accessToken = decryption(resAccount?.token);

    if (!accountId) {
      throw new BadRequestException('not found account connected');
    }

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}/media?fields=media_type,media_product_type,timestamp,caption,like_count,comments_count,permalink,insights.metric(engagement,impressions,reach,saved,shares)&since=${since}&until=${until}&access_token=${accessToken}`,
    );

    const resJson = res?.json();
    return resJson;
  }

  async getProfileAndFieldsByUsername(
    id: string,
    qUsername: string,
    fields: string,
  ) {
    if (!qUsername) {
      throw new BadRequestException('required query username');
    }

    if (qUsername && fields === 'data') {
      return await this.getProfileDataByUsername(id, qUsername);
    } else {
      const resAccount = await this.accountService.getAccount(id);
      const accountId = resAccount?.accountId;
      const accessToken = decryption(resAccount?.token);

      if (!accountId) {
        throw new BadRequestException('not found account connected');
      }

      const res = await fetch(
        `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}?fields=business_discovery.username(${qUsername}){id,username,name,profile_picture_url}&access_token=${accessToken}`,
      );

      const resJson = await res.json();

      if (resJson.error) {
        throw new BadRequestException(resJson.error.error_user_msg);
      }

      return resJson;
    }
  }

  async getProfileDataByUsername(id: string, qUsername: string) {
    if (!qUsername) {
      throw new BadRequestException('required query username');
    }

    const resAccount = await this.accountService.getAccount(id);
    const accountId = resAccount?.accountId;
    const accessToken = decryption(resAccount?.token);

    if (!accountId) {
      throw new BadRequestException('not found account connected');
    }

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}?fields=business_discovery.username(${qUsername}){id,username,name,profile_picture_url,followers_count,media_count,media.limit(90){id,like_count,comments_count,media_type,timestamp,caption,permalink}}&access_token=${accessToken}`,
    );

    const resJson = await res.json();

    if (resJson.error) {
      throw new BadRequestException(resJson.error.error_user_msg);
    }

    return resJson;
  }

  async getAudienceInsights(userId: string, breakdown: string) {
    if (!breakdown) {
      throw new BadRequestException(
        'required breakdown: age, gender, city, country',
      );
    }

    const resAccount = await this.accountService.getAccount(userId);
    const accountId = resAccount?.accountId;
    const accessToken = decryption(resAccount?.token);

    if (!accountId) {
      throw new BadRequestException('not found account connected');
    }

    const res = await fetch(
      `${process.env.META_URL}/${process.env.META_VERSION}/${accountId}/insights?metric=follower_demographics&period=lifetime&timeframe=last_30_days&breakdown=${breakdown}&metric_type=total_value&access_token=${accessToken}`,
    );

    const resJson = await res?.json();
    if (resJson?.error) {
      throw new BadRequestException(resJson?.error?.message);
    }

    return resJson;
  }
}
