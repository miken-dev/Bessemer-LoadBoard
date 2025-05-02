<script lang="ts">
	import type { TableDataTypes } from '$lib/types';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import Skeleton from './Skeleton.svelte';
	import { Spinner } from 'flowbite-svelte';

	let loadFailed = $state(false)
	let rows = [1, 2, 3, 4, 5, 6];
	
	let title=$props()

	onMount(async () => {
		setTimeout(() => {
			loadFailed = true
		}, 1500)
	})

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
{#if !loadFailed}
<div
	class="w-full overflow-x-auto rounded-lg  shadow-sm dark:bg-gray-800 dark:text-gray-100"
>
	<div class="w-full divide-y divide-gray-200">
		<div class="flex h-full w-full flex-col justify-around align-middle m-auto">
			<Spinner color="blue" class="m-auto"/>
		</div>
	</div>
</div>
{:else if loadFailed }
	<div class="flex w-full md:w-96 flex-col justify-around text-4xl">
		<h3 class="text-center">No loads available</h3>
	</div>
{/if}

