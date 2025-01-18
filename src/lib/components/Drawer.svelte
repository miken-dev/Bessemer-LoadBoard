<script lang="ts">
	import { Drawer, Button, CloseButton } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import type { TableDataTypes } from '$lib/types';
	import SearchOptions from './SearchOptions.svelte';
	import { writable } from 'svelte/store';
	import DrawerMap from './DrawerMap.svelte';
	let {
		tableData,
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked
	}: {
		tableData: TableDataTypes[];
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
	} = $props();
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

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
	let selectedCity = $state('');
	let selectedState = $state('');
	let multiples = $state(false);
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={detailsHidden} id="loadDetailDrawer">
	<div class="flex flex-col items-center">
		<!-- Inline map -->
		{#if multiples && !tableClicked}
			<h2>Multiple available in {selectedCity} {selectedState}</h2>
		{/if}
		{#each tableData as data}
			{#if data.loadID == selectedRow}
				{(selectedCity = data.originCityName)}
				{(selectedState = data.originStateName)}
				<div class="top-0 size-80">
					<DrawerMap
						originLat={data.originLat}
						originLng={data.originLng}
						destLat={data.destinationLat}
						destLng={data.destinationLng}
					/>
				</div>
				<!-- load info -->
				<div>
					<h2>Origin Information</h2>
					<div>
						<h3>Load Date</h3>
						<p>{data.loadID}</p>
					</div>

					<div>
						<h3>Origin</h3>
						<p></p>
					</div>
					<div>
						<h3>Origin Terminal</h3>
						<p></p>
					</div>
					<h2>Destination Info</h2>

					<div>
						<h3>Delivery Date</h3>
						<p>Delivery Destination</p>
					</div>
					<h2>Commodity Info</h2>

					<div>
						<h3>Dimensions</h3>
						<p>Commodity</p>
					</div>
					<div>
						<h3>Pieces</h3>
						<p></p>
					</div>
					<h2>Other Info</h2>
					<div>
						<h3>Agent</h3>
						<p></p>
					</div>
					<div>
						<h3>Phone Number</h3>
						<p></p>
					</div>
					<div>
						<h3>Miles</h3>
						<p></p>
					</div>
					<div>
						<h3>Revenue</h3>
					</div>
					<div>
						<h3>LTL</h3>
						<p></p>
					</div>
					<div>
						<h3>Notes</h3>
						<p></p>
					</div>
				</div>
			{/if}
		{/each}
		{#if !tableClicked}
			{#each tableData as data}
				{#if data.originCityName === selectedCity && data.originStateName === selectedState && data.loadID !== selectedRow}
					{(multiples = true)}
					<div class="top-0 size-80">
						<DrawerMap
							originLat={data.originLat}
							originLng={data.originLng}
							originCity={data.originCityName}
							originState={data.originStateName}
							destLat={data.destinationLat}
							destLng={data.destinationLng}
							destCity={data.destinationCityName}
							destState={data.destinationStateName}
						/>
					</div>
					<!-- load info -->
					<div>
						<h2>Origin Information</h2>
						<div>
							<h3>Load Date</h3>
							<p>{data.loadID}</p>
						</div>

						<div>
							<h3>Origin</h3>
							<p></p>
						</div>
						<div>
							<h3>Origin Terminal</h3>
							<p></p>
						</div>
						<h2>Destination Info</h2>

						<div>
							<h3>Delivery Date</h3>
							<p>Delivery Destination</p>
						</div>
						<h2>Commodity Info</h2>

						<div>
							<h3>Dimensions</h3>
							<p>Commodity</p>
						</div>
						<div>
							<h3>Pieces</h3>
							<p></p>
						</div>
						<h2>Other Info</h2>
						<div>
							<h3>Agent</h3>
							<p></p>
						</div>
						<div>
							<h3>Phone Number</h3>
							<p></p>
						</div>
						<div>
							<h3>Miles</h3>
							<p></p>
						</div>
						<div>
							<h3>Revenue</h3>
							<p></p>
						</div>
						<div>
							<h3>LTL</h3>
							<p></p>
						</div>
						<div>
							<h3>Notes</h3>
							<p></p>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</Drawer>
