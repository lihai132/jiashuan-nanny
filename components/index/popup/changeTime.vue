<template>
	<u-popup v-model="show" mode="center" width="590rpx" height="790rpx">
		<view class="title">
			上门时间调整申请
		</view>
		<view class="item" v-for="(item,index) in list" :key="index">
			<view class="item-title">
				{{item.title}}
			</view>
			<view class="item-text">
				{{item.text}}
			</view>
			<image class="call" :src="item.src" @click="callPhone"></image>
			<!-- <image class="OrderList-item-title-left-type-src" :src="item.typeSrc" mode=""></image> -->
		</view>
		<view class="but-box">
			<button class="cencel" type="default" @click="close">取消申请</button>
			<button class="qd" type="default" @click="close">确认调整</button>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				list: [{
					title: "保洁整理：",
					text: "体验套餐",
					src:""
				}, {
					title: "预定日期：",
					text: "2020-12-26",
					src:""
				},{
					title: "期望日期：",
					text: "2020-12-30",
					src:""
				},{
					title: "联系人：",
					text: "王先生",
					src:"../../static/index/hei.png"
				},{
					title: "家政师：",
					text: "何小姐",
					src:"../../static/index/ju.png"
				},{
					title: "上门时间：",
					text: "14:00～18:00",
					src:""
				},   {
					title: "服务地址：",
					text: "广州市荔湾区中海花湾壹号 C区C7栋905",
					src:""
				}]
			}
		},
		methods:{
			open(){
				this.show=true
			},
			close(){
				this.show=false;
				this.$store.commit("setChange",false)
			},
			callPhone(){
				uni.makePhoneCall({
				
					// 手机号
					phoneNumber: "18617271159",
				
					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},
				
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				
				});
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	uni-button:after {
		border: none;
	}

	.title {
		font-size: 34rpx;
		font-weight: 550;
		color: #333333;
		line-height: 48rpx;
		text-align: center;
		padding-top: 64rpx;
		padding-bottom: 32rpx;
	}

	.item {
		padding-bottom: 20rpx;
		display: flex;
		padding-left: 48rpx;
		padding-right: 48rpx;
		position: relative;

		.item-title {
			font-size: 30rpx;
			width: 150rpx;
			font-weight: 400;
			color: #666666;
			line-height: 42rpx;
			text-align: justify;
		}
		
		// .item-title::after {
		//   display: inline-block;
		//   width: 100%;
		//   content: "";
		 
		// }

		.item-text {
			font-size: 30rpx;
			font-weight: 550;
			color: #222222;
			line-height: 42rpx;
			flex: 1;

			// display: -webkit-box;
			// -webkit-box-orient: vertical;
			// -webkit-line-clamp: 2;
			// overflow: hidden;
			// width: 344rpx;


		}
		.call{
			position: absolute;
			width: 42rpx;
			height: 42rpx;
			right: 48rpx;
		}
	}

	.but-box {
		margin-top: 64rpx;
		display: flex;
		padding: 0 48rpx;

		.cencel {
			width: 228rpx;
			height: 72rpx;
			background: #F6F6F6;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: 400;
			color: #666666;
			line-height: 68rpx;
			// border: none;
		}

		.qd {
			width: 228rpx;
			height: 72rpx;

			background: #FF8666;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: 400;

			color: #FFFFFF;
			line-height: 68rpx;
			// border: none !important;
		}
	}
</style>
