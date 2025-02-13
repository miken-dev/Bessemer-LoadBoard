<script lang="ts">
	import { Map, TileLayer, Marker } from 'sveaflet';
	import { Map, TileLayer, Marker, Popup } from 'sveaflet';
	import { browser } from '$app/environment';
	import type { TableDataTypes } from '$lib/types';

	let {
		tableData,
		selectedCity = $bindable(),
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked = $bindable(),
		tableIsShowing = $bindable(),
		mapIsShowing = $bindable()
	}: {
		tableData: TableDataTypes[];
		selectedCity: string | null;
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
		tableIsShowing: boolean;
		mapIsShowing: boolean;
	} = $props();

	const toggle = (id: number, city: string) => {
		selectedRow = id;
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
						onclick={() => toggle(row.originCityName, row.loadID)}
						latLng={[row.originLat, row.originLng]}
					/>
				{:else}
					<Popup
						onclick={() => toggle(row.originCityName)}
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
