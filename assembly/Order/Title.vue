<template>
	<view class="order-head">
		<view class="order-head-title">
			订单
		</view>
	</view>
</template>

<script>
	export default{
		name:"orderHead",
		data(){
			return{
				
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.order-head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88upx;
		background-color: #fff;
		// padding-bottom: 40upx;
		z-index: 5;
	
		.order-head-title {
			margin-left: 40upx;
			font-size: 36upx;
			line-height: 88upx;
			font-weight: 500;
			color: #1A1A1A;
		}
	}
</style>
