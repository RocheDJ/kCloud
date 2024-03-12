<!-- Chart Holder For Pasteurizer Tab 2
	\\src\routes\dashboard\pasteurizer\inc\Tab2
-->
<script lang="ts">
	import PastoChart from '$lib/PastoChart.svelte';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import { onMount,onDestroy } from 'svelte';
	import { ConvertDT } from '../../../../utils/ConvertDT';
	import {
		Titles_,
		SelectedInstallation,
		SelectedData,
		SelectedDateRange
	} from '../../../../stores';

	//---------------------------------------------------------------------
	let ChartDataRaw = [{}];
	let sChartTitle = '';
	//---------------------------------------------------------------------
	let mySelectedInstallation;
	let SelectedTitles = [];
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';

	//---------------------------------------------------------------------
	function SelectSinglePVOTitle() {
		// return the first one that is enabled
		try {
			for (let index = 0; index < SelectedTitles.length; index++) {
				const element = SelectedTitles[index];
				if (element.Enabled) {
					return element.Title;
				}
			}
			return '-';
		} catch (error) {
			return '-';
		}
	};

	//---------------------------------------------------------------------
	async function LoadChartData() {
		// Set the cursor ASAP to "Wait"
		document.body.style.cursor = 'wait';
		try {
			const mySelectedTitle = SelectSinglePVOTitle();
			const installationID = mySelectedInstallation.id;
			ChartDataRaw = await kCloudUserService.getPVOValueSpecific(
				installationID,
				mySelectedTitle, //SelectedTitles[1].Title
				sStart,
				sStop
			);
			ChartDataRaw;
			if (ChartDataRaw.err) {
				alert('Load Chart Data Error ' +ChartDataRaw.err);
			} else {
				sChartTitle = mySelectedTitle;
				for (var PVO of ChartDataRaw) {
					const sDateTime = ConvertDT(PVO.EventDate);
					PVO.EventDate = sDateTime;
				}
				SelectedData.set(ChartDataRaw);
			}
		} catch (error) {
			console.log('Pasto Tab 2 LoadChartData error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	};

	//---------------------------------------------------------------------
	// when you subscribe it returns the unsubscribe method
	const UnSub_SelectedDateRange= SelectedDateRange.subscribe(async (DateRange) => {
		if (DateRange) {
			sStart = DateRange.StartDate;
			sStop = DateRange.EndDate;
		};
		if (SelectedTitles.length > 0) {
				await LoadChartData();
			}
		
	});

	// what happens when there is a change in selected unit
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});

	// what happens when there is a change in selected titles
	const UnSub_Titles_ =Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
			if (SelectedTitles.length > 0) {
				await LoadChartData();
			}
		}
	});

	onMount(async () => {
		//await LoadChartData();
	});

	onDestroy(() => {
		UnSub_SelectedDateRange();
		UnSub_Titles_();
		UnSub_SelectedInstallation();
		console.log("Tab 2 On Destroy called")
	});
	
		
</script>

<DateTimeRange />
<span class="tag is-large">
	{sChartTitle}
</span>
<PastoChart ChartType={'line'} />
