<!-- Dashboard Root page for PowerMeter 
	\\src\routes\dashboard\powermeter\
-->
<script lang="ts">
	import { SelectedInstallation} from '../../../stores';
	import { onDestroy, onMount } from 'svelte';
	import Tab1 from './inc/Tab1.svelte';
	import Tab2 from './inc/Tab2.svelte';
	import Tab3 from './inc/Tab3.svelte';
	import Tabs from './inc/Tabs.svelte';
	//--------------------------------------------------------------------------------------------
	let kCloudInstallations: any = [];

	let mySelectedInstallation: any = {};

	//--------------------------------------------------------------------------------------------
	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Live Data', value: 1, component: Tab1 },
		{ label: 'Trends', value: 2, component: Tab2 },
		{ label: 'Data Table', value: 3, component: Tab3 }
	];

	//--------------------------------------------------------------------------------------------
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
	});

	//--------------------------------------------------------------------------------------------
	const LoadPage = async () => {
		try {
			if (localStorage) {
				const skCloudInstallations: any = localStorage.getItem('kCloudInstallations');
				kCloudInstallations = JSON.parse(skCloudInstallations);
			}
		} catch (error) {
			console.log('Dashboard Power meter LoadPage error ' + error);
		}
	};
	//--------------------------------------------------------------------------------------------
	onMount(async () => {
		console.log('Dashboard Power meter onMount');
		await LoadPage();
	});
	//--------------------------------------------------------------------------------------------

	onDestroy(() => {
		UnSub_SelectedInstallation();
	});
</script>

<!-- Right Hand system Display-->
<div class="column is-three-quarters">
	<div class="box">
		<h1 class="title">{mySelectedInstallation.description}</h1>
	</div>
	<Tabs {items} />
</div>
