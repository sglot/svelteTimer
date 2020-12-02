<script lang="ts">
    import { onMount } from "svelte";
    import { Graph } from "../core/Graph";
    import { timeFromStart } from "../stores/stores";
    import { conf } from "../config/config";
    import { state, stateList, settings } from "../stores/stores";

    export let allTime: number;

    let graph: Graph;
    let isInitialized = false;
    let config = null;
    let lastState;

    onMount(() => {
        initGraph();
        isInitialized = true;
        lastState = $stateList.work;
    });
    
    timeFromStart.subscribe(newValue => {
        if (!isInitialized) return;

        if (!graph.configured()) {
            graph.setParams(allTime, conf.timerStep);
            console.log('configured!!!');
            return;
        }

        let divide = lastState != $state;

        if ($state == $stateList.work) {
            graph.drawStep(conf.colors.work + (divide ? 1 : (0.5 + newValue / 2)), divide);
            lastState = $state;
            return;
        }

        if ($state == $stateList.relax) {
            graph.drawStep(conf.colors.relax + (1 - newValue / 2), divide);
            lastState = $state;
            return;
        }

        if ($state === $stateList.recovery) {
            
            graph.drawStep(conf.colors.recovery + (0.5 + newValue / 2), divide);
            lastState = $state;
            return;
        }

        if ($state === $stateList.end) {
            console.log('is stop + drop configured graph');
            graph.drawToEnd(conf.colors.work + '1');
            graph.dropConfigured();
            lastState = $state;
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
        height: 20px;
    }

    @media (max-width: 640px) {
        .time-indicator {
            height: 10px;
        }
    }
</style>

<div>
    <canvas id="graph" class="time-indicator"/>
</div>
