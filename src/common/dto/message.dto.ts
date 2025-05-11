import { IsDate, IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ContentType } from '../enums/content.enum';
import { Expose } from 'class-transformer';
import { MessageDocument } from 'src/database/schema/message.schema';

export class MessageDto {
  constructor(messageDocument: MessageDocument) {
    this.sender = messageDocument.sender;
    this.contentType = messageDocument.contentType;
    this.content = messageDocument.content;
    this.createdAt = messageDocument.createdAt;
  }

  @Expose()
  @IsMongoId()
  sender: Types.ObjectId;

  @Expose()
  @IsEnum(ContentType)
  contentType: ContentType;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsDate()
  createdAt: Date;
}
