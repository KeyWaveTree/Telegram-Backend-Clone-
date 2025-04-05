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

//nestjs에서 가장 중요
//일종의 메타 정보이다.
//구조적 단위, 각 모듈은 특정기능을 담당하며, 여러개의 모듈이 모여서 애플리케이션을 구성이된다.
// 모듈안에 모듈을 가질 수 있다?
@Module({
  imports: [ConfigModule, AuthModule, UsersModule, ChatModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ConfigService],
})
export class AppModule {}
