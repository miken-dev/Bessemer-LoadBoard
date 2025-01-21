<script lang="ts">
	import { dev } from '$app/environment'
</script>

{#if dev}
	<div>
		<p>Developer mode <p>
	</div>
{/if}

<style>
	div {
		text-align: center;
		height: 30px;
		background-color: red;
	}
</style>
