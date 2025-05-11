import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
//import { ApiRoutes } from '../common/constants/api-routes'
import { Response } from 'express';
import { AuthAccessTokenStrategy } from './auth.strategy';
import {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthSignupRequestDto,
  AuthSignupResponseDto,
} from './auth.dto';

/**모듈을 만들것이다. -> 프로토콜 api를 만든다.
 * @class
 */
@Controller('auth')
export class AuthController {
  /** 의존성 주입
   * @param authService
   */
  constructor(private readonly authService: AuthService) {}

  /**@Post('login') 로그인 기능(post 요청에 /login을 통해 들어가야 한다.)
   * @param authLoginDto
   * nestjs/common의 annotation Body() 사용
   *
   * @param res nestjs/common의 annotation Res({passthrough:true})
   * 의미: 응답 객체를 가지고온다. nest는 두종류의 respones 옵션을 제공하는데 두 옵션중 하나만 사용할 수 있다. Res를 호출하면 standard 옵션 자동으로 비활성화 된다.
   * Standard : 핸들러가 객체 또는 배열인 경우 자동으로 json 직렬화(원시타입 제외)
   * 상태코드는 항상 기본 200, POST의 경우 201이다. 상태코드 사용 HttpCode 데코레이터 이용
   * Library-specific: 특정 라이브러리의 response 객체를 의미함 이러한 객체는 Res() 데코레이터를 사용 호출
   */
  @Post('login')
  async authLogin(
    @Body() authLoginDto: AuthLoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthLoginResponseDto> {
    //Login에 필요한 유저 이름과 비밀번호를 가지고와라
    const { username, password } = authLoginDto;

    //async의 promiss상태가 바뀐다면 await인
    const authEntity = await this.authService.getAccount(username, password);
    if (!authEntity) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    const { nickname, publicKey, encryptedPrivateKey } = authEntity;

    const accessToken = await this.authService.createAccessToken({
      id: authEntity.id,
      nickname: authEntity.nickname,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      accessToken,
      nickname,
      publicKey,
      encryptedPrivateKey,
      id: authEntity.id,
    };
  }

  //회원가입 기능
  @Post('signup')
  async authSignup(
    @Body() authSignupDto: AuthSignupRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSignupResponseDto> {
    const { username, password, nickname } = authSignupDto;

    const existingUser = await this.authService.getAccount(username, password);
    //계정이 존재하는 경우
    if (existingUser !== null) {
      //로그인 실패 응답
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    //계정이 없는 경우 가입 진행
    const newUser = await this.authService.createAccount(
      username,
      password,
      nickname,
    );

    if (!newUser) {
      throw new InternalServerErrorException('회원가입 실패했습니다.');
    }

    //acess token 발급
    const accessToken = await this.authService.createAccessToken({
      id: newUser.id,
      nickname: newUser.nickname,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      accessToken,
      nickname: newUser.nickname,
      encryptedPrivateKey: newUser.encryptedPrivateKey,
      publicKey: newUser.publicKey,
    };
  }

  //로그아웃 기능
  @UseGuards(AuthAccessTokenStrategy) //로그인 된 사용자만 로그아웃 시키도록 가드
  @Post('auth/logout')
  authLogout(@Res() res: Response) {
    //쿠키 토큰 삭제
    res.clearCookie('access_token');
    return res.status(200).end();
  }
}

// 이전 코드 (데이터베이스 적용X)

// @Controller()
// export class AuthController {
//   //의존성 주입
//   constructor(private readonly authService: AuthService) {}

//   /**@Post() 로그인 기능
//    * @param {string} id @Body()
//    * @param {string} password @Body()
//    * @param {Response} res @Res()
//    * @returns {Promise<Response>}
//    */
//   @Post('auth/login')
//   async authLogin(
//     @Body() { id, password }: { id: string; password: string },
//     @Res() res: Response,
//   ): Promise<Response> {
//     //http Post로 받은 json 데이터가 정말 있는지 argument로 확인하여 실제 데이터를 return 받는다.
//     const authEntity = this.authService.getAccount(id, password);

//     //계정이 유효하지 않은 경우(argument로 보낸 데이터가 없다면)
//     if (authEntity === undefined) {
//       //로그인 실패 응답 Response에 state를 보내고 종료를 해야 한다.(state 보내고 end()함수를 안적으면 무한 루프 발생)
//       return res.status(401).end();
//     }

//     //계정이 유효한 경우 access token 발급
//     const accessToken = await this.authService.createAccessToken({
//       id: id,
//       nickname: authEntity.nickname,
//     });

//     //쿠키에 토큰 저장
//     res.setHeader('Authorization', `Bearer ${accessToken}`);
//     res.cookie('access_token', accessToken, { httpOnly: true });

//     //로그인 성공 응답
//     return res.status(200).json({ accessToken: accessToken });
//   }

//   //회원가입 기능
//   @Post('auth/signup')
//   async authSignup(
//     @Res() res: Response,
//     @Body()
//     {
//       id,
//       password,
//       nickname,
//     }: { id: string; password: string; nickname: string },
//   ): Promise<Response> {
//     const authEntity = this.authService.getAccount(id, password);

//     //계정이 존재하는 경우
//     if (authEntity !== undefined) {
//       //로그인 실패 응답
//       return res.status(401).end();
//     }

//     //계정이 없는 경우 가입 진행
//     //acess token 발급
//     const accessToken = await this.authService.createAccessToken({
//       id: id,
//       nickname: nickname,
//     });

//     //class 변수명이 키와 value가 같다면 value를 생략해도 문제 없음.
//     return res.status(200).json({ accessToken, nickname });
//   }

//   //로그아웃 기능
//   @UseGuards(AuthAccessTokenStrategy) //로그인 된 사용자만 로그아웃 시키도록 가드
//   @Post('auth/logout')
//   authLogout(@Res() res: Response) {
//     //쿠키 토큰 삭제
//     res.clearCookie('access_token');
//     return res.status(200).end();
//   }
// }
