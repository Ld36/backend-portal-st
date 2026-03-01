import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserType = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-type'] || 'externo';
  },
);