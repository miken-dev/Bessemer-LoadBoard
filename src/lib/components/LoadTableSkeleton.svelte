<script lang="ts">
	import type { TableDataTypes } from '$lib/types';
	import { cn } from '$lib/utils';
	import Skeleton from './Skeleton.svelte';

	let rows = [1, 2, 3, 4, 5, 6];
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
			{#each rows as row, index}
				<!-- Combined row with all data -->
				<tr
					class={cn(
						'cursor-pointer transition-colors',
						index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-sky-100 dark:bg-sky-900'
					)}
				>
					<td>
						<div class="space-y-4 px-8 py-3">
							<div
								class="mx-7 grid grid-cols-2 justify-items-start gap-16 py-5 align-top md:grid-cols-5 lg:grid-cols-5"
							>
								<!-- Origin -->
								<div class="min-w-full">
									<div class="min-w-auto text-xs font-medium text-gray-500 dark:text-gray-300">Load Date</div>
									<div>
										<Skeleton />
									</div>
								</div>
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Origin</div>
									<div class="text-sm mt-auto mb-5">
										<Skeleton />
									</div>
								</div>
								<!-- Destination -->
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">
										Delivery Date
									</div>
									<div class="mt-1 text-sm">
										<Skeleton />
									</div>
								</div>
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">
										Destination
									</div>
									<div class="mt-1 text-sm">
										<Skeleton />
									</div>
								</div>
								<!-- Dimensions/Commodity -->
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Dimensions</div>
									<div class="mt-1 text-sm">
										<Skeleton />
									</div>
								</div>
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">
										Trailer Types
									</div>
									<div class="mt-1 text-sm"><Skeleton /></div>
								</div>
								<!-- Revenue/Miles -->
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Revenue</div>
									<div class="mt-1 text-sm"><Skeleton /></div>
								</div>
								<div class="min-w-full">
									<div class="min-w-auto text-xs font-medium text-gray-500 dark:text-gray-300">Miles</div>
									<div class="mt-1 text-sm">
										<Skeleton />
									</div>
								</div>
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Agent</div>
									<div class="mt-1 text-sm">AGENT NAME</div>
								</div>
								<div class="min-w-full">
									<div class="text-xs font-medium text-gray-500 dark:text-gray-300">Phone #</div>
									<div class="mt-1 text-sm"><Skeleton /></div>
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

