<!-- Dashboard Root page for Pasteurizer 
	\\src\routes\dashboard\pasteurizer\
-->
<script lang="ts">
	import { SelectedInstallation } from '../../../stores';
	import { onDestroy, onMount } from 'svelte';
	import Tab1 from './inc/Tab1.svelte';
	import Tab2 from './inc/Tab2.svelte';
	import Tab3 from './inc/Tab3.svelte';
	import Tab4 from './inc/Tab4.svelte';
	import Tabs from './inc/Tabs.svelte';

	let kCloudInstallations: any = [];

	let mySelectedInstallation: any = {};

	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Overview', value: 1, component: Tab1 },
		{ label: 'Trend', value: 2, component: Tab2 },
		{ label: 'PVO Data', value: 3, component: Tab3 },
		{ label: 'PDO Reports', value: 4, component: Tab4 }
	];
	// what happens when there is a change in selected titles
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
	});

	const LoadPage = async () => {
		if (localStorage) {
			const skCloudInstallations: any = localStorage.getItem('kCloudInstallations');
			kCloudInstallations = JSON.parse(skCloudInstallations);
		}
	};

	onMount(async () => {
		console.log('Dashboard Pasto onMount');
		await LoadPage();
	});

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
