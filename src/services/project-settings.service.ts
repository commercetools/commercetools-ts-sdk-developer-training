import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { API_ROOT } from 'src/commercetools/api-client.module';

@Injectable()
export class ProjectSettingsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}
  getCurrencies(): Promise<Array<string>> {
    return this.apiRoot
      .get()
      .execute()
      .then((response) => response.body.currencies);
  }
}
