<template>  
	<div class="player" v-show="playlist.length">
		<transition name="normal"
				@enter="enter"
				@after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
                           
        >
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img :src="currentSong.img">
				</div>
				<div class="top">
					<div class="back">
						<i class="iconfont icon-jiantouarrow483" @click="back"></i>
					</div>
					<h2 v-html="currentSong.songname"></h2>
					<h3 v-html="currentSong.singername"></h3>
				</div>
				<div class="middle">
					<div class="middle-left">
						<div class="image-wrapper" ref="imgWrapper">
							<img :src="currentSong.img" :class="rotateState">
						</div>
						<div class="lyric-wrapper">暂无歌词</div>
					</div>
					<div class=""></div>
				</div>
				<div class="bottom" ref="bottom">
					<div class="progress-wrapper">
						<span class="time">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percentage="percentage" @percentChange="percentChange"></progress-bar>
						</div>
						<span class="time">{{format(currentSong.duration)}}</span>
					</div>
					<div class="control-wrapper">
						<div class="icon">
							<i class="iconfont" :class="modeIcon" @click="changeMode"  ref="mode"></i>
						</div>
						<div class="icon">
							<i class="iconfont icon-shangyishou" @click="prevSong"></i>
						</div>
						<div class="icon center">
							<i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
						</div>
						<div class="icon">
							<i class="iconfont icon-xiayishou" @click="nextSong"></i>
						</div>
						<div class="icon">
							<i class="iconfont" :class="getLikeIcon(currentSong)" @click="toggleFavorite(currentSong)" ref="favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :src="currentSong.img" :class="rotateState">
				</div>
				<div class="text">
					<h3 v-html="currentSong.songname"></h3>
					<p v-html="currentSong.singername"></p>
				</div>
				<div class="control play-state">
					<progress-circle :percentage="percentage">
						<i class="iconfont" :class="playIcon" @click.stop="togglePlaying"></i>
					</progress-circle>
				</div>
				<div class="control" @click.stop="showPlaylist">
					<i class="iconfont icon-liebiao3"></i>
				</div>
				<play-list ref="playlist"></play-list>
			</div>
		</transition>
		<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime($event)" @ended="end"></audio>
	</div>
