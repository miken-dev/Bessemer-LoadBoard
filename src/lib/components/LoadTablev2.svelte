<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { TableDataTypes } from '$lib/types';
	import { cn } from '$lib/utils';

	// Component props
	let {
		tableData,
		selectedRow,
		toggleDetails
	}: {
		tableData: TableDataTypes[];
		selectedRow: number | null;
		toggleDetails: (id: number) => void;
	} = $props();

	const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	const dateOrdinals = (d: number) => {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
			default: return "th";
		}
	}
</script>

<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
	<table class="w-full divide-y divide-gray-200">
		<tbody class="divide-y divide-gray-200 bg-white">
			{#each tableData as row, index}
				<!-- Combined row with all data -->
				<tr
					class={cn(
						'cursor-pointer transition-colors',
						index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
						selectedRow === row.loadID && 'bg-blue-50 hover:bg-blue-50',
						selectedRow !== row.loadID && 'hover:bg-gray-100'
					)}
					onclick={() => toggleDetails(row.loadID)}
				>
					<td class="w-10 pl-4">
						<div class="flex h-full items-center">
							<svg
								class={cn(
									'h-4 w-4 transition-transform',
									selectedRow === row.loadID && 'rotate-180'
								)}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</td>
					<td>
						<div class="space-y-4 py-3">
							<div class="grid grid-cols-2 space-x-7 py-5 md:grid-cols-3 lg:grid-cols-5">
								<!-- Origin -->
								<div class="stack">
									<div>
										<div class="text-xs font-medium text-gray-500">Load Date</div>
										<div class="mt-1 text-sm">{`${day[new Date(row.loadDate).getDay()]} ${month[new Date(row.loadDate).getMonth()]} ${new Date(row.loadDate).getDate()}${dateOrdinals(new Date(row.loadDate).getDate())} ${new Date(row.loadDate).getFullYear()}`}</div>
									</div>
									<div>
										<div class="text-xs font-medium text-gray-500">Origin</div>
										<div class="mt-1 text-sm">
											{`${row.originCityName}, ${row.originStateName}`}
										</div>
									</div>
								</div>
								<!-- Destination -->
								<div class="stack">
									<div>
										<div class="text-xs font-medium text-gray-500">Delivery Date</div>
										<div class="mt-1 text-sm">{`${day[new Date(row.deliveryDate).getDay()]} ${month[new Date(row.deliveryDate).getMonth()]} ${new Date(row.deliveryDate).getDate()}${dateOrdinals(new Date(row.deliveryDate).getDate())} ${new Date(row.deliveryDate).getFullYear()}`}</div>
									</div>
									<div>
										<div class="text-xs font-medium text-gray-500">Destination</div>
										<div class="mt-1 text-sm">
											{`${row.destinationCityName}, ${row.destinationStateName}`}
										</div>
									</div>
								</div>
								<!-- Dimensions/Commodity -->
								<div class="stack">
									<div>
										<div class="text-xs font-medium text-gray-500">Dimensions</div>
										<div class="mt-1 text-sm">
											{`${row.lengthFeet}'${row.lengthInches}" x ${row.widthFeet}'${row.widthInches}" x ${row.heightFeet}'${row.heightInches}" x ${row.weightInPounds}lbs.`}
										</div>
									</div>
									<div>
										<div class="text-xs font-medium text-gray-500">Commodity</div>
										<div class="mt-1 text-sm">{row.commodity}</div>
									</div>
								</div>
								<!-- Revenue/Miles -->
								<div class="stack">
									<div>
										<div class="text-xs font-medium text-gray-500">Revenue</div>
										<div class="mt-1 text-sm">{row.revenue}</div>
									</div>
									<div>
										<div class="text-xs font-medium text-gray-500">Miles</div>
										<div class="mt-1 text-sm">{row.miles}</div>
									</div>
								</div>
								<!-- Agent/Phone -->
								<div class="stack">
									<div>
										<div class="text-xs font-medium text-gray-500">Agent</div>
										<div class="mt-1 text-sm">AGENT NAME</div>
									</div>
									<div>
										<div class="text-xs font-medium text-gray-500">Phone #</div>
										<div class="mt-1 text-sm">{row.terminalPhone}</div>
									</div>
								</div>
							</div>
						</div>
					</td>
				</tr>
				<!-- Expanded details section -->
				{#if selectedRow === row.loadID}
					<tr transition:slide>
						<td colspan="2" class="bg-gray-50">
							<div class="p-4 md:p-6">
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Pieces</h4>
										<p class="mt-1 text-sm">{row.pieceCount}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">LTL</h4>
										<p class="mt-1 text-sm">{row.ltl}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Terminal</h4>
										<p class="mt-1 text-sm">${row.terminalName}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Notes</h4>
										<p class="mt-1 text-sm">{row.notes}</p>
									</div>
								</div>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
