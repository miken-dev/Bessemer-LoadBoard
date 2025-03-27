<script lang="ts">
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';

	let {
		contactInfoPreferencesModal = $bindable(),
		email,
		text,
		userId
	}: {
		contactInfoPreferencesModal: boolean;
		email: boolean;
		text: boolean;
		userId: string | null;
	} = $props();
	let userInfo = $state();
	let phoneNumber = $state('');
	let emailAddress = $state('');

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getUserInfo() {
		const user = await PB.collection('driver').getOne(userId);

		emailAddress = user.email;
		phoneNumber = user.phone;
		return user;
	}

	onMount(async () => {
		userInfo = await getUserInfo();
		emailAddress = userInfo.email;
		phoneNumber = userInfo.phone;
	});

	async function save() {
		const record = await PB.collection('driver').update(userId, {
			phone: `${phoneNumber}`,
			email: `${emailAddress}`
		});
	}

	function saveButtonEnable(): boolean {
		// Helper function to validate email format
		const isValidEmail = (email: string) => {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		};

		// Helper function to validate phone format (accepts formats like: 123-456-7890, (123) 456-7890, 1234567890)
		const isValidPhone = (phone: string) => {
			return /^\+?[\d\s-()]{10,}$/.test(phone);
		};

		// If no notifications are enabled, only name is required

		// Check if user has existing email or valid new email
		const hasValidNewEmail = emailAddress && isValidEmail(emailAddress);

		if (!hasValidNewEmail) {
			return false;
		}

		// Check text notification requirements
		// Check if user has existing phone or valid new phone
		const hasValidNewPhone = phoneNumber && isValidPhone(phoneNumber);

		if (!hasValidNewPhone) {
			return false;
		}

		// All checks passed
		return true;
	}
</script>

<Modal
	title="Notification Preferences"
	size="sm"
	bind:open={contactInfoPreferencesModal}
	autoclose
	outsideclose
>
	<Label for="email" class="mb-2 block">Email Address</Label>
	<Input id="email" placeholder="" bind:value={emailAddress} />

	<Label for="phone" class="mb-2 block">Phone Number</Label>
	<Input id="phone" placeholder="" bind:value={phoneNumber} />
	{#if !saveButtonEnable()}
		<Button size="md" color="alternative" disabled>Save</Button>
	{:else}
		<Button
			size="md"
			color="blue"
			onclick={async () => {
				await save();
			}}>Save</Button
		>
	{/if}
	<Button size="md" color="alternative">Cancel</Button>
</Modal>
