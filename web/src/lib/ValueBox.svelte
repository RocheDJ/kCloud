<script lang="ts">
	import { kCloudUserService } from '../services/kcloud-user-service';
	import { onMount } from 'svelte';
	export let Title: string = '';
	export let InstallationId: number = 0;

	let PVOData: any = [
		{
			EventDate: '',
			Title: '',
			Unit: '',
			Value: 0
		}
	];

	// on  loading get the list of titles for the Installation
	//onMount(async () => {
	//	PVOData = await kCloudUserService.getPVOValue(InstallationId, Title);
	//});

	const LoadData = async () => {
		PVOData = await kCloudUserService.getPVOValue(InstallationId, Title);
	}
	onMount(() => {
		LoadData();
		const interval = setInterval(() => {
			console.log('ValueBox  ' + Title + ' Refresh');
			LoadData();
		}, 5000);
		
		return () => clearInterval(interval);
	});
</script>

<div class="tile is-ancestor">
	<div class="tile is-parent">
		<article class="tile is-child box">
			<p class="title is-4 has-background-info-dark has-text-info-light">{Title}</p>
			<p class="subtitle is-6">Updated-{PVOData[0].EventDate}</p>
			<div class="content">
				{#if PVOData[0].Unit == 'QI'}
					{#if PVOData[0].Value == 0}
                        <h1 style="color:Tomato;" >-- OFF-- </h1>
					{:else}
                        <h1 style="color:MediumSeaGreen;" >-- ON --</h1>
					{/if}
				{:else}
					<h1>{PVOData[0].Value} &nbsp {PVOData[0].Unit}</h1>
				{/if}
			</div>
		</article>
	</div>
</div>
