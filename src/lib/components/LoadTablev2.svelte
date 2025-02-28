<script lang="ts">
	import type { TableDataTypes } from '$lib/types';
	import { cn } from '$lib/utils';

	// component props
	let {
		tableData,
		selectedRow = $bindable(),
		selectedCity = $bindable(),
		detailsHidden = $bindable(),
		tableClicked = $bindable(),
		loggedIn
	}: {
		tableData: TableDataTypes[];
		selectedCity: string | null;
		selectedRow: number | null;
		detailsHidden: boolean;
		tableClicked: boolean;
		loggedIn: boolean;
	} = $props();

	const month = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dateOrdinals = (d: number) => {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};
	const toggle = (id: number, city: string) => {
		selectedRow = id;

		detailsHidden = false;
		tableClicked = true;
	};

	
	function numberWithCommas(number: number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}


</script>

<!--
<label for="sort">Sort by:</label>
<select name="sort" id="sort">
	<option value="">Load Date</option>
	<option value="">Delivery Date</option>
	<option value="">Weight</option>
	<option value="">Revenue</option>
	<option value="">Miles</option>
</select> -->
<div
	class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:text-gray-100"
>
	<table class="w-full divide-y divide-gray-200">
		<tbody class="divide-y divide-gray-200 bg-white">
			{#each tableData as row, index}
				<!-- Combined row with all data -->
				<tr
					onclick={() => toggle(row.loadID, row.originCityName)}
					class={cn(
						'cursor-pointer transition-colors',
						index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-sky-100 dark:bg-sky-900',
						selectedRow === row.loadID && 'bg-blue-50 hover:bg-blue-50',
						selectedRow !== row.loadID && 'hover:bg-gray-100'
					)}
				>
					<td>
						<div class="space-y-4 py-3">
							<div
								class="mx-7 grid grid-cols-2 justify-items-start gap-2 py-2 align-top md:grid-cols-3 lg:grid-cols-5"
							>
								<!-- Origin -->
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Load Date</div>
									<div class="mt-1 text-sm">
										{`${new Date(row.loadDate).getMonth() + 1}/${new Date(row.loadDate).getDate()}/${new Date(row.loadDate).getFullYear()}`}
									</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Origin</div>
									<div class="mt-1 text-sm">
										{`${row.originCityName}, ${row.originStateName}`}
									</div>
								</div>
								<!-- Destination -->
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">
										Delivery Date
									</div>
									<div class="mt-1 text-sm">
										{`${new Date(row.deliveryDate).getMonth() + 1}/${new Date(row.deliveryDate).getDate()}/${new Date(row.deliveryDate).getFullYear()}`}
									</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">
										Destination
									</div>
									<div class="mt-1 text-sm">
										{`${row.destinationCityName}, ${row.destinationStateName}`}
									</div>
								</div>
								<!-- Dimensions/Commodity -->
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Dimensions</div>
									<div class="mt-1 text-sm">
										{#if row.lengthFeet === 0 && row.lengthInches === 0 && row.widthFeet === 0 && row.widthInches === 0 && row.heightFeet === 0 && row.heightInches === 0}
											Not available
										{:else}
											{`${row.lengthFeet}'${row.lengthInches}" x ${row.widthFeet}'${row.widthInches}" x ${row.heightFeet}'${row.heightInches}"`}
										{/if}
									</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">
										Trailer Types
									</div>
									<div class="mt-1 text-sm">{row.trailerTypes}</div>
								</div>
								<!-- Revenue/Miles -->
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Revenue</div>
									<div class="mt-1 text-sm">${numberWithCommas(row.revenue)}</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Miles</div>
									<div class="mt-1 text-sm">
										{#if row.miles == 0 || row.miles === -1}
											Not Available
										{:else}
											{numberWithCommas(row.miles)}
										{/if}
									</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Terminal</div>
									<div class="mt-1 text-sm">{row.terminalName}</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Phone #</div>
									<a class="mt-1 text-sm text-blue-500 underline" href="tel:+1{row.terminalPhone}">{row.terminalPhone}</a>
								</div>
							</div>
							<!-- Agent/Phone -->
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
