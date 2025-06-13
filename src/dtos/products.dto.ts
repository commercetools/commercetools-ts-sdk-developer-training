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

  @IsNotEmpty()
  @IsString()
  storeKey: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  facets?: boolean;

  @IsLocale()
  locale: string;

  @IsISO31661Alpha2()
  country: string;

  @IsISO4217CurrencyCode()
  currency: string;
}
