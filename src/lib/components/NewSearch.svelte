<script lang="ts">
	import {
		Button,
		ButtonGroup,
		Checkbox,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		DropdownHeader
	} from 'flowbite-svelte';
	import {
		ChevronDownOutline,
		FloppyDiskSolid,
		SearchSolid,
		DeleteRowOutline
	} from 'flowbite-svelte-icons';
	import { Datepicker } from 'flowbite-svelte';
	import locations from '$lib/assets/locations.json';
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
		'Beam Trailer',
		'Boat',
		'Booster',
		'Bottom Hopper',
		'Conestoga',
		'Conestoga With Heat',
		'Dolly',
		'Double Drop',
		'Double Drop Stretch',
		'Drop Side RGN',
		'Flat Stretch',
		'Flatbed',
		'Flatbed w/ Sides',
		'Flatbed w/sides; heated',
		'Flip Axle',
		'Hot Shot',
		'Hydraulic Platform',
		'Jeep',
		'Joe Dog',
		'LowPro Step Deck',
		'LowPro Step Deck Stretch',
		'Michigan Train',
		'Perimeter',
		'Power Only',
		'Reefer',
		'RGN',
		'RGN Stretch',
		'Sled',
		'Step Deck',
		'Step Deck Stretch',
		'Stinger',
		'Van'
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
		saveSearchDialogIsShowing = $bindable()
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
		trailerTypesFilter: string | undefined;
		fromDateRange: Date | null | undefined;
		toDateRange: Date | null | undefined;
		saveSearchDialogIsShowing: boolean;
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
		trailerTypesFilter = undefined;
		fromDateRange = undefined;
		toDateRange = undefined;
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
	function addTrailerType(trailerType: string) {
		if (trailerTypesFilter?.includes(trailerType)) {
			trailerTypesFilter.replace(`${trailerType}, `, '');
		} else {
			return (trailerTypesFilter += `${trailerType}, `);
		}
	}
</script>

<div class="m-5 flex w-full flex-col gap-5 rounded bg-slate-200 p-5 dark:bg-gray-900">
	<h2 class="text-2xl font-extrabold">New Search</h2>
	<!-- TODO: Add divider -->
	<div class="flex items-center justify-start gap-3">
		<p class="flex-1 justify-self-start">Origin:</p>
		<p>Within</p>
		<Button size="xs" color="light"
			>Miles<ChevronDownOutline class="ms-2 h-6 w-6 text-gray-800 dark:text-white" /></Button
		>
		<Dropdown>
			{#each miles as mile}
				<DropdownItem>{mile}</DropdownItem>
			{/each}
		</Dropdown>
		<p>of</p>
		<Button size="xs" color="light"
			>State<ChevronDownOutline class="ms-2 h-6 w-6 text-gray-800 dark:text-white" /></Button
		>
		<Dropdown>
			{#each states as state}
				<DropdownItem>{state}</DropdownItem>
			{/each}
		</Dropdown>
		<Button size="xs" color="light"
			>City<ChevronDownOutline class="ms-2 h-6 w-6 text-gray-800 dark:text-white" /></Button
		>
		<Dropdown>
			{#each cities as city}
				<DropdownItem>{city}</DropdownItem>
			{/each}
		</Dropdown>
	</div>

	<div class="flex items-center justify-start gap-3">
		<p class="flex-1 justify-self-start">Destination:</p>
		<p>Within</p>
		<Button size="xs" color="light"
			>Miles<ChevronDownOutline class="ms-2 h-6 w-6 text-gray-800 dark:text-white" /></Button
		>
		<Dropdown>
			{#each miles as mile}
				<DropdownItem>{mile}</DropdownItem>
			{/each}
		</Dropdown>
		<p>of</p>
		<Button size="xs" color="light"
			>State<ChevronDownOutline
				class="text-gratext-gratext-gratext-gratext-gratext-gratext-gratext-gray-800 ms-2 h-6 w-6 dark:text-white"
			/></Button
		>
		<Dropdown>
			{#each states as state}
				<DropdownItem>{state}</DropdownItem>
			{/each}
		</Dropdown>
		<Button size="xs" color="light"
			>City<ChevronDownOutline class="ms-2 h-6 w-6 text-gray-800 dark:text-white" /></Button
		>
		<Dropdown>
			{#each cities as city}
				<DropdownItem>{city}</DropdownItem>
			{/each}
		</Dropdown>
	</div>

	<div class="flex items-center justify-between gap-3">
		<p class=" justify-self-start">Pick up:</p>
		<div class="w-2/3">
			<Datepicker range bind:rangeFrom={fromDateRange} bind:rangeTo={toDateRange} color="blue" />
		</div>
	</div>
	<div class="flex items-center justify-between gap-3">
		<p class="justify-self-start">Trailer Type:</p>
		<Button size="md" color="light"
			>Pick a type<ChevronDownOutline class="ms-2 h-6 w-6 text-gray-800 dark:text-white" /></Button
		>
		<Dropdown>
			{#each trailerTypes as type}
				<DropdownItem>{type}</DropdownItem>
			{/each}
		</Dropdown>
	</div>

	<ButtonGroup divClass="flex justify-end">
		<Button color="blue">
			<SearchSolid class="w-4 h-4 me-2"/>
			Search</Button
		>
		<Button
			color="dark"
			onclick={() => {
				saveSearchDialogIsShowing = true;
			}}
		>
			<FloppyDiskSolid class="w-4 h-4 me-2"/>
			Save Search
		</Button>
		<Button color="dark">
			<DeleteRowOutline class="w-4 h-4 me-2"/>
			Clear Search</Button>
	</ButtonGroup>
</div>
