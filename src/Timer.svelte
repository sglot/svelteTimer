{#if !remaining}

    <div class="settings-side" id="settings" class:tiny="{remaining}" transition:slide="{{delay: 250, duration: 1000,}}">
        <h2 transition:fade>Параметры</h2>

       <Textfield
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

        <h3 class="status">Кругов: {laps}</h3>

        <label>
          <input type="range" bind:value={laps} min="1" max="10" />
        </label>

        <Button on:click={start} variant="unelevated">
          <Label>Старт</Label>
        </Button>

    </div>
{/if}

<div class="tablo-side">

  <div class="clock-common">


    <div class="time-block " class:text--disabled="{cur_state !== 'work'}" transition:fade> 
        <p>{states.work}</p>
    </div>


    <div style="position: relative;" class=" circle-height">
        <canvas class="clock-circle" width="0" id="cv"></canvas>

        <div class="time-block  circle-height">
            {#if preWorkTime}
                <p style="font-size: 0.5em" transition:slide="{{delay: 250, duration: 1000}}">Начинаем через </p>
                <span transition:slide="{{delay: 250, duration: 1000}}">{preWorkTime}</span>
            {/if}

            {#if null !== timer}
                <p transition:slide="{{delay: 250, duration: 1000}}">{timerFormated}</p>
            {/if}
        </div>
    </div>

    <div class="time-block" class:text--disabled="{cur_state !== 'relax'}" transition:fade>
        <p>{states.relax}</p>
    </div>
  </div> 



  <div class="common-block-data">
    <div class="common-block-data-list">
        {#if !mobile}
      <span >Общее время: {minutes} мин {seconds} сек</span>
      {/if}
      <span>Осталось: {rMinutes} мин {rSeconds} сек</span>
    </div>
    <progress value={$progress}></progress>
  </div>
</div>



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
      font-size: 2em!important;
      width: 100%!important;
      height: 2.3em!important;
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
    font-size: 5em;
    flex-flow: column;
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
    position:absolute; 
    /*top: 0;*/
    /*left: 0;*/
    /*width: 600px;*/
    /*height: 600px;*/
  }

  .text--active {
    opacity: 1;
  }

  .text--disabled {
    opacity: 0.5;
  }

  progress {
    display: block;
    width: 100%;
  }

  .marg {
    margin: 1em!important;
    background-color: #333333;
  }

  .clock-common {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  input[type="number"] {
    display: none!important;
    font-size: 10em;
  }

  .tiny {
    transition: top 1s cubic-bezier(0, 0, 1, 1) 500ms;
    top: -1000px!important;
  }
</style>





<script>

  import { state } from "./stores/stores.js";
  import { stateList } from "./stores/stores.js";

  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";

  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

  let workTime = 30;
  let relaxTime = 30;
  let laps = 3;

  let preWorkTime = null;
  let remaining = null;
  let timer = null;
  let timerFormated = null;
  let counterTimer = 0;

  let startIntervalId;
  let preWorktIntervalId;
  let timerIntervalId;

  let flyInterval;
  let isInitState = false;

  let cur_state;
  let states;

  let canvas;
  let ctx;
  let mobile = false;

  let circleWidth = 300;
  let circleHeight = 300;
  let lineWidth = 8;

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

  $: allTime = (workTime + relaxTime) * laps - relaxTime;
  $: hours = Math.floor(allTime / 60 / 60);
  $: minutes = Math.floor(allTime / 60) - hours * 60;
  $: seconds = Math.round(allTime % 60);

  $: rHours = Math.round(remaining / 60 / 60);
  $: rMinutes = Math.round(remaining / 60) - rHours * 60;
  $: rSeconds = Math.round(remaining % 60);



  function start() {
    init();
    cur_state = 'preWork';
    // remaining = allTime;

    flyInterval = setInterval(() => {
        fly();
    }, 50);
 
  }

  function fly() {
    if (cur_state === 'preWork') {
      preWork();
    }

    if (cur_state === 'work') {
      work();
    }

    if (cur_state === 'relax') {
      relax();
    }

    if (cur_state === 'recovery') {
      // work();
    }

    if (cur_state === 'pause') {
      // work();
    }

    
  }

  function init() {
    preWorkTime = 3;
    remaining = allTime;

    canvas = document.getElementById('cv');
    canvas.width = circleWidth;
    canvas.height = circleWidth;
    ctx = canvas.getContext('2d');
    canvas.style.left = 0 + 'px';

    if (window.innerWidth < 400) {
      mobile = true;
      circleWidth = circleHeight = circleWidth / 2;
      lineWidth /= 2;
      canvas.width = canvas.height = circleWidth;
      canvas.style.left = canvas.offsetLeft - canvas.width / 2  + 'px';
    }
  }

  function preWork() {
    // до начала 3,2,1...
    if (!isInitState) {
      preWorktIntervalId = setInterval(() => {
        preWorkTime--;
        if (0 === preWorkTime) {
          clearInterval(preWorktIntervalId);
          // startRemaining();
          setTimeout(()=>{
            state.update(state => "work");
            isInitState = false;
          }, 1000)
          
        }
      }, 1000);
      isInitState = true;
    }
    
  }

  function work() {
    //timer = workTime;
    console.log('work ' + timer);
    if (!isInitState) {
      counterTimer = 0;
      ctx.strokeStyle = '#ff7c20';
      isInitState = true;
    }

    counterTimer = counterTimer + 0.05; 
    // if (Math.trunc(workTime - counterTimer) === Math.round(workTime - counterTimer, -5)) {
    timer = workTime - counterTimer;
    timerFormated = Math.round(timer, -5);
    // }
    startRemaining();
    circle(workTime);
console.log('work after' + timer);
console.log('counterTimer after' + counterTimer);
    isMomentForNextState();
  }

  function relax() {
   // timer = relaxTime;
    if (!isInitState) {
      counterTimer = relaxTime;
      ctx.strokeStyle = '#3b99ff';
      isInitState = true;
    }

    counterTimer = counterTimer - 0.05; 
    timer = counterTimer;
    timerFormated = Math.round(timer, -5);
    startRemaining();
    circle(relaxTime);
    
console.log('relax after' + timer);
console.log('counterTimer after' + counterTimer);
    isMomentForNextState();
  };

  function isMomentForNextState() {
    if (Math.abs(0 - timer) < 0.05) {
        counterTimer = 0;
        isInitState = false;
        // clearInterval(timerIntervalId);
        if(remaining > 0) {
          if (cur_state === 'relax') {
            state.update(state => "work");
            // work();
          } else if (cur_state === 'work') {
            state.update(state => "relax");
            // relax();
          }
          // isInitState = false;
        }
    }
  }
  
  function startRemaining() {
      if (remaining <= 0) {
          stop();
      } else {

        remaining = remaining - 0.05;
        progress.set( ((allTime - remaining) * 100 ) / allTime / 100);
      }
        
  };

  function stop() {
      timer = 0;
      clearInterval(flyInterval);
      
  }

  function circle(timeValue) {

    ctx.beginPath();
    ctx.clearRect(0, 0, circleWidth, circleHeight);
    let rad = ((counterTimer) * (180/timeValue)) * (Math.PI * 2) / 180;
    let radius = Math.round(circleHeight/2) - lineWidth - 0.5;

    ctx.lineWidth = lineWidth;
    ctx.arc(circleHeight / 2, circleHeight / 2, radius,  -Math.PI / 2, rad - Math.PI / 2, false);
    ctx.stroke();
  }


  function rideUp(node, { duration }) {
  		return {
  			duration,
  			css: t => {
//  				const eased = elasticOut(t);

  				return `
  					transition: top 1s cubic-bezier(0, 0, 1, 1) 500ms;
                    top: -1000px!important;`
  			}
  		};
  	}
</script>