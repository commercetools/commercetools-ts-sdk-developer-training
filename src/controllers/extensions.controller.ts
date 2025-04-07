import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ExtensionsService } from '../services/extensions.service';
import {
  CustomObjectUpdateBodyDto,
  CustomObjectUpdateParamsDto,
} from 'src/dtos/extensions.dto';
import { CustomObjectCreateBodyDto } from 'src/dtos/extensions.dto';

@Controller('api/extensions')
export class ExtensionsController {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Post('types')
  createType() {
    return this.extensionsService.createCustomType();
  }

  @Post('custom-objects')
  createCustomObject(
    @Body() createCustomObjectBodyDto: CustomObjectCreateBodyDto,
  ) {
    return this.extensionsService.createCustomObject(createCustomObjectBodyDto);
  }

  @Post('custom-objects/:container/:key')
  updateCustomObject(
    @Param() customObjectParams: CustomObjectUpdateParamsDto,
    @Body() customObjectData: CustomObjectUpdateBodyDto,
  ) {
    return this.extensionsService.updateCustomObject({
      ...customObjectData,
      ...customObjectParams,
    });
  }

  @Get('custom-objects/:container/:key')
  getCustomObject(@Param() customObjectParams: CustomObjectUpdateParamsDto) {
    return this.extensionsService.getCustomObject(customObjectParams);
  }
}
