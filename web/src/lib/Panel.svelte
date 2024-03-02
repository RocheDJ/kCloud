<script lang="ts">
	export let Description = 'Test Description';
	export let InstallationType = 'Test';
	import { kCloudUserService } from '../services/kcloud-user-service';
	import { onMount } from 'svelte';
	export let InstallationId = 0;
	import { goto } from '$app/navigation';
	let PVOTitleList = [];

	// on  loading get the list of titles for the Installation
	onMount(async () => {
		PVOTitleList = await kCloudUserService.getPVOTitles(InstallationId);
	});

	//
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
		const SelectedInstallation = {
			id: InstallationId,
			description: Description
		};
		localStorage.setItem('SelectedInstallation', JSON.stringify(SelectedInstallation));
		// open the page
		goto(route);
	}

	// initialize default values
	function handleChange(event: any) {
		const Title = event.currentTarget.value;
		const Shown = event.currentTarget.checked;
		//PVOTitleList
		
		console.log(Title + ' Checked = ' + Shown);
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
		{#each PVOTitleList as PVOTitle}
			<label class="panel-block">
				<span class="panel-icon">
					<i class="fas fa-chart-bar" aria-hidden="true"></i>
				</span>
				<input type="checkbox" Value={PVOTitle.Title} checked on:change={handleChange} />
				{PVOTitle.Title}
			</label>
		{/each}
	</div>
</nav>
