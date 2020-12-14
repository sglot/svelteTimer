<script lang="ts">
    import { onMount } from "svelte";
    import { interpolateString as interpolate } from 'd3-interpolate';
    import { tweened } from 'svelte/motion';

    import { timeFromStart } from "../stores/stores";
    import { conf } from "../config/config";
    import { state, stateList, settings } from "../stores/stores";
    import { GraphManager } from "../core/graph/GraphManager";
    
    export let allTime: number;
    export let variant: string;

    let graphManager: GraphManager;
    let isInitialized = false;
    let lastState;

    let color = 'rgba(180, 180, 180, 1';
    const time = tweened(8);
    const value = tweened(10);
    const shape =  tweened('M0 10 L0 10', { interpolate });

    onMount(() => {
        initGraph();
        isInitialized = true;
        lastState = $stateList.work;
    });
    
    function initGraph() {
        graphManager = new GraphManager();  
        graphManager.setGraph(variant);
         
        if (variant !== "separated" ) {
            shape.set(`M0 10 L${graphManager.getWidth()} 10`, { interpolate });
        }
       
    };

    timeFromStart.subscribe(newValue => {
        if (!isInitialized) return;

        if (!graphManager.configured()) {
            graphManager.setParams(allTime, conf.timerStep, time, shape);
            graphManager.drawStep(conf.colors.work + '1', false);
            console.log('configured!!!');
            return;
        }

        let divide = lastState != $state;
        lastState = $state;

        if ($state == $stateList.work) {
            color = conf.colors.work + '1'; //(divide ? 1 : (0.5 + newValue / 2));
            graphManager.drawStep(color, divide);
            return;
        }

        if ($state == $stateList.relax) {
            color = conf.colors.relax + '1'; //+ (1 - newValue / 2);
            graphManager.drawStep(color, divide);
            return;
        }

        if ($state === $stateList.recovery) {
            color = conf.colors.recovery + '1'; //+ (0.5 + newValue / 2);
            graphManager.drawStep(color, divide);
            return;
        }

        if ($state === $stateList.end) {
            graphManager.drawToEnd(conf.colors.work + '1');
            graphManager.dropConfigured();
            return;
        }

    });

</script>

<style>
    .time-indicator {
        width: 100%;
        height: 20px;
    }

</style>

{#if variant === "separated"}
    <div>
        <canvas id="graph-separated" class="time-indicator"/>
    </div>
{/if}

{#if variant === "tiny"}
    <div id="graph-tiny" class="time-indicator">
        {#if isInitialized}
            <svg viewBox="0 0 {graphManager.getWidth()} {graphManager.getHeight()}">
                <g class="canvas">

                    <g class="graph">
                        <path
                            d="{$shape.toString()}"
                            stroke="{color})"
                            stroke-width="5"
                            fill="{color})"
                        />

                        <circle
                            cx="{$time}"
                            cy="{$value}"
                            r="{graphManager.getCursorRadius()}"
                            fill="#004eff"
                        />
                    </g>
                </g>
            </svg>
        {/if}
    </div>
{/if}
