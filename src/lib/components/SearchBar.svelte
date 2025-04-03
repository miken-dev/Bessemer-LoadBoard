<script lang="ts">
	import { SearchIcon, XIcon } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';

	let {
		origin,
		destination,
		stateName,
		latFilter = $bindable(),
		lngFilter = $bindable(),
		cityFilter = $bindable()
	}: {
		origin?: boolean;
		destination?: boolean;
		stateName: string | undefined;
		latFilter: number | undefined;
		lngFilter: number | undefined;
		cityFilter: string | undefined;
	} = $props();

	let placeholder = 'City';
	// Component props

	let searchQuery = $state('');
	let showResults = $state(false);
	let searchContainer: HTMLDivElement = $state() as any;
	let searchInput: HTMLInputElement = $state() as any;

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getLocations() {
		const records = await PB.collection('Locations').getFullList({
			filter: `state = "Ohio"`,
			perPage: 100
		});
		const results = records.map((record) => {
			return {
				city: record.city,
				state: record.state,
				lat: record.lat,
				lng: record.long,
				zips: record.zips
			};
		});
		return results;
	}

	let items = $state();
	onMount(async () => {
		items = await getLocations();
	});

	// Filtered results based on search query
	const filteredResults = $derived(
		searchQuery.length > 0
			? items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
			: items
	);

	// Handle item selection
	const handleSelect = (item: string) => {
		//TODO: Add select logic

		searchQuery = item;
		showResults = false;
	};

	// Close results dropdown
	const closeResults = () => {
		showResults = false;
	};

	// Handle input focus
	const handleFocus = () => {
		showResults = true;
	};

	// Handle click outside
	const handleClickOutside = (event: MouseEvent) => {
		if (searchContainer && !searchContainer.contains(event.target as Node)) {
			showResults = false;
		}
	};

	// Add and remove click outside listener
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<!-- Search container -->
<div bind:this={searchContainer} class="relative w-full max-w-xs">
	<!-- Search input -->
	<div class="relative flex items-center">
		<SearchIcon class="absolute left-3 h-4 w-4 text-gray-400" />
		<input
			bind:this={searchInput}
			bind:value={searchQuery}
			type="text"
			{placeholder}
			class="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500"
			onfocus={handleFocus}
		/>
	</div>

	<!-- Results dropdown -->
	{#if showResults}
		<div
			transition:fade={{ duration: 100 }}
			class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[280px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
		>
			<!-- Close button -->
			<button
				onclick={closeResults}
				class="absolute right-2 top-2 rounded-sm p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
			>
				<XIcon class="h-4 w-4" />
			</button>

			<!-- Results list -->
			<div class="pt-8">
				{#if filteredResults.length > 0}
					{#each filteredResults as result}
						<button
							onclick={() => handleSelect(result)}
							class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
						>
							{result}
						</button>
					{/each}
				{:else}
					<p class="px-4 py-2 text-sm text-gray-500">No results found</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
