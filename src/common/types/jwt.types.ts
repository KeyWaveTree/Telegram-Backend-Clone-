export type JwtPayload = {
  id: string;
  nickname: string;
};

export type AccessTokenPayload = {} & JwtPayload;
