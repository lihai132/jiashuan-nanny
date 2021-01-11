<template>
	<u-mask :show="show" @click="show = false">
		<view class="warp">
			<view class="rect" @tap.stop>
				<view class="rect-title">
					{{title}}
				</view>
				<image class="rect-src" :src="src" mode=""></image>
				<view class="rect-text">
					{{text}}
				</view>
			</view>
		</view>
	</u-mask>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				src: "",
				title: "",
				text: ""
			}
		},
		methods: {
			open(src, type) {
				this.show = true
				this.src = src
				if (type == 1) {
					
					this.title = "推广二维码";
					this.text = "扫一扫上面二维码，打开小程序"

				}
				if (type == 2) {
					this.title = "个人信息二维码";
					this.text = "扫一扫上面二维码，查看家政师个人信息"
				}

			},
			close() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rect {
		width: 654rpx;
		height: 830rpx;
		background-color: #fff;
		text-align: center;

		.rect-src {
			width: 510rpx;
			height: 510rpx;
		}

		.rect-title {
			font-size: 36rpx;
			font-weight: 400;
			color: #202020;
			line-height: 50rpx;
			margin-bottom: 50rpx;
			text-align: center;
			padding-top: 60rpx;
		}

		.rect-text {
			text-align: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			line-height: 40rpx;
			margin-top: 60rpx;
			padding-bottom: 60rpx;
		}
	}
</style>
