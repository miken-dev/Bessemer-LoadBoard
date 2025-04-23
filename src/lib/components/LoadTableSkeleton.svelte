<script lang="ts">
	import type { TableDataTypes } from '$lib/types';
	import { cn } from '$lib/utils';
	import Skeleton from './Skeleton.svelte';
	import { Spinner } from 'flowbite-svelte';

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
	class="w-full overflow-x-auto rounded-lg  shadow-sm dark:bg-gray-800 dark:text-gray-100"
>
	<div class="w-full divide-y divide-gray-200">
		<div class="flex h-full w-full flex-col justify-around align-middle m-auto">
			<Spinner color="blue" class="m-auto"/>
		</div>
	</div>
</div>

