<!-- Dashboard Pasteurizer - Tab 3 Data Table 
	\\src\routes\dashboard\pasteurizer\inc
-->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SelectedInstallation, SelectedDateRange, Titles_ } from '../../../../stores';
	import DateTimeRange from '$lib/DateTimeRange.svelte';
	import { ConvertDT } from '../../../../utils/ConvertDT';
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
	let dataFields = [];
	let dataValues = [];

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
	const UnSub_SelectedInstallation = SelectedInstallation.subscribe(async (Installation) => {
		if (Installation) {
			mySelectedInstallation = Installation;
			await LoadTableData();
		}
	});
	//----------------------------------------------------------------------------
	function JSON_Report_To_String(jData) {
		var retVal: String = '';
		var myObject = jData;
		let fields = Object.keys(myObject);
		let values = Object.values(myObject);

		for (var x = 0; x < values.length; x++) {
			retVal = retVal + fields[x] + ': ' + values[x] + ','
		}
		dataFields = fields;
		dataValues = values;
		return retVal;
	}
	//---------------------------------------------------------------------
	function GetPastoReportType(iReportType: any) {
		var retVal = '-';
		switch (iReportType) {
			case 0: {
				//statements;
				retVal = 'Not used';
				break;
			}
			case 1: {
				//statements;
				retVal = 'Alarm';
				break;
			}
			case 2: {
				//statements;
				retVal = 'Batch Start';
				break;
			}
			case 3: {
				//statements;
				retVal = 'Batch Stop';
				break;
			}
			default: {
				retVal = 'Unknown';
				break;
			}
		}
		return retVal;
	}

	//---------------------------------------------------------------------
	const LoadTableData = async () => {
		document.body.style.cursor = 'wait';
		try {
			if (mySelectedInstallation) {
				const TableDataRaw = await kCloudUserService.getPDOValue(mySelectedInstallation.id);
				if (TableDataRaw) {
					TableData = [{}];
					if (TableDataRaw.err) {
						alert('Load Table Data Error ' + TableDataRaw.err);
					} else {
						// load data to chart based on interval
						for (var PDO of TableDataRaw) {
							const sDateTime = ConvertDT(PDO.EventDate);
							const sPastoReportType = GetPastoReportType(PDO.StructureID);
							PDO.EventDate = sDateTime;
							PDO.ReportType = sPastoReportType;
							const jdPDO = JSON_Report_To_String(PDO.jData);
							//PDO.ReportData = jdPDO;
							PDO.ReportHeaders = dataFields;
							PDO.ReportValues = dataValues;
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
				alert('Select an Installation');
			}
		} catch (error) {
			console.log('Pasto Tab 4 error ' + error);
		} finally {
			document.body.style.cursor = 'default';
		}
	};

	//----------------------------------------------

	onMount(async () => {
		await LoadTableData();
	});
	//----------------------------------------------
	onDestroy(() => {
		UnSub_SelectedInstallation();
		console.log('Tab 4 On Destroy called');
	});
</script>

<div class="box">
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
					><Sort bind:propDatatable={objectDatatable} propColumn={'EventDate'}>Date - Time</Sort>
				</th>
				<th>Report Type</th>
				<th rowspan="2">Data</th>
			</tr>
		</thead>
		<tbody>
			{#each objectDatatable.arrayData as row}
				<tr>
					<td>{row.EventDate}</td>
					<td>{row.ReportType}</td>
					<td>
						<table>
							<tr>
								<th>{row.ReportHeaders}</th>
							</tr>
							<tr>
								<td>{row.ReportValues}</td>
							</tr>
						</table>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
