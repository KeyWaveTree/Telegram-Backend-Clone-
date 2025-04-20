import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ChatRoomInfoResponseDto,
  ChatRoomsResponseDto,
  ChatRoomCreateRequestDto,
  ChatRoomCreateResponseDto,
} from './chat.dto';
import { ChatService } from './chat.service';
import { AuthAccessTokenGuard } from '../auth/auth.guard';
import { AuthInfo } from '../auth/auth.decorator';
import { AccessTokenPayload } from '../common/types/jwt.types';
import { Types } from 'mongoose';
import { ChatRoomDto } from '../common/dto/chatroom.dto';
import { MessageDto } from 'src/common/dto/message.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserInfoDto } from 'src/common/dto/userinfo.dto';

@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthAccessTokenGuard)
  @Get('chat/rooms')
  async chatRooms(
    @AuthInfo() { id }: AccessTokenPayload,
  ): Promise<ChatRoomsResponseDto> {
    const chatrooms = await this.chatService.getChatRooms(
      new Types.ObjectId(id),
    );
    return { chatrooms: chatrooms.map((it) => new ChatRoomDto(it)) };
  }

  @UseGuards(AuthAccessTokenGuard)
  @Get('chat/rooms/:roomId')
  async chatRoomInfo(
    @Param('roomId') roomIdStr: string,
  ): Promise<ChatRoomInfoResponseDto> {
    const roomId = new Types.ObjectId(roomIdStr);
    const roomInfo = await this.chatService.getChatRoom(roomId);
    if (!roomInfo) {
      throw new NotFoundException('해당 채팅방의 대한 정보가 없습니다.');
    }
    const participants = await this.authService.getAuthInfos(
      roomInfo.encryptedPrivateKeys.map((it) => it.userId),
    );
    if (!participants) {
      throw new NotFoundException('채팅방 사용자의 대한 정보가 없습니다.');
    }
    const messages = await this.chatService.getMessages(roomId);
    return {
      roomId,
      messages: messages.map((it) => new MessageDto(it)),
      participants: participants.map((it) => new UserInfoDto(it)),
    };
  }

  @UseGuards(AuthAccessTokenGuard)
  @Post('chat/rooms/create')
  async chatRoomCreate(
    @Body() { participantIds }: ChatRoomCreateRequestDto,
    @AuthInfo() authInfo: AccessTokenPayload,
  ): Promise<ChatRoomCreateResponseDto> {
    // 1. participantIds auth 정보를 가져온다.
    const users = await this.chatService.getAccounts(participantIds);
    if (participantIds.length != users.length) {
      throw new NotFoundException('일부 유저들을 찾을 수 없습니다.');
    }

    // 2. 채팅방을 위한 공개키, 개인키를 생성한다.
    // 3. auth 유저들의 공개키를 기반으로 개인키를 암호화한다.
    // 4. DB에 저장한다.
    const { id, name, publicKey, encryptedPrivateKeys } =
      await this.chatService.createChatRoom(users);
    // 생성된 document 가공하여 반환
    return {
      id,
      name,
      publicKey,
      encryptedPrivateKey: encryptedPrivateKeys.find(
        (it) => it.userId == new Types.ObjectId(authInfo.id),
      )!.encryptedKey,
    };
  }
}
