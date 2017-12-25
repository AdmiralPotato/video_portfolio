<template>
	<div class="container">
		<div class="box forText">
			<h1>This is not a normal video portfolio.</h1>
			<p>I made this because I wanted a place to post my perfectly-looping animations in a fullscreen format with a minimum of visually offensive compression artifacts; and most importantly, I wanted my animations to loop perfectly. No existing video hosting service met my standards.</p>
			<p>So I had to write my own video player to make this what I wanted it to be, and it seems to work in the vast majority of situations I can currently test on.</p>
			<p>Please be aware that the downloads for these animations can be quite large. This place is about quality, not instant gratification - so please have a moment of patience for the art that you're about to experience. I highly encourage putting on some of your favorite music while you enjoy these animations - being perfect loops, they tend to 'synchronize' very well with most rhythms. :)</p>
			<p>Enjoy,<br />- Admiral Potato</p>
		</div>
		<div class="video-list noSelect">
			<div
				v-for="video in videoList"
				class="video-list-item"
				:key="video.id">
				<nuxt-link :to="'/video/' + video.id + '/'">
				<span class="box">
					<span class="thumbHolder"><span class="thumb"><img :src="video.thumb" /></span></span>
					<span class="titleHolder"><span class="title">{{video.title}}</span></span>
				</span>
				</nuxt-link>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		asyncData: function(){
			return import('~/static/data');
		}
	};
</script>
