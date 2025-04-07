import { Controller, Get } from '@nestjs/common';
import { StoresService } from '../services/stores.service';

@Controller('api/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  getAllStores() {
    return this.storesService.getAllStores();
  }
}
