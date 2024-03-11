<!-- Core Dashboard Page Units in panels down the 1/4 + 3/4
	\\src\routes\Dashboard\+page
-->
<script lang="ts">
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { onMount } from 'svelte';
	let InstallationData: any = [];

	const LoadInstallations = async () => {
		try {
			const kCloudInstallations: any = localStorage.getItem('kCloudInstallations');
			InstallationData = JSON.parse(kCloudInstallations);
		} catch (error) {
			console.log('Pasto Page error ' + error);
		}
	};

	onMount(async () => {
		await LoadInstallations();
	});
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.24071'} />

<div class="box">
	<div class="columns">
		<div class="column is-one-quarter">
			<SideMenu PanelData={InstallationData} />
		</div>

		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Dashboard</h1>
			</div>
			<div class="box">
				<h2>Please Select an Installation</h2>
				<p>Use the side panels to select an Installation.</p>
			</div>
		</div>
	</div>
</div>
