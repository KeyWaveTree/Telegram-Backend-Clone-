import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { AuthAccessTokenGuard } from '../auth/auth.guard';
import { UserInfoDto } from 'src/common/dto/userinfo.dto';
import { UserSearchQueryRequestDto, UserSearchResponseDto } from './users.dto';

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
