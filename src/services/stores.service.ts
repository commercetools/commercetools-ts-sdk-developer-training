import {
  ByProjectKeyRequestBuilder,
  Store,
  StorePagedQueryResponse,
} from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { API_ROOT } from 'src/commercetools/api-client.module';

@Injectable()
export class StoresService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  public getStoreByKey(storeKey: string): Promise<Store> {
    return this.apiRoot
      .stores()
      .withKey({ key: storeKey })
      .get()
      .execute()
      .then((response) => response.body);
  }

  public getAllStores(): Promise<StorePagedQueryResponse> {
    return this.apiRoot
      .stores()
      .get()
      .execute()
      .then((response) => response.body);
  }
}
