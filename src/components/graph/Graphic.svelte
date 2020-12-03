
<script>
	import { interpolateString as interpolate } from 'd3-interpolate';
	import { tweened } from 'svelte/motion';
    import * as eases from 'svelte/easing';

	import Grid from './Grid.svelte';

	let duration = 2000;
    let ease = "sineIn";
	let playing = false;
	let width;
	let h;

    let shape = 'M0 1000';
		for (let i = 1; i <= 1000; i++) {
			shape = `${shape} L${(i / 1000) * 1000} 500 `;
        }
        
	const ease_path = tweened(shape, { interpolate });
	const time = tweened(0);
    const value = tweened(1000);
    


	async function runAnimations() {
		playing = true;

		value.set(1000, {duration: 0});
		time.set(0, {duration: 0});

		await ease_path.set(shape);
		await Promise.all([
			time.set(1000, {duration, easing: x => x}),
			value.set(0, {duration, easing: eases[ease]})
		]);

		playing = false;
	}

	$: runAnimations();
</script>

<style>
	.easing-vis {
		display: flex;
		max-height: 20px;
		max-width: 100%;
		margin: auto;
		padding: 10px;
		border: 1px solid #333;
		border-radius: 2px;
		/* padding: 20px; */
	}

	svg {
		width: 100%;
		/* margin: 0 20px 0 0; */
	}

	/* .graph {
		transform: translate(200px,400px)
	} */

	/* @media (max-width:600px) {
		.easing-vis {
			flex-direction: column;
			max-height: calc(100% - 3rem);
		}
	} */
</style>

<div bind:offsetWidth={width} class="easing-vis">
	<svg viewBox="0 0 1802 20">
		<g class="canvas">
			<Grid x={$time} y={$value}/>
			<g class="graph">
				<path
					d={$ease_path}
					stroke="#333"
					stroke-width="2"
					fill="none"
				/>

				<circle
					cx="{$time}"
					cy="{$value}"
					r="15"
					fill="#ff3e00"
				/>
			</g>
		</g>
	</svg>

</div>