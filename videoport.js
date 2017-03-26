"use strict";

let mixinAddresses = {
	methods: {
		thumbUrl: function(video){
			return `http://root.nuclearpixel.com/video_portfolio_content/${video.name}.jpg`;
		},
		videoUrl: function(video){
			return `http://root.nuclearpixel.com/video_portfolio_content/${video.name}-1920x1080-yuv420p-20000.hevc`;
		},
	}
};

Vue.component(
	'videoport',
	{
		mixins: [mixinAddresses],
		data: function() {
			return {
				width: 0,
				height: 0,
				started: false,
				playing: false,
				loaded: 0,
				decoded: 0,
				ready: false,
				statusMessage: ''
			}
		},
		props: {
			video: Object
		},
		mounted: function() {
			let t = this;
			this.videoport = new Videoport(t.video, t, t.$refs.canvas);
		},
		beforeMount: function () {
			document.addEventListener('resize', resizeWindowEventHandler);
			window.addEventListener('resize', resizeWindowEventHandler);
		},
		beforeDestroy: function () {
			this.videoport.die();
			document.removeEventListener('resize', resizeWindowEventHandler);
			window.removeEventListener('resize', resizeWindowEventHandler);
		},
		methods: {
			toggle: function(event){
				let v = this;
				v.started = true;
				v.playing = !v.playing;
				v.videoport.setPlay(v.playing);
			}
		},
		template: `
			<div class="videoport noSelect" @click="toggle">
				<canvas
					ref="canvas"
					:width="width"
					:height="height"
					/>
					<transition-group name="fade">
						<div key="a" v-if="!ready" class="overlay transition">
							<img v-if="!decoded" :src="thumbUrl(video)" />
							<div class="statusMessage">{{statusMessage}} - Loaded: {{loaded.toFixed(2)}} - Decoded: {{decoded.toFixed(2)}}</div>
						</div>
						<video-status-icon key="b" v-if="!ready && started" type="loading" class="rotating" />
						<video-status-icon key="c" v-if="!started || !playing && ready" type="play" />
					</transition-group>
			</div>
		`
	}
);

Vue.component(
	'video-status-icon',
	{
		props: {
			type: String
		},
		created: function () {
			this.shapes = {
				play: "M112,64A48,48,0,1,1,64,16,48,48,0,0,1,112,64ZM48,43.21539V84.78461a4,4,0,0,0,6,3.4641L90,67.4641a4,4,0,0,0,0-6.9282L54,39.75129A4,4,0,0,0,48,43.21539Z",
				pause: "M52,112H28a4,4,0,0,1-4-4V20a4,4,0,0,1,4-4H52a4,4,0,0,1,4,4v88A4,4,0,0,1,52,112Zm48-96H76a4,4,0,0,0-4,4v88a4,4,0,0,0,4,4h24a4,4,0,0,0,4-4V20A4,4,0,0,0,100,16Z",
				loading: "M100,64A36.00074,36.00074,0,1,0,63.793,99.99942a4.12438,4.12438,0,0,0,4.19154-3.6437A4.00059,4.00059,0,0,0,64,92,28.00073,28.00073,0,1,1,92,64H84.82843a2,2,0,0,0-1.41421,3.41421L94.58579,78.58579a2,2,0,0,0,2.82843,0l11.17157-11.17157A2,2,0,0,0,107.17157,64Z"
			};
		},
		template: `
			<svg class="video-status-icon transition" viewBox="0 0 128 128">
				<path :d="shapes[type]" />
			</svg>
		`
	}
);

let arrayRemove = function(array, item){
	let index = array.indexOf(item);
	if(index !== -1){
		array.splice(index, 1);
	}
	return array;
};

let videoportList = [];

let Videoport = function(video, vue, canvas){
	let p = this;
	p.video = video;
	p.vue = vue;
	p.canvas = canvas;
	p.context = canvas.getContext('2d');
	p.shouldPlay = false;
	p.ready = false;
	p.playOffset = 0;
	p.sizeWindow();
	p.sourceBuffer = decodedFrameBufferMap[p.video.name] || new DecodedFrameBuffer(p.video);
	p.sourceBuffer.addVideoport(p);

	videoportList.push(p);
};

