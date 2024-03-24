<script lang="ts">
	import StatusTable from '$lib/StatusTable.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { kCloudUserService } from '../../services/kcloud-user-service';
	import {  onMount } from 'svelte';
	
	let kCloudCredentials : any ;//= localStorage.getItem("kCloudUser");
	let userID;

	let kCloudInstallations = [];

	const LoadUserData = async () => {
		if (localStorage){
			kCloudCredentials = localStorage.getItem("kCloudUser");
			const userData = JSON.parse(kCloudCredentials);
			userID = userData.id;
			kCloudInstallations = await kCloudUserService.getInstallations(userID);
		}
		
	};

	// on page loading get the list of installations for the user
	onMount(async () => {
		await LoadUserData();
	});
</script>

<div class="box">
	<div class="columns">
		<!-- Left Hand side System Navigation -->
		<div class="column is-one-quarter">
			<SideMenu PanelData={kCloudInstallations}/>
		</div>
		
		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Status</h1>
				<StatusTable StatusTableData = {kCloudInstallations} ></StatusTable>
			</div>
		</div>
	</div>
</div>