<script lang="ts">
	import DrawerDetails from './DrawerDetails.svelte';
	import DrawerCarousel from './DrawerCarousel.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { onMount } from 'svelte';

	import { Drawer, Hr, Button, CloseButton } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import type { TableDataTypes } from '$lib/types';
	let {
		tableData,
		selectedCity,
		selectedState,
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked,
		multipleLoads,
		loggedIn
	}: {
		tableData: any;
		selectedCity: string | null;
		selectedState: string | null;
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
		multipleLoads: boolean;
		loggedIn: boolean;
	} = $props();

	let isSingleRow = () => {
		tableData.length === 1;
	};
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let transitionParamsDesktop = {
		y: 320,
		duration: 200,
		easing: sineIn
	};
	const desktop = new MediaQuery('min-width: 1100px');

	// Prevent background scrolling when drawer is open on mobile
	$effect(() => {
		if (!desktop.current) {
			if (!detailsHidden) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});

	// Cleanup on component destroy
	onMount(() => {
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if !desktop.current}
	<div class="outerContainer">
		<Drawer
			transitionType="fly"
			{transitionParams}
			bind:hidden={detailsHidden}
			class="w-100 mobile"
			id="loadDetailsDrawerMobile"
			backdrop={true}
		>
			<div class="fixed top-0">
				<CloseButton on:click={() => (detailsHidden = true)} class="mb-4, dark:text-white" />
			</div>
			{#if tableClicked || !multipleLoads}
				<div class="my-4">
					{#each tableData as data}
						{#if data.loadID === selectedRow}
							<DrawerDetails {data} horizontal={false} {loggedIn}/>
						{/if}
					{/each}
				</div>
			{:else}
				<div class="container px-0">
					<p class="text-center text-lg">
						Multiple loads available in <strong>{selectedCity}, {selectedState}</strong>
					</p>
					<div
						class="my-4 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"
					></div>
					<DrawerCarousel>
						{#each tableData as data}
							{#if data.originCityName === selectedCity}
								<DrawerDetails {data} horizontal={false} {loggedIn}/>
							{/if}
						{/each}
					</DrawerCarousel>
				</div>
			{/if}
		</Drawer>
	</div>
{/if}
{#if desktop.current}
	<Drawer
		placement="bottom"
		transitionType="fly"
		transitionParams={transitionParamsDesktop}
		bind:hidden={detailsHidden}
		class="desktop w-full"
		id="loadDetailsDrawerDesktop"
	>
		<CloseButton on:click={() => (detailsHidden = true)} class="mb-4, dark:text-white" />

		<div class="w-100 container">
			{#if tableClicked || !multipleLoads}
				{#each tableData as data}
					{#if data.loadID === selectedRow}
						<DrawerDetails {data} horizontal={true} {loggedIn}/>
					{/if}
				{/each}
			{:else}
				<div class="w-full">
					<p class="text-center text-3xl">
						Multiple loads available near <strong>{selectedCity}, {selectedState}</strong>
					</p>
					<div
						class="my-12 h-2 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"
					></div>
				</div>
				<br />
				<div class="w-full">
					<DrawerCarousel>
						{#each tableData as data}
							{#if data.originCityName === selectedCity}
								<div class="w-dvw">
									<DrawerDetails {data} horizontal={true} {loggedIn} />
								</div>
							{/if}
						{/each}
					</DrawerCarousel>
				</div>
			{/if}
		</div>
	</Drawer>
{/if}

<style>
	.outerContainer {
		width: 100vw;
	}
	@media screen and (min-width: 1101px) {
		.container {
			width: dvw;
		}
	}
	@media screen and (max-width: 1100px) {
		.container {
			width: 490px;
		}
	}
	@media screen and (max-width: 900px) {
		.container {
			width: 490px;
		}
	}
	@media screen and (max-width: 600px) {
		.container {
			width: 390px;
		}
	}
	@media screen and (max-width: 400px) {
		.container {
			width: 310px;
		}
	}
	@media screen and (max-width: 300px) {
		.container {
			width: 280px;
		}
	}
</style>
