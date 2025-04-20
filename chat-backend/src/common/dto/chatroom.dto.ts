//~~~ 하기 위해 사용

import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ChatRoomDocument } from '../../database/schema/chatroom.schema';
import { Expose } from 'class-transformer';

export class ChatRoomDto {
  constructor(chatroomDocument: ChatRoomDocument) {
    this.id = chatroomDocument.id;
    this.name = chatroomDocument.name;
  }

  @Expose()
  @IsMongoId()
  id: Types.ObjectId;

  @Expose()
  @IsString()
  name: string;
  // lastMessage: string;
}
