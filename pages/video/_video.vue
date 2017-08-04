<template>
	<div class="video-detail" v-if="video">
		<open-graph
			:alt="'A perfectly looping animation, titled: ' + video.title"
			:title="'Animation: ' + video.title"
			:image="video.ogPreview"
			:description="video.description"
			:canonicalUrl="canonicalUrl"
		/>
		<div class="video-theatre">
			<div class="container">
				<vue-perfectlooper
					v-if="src"
					:id="video.id"
					:poster="video.poster"
					:src="src"
					:frames="video.frames"
				/>
			</div>
		</div>
		<div class="theatre-fade"></div>
		<div class="video-description">
			<div class="container">
				<div class="box forText"><h1>{{video.title}}</h1></div>
				<div class="box forText" v-html="video.description"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import VuePerfectlooper from 'vue-perfectlooper';
	import OpenGraph from '~/components/open-graph.vue'

	export default {
		components: {VuePerfectlooper, OpenGraph},
		asyncData: function(context, callback){
			import('~/static/data').then(function (data) {
				let videoName = context.params.video;
				let video = data.videoMap[videoName];
				if(!video){
					context.error({
						statusMessage: 'Video not found',
						statusCode: 404
					});
				}
				callback(null, {
					video,
					canonicalUrl: context.env.canonicalBase + context.route.path
				});
			});
		},
		data: function () {
			return {
				src: ''
			}
		},
		mounted: function(){
			this.src = this.video.path_1920;
		}
	};
</script>
