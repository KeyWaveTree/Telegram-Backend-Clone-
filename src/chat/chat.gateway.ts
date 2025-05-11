import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
import { AccessTokenPayload } from 'src/common/types/jwt.types';
import { ChatRoomSendMessageRequestDto } from './chat.dto';
import { Types } from 'mongoose';
import { MessageDto } from 'src/common/dto/message.dto';

//우리가 만든 Gard를 쓸수 없음.
@WebSocketGateway({
  cors: {
    origin: '*', //프론트엔드 주소
    credentials: true, //쿠키를 허용하려면 반드시 true
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server; //socket.io에 있는 서버 자료형인 변수를 만든다.

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const cookies = client.handshake.headers.cookie;

    if (!cookies) {
      return client.disconnect();
    }

    //쿠키에서 access_token을 파싱한다.
    //http가 쿠키 데이터를 보낼때 string 1줄로 보냄
    const token = cookies
      .split(';')
      .map((c) => c.trim())
      .map((c) => c.split('=')) //[key,value]
      .find(([key]) => key === 'access_token')?.[1];

    if (!token) {
      console.log(
        `[Client:${client.id}] 유효한 access_token이 없어서 연결 종료`,
      );
      return client.disconnect();
    }

    const payload = this.authService.tryVerifyAccessToken(token); // JWT_SECRET은 환경 변수에서
    if (!payload) {
      console.log(`Client:${client.id} access_token 검증 실패로 연결 종료`);
      return client.disconnect();
    }

    client.data = payload;

    const { room } = client.handshake.query;

    if (typeof room === 'string') {
      await client.join(room);
      console.log(
        `[Client:${client.id}] [Nickname:${payload.nickname}] 방에 참여함 ${room},`,
      );
    } else {
      console.warn(
        `[Client:${client.id}] [Nickname:${payload.nickname}] 유효한 방 정보를 제공하지 않음`,
      );
      return client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    const payload = client.data as AccessTokenPayload;
    console.log(
      `[Client${client.id}] [Nickname:${payload.nickname}] 연결 종료됨`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() { content, contentType }: ChatRoomSendMessageRequestDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { room } = client.handshake.query;
    const payload = client.data as AccessTokenPayload;

    console.log(
      `[Client:${client.id}] [Nickname: ${payload.nickname}] 메시지 수신 ${content}`,
    );

    const token = client.data as AccessTokenPayload;
    await this.chatService.createMessage(
      new Types.ObjectId(token.id),
      new Types.ObjectId(room as string),
      content,
      contentType,
    );

    //해당 방에 있는 다른 Client들에게만 메시지를 보냄(보낸사람 제외)
    client.to(room as string).emit('message', {
      sender: new Types.ObjectId(token.id),
      content: content,
      contentType: contentType,
    } as unknown as MessageDto);
  }
}
