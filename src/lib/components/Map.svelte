<script lang="ts">
	import { Map, TileLayer, Marker } from 'sveaflet';

	import type { TableDataTypes } from '$lib/types';

	let {
		tableData,
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked = $bindable()
	}: {
		tableData: TableDataTypes[];
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
	} = $props();

	const toggle = (id: number) => {
		selectedRow = id;
		detailsHidden = false;
		tableClicked = false;
	};
</script>

<div class="size-80 md:h-svh md:w-screen">
	<Map
		options={{
			center: [44.67498, -103.856037],
			zoom: 4.4
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		{#each tableData as row, index}
			<Marker onclick={() => toggle(row.loadID)} latLng={[row.originLat, row.originLng]} />
		{/each}

		<Marker latLng={[51.505, -0.09]} />
	</Map>
</div>
