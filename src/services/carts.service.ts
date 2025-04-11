import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
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

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
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
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
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

    return this.apiRoot
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
  }

  async updateCartShippingMethod(
    shippingMethodDetails: ShippingMethodUpdateDto,
  ) {
    const { id, storeKey, shippingMethodId } = shippingMethodDetails;

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
              action: 'setShippingMethod',
              shippingMethod: {
                typeId: 'shipping-method',
                id: shippingMethodId,
              },
            },
          ],
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
