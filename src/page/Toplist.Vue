<template>
	<transition name="slide">
		<div class="toplist">
			<div class="toplist-header">
				<div class="toplist-box-bd">
					<page-header title="排行榜"></page-header>
					<div class="toplist-info">
						<div class="media-img">
							<img :src="toplistInfo.img">
						</div>
						<div class="media-text">
							<h2>{{toplistInfo.title}}</h2>
							<div>{{time}}</div>
							<p>{{toplistInfo.updateTime}} 更新</p>
						</div>
					</div>
				</div>
				<img class="toplist-box-bg" :src="toplistInfo.img">
			</div>
			<div class="navbar">
				<mt-navbar v-model="selected">
					<mt-tab-item id="songlist">歌曲</mt-tab-item>
					<mt-tab-item id="detail">详情</mt-tab-item>
				</mt-navbar>
			</div>
			<div class="main">
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="songlist">
						<song-list :songlist="toplistInfo.songlist" :isShowIndex="true">
							<li class="loading-more" v-if="toplistInfo.songlist.length">
								<button @click="loadMore">
									加载更多<span class="arrow"></span>
								</button>
							</li>
						</song-list>
					</mt-tab-container-item>
					<mt-tab-container-item id="detail">
						<p v-html="toplistInfo.info" class="info"></p>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
	</transition>
</template>
<script>
	import { getToplist } from '@/api/getToplistsData.js'
	import Loading from '@/components/Loading'
	import PageHeader from '@/components/PageHeader'
	import SongList from '@/components/SongList'
	import { createSong } from '@/assets/js/song'

	const SONGLIST_LEN=30

	export default {
		components:{
			Loading,
			PageHeader,
			SongList
		},
		data(){
			return {
				selected:'songlist',
				toplistInfo:{
					songlist:[]
				},
				list:[]
			}
		},
		created(){
			this._getToplist();
		},
		computed:{
			time(){
				if (this.toplistInfo.day_of_year) {
					return `第${this.toplistInfo.day_of_year}天`
				}else{
					//数据获取会有一点延迟，所以先判断
					let str=this.toplistInfo.date?this.toplistInfo.date.split('_')[1]:'';
					return `第${str}周`
				}
			}
		},
		methods:{
			_getToplist(){
				let id=this.$route.params.id;
				getToplist(id).then((res)=>{
					let info={
						title:res.topinfo.ListName,
						updateTime:res.update_time,
						img:res.topinfo.pic_v12,
						date:res.date,
						day_of_year:res.day_of_year,
						info:res.topinfo.info,
						songlist:[],
					}
					res.songlist.forEach((item)=>{
						this.list.push(createSong(item.data))
					})
					info.songlist=info.songlist.concat(this.list.splice(0,SONGLIST_LEN))
					this.toplistInfo=Object.assign({},info)
				})
			},
			loadMore(event){
				let length=this.toplistInfo.songlist.length;
				this.toplistInfo.songlist=this.toplistInfo.songlist.concat(this.list.splice(0,SONGLIST_LEN))
				if (this.list.length===0) {
					event.target.innerHTML='加载完毕'
					event.target.disabled=true;
					return ;
				}
			}
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
	.toplist{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		overflow: auto;
	}
	.toplist-header{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 274px;
		overflow: hidden;
		color: #fff;
		background: #fff;
	}
	.toplist-box-bd{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		background: rgba(0,0,0,.5);
	}
	.toplist-box-bg{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
		width: 100%;
		height: 100%;
		/*css3的新属性*/
		object-fit: cover; 
		filter: blur(36px);
		transform: scale(1.1);
	}
	.toplist-info{
		display: flex;
		margin-top: 65px;
		padding: 0 16px;
		box-sizing: content-box;
	}
	.toplist-info .media-img img{
		width: 125px;
		height: 125px;
	}
	.toplist-info .media-text{
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 10px;
		font-family: sans-serif;
	}
	.toplist-info .media-text h2{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 18px;
		font-weight: normal;
	}
	.toplist-info .media-text div{
		margin-top: 8px;
		font-size: 14px;
	}
	.toplist-info .media-text p{
		margin-top: 8px;
		font-size: 12px;
	}
	.navbar{
		height: 50px;
		margin-top: 274px;
		background-color: #fff;
		letter-spacing: 3px;
	}
	.main{
		/*min-height: 600px;*/
		padding-bottom: 100px;
	}
	.info{
		margin: 20px 30px;
		color: #333;
	}
	
	.loading-more{
		text-align: center;
	}
	.loading-more button{
		display: inline-block;
		border: none;
		outline: none;
		color: #777;
		background-color: #fff;
	}
	.arrow{
		display: inline-block;	
		width: 6px;
		height: 6px;
		margin-left: 10px;
		box-sizing: content-box;
		vertical-align: middle;
		border-right: 1px solid #777;
		border-bottom: 1px solid #777;
		transform: translateY(-5px) rotate(45deg);
	}
</style>