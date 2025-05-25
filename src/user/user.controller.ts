import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthAccessTokenGuard } from '../auth/auth.guard';
import { UserInfoDto } from 'src/common/dto/userinfo.dto';
import { UserSearchQueryRequestDto, UserSearchResponseDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthAccessTokenGuard)
  @Get('search')
  async userSearch(
    @Query() { nickname }: UserSearchQueryRequestDto,
  ): Promise<UserSearchResponseDto> {
    const userInfos =
      await this.userService.getAccountInfosByNickname(nickname);
    return { userInfos: userInfos.map((it) => new UserInfoDto(it)) };
  }
}
