<script lang="ts">
	import { Map, TileLayer, Marker, Popup } from 'sveaflet';
	import { browser } from '$app/environment';
	import type { TableDataTypes } from '$lib/types';
	import { GestureHandling } from 'leaflet-gesture-handling';
	import "leaflet/dist/leaflet.css"
	import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css"

	let {
		multipleLoads = $bindable(),
		tableData,
		selectedCity = $bindable(),
		selectedState = $bindable(),
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked = $bindable()
	}: {
		multipleLoads: boolean;
		tableData: TableDataTypes[];
		selectedCity: string | null;
		selectedState: string | null;
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
	} = $props();

	const toggle = (multiLoads: boolean, city: string, state: string, id?: number) => {
		if (id) {
			selectedRow = id;
		}
		(multipleLoads = multiLoads), (selectedCity = city), (selectedState = state);
		detailsHidden = false;
		tableClicked = false;
	};
</script>


{#if browser}
	<div class="mt-8 h-full w-full">
		<Map
			options={{
				center: [44.67498, -103.856037],
				zoom: 4.4,
				minZoom: 3.2,
				gestureHandling: true
			}}
		>
			<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
			{#each tableData as row}
				{#if !(row.originLat === 0 && row.originLng === 0)}
					{#if row.areaLoadCount === 1}
						<Marker
							onclick={() => toggle(false, row.originCityName, row.originStateName, row.loadID)}
							latLng={[row.originLat, row.originLng]}
						/>
					{:else}
						<Popup
							onclick={() => toggle(true, row.originCityName, row.originStateName)}
							latLng={[row.originLat, row.originLng]}
							options={{
								closeButton: false,
								autoClose: false,
								closeOnEscapeKey: false,
								closeOnClick: false,
								maxWidth: 5
							}}
						>
							<div class="text-center text-lg font-bold">{row.areaLoadCount}</div>
						</Popup>
					{/if}
				{/if}
			{/each}
		</Map>
	</div>
{/if}

<style>
	.leaflet-popup-content-wrapper {
		box-shadow: none;
	}
</style>
