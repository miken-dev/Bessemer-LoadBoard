<script lang="ts">
	import { DarkMode, ButtonGroup, Button } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	import { dev } from '$app/environment';
	import logo from '$lib/assets/logo.png';
	let {
		loggedIn = $bindable(),
		userID = $bindable()
	}: {
		loggedIn: Boolean;
		userID: number | null;
	} = $props();

	let logout = () => {
		loggedIn = false;
		userID = null;
		document.cookie = 'dds_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		invalidateAll;
		location.replace("https://operator.ddsexpress.com/wp-login.php?action=logout")
	};

	let devLogin = () => {
		document.cookie = 'dds_user_id=1234567';
		invalidateAll;
		location.reload();
	};
</script>

<div class="flex w-screen items-center justify-between border-b-4 border-sky-400 p-5">
	<div>
		<img class="w-1/2" alt="DD&S Express Logo" src={logo} />
	</div>
	<div class="flex">
		<DarkMode class="pt-2 dark:text-gray-100" />
		{#if dev}
			<Button on:click={devLogin} color="blue">Log in (DEV)</Button>
		{/if} 
		{#if loggedIn}
			<Button size="sm" class="whitespace-nowrap" on:click={logout} color="blue">Log Out</Button>
		{:else}
			<Button href="https://operator.ddsexpress.com/user-login/" class="whitespace-nowrap" color="blue">Log In</Button>
		{/if}
	</div>
</div>
