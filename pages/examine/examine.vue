<template>
	<view class="examine">
		<view class="BackgroundMap">
			<image class="BackgroundMap-src" src="../../static/index/none.png" mode=""></image>
		</view>
		<view class="examine-text">
			{{text}}
		</view>

		<view class="examine-but" >
			<button class="examine-but-cli" type="default" @click="gotoPage">{{butText}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: "你的资料正在审核中， 有疑问可询问站长～",
				butText: "重新登录",
				num:""
			}
		},
		onLoad(option) {
			this.num = option.is_examine
			if (this.num == 0) {
				this.text = "你的资料正在审核中， 有疑问可询问站长～"
				this.butText = "重新登录"
			}
			if (this.num == 2) {
				this.text = "你的审核未通过， 请点击下方按钮重新修改～"
				this.butText = "重新填写"
			}
		},
		
			
		methods:{
			gotoPage(){
				if(this.num == 0){
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}if(this.num == 2){
					uni.navigateTo({
						url: './step3'
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.examine {
		.BackgroundMap {
			padding-top: 428rpx;
			padding-bottom: 44rpx;
			text-align: center;

			.BackgroundMap-src {
				width: 360rpx;
				height: 208rpx;
			}
		}

		.examine-text {
			text-align: center;
			font-size: 28rpx;

			font-weight: 400;
			color: #666666;
			line-height: 40rpx;
		}

		.examine-but {
			margin-top: 24rpx;
			text-align: center;

			.examine-but-cli {
				width: 168rpx;
				height: 56rpx;
				background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
				border-radius: 35rpx;
				// line-height: 56rpx;

				font-size: 24rpx;

				font-weight: 400;
				color: #FFFFFF;
				// line-height: 56rpx;
			}
		}
	}
</style>
