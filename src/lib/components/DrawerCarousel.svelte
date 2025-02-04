<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";
	import { fade } from "svelte/transition";
	import type { Snippet } from "svelte";
	// Props definition
	let {
		items = [],
		item,
	}: {
		items: any[];
		item: Snippet<{ item: any }>;
	} = $props();

	// Current index state
	let currentIndex: number = $state(0);

	// Computed properties
	const isFirstSlide = $derived(currentIndex === 0);
	const isLastSlide = $derived(currentIndex === items.length - 1);

	// Navigation functions
	function next() {
		if (!isLastSlide) {
			currentIndex++;
		}
	}

	function prev() {
		if (!isFirstSlide) 
			currentIndex--;
		}
	}

	function goToSlide(index: number) {
		currentIndex = index;
	}
</script>

<div class="w-full h-full relative group">
	<!-- Main carousel content -->
	<div class="w-full h-full overflow-hidden">
		<div transition:fade class="w-full h-full">
			{@render item({ item: items[currentIndex] })}
		</div>
	</div>

	<!-- Navigation buttons -->
	<button class={["absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full", "bg-white/80 hover:bg-white text-gray-800 shadow-lg transition-colors duration-200", isFirstSlide && "opacity-50 cursor-not-allowed"]} onclick={prev} disabled={isFirstSlide} aria-label="Previous slide">
		<ChevronLeftIcon class="size-6" />
	</button>

	<button class={["absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full", "bg-white/80 hover:bg-white text-gray-800 shadow-lg transition-colors duration-200", isLastSlide && "opacity-50 cursor-not-allowed"]} onclick={next} disabled={isLastSlide} aria-label="Next slide">
		<ChevronRightIcon class="size-6" />
	</button>

	<!-- Indicators -->
	<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
		{#each items as _, i}
			<button class={["w-2 h-2 rounded-full transition-all duration-200", currentIndex === i ? "bg-white w-4" : "bg-white/50"]} onclick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`} />
		{/each}
	</div>
</div>

