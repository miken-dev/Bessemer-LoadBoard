<script lang="ts">
	import DrawerMap from './DrawerMap.svelte';
	import { browser } from '$app/environment';
	import type { TableDataTypes } from '$lib/types';
	import InfoDisplay from './InfoDisplay.svelte';
	let {
		data,
		horizontal
	}: {
		data: any;
		horizontal: boolean;
	} = $props();
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

<!-- load info -->
<div class=" ml-3 flex {horizontal ? 'w-screen flex-row gap-x-60 pb-10 ' : 'flex-col'}">
	<!---
{#each columns as column}
<div class="flex flex-row mt-5">
<h3>{column.title}</h3>
<p>{data[column.property]}</p>
</div>
{/each} -->
	{#if browser}
		<div class="pl-0 md:pl-10 top-0 size-80">
			<DrawerMap
				originLat={Number(data.originLat)}
				originLng={Number(data.originLng)}
				destLat={Number(data.destinationLat)}
				destLng={Number(data.destinationLng)}
				originCity={data.originCityName}
				originState={data.originStateName}
				destCity={data.destinationCityName}
				destState={data.destinationStateName}
			/>
		</div>
	{/if}
	<div class="md:max-w-48">
		<div class="my-1 mt-4 flex flex-col">
			<h3 class="font-extrabold">Load Date:</h3>
			<p>
				{`${day[new Date(data.loadDate).getDay()]}, ${month[new Date(data.loadDate).getMonth()]} ${new Date(data.loadDate).getDate()}${dateOrdinals(new Date(data.loadDate).getDate())} ${new Date(data.loadDate).getFullYear()}`}
			</p>
		</div>

		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Origin:</h3>
			<p>{` ${data.originCityName}, ${data.originStateName}`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Origin Terminal:</h3>
			<p>{`${data.terminalName}`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Delivery Date:</h3>
			<p>
				{`${day[new Date(data.deliveryDate).getDay()]}, ${month[new Date(data.deliveryDate).getMonth()]} ${new Date(data.deliveryDate).getDate()}${dateOrdinals(new Date(data.deliveryDate).getDate())} ${new Date(data.deliveryDate).getFullYear()}`}
			</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Delivery Destination:</h3>
			<p>{`${data.destinationCityName}, ${data.destinationStateName}`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Dimensions:</h3>
			<p>
				{#if data.lengthFeet === 0 && data.lengthInches === 0 && data.widthFeet === 0 && data.widthInches === 0 && data.heightFeet === 0 && data.heightInches === 0}
					Not available
				{:else}
					{`${data.lengthFeet}'${data.lengthInches}" x ${data.widthFeet}'${data.widthInches}" x ${data.heightFeet}'${data.heightInches}"`}
				{/if}
			</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Weight:</h3>
			<p>{`${data.weightInPounds}lbs.`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Trailer Types:</h3>
			<p>{`${data.trailerTypes}`}</p>
		</div>
	</div>
	<div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Commodity:</h3>
			<p>{data.commodity}</p>
		</div>

		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Number of Pieces:</h3>
			<p>{data.pieceCount}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Terminal:</h3>
			<p>{data.terminalName}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Phone Number:</h3>
			<p>{data.terminalPhone}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Revenue:</h3>
			<p>{`$${data.revenue}`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Miles:</h3>
			<p>
				{#if data.miles == 0 || data.miles === -1}
					Not Available
				{:else}
					{data.miles}
				{/if}
			</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">LTL:</h3>
			<p>{data.ltl}</p>
		</div>
		<div class="my-1 mt-3 flex max-w-80 flex-col">
			<h3 class="font-extrabold">Notes:</h3>
			<p>{data.notes}</p>
		</div>
	</div>
</div>

<style>
	* {
	}
</style>
