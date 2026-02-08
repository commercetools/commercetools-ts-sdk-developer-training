import {
  ByProjectKeyRequestBuilder,
  Cart,
  CartAddDiscountCodeAction,
  CartAddLineItemAction,
  CartDraft,
  CartSetCustomerEmailAction,
  CartSetShippingAddressAction,
  CartSetShippingMethodAction,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import {
  CartCreateDto,
  CartGetParamsDto,
  LineItemsAddDto,
  DiscountCodeApplyDto,
  ShippingAddressUpdateDto,
  ShippingMethodUpdateDto,
} from '../dtos/carts.dto';

import { API_ROOT } from 'src/commercetools/api-client.module';

@Injectable()
export class CartsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  async createCart(cartDetails: CartCreateDto): Promise<Cart> {
    const { storeKey, sessionId, sku, quantity, currency, country } =
      cartDetails;

    let cartDraft: CartDraft;

    throw new NotImplementedException('Feature not implemented');
  }

  async addLineItemsToCart(lineItemsDetails: LineItemsAddDto): Promise<Cart> {
    const {
      id,
      storeKey,
      sku,
      quantity,
      supplyChannelKey,
      distributionChannelKey,
    } = lineItemsDetails;

    const cart = await this.getCartById({ id, storeKey });

    const cartUpdateActions: CartUpdateAction[] = [];

    throw new NotImplementedException('Feature not implemented');
  }

  async applyDiscountCodeToCart(
    discountCodeDetails: DiscountCodeApplyDto,
  ): Promise<Cart> {
    const { id, storeKey, discountCode } = discountCodeDetails;

    const cart = await this.getCartById({ id, storeKey });

    const cartUpdateActions: CartUpdateAction[] = [];

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cart.version,
          actions: cartUpdateActions,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async updateCartShippingAddress(
    shippingAddressDetails: ShippingAddressUpdateDto,
  ): Promise<Cart> {
    const { id, storeKey, firstName, lastName, country, email } =
      shippingAddressDetails;

    let cart = await this.getCartById({ id, storeKey });

    const cartUpdateActions: CartUpdateAction[] = [
      {
        action: 'setShippingAddress',
        address: {
          firstName,
          lastName,
          country,
          email,
        },
      },
      {
        action: 'setCustomerEmail',
        email,
      }
    ];

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cart.version,
          actions: cartUpdateActions,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async updateCartShippingMethod(
    shippingMethodDetails: ShippingMethodUpdateDto,
  ): Promise<Cart> {
    const { id, storeKey, shippingMethodId } = shippingMethodDetails;

    const cart = await this.getCartById({ id, storeKey });

    const cartUpdateActions: CartUpdateAction[] = [{
      action: 'setShippingMethod',
      shippingMethod: {
        typeId: 'shipping-method',
        id: shippingMethodId,
      },
    }];

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cart.version,
          actions: cartUpdateActions,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  public getCartById(params: CartGetParamsDto): Promise<Cart> {
    const { id, storeKey } = params;
    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .get()
      .execute()
      .then((response) => response.body);
  }
}
