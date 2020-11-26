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
        initGraph();
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
            graph.drawStep(newValue,    conf.colors.work + 1+(0.5 + newValue / 2));
            return;
        }

        if ($state == $stateList.relax) {
            graph.drawStep(newValue,    conf.colors.relax + 1+(1 - newValue / 2));
            return;
        }

        if ($state === $stateList.recovery) {
            graph.drawStep(newValue,    conf.colors.recovery + (0.5 + newValue / 2));
            return;
        }

        if ($state === $stateList.end) {
            console.log('is stop + drop configured graph');
            graph.drawToEnd(conf.colors.work + (1));
            graph.dropConfigured();
            return;
        }

    });

    function initGraph() {
        graph = new Graph('graph');  
    };
</script>

<style>
    .time-indicator {
        width: 100%;
        height: 10px;
    }
</style>

<div>
    <canvas id="graph" class="time-indicator"/>
</div>
