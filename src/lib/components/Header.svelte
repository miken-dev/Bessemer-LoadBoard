<script lang="ts">
	import { DarkMode, ButtonGroup, Button } from 'flowbite-svelte';
	import { dev } from '$app/environment'
	import logo from '$lib/assets/logo.png';
	let {
		loggedIn = $bindable()
	}: {
		loggedIn: Boolean;
	} = $props();

	let logout = () => {
		loggedIn = false
		console.log("Logged out")
		// TODO: add logout logic
	let devLogin = () => {
		document.cookie = "dds_user_id=5244833"
	}
</script>

<div class="flex w-screen items-center justify-between border-b-4 border-sky-400 p-5">
	<div>
		<img src={logo} />
	</div>
	<div>
		<!--	<button class="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>Equipment Search</button
		> -->
		<DarkMode class="dark:text-gray-100 pt-2" />
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
