<script lang="ts">
	import NewSearch from "./NewSearch.svelte";
	import SavedSearches from "./SavedSearches.svelte";
	import type { savedSearchesTypes } from '$lib/types'
	import PocketBase from 'pocketbase'
	import { onMount } from "svelte";

	let {
		originMilesFilter = $bindable(),
		originStateFilter = $bindable(),
		originCityFilter = $bindable(),
		destMilesFilter = $bindable(),
		destCityFilter = $bindable(),
		destStateFilter = $bindable(),
		trailerTypesFilter = $bindable(),
		fromDateRange = $bindable(),
		toDateRange = $bindable(),
		saveSearchDialogIsShowing = $bindable(),
		manageSavedSearchIsShowing = $bindable(),
		userId
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
		saveSearchDialogIsShowing: boolean;
		manageSavedSearchIsShowing: boolean;
		userId: string | null;
	} = $props();


	let savedSearches: [savedSearchesTypes] | [] = $state([]);

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getRecords() {
		const records = await PB.collection('Saved_Searches').getFullList({
			filter: `userID = "${userId}"`
		});
		const results: [savedSearchesTypes] = records.map((record) => {
			return {
				id: record.id,
				name: record.name,
				originMiles: record.originMiles,
				originState: record.originState,
				originCity: record.originCity,
				destMiles: record.destMiles,
				destState: record.destState,
				destCity: record.destCity,
				pickupDateStart: record.pickupDateStart,
				pickupDateEnd: record.pickupDateEnd,
				trailerType: record.trailerType,
				emailNotification: record.emailNotification,
				textNotification: record.textNotification
			};
		});
		return results;
	}

	onMount(async () => {
		savedSearches = await getRecords();
	});
</script>

<div>

	<div class="flex flex-col md:flex-row">
		<NewSearch
			bind:originMilesFilter
			bind:originStateFilter
			bind:originCityFilter
			bind:destMilesFilter
			bind:destCityFilter
			bind:destStateFilter
			bind:trailerTypesFilter
			bind:fromDateRange
			bind:toDateRange
			bind:saveSearchDialogIsShowing
			{userId}
		/>
		{#key manageSavedSearchIsShowing}
			<SavedSearches
				bind:originMilesFilter
				bind:originStateFilter
				bind:originCityFilter
				bind:destMilesFilter
				bind:destCityFilter
				bind:destStateFilter
				bind:trailerTypesFilter
				bind:fromDateRange
				bind:toDateRange
				bind:manageSavedSearchIsShowing
				bind:savedSearches
				{userId}
			/>
		{/key}
	</div>

	</div>
