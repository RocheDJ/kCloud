<script>
	import TopMenu from '$lib/TopMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import TileItem_1 from '$lib/TileItem_1.svelte';
	import Control from '../pasteurizer/inc/Control.svelte';
</script>

<TopMenu title={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'} />
<div class="box">
	<div class="columns">
		<!-- Left Hand side System Navigation -->
		<div class="column is-one-quarter">
			<SideMenu />
		</div>
		<!-- Right Hand system Display-->
		<div class="column is-three-quarters">
			<div class="box">
				<h1 class="title">Pasteurizer</h1>
			</div>
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
		</div>
	</div>
</div>
