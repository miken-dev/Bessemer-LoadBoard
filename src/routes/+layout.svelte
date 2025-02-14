<script lang="ts">
	import '../app.css';
	import PocketBase from 'pocketbase'
	
	let { children } = $props();

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const userId = writable(null);
	function getUserId() {
		return document.cookie
			.split('; ')
			.find((row) => row.startsWith('dds_user_id='))
			?.split('=')[1];
	}

	onMount(() => {
		// Set initial value
		userId.set(getUserId());

		// Optional: Watch for cookie changes
		const checkCookie = setInterval(() => {
			const currentId = getUserId();
			userId.set(currentId);
		}, 1000); // Check every second

		return () => clearInterval(checkCookie);
	});
</script>

{@render children()}
