<script lang="ts">
	export let userInstallationsList =[1,2];
</script>

<div class="table-container">
	<table class="table is-fullwidth">
		<thead>
			<tr>
				<th><abbr title="Installation ID">ID</abbr></th>
				<th><abbr title="Description">Disc</abbr></th>
				<th><abbr title="Last Update">Up-Date</abbr></th>
				<th><abbr title="Communication Status">Status</abbr></th>
				<th><abbr title="Error">Err</abbr></th>
			</tr>
		</thead>
		<tfoot>
			<tr>
				<th><abbr title="Installation ID">ID</abbr></th>
				<th><abbr title="Description">Disc</abbr></th>
				<th><abbr title="Last Update">Up-Date</abbr></th>
				<th><abbr title="Communication Status">Status</abbr></th>
			</tr>
		</tfoot>
		<tbody>
			{#each userInstallationsList as Installation}
				<tr>
					<th>{Installation.id}</th>
					<td>{Installation.Description}</td>
					<td>{Installation.Updated}</td>
					<td>TBD</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
