import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import {
  CustomerAuthenticateBodyDto,
  CustomerAuthenticateParamsDto,
  CustomerRegisterBodyDto,
  CustomerRegisterParamsDto,
} from '../dtos/customers.dto';

@Controller('/api/in-store/:storeKey/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  registerCustomer(
    @Param() customerRegisterationParams: CustomerRegisterParamsDto,
    @Body() customerRegisterationData: CustomerRegisterBodyDto,
  ) {
    return this.customersService.createCustomer({
      ...customerRegisterationParams,
      ...customerRegisterationData,
    });
  }

  @Post('login')
  @HttpCode(200)
  authenticateCustomer(
    @Param() customerAuthenticationParams: CustomerAuthenticateParamsDto,
    @Body() customerAuthenticationData: CustomerAuthenticateBodyDto,
  ) {
    return this.customersService.authenticateCustomer({
      ...customerAuthenticationParams,
      ...customerAuthenticationData,
    });
  }
}
