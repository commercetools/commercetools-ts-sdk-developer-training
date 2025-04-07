import { IntersectionType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class OrdersGetParamsDto {
  @IsString()
  @IsNotEmpty()
  storeKey: string;
}

export class OrdersGetQueryParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class OrdersGetBodyDto {}

export class OrdersGetDto extends IntersectionType(
  OrdersGetBodyDto,
  OrdersGetParamsDto,
  OrdersGetQueryParamsDto,
) {}
