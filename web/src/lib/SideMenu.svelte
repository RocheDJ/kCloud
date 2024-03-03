<script lang="ts">
	import Panel from '$lib/Panel.svelte';
	export let PanelData :any =[];
</script>

<div class="box">
	<h1 class="title">Units</h1>
		<!--{#each InstallationData as Installation} -->
		{#each PanelData as Installation}
			<Panel
				Description={Installation.Description}
				InstallationId={Installation.id}
				InstallationType={Installation.Type}
			/>
		{/each}
	
</div>
