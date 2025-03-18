//Sync, Async, Blocking, Non-Blocking
// Sync Nonblocking
// sync Blocking
function syncBlockingTask() {
  console.log("[syne Blocking] 작업 1 시작");
  for (let i = 0; i < 1e9; i++) {} //시간 소모 작업
  console.log("[sync Blocking] 작업 1 종료");
}
syncBlockingTask();

// Async Blocking
async function asyncBlockingTask() {
  console.log("(Asyne Blocking] 작업 2 시작");
  //await이 없으면 어떻게 되는가?
  await new Promise((resolve = setTimeout(resolve, 2000)));
  //비동기 작업 (2초 대기)
  console.log("(asyne Blockingl 작업 2 종료)");
}
asyncBlockingTask().then(() => {
  console.log("(aaync Blocking] 작업 2 완료");
});

function syncNonblockingTask() {
  console.log(" [Sync Nonblocking] 작업 3 시작");
}
setTimeout(syncNonblockingTask, 0); // 동기적이지만 블로킹 없 실행

// Async Nonblocking
function asyncNonblockingTask() {
  console.log("[Async Nonblocking] 작업 4 시작");
  setTimeout(() => {
    console.log(" [async Nonblocking] 작업 4 종료 (타임아웃 후)");
  }, 2000); // 비동기 작업 (2초 대기)
  console.log("(asyne (asyne Nonblocking] 다른 작업 실행 중...");
}
asyncNonblockingTask();
//생성자 함수
let myPromise = new Promise((resolve, reject) => {
  let success = true;
  setTimeout(() => {
    if (success) {
      resolve("작업 성공");
    } else {
      reject("작업 실패");
    }
  }, 1000);
});

myPromise
  //Promise가 성공적으로 resolve됬다면 then을
  .then((result) => {
    console.log(result);
  })
  //Promise가 실패가 되는 reject가 된다면 catch
  .catch((error) => {
    console.log(error);
  });
