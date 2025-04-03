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

  async create(createCommentDto: CreateCommentDto) {
    const createdComment = await this.prismaService.buildComment.create({
      data: {
        text: createCommentDto.text,
        rating: createCommentDto.rating,
        user: {
          connect: { id: createCommentDto.userId },
        },
        build: {
          connect: { id: createCommentDto.buildId },
        },
      },
    });

    if (createCommentDto.rating) {
      const build = await this.prismaService.buildEntity.findFirst({
        where: { id: createCommentDto.buildId },
        include: { buildComments: true },
      });

      build.rating =
        build.buildComments.reduce((acc, curr) => curr.rating + acc, 0) /
        build.buildComments.filter((c) => c.rating).length;

      await this.prismaService.buildEntity.update({
        where: { id: build.id },
        data: { rating: build.rating },
      });
    }

    return createdComment;
  }

  async findAll(pagination: PaginationConfig, buildId: string) {
    const results = await this.prismaService.buildComment.findMany({
      where: {
        buildId,
      },
      orderBy: {
        createdAt: 'desc',
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

  async remove(id: string) {
    const deletedComment = await this.prismaService.buildComment.delete({
      where: { id },
    });

    const build = await this.prismaService.buildEntity.findFirst({
      where: {
        id: deletedComment.buildId,
      },
      include: {
        buildComments: true,
      },
    });

    if (build.buildComments.length) {
      build.rating = build.rating =
        build.buildComments.reduce((acc, curr) => curr.rating + acc, 0) /
        build.buildComments.filter((c) => c.rating).length;
    } else {
      build.rating = 0;
    }

    await this.prismaService.buildEntity.update({
      where: { id: build.id },
      data: { rating: build.rating },
    });

    return deletedComment;
  }
}
