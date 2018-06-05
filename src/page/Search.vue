<template>
	<div class="serach">
		<div class="search-bar" ref="searchBar">
			<div class="input-warp">
				<i class="iconfont icon-sousuo"></i>
				<input type="text" v-model="value" placeholder="搜索歌曲、歌单、专辑" @focus="toggleShow(true)">
				<i class="iconfont icon-chahao" v-show="value" @click="deleteValue"></i>
			</div>
			<div class="cancel-btn" v-show="isShow" @click="toggleShow(false)">取消</div>
		</div>
		<div class="hot-keys" v-show="!isShow">
			<h3>热门搜索</h3>
			<ul>
				<li v-for="(item,index) in hotlist" :key="index" @click="selectHotKey(item.k)">
					<span>{{item.k}}</span>
				</li>
			</ul>
		</div>
		<div class="focus-wrapper" v-show="isShow">
			<div class="search-history" v-show="!value">
				<ul>
					<li v-for="(item,index) in searchHistory" :key="index" class="history" @click="value=item">
						<i class="iconfont icon-lishiyouxibitongjiweijihuo"></i>
						<span>{{item}}</span>
						<span class="cha" @click.stop="removeItem({key:'searchHistory',index})">×</span>
					</li>
					<li class="clearlist" v-show="searchHistory.length">
						<i class="iconfont icon-lajitong1"></i>&ensp;
						<span @click="clearList('searchHistory')">清空搜索记录</span>
					</li>
				</ul>
			</div>
			<div class="search-suggestion" v-show="value" ref="suggestion">
				<mt-loadmore 
				:bottom-method="loadBottom" 
				:bottom-all-loaded="allLoaded"
				@bottom-status-change="test" 
				ref="loadmore">
					<ul>
						<li v-for="(item,index) in suggestionList" :key="index" @click="addSearchHistory(item,item.type)">
							<div class="media-icon">
								<i class="iconfont icon-yinle1"></i>
							</div>
							<div class="media-text">
								<h3 v-html="getContent(item,'h3')"></h3>
								<p v-html="getContent(item,'p')"></p>
							</div>
						</li>
						<li v-show="allLoaded&&suggestionList.length" class="allLoaded">已加载全部</li>
					</ul>
				</mt-loadmore>
			</div>
		</div>
	</div>
</template>
<script>
	import { getHotKey,getSuggestion } from '@/api/getHotKey'
	import { createSong } from '@/assets/js/song'
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'

	export default {
		data(){
			return {
				hotlist:[],
				value:'',
				isShow:false,
				suggestionList:[],
				pageNum:1,
				allLoaded:false
			}
		},
		created(){
			this._getHotKey();
		},
		mounted(){
			this.getHeight()
		},
		computed:{
			...mapState([
				'searchHistory',
				'playlist',
				'sequencelist',
				'currentIndex',
				'fullScreen'
			]),
			...mapGetters([
				'currentSong'
			]),
		},
		watch:{
			value(){
				this.pageNum = 1
				getSuggestion(this.value,1).then((res)=>{
					let data=res.data
					//清空上一次搜索建议
					this.suggestionList = []
					data.song.list.forEach((item)=>{
						let song = {
							type: 0 //表示为歌曲类型
						}
						Object.assign(song,createSong(item))
						this.suggestionList.push(song)
					})
					if (data.zhida.type!=0) {
						this.suggestionList.unshift(data.zhida)
					}
				})
			}
		},
		methods:{
			...mapMutations([
				'addItem',
				'removeItem',
				'clearList',
				'setFullScreenState',
				'addItemPosition',
				'setCurrentIndex',
				'setPlayingState'
			]),
			...mapActions([
				'selectPlay'
			]),
			_getHotKey(){
				getHotKey().then((res)=>{
					for(let i=0;i<10;i++){
						this.hotlist.push(res.data.hotkey[i])
					}
				})
			},
			deleteValue(){
				this.value=''
			},
			toggleShow(flag){
				this.isShow = flag
			},
			loadBottom(){
				getSuggestion(this.value,this.pageNum++).then((res)=>{
					let data=res.data
					if (!data.song.list.length) {
						this.allLoaded = true
						this.$refs.suggestion.style.paddingBottom = 80+'px'
						return 
					}
					data.song.list.forEach((item)=>{
						let song = {
							type: 0 //表示为歌曲类型
						}
						Object.assign(song,createSong(item))
						this.suggestionList.push(song)
					})
				})
				//为什么添加了下面一句话后没有loading状态？
				// this.$refs.loadmore.onBottomLoaded()
			},
			test(a){
				// console.log(a)
			},
			getHeight(){
				let totalHeight = window.innerHeight;
				let searchBarHeight = this.$refs.searchBar.clientHeight
				let suggestionHeight = totalHeight - searchBarHeight - 84 + 'px'
				this.$refs.suggestion.style.height = suggestionHeight
			},
			getContent(item,tag){
				//此函数是获取不同类型搜索建议的内容
				switch (item.type) {
					case 2 : 
						if (tag === 'h3') {
							return item.singername
						}else {
							return `单曲：${item.songnum} 专辑：${item.albumnum}`
						}
					case 3 : 
						if (tag === 'h3') {
							return item.albumname
						}else {
							return item.singername
						}
					default : 
						if (tag === 'h3') {
							return item.songname
						}else {
							return item.singername
						}
				}
			},
			addSearchHistory(item,type){
				let idx = this.searchHistory.findIndex((history)=>{
					return history === this.value
				})
				if (idx === -1) {
					this.addItem({
						key:'searchHistory',
						song:this.value
					})
				}
				switch (type) {
					case 2:{
						this.$router.push('/singerlist/singer/'+item.singermid)
						break;
					}
					case 3:{
						this.$router.push('/album/'+item.albummid)
						break;
					}
					default :{
						if (!this.sequencelist.length) {
							let list=[]
							list.push(item)
							this.selectPlay({
								list,
								index:0
							})
							this.setFullScreenState(true)
						} else {
							// let index1 = this.sequencelist.findIndex((song)=>{
							// 	return song.id === this.currentSong.id
							// })
							// this.addItemPosition({
							// 	key:'sequencelist',
							// 	song:item,
							// 	index:index1+1
							// })

							let index2 = this.playlist.findIndex((song)=>{
								return song.id === this.currentSong.id
							})
							this.addItemPosition({
								key:'playlist',
								song:item,
								index:index2+1
							})
							this.setCurrentIndex(index2+1)
							this.setPlayingState(true)
							this.setFullScreenState(true)
						}
						break;
					}
				}
			},
			selectHotKey(value){
				this.value = value
				this.isShow = true
			}
		}
	}
