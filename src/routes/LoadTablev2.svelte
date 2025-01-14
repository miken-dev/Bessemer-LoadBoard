<script lang="ts">
	import { slide } from "svelte/transition";
	import { ChevronDown } from "lucide-svelte";
	import type { TableData } from "./types.js";
	import { cn } from "$lib/utils";

	// Component props
	let {
		tableData,
		selectedRow,
		toggleDetails,
	}: {
		tableData: TableData[];
		selectedRow: string | null;
		toggleDetails: (id: string) => void;
	} = $props();
</script>

<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
	<table class="w-full divide-y divide-gray-200">
		<tbody class="divide-y divide-gray-200 bg-white">
			{#each tableData as row, index}
				<!-- Combined row with all data -->
				<tr class={cn("transition-colors cursor-pointer", index % 2 === 0 ? "bg-white" : "bg-gray-50", selectedRow === row.id && "bg-blue-50 hover:bg-blue-50", selectedRow !== row.id && "hover:bg-gray-100")} onclick={() => toggleDetails(row.id)}>
					<td class="w-10 pl-4">
						<div class="h-full flex items-center">
							<ChevronDown class={cn("w-4 h-4 transition-transform", selectedRow === row.id && "rotate-180")} />
						</div>
					</td>
					<td>
						<div class="py-3 space-y-4">
							<!-- First row data -->
							<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
								<div>
									<div class="text-xs text-gray-500 font-medium">ID</div>
									<div class="text-sm mt-1">{row.id}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Name</div>
									<div class="text-sm mt-1 font-medium">{row.name}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Status</div>
									<div class="text-sm mt-1">{row.status}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Category</div>
									<div class="text-sm mt-1">{row.category}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Priority</div>
									<div class="text-sm mt-1">{row.priority}</div>
								</div>
							</div>
							<!-- Second row data -->
							<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
								<div>
									<div class="text-xs text-gray-500 font-medium">Created</div>
									<div class="text-sm mt-1">{row.created}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Updated</div>
									<div class="text-sm mt-1">{row.updated}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Owner</div>
									<div class="text-sm mt-1">{row.owner}</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 font-medium">Progress</div>
									<div class="text-sm mt-1">{row.progress}%</div>
								</div>
							</div>
						</div>
					</td>
				</tr>
				<!-- Expanded details section -->
				{#if selectedRow === row.id}
					<tr transition:slide>
						<td colspan="2" class="bg-gray-50">
							<div class="p-4 md:p-6">
								<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Description</h4>
										<p class="text-sm mt-1">{row.details.description}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Department</h4>
										<p class="text-sm mt-1">{row.details.department}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Budget</h4>
										<p class="text-sm mt-1">${row.details.budget}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Location</h4>
										<p class="text-sm mt-1">{row.details.location}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Team Size</h4>
										<p class="text-sm mt-1">{row.details.teamSize}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Start Date</h4>
										<p class="text-sm mt-1">{row.details.startDate}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">End Date</h4>
										<p class="text-sm mt-1">{row.details.endDate}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Risk Level</h4>
										<p class="text-sm mt-1">{row.details.riskLevel}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Phase</h4>
										<p class="text-sm mt-1">{row.details.phase}</p>
									</div>
									<div>
										<h4 class="text-sm font-semibold text-gray-600">Status Notes</h4>
										<p class="text-sm mt-1">{row.details.statusNotes}</p>
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

