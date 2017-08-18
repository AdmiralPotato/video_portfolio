<template>
	<div class="root">
		<div class="backgroundImage"></div>
		<div class="dots"></div>
		<header class="container">
			<div class="brand">
				<h1><nuxt-link to="/"><em>Video</em>.NuclearPixel.com</nuxt-link></h1>
				<h4>v0.1.1</h4>
			</div>
			<nav>
				<ul>
					<li><nuxt-link to="/">Videos</nuxt-link></li>
					<li><nuxt-link to="/about/">About</nuxt-link></li>
					<li><nuxt-link to="/contact/">Contact</nuxt-link></li>
				</ul>
			</nav>
		</header>
		<div class="page-content">
			<nuxt />
		</div>
	</div>
</template>

<script>
	export default {
		mounted: function () {
			let disableFocusOutlines = function () {
				document.body.classList.remove('keynav');
			};
			let enableFocusOutlines = function (event) {
				if([9, 13].indexOf(event.keyCode) !== -1){
					document.body.classList.add('keynav');
				}
			};
			document.body.addEventListener('mousedown', disableFocusOutlines, true);
			document.body.addEventListener('touchstart', disableFocusOutlines, true);
			document.body.addEventListener('keydown', enableFocusOutlines, true);
		}
	}
</script>
