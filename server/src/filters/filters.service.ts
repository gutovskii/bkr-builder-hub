import { Injectable } from '@nestjs/common';
import { FiltersRepository } from './filters.repository';

@Injectable()
export class FiltersService {
  constructor(private readonly filtersRepository: FiltersRepository) {}

  getComponentsFilters(componentType: string) {
    return this.filtersRepository.getComponentsFilters(componentType);
  }

  getBuildsFilters() {
    return this.filtersRepository.getBuildsFilters();
  }
}
