<script lang="ts">
	//	import MiniSearch from 'minisearch';
	import Fuse from 'fuse.js';
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
		{ stateId: 'AL', name: 'Alabama' },
		{ stateId: 'AK', name: 'Alaska' },
		{ stateId: 'AZ', name: 'Arizona' },
		{ stateId: 'AR', name: 'Arkansas' },
		{ stateId: 'CA', name: 'California' },
		{ stateId: 'CO', name: 'Colorado' },
		{ stateId: 'CT', name: 'Connecticut' },
		{ stateId: 'DE', name: 'Delaware' },
		{ stateId: 'FL', name: 'Florida' },
		{ stateId: 'GA', name: 'Georgia' },
		{ stateId: 'HI', name: 'Hawaii' },
		{ stateId: 'ID', name: 'Idaho' },
		{ stateId: 'IL', name: 'Illinois' },
		{ stateId: 'IN', name: 'Indiana' },
		{ stateId: 'IA', name: 'Iowa' },
		{ stateId: 'KS', name: 'Kansas' },
		{ stateId: 'KY', name: 'Kentucky' },
		{ stateId: 'LA', name: 'Louisiana' },
		{ stateId: 'ME', name: 'Maine' },
		{ stateId: 'MD', name: 'Maryland' },
		{ stateId: 'MA', name: 'Massachusetts' },
		{ stateId: 'MI', name: 'Michigan' },
		{ stateId: 'MN', name: 'Minnesota' },
		{ stateId: 'MS', name: 'Mississippi' },
		{ stateId: 'MO', name: 'Missouri' },
		{ stateId: 'MT', name: 'Montana' },
		{ stateId: 'NE', name: 'Nebraska' },
		{ stateId: 'NV', name: 'Nevada' },
		{ stateId: 'NH', name: 'New Hampshire' },
		{ stateId: 'NJ', name: 'New Jersey' },
		{ stateId: 'NM', name: 'New Mexico' },
		{ stateId: 'NY', name: 'New York' },
		{ stateId: 'NC', name: 'North Carolina' },
		{ stateId: 'ND', name: 'North Dakota' },
		{ stateId: 'OH', name: 'Ohio' },
		{ stateId: 'OK', name: 'Oklahoma' },
		{ stateId: 'OR', name: 'Oregon' },
		{ stateId: 'PA', name: 'Pennsylvania' },
		{ stateId: 'RI', name: 'Rhode Island' },
		{ stateId: 'SC', name: 'South Carolina' },
		{ stateId: 'SD', name: 'South Dakota' },
		{ stateId: 'TN', name: 'Tennessee' },
		{ stateId: 'TX', name: 'Texas' },
		{ stateId: 'UT', name: 'Utah' },
		{ stateId: 'VT', name: 'Vermont' },
		{ stateId: 'VA', name: 'Virginia' },
		{ stateId: 'WA', name: 'Washington' },
		{ stateId: 'WV', name: 'West Virginia' },
		{ stateId: 'WI', name: 'Wisconsin' },
		{ stateId: 'WY', name: 'Wyoming' }
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
			type: 'Drop Side_RGN',
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
		cleared = $bindable(),
		saveEnabled,
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
		cleared: boolean;
		saveEnabled: boolean;
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
		trailerTypesFilterArray = [''];
		originCitySearch = '';
		originStateSearch = '';
		destCitySearch = '';
		destStateSearch = '';
		trailerTypesSearch = '';
		cleared = true;
	}
	function setOriginAddress(
		lat: string,
		lng: string,
		city: string,
		state: string,
		stateShort: string
	) {
		originLatFilter = Number(lat);
		originLngFilter = Number(lng);
		originCityFilter = city;
		originStateFilter = state;
		originStateShort = stateShort;
	}
	function setDestinationAddress(
		lat: string,
		lng: string,
		city: string,
		state: string,
		stateShort: string
	) {
		destLatFilter = Number(lat);
		destLngFilter = Number(lng);
		destCityFilter = city;
		destStateFilter = state;
		destStateShort = stateShort;
	}
	let trailerTypesFilterArray: string[] = $state(['']);
	function toggleTrailerType(trailerType: string) {
		trailerTypesFilterArray = trailerTypesFilter.split(', ');
		if (trailerTypesFilterArray.includes(trailerType)) {
			let index = trailerTypesFilterArray.indexOf(trailerType);
			if (index > -1) {
				trailerTypesFilterArray.splice(index, 1);
				trailerTypesFilter = trailerTypesFilterArray.join(', ');
				console.log(`first: ${trailerType}, ttf:${trailerTypesFilterArray}`);
			}
		} else {
			trailerTypesFilterArray.push(trailerType);
			trailerTypesFilter = trailerTypesFilterArray.join(', ');
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
	let originStateShort = $state('');
	let destStateShort = $state('');

	// Define the data interface
	interface LocationEntry {
		city: string;
		state: string;
		lat: number;
		lng: number;
		zips: string;
	}

	// Define the interface for the index
	interface StateIndex {
		[state: string]: LocationEntry[];
	}

	// Define the interface for data with optional index
	interface IndexableData extends Array<LocationEntry> {
		stateIndex?: StateIndex;
	}

	// Create an index for faster lookups
	function createStateIndex(data: LocationEntry[]): StateIndex {
		const stateIndex: StateIndex = {};

		for (let i = 0; i < data.length; i++) {
			const entry = data[i];
			const state = entry.state;

			if (!stateIndex[state]) {
				stateIndex[state] = [];
			}

			stateIndex[state].push(entry);
		}

		return stateIndex;
	}

	let trailerAlignment = () => {
		if (trailerTypesFilter.length >= 350) {
			return 'mt-60';
		} else if (trailerTypesFilter.length >= 320) {
			return 'mt-56';
		} else if (trailerTypesFilter.length >= 280) {
			return 'mt-48';
		} else if (trailerTypesFilter.length >= 250) {
			return 'mt-44';
		} else if (trailerTypesFilter.length >= 210) {
			return 'mt-40';
		} else if (trailerTypesFilter.length >= 175) {
			return 'mt-36';
		} else if (trailerTypesFilter.length >= 140) {
			return 'mt-28';
		} else if (trailerTypesFilter.length >= 105) {
			return 'mt-24';
		} else if (trailerTypesFilter.length >= 70) {
			return 'mt-20';
		} else if (trailerTypesFilter.length >= 35) {
			return 'mt-14';
		} else {
			return 'mt-12';
		}
	};
	// Filter function that uses the index
	function filterByState(data: IndexableData, targetState: string): LocationEntry[] {
		// If this is the first time filtering, create the index
		if (!data.stateIndex) {
			data.stateIndex = createStateIndex(data);
		}

		// Return the entries for the target state (or empty array if none)
		return data.stateIndex[targetState] || [];
	}

	let originStateFiltered = $derived.by(() => {
		if (originStateSearch.length === 2) {
			return states.filter((state) =>
				state.stateId.toLowerCase().includes(originStateSearch.toLowerCase())
			);
		} else {
			return states.filter((state) =>
				state.name.toLowerCase().includes(originStateSearch.toLowerCase())
			);
		}
	});

	let originCityFiltered = $derived(
		filterByState(locations, originStateFilter).filter((location) =>
			location.city.toLowerCase().includes(originCitySearch.toLowerCase())
		)
	);
	let destStateFiltered = $derived.by(() => {
		if (destStateSearch.length === 2) {
			return states.filter((state) =>
				state.stateId.toLowerCase().includes(destStateSearch.toLowerCase())
			);
		} else {
			return states.filter((state) =>
				state.name.toLowerCase().includes(destStateSearch.toLowerCase())
			);
		}
	});
	let destCityFiltered = $derived(
		filterByState(locations, destStateFilter).filter((location) =>
			location.city.toLowerCase().includes(destCitySearch.toLowerCase())
		)
	);
	let trailerTypeFiltered = $derived(
		trailerTypes.filter((trailerType) =>
			trailerType.type.toLowerCase().includes(trailerTypesSearch.toLowerCase())
		)
	);

	function sortLocationData(locations) {
		return locations.sort((a, b) => {
			// First, compare by city name
			const cityComparison = a.item.city.localeCompare(b.item.city);

			// If cities are the same, compare by state_id
			if (cityComparison === 0) {
				return a.item.state_id.localeCompare(b.item.state_id);
			}

			// Otherwise, return the city comparison result
			return cityComparison;
		});
	}
	const fuseOptions = {
		// isCaseSensitive: false,
		// includeScore: false,
		// ignoreDiacritics: false,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		minMatchCharLength: 3,
		// location: 0,
		threshold: 0.05,
		// distance: 100,
		// useExtendedSearch: false,
		ignoreLocation: true,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ['keywords']
	};

	const fuse = new Fuse(locations, fuseOptions);

	let originSearchResults = $derived(fuse.search(originCitySearch.replace(',', ' ').replace('  ', ' ')));
	let destSearchResults = $derived(fuse.search(destCitySearch.replace(',', ' ').replace('  ', ' ')));
</script>

<div class="mt-5 flex w-full flex-col gap-5 rounded bg-slate-200 p-5 dark:bg-gray-900 md:m-5">
	<h2 class="text-2xl font-extrabold">New Search</h2>
	<!-- DATE RANGE -->
	<div class="flex w-full flex-col items-center justify-start gap-4 xl:flex-row">
		<p class=" justify-self-start">Pick up Date/Range:</p>
		<div class="flex w-full flex-col items-center gap-3 xl:flex-row">
			<div class="flex flex-col items-center gap-3 sm:flex-row">
				<p>from:</p>
				<div class="w-72">
					<Datepicker bind:value={fromDateRange} color="blue" />
				</div>
			</div>
			<div class="flex flex-col items-center gap-3 sm:flex-row">
				<p>to:</p>
				<div class="w-72">
					<Datepicker bind:value={toDateRange} color="blue" />
				</div>
			</div>
		</div>
	</div>

	<!-- ORIGIN -->
	<div class="flex flex-col items-center justify-start gap-3 lg:flex-row">
		<p class="justify-self-start">Origin:</p>
		<div class="flex flex-col items-center gap-3 sm:flex-row">
			<div class="flex flex-row items-center gap-3">
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
			</div>
			<div class="flex flex-row items-center gap-3">
				<p>of</p>
				<!-- CITY -->
				<Button
					size="xs"
					color="light"
					on:click={() => {
						setTimeout(() => {
							document.querySelector<HTMLInputElement>('.originCitySearch')?.focus();
						}, 155);
					}}
					>{originCityFilter
						? `${originCityFilter}, ${originStateShort}`
						: 'Location'}<ChevronDownOutline
						class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
					/></Button
				>
				<Dropdown
					bind:open={originCityShowing}
					id="originDropDown"
					class="max-h-48 w-48 overflow-y-auto py-1"
				>
					<Search
						size="sm"
						bind:value={originCitySearch}
						class="originCitySearch"
						on:keydown={(e) => {
							if (e.key === 'Enter' && originSearchResults.length > 0) {
								setOriginAddress(
									originSearchResults[0].item.lat,
									originSearchResults[0].item.lng,
									originSearchResults[0].item.city,
									originSearchResults[0].item.state,
									originSearchResults[0].item.state_id
								);
								originCityShowing = false;
								originCitySearch = '';
							}
						}}
					/>

					{#if originCitySearch}
						{#each sortLocationData(originSearchResults) as location}
							<DropdownItem
								on:click={() => {
									setOriginAddress(
										location.item.lat,
										location.item.lng,
										location.item.city,
										location.item.state,
										location.item.state_id
									);
									originCityShowing = false;
									originCitySearch = '';
								}}>{location.item.city}, {location.item.state_id}</DropdownItem
							>
						{/each}
					{/if}
				</Dropdown>
			</div>
		</div>
	</div>

	<!-- DESTINATION -->
	<div class="flex flex-col items-center justify-start gap-3 lg:flex-row">
		<p class=" justify-self-start">Destination:</p>
		<div class="flex flex-col items-center gap-3 sm:flex-row">
			<div class="flex flex-row items-center gap-3">
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
			</div>

			<div class="flex flex-row items-center gap-3">
				<p>of</p>

				<Button
					size="xs"
					color="light"
					on:click={() => {
						setTimeout(() => {
							document.querySelector<HTMLInputElement>('.destCitySearch')?.focus();
						}, 155);
					}}
				>{destCityFilter
					? `${destCityFilter}, ${destStateShort}`
					: 'Location'}<ChevronDownOutline
						class="ms-2 h-6 w-6 text-gray-800 dark:text-white"
					/></Button
				>
				<Dropdown
					bind:open={destCityShowing}
					id="destDropDown"
					class="max-h-48 w-48 overflow-y-auto py-1"
				>
					<Search
						size="sm"
						bind:value={destCitySearch}
						class="destCitySearch"
						on:keydown={(e) => {
							if (e.key === 'Enter' && destSearchResults.length > 0) {
								setDestinationAddress(
									destSearchResults[0].item.lat,
									destSearchResults[0].item.lng,
									destSearchResults[0].item.city,
									destSearchResults[0].item.state,
									destSearchResults[0].item.state_id
								);
								destCityShowing = false;
								destCitySearch = '';
							}
						}}
					/>

					{#if destCitySearch}
						{#each sortLocationData(destSearchResults) as location}
							<DropdownItem
								on:click={() => {
									setDestinationAddress(
										location.item.lat,
										location.item.lng,
										location.item.city,
										location.item.state,
										location.item.state_id
									);
									destCityShowing = false;
									destCitySearch = '';
								}}>{location.item.city}, {location.item.state_id}</DropdownItem
							>
						{/each}
					{/if}
				</Dropdown>
			</div>
		</div>
	</div>

	<!-- TRAILER TYPE -->
	<div class="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
		<p class="justify-self-start">Trailer Type:</p>
		<Button
			size="md"
			color="light"
			class="w-80 lg:w-96"
			on:click={() => {
				setTimeout(() => {
					document.querySelector<HTMLInputElement>('.trailerTypeSsearch');
				});
			}}
			>{trailerTypesFilter
				? trailerTypesFilter.slice(2).replace('_', ' ')
				: 'Pick a type'}<ChevronDownOutline
				class="ms-2 h-6 text-gray-800 dark:text-white md:w-6"
			/></Button
		>
		<Dropdown
			placement="bottom-start"
			bind:open={trailerTypesShowing}
			class="mx-1 h-48 w-60 overflow-y-auto px-1 py-1"
		>
			<Search size="sm" bind:value={trailerTypesSearch} />
			{#each trailerTypeFiltered as trailerType}
				<DropdownItem>
				{#if trailerTypesFilterArray.includes(trailerType.type) || trailerTypesFilter.includes(`{ trailerType.type},`)}
					<Checkbox
						class="px-3"
						color="blue"
						checked
						on:click={() => {
							trailerType.enabled = trailerType.enabled ? false : true;
							toggleTrailerType(trailerType.type);
							trailerTypesShowing = true;
						}}>{trailerType.type.replace("_", " ")}</Checkbox
					>
				{:else}
					<Checkbox
						class="px-3"
						color="blue"
						on:click={() => {
							trailerType.enabled = trailerType.enabled ? false : true;
							toggleTrailerType(trailerType.type);
							trailerTypesShowing = true;
						}}>{trailerType.type.replace("_", " ")}</Checkbox
					>
				{/if}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>

	<!-- BUTTONS -->
	<ButtonGroup divClass="flex justify-start">
		{#if saveEnabled}
			<Button
				color="blue"
				onclick={() => {
					saveSearchDialogIsShowing = true;
				}}
			>
				<FloppyDiskSolid class="me-2 h-4 w-4" />
				Save Search
			</Button>
		{/if}
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
