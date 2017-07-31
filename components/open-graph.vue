<template>
	<span v-if="false"></span>
</template>

<script>
	import strip from 'strip'

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
			let description = strip(this.description);
			return {
				title: this.title,
				link: [
					{ rel: 'canonical', href: this.canonicalUrl },
				],
				meta: [
					{ property: 'og:url', content: this.canonicalUrl },
					{ property: 'og:image', content: this.image },
					{ property: 'og:image:width', content: 1920 },
					{ property: 'og:image:height', content: 1080 },
					{ property: 'og:title', content: this.title },
					{ property: 'og:description', content: description },
					{ property: 'og:image:alt', content: this.alt },

					{ name: 'twitter:card', content: 'summary_large_image' },
					{ name: 'twitter:site', content: '@admiral_potato' },
					{ name: 'twitter:title', content: this.title },
					{ name: 'twitter:description', content: description },
					{ name: 'twitter:image', content: this.image },
					{ name: 'twitter:image:alt', content: this.alt }
				]
			}
		}
	}
</script>
