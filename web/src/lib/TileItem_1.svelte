<script>
	  export let Title = 'Title';
    export let SubTitle = '';
	  export let Value = 123.4;
    export let Unit = 'kWh';
</script>

<div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p class="title is-4 has-background-info-dark has-text-info-light">{Title}</p>
        <p class="subtitle"> {SubTitle}</p>
        <div class="content">
          <h1>{Value} - {Unit}</h1>
        </div>
      </article>
    </div>
  </div>