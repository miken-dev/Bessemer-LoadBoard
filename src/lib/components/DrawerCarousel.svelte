<script>
	import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";
	import { fade } from "svelte/transition";

	// Props definition
	let {
		items = [],
		content,
	} = $props();

	// Current index state
	let currentIndex = $state(0);

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
		if (!isFirstSlide) {
			currentIndex--;
		}
	}

	function goToSlide(index) {
		currentIndex = index;
	}
</script>

<div class="w-full h-full relative group">
	<!-- Main carousel content -->
	<div class="w-full h-full overflow-hidden relative">
		{#key currentIndex}
			<div transition:fade={{ duration: 300 }} class="w-full h-full">
				{@render content({ item: items[currentIndex] })}
			</div>
		{/key}
	</div>

	<!-- Navigation buttons -->
	<button class={["absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 shadow-lg", "hover:bg-background transition-colors duration-200", isFirstSlide && "opacity-50 cursor-not-allowed"]} onclick={prev} disabled={isFirstSlide} aria-label="Previous slide">
		<ChevronLeftIcon class="size-6" />
	</button>

	<button class={["absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 shadow-lg", "hover:bg-background transition-colors duration-200", isLastSlide && "opacity-50 cursor-not-allowed"]} onclick={next} disabled={isLastSlide} aria-label="Next slide">
		<ChevronRightIcon class="size-6" />
	</button>

	<!-- Indicators -->
	<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
		{#each items as _, i}
			<button class={["w-2 h-2 rounded-full transition-all duration-200", currentIndex === i ? "bg-primary w-4" : "bg-primary/50"]} onclick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`} />
		{/each}
	</div>
</div>

