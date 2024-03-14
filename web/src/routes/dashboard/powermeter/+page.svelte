<!-- Dashboard Root page for PowerMeter 
	\\src\routes\dashboard\powermeter\
-->
<script lang="ts">
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { SelectedInstallation, Titles_, SelectedDateRange, SelectedData } from '../../../stores';
	import { onDestroy } from 'svelte';
	import PowerChart from '$lib/PowerChart.svelte';
	import { kCloudUserService } from '../../../services/kcloud-user-service';
	import { ConvertDT, GetMonth, roundToX, Number_to_Ordinal } from '../../../utils/ConvertDT';
	//--------------------------------------------------------------------------------------------
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import Tab1 from './inc/Tab1.svelte';
	import Tab2 from './inc/Tab2.svelte';
	import Tabs from './inc/Tabs.svelte';

	//--------------------------------------------------------------------------------------------
	let mySelectedInstallation: any = {};
	let SelectedTitles = [];
	let sUnit = '';
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';
	let sInterval = 'none';
	let ChartDataRaw = [{}];
	let sChartTitle = '';
	//--------------------------------------------------------------------------------------------
	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Min Max Avg', value: 1, component: Tab1 },
		{ label: 'Data', value: 2, component: Tab2 }
	];

	const kCloudInstallations: any = localStorage.getItem('kCloudInstallations');
	let InstallationData: any = [];
	InstallationData = JSON.parse(kCloudInstallations);
	//------------------------------------------------------------------------------------------------
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
	}
	//--------------------------------------------------------------------------------------------
	async function LoadChartData() {
		// Set the cursor ASAP to "Wait"
		document.body.style.cursor = 'wait';
		try {
			const mySelectedTitle = SelectSinglePVOTitle();
			const installationID = mySelectedInstallation.id;
			ChartDataRaw = await kCloudUserService.getPVOValueSpecific(
				installationID,
				mySelectedTitle,
				sStart,
				sStop,
				sInterval
			);
			ChartDataRaw;
			if (ChartDataRaw.err) {
				alert('Load Chart Data Error ' + ChartDataRaw.err);
				SelectedData.set([]);
			} else {
				// load data to chart based on interval
				switch (sInterval) {
					case 'hourly': {
						sChartTitle = mySelectedTitle + ' Hourly Average';
						for (var PVO of ChartDataRaw) {
							const sDateTime =
								GetMonth(PVO.MM) + ' ' + Number_to_Ordinal(PVO.DD) + ' ' + PVO.HH + 'h';
							const fValue = roundToX(PVO.AvgVal, 1);
							PVO.EventDate = sDateTime;
							PVO.Value = fValue;
							sUnit = PVO.Unit;
						}
						break;
					}
					case 'daily': {
						sChartTitle = mySelectedTitle + ' Daily Average';
						for (var PVO of ChartDataRaw) {
							const sDateTime = GetMonth(PVO.MM) + ' ' + Number_to_Ordinal(PVO.DD);
							const fValue = roundToX(PVO.AvgVal, 1);
							PVO.EventDate = sDateTime;
							PVO.Value = fValue;
							sUnit = PVO.Unit;
						}
						break;
					}
					default: {
						sChartTitle = mySelectedTitle;
						for (var PVO of ChartDataRaw) {
							const sDateTime = ConvertDT(PVO.EventDate);
							PVO.EventDate = sDateTime;
							sUnit = PVO.Unit;
						}
						break;
					}
				}
				SelectedData.set(ChartDataRaw);
			}
		} catch (error) {
			console.log('Pasto Tab 2 LoadChartData error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	}
	//--------------------------------------------------------------------------------------------
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
	});
	//--------------------------------------------------------------------------------------------
	// when you subscribe it returns the unsubscribe method
	const UnSub_SelectedDateRange = SelectedDateRange.subscribe(async (DateRange) => {
		if (DateRange) {
			sStart = DateRange.StartDate;
			sStop = DateRange.EndDate;
			sInterval = DateRange.Interval;
		}
		if (SelectedTitles.length > 0) {
			//await LoadChartData();
		}
	});
	//--------------------------------------------------------------------------------------------
	const UnSub_Titles_ = Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
			if (SelectedTitles.length > 0) {
				//	await LoadChartData();
			}
		}
	});
	//--------------------------------------------------------------------------------------------

	onDestroy(() => {
		UnSub_SelectedInstallation();
		UnSub_SelectedDateRange();
		UnSub_Titles_();
		SelectedData.set([]);
	});
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />

<div class="box">
	<div class="columns">
		<div class="column is-one-quarter">
			<SideMenu PanelData={InstallationData} />
		</div>

		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">{mySelectedInstallation.description}</h1>
				<DateTimeRange />
				<!--
					<PowerChart ChartType={'bar'} ChartUnit={'kWh'} SelectedTitles = {SelectedTitles}/>

				-->
			</div>

			<Tabs {items} />
		</div>
	</div>
</div>
