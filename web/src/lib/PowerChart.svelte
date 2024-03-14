<!-- Chart For Power meters - Frappe Charts
	\\src\lib\PowerChart
-->
<script lang="ts">
	//---------------------- import variables-----------
	import Chart from 'svelte-frappe-charts';
	import { SelectedData } from '../stores';
	import { onDestroy } from 'svelte';
	//---------------------- settable variables-----------
	export let ChartType = 'line';
	export let ChartUnit = '-';
	export let SelectedTitles: any[];
	//--------------------------------------------------------------------
	// https://frappe.io/charts/docs/reference/configuration#axisoptions
	let enableNavigation = true;
	let selected;
	let ChartHeight = 450;
	let showValuesOverPoints = true;
	let xAxisIsSeries = 1;
	let chartRef;

	const tooltipOptions = {
		formatTooltipX: (d, i) => {
			(d) => (d + '').toUpperCase();
			return `<strong style="display: block; margin-bottom: 5px;color: #067df3">${d}</strong>`;
		},
		formatTooltipY: (d) => d + ' ' + ChartUnit
	};
    //------------------------------------------------------------
    let DataSetEntry = {
        name: '',
        values: []
    }
	//------------------------------------------------------------
	let PVOChartData = {
		labels: [],
		datasets: [DataSetEntry]
	};

	//------------------------------------------------------------
	const onExport = () => chartRef.exportChart();

	//------------------------------------------------------------
	function ClearPVOChartData() {
		PVOChartData = {
			labels: [],
            datasets: []
		};
	}

	//-------------------------------------------------------
	function populateByManyTitle(PVOS: any[], Titles: any[]) {
		ClearPVOChartData();
		// load the labels and set value to 0 for all
		PVOChartData.labels = [];
		let PVOTitleIndex = 0;
		Titles.forEach((Title) => {
			if (Title.Enabled) {
                PVOChartData.datasets.push(DataSetEntry)
				PVOS.forEach((PVO) => {
					const DTStamp = PVO.EventDate;
					PVOChartData.labels.push(`${DTStamp}`);
					PVOChartData.datasets[PVOTitleIndex].values.push(0);
					PVOChartData.datasets[PVOTitleIndex].name = PVO.Title;
				});

				PVOS.forEach(async (PVO, i) => {
					PVOChartData.datasets[PVOTitleIndex].values[i] = 0;
					PVOChartData.datasets[PVOTitleIndex].values[i] = PVO.Value;
				});
				PVOTitleIndex += 1;
			};
		});
	}
	//------------------------------------------------------------
	async function refreshChart(PVOS: any[]) {
		populateByManyTitle(PVOS, SelectedTitles);
        PVOChartData;
	}

	//------------------------------------------------------------
	const UnSub_SelectedData = SelectedData.subscribe(async (PVOS) => {
		if (PVOS) {
			await refreshChart(PVOS);
		}
	});

	onDestroy(() => {
		UnSub_SelectedData();
	});
</script>

<Chart
	data={PVOChartData}
	height={ChartHeight}
	type={ChartType}
	isNavigable={enableNavigation}
	valuesOverPoints={showValuesOverPoints}
	xIsSeries={xAxisIsSeries}
	{tooltipOptions}
	bind:this={chartRef}
/>

<button style="font-size:24px" title="Export Chart to SVG image file."
	>Export <i class="fas fa-image" on:click={onExport}></i></button
>
