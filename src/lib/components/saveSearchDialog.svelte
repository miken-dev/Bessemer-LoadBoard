<script lang="ts">
	import type { savedSearchesTypes } from '$lib/types';
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	let {
		saveSearchDialogIsShowing = $bindable(),
		savedSearches = $bindable(),
		userId,
		originMilesFilter = $bindable(),
		originStateFilter = $bindable(),
		originCityFilter = $bindable(),
		destMilesFilter = $bindable(),
		destCityFilter = $bindable(),
		destStateFilter = $bindable(),
		trailerTypesFilter = $bindable(),
		fromDateRange = $bindable(),
		toDateRange = $bindable()
	}: {
		saveSearchDialogIsShowing: boolean;
		savedSearches: [savedSearchesTypes] | [];
		userId: string | null;
		originMilesFilter: number | undefined;
		originStateFilter: string | undefined;
		originCityFilter: string | undefined;
		destMilesFilter: number | undefined;
		destCityFilter: string | undefined;
		destStateFilter: string | undefined;
		trailerTypesFilter: string | undefined;
		fromDateRange: Date | undefined;
		toDateRange: Date | undefined;
	} = $props();
	let name: string = $state('');
	let emailNotification: boolean = $state(true);
	let textNotification: boolean = $state(true);
	let userInfo = $state();

	let emailAddress = $state('');
	let phoneNumber = $state('');
	let error = $state('');
	const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
	async function getUserInfo() {
		const user = await PB.collection('driver').getOne(userId);

		emailAddress = user.email;
		phoneNumber = user.phone;
		return user;
	}

	async function saveUserInfo(userId: string, emailAddress: string, phoneNumber: string) {
		const userInfo = await PB.collection('driver').update(userId, {
			phone: phoneNumber,
			email: emailAddress
		});
	}

	async function checkIfUserExistsPB(userId: string | null) {
		await PB.collection('driver').create({
			id: `${userId}`
		});
	}
	onMount(async () => {
		userInfo = await getUserInfo();
	});

	function checkSavedSearchName(name: String): Boolean {
		for (const savedSearch in savedSearches) {
			if (savedSearch.name === name) {
				error = 'Please enter a unique name';
				return false;
			}
		}
		error = '';
		return true;
	}
	async function updateSavedSeachList() {
		const records = await PB.collection('Saved_Searches').getFullList({
			filter: `userID = "${userId}"`
		});
		const results: [savedSearchesTypes] = records.map((record) => {
			return {
				id: record.id,
				name: record.name,
				originMiles: record.originMiles,
				originState: record.originState,
				originCity: record.originCity,
				destMiles: record.destMiles,
				destState: record.destState,
				destCity: record.destCity,
				pickupDateStart: record.pickupDateStart,
				pickupDateEnd: record.pickupDateEnd,
				trailerType: record.trailerType,
				emailNotification: record.emailNotification,
				textNotification: record.textNotification
			};
		});

		return results.reverse();
	}

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
		try {
			await checkIfUserExistsPB(userId);
		} catch {}
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
		savedSearches = await updateSavedSeachList();
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

		for (const savedSearch of savedSearches) {
			if (savedSearch.name === name) {
				error = 'Please enter a unique name';
				return false;
			}
		}
		error = '';
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
		return true;
		// All checks passed
		return true;
	}
</script>

<Modal title="Name your saved search" size="md" bind:open={saveSearchDialogIsShowing} autoclose>
	<Label for="name" class="mb-2 block">Name your saved search</Label>
	<Input id="name" placeholder="" bind:value={name} />
	<p class="text-red-500">{error}</p>
	<div>Notifications</div>
	<div class="flex h-14 items-center gap-6">
		<Toggle color="blue" bind:checked={emailNotification}>Email</Toggle>
		{#if emailNotification && !userInfo.email}
			<div>
				<Label for="emailAddress" class="mb-2 block">Email Address</Label>

				<Input id="emailAddress" placeholder="" bind:value={emailAddress} />
			</div>
		{/if}
	</div>
	<div class="flex h-14 items-center gap-6">
		<Toggle color="blue" bind:checked={textNotification}>Text Messages</Toggle>
		{#if textNotification && !userInfo.phone}
			<div>
				<Label for="phoneNumber" class="mb-2 block">Phone Number</Label>
				<Input id="phoneNumber" placeholder="" bind:value={phoneNumber} />
			</div>
		{/if}
	</div>

	{#if !saveButtonEnable()}
		<Button size="md" color="alternative" disabled>Save</Button>
	{:else}
		<Button
			size="md"
			color="blue"
			onclick={async () => {
				await saveSearch(
					name,
					originMilesFilter,
					originStateFilter,
					originCityFilter,
					destMilesFilter,
					destStateFilter,
					destCityFilter,
					fromDateRange,
					toDateRange,
					trailerTypesFilter,
					emailNotification,
					textNotification,
					userId
				);
				if (emailAddress || phoneNumber) {
					await saveUserInfo(userId, emailAddress, phoneNumber);
				}
			}}>Save</Button
		>
	{/if}
	<Button size="md" color="alternative" onclick={() => {
		name = ""
		emailNotification = false
		textNotification = false
	}}>Cancel</Button>
</Modal>
