//사용자 정의 데코레이터를 만들어서 post에서 생성 및 주입을 하기 위한 목적

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/common/types/jwt.types';

/** 의존성 주입하여
 *
 */
export const AuthInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as AccessTokenPayload;
  },
);
