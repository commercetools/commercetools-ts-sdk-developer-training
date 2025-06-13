import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { OrderCreateBodyDto, OrderCreateParamsDto } from 'src/dtos/orders.dto';
import { OrdersService } from '../services/orders.service';
import {
  CustomFieldsUpdateBodyDto,
  CustomFieldsUpdateDto,
  CustomFieldsUpdateParamsDto,
} from 'src/dtos/extensions.dto';

@Controller('api/in-store/:storeKey/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Param() orderParams: OrderCreateParamsDto,
    @Body() orderData: OrderCreateBodyDto,
  ) {
    return this.ordersService.createOrder({
      ...orderParams,
      ...orderData,
    });
  }

  @Post(':orderNumber/custom-fields')
  @HttpCode(200)
  updateOrderCustomFields(
    @Param() customFieldsParams: CustomFieldsUpdateParamsDto,
    @Body() customFieldsData: CustomFieldsUpdateBodyDto,
  ) {
    return this.ordersService.updateOrderCustomFields({
      ...customFieldsParams,
      ...customFieldsData,
    });
  }
}
