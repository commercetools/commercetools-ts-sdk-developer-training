import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartsService } from '../services/carts.service';
import {
  CartCreateBodyDto,
  CartCreateParamsDto,
  CartGetParamsDto,
  DiscountCodeApplyBodyDto,
  DiscountCodeApplyParamsDto,
  LineItemsAddBodyDto,
  LineItemsAddParamsDto,
  ShippingAddressUpdateBodyDto,
  ShippingAddressUpdateParamsDto,
  ShippingMethodUpdateBodyDto,
  ShippingMethodUpdateParamsDto,
} from '../dtos/carts.dto';

@Controller('api/in-store/:storeKey/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':id')
  getCart(@Param() cartParams: CartGetParamsDto) {
    return this.cartsService.getCartById(cartParams);
  }

  @Post()
  createAnonymousCart(
    @Param() cartParams: CartCreateParamsDto,
    @Body() cartData: CartCreateBodyDto,
  ) {
    return this.cartsService.createCart({
      ...cartParams,
      ...cartData,
    });
  }

  @Post(':id/lineitems')
  addLineItems(
    @Param() lineItemsParams: LineItemsAddParamsDto,
    @Body() lineItemsData: LineItemsAddBodyDto,
  ) {
    return this.cartsService.addLineItemsToCart({
      ...lineItemsParams,
      ...lineItemsData,
    });
  }

  @Post(':id/discount-codes')
  applyDiscountCode(
    @Param() discountCodeParams: DiscountCodeApplyParamsDto,
    @Body() discountCodeData: DiscountCodeApplyBodyDto,
  ) {
    return this.cartsService.applyDiscountCodeToCart({
      ...discountCodeParams,
      ...discountCodeData,
    });
  }

  @Post(':id/shipping-address')
  updateShippingAddress(
    @Param() shippingAddressParams: ShippingAddressUpdateParamsDto,
    @Body() shippingAddressData: ShippingAddressUpdateBodyDto,
  ) {
    return this.cartsService.updateCartShippingAddress({
      ...shippingAddressParams,
      ...shippingAddressData,
    });
  }

  @Post(':id/shipping-method')
  updateShippingMethod(
    @Param() shippingMethodParams: ShippingMethodUpdateParamsDto,
    @Body() shippingMethodData: ShippingMethodUpdateBodyDto,
  ) {
    return this.cartsService.updateCartShippingMethod({
      ...shippingMethodParams,
      ...shippingMethodData,
    });
  }
}
