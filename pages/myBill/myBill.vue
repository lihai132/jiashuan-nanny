<template>
	<view class="myBill">
		<view class="myBill-list">
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="item-month">
					<view class="month-title">
						{{item.month}}
						<image class="title-src" :src="item.open==true?'../../static/main/open.png':'../../static/main/collect.png'" mode="" @click="open(item,index)"></image>
						<!-- <image src="../../static/main/collect.png" mode=""></image> -->
					</view>
					<view class="month-bill">
						收入：+{{item.moth_many}}
					</view>

				</view>
				<view class="item-daysList" v-if="item.open">
					<view class="daysList-item" v-for="(ele,i) in item.days" :key="ele.service_date">
						<view class="item-top">
							<view class="top-left">
								{{ele.service_date}}
							</view>
							<view class="top-right">
								+{{ele.days_many}}
							</view>
						</view>
						<view class="daysList-box">
							<view class="daysList-item">
								<view class="item-num">
									{{ele.chuqin_many}}
								</view>
								<view class="item-text">
									出勤
								</view>
							</view>
							<view class="line">
							
							</view>
							<view class="daysList-item">
								<view class="item-num">
									{{ele.canbu_many}}
								</view>
								<view class="item-text">
									餐补
								</view>
							</view>
							<view class="line">
							
							</view>
							<view class="daysList-item">
								<view class="item-num">
									{{ele.serviceorder_many}}
								</view>
								<view class="item-text">
									提成
								</view>
							</view>
							<view class="line">
							
							</view>
							<view class="daysList-item">
								<view class="item-num">
									{{ele.serviceorder_jiaotong_many}}
								</view>
								<view class="item-text">
									车补
								</view>
							</view>
						</view>
						

					</view>
				</view>
			</view>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		billlist
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				page: 1,
				limit: 500,
				list: []

			}
		},
		onShow() {
			let data = {
				nanny_id: uni.getStorageSync('nanny_id'),
				page: this.page,
				limit: this.limit
			}
			this.getbilllist(data)

		},
		methods: {
			getbilllist(data) {

				billlist(data).then(res => {
					if (res.code == 0) {
						res.data.list.map((item)=>{
							item.open=true
						})
						
						this.list = res.data.list


					} else {
						this.$refs.uToast.show({
							title: res.msg
						})
					}
				})
			},
			open(item,index){
				if(item.open==true){
					console.log(1111)
					this.list[index].open=false
					return
				}if(item.open==false){
					console.log(2222)
					this.list[index].open=true
					return
				}
			}
		}

	}
</script>

<style lang="scss" scoped="">
	.myBill {


		.myBill-list {
			.list-item {
				.item-month {
					padding: 30rpx 30rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					background: #F5F5F5;

					.month-title {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 262rpx;
						height: 60rpx;

						background: #FEFFFF;
						border-radius: 31rpx;
						text-align: center;

						font-size: 32rpx;
						font-weight: 400;
						color: #666666;
						line-height: 60rpx;
						letter-spacing: 2rpx;
						.title-src{
							width: 24rpx;
							height: 12rpx;
							margin-left: 4rpx;
						}
					}

					.month-bill {
						font-size: 28rpx;
						font-weight: 400;
						color: #999999;
						line-height: 40rpx;
						letter-spacing: 2rpx;
					}

				}

				.item-daysList {
					.item-top {
						padding: 0 30rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-top: 24rpx;
						padding-bottom: 16rpx;

						.top-left {

							font-size: 32rpx;

							font-weight: 550;
							color: #000000;
							line-height: 44rpx;
						}

						.top-right {

							font-size: 32rpx;
							font-weight: 500;
							color: #FF5C50;
							line-height: 44rpx;

						}

					}
					.daysList-box{
						display: flex;
						align-items: center;
						.daysList-item {
							width: 25%;
							display: flex;
							flex-direction: column;
							justify-content: center;
							text-align: center;
							.item-num{
								
								font-size: 32rpx;
								
								font-weight: 400;
								color: #1A1A1A;
								line-height: 44rpx;
							}
							.item-text{
								
								font-size: 24rpx;
								// margin-top: 18rpx;
								font-weight: 400;
								color: #999999;
								line-height: 34rpx;
								margin-bottom: 24rpx;
							}
						}
						.line{
							width: 1px;
							height: 34rpx;
							background: #D8D8D8;
						}
					}

					
				}
			}
		}
	}
</style>
