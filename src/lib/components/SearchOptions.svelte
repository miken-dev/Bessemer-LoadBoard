<script lang="ts">
	import NewSearch from "./NewSearch.svelte";
	import SavedSearches from "./SavedSearches.svelte";

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
		saveSearchDialogIsShowing,
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
		fromDateRange: Date | null | undefined;
		toDateRange: Date | null | undefined;
		saveSearchDialogIsShowing: boolean;
		manageSavedSearchIsShowing: boolean;
		userId: string | null;
	} = $props();

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
				{userId}
			/>
		{/key}
	</div>

	</div>
