import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthAccessTokenGuard } from './auth.guard';
import { AuthAccessTokenStrategy } from './auth.strategy';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, AuthAccessTokenGuard, AuthAccessTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
