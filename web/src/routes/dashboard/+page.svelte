<script >
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />

<div class="box">
	<div class="columns">
		<div class="column is-one-quarter">
				<SideMenu/>
		</div>

		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Dashboard</h1>	
			</div>
		</div>
	</div>
</div>
