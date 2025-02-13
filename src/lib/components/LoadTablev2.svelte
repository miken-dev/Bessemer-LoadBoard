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
		'december'
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
								class="mx-7 grid grid-cols-2 justify-items-start gap-5 py-5 align-top md:grid-cols-3 lg:grid-cols-5"
							>
								<!-- Origin -->
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Load Date</div>
									<div class="mt-1 text-sm">
										{`${day[new Date(row.loadDate).getDay()]} ${month[new Date(row.loadDate).getMonth()]} ${new Date(row.loadDate).getDate()}${dateOrdinals(new Date(row.loadDate).getDate())} ${new Date(row.loadDate).getFullYear()}`}
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
										{`${day[new Date(row.deliveryDate).getDay()]} ${month[new Date(row.deliveryDate).getMonth()]} ${new Date(row.deliveryDate).getDate()}${dateOrdinals(new Date(row.deliveryDate).getDate())} ${new Date(row.deliveryDate).getFullYear()}`}
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
										{`${row.lengthFeet}'${row.lengthInches}" x ${row.widthFeet}'${row.widthInches}" x ${row.heightFeet}'${row.heightInches}" x ${row.weightInPounds}lbs.`}
									</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Commodity</div>
									<div class="mt-1 text-sm">{row.commodity}</div>
								</div>
								<!-- Revenue/Miles -->
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Revenue</div>
									<div class="mt-1 text-sm">{row.revenue}</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Miles</div>
									<div class="mt-1 text-sm">{row.miles}</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Agent</div>
									<div class="mt-1 text-sm">AGENT NAME</div>
								</div>
								<div>
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Phone #</div>
									<div class="mt-1 text-sm">{row.terminalPhone}</div>
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
