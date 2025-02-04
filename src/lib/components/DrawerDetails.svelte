<script lang="ts">
	import DrawerMap from "./DrawerMap.svelte";
	import type { TableDataTypes } from "$lib/types";
	let {
		data
	}: {
		data: TableDataTypes;
	} = $props()
	let selectedCity = $state('');
	let selectedState = $state('');

	const month = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dateOrdinals = (date: number) => {
		if (date > 3 && date < 21) return 'th';
		switch (date % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};
</script>
<div class="top-0 size-80 ">
	<DrawerMap
		originLat={data.originLat}
		originLng={data.originLng}
		destLat={data.destinationLat}
		destLng={data.destinationLng}
		originCity={data.originCityName}
		originState={data.originStateName}
		destCity={data.destinationCityName}
		destState={data.destinationStateName}
	/>
</div>
<!-- load info -->
<div class="ml-3">
	<!---
{#each columns as column}
<div class="flex flex-row mt-5">
<h3>{column.title}</h3>
<p>{data[column.property]}</p>
</div>
{/each} -->
	<div class="flex flex-col my-1 mt-4 ">
		<h3 class="font-extrabold">Load Date:</h3>
		<p>	{`${day[new Date(data.loadDate).getDay()]} ${month[new Date(data.loadDate).getMonth()]} ${new Date(data.loadDate).getDate()}${dateOrdinals(new Date(data.loadDate).getDate())} ${new Date(data.loadDate).getFullYear()}`}</p>
	</div>

	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Origin:</h3>
		<p>{` ${data.originCityName}, ${data.originStateName}`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Origin Terminal:</h3>
		<p>{`${data.terminalName}`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Delivery Date:</h3>
		<p>{`${day[new Date(data.deliveryDate).getDay()]} ${month[new Date(data.deliveryDate).getMonth()]} ${new Date(data.deliveryDate).getDate()}${dateOrdinals(new Date(data.deliveryDate).getDate())} ${new Date(data.deliveryDate).getFullYear()}`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Delivery Destination:</h3>
		<p>{`${data.destinationCityName}, ${data.destinationStateName}`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Dimensions:</h3>
		<p>{`${data.lengthFeet}'${data.lengthInches}" x ${data.widthFeet}'${data.widthInches}" x ${data.heightFeet}'${data.heightInches}"`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Weight:</h3>
		<p>{`${data.weightInPounds}lbs.`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Commodity:</h3>
		<p>{data.commodity}</p>
	</div>

	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Number of Pieces:</h3>
		<p>{data.pieceCount}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Agent:</h3>
		<p>AGENT NAME</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Phone Number:</h3>
		<p>{data.terminalPhone}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Revenue:</h3>
		<p>{`$${data.revenue}`}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">Miles:</h3>
		<p>{data.miles}</p>
	</div>
	<div class="flex flex-col my-1 mt-3">
		<h3 class="font-extrabold">LTL:</h3>
		<p>{data.ltl}</p>
	</div>
	<div class="flex flex-col my-1 mt-3 max-w-80">
		<h3 class="font-extrabold">Notes:</h3>
		<p>{data.notes}</p>
	</div>
</div>
