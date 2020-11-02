<template>
	<view class="leave">
		<view class="leave-head">
			<u-navbar b:is-fixed="isFixed" :title="title" :is-back="isBack" height="44px" :immersive="true">
				<view class="navbar-right" slot="right" v-if="slotRight" @click="gotoList">
					请假记录
				</view>
			</u-navbar>
			<view class="leave-content">
				<view class="leave-content-list">
					<view class="content-list-item" @click="start">
						<view class="item-start-left">
							<view class="leave-item-asterisk">
								<image class="item-asterisk-star" src="../../static/main/icon-star.png" mode=""></image>
							</view>
							<view class="item-start-text">
								开始日期
							</view>
						</view>
						<view class="item-start-right">
							<view class="start-right-text" :class="{'start-right-active':form.startshow==true}">
								{{form.startTime}}
							</view>
							<u-icon name="arrow-right" color="#999999"></u-icon>
						</view>
					</view>
					<view class="leave-item-line"></view>
					<view class="content-list-item" @click="end">
						<view class="item-start-left">
							<view class="leave-item-asterisk">
								<image class="item-asterisk-star" src="../../static/main/icon-star.png" mode=""></image>
							</view>
							<view class="item-start-text">
								结束日期
							</view>
						</view>
						<view class="item-start-right">
							<view class="start-right-text" :class="{'start-right-active':form.endshow==true}">
								{{form.endTime}}
							</view>
							<u-icon name="arrow-right" color="#999999"></u-icon>
						</view>
					</view>
					<view class="leave-item-line"></view>
					<view class="content-list-item">
						<view class="item-start-left">
							<view class="leave-item-asterisk">
								<image class="item-asterisk-star" src="../../static/main/icon-star.png" mode=""></image>
							</view>
							<view class="item-start-text">
								时长(天)
							</view>
							<view class="item-start-time"></view>
						</view>
						<view class="item-start-right">
							<view class="start-right-text start-right-active">
								{{form.longTime}}
							</view>
						</view>
					</view>
					<view class="leave-item-line"></view>
				</view>
				<view class="leave-content-reason">
					<view class="content-reason-title">
						请假事由(必填)
					</view>
					<textarea class="content-reason-input" maxlength="200" v-model.trim="remark" placeholder="请输入请假事由"></textarea>
					<view class="reason-nav-input-num">
						{{contrast}}/200
					</view>
				</view>
				<view class="leave-foot">
					<u-button class="OrderDetails-foot-ordersSuccess" hover-class="none" @click="determine">提交申请</u-button>
				</view>
			</view>
		</view>
		<view class="leave-calendar">
			<u-calendar v-model="show1" :mode="mode" @change="startChange" :change-year="false" :min-date="newdate" :max-date="longDate"></u-calendar>
			<u-calendar v-model="show2" :mode="mode" @change="endChange" :change-year="false" :min-date="newdate" :max-date="longDate"></u-calendar>
		</view>
		<view>
			<u-modal v-model="doling.show" @confirm="confirm" :content="doling.content" :show-title="false" :show-cancel-button="true"></u-modal>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		postLeave
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				errorType: ['message'],
				isBack: true,
				slotRight: true,
				title: "请假",
				doling: {
					show: false,
					content: '请假需要站长批准， 确认请假？',
				},
				show1: false,
				show2: false,
				mode: 'date',
				newdate: "",
				longDate: "2030-01-01",
				form: {
					startTime: "请选择",
					endTime: "请选择",
					startshow: false,
					endshow: false,
					longTime: "",
					startBut: false,
					endBut: false
				},
				remark: '',
				contrast: 0
			}
		},
		methods: {
			startChange(e) {
				console.log(e);
				this.form.startTime = e.result
				this.form.startshow = true
				this.form.startBut = true
				if (this.form.startBut == true && this.form.endBut == true) {
					this.form.longTime = this.obtainLong() + "天"
				}

			},
			endChange(e) {
				console.log(e);
				this.form.endTime = e.result
				this.form.endshow = true
				this.form.endBut = true
				if (this.form.startBut == true && this.form.endBut == true) {
					this.form.longTime = this.obtainLong() + "天"
				}
			},
			start() {
				this.show1 = true
			},
			end() {
				this.show2 = true
			},
			getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},
			obtainLong() {
				if (this.form.startBut == true && this.form.endBut == true) {
					var startDate = Date.parse(this.form.startTime);
					var endDate = Date.parse(this.form.endTime);
					var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);

					return days + 1;
				}
			},
			submit() {
				this.doling.show = true;
			},
			// 提交表单
			confirm() {
				postLeave({
					nanny_id: uni.getStorageSync('nanny_id'),
					start_date: this.form.startTime,
					end_date: this.form.endTime,
					days: this.form.longTime.substr(0, this.form.longTime.length - 1),
					remark: this.remark
				}).then(res => {
					if (res.code == 0) {
						uni.navigateTo({
							url: '/pages/record/record',
						});
					} else {
						this.$refs.uToast.show({
							title: res.msg
						})
					}
				})
			},
			determine() {
				if (this.form.startTime == "请选择") {
					this.$refs.uToast.show({
						title: '请选择请假开始时间'
					})
					return;
				}
				if (this.form.endTime == "请选择") {
					this.$refs.uToast.show({
						title: '请选择请假结束时间'
					})
					return;
				}
				if (this.remark == "") {
					this.$refs.uToast.show({
						title: '请填写请假理由'
					})
					return;
				}
				if (this.form.startTime > this.form.endTime) {
					this.$refs.uToast.show({
						title: '开始日期不能大于结束日期'
					})
					return;
				} else {
					this.submit();

				}


			},
			gotoList() {
				uni.navigateTo({
					url: '/pages/record/record',
				});
			}
		},
		onReady() {
			this.newdate = this.getNowFormatDate()
			console.log(this.newdate)
		},
		watch: {
			remark(val) {
				this.contrast = val.length
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-navbar-inner {

		.u-navbar-content-title {
			// padding-top: 16rpx;
		}
	}


	.leave-content {
		padding-left: 30upx;
		padding-right: 30upx;
		padding-top: 88rpx;

		.leave-content-list {
			.content-list-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 58rpx;
				padding-bottom: 26rpx;

				.item-start-left {
					display: flex;
					align-items: center;

					.leave-item-asterisk {
						margin-right: 24upx;

						.item-asterisk-star {
							width: 20upx;
							height: 20upx;
						}
					}

					.item-start-text {
						font-size: 32upx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #1A1A1A;
						line-height: 44upx;
						margin-right: 30rpx;
					}
				}

				.item-start-right {
					display: flex;
					align-items: center;

					.start-right-text {
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						line-height: 44upx;
						margin-right: 24rpx;
					}

					.start-right-active {
						color: #202020;
					}
				}
			}

			.leave-item-line {
				// width: 690upx;
				height: 1px;
				background-color: #E6E6E6;
			}
		}

		.leave-content-reason {
			padding-top: 58rpx;
			position: relative;

			.content-reason-title {
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 44rpx;
				margin-bottom: 30rpx;
			}

			.content-reason-input {
				// width: 690px;
				height: 300upx;
				background: #F6F6F6;
				border-radius: 12upx;
				width: 100%;
				padding: 40rpx 30rpx;
				box-sizing: border-box;
			}

			.reason-nav-input-num {
				position: absolute;
				right: 60upx;
				bottom: 24upx;

				font-size: 29upx;

				font-weight: 400;
				color: #999999;
				line-height: 40upx;
			}
		}

		.leave-foot {
			width: 100%;
			height: 124upx;
			background: #FFFFFF;
			box-shadow: 0px 0px 8upx 0px rgba(0, 0, 0, 0.16);
			padding-top: 16upx;
			position: fixed;
			left: 0;
			bottom: 0upx;


			.OrderDetails-foot-ordersSuccess {
				width: 670upx;
				height: 92upx;
				background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
				border-radius: 46upx;
				font-size: 32upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 92upx;
				margin-bottom: 16upx;
			}
		}
	}

	.navbar-right {
		margin-right: 30rpx;
		display: flex;

		color: #FF8666;
	}
</style>
