import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**static 배열로 임시 사용자 데이터 관리*/
  private readonly users = [
    { id: '1', name: 'Hohn Doe', age: 30 },
    { id: '2', name: 'Hohn Doe', age: 25 },
  ];

  /** 모든 사용자 가져오기 (Read)
   * @returns {object} 현재 데이터 베이스에 삽입된 사용자를 return
   * */
  getAllUsers() {
    return this.users;
  }

  /** 사용자 추가하기(Create)
   * @param {ame: string, age: number} userDto 사용자를 만들라 요청시 파라미터로 받아야 하는 유저 정보
   * 사용자의 이름
   * 사용자의 나이
   * @returns {{name: string, age: number, id: string}} 새로운 사용자의 정보 반환
   */
  createUser(userDto: { name: string; age: number }) {
    const newUser = {
      id: (this.users.length + 1).toString(),
      ...userDto, //...은 왜 쓰는가? (id 뒤에 이어 붙이기 위해)
    };
    this.users.push(newUser); //리스트 맨 뒤에 push
    return newUser;
  }

  /**특정 사용자 가져오기(Read by ID)
   * @param {string } id 유저의 id
   * @returns {object} 특정 사용자의 유저정보나 찾지 못했다는 메시지 객체 return
   */
  getUser(id: string) {
    //db iterator의 id 정보와 파라미터로 받은 id 정보가 완전히 같은 경우만 찾아서 return
    const user = this.users.find((user) => user.id === id);
    //만약 자신이 찾는 id를 가진 유저가 없다면
    if (!user) {
      //찾지 못했다는 메시지 객체 return
      return { message: 'User not found' };
    }
    //원하는 id를 가진 유저정보 return
    return user;
  }

  /**사용자 업데이트하기(Update)
   * @param {string} id 업데이트를 할 유저의 id
   * @param {{name:string, age:number}} userDto 업데이트 할 유저의 정보
   */
  updateUser(id: string, userDto: { name: string; age: number }) {
    //db iterator의 id 정보와 파라미터로 받은 id 정보가 완전히 같은 경우의 인덱스를 return
    const userIndex = this.users.findIndex((user) => user.id === id);

    //만약 원하는 인덱스를 찾지 못했을떄 (userIndex값이 -1과 완전히 똑같은 경우)
    if (userIndex === -1) {
      //찾지 못했다는 메시지 객체 return
      return { message: 'User not found' };
    }
    //원하는 객체를 찾았을경우 객체 값을 기존 id와 새로운 유저정보를 이어 붙여서 새로운 객체값으로 넣어준다.
    this.users[userIndex] = { id, ...userDto };
    //넣은 결과 객체값을 return 해준다.
    return this.users[userIndex];
  }

  /**사용자 삭제하기 (Delete)
   * @param {string} id 삭제할 유저 id
   * @returns {object} 동작된 메시지 object
   */
  deleteUser(id: string) {
    //db iterator의 id 정보와 파라미터로 받은 id 정보가 완전히 같은 경우의 인덱스를 return
    const userIndex = this.users.findIndex((user) => user.id === id);

    //만약 원하는 인덱스를 찾지 못했을때 (userIndex값이 -1과 완전히 똑같은 경우)
    if (userIndex === -1) {
      //찾지 못했다는 메시지 객체 return
      return { message: 'User not found' };
    }
    //원하는 인덱스를 찾을 경우 인덱스 위치에 있는 1개의 객체를 없앤다.
    this.users.splice(userIndex, 1);

    //삭제했다는 메시지 객체 return
    return { message: 'User delete' };
  }
}

//구조적으로 조금 복잡하다 다만 의존성문제에서 좋다.
//api로 통신을 받는다. - 프로젝트에서는 postman을 사용한다.
/* 
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  processData(data: { name: string; age: number }): string {
    return `Received data ${data.name}, age ${data.age}`;
  }
}
*/
