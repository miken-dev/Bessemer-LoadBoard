<script lang="ts">
	import PocketBase from 'pocketbase'
	import type { savedSearchesTypes } from "$lib/types";
	import { Button, Modal } from "flowbite-svelte";
	import { onDestroy } from 'svelte';
	let {
		id,
		name,
		deleteConfirmationShowing = $bindable(),
		savedSearches = $bindable()
	}: {
		id: string;
		name: string
		deleteConfirmationShowing: boolean
		savedSearches: [savedSearchesTypes] | [];
	} = $props()
	
	
	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function deleteRecord() {
		await PB.collection('Saved_Searches').delete(id)

		removeObjectById(savedSearches, id)
	}
	
	function removeObjectById(array:any, id: string) {
		const index = array.findIndex(obj => obj.id === id)
		if (index !== -1) {
			array.splice(index, 1)
		}
	}



	async function getRecords() {
		const records = await PB.collection('Saved_Searches').getFullList({
			filter: `userID = "${id}"`
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
</script>

<Modal title="Are you sure you want to delete {name}" bind:open={deleteConfirmationShowing} autoclose outsideclose>
	<p>This cannot be undone</p>
	<svelte:fragment slot="footer">
		<button class="mx-1 my-3 px-4 py-2 rounded bg-red-600  text-white" onclick={deleteRecord}>Delete</button>
		<button class="mx-1 my-3 px-4 py-2 rounded border-slate-200 bg-slate-300 dark:bg-slate-700 border text-slate-900 dark:text-slate-100">Cancel</button>
	</svelte:fragment>
</Modal>
