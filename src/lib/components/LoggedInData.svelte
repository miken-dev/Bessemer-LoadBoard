<script lang="ts">
	import ViewsBar from './ViewsBar.svelte';
	import LoadTablev2 from './LoadTablev2.svelte';
	import Drawerv2 from './Drawerv2.svelte';
	import Map from './Map.svelte';
	import PocketBase from 'pocketbase';
	import type { TableDataTypes } from '$lib/types';
	import LoadTableRow from './LoadTableRow.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { filterTableData } from '$lib/filterFunction';
	import locations from '$lib/assets/locations.json';
	import LoadTableSkeleton from './LoadTableSkeleton.svelte';

	let selectedRow = $state(0);
	let multipleLoads = $state(false);
	let selectedCity = $state('');
	let detailsHidden = $state(true);
	let tableClicked = $state(false);
	let tableIsShowing = $state(true);
	let mapIsShowing = $state(true);
	let tableData: TableDataTypes[] = $state([]);

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getRecords() {
		let records = await PB.collection('Active_Loads').getFullList({});
		const results: [TableDataTypes] = records.map((record) => {
			return {
				loadID: record.id,
				loadDate: record.loadDate,
				deliveryDate: record.deliveryDate,
				originAddress: record.originAddress,
				originZipCode: record.originZipCode,
				destinationAddress: record.destinationAddress,
				destinationZipCode: record.destinationZipCode,
				commodity: record.commodity,
				lengthFeet: record.lengthFeet,
				lengthInches: record.lengthInches,
				widthFeet: record.widthFeet,
				widthInches: record.widthInches,
				heightFeet: record.heightFeet,
				heightInches: record.heightInches,
				weightInPounds: record.weightInPounds,
				pieceCount: record.pieceCount,
				revenue: record.revenue,
				notes: record.notes,
				terminalID: record.terminalID,
				terminalPhone: record.terminalPhone,
				ltl: record.ltl,
				isPublic: record.isPublic,
				trailerTypes: record.trailerTypes,
				miles: record.miles,
				terminalName: record.terminalName,
				originStateName: record.originStateName,
				originCityName: record.originCityName,
				originLat: record.originLat,
				originLng: record.originLng,
				destinationStateName: record.destinationStateName,
				destinationCityName: record.destinationCityName,
				destinationLat: record.destinationLat,
				destinationLng: record.destinationLng,
				areaLoadCount: record.areaLoadCount
			};
		});
		return results;
	}
	PB.collection('Active_Loads').subscribe('*', async (e) => {
		tableData = await getRecords();
	});

	onMount(async () => {
		tableData = await getRecords();
	});

	onDestroy(() => {
		PB.collection('Active_Loads').unsubscribe('*');
	});

	//helper functions
	let tableWidth = (): string => {
		if (tableIsShowing) {
			return 'w-1/2';
		} else {
			return 'w-max m-auto';
		}
	};
	let mapWidth = (): string => {
		if (tableIsShowing) {
			return 'w-1/3';
		} else {
			return 'w-screen';
		}
	};

	//Filters

	let {
		originMilesFilter,
		originStateFilter,
		originCityFilter,
		destMilesFilter,
		destCityFilter,
		destStateFilter,
		trailerTypesFilter,
		fromDateRange,
		toDateRange,
		filtersActive
	}: {
		originMilesFilter: number | undefined;
		originStateFilter: string | undefined;
		originCityFilter: string | undefined;
		destMilesFilter: number | undefined;
		destCityFilter: string | undefined;
		destStateFilter: string | undefined;
		trailerTypesFilter: string | undefined;
		fromDateRange: Date | undefined;
		toDateRange: Date | undefined;
		filtersActive: boolean;
	} = $props();

	let filterValues = $state({
		originMilesFilter,
		originStateFilter,
		originCityFilter,
		destMilesFilter,
		destCityFilter,
		destStateFilter,
		trailerTypesFilter,
		fromDateRange,
		toDateRange
	});
	$effect(() => {
		filterValues = {
			originMilesFilter,
			originStateFilter,
			originCityFilter,
			destMilesFilter,
			destCityFilter,
			destStateFilter,
			trailerTypesFilter,
			fromDateRange,
			toDateRange
		};
	});
	let filteredData = $derived.by((): TableDataTypes[] => {
		console.log('Filters changed:', $state.snapshot(filterValues));
		return filterTableData(tableData, filterValues, locations);
	});
</script>

<div>
	<ViewsBar bind:tableIsShowing bind:mapIsShowing />

	<div class="flex flex-col items-start justify-center md:flex-row">
		{#if tableIsShowing}
			<div class="min-h-screen {tableWidth} p-4 dark:bg-gray-800 dark:text-gray-100 md:p-8">
				<div class="mx-auto max-w-[95rem]">
					{#if filteredData.length !== 0 && tableData.length !== 0}
						<LoadTablev2
							tableData={filteredData}
							bind:selectedRow
							bind:detailsHidden
							bind:tableClicked
						/>
					{:else if filteredData.length === 0 && tableData.length === 0}
						<LoadTableSkeleton />
					{:else}
						<div class="w-96 text-4xl flex flex-col justify-around">
						<h3 class="text-center">No results available</h3>
				</div>
					{/if}
				</div>
			</div>
			<!-- skeleton -->
		{/if}

		{#if mapIsShowing}
			<div class="sticky top-0 w-11/12 md:{mapWidth} h-lvh md:h-[35rem] lg:h-[50rem]">
				<Map
					bind:multipleLoads
					tableData={filteredData}
					bind:selectedCity
					bind:selectedRow
					bind:detailsHidden
					bind:tableClicked
				/>
			</div>
		{/if}
	</div>
</div>
<Drawerv2
	{tableData}
	{selectedCity}
	bind:selectedRow
	bind:detailsHidden
	{tableClicked}
	{multipleLoads}
/>
