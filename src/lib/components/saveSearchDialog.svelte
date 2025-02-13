<script lang="ts">
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';

	let {
		saveSearchDialogIsShowing = $bindable(),
		saved = $bindable()
	}: {
		saveSearchDialogIsShowing: boolean;
		saved: boolean;
	} = $props();

	let name: string = $state('');
	let emailNotification: boolean = $state(false);
	let emailAddress: string = $state('');
	let textNotification: boolean = $state(false);
	let phoneNumber: string = $state('');

	function writeNewSavedSearch() {}
</script>

<Modal title="Name your saved search" size="md" bind:open={saveSearchDialogIsShowing} autoclose outsideclose>
	<Label for="name" class="mb-2 block">Name your saved search</Label>
	<Input id="name" placeholder="" />
	<div>Notifications</div>
	<div class="flex gap-6 h-14">
		<Toggle color="blue" bind:checked={emailNotification}>Email</Toggle>
		{#if emailNotification}
			<div class="flex">
				<Label for="email" class="mb-2 block">Email Address</Label>
				<Input bind:value={emailAddress} id="email" placeholder="" />
			</div>
		{/if}
	</div>
	<div class="flex gap-6 h-14">
		<Toggle color="blue" bind:checked={textNotification}>Text Messages</Toggle>
		{#if textNotification}
			<div class="flex">
				<Label for="phone" class="mb-2 block">Phone Number</Label>
				<Input bind:value={phoneNumber} id="phoneNumber" placeholder="" />
			</div>
		{/if}
	</div>

	<Button
		size="md"
		color="blue"
		onclick={() => {
			saved = true;
		}}>Save</Button
	>
	<Button size="md" color="alternative">Cancel</Button>
</Modal>
