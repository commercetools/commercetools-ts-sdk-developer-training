import { Controller, Get } from '@nestjs/common';
import { ProjectSettingsService } from 'src/services/project-settings.service';

@Controller('api/project-settings')
export class ProjectSettingsController {
  constructor(
    private readonly projectSettingsService: ProjectSettingsService,
  ) {}

  @Get('countries')
  getAllCountries() {
    return this.projectSettingsService.getCountries();
  }
}
