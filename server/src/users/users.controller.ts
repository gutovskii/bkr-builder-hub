import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@zenstackhq/runtime';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(ENHANCED_PRISMA)
    private readonly prisma: PrismaClient,
  ) {}

  @Get(':nickname')
  @UseGuards(AuthGuard)
  findOne(@Param('nickname') nickname: string) {
    return this.prisma.userEntity.findFirst({
      where: { nickname },
      include: {
        createdBuilds: {
          where: { isDeleted: false },
          include: { user: true },
        },
      },
    });
  }
}
