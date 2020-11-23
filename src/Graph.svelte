<script lang="ts">
    import { onMount } from "svelte";
    import { Graph } from "./core/Graph";
    import { timeFromStart } from "./stores/stores";
     // import { mute } from "./stores/stores";
    // import { runAttempts } from "./stores/stores";

    let chart: Graph;
    let isInitialized = false;
    onMount(() => {
        initChart();
        isInitialized = true;
    });

    timeFromStart.subscribe(newValue => {
        if (!isInitialized) return;
        chart.drawRect(newValue, '#fff');   
    });

    function initChart() {
        chart = new Graph('graph');
        // chart.drawAxios();
        // setInterval(()=>{
        //     chart.drawRect($timeFromStart, '#fff');    
        // }, 1);
        
        console.log("c");
        
  
    };
</script>

<style>
    .graph {
        /* width: 1300px;
        height: 200px; */
        
    }
    .time-indicator {
        background-color: rgba(1, 1, 17, 0.678);
        /* border-radius: 50; */
        width: 100%;
        height: 20px;
    }
</style>

<div class="chart--content">
    <div
        class="graph"
        
    >
        <canvas id="graph" class="time-indicator"/>
    </div>
</div>
