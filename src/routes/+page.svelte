<script lang="ts">
	// framework/library imports
	import { dev } from '$app/environment';
	import { Button } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

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

	// filters

	let originMilesFilter: number | undefined = $state();
	let originStateFilter: string | undefined = $state();
	let originCityFilter: string | undefined = $state();
	let destMilesFilter: number | undefined = $state();
	let destCityFilter: string | undefined = $state();
	let destStateFilter: string | undefined = $state();
	let trailerTypesFilter: string | undefined = $state('');
	let fromDateRange: Date | undefined = $state(undefined);
	let toDateRange: Date | undefined = $state(undefined);
	let filter: string = $state('isPublic = "true"');

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

		const checkCookie = setInterval(() => {
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

	function useUserId(id: string | null): string {
		return id ?? 'Not logged in';
	}
	//Helper functions
	function toRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}
	function distanceFilter(
		dataLat: number,
		dataLong: number,
		filterLat: number,
		filterLong: number
	): number {
		const earthRadiusKM = 6371;
		const dataLatConverted = toRadians(dataLat);
		const dataLongConverted = toRadians(dataLong);
		const filterLatConverted = toRadians(filterLat);
		const filterLongConverted = toRadians(filterLong);

		const deltaLat = filterLatConverted - dataLatConverted;
		const deltaLong = filterLongConverted - dataLongConverted;

		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(dataLatConverted) *
				Math.cos(filterLatConverted) *
				Math.sin(deltaLong / 2) *
				Math.sin(deltaLong / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const distance = earthRadiusKM * c;
		const distanceMiles = distance * 0.621371;
		return distanceMiles;
	}

	const toggleDetails = (id: string) => {
		selectedRow = selectedRow === id ? null : id;
	};
</script>

<header class="dark:bg-gray-800 dark:text-gray-100">
	{#if dev}
		<div class="flex items-center justify-center bg-red-600">
			<p>
				<strong>DEVELOPER MODE</strong> detailsHidden={detailsHidden}, selectedLoadID={selectedRow
					? selectedRow
					: 'null'}, tableClicked={tableClicked}, city={selectedCity}, userID={userId} multi={multipleLoads},
				loggedIn={loggedIn} 
			</p>
		</div>
	{/if}
	<Header {loggedIn} />
</header>
<main class="gray-800 min-h-lvh w-full px-5 pt-5 dark:bg-gray-800 dark:text-gray-100 md:px-20">
	{#if loggedIn}
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
		<SearchOptions {originMilesFilter} {originStateFilter} {originCityFilter} {destMilesFilter} {destCityFilter} {destStateFilter} {trailerTypesFilter} {fromDateRange} {toDateRange} {saveSearchDialogIsShowing} {manageSavedSearchIsShowing} {userId} />
	{/if}
	{/if}
	
	<!-- Table and Map -->
	{#if loggedIn}
	<LoggedInData />
	{:else}
	<PublicData />
	{/if}
	<ManageSavedSearchModal bind:manageSavedSearchIsShowing />
	<SaveSearchDialog
		bind:saveSearchDialogIsShowing
		bind:saved
		{originMilesFilter}
		{originStateFilter}
		{originCityFilter}
		{destMilesFilter}
		{destCityFilter}
		{destStateFilter}
		{trailerTypesFilter}
		{fromDateRange}
		{toDateRange}
		{userId}
	/>
	<NotificationPreferencesModal {NotificationPreferencesShowing} {userId} />
</main>
