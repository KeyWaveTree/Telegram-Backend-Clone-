import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsMongoId } from 'class-validator';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;
//유저 개인키 스키마(class) 구성 요소
@Schema({ _id: false })
export class EncryptedPrivateKey {
  @IsMongoId()
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  encryptedKey: string;
}

@Schema({ timestamps: true, versionKey: false })
export class ChatRoom {
  @Prop()
  name: string;

  @Prop({ required: true })
  publicKey: string;

  @Prop({ type: [EncryptedPrivateKey] })
  encryptedPrivateKeys: EncryptedPrivateKey[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
