<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		ImagePlaceholder,
		Modal
	} from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	import type LoadTableDetail from './LoadTableDetail.svelte';
	import type { TableDataTypes } from '$lib/types';


	// component props
	let {
		tabledata,
		selectedrow = $bindable(),
		detailshidden = $bindable(),
		tableclicked = $bindable(),
	}: {
		tabledata: TableDataTypes[];
		selectedrow: number | null;
		detailshidden: boolean;
		tableclicked: boolean;
	} = $props();

	const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
	const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
	const dateordinals = (d: number) => {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
			default: return "th";
		}
	}
	const toggle = (id: number) => {
		selectedrow = id;
		detailshidden = false 
		tableclicked = true
	}
</script>



</Table>
