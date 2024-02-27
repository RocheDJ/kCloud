<script>
	import TopMenu from '$lib/TopMenu.svelte';
	import TestChart from '$lib/TestChart.svelte';
	import Panel from '$lib/Panel.svelte';
	import DateTimeRange from '$lib/DateTimeRange.svelte';

	import Tab1 from './inc/Tab1.svelte';
	import Tab2 from './inc/Tab2.svelte';
	import Tabs from './inc/Tabs.svelte';
	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Min Max Avg', value: 1, component: Tab1 },
		{ label: 'Data', value: 2, component: Tab2 }
	];
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
				<DateTimeRange />
				<TestChart ChartTitle={'Power Meters'}></TestChart>
				<i class="fas fa-file-pdf"></i>
				
			</div>


			<Tabs {items} />
		</div>
	</div>
</div>
