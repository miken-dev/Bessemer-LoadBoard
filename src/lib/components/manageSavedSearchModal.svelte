<script lang="ts">
	import { Modal } from "flowbite-svelte";
	import SavedSearchesRow from "./SavedSearchesRow.svelte";
	let {
		manageSavedSearchIsShowing = $bindable()
	}: {
		manageSavedSearchIsShowing: boolean
	} = $props()
</script>

<Modal title="Manage Saved Searches" size="lg" bind:open={manageSavedSearchIsShowing}  outsideclose> 
	
	<SavedSearchesRow title="Saved Search #1" text={false} email={true} />
	<SavedSearchesRow title="My saved search" text={true} email={false} />
	<SavedSearchesRow title="Sample search #3" text={false} email={false} />
	<SavedSearchesRow title="This is another search" text={true} email={true} />
	<SavedSearchesRow title="Saved Search #1" text={false} email={true} />
	<SavedSearchesRow title="My saved search" text={true} email={false} />
	<SavedSearchesRow title="Sample search #3" text={false} email={false} />
	<SavedSearchesRow title="This is another search" text={true} email={true} />
	<SavedSearchesRow title="Saved Search #1" text={false} email={true} />
	<SavedSearchesRow title="My saved search" text={true} email={false} />
	<SavedSearchesRow title="Sample search #3" text={false} email={false} />
	<SavedSearchesRow title="This is another search" text={true} email={true} />

</Modal>
