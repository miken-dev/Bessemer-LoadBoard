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
	let emailNotification: boolean = $state(false);
	let textNotification: boolean = $state(false);
	let userInfo = $state();

	let emailAddress = $state('');
	let phoneNumber = $state('');

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
	onMount(() => {
		return async () => (savedSearches = await updateSavedSeachList());
	});

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

		return results;
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
		console.log(userIdSearch);
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
		let result = false;
		if (!emailNotification) {
			result = true
			console.log(0)
		}
		if (!textNotification) {
			result = true
			console.log(3)
		}
		if (!userInfo.email && !emailAddress && emailNotification) {
			result = false;
			console.log(1)
		}
		if (!userInfo.email && !emailAddress.includes('\@') && emailNotification) {
			result = false;
			console.log("2a")
		}
		if (!userInfo.email && emailAddress.includes('\@') && emailNotification) {
			result = true;
			console.log(2)
		}
		if (!userInfo.phone && !phoneNumber && textNotification) {
			result = false;
			console.log(4)
		}
		if (!userInfo.phone && phoneNumber && textNotification) {
			result = true;
			console.log(5)
		}

		if (name == '') {
			result = false;
			console.log(6)
		}
		console.log(result)
		return result;
	}
</script>

<Modal
	title="Name your saved search"
	size="md"
	bind:open={saveSearchDialogIsShowing}
	autoclose
	outsideclose
>
	<Label for="name" class="mb-2 block">Name your saved search</Label>
	<Input id="name" placeholder="" bind:value={name} />
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
	<Button size="md" color="alternative">Cancel</Button>
</Modal>
