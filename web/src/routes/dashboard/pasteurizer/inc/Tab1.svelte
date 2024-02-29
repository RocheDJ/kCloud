<script>
    import TileItem_1 from '$lib/TileItem_1.svelte';
	import Control from './Control.svelte';
</script>

<div class="columns">
    <!-- Machine image-->
    <div class="column is-half">
        <div class="box">
            <img src="/Pasto_1.png" alt="pasto" />
        </div>
    </div>
    <!-- Machine Values-->
    <div class="column is-half">
        <div class="box">
            <TileItem_1 Title={'Volume'} Value={1000} Unit={'Ltr'} />
            <TileItem_1 Title={'Temperature'} Value={4.3} Unit={'Deg C'} />
            <TileItem_1 Title={'Agitator'} Value={0} Unit={'0/1'} />
        </div>
    </div>
</div>
<!-- Machine control -->
<Control />