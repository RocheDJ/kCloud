<!-- Chart For Power meters - Frappe Charts
	\\src\lib\PowerChart
-->
<script lang="ts">
	//---------------------- import variables-----------
	import Chart from 'svelte-frappe-charts';
	import { SelectedMultiData } from '../stores';
	import { onDestroy, onMount } from 'svelte';
	//---------------------- settable variables-----------
	export let ChartType = 'bar';
	//--------------------------------------------------------------------
	// https://frappe.io/charts/docs/reference/configuration#axisoptions
	let enableNavigation = false;
	let ChartHeight = 450;
	let showValuesOverPoints = true;
	let xAxisIsSeries = 1;
	let chartRef;
	let MultiDataSetsCount;
	let xToggleChart = false;
	let axisOptions = {
		xAxisMode: 'tick' // default: 'span'
	};
	let barOptions = {
		spaceRatio: 0.5,
		stacked: 0
	};

	const tooltipOptions = {
		formatTooltipX: (d, i) => {
			(d) => (d + '').toUpperCase();
			return `<strong style="display: block; margin-bottom: 5px;color: #067df3">${d}</strong>`;
		},
		formatTooltipY: (d) => d
	};

	//------------------------------------------------------------
	let PowerChartData;

	let DummyData_04 = {
		labels: [
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon'
		],
		datasets: [
			{
				name: 'set 1',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			},
			{
				name: 'set 2',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			},
			{
				name: 'set 3',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			},
			{
				name: 'set 4',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			}
		]
	};
	let DummyData_03 = {
		labels: [
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon'
		],
		datasets: [
			{
				name: 'set 1',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			},
			{
				name: 'set 2',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			},
			{
				name: 'set 3',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			}
		]
	};
	let DummyData_02 = {
		labels: [
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon'
		],
		datasets: [
			{
				name: 'set 1',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			},
			{
				name: 'set 2',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			}
		]
	};
	let DummyData_01 = {
		labels: [
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun',
			'Mon'
		],
		datasets: [
			{
				name: 'set 1',
				values: [300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710]
			}
		]
	};
	//------------------------------------------------------------
	//export chart to svg
	const onExport = () => chartRef.exportChart();

	//-------------------------------------------------------
	async function refreshChart(MultiData: any[]) {
		MultiDataSetsCount = MultiData.datasets.length;
		// switch for testing dummy data
		switch (MultiDataSetsCount) {
			case 1: {
				PowerChartData = MultiData;
				break;
			}
			case 2: {
				PowerChartData = MultiData;
				break;
			}
			case 3: {
				PowerChartData = MultiData;
				break;
			}
			case 4: {
				PowerChartData = MultiData;
				break;
			}
		}
		xToggleChart = !xToggleChart;
		//await chartRef.update(dummydata);
		//await chartRef.update(MultiData);
		chartRef;
	}

	//------------------------------------------------------------
	const UnSub_SelectedMultiData = SelectedMultiData.subscribe(async (MultiData) => {
		if (MultiData) {
			await refreshChart(MultiData);
		}
	});

	onMount(async () => {
		//PowerChartData = dummydata;
		//await await chartRef.update(PowerChartData) ;
	});
	//------------------------------------------------------------
	onDestroy(() => {
		UnSub_SelectedMultiData();
	});
</script>

{#if xToggleChart}
	<Chart
		data={PowerChartData}
		height={ChartHeight}
		type={ChartType}
		isNavigable={enableNavigation}
		valuesOverPoints={showValuesOverPoints}
		xIsSeries={xAxisIsSeries}
		{tooltipOptions}
		{axisOptions}
		barOptions={barOptions}
		bind:this={chartRef}
	/>
{:else}
	<Chart
		data={PowerChartData}
		height={ChartHeight}
		type={ChartType}
		isNavigable={enableNavigation}
		valuesOverPoints={showValuesOverPoints}
		xIsSeries={xAxisIsSeries}
		{tooltipOptions}
		{axisOptions}
		barOptions={barOptions}
		bind:this={chartRef}
	/>
{/if}
<button style="font-size:24px" title="Export Chart to SVG image file." on:click={onExport}
	>Export <i class="fas fa-image"></i></button
>
