<script lang="ts">
	import ValueBox from '$lib/ValueBox.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import Control from './Control.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Titles_, SelectedInstallation } from '../../../../stores';
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
				if (!readPVOData.err) {
					const DisplayDate = readPVOData[0].EventDate;
					const data = {
						Title: SelectedTitles[i].Title,
						Value: readPVOData[0].Value,
						Unit: readPVOData[0].Unit,
						EventDate: DisplayDate
					};
					PVOData.push(data);
				}
			}
		}
	};

	// what happens when there is a change in selected unit
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
		//console.log('tab1 change Installation ' + mySelectedInstallation.description);
	});

	// what happens when there is a change in selected titles
	const UnSub_Titles_ = Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
		}
	});
	onMount(async () => {
		await LoadData();
	});

	onDestroy(() => {
		UnSub_SelectedInstallation();
		UnSub_Titles_();
	});
</script>

<!-- Machine control -->
<Control InstallationID={mySelectedInstallation.id} />
<div class="box">
	<div class="columns">
		<!-- Machine image-->
		<div class="column is-half">
			<div class="box">
				<img src="/Pasto_1.png" alt="pasto" />
			</div>
		</div>
		<!-- Machine Values-->
		<div class="column is-half">
			<section class="column" id="Variables">
				{#each SelectedTitles as Title}
					{#if Title.Enabled == true}
						<ValueBox InstallationId={mySelectedInstallation.id} Title={Title.Title} />
					{/if}
				{/each}
			</section>
		</div>
	</div>
</div>

<!-- Simple CSS fro Scrolling through Variables-->
<style>
	#Variables {
		height: 60%;
		display: flex;
		overflow-y: auto;
		flex-direction: column;
	}
</style>
