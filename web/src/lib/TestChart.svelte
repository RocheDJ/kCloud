<script>
	export let ChartTitle = ' Chart Title';
	export let ChartType = 'bar';
	import Chart from 'svelte-frappe-charts';

	let data = {
		labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat','Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
		yMarkers: [{ label: 'Target', value: 16, options: { labelPos: 'left' } }],
		datasets: [
			{
				name: 'Line 1',
				type: ChartType,
				values: [10, 12, 3, 9, 8, 15, 9,10, 12, 3, 9, 8, 15, 9],
				isNavigable:1 
			},
			{
				name: 'Line 2',
				type: ChartType,
				values: [12, 10, 13, 19, 8, 11, 12,12, 10, 13, 19, 8, 11, 12],
				isNavigable:1 
			},
			{
				name: 'Line 3',
				type: ChartType,
				values: [9, 8, 10, 11, 5, 14, 13,12, 10, 13, 19, 8, 11, 12],
				isNavigable:1 
			}
		],
		
	};
	
	//type: "axis-mixed", // or 'bar', 'line', 'pie', 'percentage'
</script>

<Chart {data} type={"axis-mixed"} title={ChartTitle} />
