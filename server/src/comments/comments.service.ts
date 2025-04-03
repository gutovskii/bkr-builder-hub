import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@zenstackhq/runtime';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { PAGE_SIZE, PaginationConfig } from 'src/common/pagination.pipe';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(ENHANCED_PRISMA) private readonly prismaService: PrismaClient,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return this.prismaService.buildComment.create({
      data: createCommentDto,
    });
  }

  async findAll(pagination: PaginationConfig, buildId: string) {
    const results = await this.prismaService.buildComment.findMany({
      where: {
        buildId,
      },
      skip: pagination.skip,
      take: pagination.take,
    });

    const totalCount = await this.prismaService.buildComment.count();
    const totalPages = Math.round(totalCount / PAGE_SIZE);

    return {
      results,
      totalPages,
      totalCount,
      page: pagination.page,
    };
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.prismaService.buildComment.update({
      where: {
        id,
      },
      data: updateCommentDto,
    });
  }

  remove(id: string) {
    return this.prismaService.buildComment.delete({
      where: { id },
    });
  }
}
