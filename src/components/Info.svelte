<script lang="ts">
    import { onMount } from "svelte";
    import { mute } from "../stores/stores";
    import History from "./History.svelte";

    onMount(() => {
        //инициализация звук вкл/выкл
        mute.set(localStorage.getItem("mute") === "true" ? true : false);
        localStorage.setItem("mute", $mute.toString());
    });

    function changeMute(): void {
        mute.set(!$mute);
        localStorage.setItem("mute", $mute.toString());
    }
</script>

<style>
    .info-header {
        font-size: 1em;
    }

    .pressed {
        display: inline-block;
        -webkit-transition: -webkit-transform 0.5s;
        transition: transform 0.2s;
    }

    .pressed:hover {
        color: darkcyan;
        -webkit-transform: translate(0, -2px);
        transform: translate(0, -2px);
    }
</style>

<div class="info-header">
    <span>v. 1.2.1 | </span>
    <span>Запуск
        <History/>
        |
    </span>
    <span>Звук
        <span
            style="text-decoration:underline double steelblue; cursor: pointer;"
            class="pressed"
            on:click={changeMute}>
            {$mute ? 'выкл' : 'вкл'}
        </span>
    </span>
</div>