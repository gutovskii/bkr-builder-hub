import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@zenstackhq/runtime';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { Request } from 'express';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.user;
    const commentId = request.params.id;

    if (!user || !commentId) {
      throw new ForbiddenException('User or comment ID missing');
    }

    const comment = await this.prisma.buildComment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }

    if (comment.userId !== user.id) {
      throw new ForbiddenException('You do not own this comment');
    }

    return request.user.isAdmin && true;
  }
}
