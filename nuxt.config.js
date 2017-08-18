let data = require('./static/data');
let routes = data.videoList.map((video)=>{return `/video/${video.id}/`});
routes.push('/404');

module.exports = {
	env: {
		canonicalBase: 'http://video.nuclearpixel.com',
		googleAnalyticsId: 'UA-7088806-7'
	},
	transition: {
		name: 'fadeOutRight',
		mode: 'out-in',
		enterActiveClass: "animated fadeInRight",
		leaveActiveClass: "animated fadeOutLeft"
	},
	head: {
		title: "Admiral Potato's Video Portfolio",
		meta: [
			{charset: "UTF-8"},
			{name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"},
		],
		script: [
			{ src: 'https://unpkg.com/mq-genie@1.0.0/mq.genie.min.js'},
		],
		link: [
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Exo+2:400,400italic,800,300,300italic' },
			{ rel: 'stylesheet', href: '/styles.css' },
		]
	},
	plugins: [
		{ src: '~plugins/ga.js', ssr: false }
	],
	generate:{
		routes
	}
};