</template>
<script>
	import { mapState,mapGetters,mapMutations } from 'vuex'
	import animations from 'create-keyframe-animation'
	import { Toast } from 'mint-ui';
	import {shuffle} from '@/assets/js/util'
	import ProgressBar from '@/components/ProgressBar'
	import ProgressCircle from '@/components/ProgressCircle'
	import PlayList from '@/components/PlayList'

	export default {
		components:{
			ProgressBar,
			ProgressCircle,
			PlayList
		},
		data(){
			return {
				isMounted:false,
				songReady:false,
				currentTime:0,
				bufferTime:0
			}
		},
		computed:{
			...mapState([
				'playlist',
				'fullScreen',
				'playing',
				'mylikeSongs',
				'mode',
				'currentIndex',
				'sequencelist',
				'playHistory'
			]),
			...mapGetters(['currentSong']),
			modeIcon() {
				switch (this.mode) {
					case 0: return 'icon-xunhuanbofang'
					case 1: return 'icon-danquxunhuan'
					case 2: return 'icon-suijibofang'
				}
			},
			playIcon() {
				return this.playing ? 'icon-bofang' : 'icon-play_icon'
			},
			rotateState() {
				return this.playing ? 'rotate' : 'rotate rotate-pause'
			},
			percentage(){
				return this.currentTime / this.currentSong.duration
			}
		},
		watch:{
			currentSong(newSong,oldSong) {
				//切换mode时防止歌曲变化
				if (newSong.id === oldSong.id) {
					return 
				}
				this.$nextTick(()=>{
					this.$refs.audio.play()
				})
			},
			playing(newState,oldState) {
				if (!newState) {
					this.$nextTick(()=>{
						this.$refs.audio.pause()
					})
				}
			}
		},
		methods:{
			...mapMutations([
				'setFullScreenState',
				'setPlayingState',
				'setModeState',
				'setCurrentIndex',
				'setPlaylist',
				'addItem',
				'removeItem'
			]),
			back() {
				this.setFullScreenState(false)
			},
			open() {
				this.setFullScreenState(true)
			},
			getPosAndScale() {
				const targetWidth = 40    //图像缩略图宽度
        		const width = window.innerWidth * 0.8 //图像宽度
        		const scale = targetWidth / width

        		const paddingLeft = 40
        		const x=-(window.innerWidth/2-paddingLeft)

        		const paddingTop = 80
        		const paddingBottom = 30
        		const y=window.innerHeight - paddingTop - width / 2 - paddingBottom
        		return { x,y,scale }
			},
			enter(el,done) {
				const {x, y, scale} = this.getPosAndScale()
				let animation = {
					0: {
						transform:`translate(${x}px,${y}px) scale(${scale})`
					},
					60: {
						transform:"translate(0,0) scale(1.1)"
					},
					100: {
						transform:"translate(0,0) scale(1)",
					}
				}

				animations.registerAnimation({
					name: 'move',
					animation,
					presets: {
						duration: 400,
						easing: 'linear'
					}
				})

				animations.runAnimation(this.$refs.imgWrapper, 'move', done)
			},
			afterEnter() {
				animations.unregisterAnimation('move')
				this.$refs.imgWrapper.style.animation = ''
			},
			leave(el,done) {
				const {x, y, scale} = this.getPosAndScale()
				this.$refs.imgWrapper.style.transition = 'all 0.4s'
				this.$refs.imgWrapper.style.transform = `translate(${x}px,${y}px) scale(${scale})`
				this.$refs.imgWrapper.addEventListener('transitionend', done)
			},
			afterLeave() {
				this.$refs.imgWrapper.style.transition = ''
				this.$refs.imgWrapper.style.transform = ''
			},
			togglePlaying() {
				this.playing?this.$refs.audio.pause():this.$refs.audio.play()
				this.setPlayingState(!this.playing)
			},
			getLikeIcon(song) {
				let idx=this.mylikeSongs.findIndex((item)=>{
					return item.id===song.id
				})
				if (idx!=-1) {
					return 'icon-xihuan1 red'
				}else {
					return 'icon-xihuan'
				}
			},
			toggleFavorite(song) {
				let idx=this.mylikeSongs.findIndex((item)=>{
					return item.id===song.id
				})
				if (idx!=-1) {
					this.removeItem({
						key:'mylikeSongs',
						index:idx
					})
				} else {
					this.addItem({
						key:'mylikeSongs',
						song:song
					})
				}
			},
			ready(){
				this.songReady = true
				//添加播放历史
				let have = this.playHistory.findIndex((item)=>{
					return item.id === this.currentSong.id
				})
				if (have === -1) {
					//播放历史只保留200首
					if (this.playHistory.length===200) {
						this.removeItem({
							key:'playHistory',
							index:0
						})
					}
					this.addItem({
						key:'playHistory',
						song:this.currentSong
					})
				}
			},
			error() {
				this.songReady = true
			}, 
			prevSong() {
				//让歌曲准备好了再播放
				if (!this.songReady) {
					Toast('正在缓冲...')
					return 
				}
				if (this.playlist.length === 1) {
					this.$refs.audio.currentTime = 0 
					this.$refs.audio.play()
				}
				let index = this.currentIndex - 1
				if (index === -1) {
					index = this.playlist.length - 1
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlaying()
				}
				this.songReady=false
			},
			nextSong() {
				if (!this.songReady) {
					Toast('正在缓冲...')
					return 
				}
				if (this.playlist.length === 1) {
					this.$refs.audio.currentTime = 0 
					this.$refs.audio.play()
				}
				let index = this.currentIndex + 1
				if (index === this.playlist.length) {
					index = 0
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlaying()
				}
				this.songReady=false
			},
			changeMode() {
				const mode=(this.mode+1) % 3
				mode ===0 ? Toast('顺序播放') : (mode===1 ? Toast('单曲循环') : Toast('随机播放'))
				this.setModeState(mode)
				let list = []
				if (mode===2) {
					list = shuffle(this.sequencelist)
				}else {
					list = this.sequencelist
				}
				this.resetCurrentIndex(list)
				this.setPlaylist(list)
			},
			resetCurrentIndex(list) {
				let index = list.findIndex((item)=>{
					return item.id===this.currentSong.id
				})
				this.setCurrentIndex(index)
			},
			updateTime($event){
				this.currentTime = $event.target.currentTime
			},
			format(time) {
				let minutes = (time / 60) | 0   // |是向下取正
				let  seconds = time % 60 | 0
				if (minutes<10) {
					minutes = '0' + minutes
				}
				if (seconds<10) {
					seconds = '0' + seconds
				}
				return minutes + ':' + seconds 
			},
			end() {
				if (this.mode===1) {
					this.$refs.audio.currentTime = 0 
					this.$refs.audio.play()
				} else {
					this.nextSong()
				}
			},
			percentChange(percentage){
				let currentTime = this.currentSong.duration*percentage
				this.$refs.audio.currentTime = currentTime
				if (!this.playing) { 
					this.togglePlaying();
				}
			},
			showPlaylist() {
				this.$refs.playlist.show()
			}
		}
	}
