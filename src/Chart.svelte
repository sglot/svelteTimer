<script lang="ts">
    import { onMount } from "svelte";
    // import { Chart } from "./core/Chart";

     // import { mute } from "./stores/stores";
    // import { runAttempts } from "./stores/stores";

    // let chart: Chart;
    let context;
    onMount(() => {
        initChart();
    });

    function initChart() {
        // chart = new Chart('time-indicator');
        // chart.drawAxios();
        // setInterval(()=>{chart.drawAxios()}, 1000);
        console.log("c");
        
  
    };
</script>

<style>
    .chart {
        width: 1300px;
        height: 200px;
        
    }
    .time-indicator {
        background-color: rgb(14, 14, 133);
        border-radius: 50;
        width: 2px;
        height: 2px;
    }
</style>

<div class="chart--content">
    <div
        class="chart"
        id="chart-timeline"
    >
    <div class="time-indicator"></div>
    </div>
</div>
