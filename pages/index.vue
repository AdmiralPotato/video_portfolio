<template>
	<div class="container">
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
