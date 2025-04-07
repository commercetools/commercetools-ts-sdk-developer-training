import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import {
  CartCreateDto,
  CartGetParamsDto,
  LineItemsAddDto,
  DiscountCodeApplyDto,
  ShippingAddressUpdateDto,
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

    throw new NotImplementedException('This feature is not yet supported.');

    // return this.apiRoot
    //   .inStoreKeyWithStoreKeyValue({ storeKey })
    //   .carts()
    //   .post({
    //     body: {
    //       anonymousId: sessionId,
    //       currency: currency ?? 'EUR',
    //       country: country ?? 'DE',
    //       deleteDaysAfterLastModification: 30,
    //       lineItems: [
    //         {
    //           sku,
    //           quantity: quantity ?? 1,
    //         },
    //       ],
    //     },
    //   })
    //   .execute()
    //   .then((response) => response.body);
  }

  async addLineItemsToCart(lineItemsDetails: LineItemsAddDto) {
    const { id, storeKey, sku, quantity, supplyChannel, distributionChannel } =
      lineItemsDetails;

    throw new NotImplementedException('This feature is not yet supported.');

    // const cart = await this.getCartById({ id, storeKey });
    // const cartVersion = cart.version;

    // return this.apiRoot
    //   .inStoreKeyWithStoreKeyValue({ storeKey })
    //   .carts()
    //   .withId({ ID: id })
    //   .post({
    //     body: {
    //       version: cartVersion,
    //       actions: [
    //         {
    //           action: 'addLineItem',
    //           sku,
    //           quantity,
    //         },
    //       ],
    //     },
    //   })
    //   .execute()
    //   .then((response) => response.body);
  }

  async applyDiscountCodeToCart(discountCodeDetails: DiscountCodeApplyDto) {
    const { id, storeKey, discountCode } = discountCodeDetails;

    const cart = await this.getCartById({ id, storeKey });
    const cartVersion = cart.version;

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'addDiscountCode',
              code: discountCode,
            },
          ],
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

    cart = await this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
          actions: [
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
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);

    cartVersion = cart.version;

    const matchingShippingMethod = await this.fetchMatchingShippingMethod(
      id,
      storeKey,
    );

    cart = await this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'setShippingMethod',
              shippingMethod: {
                typeId: 'shipping-method',
                id: matchingShippingMethod.id,
              },
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);

    return cart;
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
