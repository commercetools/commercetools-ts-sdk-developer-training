import {
  ByProjectKeyRequestBuilder,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import {
  CartCreateDto,
  CartGetParamsDto,
  LineItemsAddDto,
  DiscountCodeApplyDto,
  ShippingAddressUpdateDto,
} from '../dtos/carts.dto';

import { API_ROOT } from 'src/commercetools/api-client.module';
import { CartUpdateActionsBuilder } from 'src/types/cart.type';

@Injectable()
export class CartsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  async createCart(cartDetails: CartCreateDto) {
    const { storeKey, sessionId, sku, quantity, currency, country, locale } =
      cartDetails;

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .post({
        body: {
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
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async addLineItemsToCart(lineItemsDetails: LineItemsAddDto) {
    const { id, storeKey, sku, quantity, supplyChannel, distributionChannel } =
      lineItemsDetails;

    const cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    const updateActionsBuilder = new CartUpdateActionsBuilder().addLineItem(
      sku,
      quantity,
      distributionChannel,
      supplyChannel,
    );

    return this.executeCartUpdate(
      id,
      storeKey,
      cartVersion,
      updateActionsBuilder.build(),
    );
  }

  async applyDiscountCodeToCart(discountCodeDetails: DiscountCodeApplyDto) {
    const { id, storeKey, discountCode } = discountCodeDetails;

    const cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    const updateActionsBuilder =
      new CartUpdateActionsBuilder().applyDiscountCode(discountCode);

    return this.executeCartUpdate(
      id,
      storeKey,
      cartVersion,
      updateActionsBuilder.build(),
    );
  }

  async updateCartShippingAddress(
    shippingAddressDetails: ShippingAddressUpdateDto,
  ) {
    const { id, storeKey, firstName, lastName, country, email } =
      shippingAddressDetails;

    let cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    const updateActionsBuilder = new CartUpdateActionsBuilder()
      .setShippingAddress({ country, firstName, lastName, email })
      .setCustomerEmail(email);

    cart = await this.executeCartUpdate(
      id,
      storeKey,
      cartVersion,
      updateActionsBuilder.build(),
    );

    const matchingShippingMethod = await this.fetchMatchingShippingMethod(
      id,
      storeKey,
    );

    const shippingMethodActionsBuilder =
      new CartUpdateActionsBuilder().setShippingMethod(matchingShippingMethod);
    cart = await this.executeCartUpdate(
      id,
      storeKey,
      cart.version,
      shippingMethodActionsBuilder.build(),
    );

    return cart;
  }

  private executeCartUpdate(
    cartId: string,
    storeKey: string,
    version: number,
    updateActions: CartUpdateAction[],
  ) {
    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions: updateActions,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  private fetchMatchingShippingMethod(cartId: string, storeKey: string) {
    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          cartId,
        },
      })
      .execute()
      .then((response) => response.body.results[0]);
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