Videoport.prototype = {
	fps: 24,
	die: function(){
		this.sourceBuffer.removeVideoport(this);
		arrayRemove(videoportList, this);
	},
	setPlay: function(shouldPlay){
		this.shouldPlay = shouldPlay;
		this.sourceBuffer.load();
	},
	render: function (time) {
		let p = this;
		if(p.shouldPlay && p.ready){
			let delta = time - (p.lastTimeSample || 0);
			p.playOffset += delta;
			p.setFrameByTime(p.playOffset);
		}
		p.lastTimeSample = time;
	},
	setFrameByTime: function(time){
		let p = this;
		let frames = p.sourceBuffer.frameCount;
		let currentFrame = Math.floor(time / 1000 / (frames / p.fps) * frames) % frames;
		if(currentFrame !== p.prevFrame){
			let sourceImage = p.sourceBuffer.canvasList[currentFrame];
			p.context.drawImage(sourceImage, 0, 0, p.width, p.height);
			p.prevFrame = currentFrame;
		}
	},
	sizeWindow: function () {
		let p = this;
		let ratio = window['devicePixelRatio'] || 1;
		p.width = p.canvas.clientWidth * ratio;
		p.height = p.canvas.clientHeight * ratio;
		p.vue.width = p.width;
		p.vue.height = p.height;
	},
	handleBufferUpdate: function(){
		let p = this;
		let b = p.sourceBuffer;
		let vue = p.vue;
		vue.statusMessage = b.status;
		vue.loaded = b.loaded;
		vue.decoded = b.decoded;
		vue.ready = b.ready;
		p.ready = b.ready;
		let imageIndex = b.ready ? 0 : b.canvasList.length - 1;
		let image = b.canvasList[imageIndex];
		if(image){
			//I guess you can't render to a context the instant it's created?
			requestAnimationFrame(function(){
				p.context.drawImage(image, 0, 0, p.width, p.height);
			});
		}
	}
};

let decodedFrameBufferMap = {};

let DecodedFrameBuffer = function(video){
	let b = this;
	b.url = mixinAddresses.methods.videoUrl(video);
	b.frameCount = parseInt(video.name.split('-').pop(), 10);
	b.started = false;
	b.loaded = 0;
	b.decoded = 0;
	b.ready = false;
	b.status = 'Not loaded';
	b.canvasList = [];
	b.videoportList = [];
	b.decoder = new libde265.RawPlayer(document.createElement('canvas'));
	b.decoder.addFrameBuffer(b);
	decodedFrameBufferMap[video.name] = b;
};

DecodedFrameBuffer.prototype = {
	addVideoport: function(p){
		this.videoportList.push(p);
		this.updateVideoports();
	},
	removeVideoport: function(p){
		arrayRemove(this.videoportList, p);
	},
	updateVideoports: function () {
		let b = this;
		b.videoportList.forEach(function(p){
			p.handleBufferUpdate();
		});
	},
	load: function () {
		let b = this;
		if(!b.started){
			b.status = 'Loading';
			b.started = true;
			b.decoder.playback(b.url);
			this.updateVideoports();
		}
	},
	handleDecoderLoadComplete: function(){
		this.status = 'Loading complete';
		this.loaded = 1;
		this.updateVideoports();
	},
	handleDecoderDecodeStart: function(){
		this.status = 'Decoding started';
		this.updateVideoports();
	},
	handleDecoderFrame: function(frameCanvas){
		let b = this;
		let framesLoaded = b.canvasList.push(frameCanvas);
		b.decoded = framesLoaded / b.frameCount;
		b.lastStoredFrame = frameCanvas;
		b.status = `Decoded ${framesLoaded} / ${b.frameCount} frames`;
		this.updateVideoports();
	},
	handleDecoderFinish: function(){
		this.status = `Ready; Loaded & Decoded`;
		this.ready = true;
		this.decoder = null;
		this.decoded = 1;
		this.updateVideoports();
	}
};

let resizeWindowEventHandler = function () {
		videoportList.forEach(function (item) {
			item.sizeWindow();
		});
	},
	renderAllViews = function (time) {
		videoportList.forEach(function (item) {
			item.render(time);
		});
	};

let go = true,
	start = function(){
		go = true;
		requestAnimationFrame(render);
	},
	stop = function(){
		go = false;
	};

let render = function (time){
	if(go){
		requestAnimationFrame(render);
	}
	renderAllViews(time);
};

start();

let hevcImageInterceptor = function(libde265Image){
	let decoder = this;
	let decodedFrameBuffer = decoder.decodedFrameBuffer;
	let bufferCanvas = document.createElement('canvas');
	let bufferContext = bufferCanvas.getContext('2d');
	let w = libde265Image.get_width();
	let h = libde265Image.get_height();
	bufferCanvas.width = w;
	bufferCanvas.height = h;
	bufferContext.fillStyle = '#000';
	bufferContext.fillRect(0,0,w,h);
	decoder.image_data = bufferContext.createImageData(w, h);
	libde265Image.display(decoder.image_data, function(display_image_data) {
		bufferContext.putImageData(display_image_data, 0, 0);
		decodedFrameBuffer.handleDecoderFrame(bufferCanvas);
		if(!decoder.running){
			decoder.decodedFrameBuffer.handleDecoderFinish();
		}
	});
};

libde265.RawPlayer.prototype.handlerMap = {
	loading: 'LoadComplete',
	initializing: 'DecodeStart'
};
libde265.RawPlayer.prototype.addFrameBuffer = function(decodedFrameBuffer){
	let decoder = this;
	decoder.decodedFrameBuffer = decodedFrameBuffer;
	decoder.set_status_callback(function(msg) {
		let handler = decoder.handlerMap[msg];
		if (handler) {
			decodedFrameBuffer['handleDecoder' + handler]();
		}
	});
};
libde265.RawPlayer.prototype._display_image = hevcImageInterceptor;
