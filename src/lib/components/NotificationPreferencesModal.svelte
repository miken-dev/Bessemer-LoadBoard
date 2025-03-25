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
		console.log(`${userInfo}`)
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

	function saveButtonEnable(): boolean {
		// Name is required in all cases
		if (!name) return false;

		// Helper function to validate email format
		const isValidEmail = (email: string) => {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		};

		// Helper function to validate phone format (accepts formats like: 123-456-7890, (123) 456-7890, 1234567890)
		const isValidPhone = (phone: string) => {
			return /^\+?[\d\s-()]{10,}$/.test(phone);
		};

		// If no notifications are enabled, only name is required
		if (!emailNotification && !textNotification) {
			return true;
		}

		// Check email notification requirements
		if (emailNotification) {
			// Check if user has existing email or valid new email
			const hasValidExistingEmail = userInfo?.email && isValidEmail(userInfo.email);
			const hasValidNewEmail = emailAddress && isValidEmail(emailAddress);

			if (!hasValidExistingEmail && !hasValidNewEmail) {
				return false;
			}
		}

		// Check text notification requirements
		if (textNotification) {
			// Check if user has existing phone or valid new phone
			const hasValidExistingPhone = userInfo?.phone && isValidPhone(userInfo.phone);
			const hasValidNewPhone = phoneNumber && isValidPhone(phoneNumber);

			if (!hasValidExistingPhone && !hasValidNewPhone) {
				return false;
			}
		}

		// All checks passed
		return true;
	}
</script>

<Modal
	title="Notification Preferences"
	size="md"
	bind:open={NotificationPreferencesShowing}
	autoclose
	outsideclose
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
			await saveSearch(
				name,
				emailNotification,
				textNotification,
				userId
			);
		}}>Save</Button
	>
	<Button size="md" color="alternative">Cancel</Button>
</Modal>
