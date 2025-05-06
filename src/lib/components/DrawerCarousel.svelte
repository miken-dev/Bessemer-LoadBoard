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

<div class="group relative grid h-full grid-cols-[auto_1fr_auto]">

	<!-- Left navigation -->
	{#if totalSlides > 1}
		<div class="sticky top-0 flex h-screen items-center md:h-1/2">
			<button
				onclick={prev}
				class="pointer-events-auto z-50 rounded-full bg-background/80 p-2 opacity-50 shadow-lg transition-opacity hover:bg-background disabled:opacity-30 group-hover:opacity-100"
				disabled={currentIndex === 0 || isAnimating}
			>
				<ChevronLeftIcon class="size-6" />
			</button>
		</div>
	{/if}

	<!-- Carousel container -->
	<div
		bind:this={container}
		class="grid auto-cols-[100%] grid-flow-col overflow-x-hidden scroll-smooth"
	>
		<!-- Render children with wrapper -->
		{@render children()}
	</div>

	<!-- Right navigation -->
	{#if totalSlides > 1}
		<div class="sticky top-0 flex h-screen items-center md:h-1/2">
			<button
				onclick={next}
				class="pointer-events-auto z-50 rounded-full bg-background/80 p-2 opacity-50 shadow-lg transition-opacity hover:bg-background disabled:opacity-30 group-hover:opacity-100"
				disabled={currentIndex === totalSlides - 1 || isAnimating}
			>
				<ChevronRightIcon class="size-6" />
			</button>
		</div>
	{/if}

	<!-- Indicators -->
	{#if totalSlides > 1}
		<div class="absolute bottom-2 left-1/2 col-span-3 flex -translate-x-1/2 gap-2">
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

	@media screen and (min-width: 1101px) {
		:global(.container) {
			width: 100%;
		}
	}
	@media screen and (max-width: 1100px) {
		:global(.container) {
			width: 490px;
		}
	}
	@media screen and (max-width: 900px) {
		:global(.container) {
			width: 490px;
		}
	}
	@media screen and (max-width: 600px) {
		:global(.container) {
			width: 390px;
		}
	}
	@media screen and (max-width: 400px) {
		:global(.container) {
			width: 310px;
		}
	}
	@media screen and (max-width: 300px) {
		:global(.container) {
			width: 280px;
		}
	}
</style>
