let data = require('./static/data');
let routes = data.videoList.map((video)=>{return '/video/' + video.id});

module.exports = {
	transition: {
		name: 'fadeOutRight',
		mode: 'out-in',
		enterActiveClass: "animated fadeInRight",
		leaveActiveClass: "animated fadeOutLeft"
	},
	head: {
		meta: [
			{charset: "UTF-8"},
			{name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"},
		],
		script: [
			{ src: 'https://unpkg.com/fullscreen-api-polyfill@1.1.2' },
			{ src: 'https://unpkg.com/mq-genie@1.0.0/mq.genie.min.js'},
		],
		link: [
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Exo+2:400,400italic,800,300,300italic' },
			{ rel: 'stylesheet', href: 'https://unpkg.com/animate.css@3.5.2' },
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