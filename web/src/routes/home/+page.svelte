<script lang="ts">
	import TopMenu from '$lib/TopMenu.svelte';
	import StatusTable from '$lib/StatusTable.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { kCloudUserService } from '../../services/kcloud-user-service';
	import { beforeUpdate } from 'svelte';

	const kCloudCredentials : any = localStorage.getItem("kCloudUser");
	const userData = JSON.parse(kCloudCredentials);
	let userID = userData.id;

	let kCloudInstallations = [];
	// on page loading get the list of installations for the user
	beforeUpdate(async () => {
		kCloudInstallations = await kCloudUserService.getInstallations(userID);
	});
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />


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