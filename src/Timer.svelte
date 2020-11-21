<script lang="ts">
  import { state } from "./stores/stores";
  import { stateList } from "./stores/stores";
  import { mute } from "./stores/stores";
  import { runAttempts } from "./stores/stores";
  import { settings } from "./stores/stores";
  import { conf } from "./config/config.js";

  import * as Format from "./core/format";
  import { Sound } from "./core/Sound";
  import { Circle } from "./core/Circle";
  import Chart from "./Chart.svelte"; 

  import Button, { Label } from "@smui/button";

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  let circleWidth = conf.circleWidth;
  let circleHeight = conf.circleHeight;
  let lineWidth = conf.lineWidth;

  let curInnerLap = 1;
  let curOuterLap = 0;
  let lap = 0;

  let preWorkTime = null;
  let remaining = null;
  let timer = null;
  let counterTimer = 0;
  let audio: Sound;
  let circle: Circle;

  let preWorktIntervalId;
  let engineStepTimeoutId;
  let isInitState;
  let currentState;
  let states;

  let canvas;
  let ctx;
  let mobile = false;

  let timerStep;
  let sumTime = 0;
  let startTime;
  let idealExecutingTime = 0;
  let realExecutingTime = 0;
  let diff = 0;
  let counter = 0;
  let firstStart = true;
  let started = false;
  let preworked = false;
  let paused = false;

  let pausedTime = 0;
  let pauseStartTime = 0;
  let pauseStopTime = 0;
  let pauseTempState;

  let circleConfig = {
    bgColor: 'black',
    frontColor: 'white', 
    bgLineWidth: conf.bgLineWidth,
    frontLineWidth: conf.frontLineWidth
  }
  const unsubscribe = state.subscribe((value) => {
    currentState = value;
  });

  const unsubscribeList = stateList.subscribe((value) => {
    states = value;
  });

  const progressOptions = {
    duration: 400,
    easing: cubicOut,
  };

  const progress = tweened(0, progressOptions);

  let engine: engine = {
    "Нагрузка": () => {
      work();
    },
    "Отдых": () => {
      relax();
    },
    "Восстановление сил": () => {
      recovery();
    },
    "Пауза": () => {
      turnPause();
    },
  };

  // время кругов
  $: innerLapTime = $settings.workTime + $settings.relaxTime;
  $: outerLapTime = innerLapTime * (conf.maxInnerLap - 1) + $settings.workTime;
  $: lapTime = outerLapTime + conf.recoveryTime;

  $: allTime = outerLapTime * $settings.laps + ($settings.laps - 1) * conf.recoveryTime;

  // форматированное время
  $: hours = Math.trunc(allTime / 60 / 60);
  $: minutes = Math.trunc(allTime / 60);
  $: seconds = Math.trunc(allTime % 60);

  $: rHours = Math.trunc(remaining / 60 / 60);
  $: rMinutes = Math.trunc(remaining / 60) ;
  $: rSeconds = Math.trunc(remaining % 60);
  
  $: timerFormatted = () => {
    return timer < 61
      ? Math.round(timer)
      : Format.getMinutesInTwoDigitFormat(Math.trunc(timer / 60)) +
          ":" +
          Format.getSecondsInTwoDigitFormat(Math.trunc(timer % 60));
  };

  onMount(async () => {
    setParamsOnMount();
  });

  function setParamsOnMount() {
    let widthRegulator = getWidthRegulator();
    if (widthRegulator) {
      mobile = true;
      circleWidth = circleHeight = circleWidth / widthRegulator;
      lineWidth /= widthRegulator;
      c(circleWidth);
    }
  }

  function getWidthRegulator() {
    if (window.innerWidth < conf.resolutions.very_small) {
      return 2.5;
    } else if (window.innerWidth < conf.resolutions.small) {
      return 2;
    } else if (window.innerWidth < conf.resolutions.middle) {
      return 2;
    } else if (window.innerWidth < conf.resolutions.min_desktop) {
      return 1.5;
    }
    return false;
  }

  function start() {
    started = true;
    init();
    state.update(s => states.countdown);
    scrollTo("settings");
    goIteration(0);
  }

  function init() {
    console.log("init");
    preWorkTime = 3;
    remaining = allTime;
    timerStep = 50;
    sumTime = 0;
    counter = 0;
    curInnerLap = 1;
    curOuterLap = 0;
    lap = 1;
    timer = null;
    isInitState = false;
    preworked = false;

    audio = new Sound($mute, "/sounds/tick-tick.mp3");

    pausedTime = 0;
    pauseStartTime = 0;
    pauseStopTime = 0;
    pauseTempState = "";

    if (!firstStart) {
      return;
    }

    // canvas = document.getElementById("cv");
    // canvas.width = circleWidth;
    // canvas.height = circleHeight;
    // canvas.style.left = 0 + "px";
    // ctx = canvas.getContext("2d");
    circle = new Circle('cv', circleWidth, circleHeight, lineWidth);
    circle.setConfig(circleConfig);
    firstStart = false;
  }

  function goIteration(diff: number) {
    if (diff < 0) {
      // если setTimeout задерживает на меньшее кол-во времени,
      // то задерживаем выполнение дополнительно на
      clearTimeout(engineStepTimeoutId);
      engineStepTimeoutId = setTimeout(() => {
        goIteration(0);
      }, diff * -1);
    } else {
      engineStepTimeoutId = setTimeout(() => {
        engineStep();
      }, timerStep - diff);
    }
  }

  function engineStep() {
    if (currentState === states.countdown) {
      preWork();
      return;
    }

    sumTime += timerStep / 1000;
    counter++;
    idealExecutingTime = counter * timerStep;

    engine[currentState]();
  }

  // до начала 3,2,1...
  function preWork() {
    
    if (isInitState) {
      return;
    }

    audio.replay();

    preWorktIntervalId = setInterval(() => {
      audio.replay();
      preWorkTime--;

      if (0 === preWorkTime) {
        clearInterval(preWorktIntervalId);
        // state.update(state => states.work);
        currentState = states.work;
        isInitState = false;
        startTime = new Date().getTime();
        console.clear();
        audio.stop();
        preworked = true;
        goIteration(diff);
      }
    }, 1000);

    isInitState = true;
  }

  function work() {
    if (!isInitState) {
      counterTimer = 0;
      circleConfig.frontColor = conf.colors.work;
      circleConfig.frontLineWidth = lap;
      circle.setConfig(circleConfig);
      isInitState = true;
      curOuterLap++;
    }

    counterTimer = counterTimer + timerStep / 1000;
    timer = $settings.workTime - counterTimer;
    nextState();
  }

  function relax() {
    if (!isInitState) {
      counterTimer = $settings.relaxTime;
      circleConfig.frontColor = conf.colors.relax;
      circle.setConfig(circleConfig);
      isInitState = true;
    }

    counterTimer = counterTimer - timerStep / 1000;
    timer = counterTimer;
    nextState();
  }

  function recovery() {
    if (!isInitState) {
      counterTimer = conf.recoveryTime + 0.8; // добавочное время, чтобы можно было увидеть иcходные 03:00
      circleConfig.frontColor = conf.colors.recovery;
      circle.setConfig(circleConfig);
      isInitState = true;
    } else {
      counterTimer = counterTimer - timerStep / 1000;
    }

    timer = counterTimer;
    nextState();
  }

  function nextState() {
    if (paused) {
      goIteration(getDiff());
      return;
    }

    if (stopping()) {
      return;
    }

    let temp = calcTempData();

    circle.recalcValues(counterTimer, temp.stateTime);
    circle.draw();

    maybeSound(temp);

    if (temp.balance === 0) {   // веха в работе таймера
      boundaryStateCalcs(temp); // что-то закончится, что-то начнётся 
    }

    goIteration(getDiff());
  }

  function getTimeOfState(state) {
    if (state === states.work) {
      return $settings.workTime;
    }

    if (state === states.relax) {
      return $settings.relaxTime;
    }

    if (state === states.recovery) {
      return conf.recoveryTime;
    }
  }

  function getDiff() {
    realExecutingTime = new Date().getTime() - startTime + pausedTime;
    return realExecutingTime - idealExecutingTime;
  }

  function boundaryStateCalcs(temp: oneLoopValues) {
    // смена состояния работа-отдых
    c("balance = 0");
    state.update(s => temp.nextState);
    counterTimer = 0;
    isInitState = false;
    audio.stop();

    // проверка на завершение внешнего круга
    // переход к долгому отдыху/восстановлению
    if (temp.nextState === states.work) {
      if (curInnerLap === conf.maxInnerLap) {
        revertInnerLapToBeginning();
        lap++;
      } else {
        curInnerLap++;
      }
    } else if (temp.nextState === states.relax) {
      if (curInnerLap === conf.maxInnerLap) {
        state.update((state) => states.recovery);
      }
    }
  }

  function revertInnerLapToBeginning() {
    // для визуальной плавности возвращения индикатора малых кругов
    // в исходное состояние переключаем постепенно
    curInnerLap = 2;
    setTimeout(() => {
      curInnerLap = 1;
    }, 500);
  }

  function calcTempData() {
    let temp: oneLoopValues = {      
      balance: 0,
      stateTime: 0,
      nextState: "new"
    };

    temp.stateTime = getTimeOfState(currentState);

    if (currentState === states.relax) {
      temp.balance = Math.abs(
        idealExecutingTime / 1000 - (lapTime * (lap - 1) + innerLapTime * curInnerLap)
      );
      temp.nextState = states.work;

      return temp;
    }

    if (currentState === states.work) {
      temp.balance = Math.abs(
        idealExecutingTime / 1000 -
          (lapTime * (lap - 1) + innerLapTime * (curInnerLap - 1) + $settings.workTime)
      );
      temp.nextState = states.relax;

      return temp;
    }

    if (currentState === states.recovery) {
      temp.balance = Math.abs(idealExecutingTime / 1000 - lapTime * lap);
      temp.nextState = states.work;

      return temp;
    }

    return temp;
  }

  // определяем промежуток таймера, когда воспроизводим звук щелчка
  function maybeSound(temp: oneLoopValues) {
    if (
      !(temp.balance <= 6 && temp.stateTime > 10) 
      &&
      !(temp.balance <= 3 && temp.stateTime > 5 && temp.stateTime <= 10)
    ) {
      return;
    }

    if (temp.balance % 1 < 0.5) {
      audio.replay();
    } else {
      audio.stop();
    }
  }

  function stopping() {
    remaining = allTime - idealExecutingTime / 1000;

    if (remaining == 0) {
      stop();
      progress.set(1, progressOptions);
      return true;
    } else {
      progress.set(((allTime - remaining) * 100) / allTime / 100, progressOptions);
      return false;
    }
  }

  function stop() {
    console.log("stop");
    timer = 0;
    sumTime = 0;
    audio.stop();
    clearInterval(engineStepTimeoutId);
    circleConfig.frontColor = conf.colors.stop;
      circle.setConfig(circleConfig);
    circle.recalcValues(counterTimer, $settings.workTime);
    circle.draw();
    state.update(s => states.end);
    preworked = false;
    started = false;

    scrollTo("btn_start");

    runAttempts.set(Number.parseInt(localStorage.getItem("runAttempts")) + 1);

    localStorage.setItem("runAttempts", $runAttempts + "");
  }

  function turnPause() {
    if (paused) {
      pauseStartTime = new Date().getTime();
    } else {
      currentState = pauseTempState;
      pauseTempState = "";
      pauseStopTime = new Date().getTime();
      pausedTime = pausedTime + pauseStartTime - pauseStopTime;
      nextState();
    }
  }

  // по нажатию кнопки пользователем
  function setPauseState() {
    paused = !paused;
    if (paused) {
      pauseTempState = currentState;
      currentState = states.pause;
    } else {
      turnPause();
    }
  }

  function scrollTo(id: string) {
    if (mobile) {
      setTimeout(() => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }

  function c(mes) {
    console.log(mes);
  }

  let error_boolean = false;
  $: validateWorkTime = () => {
    let str = $settings.workTime.toString();
    let reg = /^[1-9]{1}(?!\d)$|^[1-6]{1}[0-9]{1}$/; // 1 цифра или 2 цифры (дял секунд от 1 до 60)
    c(reg.test(str));
    return reg.test(str);
  };
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 641px) and (max-width: 980px) {
    .time-block {
      font-size: 1.5em !important;
      width: 200px !important;
      height: 200px !important;
      /*margin: 50px auto;*/
    }

    .common-block-data {
      font-size: 0.7em;
    }

    .circle-height {
      height: 200px !important;
      /*margin: 0 auto;*/
      width: 200px;
      /*margin: 50px auto;*/
    }

    .settings-block--time {
      font-size: 1em !important;
      width: 200px !important;
      height: 200px !important;
    }

    .shadow--active {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 25px 1px -2px rgba(0, 0, 0, 0.2);
    }
  }

  @media (min-width: 480px) and (max-width: 640px) {
    .time-block {
      font-size: 1.5em !important;
      width: 150px !important;
      height: 150px !important;
      /*margin: 30px auto;*/
    }

    .common-block-data {
      font-size: 0.7em;
    }

    .circle-height {
      height: 150px !important;
      /*margin: 0 auto;*/
      width: 150px;
    }

    .settings-block--time {
      font-size: 1em !important;
      width: 150px !important;
      height: 150px !important;
      /*margin: 0 auto !important;*/
    }

    .shadow--active {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 20px 1px -2px rgba(0, 0, 0, 0.2) !important;
    }

    .innerlap-counter-container {
      margin-top: 1em !important;
    }
  }

  @media screen and (min-width: 291px) and (max-width: 479px) {
    .time-block {
      font-size: 1.5em !important;
      width: 150px !important;
      height: 150px !important;
      margin: 25px auto;
    }

    .clock-common {
      flex-flow: column;
    }

    .common-block-data {
      font-size: 0.7em;
    }

    .circle-height {
      height: 150px !important;
      margin: 0 auto;
      width: 150px;
    }

    .settings-block-container {
      flex-flow: column;
    }

    .settings-block--time {
      font-size: 1em !important;
      width: 150px !important;
      height: 150px !important;
      margin: 0 auto !important;
    }

    .shadow--active {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 15px 1px -2px rgba(0, 0, 0, 0.2) !important;
    }

    .innerlap-counter-container {
      margin-top: 1em !important;
    }
  }

  @media screen and (max-width: 290px) {
    .time-block {
      font-size: 1.2em !important;
      width: 120px !important;
      height: 120px !important;
      margin: 5px auto;
    }

    .clock-common {
      flex-flow: column;
    }

    .common-block-data {
      font-size: 0.5em;
    }

    .circle-height {
      height: 120px !important;
      max-width: 120px;
      margin: 0 auto;
      min-width: 120px !important;
    }

    .settings-block-container {
      flex-flow: column;
    }

    .settings-block--time {
      font-size: 0.8em !important;
      width: 120px !important;
      height: 120px !important;
      margin: 0 auto !important;
    }

    .shadow--active {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 10px 1px -2px rgba(0, 0, 0, 0.2) !important;
    }

    .innerlap-counter-container {
      margin-top: 1em !important;
    }
  }

  .settings-side {
    position: relative;
    top: 0;
  }

  .time-block {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    font-size: 3em;
    flex-flow: column;
  }

  .settings-block--time {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    font-size: 2em;
    flex-flow: column;
    margin: 0 3em;
  }

  .common-block-data {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
  }

  .common-block-data-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: justify;
  }

  .clock-circle {
    position: absolute;
  }

  .text--active {
    opacity: 1;
    transition: opacity 0.5s cubic-bezier(0, 0, 1, 1);
  }

  .text--disabled {
    opacity: 0.5;
    transition: opacity 0.5s cubic-bezier(0, 0, 1, 1);
  }

  .shadow--active {
    transition: box-shadow 0.5s cubic-bezier(0, 0, 1, 1);

    border: rgba(181, 181, 176, 0.88) 0px solid;
    border-radius: 50%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 25px 1px -2px rgba(0, 0, 0, 0.2);
  }

  .shadow--disabled {
    transition: box-shadow 0.5s cubic-bezier(0, 0, 1, 1);

    border: white 0px solid;
    border-radius: 50%;
  }

  progress {
    display: block;
    width: 100%;
  }

  .marg {
    margin: 1em !important;
    background-color: #333333;
  }

  .clock-common {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .settings-block-container {
    position: relative;
    display: flex;
    justify-content: center;
  }

  input[type="number"] {
    display: none !important;
    font-size: 10em;
  }

  .tiny {
    transition: top 1s cubic-bezier(0, 0, 1, 1) 500ms;
    top: -1000px !important;
  }

  .innerlap-counter {
    color: white;
    height: 3em;
    width: 3em;
    margin: 0 1em;
  }

  .innerlap-counter-container {
    margin-top: 3em;
    margin-bottom: 1em;
    height: 3em;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .innerlap-counter-circle {
    -webkit-box-shadow: 0px 0px 1px 5px rgb(27, 235, 20);
    -moz-box-shadow: 0px 0px 1px 5px rgb(27, 235, 20);
    box-shadow: 0px 0px 1px 5px rgb(27, 235, 20);

    width: 3em;
    height: 3em;
    line-height: 3em;
    text-align: center;
    margin: 0 auto;
    border-radius: 60%;
    color: rgb(77, 74, 204);
    font-weight: bold;
  }

  .label-time-text {
    font-weight: lighter;
  }

  .data-time-text {
    font-weight: normal;
    font-style: italic;
  }
</style>

{#if !started}
  <div
    class="settings-side"
    id="settings"
    transition:slide={mobile ? { delay: 0, duration: 0, easing: cubicOut } : { delay: 250, duration: 1000, easing: cubicOut }}>
    <h2 transition:fade={{delay: 0, duration: 0, easing: cubicOut}}>Параметры</h2>

    <div class="settings-block-container">
      <div style="display: flex; flex-flow: column;">
        <div
          class="settings-block--time"
          class:text--disabled={!validateWorkTime()}
          class:text--active={validateWorkTime()}
          class:shadow--disabled={!validateWorkTime()}
          class:shadow--active={validateWorkTime()}
          transition:fade={{delay: 0, duration: 0, easing: cubicOut}}>
          <span style="font-size: 4em;"> {$settings.workTime} </span>
        </div>
        <span style="width: 100%; margin-top: 1.5em;">Время нагрузки</span>
        <input
          type="range"
          min="1"
          max="60"
          bind:value={$settings.workTime}
          style="width: 100%; margin-top: 1.5em;" />
      </div>

      <div style="display: flex; flex-flow: column;">
        <div
          class="settings-block--time"
          class:text--disabled={!validateWorkTime()}
          class:text--active={validateWorkTime()}
          class:shadow--disabled={!validateWorkTime()}
          class:shadow--active={validateWorkTime()}
          transition:fade={{delay: 0, duration: 0, easing: cubicOut}}>
          <span style="font-size: 4em; "> {$settings.relaxTime} </span>
        </div>
        <span style="width: 100%; margin-top: 1.5em;">Время отдыха</span>
        <input
          type="range"
          min="1"
          max="60"
          bind:value={$settings.relaxTime}
          style="width: 100%; margin-top: 1.5em;" />
      </div>
    </div>

    <h3 class="status">Кругов: {$settings.laps}</h3>

    <label> <input type="range" bind:value={$settings.laps} min="1" max="10" /> </label>

    {#if error_boolean}
      <h1>OH NO! AN ERRROR!</h1>
    {/if}
  </div>
{/if}

<div id="btn_start" />
<Button on:click={start} variant="unelevated" disabled={started}>
  <span class="material-icons">
    play_arrow
  </span>
</Button>

<Button
  on:click={setPauseState}
  variant="outlined"
  disabled={!preworked || currentState === states.recovery}
  color="secondary">
  <span class="material-icons">
    pause
  </span>
</Button>

<div class="tablo-side">
  <div class="clock-common" id="clock-common">
    <div
      class="time-block "
      class:shadow--disabled={currentState !== states.work}
      class:shadow--active={currentState === states.work}>
      <p
        class:text--disabled={currentState !== states.work}
        class:text--active={currentState === states.work}>
        {states.work}
      </p>
    </div>

    <div style="position: relative;" class=" circle-height">
      <canvas
        class="clock-circle text--active shadow--active"
        width="0"
        id="cv" />

      <div class="time-block circle-height">
        {#if preWorkTime}
          <p style="font-size: 0.5em">Начинаем через</p>
          <span> {preWorkTime} </span>
        {/if}

        {#if null !== timer}
          <p>{timerFormatted()}</p>
        {/if}
      </div>
    </div>

    <div
      class="time-block"
      class:shadow--disabled={currentState !== states.relax}
      class:shadow--active={currentState === states.relax}>
      <p
        class:text--disabled={currentState !== states.relax}
        class:text--active={currentState === states.relax}>
        {states.relax}
      </p>
    </div>
  </div>

  <div class="common-block-data">
    <div class="innerlap-counter-container">
      <div class="innerlap-counter">
        <div
          class="innerlap-counter-circle text--disabled"
          class:text--disabled={!((curInnerLap > 0 && preworked) || curInnerLap > 2)}
          class:text--active={(curInnerLap > 0 && preworked) || curInnerLap > 2}>
          1
        </div>
      </div>

      <div class="innerlap-counter">
        <div
          class="innerlap-counter-circle text--disabled"
          class:text--disabled={!(curInnerLap > 1)}
          class:text--active={curInnerLap > 1}>
          2
        </div>
      </div>

      <div class="innerlap-counter">
        <div
          class="innerlap-counter-circle text--disabled"
          class:text--disabled={!(curInnerLap > 2)}
          class:text--active={curInnerLap > 2}>
          3
        </div>
      </div>
    </div>

    <div class="common-block-data-list">
      {#if !mobile}
        <span class="label-time-text">Общее время:
          <span class="data-time-text">{minutes} мин {seconds} сек</span></span>
      {/if}
      <span class="label-time-text">Осталось:
        <span class="data-time-text">{rMinutes} мин {rSeconds} сек</span></span>
    </div>
    <progress value={$progress} />
  </div>

  <Chart/>
  
  <!-- <audio id="audio">
    <source src="/sounds/sek.mp3" type="audio/mpeg">
    Тег audio не поддерживается вашим браузером.
  </audio> -->
</div>
