<template>
	<div class="container">
		<div class="box forText">
			<h1 v-if="error.statusCode === 404">Page not found</h1>
			<h1 v-else>An error occurred</h1>
			<p><nuxt-link to="/">Home page</nuxt-link></p>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['error']
	}
</script>
