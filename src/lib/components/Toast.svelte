<script lang="ts">
	import { Toast } from 'flowbite-svelte'
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
</script>

<Toast dismissable={false} contentClass="flex space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700">
	<ExclamationCircleSolid class="w-5 h-5 text-red-600"
	<div class="ps-4 text-sm font-normal">Error: Couldn't save your search</div>
</Toast>
