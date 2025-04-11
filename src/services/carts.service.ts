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
    const { id, storeKey, sku, quantity, supplyChannel, distributionChannel } =
      lineItemsDetails;

    const cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    const cartUpdateActions: CartUpdateAction[] = [];

    let addLineItemUpdateAction: CartAddLineItemAction;

    throw new NotImplementedException('Feature not implemented');
  }

  async applyDiscountCodeToCart(
    discountCodeDetails: DiscountCodeApplyDto,
  ): Promise<Cart> {
    const { id, storeKey, discountCode } = discountCodeDetails;

    const cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    const cartUpdateActions: CartUpdateAction[] = [];

    const addDiscountCodeUpdateAction: CartAddDiscountCodeAction = {
      action: 'addDiscountCode',
      code: discountCode,
    };

    cartUpdateActions.push(addDiscountCodeUpdateAction);

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
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
    let cartVersion = cart.version;

    const cartUpdateActions: CartUpdateAction[] = [];

    const setShippingAddressUpdateAction: CartSetShippingAddressAction = {
      action: 'setShippingAddress',
      address: {
        firstName,
        lastName,
        country,
        email,
      },
    };

    const setCustomerEmailUpdateAction: CartSetCustomerEmailAction = {
      action: 'setCustomerEmail',
      email,
    };

    cartUpdateActions.push(setShippingAddressUpdateAction);
    cartUpdateActions.push(setCustomerEmailUpdateAction);

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
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
    const cartVersion = cart.version;

    const cartUpdateActions: CartUpdateAction[] = [];

    const setShippingMethodUpdateAction: CartSetShippingMethodAction = {
      action: 'setShippingMethod',
      shippingMethod: {
        typeId: 'shipping-method',
        id: shippingMethodId,
      },
    };

    cartUpdateActions.push(setShippingMethodUpdateAction);

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
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
