import { IntersectionType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsPositive } from 'class-validator';

export class OrderCreateBodyDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  cartVersion: number;
}

export class OrderCreateParamsDto {
  @IsString()
  @IsNotEmpty()
  storeKey: string;
}

export class OrderCreateDto extends IntersectionType(
  OrderCreateBodyDto,
  OrderCreateParamsDto,
) {}
