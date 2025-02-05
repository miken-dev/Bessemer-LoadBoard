<script lang="ts">
	import DevBanner from '$lib/components/DevBanner.svelte';
	import DataTable from '$lib/components/LoadTablev2.svelte';
	import tableData from '$lib/sampledata.json';
	import Drawerv2 from '$lib/components/Drawerv2.svelte';
	import { dev } from '$app/environment';
	import NewSearch from '$lib/components/NewSearch.svelte';
	import ViewsBar from '$lib/components/ViewsBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';
	import ManageSavedSearchModal from '$lib/components/manageSavedSearchModal.svelte';
	import SavedSearches from '$lib/components/SavedSearches.svelte';
	import SaveSearchDialog from '$lib/components/saveSearchDialog.svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';

	// Application State
	let selectedRow: number | null = $state(null);
	let selectedCity: string | null = $state(null);
	let detailsHidden = $state(true);
	let tableClicked = $state(false);
	let saved = $state(false);

	let saveSearchDialogIsShowing: boolean = $state(false);
	let manageSavedSearchIsShowing: boolean = $state(false);
	let searchOptionsIsShowing: boolean = $state(true);
	let tableIsShowing: boolean = $state(true);
	let mapIsShowing: boolean = $state(true);

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
					: 'null'}, tableClicked={tableClicked}, city={selectedCity}
			</p>
		</div>
	{/if}
	<Header />
</header>
<main class="gray-800 w-full px-5 dark:bg-gray-800 dark:text-gray-100 md:px-20">
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
			<NewSearch />
			<SavedSearches bind:manageSavedSearchIsShowing />
		</div>
	{/if}
	<ViewsBar bind:tableIsShowing bind:mapIsShowing />
	<!-- Table and Map -->
	<div class="flex flex-col items-start justify-center md:flex-row">
		{#if tableIsShowing}
			<div class="min-h-screen {tableWidth} p-4 dark:bg-gray-800 dark:text-gray-100 md:p-8">
				<div class="mx-auto max-w-[95rem]">
					<DataTable {tableData} bind:selectedRow bind:detailsHidden bind:tableClicked />
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
