<script lang="ts">
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	let {
		NotificationPreferencesShowing = $bindable(),
		userId,
		emailNotification,
		textNotification
	}: {
		NotificationPreferencesShowing: boolean;
		userId: string | null;
		emailNotification: boolean;
		textNotification: boolean;
	} = $props();

	let name: string = $state('');
	let userInfo;
	let originalUserInfo;

	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getUserInfo() {
		const user = await PB.collection('driver').getFullList({
			filter: `id = "${userId}"`
		});
		const result = user.map((user) => {
			return {
				id: user.id,
				phone: user.phone,
				email: user.email
			};
		});
		return result;
	}

	onMount(async () => {
		userInfo = await getUserInfo();
		originalUserInfo = userInfo;
	});
	onMount(() => {
		return () => {
			userInfo = originalUserInfo;
		};
	});

	async function saveSearch(
		nameSearch: string | undefined,
		originMilesSearch: number | undefined,
		originStateSearch: string | undefined,
		originCitySearch: string | undefined,
		destMilesSearch: number | undefined,
		destStateSearch: string | undefined,
		destCitySearch: string | undefined,
		pickupDateStartSearch: Date | undefined,
		pickupDateEndSearch: Date | undefined,
		trailerTypeSearch: string | undefined,
		emailNotificationSearch: boolean,
		textNotificationSearch: boolean,
		userIdSearch: string | null
	) {
		const search = await PB.collection('Saved_Searches').create({
			name: nameSearch,
			originMiles: originMilesSearch,
			originState: originStateSearch,
			originCity: originCitySearch,
			destMiles: destMilesSearch,
			destState: destStateSearch,
			destCity: destCitySearch,
			pickupDateStart: pickupDateStartSearch,
			pickupDateEnd: pickupDateEndSearch,
			trailerType: trailerTypeSearch,
			emailNotification: emailNotificationSearch,
			textNotification: textNotificationSearch,
			userID: userIdSearch
		});
		return search;
	}
</script>

<Modal
	title="Notification Preferences"
	size="md"
	bind:open={NotificationPreferencesShowing}
>
	<Label for="name" class="mb-2 block">Name your saved search</Label>
	<Input id="name" placeholder="" bind:value={name} />
	<div>Notifications</div>
	<div class="flex h-14 gap-6">
		<Toggle color="blue" bind:checked={emailNotification}>Email</Toggle>
	</div>
	<div class="flex h-14 gap-6">
		<Toggle color="blue" bind:checked={textNotification}>Text Messages</Toggle>
	</div>

	<Button
		size="md"
		color="blue"
		onclick={async () => {
			await saveSearch(name, emailNotification, textNotification, userId);
			NotificationPreferencesShowing = false
		}}>Save</Button
	>
	<Button
		size="md"
		color="alternative"
		on:click={async () => {
			userInfo.phone = originalUserInfo.phone;
			userInfo.email = originalUserInfo.email;
			NotificationPreferencesShowing = false
		}}>Cancel</Button
	>
</Modal>
