import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { OrderCreateDto } from 'src/dtos/orders.dto';
import {
  ByProjectKeyRequestBuilder,
  Order,
  OrderFromCartDraft,
  OrderSetCustomTypeAction,
  OrderUpdateAction,
} from '@commercetools/platform-sdk';
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

  createOrder(orderDetails: OrderCreateDto): Promise<Order> {
    const { cartId, cartVersion, storeKey } = orderDetails;

    const orderFromCartDraft: OrderFromCartDraft = {
      version: cartVersion,
      cart: {
        id: cartId,
        typeId: 'cart',
      },
      orderNumber: orderNamePrefix + '_' + Date.now().toString(36),
    };

    throw new NotImplementedException('Feature not implemented');
  }

  async updateOrderCustomFields(
    customFieldsDetails: CustomFieldsUpdateDto,
  ): Promise<Order> {
    const { orderNumber, instructions, time, storeKey } = customFieldsDetails;

    let order = await this.getOrderByNumber(orderNumber, storeKey);
    const orderVersion = order.version;

    const updateOrderCustomFields: OrderSetCustomTypeAction = {
      action: 'setCustomType',
      type: {
        key: CUSTOM_TYPE_KEY,
        typeId: 'type',
      },
      fields: {
        time,
        instructions,
      },
    };

    const orderUpdateActions: OrderUpdateAction[] = [];
    orderUpdateActions.push(updateOrderCustomFields);

    throw new NotImplementedException('Feature not implemented');
  }

  private getOrderByNumber(
    orderNumber: string,
    storeKey: string,
  ): Promise<Order> {
    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .orders()
      .withOrderNumber({ orderNumber })
      .get()
      .execute()
      .then((response) => response.body);
  }
}
