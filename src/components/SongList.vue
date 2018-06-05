<template>
	<div class="song-list">
		<ul>
			<div class="loading-container" v-if="!songlist.length">
				<loading></loading>
			</div>
			<transition name="slide">
				<div class="playall" v-show="songlist.length&&isShow" @click.stop="playAll">播放全部</div>
			</transition>
			<li v-for="(item,index) in songlist" class="song" :key="index" :class="{'playing-item-b':isplaying(index)}" @click="selectItem(index)">
				<div class="ranking" v-if="isShowIndex">
					<span :class="{'playing-item':isplaying(index)}">{{index+1}}</span>
				</div>
				<div class="text">
					<h3 :class="{'playing-item':isplaying(index)}">{{item.songname}}</h3>
					<p :class="{'playing-item':isplaying(index)}">{{item.singername+'·'+item.albumname}}</p>
				</div>
			</li>
			<slot></slot>
		</ul>
	</div>
</template>
<script>
	import Loading from './Loading.vue'
	import { mapGetters,mapActions  } from 'vuex'

	export default {
		components:{
			Loading
		},
		data(){
			return {
				isShow:this.show
			}
		},
		created(){
			// console.log(this.songlist)
		},
		computed:{
			...mapGetters([
				'currentSong'
			]),	
		},
		props:{
			show:{
				type:Boolean,
				default:true
			},
			songlist:{
				type:Array,
				default:function(){
					return []
				}
			},
			isShowIndex:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			...mapActions([
				'selectPlay'
			]),
			isplaying(index) {
				if (this.currentSong.id===this.songlist[index].id) {
					return true
				}
			},
			selectItem(index) {
				let list = this.songlist.slice()
				this.selectPlay({
					list,
					index
				})
			},
			playAll() {
				this.selectItem(0)
				this.isShow =false
			}
		}
	}
</script>
<style scoped>
	.song-list .loading-container{
		margin: 150px 0;
	}
	.song-list ul{
		position: relative;
	}
	.song-list .playall{
		position: absolute;
		top: 20px;
		right: -10px;
		width: 95px;
		height: 23px;
		line-height: 23px;
		border-radius: 20px;
		background-color: #31c27c;
		text-align: center;
		color: #fff;
		font-size: 14px;
	}
	.slide-enter-active,.slide-leave-active{
		transition: .5s;
	}
	.slide-enter,.slide-leave-to{
		transform: translateX(85px);
	}
	.song-list .song{
		display: flex;
		align-items: center;
		padding: 0 30px 0 20px;
		margin: 20px 0;
		border-left: 3px solid #fff;
	}
	.song-list .song:nth-child(-n+4) .ranking{
		color: #FF400B;
	}
	.song-list .ranking{
		height: 80%;
		margin-right: 20px;
		font-size: 16px;
		color: #777
	}
	.song-list .text{
		width: 80%;
	}
	.song-list h3{
		color: #444;
		font-size: 15px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.song-list p{
		color: #777;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.song-list .playing-item{
		color: #31c27c;
	}
	.song-list .playing-item-b{
		border-left: 3px solid #31c27c;
	}
</style>