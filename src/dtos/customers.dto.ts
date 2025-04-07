import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsISO31661Alpha2,
  IsBoolean,
} from 'class-validator';

export class CustomerRegisterBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  anonymousCartId?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;

  @IsOptional()
  @IsBoolean()
  defaultShippingAddress?: boolean;

  @IsOptional()
  @IsBoolean()
  defaultBillingAddress?: boolean;
}

export class CustomerRegisterParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;
}

export class CustomerRegisterDto extends IntersectionType(
  CustomerRegisterBodyDto,
  CustomerRegisterParamsDto,
) {}

export class CustomerAuthenticateBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  anonymousCartId?: string;
}

export class CustomerAuthenticateParamsDto {
  @IsNotEmpty()
  @IsString()
  storeKey: string;
}

export class CustomerAuthenticateDto extends IntersectionType(
  CustomerAuthenticateBodyDto,
  CustomerAuthenticateParamsDto,
) {}
