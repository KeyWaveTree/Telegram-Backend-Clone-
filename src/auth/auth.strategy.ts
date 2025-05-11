//기능적인 부분들은 관리해주는 파일

import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/common/types/jwt.types';

@Injectable() //의존성 주입
export class AuthAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access_token',
) {
  constructor(configService: ConfigService) {
    const secreKey = configService.config.SECRET_TOKEN;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => req?.cookies?.access_token as string,
      ]),
      secretOrKey: secreKey,
      passReqToCallback: false, //'validate' 에서 'req'를 사용하지 않으므로 false 설정
    });
  }
  validate(payload: AccessTokenPayload): AccessTokenPayload {
    return payload; //Passport가 자동으로 req.user에 할당함.
  }
}

//만약 passReqToCallBack에서 Error가 날때 passport -jwt 모듈이 없다는 뜻이므로
//npm install passport-jwt를 해준다.
