<template>
	<transition name="slide">
		<div class="user">
			<div class="top">
				<div class="back-warpper">
					<i class="iconfont icon-zuojiantou back-i" @click="back"></i>
				</div>
				<div class="switch">
					<div class="switch-item" :class="{active:selected==='mylikeSongs'}" @click="switchItem('mylikeSongs')">我喜欢的</div>
					<div class="switch-item" :class="{active:selected==='playHistory'}" @click="switchItem('playHistory')">最近听的</div>
				</div>
			</div>
			<div class="container-item" v-show="selected==='mylikeSongs'">
				<div class="empty" v-show="!mylikeSongs.length">
					<i class="iconfont icon-jiarugedan"></i>
					<p>没有收藏的歌曲</p>
					<p>你可以挑一些喜欢的单曲添加到这里</p>
				</div>
				<div class="play-btn" v-show="mylikeSongs.length" @click="randomPlay(mylikeSongs,'mylikeSongs')">
					<i class="iconfont icon-play_icon"></i>
					<span>随机播放全部</span>
				</div>
				<ul class="list">
					<li v-for="(item,index) in mylikeSongs" class="item" @click="selectItem(mylikeSongs,index,'mylikeSongs')">
						<h3 v-html="item.songname" :class="active(item,'mylikeSongs')"></h3>
						<p v-html="item.singername+'·'+item.albumname" :class="active(item,'mylikeSongs')"></p>
						<span @click.stop="_removeItem('mylikeSongs',item,index)">×</span>
					</li>
				</ul>
				<div @click="clear('mylikeSongs')" v-show="mylikeSongs.length>=7" class="clearlist">
					<i class="iconfont icon-lajitong1"></i>&ensp;清空列表
				</div>
			</div>
			<div class="container-item" v-show="selected==='playHistory'">
				<div class="empty"  v-show="!playHistory.length">
					<i class="iconfont icon-yinyue"></i>
					<p>没有播放记录</p>
					<p>这里会自动记录您最近听过的200首歌曲</p>
				</div>
				<div class="play-btn" v-show="playHistory.length" @click="randomPlay(playHistory,'playHistory')">
					<i class="iconfont icon-play_icon"></i>
					<span>随机播放全部</span>
				</div>
				<ul class="list">
					<li v-for="(item,index) in playHistory" class="item" @click="selectItem(playHistory,index,'playHistory')">
						<h3 v-html="item.songname"  :class="active(item,'playHistory')"></h3>
						<p v-html="item.singername+'·'+item.albumname"  :class="active(item,'playHistory')"></p>
						<span @click.stop="_removeItem('playHistory',item,index)">×</span>
					</li>
				</ul>
				<div @click="clear('playHistory')" v-show="playHistory.length>=7" class="clearlist">
					<i class="iconfont icon-lajitong1"></i>&ensp;清空列表
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
	import { MessageBox } from 'mint-ui'

	export default {
		data(){
			return {
				selected:'mylikeSongs',
			}
		},
		created(){
			// console.log(this.playHistory)
		},
		computed:{
			...mapState([
				'mylikeSongs',
				'playHistory',
				'playlist',
				'mode',
				'other'
			]),
			...mapGetters([
				'currentSong'
			]),
		},
		methods:{
			...mapMutations([
				'clearList',
				'removeItem',
				'setModeState',
				'setPlayingState',
				'setCurrentIndex',
				'setPlaylist',
				'setOther'
			]),
			...mapActions ([
				'selectPlay'
			]),
			back() {
				this.$router.go(-1)
			},
			switchItem(a) {
				this.selected = a
			},
			clear(key) {
				MessageBox.confirm('确定清空列表吗？').then(()=>{
					this.clearList(key)
					if (key === this.other.user) {
						this.setPlayingState(false)
					}
				},()=>{})
			},
			selectItem(list,index,option) {
				this.setOther({user:option})
				this.selectPlay({list,index})
			},
			randomPlay(list,option){
				this.setOther({user:option})
				let index = Math.floor(Math.random() * list.length)
				this.setModeState(2)
				this.selectPlay({list,index})
			},
			active(item,key) {
				if (item.id === this.currentSong.id && key === this.other.user) {
					return 'play-song'
				}
			},
			_removeItem(key,item,index) {
				this.setPlayingState(true)
				if ( key != this.other.user) {
					this.removeItem({key,index})
					return 
				}
				let nowSong = this.currentSong  //必须有个临时变量来保存，
				this.removeItem({
					key,
					index
				})
				this.setPlaylist(this[key])
				if (item.id != nowSong.id) {
					this.resetCurrentIndex(this.playlist,nowSong)
				}
				if (!this[key].length) {
					this.setPlayingState(false)
				}

			},
			resetCurrentIndex(list,song) {
				let index = list.findIndex((item)=>{
					return item.id===song.id
				})
				this.setCurrentIndex(index)
			},
		}
	}
</script>
<style scoped>
	.slide-enter-active,.slide-leave-active{
		transition: all 0.3s;
	}
	.slide-enter, .slide-leave-to{
		transform: translateX(100%);
	}
	.user{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		overflow: auto;
	}
	.top{
		position: fixed;
		z-index: 7;
		top: 0;
		width: 100%;
		height: 44px;
		line-height: 44px;
		background-color: #fff;
	}
	.top .back-i{
		position: absolute;
	    z-index: 10;
	    left: 15px;
	    font-size: 25px;
	    color: #31c27c;
	}
	.switch{
		width: 240px;
		height: 30px;
		margin: 6px auto 0;
		box-sizing: content-box;
		border: 1px solid #fff;
		overflow: hidden;
		border-radius: 5px;
	}
	.switch-item{
		float: left;
		width: 50%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		background-color: #ddd;
		color: #fff;
	}
	.active{
		background-color: #31c27c;
	}
	.container-item{
		margin: 44px 0 80px;
		overflow: hidden;
	}
	.item{
		position: relative;
		padding: 0 30px 0 20px;
		margin: 20px 0;
	}
	.item h3{
		width: 80%;
		color: #444;
		font-size: 15px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.item p{
		width: 80%;
		color: #777;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.item span{
		position: absolute;
		top: 50%;
		right: 30px;
		color: #999;
		transform: translateY(-50%);
	}
	.empty{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		transform: translate(-50%,-50%);
		text-align: center;
		font-size: 12px;
		color: #777;
	}
	.empty i{
		display: inline-block;
		font-size: 88px;
		color: #ddd;
		margin-bottom: 10px;
	}
	.play-btn{
		width: 135px;
		height: 32px;
		padding: 7px 0;
		margin: 20px auto;
		text-align: center;
		border: 1px solid #31c27c;
		color: #31c27c;
		border-radius: 100px;
		font-size: 12px;
	}
	.play-btn i{
		font-size: 16px;
		vertical-align: middle;
	}
	.clearlist{
		width: 100px;
		text-align: center;
		margin: 30px auto 0;
		color: #777;
	}
	.item .play-song{
		color: #31c27c;
	}
</style>