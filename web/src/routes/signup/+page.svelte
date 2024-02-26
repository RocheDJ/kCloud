<script>
	import TopMenu from '$lib/TopMenu.svelte';
	import SignupForm from '$lib/SignupForm.svelte';
</script>

<TopMenu title ={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'}/>

<div class="box">
	<div class="columns">
		<div class="column">
			<div class="box">
				<h1 class="title">Sign Up</h1>
				<SignupForm />
			</div>
		</div>
		<div class="column has-text-centered">
			<img alt="Modbus PLC" src="/11.jpg" width="450" />
		</div>
	</div>
</div>
