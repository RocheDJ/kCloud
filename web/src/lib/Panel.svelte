<script lang="ts">
	// external properties
	export let Description = 'Test Description';
	export let InstallationType = 'Test';
	export let InstallationId = 0;
	//import files
	import { kCloudUserService } from '../services/kcloud-user-service';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Titles_, SelectedInstallation } from '../stores';

	// -----------------------------------------------------------------------
	//local variables
	let PVOTitleList = [];
	let PVOTitleData = [];
	// -----------------------------------------------------------------------
	// on  loading get the list of titles for the Installation
	onMount(async () => {
		PVOTitleList = await kCloudUserService.getPVOTitles(InstallationId);
		// load the selected PVO title
		//read all teh titles for that selected installation
		const StorageID = 'Titles_' + InstallationId;
		const aSelectedTitles = localStorage.getItem(StorageID);
		PVOTitleData = JSON.parse(aSelectedTitles);
	});
	// -----------------------------------------------------------------------
	// decode the link for each system
	function showTypeHome(installationType: string) {
		let route: string = `/dashboard`;
		switch (installationType) {
			case 'PowerMeter':
				// statement 1
				route = route + '/powermeter';
				break;
			case 'Pasteurizer':
				// statement 2
				route = route + '/pasteurizer';
				break;
			default:
				//
				route = route + '/';
				break;
		}
		//set the selected ID data
		const SelectedInstallationData = {
			id: InstallationId,
			description: Description
		};
		SelectedInstallation.set(SelectedInstallationData);
		// open the page
		goto(route);
		console.log(' Reload ' + route);
	}
	// -----------------------------------------------------------------------
	// What happens when we click on the check box
	function handleChange(event: any) {
		const Title = event.currentTarget.value;
		const Shown = event.currentTarget.checked;
		PVOTitleData;
		console.log(Title + ' Checked = ' + Shown + ' index =' + event.currentTarget.id);
		const iIndex: number = event.currentTarget.id;
		console.log(Title + ' Selected = ' + PVOTitleData[iIndex].Title);
		// change what data is shown
		PVOTitleData[iIndex].Enabled = Shown;
		const StorageID = 'Titles_' + InstallationId;
		// save it bact to local storage
		localStorage.setItem(StorageID, JSON.stringify(PVOTitleData));
		// reload the page
		//showTypeHome(InstallationType);
		Titles_.update((TitleData) => PVOTitleData);
	}
</script>

<nav class="panel">
	<p class="panel-heading">
		<span class="panel-icon">
			<i class="fas fa-industry"></i>
		</span>
		<!-- svelte-ignore missing-declaration -->
		<a data-action="collapse" on:click={showTypeHome(InstallationType)}>{Description}</a>
	</p>
	<div id={Description} class="is-collapsible is-active">
		<!-- Wrapper Div to be able to collapse/expand Panel's content -->
		{#each PVOTitleList as PVOTitle, iIndex}
			<label class="panel-block">
				<span class="panel-icon">
					<i class="fas fa-chart-bar" aria-hidden="true"></i>
				</span>
				<input
					type="checkbox"
					id={iIndex.toString()}
					Value={PVOTitle.Title}
					checked
					on:change={handleChange}
				/>
				{PVOTitle.Title}
			</label>
		{/each}
	</div>
</nav>
