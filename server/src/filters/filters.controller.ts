import { Controller, Get, Param } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('components/:componentType')
  getComponentsFilters(@Param('componentType') componentType: string) {
    return this.filtersService.getComponentsFilters(componentType);
  }

  @Get('builds')
  getBuildsFilters() {
    return this.filtersService.getBuildsFilters();
  }
}
