import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

//async가 표시된 method는 무조건 Promiss를 return이 된다.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //---- 벨리데이션 파이프라는 데이터 검증
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser()); //쿠키 파서를 추가해야 된다.
  //----
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
