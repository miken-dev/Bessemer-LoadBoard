<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount, onDestroy } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import type { savedSearchesTypes } from '$lib/types';
	import DeleteConfirmationModal from './DeleteConfirmationModal.svelte';
	import { Modal } from 'flowbite-svelte';
	
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
		userId: string | null;
	} = $props();

	let active = 'bg-blue-600';
	let inactive = 'bg-gray-500';
	let deleteConfirmationShowing = $state(false);
	let deleteID = $state('');
	let deleteName = $state('');

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getRecords() {
		console.log(userId);
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
		console.log(`got ${results.length} records`)
		return results.reverse();
	}

	onMount(async () => {
		savedSearches = await getRecords();

	});
	onMount(async () => {
		return refresh() 
	});

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
		console.log("refreshing")
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
		manageSavedSearchIsShowing = false
	}
</script>

<Modal title="Manage Saved Searches" size="lg" bind:open={manageSavedSearchIsShowing} outsideclose>
	<div class="mt-5 h-3/4 w-full rounded p-5 md:m-5">
		{#if savedSearches != undefined}
			<div class="flex h-full flex-col justify-between pb-4">
				<div>
					{#each savedSearches as savedSearch, index}
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
										)
									}
									class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button
								>
								<button
									onclick={() => deleteRow(savedSearch.id, savedSearch.name)}
									class="mx-1 my-3 rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white"
									>Delete</button
								>
							</div>
						</div>
					{/each}
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
</Modal>
