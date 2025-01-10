<script lang="ts">
	let {
		firstRow,
		secondRow
	}: {
		firstRow: String;
		secondRow: String;
	} = $props();
</script>

<div class="topRow">{firstRow}</div>
<div class="bottomRow">{secondRow}</div>

<style>
.topRow {
	background-color: lightgrey;
}
</style>
