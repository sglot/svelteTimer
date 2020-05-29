<script>
  import { state } from "./stores/stores.js";
  import { stateList } from "./stores/stores.js";

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

  let preWorkTime = null;
  let remaining = null;
  let timer = null;
  let timerFormated = null;
  let counterTimer = 0;
  let mute = false; // global variable for class Sound too
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
  let curLap = 0;

  let startTime;
  let ideal = 0;
  let real = 0;
  let diff = 0;
  let counter = 0;

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
  }

  $: allTime = (workTime + relaxTime) * laps - relaxTime;
  //  $: remaining = allTime - sumTime;

  $: hours = Math.floor(allTime / 60 / 60);
  $: minutes = Math.floor(allTime / 60) - hours * 60;
  $: seconds = Math.round(allTime % 60);

  $: rHours = Math.round(remaining / 60 / 60);
  $: rMinutes = Math.round(remaining / 60) - rHours * 60;
  $: rSeconds = Math.round(remaining % 60);




  function start() {
    init();
    cur_state = "preWork";
    go(0);
  }

  function fly() {

    if (cur_state === "preWork") {
      preWork();
      return;
    } 

    sumTime += timerStep / 1000;
    counter++;
    ideal = counter * timerStep;

    engine[cur_state]();
  }

  function init() {
    console.log("init");
    preWorkTime = 3;
    remaining = allTime;
    timerStep = 50;
    sumTime = 0;
    counter = 0;
    curLap = 0;
    isInitState = false;
    mobile = false;
    audio = new Sound(mute, '/sounds/sek.mp3');
    


    canvas = document.getElementById("cv");
    canvas.width = circleWidth;
    canvas.height = circleWidth;
    ctx = canvas.getContext("2d");
    canvas.style.left = 0 + "px";

    if (window.innerWidth < 400) {
      mobile = true;
      circleWidth = circleHeight = circleWidth / 2;
      lineWidth /= 2;
      canvas.width = canvas.height = circleWidth;
      canvas.style.left = canvas.offsetLeft - canvas.width / 2 + "px";
    }
  }

  function preWork() {
    console.log("prework");
    // до начала 3,2,1...
    if (!isInitState) {
      audio.replay();
       

      preWorktIntervalId = setInterval(() => {
        
        audio.replay();
         

        console.log(preWorkTime);
        preWorkTime--;
        c('pre === ' + preWorkTime);
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



var flag=0;
  function go(d) {
        if (flag) {c("d--- " + d); c("flag = 1 count -> " + counter);} else
        if (d < 0) {
          // sleep();
        // если setTimeout задерживает на меньшее кол-во времени, 
        // то задерживаем выполнение дополнительно на 

        clearTimeout(flyInterval);

        flyInterval = setTimeout(() => {
                // flag =1;
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

  function work() {
   console.log("work");
    if (!isInitState) {
      counterTimer = 0;
      ctx.strokeStyle = "#ff7c20";
      isInitState = true;
      curLap++;
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
//    console.log("ismoment");
    if (stopping()) return;

    if (cur_state === states.relax) {
      diff = getDiff();
      c("relax ->  " + (real / 1000 - (workTime + relaxTime) * curLap));
      c("diff ->  " + (diff));
      if (flag ==1 ) c("diff -> flag =1  ");

      if (Math.abs((ideal) / 1000 - (workTime + relaxTime) * curLap) == 0) {
        state.update(state => states.work);
        counterTimer = 0;
        isInitState = false;

        c("relax -> work: " + (real / 1000 - (workTime + relaxTime) * curLap));
      }

      circle(workTime);
      
      go(diff);
      return;
    }


    if (cur_state === states.work) {
      c("ideal ->  " + (ideal));
      circle(relaxTime);
      diff = getDiff();

      if (Math.abs((ideal) / 1000 - ((workTime + relaxTime) * (curLap - 1) + workTime)) == 0) {
        state.update(state => states.relax);
        counterTimer = 0;
        isInitState = false;
        c("work -> relax: " + (real / 1000 - ((workTime + relaxTime) * (curLap - 1) + workTime)));
        c("relax ->  " + (real / 1000 - (workTime + relaxTime) * curLap));
        c("diff ->  " + (diff));
      }
      
      
      go(diff);
    }
  }

  function getDiff() {
    real = (new Date().getTime() - startTime) ;
    return real - ideal;
  }

  function stopping() {
//    console.log("stopppnig");
// real = (new Date().getTime() - startTime)
    remaining = allTime - ideal / 1000;
    if (remaining == 0) {
      stop();
      console.log("stop: sumTime: " + sumTime);
      console.log("stop: real: " + real / 1000);
      return true;
    } else {
      // remaining = allTime - sumTime;
      progress.set(((allTime - remaining) * 100) / allTime / 100);
      return false;
    }
  }

  function stop() {
    console.log("stop");
    timer = 0;
    sumTime = 0;
    clearInterval(flyInterval);
    circle(workTime);
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

  @media screen and (max-width: 479px) {
    .time-block {
      font-size: 2em !important;
      width: 100% !important;
      height: 2.3em !important;
    }

    .clock-common {
      flex-flow: column;
    }

    .common-block-data {
      font-size: 0.7em;
    }

    .circle-height {
      height: 150px !important;
    }

    .settings-block-container {
        flex-flow: column;
    }

    .settings-block--time {
      font-size: 1em !important;
      width: initial !important;
      height: 2.3em !important;
      height: 150px !important;
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
    margin: 0 2em;
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
    transition:slide={{ delay: 250, duration: 1000 }}>
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


    <Button on:click={start} variant="unelevated" disabled="{!validateWorkTime()}">
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
