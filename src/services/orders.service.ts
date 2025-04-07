import { Inject, Injectable } from '@nestjs/common';
import { OrderCreateDto } from 'src/dtos/orders.dto';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { API_ROOT } from 'src/commercetools/api-client.module';
import { CustomFieldsUpdateDto } from 'src/dtos/extensions.dto';
import { CUSTOM_TYPE_KEY } from './extensions.service';
import { CustomersService } from './customers.service';

const orderNamePrefix = 'TT';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
    private readonly customersService: CustomersService,
  ) {}

  createOrder(orderDetails: OrderCreateDto) {
    const { cartId, cartVersion, storeKey } = orderDetails;

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .orders()
      .post({
        body: {
          version: cartVersion,
          cart: {
            id: cartId,
            typeId: 'cart',
          },
          orderNumber: orderNamePrefix + '_' + Date.now().toString(36),
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async updateOrderCustomFields(customFieldsDetails: CustomFieldsUpdateDto) {
    const { orderNumber, instructions, time, storeKey } = customFieldsDetails;

    let existingOrder = await this.getOrderByNumber(orderNumber, storeKey);

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .orders()
      .withOrderNumber({ orderNumber })
      .post({
        body: {
          version: existingOrder.version,
          actions: [
            {
              action: 'setShippingAddressCustomType',
              type: {
                key: CUSTOM_TYPE_KEY,
                typeId: 'type',
              },
              fields: {
                time,
                instructions,
              },
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
  }

  private getOrderByNumber(orderNumber: string, storeKey: string) {
    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .orders()
      .withOrderNumber({ orderNumber })
      .get()
      .execute()
      .then((response) => response.body);
  }
}
