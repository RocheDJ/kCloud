<!-- Chart For Pasteurizer - Frappe Charts
	\\src\lib\PastoChart
-->
<script lang="ts">
	//---------------------- import variables-----------
	import Chart from 'svelte-frappe-charts';
	import { SelectedData } from '../stores';
	//---------------------- settable variables-----------
	export let ChartType = 'line';
	export let ChartUnit = '-';
	//--------------------------------------------------------------------
	// https://frappe.io/charts/docs/reference/configuration#axisoptions
	let enableNavigation = true;
	let selected;
	let ChartHeight = 450;
	let showValuesOverPoints = true;
	let xAxisIsSeries = 1;
	let chartRef;
	
	const tooltipOptions={
		formatTooltipX: (d, i) => {
			d => (d + '').toUpperCase();
            return `<strong style="display: block; margin-bottom: 5px;color: #067df3">${d}</strong>`;
        },
    	formatTooltipY: d => d + ' '+ ChartUnit
		
	};

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

	//------------------------------------------------------------
	const onExport = () => chartRef.exportChart();

	//------------------------------------------------------------
	function ClearPVOChartData() {
		PVOChartData = {
			labels: [],
			datasets: [
				{
					name: '',
					values: []
				}
			]
		};
	}
	//------------------------------------------------------------
	const onDataSelect = (event) => {
		console.log('Data select event fired!', event);
		selected = event;
	};

	//-------------------------------------------------------
	function populateByTitle(PVOS: any[]) {
		ClearPVOChartData();
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
	}

	async function refreshChart(PVOS: any[]) {
		populateByTitle(PVOS);
	}

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
	type={ChartType}
	isNavigable={enableNavigation}
	valuesOverPoints={showValuesOverPoints}
	xIsSeries={xAxisIsSeries}
	tooltipOptions={tooltipOptions}
	bind:this={chartRef}
/>

<button style="font-size:24px" title="Export Chart to SVG image file."
	>Export <i class="fas fa-image" on:click={onExport}></i></button
>