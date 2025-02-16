<script lang="ts">
	import PocketBase from 'pocketbase'
	import type { savedSearchesTypes } from "$lib/types";
	import { Button, Modal } from "flowbite-svelte";
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

		savedSearches = await getRecords()
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
		<button onclick={deleteRecord}>Delete</button>
		<button>Cancel</button>
	</svelte:fragment>
</Modal>
