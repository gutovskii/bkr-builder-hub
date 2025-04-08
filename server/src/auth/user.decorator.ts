import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from './user.payload';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const key = 'key';

    if (request.user) return request.user;

    if (!request.user && (!authHeader || !authHeader.startsWith('Bearer ')))
      return null;

    const token = authHeader.split(' ')[1];
    try {
      request.user = jwt.verify(token, key) as UserPayload;
      return request.user;
    } catch {
      return null;
    }
  },
);
