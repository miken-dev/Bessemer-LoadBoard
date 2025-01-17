<script lang="ts">
	import DevBanner from '$lib/components/DevBanner.svelte';
	import DataTable from '$lib/components/LoadTablev2.svelte';
	import tableData from '$lib/sampledata.json';
	import Drawer from '$lib/components/Drawer.svelte';

	import ViewsBar from '$lib/components/ViewsBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';
	// Store selected row id
	let selectedRow: string | null = $state(null);
	let detailsHidden = $state(true);
	/** Toggle row details */
	const toggleDetails = (id: string) => {
		selectedRow = selectedRow === id ? null : id;
	};

	let tableIsShowing: boolean = $state(false);
	let mapIsShowing: boolean = $state(true);
</script>

<header class="dark:bg-gray-800 dark:text-gray-100">
	<DevBanner />
	<Header />
</header>
<main class="gray-800 mx-5  dark:bg-gray-800 dark:text-gray-100">
	<p>
		details hidden = {detailsHidden}, selected loadID = {selectedRow ? selectedRow : 'null'}
		<ViewsBar bind:tableIsShowing bind:mapIsShowing />
	</p>
	<div class="flex flex-col items-start md:flex-row">
		{#if tableIsShowing}
			<div class="min-h-screen w-full bg-gray-50 p-4 text-gray-900 md:p-8">
				<div class="mx-auto max-w-[95rem]">
					<DataTable {tableData} {selectedRow} {toggleDetails} />
				</div>
			</div>
		{/if}

		{#if mapIsShowing}
			<div class="sticky top-0">
				<Map {tableData} bind:selectedRow bind:detailsHidden />
			</div>
		{/if}
	</div>
	<Drawer {tableData} bind:selectedRow bind:detailsHidden />
</main>
