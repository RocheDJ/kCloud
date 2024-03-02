<script lang="ts">
	import ValueBox from '$lib/ValueBox.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import Control from './Control.svelte';
	import { onMount } from 'svelte';
	const aSelectedInstallation = localStorage.getItem('SelectedInstallation');
	const SelectedInstallation = JSON.parse(aSelectedInstallation);
	const StorageID = 'Titles_' + SelectedInstallation.id;
	const aSelectedTitles = localStorage.getItem(StorageID);
	const SelectedTitles = JSON.parse(aSelectedTitles);


	let PVOData = [];

	const LoadData = async () => {
        PVOData.length=0;
		for (let i = 0; i < SelectedTitles.length; i++) {
            const readPVOData = await kCloudUserService.getPVOValue(SelectedInstallation.id, SelectedTitles[i].Title);
            const DisplayDate = readPVOData[0].EventDate;
            const data = {
				Title: SelectedTitles[i].Title,
                Value: readPVOData[0].Value,
                Unit: readPVOData[0].Unit,
                EventDate:DisplayDate,
			};
            PVOData.push(data);
			//console.log(' Title for ' + i + '=' + data.Title + ' value =' + data.Value);
		}
	};

	onMount(async () => {
		LoadData();
	});
</script>

<div class="columns">
	<!-- Machine image-->
	<div class="column is-half">
		<div class="box">
			<img src="/Pasto_1.png" alt="pasto" />
		</div>
	</div>
	<!-- Machine Values-->
	<div class="column is-half">
		{#each SelectedTitles as Title}
			
				<ValueBox InstallationId={SelectedInstallation.id} Title={Title.Title}/>
			
		{/each}
	</div>
</div>

<!-- Machine control -->
<Control />
