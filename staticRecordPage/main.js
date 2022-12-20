let listUl = document.getElementById("listUl");

// RecordPage 가 로딩 되자마자 DB를 열어서 값을 사용자에게 보여줌
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

  // indexedDB 의 값 가져오기
  let request = window.indexedDB.open("pomodoro", 1);
  request.onsuccess = (event) => {
    let db = request.result;
    let transaction = db.transaction(["data"]);
    let objStore = transaction.objectStore("data");

    objStore.openCursor().onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        listUl.innerHTML += `
          <div class="listItemDiv">
            <div class="date">${cursor.value.date}</div>
            <div class="listLine">
              <div>${cursor.value.cycleTime}</div>
              <div>${cursor.value.evalu}</div>
              <div>${cursor.value.focusRate}</div>
            </div>
          </div>
        `;
        cursor.continue();
      } else {
        console.log("get all cursor");
      }
    }

  }
})
