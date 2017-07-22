"use strict";

let VideoDetail = Vue.component(
	'video-detail',
	{
		created: function(){
			this.video = videoMap[this.$route.params.videoName];
			if(!this.video){
				console.log('Video not found.');
				router.replace('/');
				router.go('/');
			} else {
				let screenHasHdManyPixels = (Math.max(screen.width, screen.height) * window.devicePixelRatio) > 960;
				this.src = screenHasHdManyPixels ? this.video.path_1920 : this.video.path_1920;
			}
		},
		components: {VuePerfectlooper: VuePerfectlooper},
		template: `
			<div class="video-detail" v-if="video">
				<div class="video-theatre">
					<div class="container">
						<vue-perfectlooper
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
		`
	}
);
