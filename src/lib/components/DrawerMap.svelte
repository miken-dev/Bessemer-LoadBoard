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
			center: [average(originLat, destLat), average(originLng, destLng)],
			zoom: zoomLevel(originLng, destLng)
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		<LayerGroup>
			<Popup
				latLng={[originLat, originLng]}
				options={{
					content: `Origin<br>: ${originCity}, ${originState}`
				}}
			/>
			<Popup
				latLng={[destLat, destLng]}
				options={{
					content: `Destination:<br> ${destCity}, ${destState}`
				}}
			/>
		</LayerGroup>
	</Map>
</div>
