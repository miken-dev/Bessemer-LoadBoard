<script lang="ts">
	import { Button, Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Datepicker } from 'flowbite-svelte';
	let miles = [5, 10, 25, 50, 100, 150, 200, 250, 300, 400, 500];
	let cities = ['Atlanta', 'Austin', 'Cleveland'];
	let states = ['GA', 'OH', 'TX'];
	let trailerTypes = ['Type 1', 'Type 2'];
	let {
		fromDateRange,
		toDateRange,
		saveSearchDialogIsShowing = $bindable()
	}: {
		fromDateRange: Date | null | undefined;
		toDateRange: Date | null | undefined;
		saveSearchDialogIsShowing: boolean;
	} = $props();
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
	<Button
		color="dark"
		onclick={() => {
			saveSearchDialogIsShowing = true;
		}}>Save Search</Button
	>
</div>
