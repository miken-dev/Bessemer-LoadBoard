<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		ImagePlaceholder,
		Modal
	} from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	import type LoadTableDetail from './LoadTableDetail.svelte';
	import type { TableDataTypes } from '$lib/types';


	// component props
	let {
		tabledata,
		selectedrow = $bindable(),
		detailshidden = $bindable(),
		tableclicked = $bindable(),
	}: {
		tabledata: TableDataTypes[];
		selectedrow: number | null;
		detailshidden: boolean;
		tableclicked: boolean;
	} = $props();

<Table>
	<TableHead>
		<TableHeadCell>Load Date:<br />Origin:</TableHeadCell>
		<TableHeadCell>Delivery Date:<br />Destination:</TableHeadCell>
		<TableHeadCell>Dimensions:<br />Commodity:</TableHeadCell>
		<TableHeadCell>Revenue:<br />Miles:</TableHeadCell>
		<TableHeadCell>Agent:<br />Phone #:</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each items as item, i}
			<TableBodyRow on:click={() => toggleRow(i)}>
				<TableBodyCell>
					<LoadTableRow
						firstRow={item.loadDate}
						secondRow={`${item.OriginCityName}, ${item.OriginStateName}`}
					/>
				</TableBodyCell>
	const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
	const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
	const dateordinals = (d: number) => {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
			default: return "th";
		}
	}
	const toggle = (id: number) => {
		selectedrow = id;
		detailshidden = false 
		tableclicked = true
	}
</script>

				<TableBodyCell>
					<LoadTableRow
						firstRow={item.DeliveryDate}
						secondRow={`${item.DestinationCityName}, ${item.DestinationStateName}`}
					/>
				</TableBodyCell>

				<TableBodyCell>
					<LoadTableRow
						firstRow={`${item.LengthFeet}'${item.LengthInches}" - ${item.WidthFeet}'${item.WidthInches}" x ${item.HeightFeet}'${item.HeightInches}" x ${item.WeightInPounds}lbs`}
						secondRow={item.Commodity}
					/>
				</TableBodyCell>

				<TableBodyCell>
					<LoadTableRow
						firstRow={`$${item.Revenue}`}
						secondRow={item.Miles}
					/>
				</TableBodyCell>
				<TableBodyCell>
					<LoadTableRow
						firstRow={item.Agent}
						secondRow={item.AgentPhone}
					/>
				</TableBodyCell>
			</TableBodyRow>
			{#if openRow === i}
				<TableBodyRow
					on:dblclick={() => {
						doubleClickModal = true;
						details = item;
					}}
				>
					<TableBodyCell class="p-0">
						<div class="px-2 py-3" transition:slide={{ duration: 300, axis: 'y' }}>
							<ImagePlaceholder />
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		{/each}
	</TableBody>
</Table>
<Modal title="Modal Name" bind:open={doubleClickModal} autoclose outsideclose>
	<ImagePlaceholder />
</Modal>
