<script>
	import TopMenu from '$lib/TopMenu.svelte';
    import LoginForm from '$lib/LoginForm.svelte';
</script>

<TopMenu title ={' Kilderry Instruments Ltd'} subTitle={' kCloud Portal V 0.0.1'}/>


<div class="box" >
   <div class="columns">
      <div class="column has-text-centered">
        <div class="box">
            <img alt="Kilderry" src="/29021.jpg" width="650" style="display: block;"/>
            <a href="http://www.freepik.com">Designed by macrovector / Freepik</a>
        </div>
         
      </div>
      <div class="column">
          <div class="box">
              <h1 class="title">Login</h1>
              <LoginForm />
          </div>
      </div>
   </div>

</div>
