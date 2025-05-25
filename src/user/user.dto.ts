import { IsString } from 'class-validator';
import { UserInfoDto } from 'src/common/dto/userinfo.dto';

export class UserSearchQueryRequestDto {
  @IsString()
  nickname: string;
}

export class UserSearchResponseDto {
  userInfos: UserInfoDto[];
}
