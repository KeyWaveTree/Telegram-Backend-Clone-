import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, //전역으로 설정
      envFilePath: `.envs${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    }),
  ],

  providers: [
    {
      provide: ConfigService,
      useFactory: (nestConfigService: NestConfigService) =>
        new ConfigService(nestConfigService),
      inject: [NestConfigService],
    },
  ],

  exports: [ConfigService],
})
export class ConfigModule {}
