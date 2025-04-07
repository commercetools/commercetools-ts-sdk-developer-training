import {
  CartAddLineItemAction,
  CartUpdateAction,
  ShippingMethod,
} from '@commercetools/platform-sdk';
import { ShippingAddressUpdateBodyDto } from 'src/dtos/carts.dto';

export class CartUpdateActionsBuilder {
  private actions: CartUpdateAction[] = [];

  addLineItem(
    sku: string,
    quantity?: number,
    distributionChannel?: string,
    supplyChannel?: string,
  ): this {
    const action: CartAddLineItemAction = {
      action: 'addLineItem',
      sku,
      quantity: quantity ?? 1,
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

    this.actions.push(action);
    return this;
  }

  applyDiscountCode(discountCode: string): this {
    this.actions.push({
      action: 'addDiscountCode',
      code: discountCode,
    });
    return this;
  }

  setShippingAddress(addressInfo: ShippingAddressUpdateBodyDto): this {
    const { country, firstName, lastName, email } = addressInfo;
    this.actions.push({
      action: 'setShippingAddress',
      address: {
        country,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
      },
    });
    return this;
  }

  setCustomerEmail(email: string): this {
    this.actions.push({
      action: 'setCustomerEmail',
      email,
    });
    return this;
  }

  setShippingMethod(shippingMethod: ShippingMethod): this {
    this.actions.push({
      action: 'setShippingMethod',
      shippingMethod: {
        typeId: 'shipping-method',
        id: shippingMethod.id,
      },
    });
    return this;
  }

  build(): CartUpdateAction[] {
    return this.actions;
  }
}
