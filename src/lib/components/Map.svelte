<script lang="ts">
	import { Map, TileLayer, Marker } from 'sveaflet';

	import type { TableDataTypes } from '$lib/types';

	let {
		tableData,
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked = $bindable(),
		tableIsShowing = $bindable(),
		mapIsShowing = $bindable()
	}: {
		tableData: TableDataTypes[];
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
		tableIsShowing: boolean;
		mapIsShowing: boolean;
	} = $props();

	const toggle = (id: number) => {
		selectedRow = id;
		detailsHidden = false;
		tableClicked = false;
	};

</script>

<div class="h-full w-full md:mt-20">
	<Map 
		options={{
			center: [44.67498, -103.856037],
			zoom: 4.4
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		{#each tableData as row}
			<Marker onclick={() => toggle(row.loadID)} latLng={[row.originLat, row.originLng]} />
		{/each}

	</Map>
</div>
