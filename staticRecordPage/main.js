window.addEventListener("DOMContentLoaded", () => {

  // indexedDB 생성
  let db;

  let dbReq = indexedDB.open("pomodoro", 1);

  dbReq.onerror = function(event) {
    alert('database error: ' + event.target.errorCode);
  }

  dbReq.onsuccess = function(event) {
    let db = dbReq.result;
  }

  dbReq.onupgradeneeded = function(event) {
    let db = dbReq.result;

    let dataStore = db.createObjectStore("data", { keyPath: "id", autoIncrement: true });
  }
  console.log("db 오픈함")

  // indexedDB 의 값 가져오기
  let request = window.indexedDB.open("pomodoro", 1);
  request.onsuccess = (event) => {
    let db = request.result;
    let transaction = db.transaction(["data"]);
    let objStore = transaction.objectStore("data");

    objStore.openCursor().onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        console.log("cursor " + cursor.key);
      } else {
        console.log("cursor error")
      }
    }

  }
})
