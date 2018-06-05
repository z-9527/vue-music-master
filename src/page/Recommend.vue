<template>
	<div class="recommend">
		<div class="slider">
			<mt-swipe>
				<mt-swipe-item v-for="(item,index) in slider" :key="index">
					<a :href="item.linkUrl"><img :src="item.picUrl"></a>
				</mt-swipe-item>
			</mt-swipe>
		</div>
		<div class="radio-list">
			<h2 class="title">电台</h2>
			<ul>
				<li v-for="(item,index) in radioList">
					<div class="media-img" @click="selectRadio(index)">
						<img :src="item.picUrl">
						<i class="radio-play" :class="radioplayIcon(index)" v-show="radioList.length"></i>
					</div>
					<div class="media-text">
						<p>{{item.Ftitle}}</p>
					</div>
				</li>
			</ul> 
		</div>
		<div class="song-list">
			<h2 class="title">热门歌单</h2>
			<ul>
				<li v-for="(item,index) in songList" :key="index">
					<router-link :to="`/recommend/songsheet?id=sheet${index}`">
						<div class="media-img">
							<img v-lazy="item.picUrl">
							<i class="play"></i>
						</div>
						<div class="media-text">
							<p>{{item.songListDesc}}</p>
						</div>
					</router-link>
				</li>
			</ul>
		</div>
		<router-view></router-view>
	</div>
</template>
<script>
	import { getRecommendData } from '@/api/getRecommendData.js'
	import { getToplist } from '@/api/getToplistsData.js'
	import { createSong } from '@/assets/js/song'
	import { mapState,mapGetters,mapMutations,mapActions  } from 'vuex'

	export default {
		data(){
			return {
				slider:[],
				radioList:[],
				songList:[],
				radioSongs:[],
				radioplay:-1,
			}
		},
		computed:{
			...mapState([
				'playing',
			]),
		},
		created(){
			this._getRecommendData();
		},
		methods:{
			...mapActions([
				'selectPlay'
			]),
			...mapMutations([
				'setPlaylist',
				'setPlayingState',
				'setCurrentIndex',
			]),
			_getRecommendData(){
				getRecommendData().then((res)=>{
					let data=res.data;
					this.slider=data.slider;
					this.radioList=data.radioList;
					this.songList=data.songList;
				})
				getToplist(26).then((res)=>{
					for(let i=0;i<30;i++){
						this.radioSongs.push(createSong(res.songlist[i].data))
					}
				})
			},
			selectRadio(index){
				//歌单数据被腾讯限制，用toplist数据模拟
				this.radioplay = index 
				let songs=[]
				index ===0 ? songs = this.radioSongs.slice(0,15) : songs = this.radioSongs.slice(15,30)
				this.selectPlay({
					list:songs,
					index:0
				})
			},
			radioplayIcon(index) {
				if ( this.radioplay === index) {
					return this.playing ? 'radio-playing' : 'radio-pause'
				}
			}
		}	
	}
</script>
<style scoped>
	ul{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	li{
		width: 50%;
	}
	.recommend{
		/*background-color: #f4f4f4;*/
		margin-bottom: 80px;
	}
	.slider{
		width: 100%;
		height: 150px;
	}
	.slider a{
		display: block;
	}
	.slider img{
		width: 100%;
		height: 150px;
	}
	.radio-list{
		/*background-color: #fff;*/
		min-height: 250px;
		text-align: center;
	}
	.title{
		padding: 10px 0 5px 10px;
		font-size: 16px;
		color: #000;
		text-align: left;
	}
	.media-img{
		position: relative;
	}
	.radio-list .radio-play{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 48px;
		height: 48px;
		transform: translate(-50%,-50%);
		background-image: url('../assets/img/list_sprite.png');
	}
	.radio-list img{
		width: 85%;
		height: auto;
		border-radius: 50%;
	}
	.radio-list p{
		margin: 10px 0;
		font-size: 14px;
	}
	.radio-list .radio-playing{
		background-position-y: -50px;
	}
	.radio-list .radio-pause{
		background-position-y: 0;
	}
	.song-list ul{
		background-color: #f4f4f4;
		padding: 0 10px;
	}
	.song-list li{
		width: 49%;
		margin-bottom: 10px;
	}
	.song-list a{
		display: block;
	}
	.song-list img{
		width: 100%;
	}
	.song-list .play{
		position: absolute;
		position: absolute;
	    right: 5px;
	    bottom: 5px;
	    width: 24px;
	    height: 24px;
	    background-image: url('../assets/img/list_sprite.png');
	    background-size: cover;
	}
	.song-list p{
		height: 55px;
		padding: 5px 0 15px 7px;
		color: #000;
		font-weight: normal;
		font-size: 14px;
		background-color: #fff;
	}
</style>
