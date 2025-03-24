import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

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
