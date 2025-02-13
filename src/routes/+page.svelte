<script lang="ts">
	// Data import
	//	import tableData from '$lib/sampledata.json';
	import type { PageData, TableDataTypes } from '$lib/types';
	// framework/library imports
	import { dev } from '$app/environment';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import PocketBase from 'pocketbase';
	import { writable, type Writable } from 'svelte/store';

	// Component imports
	import DataTable from '$lib/components/LoadTablev2.svelte';
	import Drawerv2 from '$lib/components/Drawerv2.svelte';
	import NewSearch from '$lib/components/NewSearch.svelte';
	import ViewsBar from '$lib/components/ViewsBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';
	import ManageSavedSearchModal from '$lib/components/manageSavedSearchModal.svelte';
	import SavedSearches from '$lib/components/SavedSearches.svelte';
	import SaveSearchDialog from '$lib/components/saveSearchDialog.svelte';

	// Application State
	let selectedRow: number | null = $state(null);
	let selectedCity: string | null = $state(null);
	let detailsHidden = $state(true);
	let tableClicked = $state(false);
	let saved = $state(false);
	let loggedIn = $state(true);

	let saveSearchDialogIsShowing: boolean = $state(false);
	let manageSavedSearchIsShowing: boolean = $state(false);
	let searchOptionsIsShowing: boolean = $state(true);
	let tableIsShowing: boolean = $state(true);
	let mapIsShowing: boolean = $state(true);

	// filters
	let filterOriginMiles: number = $state(0);
	let filterOriginState: string = $state('');
	let filterOriginCity: string = $state('');

	let filterDestMiles: number = $state(0);
	let filterDestState: string = $state('');
	let filterDestCity: string = $state('');

	let pickupStart: string = $state('');
	let pickupEnd: string = $state('');

	let trailerType: string = $state('');

	function makeFilters() {
		let filters = '';
		if (!loggedIn) {
			filters += 'isPublic = true';
		}
	}

	// PocketBase
	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');

	let tableData: [TableDataTypes] | [] = $state([]);

	async function getRecords() {
		
		const records = await PB.collection('Active_Loads').getFullList({
		});

		const results: [TableDataTypes] = records.map((record) => {
			return {
				loadID: record.loadID,
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

	// Cookie set up
	function getUserId(): string | null {
		const cookie = document.cookie.split('; ').find((row) => row.startsWith('dds_user_id='));
		return cookie ? cookie.split('=')[1] : null;
	}

	let userId = $state<string | null>(null);

	onMount(() => {
		const initialId = getUserId();
		if (initialId !== null) {
			userId = initialId; // Direct assignment, no .value needed
			loggedIn = true;
		}

		const checkCookie = setInterval(() => {
			const currentId = getUserId();
			if (currentId !== null) {
				userId = currentId; // Direct assignment
				loggedIn = true;
			} else {
				loggedIn = false;
			}
		}, 1000);

		return () => clearInterval(checkCookie);
	});

	function useUserId(id: string | null): string {
		return id ?? 'Not logged in';
	}

	//Helper functions
	let mapWidth = (): string => {
		if (tableIsShowing) {
			return 'w-1/3';
		} else {
			return 'w-screen';
		}
	};
	const toggleDetails = (id: string) => {
		selectedRow = selectedRow === id ? null : id;
	};
	let tableWidth = (): string => {
		if (tableIsShowing) {
			return 'w-1/2';
		} else {
			return 'w-max m-auto';
		}
	};
</script>

<header class="dark:bg-gray-800 dark:text-gray-100">
	{#if dev}
		<div class="flex items-center justify-center bg-red-600">
			<p>
				<strong>DEVELOPER MODE</strong> detailsHidden={detailsHidden}, selectedLoadID={selectedRow
					? selectedRow
					: 'null'}, tableClicked={tableClicked}, city={selectedCity}, userID={userId}
			</p>
		</div>
	{/if}
	<Header {loggedIn} />
</header>
<main class="gray-800 w-full px-5 dark:bg-gray-800 dark:text-gray-100 md:px-20">
	{#if loggedIn}
		<div
			transition:slide={{ y: 200, duration: 500 }}
			onclick={() => {
				searchOptionsIsShowing = !searchOptionsIsShowing;
			}}
			class="flex"
		>
			<h3 class="ml-5 mt-5">Search Options</h3>
			<ChevronDownOutline class="ms-2 mt-5 h-6 w-6 text-gray-800 dark:text-white" />
		</div>
		{#if searchOptionsIsShowing}
			<div class="flex flex-col md:flex-row">
				<NewSearch bind:saveSearchDialogIsShowing />
				<SavedSearches bind:manageSavedSearchIsShowing />
			</div>
		{/if}
	{/if}

	<ViewsBar bind:tableIsShowing bind:mapIsShowing />

	<!-- Table and Map -->
	<div class="flex flex-col items-start justify-center md:flex-row">
		{#if tableIsShowing}
			<div class="min-h-screen {tableWidth} p-4 dark:bg-gray-800 dark:text-gray-100 md:p-8">
				<div class="mx-auto max-w-[95rem]">
					<DataTable {tableData} bind:selectedRow bind:detailsHidden bind:tableClicked {loggedIn} />
				</div>
			</div>
		{/if}

		{#if mapIsShowing}
			<div class="sticky top-0 w-11/12 md:{mapWidth} h-lvh md:h-[35rem] lg:h-[50rem]">
				<Map {tableData} bind:selectedCity bind:selectedRow bind:detailsHidden bind:tableClicked />
			</div>
		{/if}
	</div>
	<Drawerv2 {tableData} {selectedCity} bind:selectedRow bind:detailsHidden {tableClicked} />
	<ManageSavedSearchModal bind:manageSavedSearchIsShowing />
	<SaveSearchDialog bind:saveSearchDialogIsShowing bind:saved />
</main>
