<script>
	export let ChartTitle = ' Chart Title';
	export let ChartType = 'bar';
	import Chart from 'svelte-frappe-charts';

	let data = {
		labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
		yMarkers: [{ label: 'Target', value: 16, options: { labelPos: 'left' } }],
		datasets: [
			{
				name: 'Line 1',
				chartType: ChartType,
				values: [10, 12, 3, 9, 8, 15, 9]
			},
			{
				name: 'Line 2',
				chartType: ChartType,
				values: [12, 10, 13, 19, 8, 11, 12]
			},
			{
				name: 'Line 3',
				chartType: ChartType,
				values: [9, 8, 10, 11, 5, 14, 13]
			}
		]
	};
	
	//type: "axis-mixed", // or 'bar', 'line', 'pie', 'percentage'
</script>

<Chart {data} type={"axis-mixed"} title={ChartTitle} />
