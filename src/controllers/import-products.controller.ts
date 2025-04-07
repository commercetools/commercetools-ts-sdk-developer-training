import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImportProductsService } from '../services/import-products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('api/import-products')
export class ImportProductsController {
  constructor(private readonly importProductsService: ImportProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 'file' is the key used in the formData
  async uploadProductImportFile(@UploadedFile() file: Request['file']) {
    if (file) {
      const csvString = file.buffer.toString(); // Convert Buffer to String
      return this.importProductsService.importProductData(csvString);
    }
    return { message: 'No file uploaded' };
  }

  @Get('summary/:importContainerKey')
  getImportSummary(@Param('importContainerKey') importContainerKey: string) {
    return this.importProductsService.getImportSummary(importContainerKey);
  }
}
