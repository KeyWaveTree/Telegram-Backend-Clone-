import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { ChatRoomDto } from 'src/common/dto/chatroom.dto';
import { MessageDto } from 'src/common/dto/message.dto';
import { UserInfoDto } from 'src/common/dto/userinfo.dto';
import { ContentType } from 'src/common/enums/content.enum';

export class ChatRoomsResponseDto {
  chatrooms: ChatRoomDto[];
}

export class ChatRoomCreateRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  participantIds: Types.ObjectId[];
}

export class ChatRoomCreateResponseDto {
  @IsMongoId()
  id: Types.ObjectId;

  @IsString()
  name: string;

  @IsString()
  publicKey: string;

  @IsString()
  encryptedPrivateKey: string;
}

export class ChatRoomInfoResponseDto {
  @IsMongoId()
  roomId: Types.ObjectId;

  participants: UserInfoDto[];
  messages: MessageDto[];
}

export class ChatRoomSendMessageRequestDto {
  @IsString()
  content: string;

  @IsEnum(ContentType)
  contentType: ContentType;
}
