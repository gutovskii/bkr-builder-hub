import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface FilterQuery {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class QueryFilterPipe implements PipeTransform {
  transform(query: any): FilterQuery {
    console.log(query);

    if (!query.filters) {
      return {};
    }

    const filters = query.filters;

    const parsedFilters: FilterQuery = { where: {} };

    for (let key of Object.keys(filters)) {
      if (key === 'sortBy' || key === 'sortOrder') continue;

      if (Array.isArray(filters[key]?.characteristics)) {
        parsedFilters.where[key] = { in: filters[key].characteristics };
      } else if (
        typeof filters[key] === 'object' &&
        (filters[key].minValue !== undefined ||
          filters[key].maxValue !== undefined)
      ) {
        const filterSettings = {
          ...(filters[key].minValue !== undefined
            ? { gte: this.parseNumber(filters[key].minValue, `${key}.min`) }
            : {}),
          ...(filters[key].maxValue !== undefined
            ? { lte: this.parseNumber(filters[key].maxValue, `${key}.max`) }
            : {}),
        };
        if (key === 'price') key = 'lowestPrice'; // todo remove after next scrapping session (price => lowestPrice)
        parsedFilters.where[key] = filterSettings;
      } else {
        parsedFilters.where[key] = filters[key];
      }
    }

    if (filters.sortBy && filters.sortOrder) {
      parsedFilters.orderBy = {
        [filters.sortBy]:
          filters.sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
      };
    }

    console.log(parsedFilters);

    return parsedFilters;
  }

  private parseNumber(value: any, fieldName: string): number {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new BadRequestException(`${fieldName} must be a valid number`);
    }
    return parsed;
  }
}
