import { Expose } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { AuthDocument } from 'src/database/schema/auth.schema';

export class UserInfoDto {
  constructor(authDocument: AuthDocument) {
    this.id = authDocument.id;
    this.nickname = authDocument.nickname;
  }
  @Expose()
  @IsMongoId()
  id: Types.ObjectId;

  @Expose()
  @IsString()
  nickname: string;
}
