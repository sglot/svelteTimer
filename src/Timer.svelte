<h2>{cur_state}</h2>
<div class="settings-block">
        <Textfield type="number" input$min="0" input$max="60" class="shaped-outlined" variant="outlined" bind:value={workTime} label="Время работы" input$aria-controls="helper-text-shaped-outlined-a" input$aria-describedby="helper-text-shaped-outlined-a" />
        <Textfield type="number" input$min="0" input$max="60" class="shaped-outlined" variant="outlined" bind:value={relaxTime} label="Время отдыха" input$aria-controls="helper-text-shaped-outlined-a" input$aria-describedby="helper-text-shaped-outlined-a" />

        <h3 class="status">Кругов: {laps}</h3>
      </div>

<label>

	<input type=range bind:value={laps} min=0 max=10>
</label>

<Button on:click={start} variant='unelevated'>
  <Label>Старт</Label>
</Button>


<div class="common-block-data">
    <div class="common-block-data-list">
        <p>Общее время: {minutes} мин {seconds} сек</p>
        <p>Осталось: {rMinutes} мин {rSeconds} сек</p>
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
</style>

<script>
    let workTime = 30;
    let relaxTime = 30;
    let laps = 3;

    let remaining = null;

    let startIntervalId;

    $: allTime = ((workTime + relaxTime) * laps);
    $: hours = Math.floor(allTime / 60 / 60);
    $: minutes = Math.floor(allTime/ 60) - (hours * 60);
    $: seconds = allTime % 60;


        $: rHours = Math.floor(remaining / 60 / 60);
        $: rMinutes = Math.floor(remaining/ 60) - (rHours * 60);
        $: rSeconds = remaining % 60;


//    import Slider from '@smui/slider'
    import Textfield from '@smui/textfield'
    import Button, {Label} from '@smui/button';
    import {state} from './stores/stores.js';

    let cur_state;

	const unsubscribe = state.subscribe(value => {
		cur_state = value;
	});

    function start() {
        remaining = allTime;
        startIntervalId = setInterval(()=>{
            remaining--;
            if (remaining === 0) {
                clearInterval(startIntervalId);
                alert('Типа закончил');
            }
        }, 1000);



    }
    
    function stop() {

    }


</script>