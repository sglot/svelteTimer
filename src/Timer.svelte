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

  let workTime = 2;
  let relaxTime = 2;
  let laps = 2;

  const maxInnerLap = 3;
  let curInnerLap = 1;

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

  let flyInterval;
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
  let curOuterLap = 0;

  let startTime;
  let ideal = 0;
  let real = 0;
  let diff = 0;
  let counter = 0;
  let firstStart = true;

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
  };


  $: allTime = (workTime + relaxTime) * laps * maxInnerLap - relaxTime;
  //  $: remaining = allTime - sumTime;

  $: hours = Math.floor(allTime / 60 / 60);
  $: minutes = Math.floor(allTime / 60) - hours * 60;
  $: seconds = Math.round(allTime % 60);

  $: rHours = Math.round(remaining / 60 / 60);
  $: rMinutes = Math.round(remaining / 60) - rHours * 60;
  $: rSeconds = Math.round(remaining % 60);




  function start() {
    init();
    cur_state = states.countdown;
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
      timer = null;
      isInitState = false;
      mobile = false;
      audio = new Sound($mute, '/sounds/sek.mp3');


      if (!firstStart) {
          return;
      }

      canvas = document.getElementById("cv");
      canvas.width = circleWidth;
      canvas.height = circleWidth;
      ctx = canvas.getContext("2d");
      canvas.style.left = 0 + "px";

      if (window.innerWidth < 290) {
        mobile = true;
        circleWidth = circleHeight = circleWidth / 2.5;
        lineWidth /= 2.5;
        canvas.width = canvas.height = circleWidth;
      } else if (window.innerWidth < 479) {
        mobile = true;
        circleWidth = circleHeight = circleWidth / 2;
        lineWidth /= 2;
        canvas.width = canvas.height = circleWidth;
        // height == width
        // в стилях для мобилки width = initial, поэтому берём высоту
  //      canvas.style.left =  canvas.height / 2 - canvas.offsetLeft + "px";
      } else {
          canvas.style.left = 0 + "px";
      }
      firstStart = false;
  }

    function go(d) {
      if (d < 0) {
        // sleep();
      // если setTimeout задерживает на меньшее кол-во времени,
      // то задерживаем выполнение дополнительно на
        clearTimeout(flyInterval);
        flyInterval = setTimeout(() => {
          c("target diff -> " + d);
          c("target count -> " + counter);
          go(0);
        }, (d * (-1)));
      } else {
        flyInterval = setTimeout(() => {
          fly();
        }, (timerStep - d));
      }
    }

  function fly() {
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
    console.log("prework states.countdown");
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
          go(diff);
        }
      }, 1000);

      isInitState = true;
    }
  }

  function work() {
  // console.log("work");
    if (!isInitState) {
      counterTimer = 0;
      ctx.strokeStyle = "#ff7c20";
      isInitState = true;
      curOuterLap++;
    }

    counterTimer = counterTimer + timerStep / 1000;
    timer = workTime - counterTimer;
    timerFormated = Math.round(timer, -3);
    isMomentForNextState();
  }

  function relax() {
//    console.log("relax");
    if (!isInitState) {
      counterTimer = relaxTime;
      ctx.strokeStyle = "#3b99ff";
      isInitState = true;
    }

    counterTimer = counterTimer - timerStep / 1000;
    timer = counterTimer;
    timerFormated = Math.round(timer, -3);
    isMomentForNextState();
    // circle(relaxTime);
  }

  function isMomentForNextState() {

    if (stopping()) return;

    let balance = 0;
    let nextState = 'new';
    let stateTime = 0;

    if (cur_state === states.relax) {
      balance = Math.abs((ideal) / 1000 - (workTime + relaxTime) * curOuterLap);
      nextState = states.work;
    }

    if (cur_state === states.work) {
      balance = Math.abs((ideal) / 1000 - ((workTime + relaxTime) * (curOuterLap - 1) + workTime));
      nextState = states.relax;
    }

    circle(stateTime = cur_state === states.work ? workTime : relaxTime);

    if ((balance <= 6 && stateTime > 10) || (balance <= 3 && stateTime > 5 && stateTime <= 10)) {
      if (balance%1<0.5) {audio.replay();} else {audio.stop();}

    }

    if (balance === 0) {
      state.update(state => nextState);
      counterTimer = 0;
      isInitState = false;
      audio.stop();
      if (nextState === states.work) {
          if (curInnerLap === maxInnerLap) {
            curInnerLap = 1;
          } else {
            curInnerLap++;
          }
      }
    }

    go(getDiff());
  }

  function getDiff() {
    real = (new Date().getTime() - startTime) ;
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
    clearInterval(flyInterval);
    ctx.strokeStyle = "#00b60a";
    circle(workTime);
    state.update(state => states.end);


    if (mobile) {
        setTimeout(()=>{
            document.getElementById("btn_start").scrollIntoView({behavior: "smooth"});
        }, 1000);
    }


    runAttempts.set(
                      Number.parseInt(
                                        localStorage.getItem('runAttempts')
                                      )
                      + 1 );

    localStorage.setItem('runAttempts', $runAttempts);
  }

  function circle(timeValue) {
  //    console.log("circle");
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

  @media (min-width: 640px) {
  }

  @media screen and (min-width: 291px) and (max-width: 479px) {
    .time-block {
      font-size: 1.5em !important;
      width: 150px !important;
      height: 150px !important;
      margin: 0 auto;
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
        margin: 0 auto;
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

{#if !sumTime && !preWorkTime}
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

<!--    <Textfield
      type="number"
      input$min="0"
      input$max="60"
      class="shaped-outlined"
      style="margin: 1em;"
      variant="outlined"
      bind:value={workTime}
      label="Время работы"
      input$aria-controls="helper-text-shaped-outlined-a"
      input$aria-describedby="helper-text-shaped-outlined-a" />
    <Textfield
      type="number"
      input$min="0"
      input$max="60"
      class="shaped-outlined"
      style="margin: 1em;"
      variant="outlined"
      bind:value={relaxTime}
      label="Время отдыха"
      input$aria-controls="helper-text-shaped-outlined-a"
      input$aria-describedby="helper-text-shaped-outlined-a" />
-->

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
        disabled =  "{!validateWorkTime()}"
    >
      <Label>Старт</Label>
    </Button>



  </div>
{/if}

<div class="tablo-side">

  <div class="clock-common">

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
  <p>start: {startTime}   sumTime: {sumTime}   remaining: {remaining}</p>
  <p>real: {real}</p>
  <p>ideal: {ideal}</p>
  <p>diff: {diff}</p>
  <br>
  <p>lap: {curInnerLap}</p>

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
    <!-- <source src="audio/music.ogg" type="audio/ogg; codecs=vorbis"> -->
    <source src="/sounds/sek.mp3" type="audio/mpeg">
    Тег audio не поддерживается вашим браузером. 
    <!-- <a href="audio/music.mp3">Скачайте музыку</a>. -->
  </audio>
</div>
