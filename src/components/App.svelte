<script lang="ts">
	import Timer from "./Timer.svelte";
	import Info from "./Info.svelte";
	import AdvancedSettings from "./settings/AdvancedSettings.svelte";
	import Settings from "./settings/Settings.svelte";
	import Introduction from "./Introduction.svelte";
</script>

<main>
	<Info />

	<p>Svelte Timer. Inspired by "Chto, opyat?"</p>

	<Settings />

	<Introduction />

	<Timer />

	<AdvancedSettings />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	@media (max-width: 640px) {
		main {
			padding-left: 0;
			padding-right: 0;
			margin: 0 2rem;
		}
	}
</style>
