<div class="info-header">
		<span>v. 0.2 | </span>
		<span>Запуск {runAttempts}</span>
</div>

<style>
    .info-header {
        font-size: 1em;
    }
</style>

<script>
	import { onMount } from 'svelte';

    let runAttempts = 0;

	onMount(() => {
        runAttempts = localStorage.getItem('runAttempts');
        if (!isFinite(runAttempts) || runAttempts === null) {
            runAttempts = 0;
            localStorage.setItem('runAttempts', 0);
        }
    });
    
    


</script>