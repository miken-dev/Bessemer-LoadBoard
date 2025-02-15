<script lang="ts">
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	let {
		saveSearchDialogIsShowing = $bindable(),
		saved = $bindable(),
		userId,
		originMilesFilter = $bindable(),
		originStateFilter = $bindable(),
		originCityFilter = $bindable(),
		destMilesFilter = $bindable(),
		destCityFilter = $bindable(),
		destStateFilter = $bindable(),
		trailerTypesFilter = $bindable(),
		fromDateRange = $bindable(),
		toDateRange = $bindable(),
	}: {
		saveSearchDialogIsShowing: boolean;
		saved: boolean;
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
		console.log(userIdSearch)
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
	title="Name your saved search"
	size="md"
	bind:open={saveSearchDialogIsShowing}
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
				name, originMilesFilter, originStateFilter, originCityFilter, destMilesFilter, destStateFilter, destCityFilter, fromDateRange, toDateRange, trailerTypesFilter, emailNotification, textNotification, userId
			)	
		}}>Save</Button
	>
	<Button size="md" color="alternative">Cancel</Button>
</Modal>
