<script lang="ts">
	import { onMount } from 'svelte';
	import { SelectedInstallation, SelectedData } from '../../../../stores';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';

	//---------------------------------------------------------------------
	let TableDataRaw = [{}];
	let mySelectedInstallation;
	let PVOTitle = 'Temperature';
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';
	let sDTTest = ConvertDT(sStart);

	//---------------------------------------------------------------------
	// test
	// Accepts "2024-08-06 11:00:00" <-- This is UTC timestamp
	function ConvertDT(utcDate) {


    let date = new Date(utcDate);
		if (date.toString() === 'Invalid Date'){
      const formattedUtc = utcDate.split(' ').join('T') + 'Z';
		  date = new Date(formattedUtc);
    }
		if (date.toString() === 'Invalid Date') return 'N/A';

		let dateString = date.toLocaleDateString('en-GB', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
		let timeString = date.toLocaleTimeString('en-GB', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: true
		});
		let formattedDate = dateString + ' | ' + timeString;
		return formattedDate; // Returns "August 6, 1998 | 11:00 AM" <-- This is converted to client time zone.
	}

	//---------------------------------------------------------------------

	SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});

	//---------------------------------------------------------------------
	const LoadTableData = async () => {
		TableDataRaw = await kCloudUserService.getPVOValueSpecific(
			mySelectedInstallation.id,
			PVOTitle,
			sStart,
			sStop
		);
		for (var PVO of TableDataRaw) {
      const sDateTime = ConvertDT(PVO.EventDate);
			PVO.EventDateString=sDateTime;
		}
		if (TableDataRaw.length == 0) {
			alert('No Data For this !');
		}
	};

	//----------------------------------------------

	onMount(async () => {
		await LoadTableData();
	});
</script>

<div class="box">
	<DateTimeRange />
	{sDTTest}
	<div class="table-container">
		<!-- Your table content -->
		<table class="table is-striped is-fullwidth">
			<thead>
				<tr>
					<th>Date</th>
					<th>Value </th>
				</tr>
			</thead>

			<tbody>
				{#each TableDataRaw as PVO}
					<tr>
						<td>{PVO.EventDateString}</td>
						<td>{PVO.Value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<i class="fas fa-file-csv"></i>
</div>
