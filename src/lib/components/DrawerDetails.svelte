<script lang="ts">
	import DrawerMap from './DrawerMap.svelte';
	import { browser } from '$app/environment';
	import type { TableDataTypes } from '$lib/types';
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

	function numberWithCommas(number: number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

export function insertBreaks(text, chunkSize = 23) {
  if (!text) return '';
  
  let result = '';
  let lastBreakIndex = 0;
  let lastSpaceIndex = -1;
  
  for (let i = 0; i < text.length; i++) {
    // Track position of spaces
    if (text[i] === ' ') {
      lastSpaceIndex = i;
    }
    
    result += text[i];
    
    // When we've gone chunkSize characters since last break
    if (i - lastBreakIndex >= chunkSize - 1 && i < text.length - 1) {
      // If we found a space recently, break there
      if (lastSpaceIndex > lastBreakIndex) {
        // Go back and insert the break at the last space
        const charactersToBacktrack = i - lastSpaceIndex;
        result = result.slice(0, result.length - charactersToBacktrack) + '<br>' + result.slice(result.length - charactersToBacktrack);
        lastBreakIndex = lastSpaceIndex + 1; // +1 because the space is before the break
        lastSpaceIndex = -1;
      } 
      // If no space found within this chunk, just continue until we find one
    }
  }
  
  // Return the HTML as a trusted string in Svelte
  return new String(result);
}
</script>

<!-- load info -->
<div class=" ml-3 flex {horizontal ? 'w-full flex-row gap-x-60 pb-10 ' : 'flex-col'}">
	{#if browser}
		<div class="top-0 size-60 w-80 overflow-hidden pl-0 sm:size-80 md:pl-10">
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
				{`${day[new Date(data.loadDate).getUTCDay()]}, ${month[new Date(data.loadDate).getUTCMonth()]} ${new Date(data.loadDate).getUTCDate()}${dateOrdinals(new Date(data.loadDate).getUTCDate())} ${new Date(data.loadDate).getUTCFullYear()}`}
			</p>
		</div>

		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Origin:</h3>
			<p>{` ${data.originCityName}, ${data.originStateName}`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Delivery Date:</h3>
			<p>
				{`${day[new Date(data.deliveryDate).getUTCDay()]}, ${month[new Date(data.deliveryDate).getUTCMonth()]} ${new Date(data.deliveryDate).getUTCDate()}${dateOrdinals(new Date(data.deliveryDate).getUTCDate())} ${new Date(data.deliveryDate).getUTCFullYear()}`}
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
			<p>{`${numberWithCommas(data.weightInPounds)} lbs.`}</p>
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
			<h3 class="font-extrabold">Terminal Posting Load:</h3>
			<p>{data.terminalName}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Phone Number:</h3>
			<a class="text-blue-500 underline" href="tel:+1{data.terminalPhone}">{data.terminalPhone}</a>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Revenue:</h3>
			<p>{`$${numberWithCommas(data.revenue)}`}</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">Miles:</h3>
			<p>
				{#if data.miles == 0 || data.miles === -1}
					Not Available
				{:else}
					{numberWithCommas(data.miles)}
				{/if}
			</p>
		</div>
		<div class="my-1 mt-3 flex flex-col">
			<h3 class="font-extrabold">LTL:</h3>
			<p>{data.ltl ? 'Yes' : 'No'}</p>
		</div>
		<div class="my-1 mb-10 mt-3 flex max-w-80 flex-col">
			<h3 class="font-extrabold">Notes:</h3>
			<p>{@html insertBreaks(data.notes, 22)}</p>
		</div>
	</div>
</div>
