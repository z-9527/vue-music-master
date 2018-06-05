<template>
	<div class="page-header" :style="imgStyle">
		<i class="iconfont icon-zuojiantou" @click="goback"></i>
		<h3 class="title" v-html="title"></h3>
	</div>
</template>
<script>
	export default {
		props:{
			title:{
				type:String,
				default:''
			},
			imgUrl:{
				type:String,
				default:''
			}
		},
		computed:{
			imgStyle(){
				return `backgroundImage:url(${this.imgUrl})`
			}
		},
		methods:{
			goback(){
				this.$router.go(-1)
			}
		}
	}
</script>
<style scoped>
	.page-header{
		position: fixed;
		z-index: 20;
		top: 0;
		left: 0;
		width: 100%;
		height: 44px;
		line-height: 44px;
		background-size: cover;
		background-repeat: no-repeat;
		/*background-color: #31c27c;*/
	}
	.page-header::before{
		content: "";
		position: absolute;
		z-index: 8;
		top: 0;
		left: 0;
		width: 100%;
		height: 44px;
		background-color: rgba(10,10,10,.2);
	}
	.page-header i{
		position: absolute;
		z-index: 10;
		left: 15px;
		font-size: 25px;
		color: #fff;	
	}
	.page-header h3{
		position: absolute;
		z-index: 9;
		width: 100%;
		height: 44px;
		font-size: 18px;
		font-weight: normal;
		color: #fff;
		text-align: center;
	}
</style>