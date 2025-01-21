<script lang="ts">
import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from "flowbite-svelte";
//import { ChevronDownOutline} from 'flowbite-svelte-icons'

let miles = [5, 10, 25, 50, 100, 150, 200, 250, 300, 400, 500]
let cities = ["Cleveland", "Savannah"]
let states = ["OH", "GA"]
	let {
		filterOriginMiles = $bindable(),
		filterOriginCity = $bindable(),
	filterOriginState = $bindable(),
	filterDestinationMiles = $bindable(),
	filterDestinationCity = $bindable(),
	filterDestinationState = $bindable(),
	filterPickupStart = $bindable(),
	filterPickupEnd = $bindable(),
	filterTrailerType = $bindable()
}: {
	filterOriginMiles: number;
	filterOriginCity: string;
	filterOriginState: string; 
	filterDestinatonMiles: number;
	filterDestinationCity: string;
	filterDestinationState: string;
	filterPickupStart: string; //date
	filterPickupEnd: string; //date
	filterTrailerType: string; //string array
}

const clearSearch = () => {

}
</script>

<div>
	<h3>New Search</h3>
	<!-- TODO: Add divider -->
	<div>
		<h4>Origin:</h4>
		<p>Within</p>
		<Button>Miles<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" /></Button>
		<Dropdown>
			{#each miles as mile}
				<DropdownItem onclick={() => filterOriginMiles = mile}>{mile}</DropdownItem>
			{/each}
		</Dropdown>
		</Button>
		<p>miles of</p>
		<Dropdown>
			{#each states as state}
				<DropdownItem onclick={() => filterOriginState = state}>{state}</DropdownItem>
			{/each}
		</Dropdown>
		<Dropdown>
			{#each cities as city}
				<DropdownItem onclick={() => filterOriginState = state}>{state}</DropdownItem>
			{/each}
		</Dropdown>
	</div>
</div>
