<script>
    import Panel from '$lib/Panel.svelte';
</script>


<div class="box">
    <h1 class="title">Units</h1>
    <Panel Description={'Power Meters'}
     Ref={'/dashboard/powermeter'} 
     Items={['Line 1', 'Line 2', 'Line 3', 'Total']}
    />

    <Panel
        Description={'Pasto 1'}
        Ref={'/dashboard/pasteurizer'} 
        Items={['Volume', 'Temperature', 'Conductivity', 'Reports']}
    />
</div>