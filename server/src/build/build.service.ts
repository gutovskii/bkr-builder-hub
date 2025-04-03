import { Inject, Injectable } from '@nestjs/common';
import { PAGE_SIZE, PaginationConfig } from 'src/common/pagination.pipe';
import { PrismaClient } from '@zenstackhq/runtime';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { AwsService } from 'src/aws/aws.service';
import * as uuid from 'uuid';
import { FilterQuery } from 'src/components/pipes/query-filter.pipe';
import { CreateFullBuildDto } from './components-exist.pipe';
import { BUILDS_FILTER_KEY } from './build.controller';

@Injectable()
export class BuildService {
  constructor(
    @Inject(ENHANCED_PRISMA)
    private readonly prisma: PrismaClient,
    private readonly awsService: AwsService,
  ) {}

  async delete(id: string) {
    const buildToDelete = await this.prisma.buildEntity.findUnique({
      where: {
        id,
      },
    });

    const imgsKeys = buildToDelete.imgsUrls.map(
      (url) => url.match(/[^\/]+$/)[0],
    );

    await Promise.all(imgsKeys.map((key) => this.awsService.removeObject(key)));

    return this.prisma.buildEntity.delete({ where: { id } });
  }

  async create(
    dto: CreateFullBuildDto,
    imgs: Express.Multer.File[],
    userId: string,
  ) {
    dto.price = Number(dto.price);

    const imgsUrls = await Promise.all(
      imgs.map((img) => {
        return this.awsService.uploadFileByBuffer(
          uuid.v4(),
          '.png',
          img.buffer,
        );
      }),
    );

    const createdBuild = await this.prisma.buildEntity.create({
      data: {
        name: dto.name,
        price: dto.price,
        imgsUrls,
        user: {
          connect: { id: userId },
        },
        cases: {
          connect: dto.cases ? dto.cases.map((c) => ({ id: c.id })) : [],
        },
        videoCards: {
          connect: dto.videoCards
            ? dto.videoCards.map((c) => ({ id: c.id }))
            : [],
        },
        coolers: {
          connect: dto.coolers ? dto.coolers.map((c) => ({ id: c.id })) : [],
        },
        ssds: {
          connect: dto.ssds ? dto.ssds.map((c) => ({ id: c.id })) : [],
        },
        hdds: {
          connect: dto.hdds ? dto.hdds.map((c) => ({ id: c.id })) : [],
        },
        memories: {
          connect: dto.memories ? dto.memories.map((c) => ({ id: c.id })) : [],
        },
        powerSupplies: {
          connect: dto.powerSupplies
            ? dto.powerSupplies.map((c) => ({ id: c.id }))
            : [],
        },
        motherBoard: {
          connect: dto.motherBoard ? { id: dto.motherBoard.id } : null,
        },
        cpu: {
          connect: dto.cpu ? { id: dto.cpu.id } : null,
        },
      },
    });

    let buildFilters = await this.prisma.buildsFilters.findFirst();
    if (!buildFilters) {
      buildFilters = await this.prisma.buildsFilters.create({
        data: {
          filters: [],
          buildsFiltersKey: BUILDS_FILTER_KEY,
        },
      });
    }
    let buildPriceFilters = buildFilters.filters.find(
      (f) => f.title === 'price',
    );

    if (buildPriceFilters) {
      if (buildPriceFilters.minValue > createdBuild.price) {
        buildPriceFilters.minValue = createdBuild.price;
      } else if (buildPriceFilters.maxValue < createdBuild.price) {
        buildPriceFilters.maxValue = createdBuild.price;
      }
    } else {
      buildPriceFilters = {
        title: 'price',
        minValue: createdBuild.price,
        maxValue: createdBuild.price,
      };
      buildFilters.filters.push(buildPriceFilters);
    }

    console.log(buildFilters);

    await this.prisma.buildsFilters.update({
      where: { buildsFiltersKey: BUILDS_FILTER_KEY },
      data: buildFilters,
    });

    return createdBuild;
  }

  findOne(id: string) {
    return this.prisma.buildEntity.findUnique({
      where: { id },
      include: {
        cpu: true,
        cases: true,
        videoCards: true,
        ssds: true,
        memories: true,
        motherBoard: true,
        hdds: true,
        powerSupplies: true,
        coolers: true,
      },
    });
  }

  async findAll(
    name: string,
    pagination: PaginationConfig,
    filters: FilterQuery,
  ) {
    const totalCount = await this.prisma.buildEntity.count({
      where: {
        ...filters.where,
        name: {
          contains: name,
        },
      },
    });
    const totalPages =
      (totalCount / PAGE_SIZE) % 10 >= 1
        ? Math.round(totalCount / PAGE_SIZE) + 1
        : Math.round(totalCount / PAGE_SIZE);

    const results = await this.prisma.buildEntity.findMany({
      where: {
        ...filters.where,
        name: {
          contains: name,
        },
      },
      orderBy: filters.orderBy,
      skip: pagination.skip,
      take: pagination.take,
      include: {
        user: true,
      },
    });

    return {
      results,
      totalPages,
      totalCount,
      page: pagination.page,
    };
  }
}
