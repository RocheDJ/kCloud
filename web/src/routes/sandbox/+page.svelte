<script>
	import { user } from '../../stores.js';
	import SignupLogin from '$lib/SignupLogin.svelte';
	import Logout from '$lib/Logout.svelte';
	export let title = 'kCloud Portal';
	export let subTitle = 'by David Roche for Kilderry V1.0.24083';
	// Append the following
	// Navigation component
	let active = false;
	let sActive = '';
	function myFunction(element) {
		active = !active;
		if (active) {
			sActive = 'is-active';
		} else {
			sActive = '';
		}
	}
</script>

<div class="box is-fluid">
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<!-- Logo  -->
		<div class="navbar-brand">
			<a class="navbar-item" href="http://www.kilderry.ie">
				<img src="/LoGo0016.png" width="112" height="32" alt="logo" />
			</a>
		</div>
		<!-- nav menu  -->
		<div class="navbar-end">
			<!-- svelte-ignore a11y-interactive-supports-focus -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				role="button"
				class="navbar-burger {sActive}"
				on:click={myFunction}
				data-target="navMenu"
				aria-label="menu"
				aria-expanded="false"
			>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div id="navbar" class="navbar-menu {sActive}">
			<!-- nav menu  -->
			<div class="navbar-start ">
				{#if $user.email}
					<a class="navbar-item" href="/home"> Home </a>
					<a class="navbar-item" href="/dashboard"> Overview </a>
					<div class="navbar-item has-dropdown is-hoverable">
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="navbar-link"> More </a>
						<div class="navbar-dropdown">
							<a class="navbar-item" href="/about"> About </a>
							<a class="navbar-item" href="/contact"> Contact </a>
							<hr class="navbar-divider" />
							<a class="navbar-item" href="/scratch"> Report an issue </a>
						</div>
					</div>
				{:else}
					<div class="column">
						<div class="title is-1"> {title}</div>
						<div class="subtitle is-5">{subTitle}</div>
					</div>
				{/if}
			</div>

			<!-- title menu  -->
			<div class="navbar-middle">
				{#if $user.email}
					<div>
						<div class="title is-5">{title}</div>
						<div class="subtitle is-7">{subTitle}</div>
					</div>

					<p class="subtitle is-7">{$user.email}</p>
				{/if}
			</div>
			{#if $user.email}
				<Logout />
			{:else}
				<SignupLogin />
			{/if}
		</div>
	</nav>
</div>
