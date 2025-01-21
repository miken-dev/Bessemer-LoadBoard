<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	let {
		saveSearchDialogIsShowing = $bindable(),
		saved = $bindable()
	}: {
		saveSearchDialogIsShowing: boolean;
		saved: boolean;
	} = $props();
</script>

<Modal title="Name your saved search" size="md" bind:open={saveSearchDialogIsShowing} outsideclose>
	<Label for="name" class="mb-2 block">Name your saved search</Label>
	<Input id="name" placeholder="" />
	<Button
		size="md"
		color="blue"
		onclick={() => {
			saved = true;
		}}>Save</Button
	>
</Modal>
