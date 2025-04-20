import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schemas } from 'src/database/schema';
import { Auth, AuthDocument } from 'src/database/schema/auth.schema';
import {
  ChatRoom,
  ChatRoomDocument,
  EncryptedPrivateKey,
} from 'src/database/schema/chatroom.schema';
import {
  generateRSAKeyPair,
  hybridEncrypt,
} from '../common/utils/crypto-helper';
import { Message } from 'src/database/schema/message.schema';
import { ContentType } from 'src/common/enums/content.enum';

@Injectable()
export class ChatService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Schemas.ChatRoom.name)
    private readonly chatroomModel: Model<ChatRoom>,
    @InjectModel(Schemas.Auth.name) private readonly authModel: Model<Auth>,
    @InjectModel(Schemas.Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  public async getAccounts(ids: Types.ObjectId[]) {
    return await this.authModel.find({ _id: { $in: ids } }).exec();
  }

  public async getMessages(id: Types.ObjectId) {
    return await this.messageModel
      .find({ chatRoomId: id })
      .sort({ _id: 1 })
      .exec();
  }

  public async getChatRooms(id: Types.ObjectId) {
    return await this.chatroomModel
      .find({
        encryptedPrivateKeys: {
          $elemMatch: {
            userId: id.toString(),
          },
        },
      })
      .exec();
  }

  public async getChatRoom(roomId: Types.ObjectId) {
    return await this.chatroomModel.findById(roomId).exec();
  }

  public async createChatRoom(
    users: AuthDocument[],
  ): Promise<ChatRoomDocument> {
    // 2. 채팅방을 위한 공개키, 개인키를 생성한다.
    const { publicKey, privateKey } = generateRSAKeyPair();

    // 3. auth 유저들의 공개키를 기반으로 개인키를 암호화한다.
    // 2. 각 유저의 공개키로 개인키를 암호화하고 배열 형태로 저장
    const encryptedPrivateKeys = users.map(
      (user): EncryptedPrivateKey => ({
        userId: user.id as Types.ObjectId,
        encryptedKey: hybridEncrypt(user.publicKey, privateKey.toString()),
      }),
    );

    const chatroom = new this.chatroomModel({
      name: users.map((it) => it.nickname).join(', '),
      publicKey,
      encryptedPrivateKeys,
    });

    await chatroom.save();
    return chatroom;
  }

  public async createMessage(
    id: Types.ObjectId,
    chatRoomId: Types.ObjectId,
    content: string,
    contentType: ContentType = ContentType.MESSAGE,
  ) {
    return await this.messageModel.insertOne({
      chatRoomId,
      content,
      sender: id,
      contentType,
    });
  }
}
