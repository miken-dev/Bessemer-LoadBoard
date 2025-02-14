<script lang="ts">
	type setFilterProps = {
		setFilters: (
			originMiles: number,
			originState: string,
			originCity: string,
			destMiles: number,
			destState: string,
			destCity: string,
			trailerTypes: string,
			fromDate: Date,
			toDate: Date
		) => void;
	};
	let active = 'bg-blue-600';
	let inactive = 'bg-gray-500';
	let {
		title = $bindable(),
		text = $bindable(),
		email = $bindable(),
		setFilters
	}: {
		title: string;
		text: boolean;
		email: boolean;
		setFilters: setFilterProps["setFilters"];
	} = $props();
</script>

<div class="flex flex-row items-center justify-between">
	<p>{title}</p>
	<p></p>
	<div class="flex flex-row justify-around">
		<button class="{text ? active : inactive} mx-1 my-3 rounded px-4 py-2 text-white">Text</button>
		<button class="{email ? active : inactive} mx-1 my-3 rounded px-4 py-2 text-white">Email</button
		>
		<button onclick={setFilters} class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button>
		<button class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">Delete</button>
	</div>
</div>
