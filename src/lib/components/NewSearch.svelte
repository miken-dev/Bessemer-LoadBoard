<script lang="ts">
	import {
		Button,
		ButtonGroup,
		Checkbox,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		DropdownHeader,
		Search
	} from 'flowbite-svelte';
	import {
		ChevronDownOutline,
		FloppyDiskSolid,
		SearchSolid,
		DeleteRowOutline
	} from 'flowbite-svelte-icons';
	import { Datepicker } from 'flowbite-svelte';
	import locations from '$lib/assets/locations.json';
	import SaveSearchDialog from './saveSearchDialog.svelte';
	import type { savedSearchesTypes } from '$lib/types';
	import ContactInfoPreferencesModal from './ContactInfoPreferencesModal.svelte';
	let miles = [5, 10, 25, 50, 100, 150, 200, 250, 300, 400, 500];

	const states = [
		'Alabama',
		'Alaska',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'Florida',
		'Georgia',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Pennsylvania',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming'
	];

	let trailerTypes = [
		{
			type: 'Beam Trailer',
			enabled: false
		},
		{
			type: 'Boat',
			enabled: false
		},
		{
			type: 'Booster',
			enabled: false
		},
		{
			type: 'Bottom Hopper',
			enabled: false
		},
		{
			type: 'Conestoga',
			enabled: false
		},
		{
			type: 'Conestoga With Heat',
			enabled: false
		},
		{
			type: 'Dolly',
			enabled: false
		},
		{
			type: 'Double Drop',
			enabled: false
		},
		{
			type: 'Double Drop Stretch',
			enabled: false
		},
		{
			type: 'Drop Side RGN',
			enabled: false
		},
		{
			type: 'Flat Stretch',
			enabled: false
		},
		{
			type: 'Flatbed',
			enabled: false
		},
		{
			type: 'Flatbed w/ Sides',
			enabled: false
		},
		{
			type: 'Flatbed w/sides; heated',
			enabled: false
		},
		{
			type: 'Flip Axle',
			enabled: false
		},
		{
			type: 'Hot Shot',
			enabled: false
		},
		{
			type: 'Hydraulic Platform',
			enabled: false
		},
		{
			type: 'Jeep',
			enabled: false
		},
		{
			type: 'Joe Dog',
			enabled: false
		},
		{
			type: 'LowPro Step Deck',
			enabled: false
		},
		{
			type: 'LowPro Step Deck Stretch',
			enabled: false
		},
		{
			type: 'Michigan Train',
			enabled: false
		},
		{
			type: 'Perimeter',
			enabled: false
		},
		{
			type: 'Power Only',
			enabled: false
		},
		{
			type: 'Reefer',
			enabled: false
		},
		{
			type: 'RGN',
			enabled: false
		},
		{
			type: 'RGN Stretch',
			enabled: false
		},
		{
			type: 'Sled',
			enabled: false
		},
		{
			type: 'Step Deck',
			enabled: false
		},
		{
			type: 'Step Deck Stretch',
			enabled: false
		},
		{
			type: 'Stinger',
			enabled: false
		},
		{
			type: 'Van',
			enabled: false
		}
	];
	let {
		originLatFilter = $bindable(),
		originLngFilter = $bindable(),
		destLatFilter = $bindable(),
		destLngFilter = $bindable(),
		originMilesFilter = $bindable(),
		originStateFilter = $bindable(),
		originCityFilter = $bindable(),
		destMilesFilter = $bindable(),
		destCityFilter = $bindable(),
		destStateFilter = $bindable(),
		trailerTypesFilter = $bindable(),
		fromDateRange = $bindable(),
		toDateRange = $bindable(),
		saveSearchDialogIsShowing = $bindable(),
		savedSearches = $bindable(),
		contactInfoPreferencesModal = $bindable(),
		userId
	}: {
		originLatFilter: number | undefined;
		originLngFilter: number | undefined;
		destLatFilter: number | undefined;
		destLngFilter: number | undefined;
		originMilesFilter: number | undefined;
		originStateFilter: string | undefined;
		originCityFilter: string | undefined;
		destMilesFilter: number | undefined;
		destCityFilter: string | undefined;
		destStateFilter: string | undefined;
		trailerTypesFilter: string;
		fromDateRange: Date | undefined;
		toDateRange: Date | undefined;
		saveSearchDialogIsShowing: boolean;
		savedSearches: [savedSearchesTypes] | [];
		contactInfoPreferencesModal: boolean;
		userId: string | null;
	} = $props();

	function clearSearch() {
		originLatFilter = undefined;
		originLngFilter = undefined;
		destLatFilter = undefined;
		destLngFilter = undefined;
		originMilesFilter = undefined;
		originStateFilter = undefined;
		originCityFilter = undefined;
		destMilesFilter = undefined;
		destCityFilter = undefined;
		destStateFilter = undefined;
		trailerTypesFilter = '';
		fromDateRange = undefined;
		toDateRange = undefined;
		trailerTypesFilterArray = ['']
	}
	function setOriginAddress(lat: string, lng: string, city: string) {
		originLatFilter = Number(lat);
		originLngFilter = Number(lng);
		originCityFilter = city;
	}
	function setDestinationAddress(lat: string, lng: string, city: string) {
		destLatFilter = Number(lat);
		destLngFilter = Number(lng);
		destCityFilter = city;
	}
	let trailerTypesFilterArray: string[] = $state([''])
	function toggleTrailerType(trailerType: string) {
		trailerTypesFilterArray = trailerTypesFilter.split(", ")
		if (trailerTypesFilterArray.includes(trailerType)) {
			let index = trailerTypesFilterArray.indexOf(trailerType)
			if (index > -1) {
				trailerTypesFilterArray.splice(index, 1);
				trailerTypesFilter = trailerTypesFilterArray.join(", ")
				console.log(`first: ${trailerType}, ttf:${trailerTypesFilterArray}`);
			}
		} else {
			trailerTypesFilterArray.push(trailerType);
			trailerTypesFilter = trailerTypesFilterArray.join(", ")
			console.log(`third, tts:${trailerTypesFilterArray}`);
		}
	}
	function removeTrailerType(trailerType: string) {
		if (trailerTypesFilter?.includes(trailerType)) {
		}
	}
	//state
	let email = $state(false);
	let text = $state(false);
	let originMilesShowing = $state(false);
	let originStateShowing = $state(false);
	let originStateSearch = $state('');
	let originCityShowing = $state(false);
	let originCitySearch = $state('');
	let destMilesShowing = $state(false);
	let destStateShowing = $state(false);
	let destStateSearch = $state('');
	let destCityShowing = $state(false);
	let destCitySearch = $state('');
	let trailerTypesShowing = $state(false);
	let trailerTypesSearch = $state('');

	let originStateFiltered = $derived(
		states.filter((state) => state.toLowerCase().includes(originStateSearch.toLowerCase()))
	);

	let originCityFiltered = $derived(
		locations.filter((location) =>
			location.city.toLowerCase().includes(originCitySearch.toLowerCase())
		)
	);
	let destStateFiltered = $derived(
		states.filter((state) => state.toLowerCase().includes(destStateSearch.toLowerCase()))
	);
	let destCityFiltered = $derived(
		locations.filter((location) =>
			location.city.toLowerCase().includes(destCitySearch.toLowerCase())
		)
	);
	let trailerTypeFiltered = $derived(
		trailerTypes.filter((trailerType) =>
			trailerType.type.toLowerCase().includes(trailerTypesSearch.toLowerCase())
		)
	);
