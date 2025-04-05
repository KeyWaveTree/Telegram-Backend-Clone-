export type JwtPayLoad = {
  id: string;
  nickname: string;
};

export type AccessTokenPayload = {} & JwtPayLoad;
