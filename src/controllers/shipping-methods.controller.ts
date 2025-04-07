import { ShippingMethodsService } from '../services/shipping-methods.service';
import { Controller, Get, Head, Param, Query } from '@nestjs/common';

@Controller('api/shipping-methods')
export class ShippingMethodsController {
  constructor(
    private readonly shippingMethodsService: ShippingMethodsService,
  ) {}

  @Get()
  getAllShippingMethods(@Query('countryCode') countryCode?: string) {
    if (countryCode) {
      return this.shippingMethodsService.getShippingMethodsByLocation(
        countryCode,
      );
    }
    return this.shippingMethodsService.getAllShippingMethods();
  }

  @Get(':key')
  getShippingMethodByKey(@Param('key') key: string) {
    return this.shippingMethodsService.getShippingMethodByKey(key);
  }

  @Head(':key')
  checkShippingMethodExistence(@Param('key') key: string) {
    return this.shippingMethodsService.checkShippingMethodExists(key);
  }
}
