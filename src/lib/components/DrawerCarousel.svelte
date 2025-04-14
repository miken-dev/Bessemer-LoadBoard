<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

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

	// Navigation function
	function goToSlide(index: number) {
		if (!container || isAnimating || index < 0 || index >= totalSlides) return;

		isAnimating = true;
		currentIndex = index;

		// Calculate exact scroll position
		const scrollPosition = index * container.clientWidth;
		container.scrollTo({
			left: scrollPosition,
			behavior: 'smooth'
		});

		// Reset isAnimating after transition
		setTimeout(() => {
			isAnimating = false;
		}, 300);
	}

	function next() {
		if (currentIndex < totalSlides - 1) {
			goToSlide(currentIndex + 1);
		}
	}

	function prev() {
		if (currentIndex > 0) {
			goToSlide(currentIndex - 1);
		}
	}

	// Prevent scroll jump when window resizes
	let resizeTimer: number;
	function handleResize() {
		if (!container) return;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			goToSlide(currentIndex);
		}, 100);
	}
</script>

<div class="group relative">
	<!-- Carousel container -->
	<div
		bind:this={container}
		class="grid auto-cols-[100%] grid-flow-col overflow-x-hidden scroll-smooth"
	>
		<!-- Render children with wrapper -->
		{@render children()}
	</div>

	{#if totalSlides > 1}
		<!-- Navigation controls wrapper - Fixed to viewport -->
		<div
			class="pointer-events-none fixed left-0 right-0 top-1/2 z-50 -translate-y-1/2 md:top-3/4"
			transition:fade
		>
			<div class="container relative mx-auto px-4">
				<!-- Previous button -->
				<button
					onclick={prev}
					class="pointer-events-auto absolute left-0 rounded-full bg-background/80 p-2 opacity-50 shadow-lg transition-opacity hover:bg-background disabled:opacity-30 group-hover:opacity-100"
					disabled={currentIndex === 0 || isAnimating}
				>
					<ChevronLeftIcon class="size-6" />
				</button>

				<!-- Next button -->
				<button
					onclick={next}
					class="pointer-events-auto absolute right-0 rounded-full bg-background/80 p-2 opacity-50 shadow-lg transition-opacity hover:bg-background disabled:opacity-30 group-hover:opacity-100"
					disabled={currentIndex === totalSlides - 1 || isAnimating}
				>
					<ChevronRightIcon class="size-6" />
				</button>
			</div>
		</div>

		<!-- Indicators -->
		<div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
			{#each Array(totalSlides) as _, i}
				<button
					onclick={() => goToSlide(i)}
					disabled={isAnimating}
					class={[
						'h-2 w-2 rounded-full transition-all',
						currentIndex === i ? 'bg-primary' : 'bg-primary/30',
						'hover:bg-primary/60'
					]}
				/>
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
