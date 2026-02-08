import {
  ByProjectKeyRequestBuilder,
  CustomObject,
  CustomObjectDraft,
  Type,
  TypeDraft,
} from '@commercetools/platform-sdk';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { API_ROOT } from '../commercetools/api-client.module';
import { CustomObjectCreateUpdateBodyDto } from '../dtos/extensions.dto';
import { isSDKError } from '../types/error.type';

export const CUSTOM_TYPE_KEY = 'tt-delivery-instructions';
export const CUSTOM_OBJECT_CONTAINER = 'email-lists';
export const CUSTOM_OBJECT_KEY = 'promotional-email-subscribers';

@Injectable()
export class ExtensionsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  createCustomType(): Promise<Type> {
    
    // TODO: define a custom type
    let typeDraft: TypeDraft;

    throw new NotImplementedException('Feature not implemented');
  }

  getCustomObject(): Promise<CustomObject> {
    return this.apiRoot
      .customObjects()
      .withContainerAndKey({
        container: CUSTOM_OBJECT_CONTAINER,
        key: CUSTOM_OBJECT_KEY,
      })
      .get()
      .execute()
      .then((response) => response.body);
  }

  async createUpdateCustomObject(
    customObjectDetails: CustomObjectCreateUpdateBodyDto,
  ) {
    const { userName, email } = customObjectDetails;

    let subscribers: any = [];

    try {
      const customObject = await this.getCustomObject();
      subscribers = customObject.value;
      subscribers.push({ userName, email });
    } catch (error: unknown) {
      if (isSDKError(error) && error.statusCode === 404) {
        subscribers = [{ userName, email }];
      } else {
        throw error; // Let non-404 errors bubble up
      }
    }

    const customObjectDraft: CustomObjectDraft = {
      container: CUSTOM_OBJECT_CONTAINER,
      key: CUSTOM_OBJECT_KEY,
      value: subscribers,
    };

    return this.apiRoot
      .customObjects()
      .post({ body: customObjectDraft })
      .execute()
      .then((response) => response.body);
  }

}
