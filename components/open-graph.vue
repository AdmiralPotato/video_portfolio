<template>
	<span v-if="false"></span>
</template>

<script>
	//Test on:
	//  https://cards-dev.twitter.com/validator
	//  https://developers.facebook.com/tools/debug/

	export default {
		props: {
			title: String,
			canonicalUrl: String,
			description: String,
			image: String,
			alt: String
		},
		head: function() {
			return {
				title: this.title,
				link: [
					{ rel: 'canonical', href: this.canonicalUrl },
				],
				meta: [
					{ name: 'og:url', content: this.canonicalUrl },
					{ name: 'og:image', content: this.image },
					{ name: 'og:image:width', content: 1920 },
					{ name: 'og:image:height', content: 1080 },
					{ name: 'og:title', content: this.title },
					{ name: 'og:description', content: this.description },
					{ name: 'og:image:alt', content: this.alt },

					{ name: 'twitter:card', content: 'summary_large_image' },
					{ name: 'twitter:site', content: '@admiral_potato' },
					{ name: 'twitter:title', content: this.title },
					{ name: 'twitter:description', content: this.description },
					{ name: 'twitter:image', content: this.image },
					{ name: 'twitter:image:alt', content: this.alt }
				]
			}
		}
	}
</script>
