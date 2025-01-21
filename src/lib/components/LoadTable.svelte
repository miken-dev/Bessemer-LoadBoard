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
