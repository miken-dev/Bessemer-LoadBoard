<script lang="ts">
	import PocketBase from 'pocketbase'
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
		id,
		email = $bindable(),
		text = $bindable(),
		title = $bindable(),
		setFilters
	}: {
		id: string 
		email: boolean;
		text: boolean;
		title: string;
		setFilters: setFilterProps["setFilters"];
	} = $props();


	//Pocketbase calls
	const PB = new PocketBase('https://lbdb2.dennisoncreative.com');
	async function toggleEmail(currentValue: boolean, id: string ) {
		const record = await PB.collection('Saved_Searches').update(`${id}`, {
			email: `${currentValue ? "False" : "True" }`
		});

	}
</script>

<div class="flex flex-row items-center justify-between">
	<p>{title}</p>
	<p></p>
	<div class="flex flex-row justify-around">
		<button class="{text ? active : inactive} mx-1 my-3 rounded px-4 py-2 text-white">Text</button>
		<button onclick={() => toggleEmail(email, id) } class="{email ? active : inactive} mx-1 my-3 rounded px-4 py-2 text-white">Email</button
		>
		<button onclick={setFilters} class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">View</button>
		<button class="mx-1 my-3 rounded bg-blue-600 px-4 py-2 text-white">Delete</button>
	</div>
</div>
