<script lang="ts">
	export let StatusTableData :any =[];
</script>

<div class="table-container">
	<table class="table is-fullwidth">
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
					<td>{TableRow.Updated}</td>
					<td>TBD</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
