import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schemas } from 'src/database/schema';
import { Auth } from 'src/database/schema/auth.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Schemas.Auth.name) private readonly authModel: Model<Auth>,
  ) {}
  public async getAccountInfosByNickname(nickname: string) {
    return this.authModel
      .find({
        nickname: { $regex: nickname, $options: 'i' }, // name 필드만 검색
      })
      .exec();
  }
}
