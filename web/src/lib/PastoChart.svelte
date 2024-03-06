<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	

	export let ChartTitle = ' Chart Title';
	export let ChartData :any = [{}];
	export let ChartLabels :any = [];
	
	let data = {
		labels: ChartLabels,
		datasets:ChartData
	};
	
</script>

<Chart {data} type={"axis-mixed"} title={ChartTitle} />
