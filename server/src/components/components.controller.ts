import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { FilterQuery, QueryFilterPipe } from './pipes/query-filter.pipe';
import {
  PAGE_SIZE,
  PaginationConfig,
  PaginationPipe,
} from 'src/common/pagination.pipe';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { PrismaClient } from '@zenstackhq/runtime';

@Controller('components')
export class ComponentsController {
  constructor(
    @Inject(ENHANCED_PRISMA)
    private readonly prismaService: PrismaClient,
  ) {}

  @Get()
  async getComponents(
    @Query('componentType') componentType: string,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query(QueryFilterPipe) filters: FilterQuery,
    @Query(PaginationPipe) pagination: PaginationConfig,
  ) {
    if (!this.prismaService[componentType]) {
      throw new BadRequestException('Invalid component type');
    }

    this.prismaService.videoCardComponent.findFirst({
      where: {
        volume: 100,
      },
    });

    const totalCount: number = await this.prismaService[componentType].count({
      where: {
        ...filters.where,
        componentUnifiedName: {
          contains: name,
        },
      },
    });
    const totalPages =
      (totalCount / PAGE_SIZE) % 10 >= 1
        ? Math.round(totalCount / PAGE_SIZE) + 1
        : Math.round(totalCount / PAGE_SIZE);

    const results = await this.prismaService[componentType].findMany({
      where: {
        ...filters.where,
        componentUnifiedName: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: filters.orderBy,
      skip: pagination.skip,
      take: pagination.take,
      include: {
        marketplacesComponents: true,
      },
    });

    return {
      results,
      totalPages,
      totalCount,
      page: pagination.page,
    };
  }

  @Get(':componentType/:id')
  async getComponent(
    @Param('componentType') componentType: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const unifiedComponent = await this.prismaService[componentType].findFirst({
      where: {
        id,
      },
      include: {
        marketplacesComponents: true,
      },
    });

    if (!unifiedComponent) {
      throw new NotFoundException(
        `Unified component with id: ${id} was not found`,
      );
    }

    return unifiedComponent;
  }
}
