<script lang="ts">
    import Timer from './Timer.svelte';
	import Info from './Info.svelte';
	import AdvancedSettings from './settings/AdvancedSettings.svelte';
	import Settings from './settings/Settings.svelte';
</script>

<main>
		
	<Info/>

	<p>Svelte Timer. Inspired by "Chto, opyat?"</p>

	<Settings/>

	<Timer/>
	
	<AdvancedSettings/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		/*max-width: 1240px;*/
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>