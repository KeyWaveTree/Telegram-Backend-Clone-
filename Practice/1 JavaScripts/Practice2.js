//함수, 변수 호이스팅 문제
//함수 호이스팅이 됐을때

test();
function test() {
  console.log("hoisting");
}
test();

//함수 호이스팅을 배제
//test_const() 에러 발생
console.log("\n");

const test_const = () => {
  console.log("hoisting");
};

test_const();

console.log("\n");

//변수 호이스팅(좋은 코드가 아님)
console.log(name);
var name = "cat";
console.log(name);

//변수 호이스팅 배제
//console.log(cat); 에러 발생- 일종의 undefind
console.log("\n");

let cat = "cat";
console.log(cat);

//map, filter, reduce
console.log("\n");

const numbers = [1, 2, 3, 4, 5];

//map
const twoize = numbers.map((num) => num * 2);
console.log(twoize);

//filter
console.log("\n");

const odd = numbers.filter((num) => num % 2 == 0);
console.log(odd);

//reduce
console.log("\n");

const sum = numbers.reduce((cur, next) => {
  return cur + next;
}, 0);
console.log(sum);

//객체
const person = {
  name: "test",
  age: 30,
  greet: (args) => {
    console.log(args);
  },
};
//객체의 분해 할당
let p = { name: "Lname", age: 10 };
let { name, age } = p;

//객체에서 property를 추가하는 방법
person.test = 30;

//객체에서 property를 삭제하는 방법
delete person.test;
