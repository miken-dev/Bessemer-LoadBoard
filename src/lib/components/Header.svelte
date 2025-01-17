<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="flex w-screen items-center justify-between bg-blue-600 p-5">
	<div>
		<img src="https://placehold.co/300x70/ff00ff/ffffff" />
	</div>
	<div>
		<button class="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>Equipment Search</button
		>
		<DarkMode dark:text-gray-100 />
	</div>
</div>
