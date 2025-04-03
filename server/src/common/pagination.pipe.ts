import { Injectable, PipeTransform } from '@nestjs/common';

type PaginateQuery = {
  page: number;
  pageSize?: number;
};

export type PaginationConfig = {
  skip: number;
  take: number;
  page: number;
};

export const PAGE_SIZE = 9;

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(query: PaginateQuery): PaginationConfig {
    if (!query.page) {
      query.page = 1;
    }

    return {
      skip: (query.page - 1) * (query.pageSize ?? PAGE_SIZE),
      take: Number(query.pageSize ?? PAGE_SIZE),
      page: Number(query.page),
    };
  }
}
