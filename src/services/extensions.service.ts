import {
  ByProjectKeyRequestBuilder,
  CustomObject,
  CustomObjectDraft,
  Type,
  TypeDraft,
} from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
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

  createCustomType(): Promise<Type> {
    const typeDraft: TypeDraft = {
      key: CUSTOM_TYPE_KEY,
      name: {
        'de-DE': 'TT Delivery Instructions',
        'en-US': 'TT Delivery Instructions',
        'en-UK': 'TT Delivery Instructions',
      },
      resourceTypeIds: ['address'],
      fieldDefinitions: [
        {
          type: {
            name: 'String',
          },
          name: 'instructions',
          label: {
            'de-DE': 'Instructions',
            'en-US': 'Instructions',
            'en-UK': 'Instructions',
          },
          required: false,
        },
        {
          type: {
            name: 'String',
          },
          name: 'time',
          label: {
            'de-DE': 'Preferred Time',
            'en-US': 'Preferred Time',
            'en-UK': 'Preferred Time',
          },
          required: false,
        },
      ],
    };

    return this.apiRoot
      .types()
      .post({
        body: typeDraft,
      })
      .execute()
      .then((response) => response.body);
  }
}
