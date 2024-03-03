<script lang="ts">
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	
	import Tab1 from './inc/Tab1.svelte';
	import Tab2 from './inc/Tab2.svelte';
	import Tab3 from './inc/Tab3.svelte';
	import Tabs from './inc/Tabs.svelte';

	const skCloudInstallations: any = localStorage.getItem('kCloudInstallations');
	let kCloudInstallations :any =[];
	kCloudInstallations = JSON.parse(skCloudInstallations);

	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Overview', value: 1, component: Tab1 },
		{ label: 'Trend', value: 2, component: Tab2 },
		{ label: 'Data', value: 3, component: Tab3 }
	];


</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />
<div class="box">
	<div class="columns">
		<!-- Left Hand side System Navigation -->
		<div class="column is-one-quarter">
			<SideMenu PanelData={kCloudInstallations}/>
		</div>
		<!-- Right Hand system Display-->
		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Pasteurizer</h1>
			</div>
			<Tabs {items} />
		</div>
		
	</div>
</div>
