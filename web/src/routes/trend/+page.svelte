<script>
	import TopMenu from '$lib/TopMenu.svelte';
	import TestChart from '$lib/TestChart.svelte';
	import Panel from '$lib/Panel.svelte';
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />

<div class="box">
	<div class="columns">
		<div class="column is-one-quarter">
			<div class="box">
				<h1 class="title">Units</h1>
				<Panel Description={'Power Meters'} Items={['Line 1', 'Line 2', 'Line 3', 'Total']} />

				<Panel
					Description={'Pasto 1'}
					Items={['Volume', 'Temperature', 'Conductivity', 'Reports']}
				/>
			</div>
		</div>

		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Trend</h1>
				<TestChart ChartTitle={'Power Meters'}></TestChart>
			</div>
		</div>
	</div>
</div>
