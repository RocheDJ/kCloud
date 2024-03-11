<!-- Dashboard Pasteurizer - Tab 3 Data Table 
	\\src\routes\dashboard\pasteurizer\inc
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { SelectedInstallation, SelectedDateRange } from '../../../../stores';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { ConvertDT }from '../../../../utils/ConvertDT';
	import { kCloudUserService } from '../../../../services/kcloud-user-service';
	import { mkConfig, generateCsv, download, asString } from 'export-to-csv';
	import {
		Engine,
		functionCreateDatatable,
		Pagination,
		RowsPerPage,
		Search,
		Sort
	} from 'svelte-datatables-net';
	//-----------------------------------------------
	let TableData = [{}];
	let mySelectedInstallation;
	let mySelectedDateRange;
	let PVOTitle = 'Temperature';
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';

	//------------------------------------------------------------------------------------------
	let objectDatatable = functionCreateDatatable({
		parData: [{}],
		parRowsPerPage: '30'
	});

	// made from some code found here
	//https://dev.to/karkranikhil/csv-generation-from-json-in-svelte-5cgf

	function MakeDownloadFile(FileData, FileName) {
		var blob = new Blob([FileData]);
		let link = document.createElement('a');
		if (link.download !== undefined) {
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', FileName);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	// mkConfig merges your options with the defaults
	// and returns WithDefaults<ConfigOptions>
	// https://www.npmjs.com/package/export-to-csv
	const csvConfig = mkConfig({ useKeysAsHeaders: true });
	function GenerateCSV() {
		const csv = generateCsv(csvConfig)(TableData);
		const filename = `${csvConfig.filename}.csv`;
		MakeDownloadFile(csv, filename);
	}

	
	//---------------------------------------------------------------------

	SelectedDateRange.subscribe(async (DateRange) => {
		if (DateRange) {
			mySelectedDateRange = DateRange;
			sStart = DateRange.StartDate;
			sStop = DateRange.EndDate;
			await LoadTableData();
		}
	});
	//---------------------------------------------------------------------

	SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});
	//---------------------------------------------------------------------
	const LoadTableData = async () => {
		document.body.style.cursor = 'wait';
		try {
			const TableDataRaw = await kCloudUserService.getPVOValueSpecific(
				mySelectedInstallation.id,
				PVOTitle,
				sStart,
				sStop
			);
			if (TableDataRaw) {
				TableData = [{}];
				if (TableDataRaw.length > 0) {
					for (var PVO of TableDataRaw) {
						const sDateTime = ConvertDT(PVO.EventDate);
						PVO.EventDateString = sDateTime;
					}
					TableData = TableDataRaw;
					objectDatatable = functionCreateDatatable({
						parData: TableData,
						parRowsPerPage: '30'
					});
				} else {
					console.log('LoadTableData Pasto Tab 3 ,No Data select another date range');
				}
			} else {
				alert('Error select another date range');
			}
		} catch (error) {
			console.log('Pasto Tab 3 error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	};

	//----------------------------------------------

	onMount(async () => {
		await LoadTableData();
	});
</script>

<div class="box">
	<DateTimeRange />
	<Engine bind:propDatatable={objectDatatable} />
	<div class="columns">
		<div class="column" >
			<div class="columns">
				<div class="column is-one-fifth" style="background-color:powderblue;">
					<h1 class="content is-medium">Rows Per Page</h1>
				</div>
				<div class="column is-one-fifth"style="background-color:powderblue;">
					<div class="select is-primary">
						<RowsPerPage bind:propDatatable={objectDatatable}>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="30">30</option>
							<option value="50">50</option>
							<option value="all">ALL</option>
						</RowsPerPage>
					</div>
				</div>
				<div class="column is-one-fifth"style="background-color:powderblue;">
					<button style="font-size:24px" title="Export data to CSV file." on:click={GenerateCSV}
						>Export<i class="fas fa-file-csv"></i></button
					>
				</div>
			</div>
			<div class="columns">
				<div class="column is-three-fifths" style="background-color:powderblue;">
					<Pagination bind:propDatatable={objectDatatable} propSize="medium" />
				</div>
			</div>
		</div>
	</div>

	<!--<div class="table-container is-fullwidth">-->
	<!-- Your table content -->
	<table class="table is-striped is-fullwidth is-scrollable">
		<thead>
			<tr>
				<th
					><Sort bind:propDatatable={objectDatatable} propColumn={'EventDate'}>Date - Time</Sort
					></th
				>
				<th>Value </th>
			</tr>
		</thead>
		<tbody>
			{#each objectDatatable.arrayData as row}
				<tr>
					<td>{row.EventDateString}</td>
					<td>{row.Value}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
