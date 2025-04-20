import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';

//http 요청을 처리하는데 사용되는 클래스
//요청을 받아서 적절한 서비스 호출하고, 그결과를 반환
//데코레이터: 이 클래스는 컨트롤러이다.
@Controller('users')

//export 외부로 보내는 형식이기 때문에 외부에서 appController를 사용할 수 있다.
export class AppController {
  /** 생성자
   * @param appService  has - a 관계로 가지고온다. : 이것이 의존성 주입
   */
  constructor(private readonly appService: AppService) {}

  /** 사용자 목록 가져오기(Read)
   *
   * @returns
   */
  @Get()
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  /** 사용자 추가 하기(Create)
   * @param {{ name: string; age: number }} userDto  json 형태로 받은 수신데이터 파라미터를 받는다.
   * @returns {Function} 앱서비스 안에 있는 createUser 메소드를을 html body에다 적용하라
   */
  @Post()
  createUser(@Body() userDto: { name: string; age: number }) {
    return this.appService.createUser(userDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.appService.getUser(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userDto: { name: string; age: number },
  ) {
    return this.appService.updateUser(id, userDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(id);
  }
}

/*

//http 요청을 처리하는데 사용되는 클래스
//요청을 받아서 적절한 서비스 호출하고, 그결과를 반환
//데코레이터: 이 클래스는 컨트롤러이다.
@Controller()

//export 외부에서 가지고올 수 있다.
export class AppController {
  //클래스 has - a 관계로 가지고온다. : 이것이 의존성 주입
  constructor(private readonly appService: AppService) {}

  @Get() //웹브라우저에서 가지고와야 하는 데코레이터.
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('data') //post
  postData(@Body() data: { name: string; age: number }): string {
    return this.appService.processData(data);
  }
}
*/
