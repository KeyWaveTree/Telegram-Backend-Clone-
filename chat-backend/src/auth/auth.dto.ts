import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

export class AuthLoginRequestDto {
  @IsString()
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;
}

export class AuthLoginResponseDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsString()
  accessToken: string;

  //mongodb 부분 추가
  @IsMongoId()
  //기본적으로 Types가 에러가 날것
  //이유-> IsMongoId의 Types는 Mongodb에서 가지고 와야 함.
  id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @IsNotEmpty()
  @IsString()
  encryptedPrivateKey: string;
}

export class AuthSignupRequestDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @Length(8, 256)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @IsNotEmpty()
  @IsString()
  encryptedPrivateKey: string;
}

export class AuthSignupResponseDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  encryptedPrivateKey: string;

  @IsNotEmpty()
  @IsString()
  publicKey: string;
}
