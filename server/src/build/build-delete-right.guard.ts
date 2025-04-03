import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { Request } from 'express';

@Injectable()
export class BuildDeleteRightGuard implements CanActivate {
  constructor(
    @Inject(ENHANCED_PRISMA)
    private readonly prisma: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;
    const buildId = req.params.id as string;

    if (!user) return false;
    if (!buildId) return false;

    const build = await this.prisma.buildEntity.findUnique({
      where: {
        id: buildId,
      },
    });

    return user.id === build.userId && user.isAdmin;
  }
}
