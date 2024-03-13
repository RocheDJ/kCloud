<!-- Dashboard Pasteurizer - Tab 3 Data Table 
	\\src\routes\dashboard\pasteurizer\inc
-->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SelectedInstallation, SelectedDateRange, Titles_ } from '../../../../stores';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { ConvertDT, GetMonth, roundToX, Number_to_Ordinal } from '../../../../utils/ConvertDT';
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
	let SelectedTitles = [];
	let sStart = '2024-03-03 17:30:00';
	let sStop = '2024-03-03 17:39:59';
	let PVOTitle = '--';
	let PVOColumHeader = '';
	let MinColumHeader = '';
	let MaxColumHeader = '';
	let sInterval = 'none';
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
	const UnSub_SelectedDateRange = SelectedDateRange.subscribe(async (DateRange) => {
		if (DateRange) {
			mySelectedDateRange = DateRange;
			sStart = mySelectedDateRange.StartDate;
			sStop = mySelectedDateRange.EndDate;
			sInterval = mySelectedDateRange.Interval;
			await LoadTableData();
		}
	});
	//---------------------------------------------------------------------
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
		}
	});

	//------------------------------------------------------------------
	// what happens when there is a change in selected titles
	const UnSub_Titles_ = Titles_.subscribe(async (value) => {
		if (value) {
			SelectedTitles = value;
			if (SelectedTitles.length > 0) {
				await LoadTableData();
			}
		}
	});
	//---------------------------------------------------------------------
	const SelectSinglePVOTitle = () => {
		// return the first one that is enabled
		try {
			for (let index = 0; index < SelectedTitles.length; index++) {
				const element = SelectedTitles[index];
				if (element.Enabled) {
					return element.Title;
				}
			}
			return '-';
		} catch (error) {
			return '-';
		}
	};

	//---------------------------------------------------------------------
	const LoadTableData = async () => {
		document.body.style.cursor = 'wait';
		try {
			if (SelectedTitles.length > 0) {
				PVOTitle = SelectSinglePVOTitle();
				const TableDataRaw = await kCloudUserService.getPVOValueSpecific(
					mySelectedInstallation.id,
					PVOTitle,
					sStart,
					sStop,
					sInterval
				);
				if (TableDataRaw) {
					TableData = [{}];
					if (TableDataRaw.err) {
						alert('Load Table Data Error ' + TableDataRaw.err);
					} else {
						// load data to chart based on interval
						switch (sInterval) {
							case 'hourly': {
								for (var PVO of TableDataRaw) {
									const sDateTime =
										GetMonth(PVO.MM) + ' ' + Number_to_Ordinal(PVO.DD) + ' ' + PVO.HH + 'h';
									const fValue = roundToX(PVO.AvgVal, 1);
									PVO.EventDate = sDateTime;
									PVO.Value = fValue;
									PVO.MinVal = roundToX(PVO.MinVal, 1);
									PVO.MaxVal = roundToX(PVO.MaxVal, 1);
								}
								PVOColumHeader = 'Hourly Average ' + PVOTitle;
								MinColumHeader = 'Hourly Minimum  ' + PVOTitle;
								MaxColumHeader = 'Hourly Maximum ' + PVOTitle;
								break;
							}
							case 'daily': {
								for (var PVO of TableDataRaw) {
									const sDateTime = GetMonth(PVO.MM) + ' ' + Number_to_Ordinal(PVO.DD);
									const fValue = roundToX(PVO.AvgVal, 1);
									PVO.EventDate = sDateTime;
									PVO.Value = fValue;
									PVO.MinVal = roundToX(PVO.MinVal, 1);
									PVO.MaxVal = roundToX(PVO.MaxVal, 1);
								}
								PVOColumHeader = 'Daily Average ' + PVOTitle;
								MinColumHeader = 'Daily Minimum  ' + PVOTitle;
								MaxColumHeader = 'Daily Maximum ' + PVOTitle;
								break;
							}
							default: {
								for (var PVO of TableDataRaw) {
									const sDateTime = ConvertDT(PVO.EventDate);
									const fValue = roundToX(PVO.Value, 1);
									PVO.EventDate = sDateTime;
									PVO.Value = fValue;
									PVO.MinVal = roundToX(PVO.Value, 1);
									PVO.MaxVal = roundToX(PVO.Value, 1);
									PVOColumHeader=PVOTitle;
									MinColumHeader = '';
									MaxColumHeader = '';
								}
								break;
							}
						}

						TableData = TableDataRaw;
						objectDatatable = functionCreateDatatable({
							parData: TableData,
							parRowsPerPage: '30'
						});
					}
				} else {
					alert('Error select another date range');
				}
			} else {
				alert('Select a PVO variable');
			}
		} catch (error) {
			console.log('Pasto Tab 3 error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	};

	//----------------------------------------------

	onMount(async () => {
		//	await LoadTableData();
	});
	//----------------------------------------------
	onDestroy(() => {
		UnSub_SelectedDateRange();
		UnSub_Titles_();
		UnSub_SelectedInstallation();
		console.log('Tab 3 On Destroy called');
	});
</script>

<div class="box">
	<DateTimeRange />
	<Engine bind:propDatatable={objectDatatable} />
	<div class="columns">
		<div class="column">
			<div class="columns">
				<div class="column is-one-fifth" style="background-color:powderblue;">
					<h1 class="content is-medium">Rows Per Page</h1>
				</div>
				<div class="column is-one-fifth" style="background-color:powderblue;">
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
				<div class="column" style="background-color:powderblue;">
					<button style="font-size:24px" title="Export data to CSV file." on:click={GenerateCSV}
						>Export<i class="fas fa-file-csv"></i></button
					>
				</div>
			</div>
			<div class="columns">
				<div class="column" style="background-color:powderblue;">
					<Pagination bind:propDatatable={objectDatatable} propSize="medium" />
				</div>
			</div>
		</div>
	</div>

	<!-- Table content -->
	<table class="table is-striped is-fullwidth is-scrollable">
		<thead>
			<tr>
				<th
					><Sort bind:propDatatable={objectDatatable} propColumn={'EventDate'}>Date - Time</Sort
					></th
				>
				<th>{PVOColumHeader}</th>
				{#if MinColumHeader != ''}
					<th>{MinColumHeader}</th>
				{/if}
				{#if MaxColumHeader != ''}
					<th>{MaxColumHeader}</th>
				{/if}
				
			</tr>
		</thead>
		<tbody>
			{#each objectDatatable.arrayData as row}
				<tr>
					<td>{row.EventDate}</td>
					<td>{row.Value}</td>
					{#if MinColumHeader != ''}
						<td>{row.MinVal}</td>
					{/if}
					{#if MaxColumHeader != ''}
						<td>{row.MaxVal}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
