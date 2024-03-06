<script lang="ts">
	import ValueBox from '$lib/ValueBox.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import Control from './Control.svelte';
	import { onMount } from 'svelte';
	import { Titles_, SelectedInstallation } from '../../../../stores';

	//read all teh titles for that selected installation
	//const StorageID = 'Titles_' + SelectedInstallation.id;
	//const aSelectedTitles = localStorage.getItem(StorageID);
	let SelectedTitles = []; //JSON.parse(aSelectedTitles);
	let mySelectedInstallation;
	let PVOData = [];

	const LoadData = async () => {
		PVOData.length = 0;
		for (let i = 0; i < SelectedTitles.length; i++) {
			if (SelectedTitles[i].Enabled) {
				const readPVOData = await kCloudUserService.getPVOValue(
					mySelectedInstallation.id,
					SelectedTitles[i].Title
				);
				const DisplayDate = readPVOData[0].EventDate;
				const data = {
					Title: SelectedTitles[i].Title,
					Value: readPVOData[0].Value,
					Unit: readPVOData[0].Unit,
					EventDate: DisplayDate
				};
				PVOData.push(data);
			}
			//console.log(
			//	' Tab 1 ' + i + '=' + SelectedTitles[i].Title + ' Enable =' + SelectedTitles[i].Enabled
			//);
		}
	};
	
	
	
	onMount(async () => {
		LoadData();
	});


	// what happens when there is a change in selected unit
	SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
		console.log('tab1 change Installation ' + mySelectedInstallation.description);
	});

	// what happens when there is a change in selected titles
	Titles_.subscribe((value) => {
		SelectedTitles = value;
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
			{#if Title.Enabled == true}
				<ValueBox InstallationId={mySelectedInstallation.id} Title={Title.Title} />
			{/if}
		{/each}
	</div>
</div>

<!-- Machine control -->
<Control InstallationID={mySelectedInstallation.id} />
