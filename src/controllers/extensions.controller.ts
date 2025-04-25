import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ExtensionsService } from '../services/extensions.service';
import { CustomObjectCreateUpdateBodyDto } from '../dtos/extensions.dto';

@Controller('api/extensions')
export class ExtensionsController {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Post('types')
  createType() {
    return this.extensionsService.createCustomType();
  }

  @Post('custom-objects')
  createUpdateCustomObject(
    @Body() customObjectCreateUpdateBodyDto: CustomObjectCreateUpdateBodyDto,
  ) {
    return this.extensionsService.createUpdateCustomObject(
      customObjectCreateUpdateBodyDto,
    );
  }

  @Get('custom-objects')
  getCustomObject() {
    return this.extensionsService.getCustomObject();
  }
}
