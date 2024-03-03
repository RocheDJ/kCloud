<script lang="ts">
	import { kCloudUserService } from '../../../../services/kcloud-user-service';

	export let InstallationID: number = 0;

	let CDOCall ;
	// What happens when we click on the button
	async function handleClick(event: any) {
		const Index = event.currentTarget.id;
		const Value = event.currentTarget.value;
		const DateTime = Date.now();
		const CDOData = {
			InstallationID: InstallationID,
			requestDate: DateTime,
			requestType: 1,
			Version: 1.01,
			jData: {
				output: 'trigger',
				index: Index,
				value: Value
			},
			userID: 1001
		};
		console.log(CDOData.jData.index + " Value = " + CDOData.jData.value +" InstallationID = " +InstallationID);

		CDOCall = await kCloudUserService.postCommand(CDOData);

		console.log(" Called ID = " + CDOCall.data.id);
	};
</script>

<div class="box">
	<div class="columns">
		<div class="column is-quarter">
			<button class="button is-primary is-rounded" id="1" value=1 on:click={handleClick}>Sequence Start</button>
		</div>
		<div class="column is-quarter">
			<button class="button is-danger is-rounded" id="2" value=1 on:click={handleClick}>Sequence Stop</button>
		</div>
		<div class="column is-quarter">
			<button class="button is-success is-rounded" id="3" value=1 on:click={handleClick}>Agitator Start</button>
		</div>
		<div class="column is-quarter">
			<button class="button is-danger is-rounded" id="4" value=1 on:click={handleClick}>Agitator Stop</button>
		</div>
	</div>
</div>
