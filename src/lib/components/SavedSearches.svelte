<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import type { savedSearchesTypes } from '$lib/types';
	import DeleteConfirmationModal from './DeleteConfirmationModal.svelte';
	import ContactInfoPreferencesModal from './ContactInfoPreferencesModal.svelte';
	import ManageSavedSearchModal from './manageSavedSearchModal.svelte';
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
		manageSavedSearchIsShowing = $bindable(),
		savedSearches = $bindable(),
		contactInfoPreferencesModal = $bindable(),
		userId
	}: {
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
		savedSearches: [savedSearchesTypes] | [];
		contactInfoPreferencesModal: boolean;
		userId: string | null;
	} = $props();

	let active = 'bg-blue-600';
	let inactive = 'bg-gray-500';
	let deleteConfirmationShowing = $state(false);
	let deleteID = $state('');
	let deleteName = $state('');
	let updateOnModalClose = $derived.by(async () => {
		if (manageSavedSearchIsShowing) {
			savedSearches = await getRecords();
		} else {
			savedSearches = await getRecords();
		}
	});

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

	async function toggleEmail(currentValue: boolean, id: string) {
		const record = await PB.collection('Saved_Searches').update(`${id}`, {
			emailNotification: `${currentValue ? 'False' : 'True'}`
		});

		savedSearches = await getRecords();
	}

	async function toggleText(currentValue: boolean, id: string) {
		const record = await PB.collection('Saved_Searches').update(`${id}`, {
			textNotification: `${currentValue ? 'False' : 'True'}`
		});

		savedSearches = await getRecords();
	}
	function deleteRow(id: string, name: string) {
		deleteConfirmationShowing = true;
		deleteID = id;
		deleteName = name;
		console.log(deleteName);
	}
	async function refresh() {
		savedSearches = await getRecords();
	}

	function setFilters(
		originMiles: number,
		originState: string,
		originCity: string,
		destMiles: number,
		destState: string,
		destCity: string,
		trailerTypes: string,
		fromDate?: Date,
		toDate?: Date
	) {
		fromDateRange = undefined
		toDateRange = undefined
		originMilesFilter = undefined
		originStateFilter = undefined
		originCityFilter = undefined
		destMilesFilter = undefined
		destStateFilter = undefined
		destCityFilter = undefined
		trailerTypesFilter = undefined
		originMilesFilter = originMiles;
		originStateFilter = originState;
		originCityFilter = originCity;
		destMilesFilter = destMiles;
		destStateFilter = destState;
		destCityFilter = destCity;
		trailerTypesFilter = trailerTypes;
		if (fromDate) {
			fromDateRange = new Date(fromDate);
		}
		if (toDate) {
			toDateRange = new Date(toDate);
		}
	}
</script>

<div class="mt-5 w-full rounded bg-slate-200 p-5 dark:bg-gray-900 md:m-5">
	<h2 class="text-2xl font-extrabold">Saved Searches</h2>
	{#if savedSearches.length}
		<div class="flex h-full flex-col justify-between pb-4">
			<div>
				{#each savedSearches as savedSearch, index}
					{#if index <= 3}
						<div class="flex flex-row items-center justify-between">
							<p>{savedSearch.name}</p>
							<p></p>
							<div class="flex flex-row justify-around">
								<button
									onclick={() => toggleText(savedSearch.textNotification, savedSearch.id)}
									class="{savedSearch.textNotification
										? active
										: inactive} mx-1 my-3 rounded px-4 py-2 text-white">Text</button
								>
								<button
									onclick={() => toggleEmail(savedSearch.emailNotification, savedSearch.id)}
									class="{savedSearch.emailNotification
										? active
										: inactive} mx-1 my-3 rounded px-4 py-2 text-white">Email</button
								>
								{#if savedSearch.pickupDateStart && savedSearch.pickupDateEnd}
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
			{:else if savedSearch.pickupDateStart && !savedSearch.pickupDateEnd}

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
												savedSearch.pickupDateStart
											)}
										class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button
									>
			{:else if !savedSearch.pickupDateStart && savedSearch.pickupDateEnd}

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
												savedSearch.pickupDateEnd
											)}
										class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button
									>
			{:else}

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
											)}
										class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button
									>
			{/if}
								<button
									onclick={() => deleteRow(savedSearch.id, savedSearch.name)}
									class="mx-1 my-3 rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white"
									>Delete</button
								>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<div class="flex flex-col gap-3 md:flex-row">
				<button
					class="mx-50 my-3 w-full rounded bg-slate-800 px-5 py-2 text-white"
					onclick={() => {
						manageSavedSearchIsShowing = manageSavedSearchIsShowing ? false : true;
					}}>View all saved searches</button
				>
				<button
					class="mx-50 my-3 w-full rounded bg-slate-800 px-5 py-2 text-white"
					onclick={() => {
						contactInfoPreferencesModal = true;
					}}>Notification Preferences</button
				>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<div class="m-auto text-center text-4xl">No saved searches available</div>
			<Button outline color="blue" class="m-auto mt-10 w-40" on:click={refresh}>Refresh</Button>
		</div>
	{/if}
</div>
<DeleteConfirmationModal
	id={deleteID}
	name={deleteName}
	bind:deleteConfirmationShowing
	bind:savedSearches
/>
<ContactInfoPreferencesModal bind:contactInfoPreferencesModal email={true} text={true} {userId} />
<ManageSavedSearchModal
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
