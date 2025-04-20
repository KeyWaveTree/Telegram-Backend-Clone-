import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { Schemas } from './schema';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.config.DB_URL,
      }),
    }),
    MongooseModule.forFeature(
      Object.values(Schemas).map(({ name, schema }) => ({ name, schema })),
    ),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule, DatabaseService],
})
export class DatabaseModule {}
