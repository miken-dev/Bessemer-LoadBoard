<script lang="ts">
	import DevBanner from '$lib/components/DevBanner.svelte'
	//import { slide } from "svelte/transition";
	//import { ChevronDown } from "lucide-svelte";
	import DataTable from '$lib/components/LoadTablev2.svelte';
	import tableData from '$lib/sampledata.json';

	import Map from '$lib/components/Map.svelte';
	import ViewsBar from '$lib/components/ViewsBar.svelte';
	import Header from '$lib/components/Header.svelte'


	// Store selected row id
	let selectedRow: string | null = $state(null);

	/** Toggle row details */
	const toggleDetails = (id: string) => {
		selectedRow = selectedRow === id ? null : id;
	};

	let tableIsShowing: boolean = $state(true);
	let mapIsShowing: boolean = $state(true);
</script>

<DevBanner />
	<Header />
<main class="mx-5">
	<ViewsBar bind:tableIsShowing bind:mapIsShowing />
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
				<Map />
			</div>
		{/if}
	</div>
</main>
