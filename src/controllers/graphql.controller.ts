import { Controller, Param, Get, Query } from '@nestjs/common';
import { GraphqlService } from '../services/graphql.service';
import {
  OrdersGetParamsDto,
  OrdersGetQueryParamsDto,
} from 'src/dtos/graphql.dto';

@Controller('api/in-store/:storeKey/graphql')
export class GraphqlController {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Get('orders')
  getOrdersByEmail(
    @Param() orderParams: OrdersGetParamsDto,
    @Query() orderQuery: OrdersGetQueryParamsDto,
  ) {
    return this.graphqlService.getOrdersByEmail({
      ...orderParams,
      ...orderQuery,
    });
  }
}
