<script lang="ts">
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import PocketBase from 'pocketbase'
	import { onMount } from "svelte";
	
	let {
		contactInfoPreferencesModal = $bindable(),
		email,
		text,
		userId
	}: {
		contactInfoPreferencesModal: boolean
		email: boolean
		text: boolean
		userId: string | null
	} = $props()
	let userInfo = $state();
	let phoneNumber = $state("")
	let emailAddress = $state("")
	
	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getUserInfo() {
		const user = await PB.collection('driver').getOne(userId)

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
		})	
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
	<Button
		size="md"
		color="blue"
		onclick={async () => {
			await save()
		}}>Save</Button
	>
	<Button size="md" color="alternative">Cancel</Button>
</Modal>
