import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductsSearchDto } from 'src/dtos/products.dto';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async searchProducts(@Query() searchParams: ProductsSearchDto) {
    return await this.productsService.searchProducts(searchParams);
  }
}
