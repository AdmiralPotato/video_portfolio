import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

export default ({ app: { router }, store }) => {
	Vue.use(
		VueAnalytics,
		{
			id: 'UA-7088806-7',
			autoTracking: {
				exception: true
			},
			router: router
		}
	);
};
