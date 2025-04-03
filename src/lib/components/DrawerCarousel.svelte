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

	// Initialize carousel and add scroll event listener
	onMount(() => {
		if (!container) return;
		totalSlides = container.children.length;

		// Update current index based on scroll position
		const handleScroll = () => {
			if (!container || isAnimating) return;

			const slideWidth = container.offsetWidth;
			const scrollPosition = container.scrollLeft;

			// Calculate current index based on scroll position
			const newIndex = Math.round(scrollPosition / slideWidth);

			// Only update if index has changed
			if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
				currentIndex = newIndex;
			}
		};

		// Add scroll event listener with debounce
		let scrollTimeout: number;
		container.addEventListener("scroll", () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(handleScroll, 50) as unknown as number;
		});

		return () => {
			if (container) {
				container.removeEventListener("scroll", handleScroll);
			}
			clearTimeout(scrollTimeout);
		};
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

	// Touch handling for better mobile experience
	let touchStart = $state(0);
	let touchEnd = $state(0);

	function handleTouchStart(e: TouchEvent) {
		touchStart = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEnd = e.changedTouches[0].screenX;
		handleSwipe();
	}

	function handleSwipe() {
		const swipeLength = touchStart - touchEnd;
		const minSwipeDistance = 50;

		if (Math.abs(swipeLength) > minSwipeDistance) {
			if (swipeLength > 0) {
				next();
			} else {
				prev();
			}
		}
	}
</script>

<div class="relative group">
	<!-- Carousel container -->
	<div bind:this={container} class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar" ontouchstart={handleTouchStart} ontouchend={handleTouchEnd}>
		<!-- Render children with wrapper -->
		{@render children()}
	</div>

	{#if totalSlides > 1}
		<!-- Navigation controls wrapper - Fixed to viewport -->
		<div class="fixed top-1/2 md:top-3/4 -translate-y-1/2 left-0 right-0 pointer-events-none z-50" transition:fade>
			<div class="container mx-auto px-4 relative">
				<!-- Previous button -->
				<button onclick={prev} class="pointer-events-auto absolute left-0 bg-background/80 p-2 rounded-full shadow-lg opacity-50 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:bg-background" disabled={currentIndex === 0 || isAnimating}>
					<ChevronLeftIcon class="size-6" />
				</button>

				<!-- Next button -->
				<button onclick={next} class="pointer-events-auto absolute right-0 bg-background/80 p-2 rounded-full shadow-lg opacity-50 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:bg-background" disabled={currentIndex === totalSlides - 1 || isAnimating}>
					<ChevronRightIcon class="size-6" />
				</button>
			</div>
		</div>

		<!-- Indicators -->
		<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
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
