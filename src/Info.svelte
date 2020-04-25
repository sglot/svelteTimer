<div class="info-header">
		<span>v. 0.2 | </span>
		<span>Запуск {$runAttempts} | </span>
		<span>Звук 
            <span 
                style="text-decoration:underline double steelblue"
                on:click={changeMute}
            >
                    {$mute ? 'выкл' : 'вкл'}
            </span>
        </span>
</div>

<style>
    .info-header {
        font-size: 1em;
    }
</style>

<script>
	import { onMount } from 'svelte';
    import { mute } from "./stores/stores.js";
    import { runAttempts } from "./stores/stores.js";

	onMount(() => {
        // инициализация количества попыток запуска на текущем устройстве
        runAttempts.set(localStorage.getItem('runAttempts'));
        if (!isFinite($runAttempts) || $runAttempts === null) {
            runAttempts.set(0);
            localStorage.setItem('runAttempts', 0);
        }

        //инициализация звук вкл/выкл
        mute.set(localStorage.getItem('mute') === 'true' ? true : false);
        localStorage.setItem('mute', $mute);
    });
    
    function changeMute() {
        mute.set(!$mute);
        localStorage.setItem('mute', mute);
    }
    
</script>