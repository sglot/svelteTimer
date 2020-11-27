<script lang="ts">
    import { onMount } from "svelte";
    import { mute } from "./stores/stores";
    import { runAttempts } from "./stores/stores";

    onMount(() => {
        // инициализация количества попыток запуска на текущем устройстве
        runAttempts.set(parseInt(localStorage.getItem("runAttempts")));
        if (!isFinite($runAttempts) || $runAttempts === null) {
            runAttempts.set(0);
            localStorage.setItem("runAttempts", "0");
        }

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
</style>

<div class="info-header">
    <span>v. 1.0.2 | </span>
    <span>Запуск
        <span style="text-decoration:underline steelblue">
            {$runAttempts}
            |
        </span>
    </span>
    <span>Звук
        <span
            style="text-decoration:underline double steelblue"
            on:click={changeMute}>
            {$mute ? 'выкл' : 'вкл'}
        </span>
    </span>
</div>
