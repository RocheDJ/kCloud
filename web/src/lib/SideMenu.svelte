<script lang="ts">
    import Panel from '$lib/Panel.svelte';
    const kCloudInstallations : any = localStorage.getItem("kCloudInstallations");
    const InstallationData = JSON.parse(kCloudInstallations);
</script>


<div class="box">

	{#each InstallationData as Installation}
        <h1 class="title">Units</h1>
            <Panel Description={Installation.Description}
                   InstallationId={Installation.id}
                   InstallationType={Installation.Type}
            Ref='/dashboard/'
            Items={['Line 1', 'Line 2', 'Line 3', 'Total']}
            />
	{/each}


</div>