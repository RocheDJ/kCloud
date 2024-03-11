<script lang="ts">
	export let StatusTableData :any =[];
	import { ConvertDT }from '../utils/ConvertDT';

	function CheckIfOnline(LastUpdate :any){
		try {
			const dtNow :Date= new Date();
			const dtLastUpdate :Date = new Date(LastUpdate);
			const msBetweenDates = dtNow.getTime() - dtLastUpdate.getTime();

			const sBetweenDates = Math.floor(msBetweenDates / 1000);
			if 	(sBetweenDates > 190){
				return "Off-Line"
			} else {
				return "On-Line"
			}

		} catch (error) {
			return "Err"
		}
		
	}
</script>

<div class="table-container">
	<table class="table is-fullwidth is-striped">
		<thead>
			<tr>
				<th><abbr title="Installation ID">ID</abbr></th>
				<th><abbr title="Description of Unit">Description</abbr></th>
				<th><abbr title="Last Update Last Data Write from system">Last Update</abbr></th>
				<th><abbr title="Communication Status">Status</abbr></th>
			</tr>
		</thead>
		<tbody>
			{#each StatusTableData as TableRow}
				<tr>
					<th>{TableRow.id}</th>
					<td>{TableRow.Description}</td>
					<td>{ConvertDT(TableRow.Updated)}</td>
					{#if CheckIfOnline(TableRow.Updated) =="On-Line" }
						<td class="has-text-success">ON-Line</td>
					{:else}
						<td class="has-text-danger">OFF-Line</td>
					{/if}
					
				</tr>
			{/each}
		</tbody>
	</table>
</div>
