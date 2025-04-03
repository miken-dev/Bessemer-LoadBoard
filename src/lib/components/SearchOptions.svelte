<script lang="ts">
	import NewSearch from './NewSearch.svelte';
	import SavedSearches from './SavedSearches.svelte';
	import type { savedSearchesTypes } from '$lib/types';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import ContactInfoPreferencesModal from './ContactInfoPreferencesModal.svelte';
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
		cleared = $bindable(),
		loggedIn,
		manageSavedSearchIsShowing,
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
		cleared: boolean
		loggedIn: boolean	
		manageSavedSearchIsShowing: boolean;
		userId: string | null;
		filtersActive: boolean;
	} = $props();
	let contactInfoPreferencesModal = $state(false);

	let filtersActive = $derived.by(() => {
		if (originCityFilter || destCityFilter || trailerTypesFilter || fromDateRange || toDateRange) {
			return true;
		} else {
			return false;
		}
	});

	let savedSearches: [savedSearchesTypes] | [] = $state([]);
	let loading = $state(true)

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
		return results.reverse();
	}

	onMount(async () => {
		loading = true
		savedSearches = await getRecords();
		setTimeout(async () => {
				savedSearches = await getRecords()
		}, 1500)
		loading = false
	});
</script>

<div>
<div class="flex max-w-full flex-col lg:flex-row">
	{#if loggedIn}
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
			bind:savedSearches
			bind:contactInfoPreferencesModal
			bind:cleared
			saveEnabled = {true}
			{userId}
		/>
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
			bind:contactInfoPreferencesModal
			bind:loading
			{userId}
		/>
{:else}
	<div class="md:w-1/2">	
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
		bind:savedSearches
		bind:contactInfoPreferencesModal
		saveEnabled = {false}
		{userId}
	/>
	</div>
{/if}
</div>
</div>
