<script lang="ts">
	let active = 'bg-blue-600'
	let inactive = 'bg-gray-500'
	let {
		tableIsShowing = $bindable(),
		mapIsShowing = $bindable()
	}: {
		tableIsShowing: boolean;
		mapIsShowing: boolean;
	} = $props();
</script>

<div class="flex justify-end ">
	<p class="my-auto">Show:</p>
	<button class="{tableIsShowing ? active : inactive } text-white py-2 px-4 my-3 mx-1 rounded"
		onclick={() => {
			tableIsShowing = !tableIsShowing;
		}}>Table</button
	>
	<button class="{mapIsShowing ? active : inactive } text-white py-2 px-4 my-3 mx-1 rounded"
		onclick={() => {
		mapIsShowing = mapIsShowing === true ? false : true
	}}>Map</button>
</div>
