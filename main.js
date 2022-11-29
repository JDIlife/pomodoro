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
      <label><input type="radio" value="high" name="concentration${i}"></label>
      <label><input type="radio" value="midium" name="concentration${i}"></label>
      <label><input type="radio" value="low" name="concentration${i}"></label>
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
  if (confirm("Do you wnat to start Rest Timer?")) {
    restInterval = setInterval(startRestTimer, 1000);
    studyTime = studyTimeStore;
  } else {

  }
}

function alarmStudyTime() {
  restTime = restTimeStore;
  if (confirm("Do you want to start Study Timer?")) {
    studyInterval = setInterval(startStudyTimer, 1000);
    clearInterval(restInterval);
    cycleTime++;
    cycle.innerText = `${cycleTime} / ${totalCycle}`
  } else {

  }
}

console.log(studyTime)
console.log(restTime)
