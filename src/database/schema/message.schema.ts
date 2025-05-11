import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ContentType } from 'src/common/enums/content.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true, versionKey: false })
export class Message {
  @Prop({ type: Types.ObjectId, required: true })
  chatRoomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  sender: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: ContentType,
    default: ContentType.MESSAGE,
  })
  contentType: ContentType;

  @Prop({ required: true })
  content: string;

  createdAt: Date;
}

// Message 클래스를 바탕으로 Mongoose 스키마를 생성
export const MessageSchema = SchemaFactory.createForClass(Message);
