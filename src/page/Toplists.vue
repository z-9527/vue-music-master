<template>
	<div class="toplists">
		<ul>
			<div class="loading-container" v-if="!toplists.length">
				<loading></loading>
			</div>
			<li v-for="(item,index) in toplists" :key="index" @click="goTo('toplists/toplist',item.id)">
				<div class="media-img"><img v-lazy="item.picUrl"></div>
				<div class="media-text">
					<p v-for="(song,index) in item.songList" :key="index">
						<span>{{index+1}}</span>
						<span class="songname">{{song.songname}}</span>
						<span>-{{song.singername}}</span>
					</p>
				</div>
				<div class="arrow"></div>
			</li>
		</ul>
		<router-view></router-view>
	</div>
</template>
<script>
	import getToplistsData from '@/api/getToplistsData'
	import Loading from '@/components/Loading'
	export default {
		components:{
			Loading
		},
		data(){
			return {
				toplists:[]
			}
		},
		created(){
			this._getToplistsData();
		},
		methods:{
			_getToplistsData(){
				getToplistsData().then((res)=>{
					this.toplists=res.data.topList
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
	.loading-container{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.toplists{
		width: 100%;
		padding: 0 20px;
		background-color: #f4f4f4;
		overflow: hidden;
		margin-bottom: 80px;
	}
	.toplists li{
		position: relative;
		display: flex;
		align-items: center;
		height: 100px;
		width: 100%;
		margin-top: 20px;
		background-color: #fff;
	}
	.toplists img{
		width: 100px;
		height: 100px;
	}
	.toplists .media-text{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 80px;
		width: 60%;
		margin-left: 20px;
	}
	.toplists .media-text .songname{
		color: #000;
	}
	.toplists .media-text p{
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: #888;
	}
	.arrow{
		position: absolute;
		right: 12px;
		top: 47.5px;
		width: 6px;
		height: 6px;
		box-sizing: content-box;
		border-right: 1px solid #b2b2b2;
		border-bottom: 1px solid #b2b2b2;
		transform: rotate(-45deg);
	}
</style>
