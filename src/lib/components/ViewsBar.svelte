<script lang="ts">
	let {
		tableIsShowing = $bindable(),
		mapIsShowing = $bindable()
	}: {
		tableIsShowing: boolean;
		mapIsShowing: boolean;
	} = $props();
</script>

<div class="flex">
	<button
		onclick={() => {
			tableIsShowing = !tableIsShowing;
		}}>Table</button
	>
	<button onclick={() => {
		mapIsShowing = mapIsShowing === true ? false : true
	}}>Map</button>
</div>