</script>
<style scoped>
	.normal-player{
		position: fixed;
		z-index: 100;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
	}

	.background{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.background::after{
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
	}
	.background img{
		width: 100%;
		height: 100%;
		object-fit: cover; 
		filter: blur(20px);
		transform: scale(1.1);
	}

	.top{
		position: relative;
		margin-bottom: 25px;
		color: #fff;
		text-align: center;
	}
	.back{
		position: absolute;
		height: 40px;
		width: 60px;
		line-height: 40px;
	}
	.back i{
		font-size: 22px;
	}
	.top h2{
		width: 70%;
		height: 40px;
		line-height: 40px;
		margin: 0 auto;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 18px;
		font-weight: normal;
	}
	.top h3{
		width: 70%;
		height: 20px;
		line-height: 20px;
		margin: 0 auto;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 15px;
		font-weight: normal;
	}

	.middle{
		position: fixed;
		top: 80px;
		bottom: 170px;
		width: 100%;
		text-align: center;
	}
	.image-wrapper{
		width: 80%;
		margin: 0 auto;
	}
	.image-wrapper img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 10px solid hsla(0,0%,100%,.1);
	}
	.rotate{
		animation: rotateAnimation 22s linear infinite;
	}
	.rotate-pause{
		animation-play-state: paused
	}
	@keyframes rotateAnimation{
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.middle .lyric-wrapper{
		color: rgba(255,255,255,.8);
		margin-top: 30px;
		letter-spacing: 2px;
		font-size: 14px;
	}

	.bottom{
		position: fixed;
		bottom: 50px;
		width: 100%;
		text-align: center;
	}
	.progress-wrapper{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 80%;
		margin: 0 auto;
		padding: 10px;
	}
	.progress-wrapper .time{
		width: 30px;
		height: 30px;
		line-height: 30px;
		color: #fff;
		font-size: 12px;
	}
	.progress-wrapper .progress-bar-wrapper{
		flex-grow: 1;
		height: 30px;
		padding: 0 5px;
	}


	.bottom .control-wrapper{
		display: flex;
		padding: 0 30px;
	}
	.bottom .control-wrapper .icon{
		flex-grow: 1;
		height: 41px;
		line-height: 41px;
		text-align: center;
		color: #31c27c;
	}
	.control-wrapper .icon:first-child i{
		font-size: 28px;
	}
	.control-wrapper .icon:last-child i{
		font-size: 28px;
	}
	.control-wrapper .icon i{
		font-size: 33px;
	}
	.control-wrapper .icon.center i{
		font-size: 42px;
	}
	.control-wrapper .icon .red{
		color: #d93f30;
	}
	.mini-player{
		position: fixed;
		display: flex;
		align-items: center;
		z-index: 100;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		border-top: 1px solid #ccc;
		background-color: #fff;
	}
	.mini-player .icon{
		width: 40px;
		height: 40px;
		margin: 0 10px 0 20px;
	}
	.mini-player .icon img{
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	.mini-player .text{
		width: 60%;
		height: 70%;
		padding-right: 25px;
	}
	.mini-player .text h3{
		font-size: 14px;
		font-weight: normal;
		margin-bottom: 5px;
	}
	.mini-player .text p{
		font-size: 12px;
		color: #777;
		font-weight: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mini-player .control{
		width: 10%;
		color: #31c27c;
		margin-right: 10px;
	}
	.mini-player .control i{
		font-size: 25px;
	}
	.mini-player .control.play-state i{
		position: absolute;
		top: 0;
		left: 0;
		font-size: 35px;
	}

	
	
	.normal-enter-active,.normal-leave-active{
		transition: all 0.4s;
	}
	.normal-enter-active .top,.normal-enter-active .bottom{
		transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
	}
	.normal-leave-active .top,.normal-leave-active .bottom{
		transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
	}
	.normal-enter,.normal-leave-to{
		opacity: 0
	}
	.normal-enter .bottom,.normal-leave-to .bottom{
		/*为什么这句话没有作用*/
		transform: translateY(100%)
	}
	.normal-enter .top,.normal-leave-to .top{
		transform: translateY(-100%)
	}
	

	.mini-enter-active,.mini-leave-active{
		transition: all 0.4s;
	}
	.mini-enter,.mini-leave-to{
		opacity: 0;
	}


</style>