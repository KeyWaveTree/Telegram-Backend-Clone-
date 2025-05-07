//~~~ 하기 위해 사용

import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ChatRoomDocument } from '../../database/schema/chatroom.schema';
import { Expose } from 'class-transformer';

export class ChatRoomDto {
  constructor(chatroomDocument: ChatRoomDocument, userid: string) {
    this.id = chatroomDocument.id;
    this.name = chatroomDocument.name;
    this.publicKey = chatroomDocument.publicKey;
    this.encryptedPrivateKey =
      chatroomDocument.encryptedPrivateKeys.find(
        (it) => it.userId.toHexString() == userid,
      )?.encryptedKey ?? '';
  }

  @Expose()
  @IsMongoId()
  id: Types.ObjectId;

  @Expose()
  @IsString()
  name: string;
  // lastMessage: string;

  @Expose()
  @IsString()
  publicKey: string;

  @Expose()
  @IsString()
  encryptedPrivateKey: string;
}
