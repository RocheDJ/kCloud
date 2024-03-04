<script lang="ts">
	export let PanelData: any = [];

	import Panel from '$lib/Panel.svelte';

	import { Accordion, AccordionItem } from 'svelte-collapsible';
</script>

<div class="box">
	<h1 class="title">Units</h1>
	<Accordion>
		{#each PanelData as Installation}
			<Panel
				Description={Installation.Description}
				InstallationId={Installation.id}
				InstallationType={Installation.Type}
			/>
		{/each}
	</Accordion>
</div>
