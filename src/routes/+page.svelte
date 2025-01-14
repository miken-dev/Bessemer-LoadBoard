<script lang="ts">
	import DevBanner from './DevBanner.svelte';
	import LoadTable from './LoadTable.svelte';
 
	//import { slide } from "svelte/transition";
	//import { ChevronDown } from "lucide-svelte";
	import DataTable from "./LoadTablev2.svelte";
	import tableData from "$lib/sampledata.json";

	// Store selected row id
	let selectedRow: string | null = $state(null);

	/** Toggle row details */
	const toggleDetails = (id: string) => {
		selectedRow = selectedRow === id ? null : id;
	};
</script>

<div class="w-full min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
	<div class="max-w-[95rem] mx-auto">
		<h1 class="text-2xl font-bold mb-6">Data Overview</h1>
		<DataTable {tableData} {selectedRow} {toggleDetails} />
	</div>
</div>

<DevBanner />

<LoadTable />
