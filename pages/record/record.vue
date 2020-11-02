<template>
	<view class="record">
		<u-navbar back-text="" title="请假记录"></u-navbar>
		<view class=" record-content">
			<view class="record-content-item" v-for="(item,index) in recordList" :key="index">
				<view class="record-item-title">
					<view class="record-item-title-left">
						<text class="item-title-left-t1">提交时间</text>
						<text class="item-title-left-t2">{{item.create_time}}</text>

					</view>
					<view class="record-item-title-right" :class="[{examine: item.status == 0}, {Failed: item.status == 1}, {cancel: item.status == 2}, {adopt: item.status == 3}]">
						{{item.status_tip}}
					</view>
				</view>
				<view class="record-item-startTime">
					<text class="item-Time-t1">开始时间</text>
					<text class="item-Time-t1">{{item.start_date}}</text>
				</view>
				<view class="record-item-endTime">
					<text class="item-Time-t1">结束时间</text>
					<text class="item-Time-t1">{{item.end_date}}</text>
				</view>
				<view class="record-item-line" v-if="item.showBut">

				</view>
				<view class="record-item-foot" v-if="item.status == 0">
					<button class="record-item-foot-but" @click="cancel(item.id) " type="default">取消申请</button>
				</view>
			</view>
		</view>
		<view class="no-data" v-if="showNone">
			<view class="no-data-img flexbox center">
				<image src="../../static/index/no-accept.png" mode="widthFix"></image>
			</view>
			<view class="no-data-text flexbox center">
				暂无请假记录
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getLeaveList,
		postCancel
	} from '../../utils/api.js';
	import {
		format
	} from '../../utils/common.js';
	export default {
		data() {
			return {
				recordList: [],
				showNone: false
			}
		},
		onLoad(options) {
			this.getList()
		},
		methods: {
			getList() {
				getLeaveList({
					nanny_id: uni.getStorageSync('nanny_id')
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						if (res.data) {
							let data = res.data;
							for (let i in data) {
								data[i].create_time = format(new Date(data[i].create_time), 'yyyy-MM-dd')
							}
							this.recordList = data;
						}else{
							this.showNone=true
						}

					} else {
						this.$refs.uToast.show({
							title: '系统错误'
						})
					}
				})
			},
			cancel(id) {
				console.log(id)
				postCancel({
					nanny_id: uni.getStorageSync('nanny_id'),
					list_id: id
				}).then(res => {
					if (res.code == 0) {
						this.getList()
					}
					// console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	html {}

	.record {
		height: 100%;
		background: #F6F6F6;


		.record-content {
			padding-bottom: 80upx;
			background: #F6F6F6;

			.record-content-item {
				margin-top: 30rpx;
				margin-left: 30rpx;
				margin-right: 30upx;
				// height: 400upx;
				background: #FFFFFF;
				border-radius: 12upx;
				padding-top: 30rpx;
				padding-left: 30upx;
				padding-right: 30rpx;
				margin-right: 30rpx;
				padding-bottom: 12rpx;

				.record-item-title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 30rpx;

					.record-item-title-left {
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;

						.item-title-left-t1 {
							margin-right: 20upx;
						}

					}

					.record-item-title-right {
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFB866;
					}

					.examine {
						color: #FFB866;
					}

					.Failed {
						color: #FF2020;
					}

					.cancel {
						clear: #999999;
					}

					.adopt {
						color: #42C485;
					}
				}

				.record-item-startTime,
				.record-item-endTime {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.item-Time-t1 {
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #202020;
						line-height: 44upx;
						margin-right: 20rpx;
					}

				}

				.record-item-line {
					margin-top: 16rpx;
					height: 2upx;
					background: #F6F6F6;
				}

				.record-item-foot {
					margin-top: 36rpx;
					// position: relative;

					height: 70rpx;
					margin-bottom: 32rpx;

					.record-item-foot-but {
						width: 192rpx;
						height: 70rpx;
						border-radius: 35rpx;
						border: 2upx solid #DDDDDD;
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #202020;
						line-height: 70rpx;
						text-align: center;
						background-color: #fff;
						// position: absolute;
						// top: 0;
						// right: 0rpx;
						// margin-bottom: 32rpx;
						float: right;
					}
				}

			}
		}
	}
	.no-data {
		margin-top: 252upx;
	
		.no-data-img image {
			width: 360upx;
			height: 208upx;
		}
	
		.no-data-text {
			margin-top: 44upx;
			color: #666;
			font-size: 28upx;
		}
	}
</style>
