<script>
	import { dev } from '$app/environment'
</script>

{#if dev}
	<div>
		<p>Developer mode Backend: Dev - DB: Undefined - Upstream: Undefined - SVKit: Dev<p>
	</div>
{/if}

<style>
	div {
		text-align: center;
		height: 30px;
		background-color: red;
	}
</style>
