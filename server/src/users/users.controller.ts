import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PrismaClient } from '@zenstackhq/runtime';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { formatDate } from 'src/common/helpers';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(ENHANCED_PRISMA)
    private readonly prisma: PrismaClient,
  ) {}

  @Get(':nickname')
  @UseGuards(AuthGuard)
  async findOne(@Param('nickname') nickname: string) {
    const user = await this.prisma.userEntity.findFirst({
      where: { nickname },
      include: {
        createdBuilds: {
          where: { isDeleted: false },
          include: { user: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with nickname ${nickname} not found`);
    }

    return { ...user, createdAt: formatDate(user.createdAt) };
  }
}
