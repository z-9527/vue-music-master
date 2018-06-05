<template>
	<div class="progress-circle">
		<canvas width="36px" height="36px" ref="canvas" class="canvas"></canvas>
		<slot></slot>
	</div>
</template> 
<script>
	export default {
		props:{
			percentage:{
				type:Number,
				default:0
			}
		},
		watch:{
			percentage(){
				this.drawCircle()
			}
		},
		computed:{
			radian(){
				return -Math.PI/2+2*Math.PI*this.percentage
			}
		},
		methods:{
			drawCircle(){
				let ctx = this.$refs.canvas.getContext('2d')
				ctx.clearRect(0,0,40,40);
				ctx.beginPath()
  				ctx.strokeStyle = "#31c27c";
  				ctx.lineWidth = 3;
				ctx.arc(18,18,15,-Math.PI/2,this.radian)
				ctx.stroke()
			} 
		}
	}
</script>
<style scoped>
	.progress-circle{
		position: relative;
		height: 36px;
		width: 36px;
	}
	.canvas{
		position: absolute;
		top: 0;
		left: 0;
	}
</style>