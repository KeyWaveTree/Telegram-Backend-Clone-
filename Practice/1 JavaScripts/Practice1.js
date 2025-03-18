//출력
console.log("hello world");

/* 변수와 상수 */
// var [변수명]
// const [변수명]
// let [변수명]

//자료형

//배열 -> 파이썬의 리스트에 더 가까움.
//다만 js에서는 타입이 불분명함으로 인해 list와 array에 대해 혼용되어 사용
//정식명칭은 array -> 내장함수를 가지고 있어 objcet로 인식
console.log("array\n");
let arr = [];
arr.push("push");
arr.push(123);
arr.push(10);

//타입을 구분하지 않고 모든데이터를 담을 수 있음 내부의 데이터는 idnex로 접근가능
console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);

//분해 (구조) 할당도 가능함.
//코드가 줄여드는 효과가 있음.
let arr2 = [1, 2, 3];
let [a, b, c, d] = arr2;

console.log(a, b, c, d);
//결과 1, 2, 3, undefind

/* 조건문 */
console.log("조건문\n");
const socre = 10;
if (socre >= 90) {
  console.log(`a학점 ${score}`);
} else if (socre >= 80) {
  console.log(`b학점 ${score}`);
} else {
  console.log("c학점 이하");
}

//switch case
console.log("스위치 case\n");
const f = "apple";
switch (f) {
  case "apple":
    console.log("테스트 통과");
  case "other":
    console.log("c언어와 똑같음");
    break;
  default:
    console.log("another");
}

/* 반복문 */
console.log("for\n");
let i = 0;
for (i; i < 5; i++) {
  console.log(`${i}`);
}
console.log("while\n");
i = 0;
while (i < 5) {
  console.log(`${i}`);
  i++;
}
console.log("do_while\n");
i = 0;
do {
  console.log(`${i}`);
  i++;
} while (i < 5);

/* for in, for of */
console.log("for of\n");
test = [1, 2, 3, 4];

for (i of test) {
  console.log(i);
}

console.log("for in\n");
for (i in test) {
  console.log(i);
}

/* function */
console.log("function\n");
//함수 선언문
function add(a, b) {
  return a + b;
}

//함수 표현식
const add = function (a, b) {
  return a + b;
};

//화살표 함수
const add = (a, b) => a + b;
