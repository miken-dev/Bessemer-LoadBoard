<script lang="ts">
	import DevBanner from '$lib/components/DevBanner.svelte';
	import DataTable from '$lib/components/LoadTablev2.svelte';
	import tableData from '$lib/sampledata.json';
	import Drawer from '$lib/components/Drawer.svelte';

	import NewSearch from '$lib/components/NewSearch.svelte';
	import ViewsBar from '$lib/components/ViewsBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';
	// Store selected row id
	let selectedRow: string | null = $state(null);
	let detailsHidden = $state(true);
	let tableClicked = $state(false);
	/** Toggle row details */
	const toggleDetails = (id: string) => {
		selectedRow = selectedRow === id ? null : id;
	};

	let tableIsShowing: boolean = $state(false);
	let mapIsShowing: boolean = $state(true);
	let mapWidth = (): string => {
		if (tableIsShowing) {
			return 'w-1/3';
		} else {
			return 'w-screen';
		}
	};
	let tableWidth = (): string => {
		if (tableIsShowing) {
			return 'w-1/3';
		} else {
			return 'w-screen';
		}
	};
</script>

<header class="dark:bg-gray-800 dark:text-gray-100">
	<DevBanner />
	<Header />
</header>
<main class="gray-800 mx-5 dark:bg-gray-800 dark:text-gray-100">
	<!--
	<p>
		details hidden = {detailsHidden}, selected loadID = {selectedRow ? selectedRow : 'null'},
		tableClicked = {tableClicked}
	</p> -->
	<div class="flex">
		<NewSearch />
	</div>
	<ViewsBar bind:tableIsShowing bind:mapIsShowing />
	<div class="flex flex-row items-start md:flex-row">
		{#if tableIsShowing}
			<div class="min-h-screen w-1/2 bg-gray-50 p-4 text-gray-900 md:p-8">
				<div class="mx-auto max-w-[95rem]">
					<DataTable {tableData} bind:selectedRow bind:detailsHidden bind:tableClicked />
				</div>
			</div>
		{/if}

		{#if mapIsShowing}
			<div class="sticky top-0 sm:w-screen md:{mapWidth}">
				<Map {tableData} bind:selectedRow bind:detailsHidden bind:tableClicked />
			</div>
		{/if}
	</div>
	<Drawer {tableData} bind:selectedRow bind:detailsHidden {tableClicked} />
</main>
