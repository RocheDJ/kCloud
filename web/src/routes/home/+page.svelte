<script>
	import TopMenu from '$lib/TopMenu.svelte';
	import StatusTable from '$lib/StatusTable.svelte';
	import Panel from '$lib/Panel.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />

<div class="box">
	<div class="columns">
		<!-- Left Hand side System Navigation -->
		<div class="column is-one-quarter">
			<SideMenu />
		</div>

		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Status</h1>
				<StatusTable></StatusTable>
			</div>
		</div>
	</div>
</div>
