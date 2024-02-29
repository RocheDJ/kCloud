<script>
	import SveltyPicker from 'svelty-picker';
	let activeMode = 'datetime';
	let isRange = true;
	let autocommit = true;
	let format = 'yyyy-mm-dd hh:ii:ss';
	let minuteIncrement = 15;
	let inputClasses = 'input is-primary';
	/**
	 * @type {any}
	 */
	let value;
</script>

<div class="columns">
	<div class="column is-half">
			<SveltyPicker {inputClasses} {format} {isRange} {minuteIncrement} bind:value />
            <i class="fas fa-calendar"> - Select date and time range </i>
	</div>
    <div class="column is-half">
        <button class="button is-primary is-focused">Today</button>
        <button class="button is-info is-focused">This week</button>
        <button class="button is-success is-focused">This month</button>
        <button class="button is-warning is-focused">This year</button>
</div>
</div>
