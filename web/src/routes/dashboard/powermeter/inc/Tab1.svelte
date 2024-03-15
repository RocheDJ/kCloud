<!-- Dashboard Root page for Powermeter 
	\\src\routes\dashboard\powermeter\inc\tab1.svelte
-->
<script lang="ts">
	import TileItem_3 from '$lib/TileItem_3.svelte';
	import ValueBox from '$lib/ValueBox.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import { onDestroy, onMount } from 'svelte';
	import { Titles_, SelectedInstallation } from '../../../../stores';
	//----------------------------------------------------------------
	let SelectedTitles = [];
	let mySelectedInstallation;
	let PVOData = []; // holds the data for all selected PVO's
	//----------------------------------------------------------------

	//load the PVO data for every selected title into the array PVOData
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

	//------------------------------------------------------------------------------
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
	});

    //------------------------------------------------------------------------------
    // what happens when there is a change in selected titles
	const UnSub_Titles_ = Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
		}
	});
    //------------------------------------------------------------------------------
	onMount(async () => {
		await LoadData();
	});

	onDestroy(() => {
		UnSub_SelectedInstallation();
		UnSub_Titles_();
	});
 //------------------------------------------------------------------------------
</script>

<div class="box">
    <div class="container"> 
        <h1 class="title has-text-centered"> 
          Latest Values
        </h1> 
        <div class="columns is-flex-direction-row"> 
                {#each SelectedTitles as Title}
                <div>
					{#if Title.Enabled == true}
						<ValueBox InstallationId={mySelectedInstallation.id} Title={Title.Title} />
					{/if}
                </div>
				{/each}
        </div> 
    </div> 
</div>