<script lang="ts">
	import DrawerDetails from './DrawerDetails.svelte';
	import DrawerCarousel from './DrawerCarousel.svelte';
	import { MediaQuery } from 'svelte/reactivity';

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
		multipleLoads
	}: {
		tableData: any;
		selectedCity: string | null;
		selectedState: string | null;
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
		multipleLoads: boolean;
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
	const desktop = new MediaQuery('min-width: 600px');
</script>

{#if !desktop.current}
	<Drawer
		transitionType="fly"
		{transitionParams}
		bind:hidden={detailsHidden}
		class="w-100 mobile"
		id="loadDetailsDrawerMobile"
	>
		<div class="fixed top-0">
			<CloseButton on:click={() => (detailsHidden = true)} class="mb-4, dark:text-white" />
		</div>
		{#if tableClicked || !multipleLoads}
			<div class="my-4 mx-5">
			{#each tableData as data}
				{#if data.loadID === selectedRow}
					<DrawerDetails {data} horizontal={false} />
				{/if}
			{/each}
		</div>
		{:else}
			<div class="container">
				<p class="text-center text-lg">
					Multiple loads available in <strong>{selectedCity}, {selectedState}</strong>
				</p>
				<div
					class="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"
				></div>
				<DrawerCarousel>
					{#each tableData as data}
						{#if data.originCityName === selectedCity}
							<DrawerDetails {data} horizontal={false} />
						{/if}
					{/each}
				</DrawerCarousel>
			</div>
		{/if}
	</Drawer>
{/if}
{#if desktop.current}
	<Drawer
		placement="bottom"
		transitionType="fly"
		transitionParams={transitionParamsDesktop}
		bind:hidden={detailsHidden}
		class="w-full desktop"
		id="loadDetailsDrawerDesktop"
	>
		<CloseButton on:click={() => (detailsHidden = true)} class="mb-4, dark:text-white" />

		<div class="w-100 container">
			{#if tableClicked || !multipleLoads}
				{#each tableData as data}
					{#if data.loadID === selectedRow}
						<DrawerDetails {data} horizontal={true} />
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
									<DrawerDetails {data} horizontal={true} />
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
	@media screen and (min-width: 601px) {
		.container {
			width: dvw;
		}
	}
	@media screen and (max-width: 600px) {
		.container {
			width: 390px;
		}
	}
	* {

	}
</style>
