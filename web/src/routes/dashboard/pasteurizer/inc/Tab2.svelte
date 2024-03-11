<!-- Chart Holder For Pasteurizer Tab 2
	\\src\routes\dashboard\pasteurizer\inc\Tab2
-->
<script lang="ts">
	import PastoChart from '$lib/PastoChart.svelte';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import { onMount } from 'svelte';
	import { ConvertDT }from '../../../../utils/ConvertDT';
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
	let SelectedTitles = []; //JSON.parse(aSelectedTitles);
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';

	//---------------------------------------------------------------------
	const SelectSinglePVOTitle = () => {
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
	const LoadChartData = async () => {
		// Set the cursor ASAP to "Wait"
		document.body.style.cursor = 'wait';
		const mySelectedTitle = SelectSinglePVOTitle();
		sChartTitle = mySelectedTitle;
		ChartDataRaw = await kCloudUserService.getPVOValueSpecific(
			mySelectedInstallation.id,
			mySelectedTitle, //SelectedTitles[1].Title
			sStart,
			sStop
		);

		if (ChartDataRaw.length == 0) {
			alert('No Data For this !');
		} else {

			for (var PVO of ChartDataRaw) {
						const sDateTime = ConvertDT(PVO.EventDate);
						PVO.EventDate = sDateTime;
					}
			SelectedData.set(ChartDataRaw);
		}
		document.body.style.cursor = 'default';
	};

	//---------------------------------------------------------------------

	SelectedDateRange.subscribe(async (DateRange) => {
		if (DateRange) {
			sStart = DateRange.StartDate;
			sStop = DateRange.EndDate;
			await LoadChartData();
		}
	});

	// what happens when there is a change in selected unit
	SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});

	// what happens when there is a change in selected titles
	Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
			if (SelectedTitles.length > 0) {
				await LoadChartData();
			}
		}
	});

	onMount(async () => {
		await LoadChartData();
	});
</script>

<DateTimeRange />
<span class="tag is-large">
	{sChartTitle}
</span>
<PastoChart ChartType={'line'} />
