<script>
    import Button from '@smui/button';
    import Timer from './Timer.svelte';

    let showTimer = true;

    export let name;

</script>

<main>

	<p>Svelte Timer. Powered by "Chto, opyat?"</p>
	<Button on:click={() => {showTimer = !showTimer;}}>{name} click</Button>

{#if showTimer}
	<Timer/>
{/if}


</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>