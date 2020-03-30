{#if !remaining}
    <h2>Параметры</h2>

    <div class="settings-side">
       <Textfield
        type="number"
        input$min="0"
        input$max="60"
        class="shaped-outlined"
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
        variant="outlined"
        bind:value={relaxTime}
        label="Время отдыха"
        input$aria-controls="helper-text-shaped-outlined-a"
        input$aria-describedby="helper-text-shaped-outlined-a" />

        <h3 class="status">Кругов: {laps}</h3>

        <label>
          <input type="range" bind:value={laps} min="0" max="10" />
        </label>

        <Button on:click={start} variant="unelevated">
          <Label>Старт</Label>
        </Button>

    </div>
{/if}

<div class="tablo-side">

  <div style="position: relative; display: flex; justify-content: space-between;">


    <div class="time-block " class:text--disabled="{cur_state === 'relax'}">
        <p>Нагрузка</p>
    </div>


    <div style="position: relative;" >
        <canvas class="clock-circle" width="300" height="300" id="cv"></canvas>

        <div class="time-block">
            {#if preWorkTime}
                <p style="font-size: 0.5em">Начинаем через </p>
                <span>{preWorkTime}</span>
            {/if}

            {#if timer}
                <p>{timer}</p>
            {/if}
        </div>
    </div>

    <div class="time-block" class:text--disabled="{cur_state === 'work'}>
        <p>Отдых</p>
    </div>
  </div> 

  <p>{cur_state}</p>
  <LinearProgress {progress}{closed} />

  <div class="common-block-data">
    <div class="common-block-data-list">
      <p>Общее время: {minutes} мин {seconds} сек</p>
      <p>Осталось: {rMinutes} мин {rSeconds} сек</p>
    </div>
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
    main {
      max-width: none;
    }
  }

  .common-block-data {
    display: flex;
    justify-content: flex-end;
  }

  .common-block-data-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: justify;
  }

  .time-block {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    font-size: 5em;
    flex-flow: column;
  }

  .clock-circle {
    position:absolute; 
    top: 0;
    left: 0;
    /*width: 600px;*/
    /*height: 600px;*/
  }

  .text--active {
    opacity: 1;
  }

  .text--disabled {
      opacity: 0.5;
    }
</style>





<script>
  //    import Slider from '@smui/slider'
  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";
  import { state } from "./stores/stores.js";

  import LinearProgress from '@smui/linear-progress';

  let workTime = 30;
  let relaxTime = 30;
  let laps = 3;
  let preWorkTime = null;
  let remaining = null;
  let timer = null;
  let closed = false;
  let progress = 0;
  let startIntervalId;
  let preWorktIntervalId;
  let timerIntervalId;

  let cur_state;
  let ctx;


  const unsubscribe = state.subscribe(value => {
    cur_state = value;
  });

  $: allTime = (workTime + relaxTime) * laps - relaxTime;
  $: hours = Math.floor(allTime / 60 / 60);
  $: minutes = Math.floor(allTime / 60) - hours * 60;
  $: seconds = allTime % 60;

  $: rHours = Math.floor(remaining / 60 / 60);
  $: rMinutes = Math.floor(remaining / 60) - rHours * 60;
  $: rSeconds = remaining % 60;






  function start() {
    var canvas = document.getElementById('cv');  
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'red';
    
    remaining = allTime;
    preWork();
  }

  function preWork() {
    // до начала 3,2,1...
    preWorkTime = 3;
    preWorktIntervalId = setInterval(() => {
      preWorkTime--;
      if (0 === preWorkTime) {
          
        clearInterval(preWorktIntervalId);
        startRemaining();
        state.update(state => "work");
        work();
      }
    }, 1000);


  }

  function work() {
    timer = workTime;
    timerIntervalId = setInterval(() => {
      timer--;
         circle();
      if (0 === timer) {
       
        clearInterval(timerIntervalId);
        if (cur_state === 'work') {
        state.update(state => "relax");
        relax();
        }
        
      }
    }, 1000);
  }

  function stop() {
      timer = 0;
      clearInterval(timerIntervalId);
  }

  function disp() {};
  function relax() {
    timer = relaxTime;
    timerIntervalId = setInterval(() => {
      timer--;
      if (0 === timer) {
        clearInterval(timerIntervalId);
        if (cur_state === 'relax') {
        state.update(state => "work");
        work();
        }
        
      }
    }, 1000);
  };

  function startRemaining() {
      startIntervalId = setInterval(() => {
      remaining--;
      progress = ((allTime - remaining) * 100 ) / allTime / 100;
      console.log (progress);
      if (remaining === 0) {
        clearInterval(startIntervalId);
        alert("Типа закончил");
        stop();
      }
    }, 1000);
  };

  function circle() {
  
    ctx.beginPath();
    ctx.clearRect(0, 0, 300, 300);
    let rad = ((workTime - timer) * (180/workTime)) * (Math.PI * 2) / 180;
    ctx.arc(150, 150, 150,  -Math.PI / 2, rad - Math.PI / 2, false);
    ctx.stroke();
  }


</script>