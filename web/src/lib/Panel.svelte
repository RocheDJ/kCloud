<script>
	export let Description = 'Test Description';
	export let Items = ['Item 0', 'Item 1', 'Item 2'];
	export let Ref = '#';
</script>

<nav class="panel">
	<p class="panel-heading">
		<span class="panel-icon">
			<i class="fas fa-industry"></i>
		</span>
		<a href={Ref} data-action="collapse">{Description}</a>
	</p>
	<div id="{Description}" class="is-collapsible is-active">
		<!-- Wrapper Div to be able to collapse/expand Panel's content -->
		
		<label class="panel-block">
            <span class="panel-icon">
				<i class="fas fa-chart-bar" aria-hidden="true"></i>
			</span>
			<input type="checkbox" checked/>
			{Items[0]}
		</label>
        <label class="panel-block">
            <span class="panel-icon">
				<i class="fas fa-chart-bar" aria-hidden="true"></i>
			</span>
			<input type="checkbox" checked/>
			{Items[1]}
		</label>
		
		<label class="panel-block">
            <span class="panel-icon">
				<i class="fas fa-chart-bar" aria-hidden="true"></i>
			</span>
			<input type="checkbox" checked/>
			{Items[2]}
		</label>

        <label class="panel-block">
            <span class="panel-icon">
				<i class="fas fa-book" aria-hidden="true"></i>
			</span>
			<input type="checkbox" checked/>
			{Items[3]}
		</label>
	</div>
</nav>
