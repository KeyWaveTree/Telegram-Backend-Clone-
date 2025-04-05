import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { ApiRoutes } from '../common/constants/api-routes'
import { Response } from 'express';
//모듈을 만들것임 -> 프로토콜 api를 만든다.
@Controller()
export class AuthController {
  //의존성 주입
  constructor(private readonly authService: AuthService) {}

  //로그인 기능
  @Post('auth/login')
  async authLogin(
    @Body() { id, password }: { id: string; password: string },
    @Res() res: Response,
  ): Promise<Response> {
    const authEntity = this.authService.getAccount(id, password);

    //계정이 유효하지 않은 경우
    if (authEntity === undefined) {
      //로그인 실패 응답
      return res.status(401).end();
    }

    //계정이 유효한 경우 access token 발급
    const accessToken = await this.authService.createAccessToken({
      id: id,
      nickname: authEntity.nickname,
    });

    //쿠키에 토큰 저장
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.cookie('access_token', accessToken, { httpOnly: true });

    //로그인 성공 응답
    return res.status(200).json({ accessToken: accessToken });
  }

  //회원가입 기능
  @Post('auth/signup')
  async authSignup(
    @Res() res: Response,
    @Body()
    {
      id,
      password,
      nickname,
    }: { id: string; password: string; nickname: string },
  ): Promise<Response> {
    const authEntity = this.authService.getAccount(id, password);

    //계정이 존재하는 경우
    if (authEntity !== undefined) {
      //로그인 실패 응답
      return res.status(401).end();
    }

    //계정이 없는 경우 가입 진행
    //acess token 발급
    const accessToken = await this.authService.createAccessToken({
      id: id,
      nickname: nickname,
    });

    //class 변수명이 키와 value가 같다면 value를 생략해도 문제 없음.
    return res.status(200).json({ accessToken, nickname });
  }

  //로그아웃 기능
  @Post('auth/logout')
  authLogout(@Res() res: Response) {
    //쿠키 토큰 삭제
    res.clearCookie('access_token');
    return res.status(200).end();
  }
}
