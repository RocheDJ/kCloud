<script>
	import TopMenu from '$lib/TopMenu.svelte';
    import LoginForm from '$lib/LoginForm.svelte';
</script>

<TopMenu title ={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'}/>


<div class="box" >
   <div class="columns">
      <div class="column has-text-centered">
          <img alt="Kilderry" src="/KilDerryLogo.png" width="300" />
      </div>
      <div class="column">
          <div class="box">
              <h1 class="title">Login</h1>
              <LoginForm />
          </div>
      </div>
   </div>

</div>
