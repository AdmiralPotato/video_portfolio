<template>
	<div class="video-detail" v-if="video">
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

	export default {
		components: {VuePerfectlooper},
		asyncData: function(context, callback){
			import('~static/data').then(function (data) {
				let videoName = context.params.video;
				let video = data.videoMap[videoName];
				if(!video){
					context.error({
						statusMessage: 'Video not found',
						statusCode: 404
					});
				}
				callback(null, {video});
			});
		},
		data: function () {
			return {
				video: this.video,
				src: ''
			}
		},
		mounted: function(){
			let screenHasHdManyPixels = (Math.max(screen.width, screen.height) * window.devicePixelRatio) > 960;
			this.src = screenHasHdManyPixels ? this.video.path_1920 : this.video.path_1920;
		}
	};
</script>
