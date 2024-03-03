<script lang="ts">
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	
	import TestChart from '$lib/TestChart.svelte';
	
	import DateTimeRange from '$lib/DateTimeRange.svelte';

	import Tab1 from './inc/Tab1.svelte';
	import Tab2 from './inc/Tab2.svelte';
	import Tabs from './inc/Tabs.svelte';
	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Min Max Avg', value: 1, component: Tab1 },
		{ label: 'Data', value: 2, component: Tab2 }
	];

	const kCloudInstallations: any = localStorage.getItem('kCloudInstallations');
	let InstallationData :any =[];
	InstallationData = JSON.parse(kCloudInstallations);
</script>


<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />

<div class="box">
	<div class="columns">
		<div class="column is-one-quarter">
			<SideMenu PanelData={InstallationData}/>
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


