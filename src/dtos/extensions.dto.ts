import { IntersectionType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsBoolean, IsEmail } from 'class-validator';

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

export class CustomObjectUpdateBodyDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CustomObjectUpdateParamsDto {
  @IsString()
  @IsNotEmpty()
  container: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}

export class CustomObjectUpdateDto extends IntersectionType(
  CustomObjectUpdateBodyDto,
  CustomObjectUpdateParamsDto,
) {}

export class CustomObjectCreateBodyDto {
  @IsString()
  @IsNotEmpty()
  container: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}
