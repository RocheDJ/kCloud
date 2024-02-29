<script>
	  export let Title = ['Title','Title','Title'];
    export let SubTitle = ['Sub','Sub','Sub'];
	  export let Value = [123.4,123.4,123.4];
    export let Unit = ['kWh','kWh','kWh'];
</script>

<div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p class="title is-4 has-background-info-dark has-text-info-light">{Title[0]}</p>
        <p class="subtitle"> {SubTitle[0]}</p>
        <div class="content">
          <h1>{Value[0]} - {Unit[0]}</h1>
        </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p class="title is-4 has-background-info-dark has-text-info-light">{Title[1]}</p>
        <p class="subtitle"> {SubTitle[1]}</p>
        <div class="content">
          <h1>{Value[1]} - {Unit[1]}</h1>
        </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child box ">
        <p class="title is-4 has-background-info-dark has-text-info-light" >{Title[2]}</p>
        <p class="subtitle "> {SubTitle[2]}</p>
        <div class="content">
          <h1>{Value[2]} - {Unit[2]}</h1>
        </div>
      </article>
    </div>
  </div>