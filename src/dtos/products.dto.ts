import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsLocale,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
} from 'class-validator';

export class ProductsSearchDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  storeKey?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  facets?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsLocale()
  locale?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  country?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsISO4217CurrencyCode()
  currency?: string;
}