</script>

<div class="mt-5 flex w-full flex-col gap-5 rounded bg-slate-200 p-5 dark:bg-gray-900 md:m-5">
	<h2 class="text-2xl font-extrabold">New Search</h2>
	<!-- DATE RANGE -->
	<div class="flex w-full flex-col items-center justify-start gap-4 md:flex-row">
		<p class=" justify-self-start">Pick up Date/Range:</p>
		<div class="flex w-full flex-col items-center gap-3 md:flex-row">
			<div class="flex items-center gap-3">
				<p>from:</p>
				<div class="w-72">
					<Datepicker bind:value={fromDateRange} color="blue" />
				</div>
			</div>
			<div class="flex items-center gap-3">
				<p>to:</p>
				<div class="w-72">
					<Datepicker bind:value={toDateRange} color="blue" />
				</div>
			</div>
		</div>
	</div>

	<!-- ORIGIN -->
		<!-- TODO: Add divider -->
	<div class="flex flex-col items-center justify-start gap-3 md:flex-row">
		<p class="justify-self-start">Origin:</p>
		<div class="flex items-center gap-3">
			<p>Within</p>
			<Button size="xs" color="light"
				>{originMilesFilter} Miles<ChevronDownOutline
					class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
				/></Button
			>
			<Dropdown bind:open={originMilesShowing} class="max-h-48 w-48 overflow-y-auto py-1">
				{#each miles as mile}
					<DropdownItem
						on:click={() => {
							originMilesFilter = mile;
							originMilesShowing = false;
							trailerTypesShowing = false;
						}}>{mile}</DropdownItem
					>
				{/each}
			</Dropdown>
			<p>of</p>
			<Button size="xs" color="light"
				>{originStateFilter ? originStateFilter : 'State'}<ChevronDownOutline
					class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
				/></Button
			>
			<Dropdown bind:open={originStateShowing} class="max-h-48 w-48 overflow-y-auto py-1">
				<Search size="sm" bind:value={originStateSearch} />
				{#each originStateFiltered as state}
					<DropdownItem
						on:click={() => {
							originStateFilter = state;
							originStateShowing = false;
						}}>{state}</DropdownItem
					>
				{/each}
			</Dropdown>
			<Button size="xs" color="light"
				>{originCityFilter ? originCityFilter : 'City'}<ChevronDownOutline
					class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
				/></Button
			>
			<Dropdown bind:open={originCityShowing} class="max-h-48 w-48 overflow-y-auto py-1">
				<Search size="sm" bind:value={originCitySearch} />
				{#each originCityFiltered as location}
					{#if location.state === originStateFilter}
						<DropdownItem
							on:click={() => {
								setOriginAddress(location.lat, location.lng, location.city);
								originCityShowing = false;
							}}>{location.city}</DropdownItem
						>
					{/if}
				{/each}
			</Dropdown>
		</div>
	</div>

	<!-- DESTINATION -->
	<div class="flex flex-col items-center justify-start gap-8 md:flex-row">
		<p class=" justify-self-start">Destination:</p>
		<div class="flex items-center gap-3">
			<p>Within</p>
			<Button size="xs" color="light"
				>{destMilesFilter} Miles<ChevronDownOutline
					class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
				/></Button
			>
			<Dropdown bind:open={destMilesShowing} class="max-h-48 w-48 overflow-y-auto py-1">
				{#each miles as mile}
					<DropdownItem
						on:click={() => {
							destMilesFilter = mile;
							destMilesShowing = false;
						}}>{mile}</DropdownItem
					>
				{/each}
			</Dropdown>
			<p>of</p>
			<Button size="xs" color="light"
				>{destStateFilter ? destStateFilter : 'State'}<ChevronDownOutline
					class="text-gratext-gratext-gratext-gratext-gratext-gratext-gratext-gray-800 ms-2 h-6 w-6 dark:text-white"
				/></Button
			>
			<Dropdown bind:open={destStateShowing} class="max-h-48 w-48 overflow-y-auto py-1">
				<Search size="sm" bind:value={destStateSearch} />
				{#each destStateFiltered as state}
					<DropdownItem
						on:click={() => {
							destStateFilter = state;
							destStateShowing = false;
						}}>{state}</DropdownItem
					>
				{/each}
			</Dropdown>
			<Button size="xs" color="light"
				>{destCityFilter ? destCityFilter : 'City'}<ChevronDownOutline
					class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
				/></Button
			>
			<Dropdown bind:open={destCityShowing} class="max-h-48 w-48 overflow-y-auto py-1">
				<Search size="sm" bind:value={destCitySearch} />
				{#each destCityFiltered as location}
					{#if location.state === destStateFilter}
						<DropdownItem
							on:click={() => {
								setDestinationAddress(location.lat, location.lng, location.city);
								destCityShowing = false;
							}}>{location.city}</DropdownItem
						>
					{/if}
				{/each}
			</Dropdown>
		</div>
	</div>

	<!-- TRAILER TYPE -->
	<div class="flex items-center justify-start gap-3">
		<p class="justify-self-start">Trailer Type:</p>
		<Button size="md" color="light"
			>{trailerTypesFilter ? trailerTypesFilter.slice(2) : 'Pick a type'}<ChevronDownOutline
				class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
			/></Button
		>

		<Dropdown bind:open={trailerTypesShowing} class="h-48 w-60 overflow-y-auto py-1">
			<Search size="sm" bind:value={trailerTypesSearch} />
			{#each trailerTypeFiltered as trailerType}
				{#if trailerTypesFilterArray.includes(trailerType.type)}
					<Checkbox
						class="px-3"
						color="blue"
						checked
						on:click={() => {
							trailerType.enabled = trailerType.enabled ? false : true;
							toggleTrailerType(trailerType.type);
						}}>{trailerType.type}</Checkbox
					>
				{:else}
					<Checkbox
						class="px-3"
						color="blue"
						on:click={() => {
							trailerType.enabled = trailerType.enabled ? false : true;
							toggleTrailerType(trailerType.type);
						}}>{trailerType.type}</Checkbox
					>
				{/if}
			{/each}
		</Dropdown>
	</div>

	<!-- BUTTONS -->
	<ButtonGroup divClass="flex justify-start">
		<Button
			color="blue"
			onclick={() => {
				saveSearchDialogIsShowing = true;
			}}
		>
			<FloppyDiskSolid class="me-2 h-4 w-4" />
			Save Search
		</Button>
		<Button color="dark" on:click={clearSearch}>
			<DeleteRowOutline class="me-2 h-4 w-4" />
			Clear Search</Button
		>
	</ButtonGroup>
</div>

<SaveSearchDialog
	bind:saveSearchDialogIsShowing
	bind:savedSearches
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

<ContactInfoPreferencesModal bind:contactInfoPreferencesModal {email} {text} {userId} />
