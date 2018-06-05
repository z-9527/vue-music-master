<template>
	<div class="loading">
		<img src="../assets/img/loading.gif">
		<p class="desc">{{title}}</p>
	</div>
</template>
<script>
	export default {
		props:{
			title:{
				type:String,
				 default: '正在载入...'
			}
		}
	}
</script>
<style scoped>
	.loading{
		text-align: center;
	}
	.loading img{
		width: 24px;
		height: 24px;
	}
	.desc{
		margin-top: 10px;
		margin-right: -8px;
		font-size: 14px;
		color: #666;
	}
</style>