<script lang="ts">
	// framework/library imports
	import { dev } from '$app/environment';
	import { Button } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';

	// Component imports
	import Header from '$lib/components/Header.svelte';
	import ManageSavedSearchModal from '$lib/components/manageSavedSearchModal.svelte';
	import SaveSearchDialog from '$lib/components/saveSearchDialog.svelte';
	import PublicData from '$lib/components/PublicData.svelte';
	import LoggedInData from '$lib/components/LoggedInData.svelte';
	import NotificationPreferencesModal from '$lib/components/NotificationPreferencesModal.svelte';
	import SearchOptions from '$lib/components/SearchOptions.svelte';

	// Application State
	let selectedRow: number | null = $state(null);
	let selectedCity: string | null = $state(null);
	let detailsHidden = $state(true);
	let tableClicked = $state(false);
	let loggedIn = $state(false);
	let multipleLoads = $state(false);

	let saveSearchDialogIsShowing: boolean = $state(false);
	let manageSavedSearchIsShowing: boolean = $state(false);
	let searchOptionsIsShowing: boolean = $state(true);
	let NotificationPreferencesShowing: boolean = $state(false);

	let searchTerm = ""

	// filters
	let originMilesFilter: number | undefined = $state();
	let originStateFilter: string | undefined = $state();
	let originCityFilter: string | undefined = $state();
	let destMilesFilter: number | undefined = $state();
	let destCityFilter: string | undefined = $state();
	let destStateFilter: string | undefined = $state();
	let trailerTypesFilter: string = $state('');
	let fromDateRange: Date | undefined = $state(undefined);
	let toDateRange: Date | undefined = $state(undefined);
	let filter: string = $state('isPublic = "true"');

	let filtersActive = $derived.by(() => {
		if (originCityFilter || destCityFilter || trailerTypesFilter || fromDateRange || toDateRange) {
			return true;
		} else {
			return false;
		}
	});

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	// Cookie set up
	function getUserId(): string | null {
		const cookie = document.cookie.split('; ').find((row) => row.startsWith('dds_user_id='));
		return cookie ? cookie.split('=')[1] : null;
	}

	let userId = $state<string | null>(null);

	onMount(() => {
		const initialId = getUserId();
		if (initialId !== null) {
			userId = initialId; // Direct assignment, no .value needed
			loggedIn = true;
			filter = '';
		}

		const checkCookie = setInterval(async () => {
			const currentId = getUserId();
			if (currentId !== null) {
				userId = currentId; // Direct assignment
				loggedIn = true;
				filter = '';
			} else {
				loggedIn = false;
				filter = 'isPublic="True"';
			}
		}, 1000);

		return () => clearInterval(checkCookie);
	});
</script>

<header class="dark:bg-gray-800 dark:text-gray-100">
	{#if dev}
		<div class="flex items-center justify-center bg-red-600">
			<p>
				<strong>DEVELOPER MODE</strong> detailsHidden={detailsHidden}, selectedLoadID={selectedRow
					? selectedRow
					: 'null'}, tableClicked={tableClicked}, city={selectedCity}, userID={userId} multi={multipleLoads},
				loggedIn={loggedIn} filters:{filtersActive}
			</p>
		</div>
	{/if}
	<Header {loggedIn} />
</header>
<main class="gray-800 min-h-lvh w-full px-5 pt-5 dark:bg-gray-800 dark:text-gray-100 md:px-20">
		<Button
			outline
			onclick={() => {
				searchOptionsIsShowing = !searchOptionsIsShowing;
			}}
			color="blue"
			class="ml-5 flex p-3"
		>
			<p class="ml-5">{searchOptionsIsShowing ? 'Hide' : 'Show'} Search Options</p>
			<ChevronDownOutline class="ms-2  h-6 w-6 text-gray-800 dark:text-white" />
		</Button>
		{#if searchOptionsIsShowing}
			<SearchOptions
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
				{loggedIn}
				{userId}
			/>
		{/if}
	

	<!-- Table and Map -->
	{#if loggedIn}
		<LoggedInData
			{originMilesFilter}
			{originStateFilter}
			{originCityFilter}
			{destMilesFilter}
			{destCityFilter}
			{destStateFilter}
			{trailerTypesFilter}
			{fromDateRange}
			{toDateRange}
		/>
	{:else}
		<PublicData />
	{/if}
	<NotificationPreferencesModal {NotificationPreferencesShowing} {userId} />
</main>
