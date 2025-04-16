<script lang="ts">
	import { Toggle, Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import PocketBase from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';

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
	let dialogElement;

	$effect(() => {
		if (contactInfoPreferencesModal) {
			dialogElement?.showModal()
		} else {
			dialogElement?.close()
		}
	})

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

	onDestroy(async () => {
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
			if (!email) return true;
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		};

		// Helper function to validate phone format (accepts formats like: 123-456-7890, (123) 456-7890, 1234567890)
		const isValidPhone = (phone: string) => {
			if (!phone) return true;
			return /^\+?[\d\s-()]{10,}$/.test(phone);
		};

		// If no notifications are enabled, only name is required

		// Check if user has existing email or valid new email
		const hasValidNewEmail = isValidEmail(emailAddress);

		if (!hasValidNewEmail) {
			return false;
		}

		// Check text notification requirements
		// Check if user has existing phone or valid new phone
		const hasValidNewPhone = isValidPhone(phoneNumber);

		if (!hasValidNewPhone) {
			return false;
		}

		// All checks passed
		return true;
	}
</script>

	<dialog
		class="relative z-10"
		bind:this={dialogElement}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				contactInfoPreferencesModal = false
			}
		}}
	>
		<!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
		<div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full  justify-center p-4 text-center items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
				>
					<div class="align-stretch bg-white px-4 pb-4 pt-5 dark:bg-gray-900 sm:p-6 sm:pb-4">
						<div class="">
							<div class="mt-3 sm:mt-0 text-left">
								<h3 class="text-base font-semibold text-gray-900 dark:text-white" id="modal-title">
									 Notification Preferences
								</h3>
								<div class="mt-2 flex flex-col gap-5">
									<div class="flex flex-col">
										<Label for="email" class="mb-2 block">Email Address</Label>
										<Input id="email" class="email grow" placeholder="" bind:value={emailAddress} />
									</div>
									<div class="flex flex-col">
										<Label for="phone" class="mb-2 block">Phone Number</Label>
										<Input
											class="h-10 w-full rounded-md p-5"
											id="phone"
											placeholder=""
											bind:value={phoneNumber}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="gap-3 bg-gray-50 px-4 py-3 pb-7 dark:bg-gray-900 sm:flex sm:flex-row sm:px-6">
						{#if !saveButtonEnable()}
							<Button size="md" color="alternative" disabled>Save</Button>
						{:else}
							<Button
								size="md"
								class="saveButton"
								color="blue"
								onclick={async () => {
									await save();
									contactInfoPreferencesModal = false;
								}}>Save</Button
							>
						{/if}
						<Button
							size="md"
							color="alternative"
							on:click={async () => {
								emailAddress = userInfo.email;
								phoneNumber = userInfo.phone;
								contactInfoPreferencesModal = false;
							}}>Cancel</Button
						>
					</div>
				</div>
			</div>
		</div>
	</dialog>
<!--
<Modal
	title="Notification Preferences"
	dismissable={false}
	size="sm"
	bind:open={contactInfoPreferencesModal}
>	
	<div>
	<Label for="email" class="mb-2 block">Email Address</Label>
	<Input
		id="email"
		class="email"
		placeholder=""
		bind:value={emailAddress}
		on:keydown={(e) => {
			if (e.key === 'Tab') {
				document.querySelector<HTMLInputElement>('.phone')?.focus();
			}
		}}
	/>
		</div>
	<div>
	<Label for="phone" class="mb-2 block">Phone Number</Label>
	<Input class="h-10 w-full rounded-md p-5" id="phone" placeholder="" bind:value={phoneNumber} />
		</div>
	{#if !saveButtonEnable()}
		<Button size="md" color="alternative" disabled>Save</Button>
	{:else}
		<Button
			size="md"
			class="saveButton"
			color="blue"
			onclick={async () => {
				await save();
				contactInfoPreferencesModal = false;
			}}>Save</Button
		>
	{/if}
	<Button
		size="md"
		color="alternative"
		on:click={async () => {
			emailAddress = userInfo.email;
			phoneNumber = userInfo.phone;
			contactInfoPreferencesModal = false;
		}}>Cancel</Button
	>
</Modal>
-->
<!--
document.querySelector<HTMLInputElement>('#phone')?.focus(); 
	-->
