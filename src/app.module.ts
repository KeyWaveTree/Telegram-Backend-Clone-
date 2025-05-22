import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './#/chat/chat.gateway';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { JwtModule } from '@nestjs/jwt';

//nestjs에서 가장 중요
//일종의 메타 정보이다.
//구조적 단위, 각 모듈은 특정기능을 담당하며, 여러개의 모듈이 모여서 애플리케이션을 구성이된다.
// 모듈안에 모듈을 가질 수 있다?

//app.module에서 import는 global 하게 많이 사용하는 모듈을 불러온다.
@Module({
  imports: [
    ConfigModule, //configModule을 가져와서 ConfigService를 사용가능하게 함.
    AuthModule, //authmodule을 가져와서 AuthService를 사용가능하게 함.
    UsersModule, //usersModule을 가져와서 UsersService를 사용가능하게 함.
    ChatModule, //chatModule을 가져와서 ChatService를 사용가능하게 함.
    DatabaseModule, //databaseModule을 가져와서 DatabaseModule을 사용가능하게 함.
    JwtModule.register({ global: true }),
  ],
  controllers: [AppController], //현재 사용할 controllers는 AppContoller이다.
  providers: [AppService, ChatGateway, ConfigService],
})
export class AppModule {}
