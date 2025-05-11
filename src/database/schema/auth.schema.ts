import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permission } from 'src/common/enums/permission.enum';

//Auth제러레이터의 Mongoose Document를 AuthDocument type으로 정한다.
//ㄴ-> 'Auth' 모델의 문서 타입을 정의
export type AuthDocument = HydratedDocument<Auth>;

/** Auth 스키마 정의
 *
 */
@Schema({ timestamps: true, versionKey: false })
export class Auth {
  //여기에 id가 없어서 auth.contoller가 에러가 나와요.

  /** 필수 고유한 사용자 명
   * @prop {} required
   * @prop {} unique
   */
  @Prop({ required: true, unique: true })
  username: string;

  /** 필수, 비밀번호
   *
   */
  @Prop({ required: true })
  password: string;

  /** 필수 권한 열거형(기본값: USER)
   *
   */
  @Prop({
    required: true,
    type: String,
    enum: Permission,
    default: Permission.USER,
  })
  permission: Permission;

  /** 닉네임
   *
   */
  @Prop({ required: true })
  nickname: string;

  /** 공개키
   *
   */
  @Prop({ required: true })
  publicKey: string;

  /**
   * 암호화된 비공개 키
   *
   */
  @Prop({ required: true })
  encryptedPrivateKey: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// export class Auth {
//   id: string;
//   username: string;
//   password: string;
//   permission: Permission;
//   nickname: string;
// }
