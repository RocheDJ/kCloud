<!-- Chart For Power meters - Frappe Charts
	\\src\lib\PowerChart
-->
<script lang="ts">
	//---------------------- import variables-----------
	import Chart from 'svelte-frappe-charts';
	import { SelectedMultiData } from '../stores';
	import { onDestroy } from 'svelte';
	//---------------------- settable variables-----------
	export let ChartType = "bar";
	export let ChartUnit = '-';
	//--------------------------------------------------------------------
	// https://frappe.io/charts/docs/reference/configuration#axisoptions
	let enableNavigation = false;
	let ChartHeight = 450;
	let showValuesOverPoints = true;
	let xAxisIsSeries = 1;
	let chartRef;

	const tooltipOptions = {
		formatTooltipX: (d, i) => {
			(d) => (d + '').toUpperCase();
			return `<strong style="display: block; margin-bottom: 5px;color: #067df3">${d}</strong>`;
		},
		formatTooltipY: (d) => d 
	};

	//------------------------------------------------------------
	let PowerChartData

	let dummydata = {
    labels: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon" ],
    datasets: [
       { 
		name:'set 1',
		values: [ 300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710 ] 
	   },
	   { 
		name:'set 2',
		values: [ 300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710 ] 
	   },
	   { 
		name:'set 3',
		values: [ 300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710 ] 
	   },
	   { 
		name:'set 4',
		values: [ 300, 250, 720, 560, 370, 610, 690, 410, 370, 480, 620, 260, 170, 510, 630, 710 ] 
	   },
    ],
  };
	//------------------------------------------------------------
	//export chart to svg
	const onExport = () => chartRef.exportChart();

	

	//-------------------------------------------------------
	async function refreshChart(MultiData: any[]) {
		PowerChartData = MultiData;
		//chartRef.update(dummydata);
		await chartRef.update(PowerChartData);
	}

	//------------------------------------------------------------
	const UnSub_SelectedMultiData = SelectedMultiData.subscribe(async (MultiData) => {
		if (MultiData) {
			await refreshChart(MultiData);
		}
	});
	//------------------------------------------------------------
	onDestroy(() => {
		UnSub_SelectedMultiData();
	});
</script>

<Chart
	data={PowerChartData}
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
