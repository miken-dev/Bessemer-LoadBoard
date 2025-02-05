<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import  logo  from '$lib/assets/logo.png'
</script>

<div class="flex w-screen items-center justify-between border-b-4 border-sky-400 p-5">
	<div>
		<img src="{logo}" />
	</div>
	<div>
		<!--	<button class="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>Equipment Search</button
		> -->
		<DarkMode class="dark:text-gray-100" />
	</div>
</div>
