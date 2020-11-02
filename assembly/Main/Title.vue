<template>
	<view class="main-head">
		<view class="main-head-title">{{title}}</view>
		<view class="main-head-setup">
			<image class="main-head-setup-src" src="../../static/main/setup.png" mode="" @click="goto" />
		</view>
	</view>
</template>

<script>
	export default{
		name:"mainHead",
		props: {
			title: {
				type: String,
				default: '家舒安'
			},
			auto: {
				type: Number,
				default: 1
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			goto(){
				uni.navigateTo({
					url: "/pages/setup/setup?auto="+this.auto
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.main-head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88upx;
		background-color: #fff;
		z-index: 1000;
		
		display: flex;
		padding-left: 40rpx;
		padding-right: 40rpx;
		justify-content: space-between;
		align-items: center;
	
		.main-head-title {
			font-size: 36upx;
			line-height: 88upx;
			font-weight: 500;
			color: #1A1A1A;
		}
		.main-head-setup{
			.main-head-setup-src{
				width: 34rpx;
				height: 34rpx;
			}
		}
	}
</style>
