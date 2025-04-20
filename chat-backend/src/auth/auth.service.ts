import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth, AuthDocument } from '../database/schema/auth.schema';
import { AccessTokenPayload } from '../common/types/jwt.types';
import { ConfigService } from 'src/config/config.service';
import { Model, Types } from 'mongoose';
import { Schemas } from 'src/database/schema';
import { InjectModel } from '@nestjs/mongoose';
import { encryptAES, generateRSAKeyPair } from 'src/common/utils/crypto-helper';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Schemas.Auth.name) private readonly authModel: Model<Auth>,
  ) {}

  // username(ID)과 password를 기반으로 유효한 계정을 찾고 비밀번호를 해시로 검증하는 메서드
  public async getAccount(
    username: string,
    password: string,
  ): Promise<AuthDocument | null> {
    // username으로 유저를 찾음
    const user = await this.authModel.findOne({ username }).exec();

    if (!user) {
      return null; // 유저가 존재하지 않으면 null 반환
    }

    // bcrypt를 사용하여 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null; // 비밀번호가 일치하지 않으면 null 반환
    }

    return user; // 비밀번호가 일치하면 유저 반환
  }
  // 회원가입 메서드
  public async createAccount(
    username: string, // 아이디 (username)
    password: string, // 비밀번호
    nickname: string, // 닉네임
  ): Promise<AuthDocument | null> {
    // 아이디 중복 검사
    const existingUser = await this.authModel.findOne({ username }).exec();
    if (existingUser) {
      throw new Error('아이디가 이미 존재합니다.'); // 이미 존재하는 아이디일 경우 예외 처리
    }

    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash(password, 10); // bcrypt로 비밀번호 해시화

    // 공개키 개인키 생성
    const { publicKey, privateKey } = generateRSAKeyPair();

    // 개인키를 대칭키로 암호화
    const encryptedPrivateKey = encryptAES(password, privateKey);

    // 새 사용자 객체 생성
    const newUser = new this.authModel({
      username,
      password: hashedPassword,
      nickname,
      publicKey,
      encryptedPrivateKey,
    });

    // 데이터베이스에 저장
    await newUser.save();

    return newUser;
  }

  // JWT Access Token 생성
  public async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.config.SECRET_TOKEN,
    });
  }

  public tryVerifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: this.configService.config.SECRET_TOKEN,
        ignoreExpiration: false, //만료된 토큰을 무시하지 않음
      });

      return payload;
    } catch {
      //유효하지 않은 토큰일 경우 null 반환
      return null;
    }
  }

  public async getAuthInfo(id: Types.ObjectId) {
    return await this.authModel.findOne({ id }).exec();
  }

  public async getAuthInfos(ids: Types.ObjectId[]) {
    return await this.authModel.find({ _id: ids }).exec();
  }
}

// @Injectable()
// export class AuthService {
//   constructor(
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   //dummyUser 데이터로 DB 연동시 제거 예정
//   private readonly users: Auth[] = [
//     {
//       id: uuidv4(),
//       username: 'admin',
//       password: '1234',
//       nickname: 'GOD',
//       permission: Permission.ADMIN,
//     },
//     {
//       id: uuidv4(),
//       username: 'user',
//       password: 'password',
//       nickname: 'James',
//       permission: Permission.USER,
//     },
//   ];

//   /** dummayUser에서 유효한 username과 password인지 확인하는 메서드
//    * @param {string} id
//    * @param {string} password
//    * @returns {Auth | undefined}
//    */
//   public getAccount(id: string, password: string): Auth | undefined {
//     //유저 데이터 iterator의 name 정보와 파라미터로 받은 id 정보가 완전히 같은 경우 그리고
//     //iterator의 password 정보와 파라미터로 받은 password 정보가 완전히 같은 경우인 데이터를 넣어라
//     const authEntity = this.users.find(
//       (it) => it.username == id && it.password == password,
//     );

//     //찾은 유저 정보를 return
//     return authEntity;
//   }

//   /**유효한 크래딧이 있는지 검사
//    * @param {string} id
//    * @param {string} password
//    * @returns {boolean}
//    */
//   public isValidCredentials(id: string, password: string): boolean {
//     return this.users.some(
//       //some은 있는지 없는지 확인하는 method이다.
//       //유저 데이터 iterator의 'username' 인덱스 항목이 파라미터로 받은 id 정보와 완전히 같은경우 그리고
//       //iterator의 'password' 인덱스 항목이 파라미터로 받은 password 정보와 완전히 같은 경우인 데이터가 있는지 확인해서 return 해라
//       (user) => user['username'] === id && user['password'] === password,
//     );
//   }

//   /** 새로운 엑세스 토큰 create
//    * @param {AccessTokenPayload} payload
//    * @returns {Promise<string>}
//    */
//   public async createAccessToken(payload: AccessTokenPayload): Promise<string> {
//     return await this.jwtService.signAsync(payload, {
//       secret: this.configService.config.SECRET_TOKEN,
//     });
//   }
// }
