<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();

	let container: HTMLElement | undefined = $state(undefined);
	let currentIndex = $state(0);
	let totalSlides = $state(0);
	let isAnimating = $state(false);

	// Initialize carousel
	onMount(() => {
		if (!container) return;
		totalSlides = container.children.length;
	});

	// Navigation functions with debouncing
	async function goToSlide(index: number) {
		if (!container || isAnimating) return;

		isAnimating = true;
		currentIndex = index;

		const targetSlide = container.children[index] as HTMLElement;
		if (!targetSlide) return;

		container.scrollTo({
			left: targetSlide.offsetLeft,
			behavior: "smooth",
		});

		// Wait for animation to complete
		await new Promise((resolve) => setTimeout(resolve, 500));
		isAnimating = false;
	}

	function next() {
		const nextIndex = currentIndex + 1;
		if (nextIndex < totalSlides) {
			goToSlide(nextIndex);
		}
	}

	function prev() {
		const prevIndex = currentIndex - 1;
		if (prevIndex >= 0) {
			goToSlide(prevIndex);
		}
	}
</script>

<div class="relative group">
	<!-- Carousel container -->
	<div bind:this={container} class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
		<!-- Render children with wrapper -->
		{@render children()}
	</div>

	{#if totalSlides > 1}
		<div transition:fade>
			<!-- Previous button -->
			<button onclick={prev} class="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:bg-background" disabled={currentIndex === 0 || isAnimating}>
				<ChevronLeftIcon class="size-6" />
			</button>

			<!-- Next button -->
			<button onclick={next} class="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:bg-background" disabled={currentIndex === totalSlides - 1 || isAnimating}>
				<ChevronRightIcon class="size-6" />
			</button>
		</div>

		<!-- Indicators -->
		<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex  gap-2">
			{#each Array(totalSlides) as _, i}
				<button onclick={() => goToSlide(i)} disabled={isAnimating} class={["w-2 h-2 rounded-full transition-all", currentIndex === i ? "bg-primary" : "bg-primary/30", "hover:bg-primary/60"]} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>

