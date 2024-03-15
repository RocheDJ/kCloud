<script lang="ts">
	import { kCloudUserService } from '../services/kcloud-user-service';
	import {ConvertDT} from '../utils/ConvertDT'
	import { onDestroy, onMount } from 'svelte';
	export let Title: string = '';
	export let InstallationId: number = 0;
	let IntervalID;
	let xEnableRefresh: boolean = true;
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
		const retValue = await kCloudUserService.getPVOValue(InstallationId, Title);
		if (retValue.err) {
			PVOData = [
				{
					EventDate: '',
					Title: '',
					Unit: '',
					Value: 0
				}
			];
			xEnableRefresh = false;
		} else {
			PVOData = retValue;
		}
	};
// from https://www.slingacademy.com/article/typescript-setinterval-and-clearinterval-methods/#Example_2_Using_setInterval_with_Classes
	class Repeater {
		private intervalId: number | undefined;
		startRepeating(): void {
			this.intervalId = window.setInterval(async () => {
				await LoadData();
				const now = new Date();
				//console.log('Value Box updating :', Title+ '-' + now);
			}, 10000);
		}

		stopRepeating(): void {
			if (this.intervalId) {
				window.clearInterval(this.intervalId);
				this.intervalId = undefined;
			}
		}
	}

	const myRepeater = new Repeater();

	onMount(async () => {
		await LoadData();
		myRepeater.startRepeating();
		
	});

	onDestroy(() => {
		myRepeater.stopRepeating();
	});
</script>

<div class="tile is-ancestor">
	<div class="tile is-parent">
		<article class="tile is-child box">
			<p class="title is-4 has-background-info-dark has-text-info-light">{Title}</p>
			<p class="subtitle is-6">Updated-{ConvertDT(PVOData[0].EventDate)}</p>
			<div class="content">
				{#if PVOData[0].Unit == 'QI'}
					{#if PVOData[0].Value == 0}
						<h1 style="color:Tomato;">-- OFF--</h1>
					{:else}
						<h1 style="color:MediumSeaGreen;">-- ON --</h1>
					{/if}
				{:else}
					<h1>{PVOData[0].Value} &nbsp {PVOData[0].Unit}</h1>
				{/if}
			</div>
		</article>
	</div>
</div>
