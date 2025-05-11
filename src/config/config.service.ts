import { Injectable } from '@nestjs/common';
import { Configuration } from './configuration';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  config: Configuration;
  constructor(private configService: NestConfigService) {
    this.config = {
      /**
       * 컨피그레이션을 바인딩해서 서비스를 쓴다.
       * get()은 .env 에서 가지고온다. 만약URL에 키워드가 없으면 undefind errer가 나기 때문에
       */
      DB_URL: configService.get('DB_URL') || 'mongodb://127.0.0.1:27017',
      PORT: parseInt(configService.get('PORT') || '3000'),
      SECRET_TOKEN: configService.get('SECRET_TOKEN') || 'secretsecretsecret',
    } as Configuration;
  }
}
