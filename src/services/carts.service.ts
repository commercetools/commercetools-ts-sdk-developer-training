import {
  ByProjectKeyRequestBuilder,
  CartAddDiscountCodeAction,
  CartAddLineItemAction,
  CartDraft,
  CartSetCustomerEmailAction,
  CartSetShippingAddressAction,
  CartSetShippingMethodAction,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
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

  async createCart(cartDetails: CartCreateDto) {
    const { storeKey, sessionId, sku, quantity, currency, country } =
      cartDetails;

    const cartDraft: CartDraft = {
      anonymousId: sessionId,
      currency: currency ?? 'EUR',
      country: country ?? 'DE',
      deleteDaysAfterLastModification: 30,
      lineItems: [
        {
          sku,
          quantity: quantity ?? 1,
        },
      ],
    };

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .post({
        body: cartDraft,
      })
      .execute()
      .then((response) => response.body);
  }

  async addLineItemsToCart(lineItemsDetails: LineItemsAddDto) {
    const { id, storeKey, sku, quantity, supplyChannel, distributionChannel } =
      lineItemsDetails;

    const cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    const cartUpdateActions: CartUpdateAction[] = [];

    const addLineItemUpdateAction: CartAddLineItemAction = {
      action: 'addLineItem',
      sku,
      quantity,
      ...(supplyChannel && {
        supplyChannel: {
          typeId: 'channel',
          key: supplyChannel,
        },
      }),
      ...(distributionChannel && {
        distributionChannel: {
          typeId: 'channel',
          key: distributionChannel,
        },
      }),
    };

    cartUpdateActions.push(addLineItemUpdateAction);

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

  async applyDiscountCodeToCart(discountCodeDetails: DiscountCodeApplyDto) {
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
  ) {
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
  ) {
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

  public getCartById(params: CartGetParamsDto) {
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
