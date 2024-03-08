<script lang="ts">
	import PastoChart from '$lib/PastoChart.svelte';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import { onMount } from 'svelte';
	import {
		Titles_,
		SelectedInstallation,
		SelectedData
	} from '../../../../stores';

	//---------------------------------------------------------------------
	let ChartDataRaw = [{}];
	//---------------------------------------------------------------------
	let mySelectedInstallation;
	let SelectedTitles = []; //JSON.parse(aSelectedTitles);
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';
	//---------------------------------------------------------------------
	const LoadChartData = async () => {
		ChartDataRaw = await kCloudUserService.getPVOValueSpecific(
			mySelectedInstallation.id,
			SelectedTitles[1].Title,
			sStart,
			sStop
		);

		if (ChartDataRaw.length == 0) {
			alert('No Data For this !');
		} else {
			SelectedData.set(ChartDataRaw);
		}
	};

	// what happens when there is a change in selected unit
	SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});

	
	// what happens when there is a change in selected titles
	Titles_.subscribe(async(value) => {
		if (value) {
			SelectedTitles = value;
			if (SelectedTitles.length > 0) LoadChartData();
		}
	});

	onMount(async () => {
		await LoadChartData();
	});
</script>

<DateTimeRange />

<PastoChart ChartTitle={'Pasteurizer Temp'} ChartType={'line'} />