</script>
<style scoped>
	.search-bar{
		display: flex;
		background: #f4f4f4;
		padding: 10px;
	}
	.input-warp{
		display: flex;
		justify-content: space-between;
		flex-grow: 1;
		height: 20px;
	    padding: 8px 10px;
		background-color: #fff;
		box-sizing: content-box;
		color: rgba(0,0,0,.3);
	}
	.input-warp i{
		font-size: 18px;
	}
	input::-webkit-input-placeholder{
		color: rgba(0,0,0,.3);
	}
	.input-warp input{
		margin: 0 5px;
		flex-grow: 1;
		outline: none;
		color: rgba(0,0,0,.3);
	}
	.cancel-btn{
		height: 36px;
    	line-height: 36px;
    	font-size: 14px;
    	padding: 0 5px 0 15px;
    	color: #555;
	}

	.hot-keys{
		padding: 15px;
	}
	.hot-keys>h3{
		color: rgba(0,0,0,.6);
		margin-bottom: 15px;
		font-size: 16px;
	}
	.hot-keys li{
		display: inline-block;
		padding: 5px 10px;
		margin: 0 20px 10px 0;
		border-radius: 6px;
		font-size: 14px;
		color: #000;
		border: 1px solid rgba(0,0,0,.6);
	}
	.search-suggestion{
		height: 300px;
		overflow: auto;
	}
	.search-suggestion li{
		display: flex;
		align-items: center;
		padding: 10px 20px;
	}
	.search-suggestion .allLoaded{
		display: block;
		text-align: center;
		color: rgba(0,0,0,.6);
	}
	.search-suggestion .media-icon i{
		font-size: 30px;
		color: rgba(0,0,0,.6);
	}
	.search-suggestion .media-text{
		width: 80%;
		margin-left: 10px;
	}
	.search-suggestion .media-text h3{
		color: #444;
		font-size: 15px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.search-suggestion .media-text p{
		color: #777;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.search-history li{
		position: relative;
		padding: 10px 20px;
		color: rgba(0,0,0,.6);
	}
	.search-history .clearlist{
		display: block;
		width: 170px;
		margin: 0 auto;
		color: #777;
	}
	.search-history .clearlist i{
		color: #777;
		font-size: 18px;
	}
	.search-history .history i{
		display: inline-block;
		font-size: 23px;
		margin-right: 15px;
		transform: translateY(2px);
		vertical-align: bottom;
	}
	.search-history .cha{
		position: absolute;
		right: 30px;
		top: 50%;
		transform: translateY(-50%);
		color: #ccc;
		font-size: 28px;
	}
</style>