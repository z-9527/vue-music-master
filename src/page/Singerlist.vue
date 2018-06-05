<template>
	<div class="singerlist">
		<div class="router-list">
			<div class="loading-container" v-if="!singerlist.length">
				<loading></loading>
			</div>
			<mt-index-list>
				<mt-index-section v-for="(item,index) in singerlist" :key="index" :index="item.title">
					<mt-cell v-for="(singer,index) in item.items" :key="index" class="singer-item">
						<div class="media" @click="goTo('singerlist/singer',singer.singermid,singer.singername)">
							<img v-lazy="singer.img">
							<span>{{singer.singername}}</span>
						</div>
					</mt-cell>
				</mt-index-section>
			</mt-index-list>
		</div>
		<div class="router-view">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	import getSingerlistData from '@/api/getSingerlistData.js'
	import Loading from '@/components/Loading'

	const HOT_NAME="热"   
	const HOT_LIST_LEN=10 //热门歌手数组长度

	export default {
		components:{
			Loading
		},
		data(){
			return {
				singerlist:[]
			}
		},
		created(){
			this._getSingerlistData();
		},
		methods:{
			_getSingerlistData(){
				getSingerlistData().then((res)=>{
					this.singerlist=this.normalizeSingerList(res.data.list)
				})
			},
			normalizeSingerList(list){
				let map={
					hot:{
						title:HOT_NAME,
						items:[]
					}
				}
				list.forEach((item,index)=>{
					if(index<HOT_LIST_LEN){
						map.hot.items.push({
							singername:item.Fsinger_name,
							singermid:item.Fsinger_mid,
							img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
					let key=item.Findex;
					if (!map[key]) {
						map[key]={
							title:key,
							items:[]
						}
					}
					map[key].items.push({
						singername:item.Fsinger_name,
						singermid:item.Fsinger_mid,
						img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
					})
				})
				//开始排序
				let hot=[];
				let sortList=[];
				hot.push(map.hot);
				for(var key in map){
					if (map[key].title.match(/[a-zA-Z]/)) {
						sortList.push(map[key]);
					}
				}
				sortList.sort(function(a,b){
					return a.title.charCodeAt(0)-b.title.charCodeAt(0);
				})

				return hot.concat(sortList);
			},
			goTo(plcae,params,query){
				let url=`/${plcae}/${params}?singername=${query}`
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
	.singer-item{
		position: relative;
		height: 72px;
	}
	.media{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 80%;
		height: 72px;
		line-height: 72px;
		padding-left: 20px;
	}
	.media img{
		display: inline-block;
		width: 50px;
		height: 50px;
		margin-right: 15px;
		border-radius: 50%;
	}
	.media span{
		font-size: 14px;
	}
</style>