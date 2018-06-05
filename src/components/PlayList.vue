<template>
	<transition name="list-fade">
		<div class="playlist" v-show="showFlag" @click.stop="hide">
			<div class="list-wrapper" @click.stop>
				<div class="list-top">
					<div class="left-icon">
						<i class="iconfont" :class="modeIcon" ref="mode" @click="changeMode"></i>&emsp;
						<span>{{modeDesc}}</span><span style="color:#ffffff80" v-show="mode!=1">({{playlist.length}})</span>
					</div>
					<div class="right-icon" @click="clear">
						<i class="iconfont icon-lvzhou_shanchu_lajitong"></i>
					</div>
				</div>
				<div class="list-main" ref="listMain">
					<ul>
						<li v-for="(item,index) in playlist" :key="index" class="song" @click="selectSong(index)">
							<div class="songname" v-html="item.songname" :class="active(item)"></div>
							<div class="control">
								<i class="iconfont" :class="getLikeIcon(item)" @click.stop="toggleFavorite(item)" ref="favorite"></i>&emsp;
								<span class="cha" @click.stop="_removeItem(item,index)">×</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="list-bottom" @click="hide">关闭</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import { mapState,mapGetters,mapMutations } from 'vuex'
	import { Toast,MessageBox } from 'mint-ui'
	import {shuffle} from '@/assets/js/util'

	export default {
		data(){
			return {
				showFlag:false,
			}
		},
		computed:{
			...mapState([
				'playlist',
				'mode',
				'sequencelist',
				'mylikeSongs',
				'currentIndex'
			]),
			...mapGetters([
				'currentSong'
			]),
			modeIcon() {
				switch (this.mode) {
					case 0: return 'icon-xunhuanbofang'
					case 1: return 'icon-danquxunhuan'
					case 2: return 'icon-suijibofang'
				}
			},
			modeDesc() {
				switch (this.mode) {
					case 0: return '顺序播放'
					case 1: return '单曲循环'
					case 2: return '随机播放'
				}
			},
		},
		watch:{
			currentSong(newSong, oldSong) {
		        if (newSong.id === oldSong.id) {
					return
		        }
		        // this.scrollToCurrent()
	      	}
		},
		methods:{
			...mapMutations([
				'clearList',
				'setPlayingState',
				'setModeState',
				'setPlaylist',
				'setCurrentIndex',
				'removeItem',
				'addItem'
			]),
			show() {
				this.showFlag = true
				// this.scrollToCurrent()
			},
			hide() {
				this.showFlag = false 
			},
			clear() {
				MessageBox.confirm('确定清空播放列表吗？').then(()=>{
					this.showFlag = false
					this.clearList('playlist')
					this.clearList('sequencelist')
					this.setPlayingState(false)
				},()=>{})
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
				this.resetCurrentIndex(list,this.currentSong)
				this.setPlaylist(list)
			},
			resetCurrentIndex(list,song) {
				let index = list.findIndex((item)=>{
					return item.id===song.id
				})
				this.setCurrentIndex(index)
			},
			getLikeIcon(song) {
				let idx=this.mylikeSongs.findIndex((likeSong)=>{
					return likeSong.id===song.id
				})
				if (idx!=-1) {
					return 'icon-xihuan1 red'
				}else {
					return 'icon-xihuan'
				}
			},
			toggleFavorite(song) {
				let idx=this.mylikeSongs.findIndex((likeSong)=>{
					return likeSong.id===song.id
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
			_removeItem(item,index) {
				//只要不是移除正在播放的歌曲，就继续播放，因为移除歌曲后index会变，所以要reset一下
				this.setPlayingState(true)
				let nowSong = this.currentSong  //必须有个临时变量来保存，
				this.removeItem({
					key:'playlist',
					index
				})
				if (item.id != nowSong.id) {
					this.resetCurrentIndex(this.playlist,nowSong)
				}
			},
			active(item) {
				if (item.id === this.currentSong.id) {
					return 'active'
				}
			},
			selectSong(index) {
				this.setCurrentIndex(index)
				this.setPlayingState(true)
			},
			// scrollToCurrent() {
			// 	let height = this.currentIndex * 45
			// 	//增加一个动画效果
			// 	this.$refs.listMain.scrollTop += 15
			//  	if (this.$refs.listMain.scrollTop < height) {
			//  		//这个API的动画效果刷新效果最好，但是有兼容性问题
   //                  var c=requestAnimationFrame(this.scrollToCurrent)
   //              }else {
   //                  cancelAnimationFrame(c);
   //              }
			// }
		}
	}
</script>
<style scoped>
	.list-fade-enter-active, .list-fade-leave-active{
		transition: opacity 0.3s;
	}
	.list-fade-enter-active .list-wrapper, .list-fade-leave-active .list-wrapper{
		transition: all 0.3s
	}
	.list-fade-enter, .list-fade-leave-to{
		opacity: 0;
	}
	.list-fade-enter .list-wrapper, .list-fade-leave-to .list-wrapper{
		transform: translate3d(0, 100%, 0)
	}

	.playlist{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 200;
		background-color: rgba(0,0,0,.3);
	}
	.list-wrapper{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 430px;
		background-color: #444;
		color: #fff;
		font-size: 14px;
	}
	.list-top{
		display: flex;
		justify-content: space-between;
		color: #fff;
	    padding: 20px 30px 10px 20px;
	}
	.list-top i{
		font-size: 18px;
	}
	.list-top span{
		letter-spacing: 2px;
	}

	.list-main{
		height: 330px;
		overflow: scroll;
		padding: 0 30px 0 20px;
	}
	.list-main ul{
		padding-bottom: 285px;
	}
	.song{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 45px;
		color: #fff;
	}
	.song i{
		position: relative;
		top: -3px;
	}
	.song .songname{
		width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.song .cha{
		font-size: 25px;
	}
	.list-bottom{
		height: 50px;
		line-height: 50px;
		text-align: center;
		background-color: #222;
		font-size: 16px;
	}
	.active{
		color: #31c27c;
	}
</style>