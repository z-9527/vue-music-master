<template> 
	<transition name="slide">
		<div class="album">
			<div class="album-header">
				<div class="album-box-bd">
					<page-header title="专辑"></page-header>
					<div class="album-info">
						<div class="media-img">
							<img :src="albuminfo.img">
						</div>
						<div class="media-text">
							<h2>{{albuminfo.name}}</h2>
							<div @click="goTo('singerlist/singer',albuminfo.singermid)">
								<img :src="albuminfo.singerimg">
								{{albuminfo.singername}}
							</div>
							<p>发行时间：{{albuminfo.publishData}}</p>
						</div>
					</div>
				</div>
				<img class="album-box-bg" :src="albuminfo.img">
			</div>
			<div class="navbar">
				<mt-navbar v-model="selected">
					<mt-tab-item id="songlist">专辑歌曲</mt-tab-item>
					<mt-tab-item id="description">专辑简介</mt-tab-item>
				</mt-navbar>
			</div>
			<div class="main">
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="songlist">
						<song-list :songlist="albuminfo.songlist" :isShowIndex="true"></song-list>
						<h2>歌手其他专辑</h2>
						<ul class="otherAlbums">
							<li v-for="(item,index) in albuminfo.otherAlbums" :key="index" @click="goTo('album',item.albumMid)">
								<div class="media-img">
									<img :src="`https://y.gtimg.cn/music/photo_new/T002R150x150M000${item.albumMid}.jpg?max_age=2592000`">
								</div>
								<div class="media-text">
									<h3>{{item.title}}</h3>
									<p>{{item.pubDate}}</p>
								</div>
							</li>
						</ul>
					</mt-tab-container-item>
					<mt-tab-container-item id="description">
						<div class="description">
							<h2>专辑简介</h2>
							<p v-html="albuminfo.desc"></p>
						</div>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
	</transition>
</template>
<script>
	import getAlbumData from '@/api/getAlbumData'
	import { createSong } from '@/assets/js/song'
	import PageHeader from '@/components/PageHeader'
	import Loading from '@/components/Loading'
	import SongList from '@/components/SongList'

	export default {
		components:{
			PageHeader,
			Loading,
			SongList
		},
		data(){
			return {
				albuminfo:{},
				selected:'songlist'
			}
		},
		watch:{
			'$route'(to,from){
				this._getAlbumData()
			}
		},
		created(){
			this._getAlbumData()
		},
		methods:{
			_getAlbumData(){
				let id=this.$route.params.id
				getAlbumData(id).then((res)=>{
					let data=res.data;
					let desc=res.data.desc.replace(/\n/g,'<br>')
					let info={
						img:`https://y.gtimg.cn/music/photo_new/T002R150x150M000${data.mid}.jpg?max_age=2592000`,
						singerimg:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${data.singermid}.jpg?max_age=2592000`,
						publishData:data.aDate,
						desc:desc,
						name:data.name,
						singername:data.singername,
						singermid:data.singermid,
						otherAlbums:data.otherAlbums,
						songlist:[],
					}
					//歌曲列表
					data.list.forEach((item)=>{
						info.songlist.push(createSong(item))
					})
					this.albuminfo=Object.assign({},info)
				})
			},
			goTo(place,id){
				let url=`/${place}/${id}`
				this.$router.push(url)
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
	.album{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.album-header{
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
	.album-box-bd{
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
	.album-box-bg{
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
	.album-info{
		display: flex;
		margin-top: 85px;
		padding: 0 16px;
		box-sizing: content-box;
	}
	.album-info .media-img img{
		width: 125px;
		height: 125px;
	}
	.album-info .media-text{
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 10px;
		font-family: sans-serif;
	}
	.album-info .media-text h2{
		font-size: 18px;
		font-weight: normal;
	}
	.album-info .media-text div{
		margin-top: 8px;
		font-size: 14px;
	}
	.album-info .media-text img{
		width: 24px;
		height: 24px;
		margin-right: 5px;
		border-radius: 50%;
		vertical-align: middle;
	}
	.album-info .media-text p{
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
		margin-bottom: 80px;
	}
	.main h3{
		color: #333;
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.otherAlbums{
		display: flex;
		justify-content: space-between;
	}
	.otherAlbums li{
		width: 32.5%;
	}
	.otherAlbums .media-text{
		padding: 0 3px;
	}
	.otherAlbums img{
		width: 100%;
		height: auto;
	}
	.otherAlbums p{
		color: #777;
		font-size: 14px;
	}

	.main h2{
		margin: 40px 0 20px;
		font-size: 17px;
		font-weight: normal;
		text-align: center;
		letter-spacing: 5px;
		color: #555;
	}
	.description p{
		margin: 0 30px 60px;
		font-size: 14px;
		color: #777;
	}

</style>



