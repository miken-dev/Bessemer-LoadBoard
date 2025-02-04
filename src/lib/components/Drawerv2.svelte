<script lang="ts">
	import DrawerDetails from './DrawerDetails.svelte';
	import DrawerCarousel from './DrawerCarousel.svelte';

	import { Drawer, Hr, Button, CloseButton } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import type { TableDataTypes } from '$lib/types';
	let {
		tableData,
		selectedRow = $bindable(),
		detailsHidden = $bindable(),
		tableClicked
	}: {
		tableData: TableDataTypes[];
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
	} = $props();

	let isSingleRow = () => {
		tableData.length === 1;
	}
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	let selectedCity = $state('');
	let selectedState = $state('');

	function singleItem(data: any) {
		if(data.length === 1) {
			return true
		} 
		return false
	}

</script>

<Drawer
	transitionType="fly"
	{transitionParams}
	bind:hidden={detailsHidden}
	class="w-100"
	id="loadDetailsDrawerMobile"
>
	<CloseButton on:click={() => (detailsHidden = true)} class="mb-4, dark:text-white" />
	{#if tableClicked || singleItem(tableData)}
		<DrawerDetails data={tableData[0]} />
	{:else}
		<DrawerCarousel items={tableData}>
			{#snippet content({ tableData })}
				<DrawerDetails {...tableData} /> 
			{/snippet}
		</DrawerCarousel>
	{/if}
</Drawer>
