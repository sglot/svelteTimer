<script>
  import { state } from "./stores/stores.js";
  import { stateList } from "./stores/stores.js";
  import { mute } from "./stores/stores.js";
  import { runAttempts } from "./stores/stores.js";

  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";

  import { Sound } from "./core/Sound.js"; 
  // import { engine } from "./core/engine.js"; 

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { spring } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";

  let workTime = 30;
  let relaxTime = 30;
  let laps = 3;

  const maxInnerLap = 3;
  const recoveryTime = 3 * 60;
  let curInnerLap = 1;
  let curOuterLap = 0;
  let lap = 0;

  let preWorkTime = null;
  let remaining = null;
  let timer = null;
  let timerFormated = null;
  let counterTimer = 0;
  // let mute = false; // global variable for class Sound too
  let audio; // class Sound

  let startIntervalId;
  let preWorktIntervalId;
  let timerIntervalId;

  let engineStepTimeoutId;
  let isInitState;

  let cur_state;
  let states;

  let canvas;
  let ctx;
  let mobile;

  let circleWidth = 300;
  let circleHeight = 300;
  let lineWidth = 8;

  let timerStep;
  let sumTime = 0;

  let startTime;
  let ideal = 0;
  let real = 0;
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


  const resolutions = {
      very_small: 290,
      small: 479,
      middle: 640,
      min_desktop: 980
  };

  const colors = {
      work: "#ff7c20",
      relax: "#3b99ff",
      recovery: "#92ccff",
      stop: "#00b60a",
  };

  const unsubscribe = state.subscribe(value => {
    cur_state = value;
  });

  const unsubscribeList = stateList.subscribe(value => {
    states = value;
  });

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut
  });

  let engine = {
    "Нагрузка": () => {work()},
    "Отдых": () => {relax()},
    "Восстановление сил": () => {recovery()},
    "Пауза": () => {turnPause()},
  };

  // время кругов
  let innerLapTime = workTime + relaxTime;
  let outerLapTime = innerLapTime * (maxInnerLap - 1) + workTime;
  let lapTime = outerLapTime + recoveryTime;

  $: allTime = (outerLapTime * laps + (laps - 1) * recoveryTime);

  // форматированное время
  $: hours = Math.floor(allTime / 60 / 60);
  $: minutes = Math.floor(allTime / 60) - hours * 60;
  $: seconds = Math.round(allTime % 60);

  $: rHours = Math.round(remaining / 60 / 60);
  $: rMinutes = Math.round(remaining / 60) - rHours * 60;
  $: rSeconds = Math.round(remaining % 60);




  function start() {
    started = true;
    init();
    cur_state = states.countdown;
    scrollTo('clock-common');
    go(0);
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
      mobile = true;
      audio = new Sound($mute, '/sounds/sek.mp3');

        pausedTime = 0;
        pauseStartTime = 0;
        pauseStopTime = 0;
        pauseTempState ='';

      if (!firstStart) {
          return;
      }

      canvas = document.getElementById("cv");
      canvas.width = circleWidth;
      canvas.height = circleWidth;
      ctx = canvas.getContext("2d");
      canvas.style.left = 0 + "px";

      let widthRegulator = getWidthRegulator();
      if (widthRegulator) {
        mobile = true;
        circleWidth = circleHeight = circleWidth / widthRegulator;
        lineWidth /= widthRegulator;
        canvas.width = canvas.height = circleWidth;
      }

      firstStart = false;
  }

  function getWidthRegulator() {
      if (window.innerWidth < resolutions.very_small) {
          return 2.5;
      } else if (window.innerWidth < resolutions.small) {
          return 2;
      } else if (window.innerWidth < resolutions.middle) {
          return 2;
      } else if (window.innerWidth < resolutions.min_desktop) {
          return 1.5;
      }
      return false;
  }

    function go(d) {
      if (d < 0) {
        // если setTimeout задерживает на меньшее кол-во времени,
        // то задерживаем выполнение дополнительно на
        clearTimeout(engineStepTimeoutId);
        engineStepTimeoutId = setTimeout(() => {
          go(0);
        }, (d * (-1)));
      } else {
        engineStepTimeoutId = setTimeout(() => {
          engineStep();
        }, (timerStep - d));
      }
    }

  function engineStep() {
    if (cur_state === states.countdown) {
      preWork();
      return;
    } 

    sumTime += timerStep / 1000;
    counter++;
    ideal = counter * timerStep;

    engine[cur_state]();
  }

  function preWork() {
    // до начала 3,2,1...
    if (!isInitState) {
      audio.replay();

      preWorktIntervalId = setInterval(() => {
        audio.replay();
        preWorkTime--;

        if (0 === preWorkTime) {
          clearInterval(preWorktIntervalId);
          // state.update(state => states.work);
          cur_state = states.work;
          isInitState = false;
          startTime = new Date().getTime();
          console.clear();
          audio.stop();
          preworked = true;
          go(diff);
        }
      }, 1000);

      isInitState = true;
    }
  }

  function work() {
    if (!isInitState) {
      counterTimer = 0;
      ctx.strokeStyle = colors.work;
      isInitState = true;
      curOuterLap++;
    }

    counterTimer = counterTimer + timerStep / 1000;
    timer = workTime - counterTimer;
    timerFormated = Math.round(timer, -3);
    nextState();
  }

  function relax() {
    if (!isInitState) {
      counterTimer = relaxTime;
      ctx.strokeStyle = colors.relax;
      isInitState = true;
    }

    counterTimer = counterTimer - timerStep / 1000;
    timer = counterTimer;
    timerFormated = Math.round(timer, -3);
    nextState();
  }

  function recovery() {
    if (!isInitState) {
      counterTimer = recoveryTime;
      ctx.strokeStyle = colors.recovery;
      isInitState = true;
    }

    counterTimer = counterTimer - timerStep / 1000;
    timer = counterTimer;
    timerFormated = Math.round(timer, -3);
    nextState();
  }

  function turnPause() {
    if (paused) {
        pauseStartTime = new Date().getTime();
    } else {
        cur_state = pauseTempState;
        pauseTempState = '';
        pauseStopTime = new Date().getTime();
        pausedTime = pausedTime + pauseStartTime - pauseStopTime;
        nextState();
    }
  }

  // по нажатию кнопки пользователем
  function setPauseState() {
    paused = !paused;
    if (paused) {
        pauseTempState = cur_state;
        cur_state = states.pause;
    } else {
        turnPause();
    }

  }

  function nextState() {

    if (paused) {
        go(getDiff());
        return;
    }

    if (stopping()) {
        return;
    }

    let balance = 0;
    let nextState = 'new';
    let stateTime = 0;

    if (cur_state === states.relax) {
      balance = Math.abs((ideal) / 1000 - (lapTime * (lap - 1) + innerLapTime * curInnerLap));
      nextState = states.work;
    }

    if (cur_state === states.work) {
      balance = Math.abs((ideal) / 1000 - (lapTime * (lap - 1)  + innerLapTime * (curInnerLap - 1) + workTime ));
      nextState = states.relax;
    }

    if (cur_state === states.recovery) {
      balance = Math.abs((ideal) / 1000 - lapTime * lap);
      nextState = states.work;
    }

    circle(stateTime = getTimeOfState(cur_state));

    // определяем промежуток таймера, когда воспроизводим звук щелчка
    if ((balance <= 6 && stateTime > 10) || (balance <= 3 && stateTime > 5 && stateTime <= 10)) {
      if (balance % 1 < 0.5) {
          audio.replay();
      } else {
          audio.stop();
      }
    }

    if (balance === 0) {
      // смена состояния работа-отдых
      c('balance = 0');
      state.update(state => nextState);
      counterTimer = 0;
      isInitState = false;
      audio.stop();

      // проверка на завершение внешнего круга
      // переход к долгому отдыху
      if (nextState === states.work) {
          if (curInnerLap === maxInnerLap) {
            curInnerLap = 1;
            lap++;
          } else {
            curInnerLap++;
          }
      } else if (nextState === states.relax) {
          if (curInnerLap === maxInnerLap) {
            state.update(state => states.recovery);
          }
      }
    }


    go(getDiff());
  }

  function getTimeOfState(state) {
      if (state === states.work) {
          return workTime;
      }

      if (state === states.relax) {
          return relaxTime;
      }

      if (state === states.recovery) {
          return recoveryTime;
      }
  }

  function getDiff() {
    real = (new Date().getTime() - startTime + pausedTime) ;
    return real - ideal;
  }

  function stopping() {
    remaining = allTime - ideal / 1000;

    if (remaining == 0) {
      stop();
      progress.set(1);
      return true;
    } else {
      progress.set(((allTime - remaining) * 100) / allTime / 100);
      return false;
    }
  }

  function stop() {
    console.log("stop");
    timer = 0;
    sumTime = 0;
    audio.stop();
    clearInterval(engineStepTimeoutId);
    ctx.strokeStyle = colors.stop;
    circle(workTime);
    state.update(state => states.end);
    preworked = false;
    started = false;

    scrollTo('btn_start');

    runAttempts.set(
                      Number.parseInt(
                                        localStorage.getItem('runAttempts')
                                      )
                      + 1 );

    localStorage.setItem('runAttempts', $runAttempts);
  }

  function scrollTo(id) {
      if (mobile) {
          setTimeout(()=>{
              document.getElementById(id).scrollIntoView({behavior: "smooth"});
          }, 1000);
      }
  }

  function circle(timeValue) {
    ctx.beginPath();
    ctx.clearRect(0, 0, circleWidth, circleHeight);
    let rad = (counterTimer * (180 / timeValue) * (Math.PI * 2)) / 180;
    let radius = Math.round(circleHeight / 2) - lineWidth - 0.5;

    ctx.lineWidth = lineWidth;
    ctx.arc(
      circleHeight / 2,
      circleHeight / 2,
      radius,
      -Math.PI / 2,
      rad - Math.PI / 2,
      false
    );
    ctx.stroke();
  }

  function c(mes) {
      console.log(mes);
  }

  let error_boolean = false;
  $: validateWorkTime = () => {
      let str = workTime.toString();
      let reg = /^[1-9]{1}(?!\d)$|^[1-6]{1}[0-9]{1}$/; // 1 цифра или 2 цифры (дял секунд от 1 до 60)
      c(reg.test(str));
      return reg.test(str);

  }
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
  }

  @media (min-width: 480px) and (max-width: 640px) {
      .time-block {
        font-size: 1.5em !important;
        width: 140px !important;
        height: 140px !important;
        /*margin: 30px auto;*/
      }

      .common-block-data {
        font-size: 0.7em;
      }

      .circle-height {
        height: 140px !important;
        /*margin: 0 auto;*/
        width: 140px;
      }

      .settings-block--time {
        font-size: 1em !important;
        width: 140px !important;
        height: 140px !important;
        /*margin: 0 auto !important;*/
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

      .text--active {
           box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 15px 1px -2px rgba(0, 0, 0, 0.2) !important;
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
        transition-property: box-shadow;
        transition-duration: 0.6s;
        transition-timing-function: cubic-bezier(0, 0, 1, 1);


       border: rgba(181,181,176,0.88) 0px solid;
       border-radius: 50%;
       /*box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);*/
       box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 30px 1px -2px rgba(0, 0, 0, 0.2);
  }

  .text--disabled {
    opacity: 0.5;
    /*font-size: 4em;*/
    transition-property: opacity;
    transition-duration: 0.6s;
    transition-timing-function: cubic-bezier(0, 0, 1, 1);
    border: white 0px solid;
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
</style>

{#if (!sumTime && !preWorkTime && !mobile) || mobile}
  <div
    class="settings-side"
    id="settings"
    transition:slide={
        mobile
        ? { delay: 0, duration: 0 }
        : { delay: 250, duration: 1000 }
    }
  >
    <h2 transition:fade>Параметры</h2>

  <div class="settings-block-container">

    <div style="display: flex; flex-flow: column;">
        <div
          class="settings-block--time"
          class:text--disabled={!validateWorkTime()}
          class:text--active={validateWorkTime()}
          transition:fade
        >
            <label style="font-size: 4em;">{workTime}</label>
        </div>
            <span style="width: 100%; margin-top: 1.5em;">Время нагрузки</span>
          <input
              type=range min=1 max=60
              bind:value={workTime}

              style="width: 90%; margin-top: 1.5em;"
          />
    </div>

    <div style="display: flex; flex-flow: column;">
        <div
          class="settings-block--time"
          class:text--disabled={!validateWorkTime()}
          class:text--active={validateWorkTime()}
          transition:fade
        >
            <label style="font-size: 4em; ">{relaxTime}</label>
        </div>
        <span style="width: 100%; margin-top: 1.5em;">Время отдыха</span>
        <input
              type=range min=1 max=60
              bind:value={relaxTime}

              style="width: 100%; margin-top: 1.5em;"
          />
      </div>
    </div>

    <h3 class="status">Кругов: {laps}</h3>

    <label>
      <input type="range" bind:value={laps} min="1" max="10" />
    </label>
    {#if error_boolean}
        <h1> OH NO! AN ERRROR!</h1>
      {/if}


    <div id="btn_start"></div>
    <Button
        on:click =  {start}
        variant =   "unelevated"
        disabled =  "{started}"
    >
      <Label>Старт</Label>
    </Button>

    <Button
        on:click =  {setPauseState}
        variant =   "outlined"
        disabled =  "{!preworked || cur_state === states.recovery}"
        color = 'secondary'
    >
      <Label>Пауза</Label>
    </Button>



  </div>
{/if}

<div class="tablo-side">

  <div class="clock-common" id="clock-common">

    <div
      class="time-block "
      class:text--disabled={cur_state !== states.work}
      class:text--active={cur_state === states.work}
      transition:fade>
        <p>{states.work}</p>
    </div>

    <div style="position: relative;" class=" circle-height">
      <canvas class="clock-circle text--active" width="0" id="cv" />

      <div class="time-block circle-height" >
        {#if preWorkTime}
          <p
            style="font-size: 0.5em"
            transition:slide={{ delay: 0, duration: 10 }}>
            Начинаем через
          </p>
          <span transition:slide={{ delay: 0, duration: 10 }}>
            {preWorkTime}
          </span>
        {/if}

        {#if null !== timer}
          <p transition:slide={{ delay: 0, duration: 10 }}>{timerFormated}</p>
        {/if}
      </div>
    </div>


    <div
      class="time-block"
      class:text--disabled={cur_state !== states.relax}
      class:text--active={cur_state === states.relax}
      transition:fade>
        <p>{states.relax}</p>
    </div>

  </div>


  <div class="common-block-data">
    <div class="common-block-data-list">
      {#if !mobile}
        <span>Общее время: {minutes} мин {seconds} сек</span>
      {/if}
      <span>Осталось: {rMinutes} мин {rSeconds} сек</span>
    </div>
    <progress value={$progress} />
  </div>

  <audio id="audio">
    <source src="/sounds/sek.mp3" type="audio/mpeg">
    Тег audio не поддерживается вашим браузером.
  </audio>
</div>
