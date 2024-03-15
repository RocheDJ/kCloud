<!-- Chart Holder For Powermeter Tab 2
	\\src\routes\dashboard\powermeter\inc\Tab2
-->
<script lang="ts">
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import { onMount, onDestroy } from 'svelte';
	import { ConvertDT, GetMonth, roundToX, Number_to_Ordinal } from '../../../../utils/ConvertDT';
	import {
		Titles_,
		SelectedInstallation,
		SelectedMultiData,
		SelectedDateRange
	} from '../../../../stores';
	import PowerChart from '$lib/PowerChart.svelte';
	//---------------------------------------------------------------------------
	let sChartTitle = 'Title';
	let SelectedTitles = [];
	let mySelectedInstallation;
	let sUnit = '';
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';
	let sInterval = 'none';
	//-- Chart variables
	let MultiChartDataRaw = []; // data for multi data set chart
	let ChartDataRaw = []; // data for single data set chart
	let iNumXValues = 0;
	let iNumYDataSets = 0;
	let iIndexOfArrayWithMaxData = 0;
	//---------------------------------------------------------------------------

	// ----------------------- Power chart data types ---------------------------
	let DataSetEntry = {
		name: '---',
		values: []
	};
	let PowerChartData = {
		labels: [],
		datasets: [DataSetEntry]
	};
	//---------------------------------------------------------------------------
	function ClearPowerChartData() {
		DataSetEntry.name = '-';
		DataSetEntry.values = [0];
		PowerChartData = {
			labels: [],
			datasets: []
		};
	}

	//---------------------------------------------------------------------------
	function UpdateChartTitle() {
		switch (sInterval) {
			case 'hourly': {
				sChartTitle = ' Hourly Average';
				break;
			}
			case 'daily': {
				sChartTitle = ' Daily Average';
				break;
			}
			default: {
				sChartTitle = 'Live Values';
				break;
			}
		}
	}

	//------------------------------------------------------------
	async function LoadPowerChartData() {
		try {
			document.body.style.cursor = 'wait';
			const installationID = mySelectedInstallation.id;
			MultiChartDataRaw = [];
			ChartDataRaw = [];
			iNumXValues = 0; // set the number of labels to zero
			iNumYDataSets = 0; // set the number of labels to zero
			UpdateChartTitle();
			ClearPowerChartData();
			for (var Title of SelectedTitles) {
				if (Title.Enabled) {
					ChartDataRaw = await kCloudUserService.getPVOValueSpecific(
						installationID,
						Title.Title,
						sStart,
						sStop,
						sInterval
					);
					ChartDataRaw;
					// don't add data we don't have even if selected
					if (!ChartDataRaw.err) {
						//increment the total number of datasets
						iNumYDataSets = iNumYDataSets + 1;
						MultiChartDataRaw.push(ChartDataRaw);
						// set the number of labels for x axis
						if (ChartDataRaw.length > iNumXValues) {
							iNumXValues = ChartDataRaw.length;
							iIndexOfArrayWithMaxData = iNumYDataSets - 1; // use this data set for labels
						}
					}
				}
			}

			if (MultiChartDataRaw.length > 0) {
				PopulatePowerChartData();
			}
		} catch (error) {
			console.log('PowerMeter Tab 2 LoadData error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	}
	//---------------------------------------------------------------------
	function MakeXLabel(PVO: any = {}, Interval: string) {
		try {
			let MyRetValue = '--';
			switch (Interval) {
				case 'hourly': {
					MyRetValue = GetMonth(PVO.MM) + ' ' + Number_to_Ordinal(PVO.DD) + ' ' + PVO.HH + 'h';
					break;
				}
				case 'daily': {
					MyRetValue = GetMonth(PVO.MM) + ' ' + Number_to_Ordinal(PVO.DD);
					break;
				}
				default: {
					MyRetValue = ConvertDT(PVO.EventDate);
					break;
				}
			}
			return MyRetValue;
		} catch (error) {
			return 'ERR';
		}
	}
	//---------------------------------------------------------------------
	function MakeYValue(PVO: any = {}, Interval: string) {
		try {
			let MyRetValue = 0.0;
			switch (Interval) {
				case 'hourly': {
					MyRetValue = roundToX(PVO.AvgVal, 1);
					break;
				}
				case 'daily': {
					MyRetValue = roundToX(PVO.AvgVal, 1);
					break;
				}
				default: {
					MyRetValue = PVO.Value;
					break;
				}
			}
			return MyRetValue;
		} catch (error) {
			return 0.0;
		}
	}
	//---------------------------------------------------------------------
	function PopulatePowerChartData() {
		try {
			//--------------- Make the data for the chart ---------------------
			//------------ Load a blank structure -----------------------------
			// load the labels for the x axis Date+time
			for (let index = 0; index < iNumXValues; index++) {
				const label = MakeXLabel(MultiChartDataRaw[iIndexOfArrayWithMaxData][index], sInterval);
				PowerChartData.labels.push(label);
			}
			// add a dataset for each data set and add dummy data
			for (let dsIndex = 0; dsIndex < iNumYDataSets; dsIndex++) {
				//declare an array for values
				let myDataValues = [iNumXValues];
				// set default values to 0
				for (let index = 0; index < iNumXValues - 1; index++) {
					myDataValues[index] = 0;
				}
				//get the number of values in this data set
				const numValuesThisDataset = MultiChartDataRaw[dsIndex].length;
				const lastEntry = iNumXValues - numValuesThisDataset;
				let iCount = 0;

				//add values from the end of the dataset
				for (let index = iNumXValues - 1; index >= lastEntry; index--) {
					let iPointer = index;
					// if we have a data set with less than teh max number of records then
					if (lastEntry > 0) {
						iPointer = lastEntry - iCount;
					}
					const myValue = MakeYValue(MultiChartDataRaw[dsIndex][iPointer], sInterval);
					myDataValues[index] = myValue;

					iCount += 1;
				}

				let myDataSet = {
					name: MultiChartDataRaw[dsIndex][0].Title,
					values: myDataValues
				};
				PowerChartData.datasets.push(myDataSet);
			}
			$SelectedMultiData=PowerChartData; //save the multi data to update chart
		} catch (error) {
			console.log('PowerMeter Tab 2 PopulatePowerChartData error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	}
	//---------------------------------------------------------------------------
	// what happens when there is a change in selected titles
	const UnSub_Titles_ = Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
			if (SelectedTitles.length > 0 && mySelectedInstallation) {
				//			await LoadPowerChartData();
			}
		}
	});
	//---------------------------------------------------------------------
	// when you subscribe it returns the unsubscribe method
	const UnSub_SelectedDateRange = SelectedDateRange.subscribe(async (DateRange) => {
		if (DateRange) {
			sStart = DateRange.StartDate;
			sStop = DateRange.EndDate;
			sInterval = DateRange.Interval;
		}
		if ((SelectedTitles.length > 0) && mySelectedInstallation) {
			await LoadPowerChartData();
		}
	});
	// what happens when there is a change in selected Installation
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});
	//---------------------------------------------------------------------------
	onMount(async () => {
		UpdateChartTitle();
	});
	//---------------------------------------------------------------------------
	onDestroy(() => {
		UnSub_SelectedDateRange();
		UnSub_Titles_();
		UnSub_SelectedInstallation();
		//	SelectedMultiData.set([]);
	});
</script>

<DateTimeRange />
<span class="tag is-large">
	{sChartTitle}
</span>
<PowerChart ChartUnit={sUnit} />
