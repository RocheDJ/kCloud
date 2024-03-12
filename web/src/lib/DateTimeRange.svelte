<!-- Date Time Range selection
	\\src\lib\DateTimeRange
-->
<script>
	// external properties

	//import files
	import SveltyPicker from 'svelty-picker';
	import { SelectedDateRange } from '../stores';
	import { onMount } from 'svelte';

	// -----------------------------------------------------------------------
	//local variables
	let activeMode = 'datetime';
	let isRange = true;
	let autocommit = false;
	let format = 'yyyy-mm-dd hh:ii:ss';
	let minuteIncrement = 1;

	let inputClasses = 'input is-primary';
	let value = '';
	let manualInput = true;
	let SelectedRange = {
		StartDate: '2024-03-01 18:00:00',
		EndDate: '2024-03-01 18:00:00',
		IntervalInMin: 1
	};

	// -----------------------------------------------------------------------
	async function UpdateDates() {
		localStorage.setItem('SelectedDateRange', JSON.stringify(SelectedRange));
		SelectedDateRange.set(SelectedRange);
	}
	// -----------------------------------------------------------------------

	async function onChange(event) {
		SelectedRange = {
			StartDate: event.detail[0],
			EndDate: event.detail[1],
			IntervalInMin: 60
		};
		await UpdateDates();
	}
	// -----------------------------------------------------------------------
	async function buttonClick(index) {
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
		SelectedRange = {
			StartDate: dtStart,
			EndDate: dtStop,
			IntervalInMin: 60
		};
		await UpdateDates();
	}
	// -----------------------------------------------------------------------
	onMount(async () => {
		try {
			if (localStorage.SelectedDateRange) {
				const ChartRange = await JSON.parse(localStorage.getItem('SelectedDateRange'));
				value = [ChartRange.StartDate, ChartRange.EndDate];
			}
		} catch (error) {
			console.log('On Mount DTRangeError ' + error);
		}
	});
</script>

<div class="columns">
	<div class="column is-one-third">
		<SveltyPicker
			{inputClasses}
			{format}
			{isRange}
			{minuteIncrement}
			{manualInput}
			bind:value
			on:change={onChange}
		/>
		<i class="fas fa-calendar"> - Select date and time range </i>
	</div>
	<div class="column is-two-thirds">
		<div class="columns">
			<div class="column">
				<div class="select is-primary">
					<select>
						<option>Select Aggregation</option>
						<option>None (RawData)</option>
						<option>Hourly (Average)</option>
						<option>Daily (Average)</option>
					</select>
				</div>
			</div>
			<div class="column">
				<button class="button is-primary" on:click={() => buttonClick(1)}>Today</button>
			</div>
			<div class="column">
				<button class="button is-info" on:click={() => buttonClick(2)}>Yesterday</button>
			</div>
			<div class="column">
				<button class="button is-success" on:click={() => buttonClick(3)}>This Week</button>
			</div>
			<div class="column">
				<button class="button is-warning" on:click={() => buttonClick(4)}>This Month</button>
			</div>
		</div>
	</div>
</div>
