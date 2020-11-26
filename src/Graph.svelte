<script lang="ts">
    import { onMount } from "svelte";
    import { Graph } from "./core/Graph";
    import { timeFromStart } from "./stores/stores";
    import { conf } from "./config/config.js";
    import { state, stateList, settings } from "./stores/stores";

    export let allTime: number;

    let graph: Graph;
    let isInitialized = false;
    let config = null;

    onMount(() => {
        initChart();
        isInitialized = true;
    });
    
    timeFromStart.subscribe(newValue => {
        if (!isInitialized) return;

        if (!graph.configured()) {
            graph.setParams(allTime, conf.timerStep);
            console.log('configured!!!');
            return;
        }
        console.log('state==' + $state);
        if ($state == $stateList.work) {
            // console.log('wooooooooooork!!!');
            graph.drawStep(newValue,    conf.colors.work + (0.7 + newValue / 3.33));
            return;
        }

        if ($state == $stateList.relax) {
            graph.drawStep(newValue,    conf.colors.relax + (1 - newValue / 3.33));
            return;
        }

        if ($state === $stateList.recovery) {
            graph.drawStep(newValue,    conf.colors.recovery + (0.5 + newValue / 2));
            return;
        }

    });

    function initChart() {
        graph = new Graph('graph');  
    };
</script>

<style>
    .graph {
        /* width: 1300px;
        height: 200px; */
        
    }
    .time-indicator {
        background-color: rgba(241, 241, 247, 0.678);
        /* border-radius: 50; */
        width: 100%;
        height: 10px;
    }
</style>

<div class="chart--content">
    <div
        class="graph"
        
    >
        <canvas id="graph" class="time-indicator"/>
    </div>
</div>
