<!-- Core Dashboard layout
	\\src\routes\Dashboard\+layout
-->
<script lang="ts">
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

<div class="box">
	<div class="columns">
		<div class="column is-one-quarter">
			<SideMenu PanelData={InstallationData} />
		</div>
		<slot />
	</div>
</div>
