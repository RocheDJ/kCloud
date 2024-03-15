<!-- Installation Navigation Panel holts Installation description and PVO titles
	\\src\lib\Panel.svelte
-->
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
	import { AccordionItem } from 'svelte-collapsible';
	// -----------------------------------------------------------------------
	//local variables
	let PVOTitleList = [];
	let SavedTitleList = [];

	// load all the PVO titles from the server
	async function LoadPVOTitleList() {
		document.body.style.cursor = 'wait';
		try {
			const PVOTitlesRaw = await kCloudUserService.getPVOTitles(InstallationId);
			if (PVOTitlesRaw.length == 0) {
				alert('No PVOS Available for for ' + Description);
			} else {
				PVOTitleList = PVOTitlesRaw;
			}
		} catch (error) {
			console.log('Panel  LoadPVOTitleList error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	}

	// Load Selected ListItems from last time and save back to trigger reload on other
	//linked pages
	async function LoadSavedTitles() {
		try {
			const StorageID = 'Titles_' + InstallationId;
			if (localStorage) {
				const sTitleList = localStorage.getItem(StorageID);
				SavedTitleList = JSON.parse(sTitleList);
				console.log('Panel LoadSavedTitles ' + SavedTitleList);
				// save it back to local storage to trigger update on other panels
				localStorage.setItem(StorageID, JSON.stringify(PVOTitleList));
				$Titles_ = PVOTitleList;
				//Titles_.update(() => PVOTitleList);
			}
		} catch (error) {
			console.log('Panel LoadSavedTitles error ' + error);
		}
	}

	// -----------------------------------------------------------------------
	// decode the link for each system
	async function showTypeHome(installationType: string) {
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
		//await goto(route);

		console.log(' Goto ' + route);
		// open the page
		setTimeout(() => goto(route), 0);

		LoadSavedTitles();
	}
	// -----------------------------------------------------------------------
	// What happens when we click on the check box
	function handleChange(event: any) {
		const Title = event.currentTarget.value;
		const Shown = event.currentTarget.checked;
		try {
			console.log(Title + ' Checked = ' + Shown + ' index =' + event.currentTarget.id);
			const iIndex: number = event.currentTarget.id;
			console.log(Title + ' Selected = ' + PVOTitleList[iIndex].Title);
			// change what data is shown
			PVOTitleList[iIndex].Enabled = Shown;
			const StorageID = 'Titles_' + InstallationId;
			// save it back to local storage
			localStorage.setItem(StorageID, JSON.stringify(PVOTitleList));
			Titles_.update(() => PVOTitleList);
		} catch (error) {
			console.log('Panel  handleChange error ' + error);
		}
	}

	// -----------------------------------------------------------------------
	// on  loading get the list of titles for the Installation

	onMount(async () => {
		await LoadPVOTitleList();
	});
</script>

<nav class="panel">
	<AccordionItem key={Description}>
		<div slot="header" class="panel-heading-djr">
			<p>
				<span class="panel-icon">
					<i class="fas fa-industry"></i>
				</span>
				<!-- svelte-ignore missing-declaration -->
				<a data-action="collapse" on:click={showTypeHome(InstallationType)}>{Description}</a>
			</p>
		</div>
		<div slot="body">
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
		</div>
	</AccordionItem>
</nav>

<style>
	.panel-heading-djr {
		border-radius: 6px 6px 0 0;
		color: #363636;
		font-size: 1.25em;
		font-weight: 700;
		line-height: 1.25;
		padding: 0.75em 1em;
	}
</style>
