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
		console.log('Logged out');
		document.cookie = 'dds_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		invalidateAll;
		location.replace("https://operator.ddsexpress.com/wp-login.php?action=logout")
	};

	let devLogin = () => {
		document.cookie = 'dds_user_id=5244833';
		invalidateAll;
		location.reload();
	};
</script>

<div class="flex w-screen items-center justify-between border-b-4 border-sky-400 p-5">
	<div>
		<img src={logo} />
	</div>
	<div>
		<!--	<button class="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>Equipment Search</button
		> -->
		<DarkMode class="pt-2 dark:text-gray-100" />
		{#if dev}
			<Button on:click={devLogin} color="blue">Log in (DEV)</Button>
		{/if}
		{#if loggedIn}
			<Button on:click={logout} color="blue">Log Out</Button>
		{:else}
			<Button href="https://operator.ddsexpress.com/user-login/" color="blue">Log In</Button>
		{/if}
	</div>
</div>
