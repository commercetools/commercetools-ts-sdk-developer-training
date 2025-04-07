import {
  ByProjectKeyRequestBuilder,
  TypeDraft,
} from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { API_ROOT } from 'src/commercetools/api-client.module';
import { CustomObjectCreateBodyDto } from 'src/dtos/extensions.dto';
import {
  CustomObjectUpdateDto,
  CustomObjectUpdateParamsDto,
} from 'src/dtos/extensions.dto';

export const CUSTOM_TYPE_KEY = 'tt-delivery-instructions';

@Injectable()
export class ExtensionsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  getCustomObject(customObjectDetails: CustomObjectUpdateParamsDto) {
    const { container, key } = customObjectDetails;
    return this.apiRoot
      .customObjects()
      .withContainerAndKey({ container, key })
      .get()
      .execute()
      .then((response) => response.body);
  }

  async updateCustomObject(customObjectDetails: CustomObjectUpdateDto) {
    const { container, key, userName, email } = customObjectDetails;

    const customObject = await this.getCustomObject({ container, key });

    const subscribers = customObject.value;
    subscribers.push({
      userName,
      email,
    });

    return this.apiRoot
      .customObjects()
      .post({
        body: {
          container,
          key,
          value: subscribers,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  createCustomObject(customObjectDetails: CustomObjectCreateBodyDto) {
    const { container, key } = customObjectDetails;
    return this.apiRoot
      .customObjects()
      .post({
        body: {
          container,
          key,
          value: [],
        },
      })
      .execute()
      .then((response) => response.body);
  }

  createCustomType() {
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
