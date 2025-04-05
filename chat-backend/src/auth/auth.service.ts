import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Permission } from 'src/common/enums/permission.enum';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../database/schema/auth.schema';
import { AccessTokenPayload } from '../common/types/jwt.types';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //dummyUser 데이터로 DB 연동시 제거 예정
  private readonly users: Auth[] = [
    {
      id: uuidv4(),
      username: 'admin',
      password: '1234',
      nickname: 'GOD',
      permission: Permission.ADMIN,
    },
    {
      id: uuidv4(),
      username: 'user',
      password: 'password',
      nickname: 'James',
      permission: Permission.USER,
    },
  ];

  //dummayUser에서 유효한 username과 password인지 확인하는 메서드
  public getAccount(id: string, password: string): Auth | undefined {
    const authEntity = this.users.find(
      (it) => it.username == id && it.password == password,
    );
    return authEntity;
  }

  //유효한 크래딧이 있는지
  public isValidCredentials(id: string, password: string): boolean {
    return this.users.some(
      (user) => user['username'] === id && user['password'] === password,
    );
  }

  public async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.config.SECRET_TOKEN,
    });
  }
}
