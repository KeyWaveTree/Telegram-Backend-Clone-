import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() //의존성 주입
export class AuthAccessTokenGuard extends AuthGuard('access_token') {}
