<script lang="ts">
	import { Map, TileLayer, Marker, Popup } from 'sveaflet';
	import { browser } from '$app/environment';
	import type { TableDataTypes } from '$lib/types';

	let {
		multipleLoads = $bindable(), 
		tableData,
		selectedCity = $bindable(),
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked = $bindable()
	}: {
		multipleLoads: boolean
		tableData: TableDataTypes[];
		selectedCity: string | null;
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
	} = $props();

	const toggle = (multiLoads: boolean, city: string, id?: number) => {
		if (id) {
			selectedRow = id;
		}
		multipleLoads = multiLoads,
		selectedCity = city;
		console.log(city);
		console.log(selectedCity);
		console.log(city === selectedCity);
		detailsHidden = false;
		tableClicked = false;
	};
</script>

{#if browser}
	<div class="mt-8 h-full w-full">
		<Map
			options={{
				center: [44.67498, -103.856037],
				zoom: 4.4
			}}
		>
			<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
			{#each tableData as row}
				{#if row.areaLoadCount === 1}
					<Marker
						onclick={() => toggle(false, row.originCityName, row.loadID)}
						latLng={[row.originLat, row.originLng]}
					/>
				{:else}
					<Popup
						onclick={() => toggle(true, row.originCityName)}
						latLng={[row.originLat, row.originLng]}
						options={{
							autoClose: false,
							closeOnEscapeKey: false,
							closeOnClick: false
						}}
					>
						<div class="text-2xl font-bold text-center">{row.areaLoadCount}</div>
					</Popup>
				{/if}
			{/each}
		</Map>
	</div>
{/if}
