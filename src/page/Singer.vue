<template>
	<transition name="slide">
		<div class="singer">
			<page-header :imgUrl="imgUrl" :title="singername"></page-header>
			<div class="background" :style="`backgroundImage:url(${imgUrl})`" :class="{filter:isAddFilter}"></div>
			<div class=""></div>
			<div class="navbar" id="navbar">
				<mt-navbar v-model="selected">
					<mt-tab-item id="song">歌曲</mt-tab-item>
					<mt-tab-item id="album">专辑</mt-tab-item>
					<mt-tab-item id="MV">MV</mt-tab-item>
				</mt-navbar>
			</div>
			<div class="main" id="main">
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="song">
						<song-list :songlist="songlist"></song-list>
					</mt-tab-container-item>
					<mt-tab-container-item id="album">
						<ul>
							<div class="loading-container" v-if="!albumlist.length">
								<loading></loading>
							</div>
							<li class="album" v-for="(item,index) in albumlist" :key="index" @click="goTo('album',item.albummid)">
								<div class="media-img">
									<img v-lazy="item.img">
								</div>
								<div class="media-text">
									<h3>{{item.name}}</h3>
									<p>{{item.publish}}</p>
								</div>
							</li>
						</ul>
					</mt-tab-container-item>
					<mt-tab-container-item id="MV">
						<h2 class="mvlist-title">最新MV</h2>
						<ul class="mv-ul">
							<li class="mv" v-for="(item,index) in mvlist" :key="index" @click="message">
								<div class="media-img">
									<img v-lazy="item.img">
								</div>
								<div class="media-text">
									<h3>{{item.title}}</h3>
									<p>{{item.pubdate}}</p>
								</div>
							</li>
						</ul>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
	</transition>
</template>
<script>
	import { getSingerData } from '@/api/getSingerlistData'
	import { createSong } from '@/assets/js/song'
	import Loading from '@/components/Loading'
	import PageHeader from '@/components/PageHeader'
	import SongList from '@/components/SongList'
	import { MessageBox } from 'mint-ui'
	import { mapMutations } from 'vuex'

	export default {
		components:{
			Loading,
			PageHeader,
			SongList
		},
		data(){
			return {
				isAddFilter:false,
				selected:'song',
				songlist:[],
				albumlist:[],
				mvlist:[],
				singer:''
			}
		},
		created(){
			var _this=this
			this._getSingerData()
			window.onscroll=function(){
				_this.fiexdTop()
			}
		},
		beforeDestroy(){
			//销毁window上绑定的事件，防止其他组件出错
			window.onscroll=null;
		},
		computed:{
			singername(){
				return this.$route.query.singername||this.singer;
			},
			imgUrl(){
				let id=this.$route.params.id;
				return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
			}
		},
		methods:{
			goTo(place,id){
				let url=`/${place}/${id}`
				this.$router.push(url)
			},
			_getSingerData(){
				let id=this.$route.params.id
				getSingerData(id).then((res)=>{
					let data=res.data;
					this.singer=data.singer_name
					//获取歌曲列表
					data.list.forEach((item)=>{
						this.songlist.push(createSong(item.musicData))
					})
					//获取专辑列表
					data.albumlist.forEach((item)=>{
						this.albumlist.push({
							albummid:item.albummid,
							name:item.name,
							img:item.pic,
							publish:item.publish_date
						})
					})
					//获取MV列表
					if (data.mvlist!=null) {
						data.mvlist.forEach((item)=>{
							this.mvlist.push({
								title:item.title,
								pubdate:item.pubdate,
								img:`https://shp.qpic.cn/qqvideo_ori/0/${item.vid}_360_204/0`,
							})
						})
					}
				})
			},
			fiexdTop(){
				let navbar=document.getElementById('navbar')
				let main=document.getElementById('main');
				let top=document.documentElement.scrollTop;
				if (top>=230) {
					navbar.classList.add('fiexd-top');
					//防止滚动条跳动
					main.style.marginTop="320px";
				}else{
					navbar.classList.remove('fiexd-top');
					main.style.marginTop=0;
				}

				top>0?this.isAddFilter=true:this.isAddFilter=false
			},
			message(){
				MessageBox({
					title:'提示',
					message:'mv还没有开发呀！'
				})
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
	.filter{
		-webkit-filter: blur(2px);
		-moz-filter: blur(2px);
		-o-filter: blur(2px);
		-ms-filter: blur(2px);
		filter: blur(2px);
	}
	.loading-container{
		margin: 150px 0;
	}

	.singer{
		position: absolute;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.background{
		position: fixed;
		z-index: -1;
		width: 100%;
		height: 274px;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.background::before{
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 274px;
		background-color: rgba(10,10,10,.2);
	}
	.navbar{
		height: 50px;
		margin-top: 274px;
		background-color: #fff;
		letter-spacing: 3px;
	}
	.main{
		background-color: #fff;
		margin-bottom: 80px;
	}
	
	.fiexd-top{
		position: fixed;
		z-index: 40;
		top: 44px;
		left: 0;
		width: 100%;
		margin-top: 0;
	}
	.album{
		display: flex;
		align-items: center;
		width: 100%;
		height: 100px;
		margin: 20px;
	}
	.album img{
		width: 100px;
		height: 100px;
	}
	.album .media-text{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 60%;
		height: 50px;
		margin-left: 20px;
	}
	.album h3{
		font-size: 14px;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.album p{
		color: #666;
		font-size: 14px;
	}

	.mvlist-title{
		margin: 40px 0 20px;
		font-size: 17px;
		font-weight: normal;
		text-align: center;
		letter-spacing: 5px;
		color: #333;
	}
	.mv-ul{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 20px 5px;
	}
	.mv{
		width: 48%;
		margin-right: 5px;
	}
	.mv img{
		width: 100%;
		height: auto;
	}
	.mv h3{
		font-size: 16px;
		font-weight: normal;
		color: #333;
		padding-left: 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin: 5px 0 3px;
	}
	.mv p{
		margin-bottom: 20px;
		padding-left: 10px;
		font-size: 14px;
		color: #333;
	}
</style>