<script lang="ts">
	//---------------------- import variables-----------
	import Chart from 'svelte-frappe-charts';
	import { SelectedData } from '../stores';
	import { onMount } from 'svelte';
	export let PVOTitle = 'Temperature';

	let chartType = 'line';
	// https://frappe.io/charts/docs/reference/configuration#axisoptions
	let enableNavigation = true;
	let selected;
	let ChartHeight = 350;
	let showValuesOverPoints = true;
	let xAxisIsSeries = 1;

	//------------------------------------------------------------
	let PVOChartData = {
		labels: [],
		datasets: [
			{
				name: '',
				values: []
			}
		]
	};

	const onDataSelect = (event) => {
		console.log('Data select event fired!', event);
		selected = event;
	};

	//-------------------------------------------------------
	function populateByTitle(PVOS: any[]) {
		// load the labels and set value to 0 for all
		PVOChartData.labels = [];
		PVOS.forEach((PVO) => {
			const DTStamp = PVO.EventDate;
			PVOChartData.labels.push(`${DTStamp}`);
			PVOChartData.datasets[0].values.push(0);
			PVOChartData.datasets[0].name = PVO.Title;
		});

		PVOS.forEach(async (PVO, i) => {
			PVOChartData.datasets[0].values[i] = 0;
			PVOChartData.datasets[0].values[i] = PVO.Value;
		});
		PVOChartData;
	}

	async function refreshChart(PVOS: any[]) {
		populateByTitle(PVOS);
	}

	//------------------------------------------------------------
	onMount(async () => {
		//await refreshChart();
	});
	//------------------------------------------------------------
	SelectedData.subscribe(async (PVOS) => {
		if (PVOS) {
			await refreshChart(PVOS);
		}
	});
</script>

<Chart
	data={PVOChartData}
	height={ChartHeight}
	type={chartType}
	isNavigable={enableNavigation}
	valuesOverPoints={showValuesOverPoints}
	xIsSeries={xAxisIsSeries}
	title={PVOTitle}
/>
