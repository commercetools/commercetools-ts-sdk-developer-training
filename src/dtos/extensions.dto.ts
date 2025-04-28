import { IntersectionType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CustomFieldsUpdateBodyDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;
}

export class CustomFieldsUpdateParamsDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsString()
  @IsNotEmpty()
  storeKey: string;
}

export class CustomFieldsUpdateDto extends IntersectionType(
  CustomFieldsUpdateBodyDto,
  CustomFieldsUpdateParamsDto,
) {}

export class CustomObjectCreateUpdateBodyDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
