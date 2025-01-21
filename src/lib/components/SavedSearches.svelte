<script lang="ts">
	import SavedSearchesRow from './SavedSearchesRow.svelte';
	let {
		manageSavedSearchIsShowing = $bindable()
	}: {
		manageSavedSearchIsShowing: boolean;
	} = $props();
</script>

<div class="m-5 p-5 rounded bg-slate-200 dark:bg-gray-900 w-full">
	<h2 class="text-2xl font-extrabold">Saved Searches</h2>
	<SavedSearchesRow title="Saved Search #1" text={false} email={true} />
	<SavedSearchesRow title="My saved search" text={true} email={false} />
	<SavedSearchesRow title="Sample search #3" text={false} email={false} />
	<SavedSearchesRow title="This is another search" text={true} email={true} />
	<button
		class="w-full mx-50  my-3 rounded bg-slate-800 px-5 py-2 text-white"
		onclick={() => {
			manageSavedSearchIsShowing = manageSavedSearchIsShowing ? false : true;
		}}>Manage Saved Searches</button
	>
</div>
