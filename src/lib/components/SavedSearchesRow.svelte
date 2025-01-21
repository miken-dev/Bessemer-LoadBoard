<script lang="ts">
	let active = 'bg-blue-600';
	let inactive = 'bg-gray-500';
	let {
		title = $bindable(),
		text = $bindable(),
		email = $bindable()
	}: {
		title: string;
		text: boolean;
		email: boolean;
	} = $props();
</script>

<div class="flex flex-row items-center justify-between">
	<p>{title}</p>
	<p></p>
	<div class="flex flex-row justify-around">
		<button class="{text ? active : inactive} text-white py-2 px-4 my-3 mx-1 rounded">Text</button>
		<button class="{email ? active : inactive} text-white mx-1 my-3 rounded px-4 py-2">Email</button>
		<button class="bg-blue-600 mx-1 my-3 rounded px-4 py-2 text-white">View</button>
		<button class="bg-blue-600 mx-1 my-3 rounded px-4 py-2 text-white">Delete</button>
	</div>
</div>
