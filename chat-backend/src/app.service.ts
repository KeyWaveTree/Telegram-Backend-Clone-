import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //구조적으로 조금 복잡하다 다만 의존성문제에서 좋다.
  getHello(): string {
    return 'Hello World!';
  }

  processData(data: { name: string; age: number }): string {
    return `Received data ${data.name}, age ${data.age}`;
  }
}

//api로 통신을 받는다. - 프로젝트에서는 postman을 사용한다.
