import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
let analyticsId = process.env.googleAnalyticsId;

export default ({ app: { router }, store }) => {
	Vue.use(
		VueAnalytics,
		{
			id: analyticsId,
			autoTracking: {
				exception: true
			},
			router: router
		}
	);
};
