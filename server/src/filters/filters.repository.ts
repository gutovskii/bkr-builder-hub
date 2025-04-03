import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@zenstackhq/runtime';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { BUILDS_FILTER_KEY } from 'src/build/build.controller';

@Injectable()
export class FiltersRepository {
  constructor(
    @Inject(ENHANCED_PRISMA) private readonly prismaService: PrismaClient,
  ) {}

  async getComponentsFilters(componentType: string) {
    const filter = await this.prismaService.componentsFilters.findFirst({
      where: {
        componentType,
      },
    });

    if (!filter) {
      throw new NotFoundException(
        `Component filter ${componentType} not found`,
      );
    }

    return filter;
  }

  async getBuildsFilters() {
    const filter = await this.prismaService.buildsFilters.findFirst({
      where: {
        buildsFiltersKey: BUILDS_FILTER_KEY,
      },
    });

    if (!filter) {
      throw new NotFoundException('No builds filters');
    }

    return filter;
  }
}
