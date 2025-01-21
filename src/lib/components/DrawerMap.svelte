<script lang="ts">
	import { Map, TileLayer, Tooltip, Marker, Circle, Polygon, Popup, LayerGroup } from 'sveaflet';
 	
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
			return 2.8;
		} else {
			return 4.1;
		}
	};
</script>

<div class="size-80">
	<Map
		options={{
			center: [centerMap(originLat, destLat), centerMap(originLng, destLng)],
			zoom: zoomLevel(originLng, destLng),
			touchZoom: false, scrollWheelZoom: false, boxZoom: false, zoomControl: false
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		<Tooltip
			latLng={[originLat, originLng]}
			options={{
				content: `<strong>Origin:</strong><br> ${originCity}, ${originState}`
			}}
		/>
		<Tooltip
			latLng={[destLat, destLng]}
			options={{
				content: `<strong>Destination:</strong><br> ${destCity}, ${destState}`
			}}
		/>
	</Map>
</div>
