<script>
	// external properties

	//import files
	import SveltyPicker from 'svelty-picker';
	import { SelectedChartInfo } from '../stores';
	import { onMount } from 'svelte';

	// -----------------------------------------------------------------------
	//local variables
	let activeMode = 'datetime';
	let isRange = true;
	let autocommit = true;
	let format = 'yyyy-mm-dd hh:ii:ss';
	let minuteIncrement = 1;
	
	let inputClasses = 'input is-primary';
	let value = '';
	let initialDate;
	let SelectedRange= {
			StartDate: '2024-03-01 18:00:00',
			EndDate: '2024-03-01 18:00:00',
			IntervalInMin: 0
		}

	// -----------------------------------------------------------------------
	function SetNewDates() {
		localStorage.setItem('ChartRange', JSON.stringify(SelectedRange));
		SelectedChartInfo.set(SelectedRange);
	}
	// -----------------------------------------------------------------------

	function onChange() {
		SelectedRange= {
			StartDate: detail[0],
			EndDate: detail[1],
			IntervalInMin: 60
		};
	}
	// -----------------------------------------------------------------------
	function buttonClick(index) {
		var currentTime = new Date();
		var dtStart = '';
		var dtStop = '';
		switch (index) {
			case 1:
				// today
				var sDate = currentTime.toISOString().slice(0, 10);
				dtStart = sDate + ' 00:00:00';
				dtStop = sDate + ' 23:59:59';
				break;

			case 2:
				// yesterday
				currentTime.setDate(currentTime.getDate() - 1);
				var sDate = currentTime.toISOString().slice(0, 10);
				dtStart = sDate + ' 00:00:00';
				dtStop = sDate + ' 23:59:59';
				break;
			case 3:
				// this week
				currentTime.setDate(currentTime.getDate() - 7);
				var sDate = currentTime.toISOString().slice(0, 10);
				dtStart = sDate + ' 00:00:00';
				currentTime.setDate(currentTime.getDate() + 7);
				sDate = currentTime.toISOString().slice(0, 10);
				dtStop = sDate + ' 23:59:59';
				break;
			case 4:
				// this month
				currentTime.setDate(currentTime.getDate() - 30);
				var sDate = currentTime.toISOString().slice(0, 10);
				dtStart = sDate + 'T00:00:00';
				currentTime.setDate(currentTime.getDate() + 30);
				sDate = currentTime.toISOString().slice(0, 10);
				dtStop = sDate + 'T23:59:59';
			default:
			// code block
		}
		
	value = [dtStart, dtStop];
	}
	// -----------------------------------------------------------------------
	onMount(async () => {
		try {
			const ChartRange = JSON.parse(localStorage.getItem('ChartRange'));
			value = [ChartRange.StartDate, ChartRange.EndDate];
		} catch (error) {
			console.log('On Mount DTRangeError ' + error);
		}
	});
</script>

<div class="columns">
	<div class="column is-half">
		<SveltyPicker
			{inputClasses}
			{format}
			{isRange}
			{minuteIncrement}

			bind:value
			on:change={onChange}
		/>
		<i class="fas fa-calendar"> - Select date and time range </i>
	</div>
	<div class="column is-half">
		<button class="button is-primary" on:click={() => buttonClick(1)}>Today</button>
		<button class="button is-info" on:click={() => buttonClick(2)}>Yesterday</button>
		<button class="button is-success" on:click={() => buttonClick(3)}>This Week</button>
		<button class="button is-warning" on:click={() => buttonClick(4)}>This Month</button>
		<button class="button is-danger" on:click={() => SetNewDates()}>Update</button>
	</div>
</div>
