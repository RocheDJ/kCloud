<script lang="ts">
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
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
				<h1 class="title">Dashboard</h1>
			</div>
			<div class="box">
				<h2>Please Select an Installation</h2>
				<p>
					Use the side panels to select an Installation.
				</p>
				
			</div>
		</div>
	</div>
</div>
