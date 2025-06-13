import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsPositive,
  IsEmail,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
} from 'class-validator';

export class CartCreateBodyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sessionId?: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsISO31661Alpha2()
  country: string;

  @IsISO4217CurrencyCode()
  currency: string;
}

export class CartCreateParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;
}

export class CartCreateDto extends IntersectionType(
  CartCreateBodyDto,
  CartCreateParamsDto,
) {}

export class CartGetParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
export class LineItemsAddBodyDto {
  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  supplyChannelKey?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  distributionChannelKey?: string;
}

export class LineItemsAddParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class LineItemsAddDto extends IntersectionType(
  LineItemsAddBodyDto,
  LineItemsAddParamsDto,
) {}
export class DiscountCodeApplyBodyDto {
  @IsString()
  @IsNotEmpty()
  discountCode: string;
}

export class DiscountCodeApplyParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class DiscountCodeApplyDto extends IntersectionType(
  DiscountCodeApplyBodyDto,
  DiscountCodeApplyParamsDto,
) {}

export class ShippingAddressUpdateBodyDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsISO31661Alpha2()
  country: string;

  @IsEmail()
  email: string;
}

export class ShippingAddressUpdateParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class ShippingAddressUpdateDto extends IntersectionType(
  ShippingAddressUpdateBodyDto,
  ShippingAddressUpdateParamsDto,
) {}

export class ShippingMethodUpdateParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class ShippingMethodUpdateBodyDto {
  @IsNotEmpty()
  @IsString()
  shippingMethodId: string;
}

export class ShippingMethodUpdateDto extends IntersectionType(
  ShippingMethodUpdateParamsDto,
  ShippingMethodUpdateBodyDto,
) {}
