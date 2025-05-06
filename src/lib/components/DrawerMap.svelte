<script lang="ts">
	import { Map, TileLayer, Popup } from 'sveaflet';
 	
	let {
		originLat,
		originLng,
		originCity,
		originState,
		destLat,
		destLng,
		destCity,
		destState
	}: {
		originLat: number;
		originLng: number;
		originCity: string;
		originState: string;
		destLat: number;
		destLng: number;
		destCity: string;
		destState: string;
	} = $props();

	let centerMap = (x: number, y: number): number => {
		return (x + y) / 2;
	};

	let zoomLevel = (originLng: number, destLng: number): number => {
		if (originLng - destLng > 25 || destLng - originLng > 25) {
			return 2.4;
		} else {
			return 3.1;
		}
	};
</script>

<div class="size-56 sm:size-80">
	<Map
		options={{
			center: [centerMap(originLat, destLat), centerMap(originLng, destLng)],
			zoom: zoomLevel(originLng, destLng),
			touchZoom: false, scrollWheelZoom: false, boxZoom: false, zoomControl: false, closePopupOnClick: false, dragging: false
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		{#if !(originLat === 0 && originLng === 0)}
		<Popup
			latLng={[originLat, originLng]}
			options={{
				content: `<strong>Origin:</strong><br> ${originCity}, ${originState}`,
				closeButton: false,
				autoClose: false,
				closeOnEscapeKey: false,
				closeOnClick: false,
			}}
		/>
		 {/if}
		{#if !(destLat === 0 && destLng === 0)}
		<Popup
			latLng={[destLat, destLng]}
			options={{
				content: `<strong>Destination:</strong><br> ${destCity}, ${destState}`,
				closeButton: false,
				autoClose: false,
				closeOnEscapeKey: false,
				closeOnClick: false,
			}}
		/>
{/if}
	</Map>
</div>
