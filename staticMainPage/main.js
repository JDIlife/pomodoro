// Time Setting Area
const studySetting = document.getElementById("studySetting");
const restSetting = document.getElementById("restSetting");
const cycleInput = document.getElementById("cycleInput");
const timeSettingBtn = document.getElementById("timeSettingBtn");

// Timer Area
const timerDiv = document.getElementById("timer");

const totalStudyTimer = document.getElementById("totalStudyTimer");
const totalRestTimer = document.getElementById("totalRestTimer");
const studyTimer = document.getElementById("studyTimer");
const restTimer = document.getElementById("restTimer");
const cycle = document.getElementById("cycle");

// Timer Buttons
const btns = document.getElementById("btns");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Show the Laps
const laps = document.getElementById("laps");
const lap = document.getElementsByClassName("lap");

// Global time variables
let totalStudyTime;
let totalRestTime;
let studyTime;
let restTime;

let studyTimeStore;
let restTimeStore;

// etc needed global variables
let clicked = false;
let cycleTime = 1;
let totalCycle;

// submitBtn
const submitBtn = document.getElementById("submitBtn");

const evaluationText = document.getElementById("evaluationText");

// indexedDB 가 지원되지 않으면 경고문을 보여줌
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
}

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

// indexedDB에 저장할 데이터 객체
class UserData {
  constructor(date, cycleTime, evalu, focusRate) {
    this.date = date;
    this.cycleTime = cycleTime;
    this.evalu = evalu
    this.focusRate = focusRate;
  }
}

// studyState 의 상태에 따라서 startBtn, stopBtn의 행동을 다르게 만든다
let studyState = true;

function setTimer() {
  let studyTimeSelect = studySetting.selectedOptions;
  let restTimeSelect = restSetting.selectedOptions;

  for (let i = 0; i < studyTimeSelect.length; i++) {
    const study = studyTimeSelect[i].label;
    studyTimer.innerText = study + ":00";
    studyTime = parseInt(study) * 60;
    studyTimeStore = studyTime;
  }

  for (let i = 0; i < restTimeSelect.length; i++) {
    const rest = restTimeSelect[i].label;
    restTimer.innerText = rest + ":00";
    restTime = parseInt(rest) * 60;
    restTimeStore = restTime;
  }
  totalStudyTime = studyTime * cycleInput.value;
  totalRestTime = restTime * cycleInput.value;

  totalStudyTimer.innerText = `${Math.floor(totalStudyTime / 60 / 60)}H ${(totalStudyTime % 3600) / 60}Min`
  totalRestTimer.innerText = `${Math.floor(totalRestTime / 60 / 60)}H ${(totalRestTime % 3600) / 60}Min`

  // set cycle
  totalCycle = cycleInput.value
  cycle.innerText = `${cycleTime} / ${totalCycle}`
}

function setLaps() {
  laps.innerHTML = "";
  for (let i = 0; i < cycleInput.value; i++) {
    let lapDiv = document.createElement("div");
    lapDiv.innerHTML = `lap${i + 1} 
      <input type="text" maxlength="20" autocomplete="off" placeholder="input your Goal!">
      <label><input type="radio" value="3" name="concentration${i}"></label>
      <label><input type="radio" value="2" name="concentration${i}"></label>
      <label><input type="radio" value="1" name="concentration${i}"></label>
      `;
    lapDiv.setAttribute("class", "lap");
    laps.appendChild(lapDiv);
  }
}

// set the timer
timeSettingBtn.addEventListener("click", () => {
  setTimer();
  setLaps();
})

// start study timer
function startStudyTimer() {
  if (studyTime > 0) {
    studyTime--;
  } else {
    alarmRestTime();
    clearInterval(studyInterval);
    studyTimer.innerText = "00:00"
  }
  let studyMin = Math.floor(studyTime / 60);
  let studySec = studyTime % 60;

  studyTimer.innerText = `${studyMin}:${studySec}`;

  studyState = true;
}

// start rest timer
function startRestTimer() {
  if (restTime > 0) {
    restTime--;
  } else {
    alarmStudyTime();
  }
  let restMin = Math.floor(restTime / 60);
  let restSec = restTime % 60; true

  restTimer.innerText = `${restMin}:${restSec}`;

  studyState = false;
}

startBtn.addEventListener("click", () => {
  // prevent the startBtn clicked repeatedly
  if (clicked == false && studyState == true && studyTime != undefined) {
    clicked = true;
    studyInterval = setInterval(startStudyTimer, 1000);
  } else if (clicked == false && studyState == false) {
    clicked = true;
    restInterval = setInterval(startRestTimer, 1000);
  } else {
    console.log("already started!!")
  }
})

function stopTimer() {
  if (studyState == true && studyTime != undefined) {
    clearInterval(studyInterval);
  } else if (studyState == false && studyTime != undefined) {
    clearInterval(restInterval);
  }
  // prevent the startBtn clicked repeatedly
  clicked = false;
}

stopBtn.addEventListener("click", stopTimer);

function alarmRestTime() {
  studyTime = studyTimeStore;
  if (confirm("쉬는시간 타이머를 시작하시겠습니까?")) {
    restInterval = setInterval(startRestTimer, 1000);
    studyTime = studyTimeStore;
  } else {

  }
}

function alarmStudyTime() {
  restTime = restTimeStore;
  if (confirm("공부 타이머를 시작하시겠습니까?")) {
    studyInterval = setInterval(startStudyTimer, 1000);
    clearInterval(restInterval);
    cycleTime++;
    cycle.innerText = `${cycleTime} / ${totalCycle}`
  } else {

  }
}


// submit 버튼을 누르면 타이머 기록을 indexedDb에 저장한다
submitBtn.addEventListener("click", () => {

  // 현재 날짜 값을 구함
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate();

  let currentDate = `${year}:${month}:${date}`

  // 총 공부 사이클 시간
  let cycleTime = totalStudyTimer.innerText;
  // 한줄평 텍스트를 담는 변수
  let evalu = evaluationText.value;


  // 선택된 라디오 버튼을 더해서 집중도 평균을 구한다
  let radioCheck = 0;
  let lapsNum = document.getElementsByClassName("lap");

  for (let i = 0; i < lapsNum.length; i++) {
    let focus = document.getElementsByName(`concentration${i}`);
    focus.forEach((node) => {
      if (node.checked) {
        radioCheck += parseInt(node.value);
      }
    })
  }

  let focusRate;
  let division = radioCheck / lapsNum.length;

  if (Math.round(division) == 3) {
    focusRate = "High";
  } else if (Math.round(division) == 2) {
    focusRate = "Midium";
  } else {
    focusRate = "Low";
  }

  // indexedDB 에 저장할 객체 생성
  const usd = new UserData(currentDate, cycleTime, evalu, focusRate);
  console.log(usd)

  // indexedDB에 데이터 저장

  let request = window.indexedDB.open("pomodoro", 1);
  request.onerror = (event) => {
    alert('Database error');
  }

  request.onsuccess = (event) => {
    let db = request.result
    let transaction = db.transaction(["data"], "readwrite");


    transaction.onerror = (event) => {
      console.log("error");
    }
    transaction.onsuccess = (event) => {
      console.log("success")
    }

    let objStore = transaction.objectStore("data");

    let addReq = objStore.add(usd);
    addReq.onsuccess = (event) => {
      console.log("데이터 저장 성공")
    }
  }

});
