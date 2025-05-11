import { Injectable, Inject } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/common/types/jwt.types';
import { Schemas } from './schema';

//반드시 주석
@Injectable()
export class DatabaseService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getModel<T>(schema: (typeof Schemas)[keyof typeof Schemas]): Model<T> {
    return this.connection.model<T>(schema.name);
  }

  async firstOrDefaultWithUid<T>(
    model: Model<T>,
    uid?: string,
  ): Promise<T | null> {
    const userId = uid || (this.request.user as AccessTokenPayload)?.id;
    return model.findById(userId);
  }
}
