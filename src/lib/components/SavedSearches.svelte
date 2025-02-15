<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import type { savedSearchesTypes } from '$lib/types';
	import SavedSearchesRow from './SavedSearchesRow.svelte';
	let savedSearches: [savedSearchesTypes] | [] = $state([]);

	let {
		//	originLatFilter = $bindable(),
		//	originLngFilter = $bindable(),
		//	destLatFilter = $bindable(),
		//	destLngFilter = $bindable(),
		originMilesFilter = $bindable(),
		originStateFilter = $bindable(),
		originCityFilter = $bindable(),
		destMilesFilter = $bindable(),
		destCityFilter = $bindable(),
		destStateFilter = $bindable(),
		trailerTypesFilter = $bindable(),
		fromDateRange = $bindable(),
		toDateRange = $bindable(),
		manageSavedSearchIsShowing = $bindable(),
		userId
	}: {
		//	originLatFilter: number | undefined;
		//	originLngFilter: number | undefined;
		//	destLatFilter: number | undefined;
		//	destLngFilter: number | undefined;
		originMilesFilter: number | undefined;
		originStateFilter: string | undefined;
		originCityFilter: string | undefined;
		destMilesFilter: number | undefined;
		destCityFilter: string | undefined;
		destStateFilter: string | undefined;
		trailerTypesFilter: string | undefined;
		fromDateRange: Date | null | undefined;
		toDateRange: Date | null | undefined;
		manageSavedSearchIsShowing: boolean;
		userId: string | null;
	} = $props();

	let active = 'bg-blue-600';
	let inactive = 'bg-gray-500';

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

	function setFilters(
		originMiles: number,
		originState: string,
		originCity: string,
		destMiles: number,
		destState: string,
		destCity: string,
		trailerTypes: string,
		fromDate: Date,
		toDate: Date
	) {
		originMilesFilter = originMiles;
		originStateFilter = originState;
		originCityFilter = originCity;
		destMilesFilter = destMiles;
		destStateFilter = destState;
		destCityFilter = destCity;
		trailerTypesFilter = trailerTypes;
		fromDateRange = fromDate;
		toDateRange = toDate;
	}
</script>

<div class="m-5 w-full rounded bg-slate-200 p-5 dark:bg-gray-900">
	<h2 class="text-2xl font-extrabold">Saved Searches</h2>
	{#if savedSearches.length}
		<div class="flex flex-col justify-between h-full pb-4">
			<div>
				{#each savedSearches as savedSearch, index}
					{#if index <= 4}
						<div class="flex flex-row items-center justify-between">
							<p>{savedSearch.name}</p>
							<p></p>
							<div class="flex flex-row justify-around">
								<button
									class="{savedSearch.textNotification
										? active
										: inactive} mx-1 my-3 rounded px-4 py-2 text-white">Text</button
								>
								<button
									class="{savedSearch.emailNotification
										? active
										: inactive} mx-1 my-3 rounded px-4 py-2 text-white">Email</button
								>
								<button
									onclick={() =>
										setFilters(
											savedSearch.originMiles,
											savedSearch.originState,
											savedSearch.originCity,
											savedSearch.destMiles,
											savedSearch.destState,
											savedSearch.destCity,
											savedSearch.trailerType,
											savedSearch.pickupDateStart,
											savedSearch.pickupDateEnd
										)}
									class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button
								>
								<button class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">Delete</button>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<div class="flex gap-3 flex-col md:flex-row ">
				<button
					class="mx-50 my-3 w-full rounded bg-slate-800 px-5 py-2 text-white"
					onclick={() => {
						manageSavedSearchIsShowing = manageSavedSearchIsShowing ? false : true;
					}}>Manage Saved Searches</button
				>
				<button class="mx-50 my-3 w-full rounded bg-slate-800 px-5 py-2 text-white"
					>Notification Preferences</button
				>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<div class="m-auto text-center text-4xl">No saved searches available</div>
			<Button outline color="blue" class="m-auto mt-10 w-40" on:click={() => getRecords()}
				>Refresh</Button
			>
		</div>
	{/if}
</div>
