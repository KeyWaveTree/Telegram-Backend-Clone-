import { Auth as AuthSchema } from './auth.schema';
import { ChatRoomSchema } from './chatroom.schema';
import { MessageSchema } from './message.schema';

export const Schemas = {
  Auth: { name: 'Auth', schema: AuthSchema },
  //데이터 베이스 모듈에서 몽구스 db가 초기화 될때 ~~을 한다.
  ChatRoom: { name: 'ChatRoom', schema: ChatRoomSchema },
  Message: { name: 'Message', schema: MessageSchema },
};
