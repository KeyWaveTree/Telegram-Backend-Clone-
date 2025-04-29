import { AuthSchema } from './auth.schema';
import { ChatRoomSchema } from './chatroom.schema';
import { MessageSchema } from './message.schema';

export const Schemas = {
  Auth: { name: 'Auth', schema: AuthSchema },
  //데이터 베이스 모듈에서 몽구스 db가 초기화 될때 ~~을 한다.
  ChatRoom: { name: 'ChatRoom', schema: ChatRoomSchema },
  Message: { name: 'Message', schema: MessageSchema },
};

// + 참조 대상이 스키마 객체인  AuthSchema로 해야하는데
// 스키마 정의 객체인 Auth를 참조함.
