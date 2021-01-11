<template>
	<view class="OrderDetails">
		<view class="OrderDetails-head">
			<!-- <u-navbar back-text="" title="订单详情"></u-navbar> -->
			<view class="OrderDetails-content">
				<view class="OrderDetails-content-newsBox">
					<view class="Receivingorders-nav-list-item">
						<view class="Receivingorders-nav-list-item-title">
							<view class="Receivingorders-nav-list-item-title-left">
								<view class="Receivingorders-nav-list-item-title-left-type">
									<image class="ontrial" :src="typeSrc" mode=""></image>
								</view>
								<view class="Receivingorders-nav-list-item-title-left-text">
									{{news.subtitle}}
								</view>
							</view>
							<view class="Receivingorders-nav-list-item-title-right">
								来单时间{{news.createTime}}
							</view>
						</view>
						<view class="Receivingorders-nav-list-xian">
						</view>
						<view class="Receivingorders-nav-list-item-time">
							<view class="Receivingorders-nav-list-item-time-day">
								{{news.day}}
							</view>
							<view class="Receivingorders-nav-list-item-time-num">
								{{news.time}}
							</view>
						</view>
						<view class="Receivingorders-nav-list-item-address">
							<view class="Receivingorders-nav-list-item-address-left">
								{{news.address}}
							</view>
							<!-- <view class="Receivingorders-nav-list-item-address-right">
								<view class="Receivingorders-nav-list-item-address-top">
									<image class="Receivingorders-nav-list-item-address-top-src" src="../../static/index/map.png" mode=""></image>
								</view>
								<view class="Receivingorders-nav-list-item-address-nav">
									{{news.distance}}
								</view>
							</view> -->

						</view>
						<view class="Receivingorders-nav-list-item-news" v-if="news">
							<view class="Receivingorders-nav-list-item-news-list">
								<view class="Receivingorders-nav-list-item-news-list-item" v-for="(ele) in news.list" :key="ele.name">
									<view class="Receivingorders-nav-list-item-news-list-item-title">
										{{ele.name}}
									</view>
									<view class="Receivingorders-nav-list-item-news-list-item-text">
										{{ele.text}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="OrderDetails-but">
					<button type="default" class="OrderDetails-but-contact" @click="callPhone">联系客户</button>
					<button type="default" class="OrderDetails-but-navigation" @click="toMapAPP">开始导航</button>
				</view>
				<view class="OrderDetails-content-collPhone">
					<image class="OrderDetails-content-collPhone-src" src="../../static/order/phone.png" mode="" @click="callPhone"></image>
				</view>
			</view>



		</view>
		<view class="OrderDetails-foot" v-if="show">
			<u-button class="OrderDetails-foot-ordersSuccess" hover-class="none" v-if="show1" @click="start">开始服务</u-button>
			<button type="info" v-if="show2" class="accept">
				服务中（剩余
				<u-count-down :timestamp="timestamp" :show-border="false" separator-color="#FF8666" bg-color="none" color="#FF8666"
				 @end="endTime"></u-count-down>
				）
			</button>
			<u-button class="OrderDetails-foot-ordersSuccess" hover-class="none" v-if="show3" @click="end">服务结束</u-button>
		</view>
		<view class="OrderDetails-record" v-if="show4">
			<view class="OrderDetails-record-start">
				<view class="OrderDetails-record-start-yuan">
					始
				</view>
				<view class="OrderDetails-record-start-text">
					服务开始时间
				</view>
				<view class="OrderDetails-record-start-time">
					{{news.startTime}}
				</view>
			</view>
			<view class="OrderDetails-xian">
				<view class="OrderDetails-xian-item">

				</view>
				<view class="OrderDetails-xian-item">

				</view>
				<view class="OrderDetails-xian-item">

				</view>
			</view>
			<view class="OrderDetails-record-end">
				<view class="OrderDetails-record-end-yuan">
					完
				</view>
				<view class="OrderDetails-record-end-text">
					服务结束时间
				</view>
				<view class="OrderDetails-record-end-time">
					{{news.endTime}}
				</view>
			</view>
			<view class="OrderDetails-record-line">

			</view>
			<view class="OrderDetails-record-but">
				<view class="OrderDetails-record-but-left">
					<image class="OrderDetails-record-but-left-src" v-if="show5" src="../../static/order/isstar.png" mode=""></image>
				</view>
				<view class="OrderDetails-record-but-right" v-if="show6">
					<button type="default" class="OrderDetails-record-but-right-but" @click="historyQuery">查看服务记录</button>
				</view>
			</view>
		</view>
		<abnormalPrompt ref="abnormalPrompt" @getCountdown="getCountdown" @confirmStart="confirmStart"></abnormalPrompt>
		<investigation ref="investigation" @submission="submission"></investigation>
		<record ref="record"></record>
		<changeTime ref="changeTime"></changeTime>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import abnormalPrompt from "../../assembly/OrderDetails/DetailsTipe.vue";
	import investigation from "../../assembly/OrderDetails/investigation.vue";
	import record from "../../assembly/OrderDetails/record.vue";
	import pathPlanning from "../../utils/path-planning.js"
	import changeTime from "../../components/index/popup/changeTime.vue";

	import {
		postServicedetails,
		postCountdown,
		postServicestatus,
		postServicestart,
		getserviceevaluate
	} from '../../utils/api.js';
	import Map from '@/js_sdk/fx-openMap/openMap.js'

	export default {
		data() {
			return {
				news: {
					title: "",
					createTime: "",
					day: "",
					time: "",
					address: "",
					distance: "",
					phoneNumber: "",
					startTime: "",
					endTime: "",
					subtitle: "",


				},
				list: [],
				timestamp: 0,
				show: true,
				show1: false,
				show2: false,
				show3: false,
				show4: false,
				show5: false,
				show6: false,
				service_id: "",
				wek: [{
					num: 1,
					text: "周一"
				}, {
					num: 2,
					text: "周二"
				}, {
					num: 3,
					text: "周三"
				}, {
					num: 4,
					text: "周四"
				}, {
					num: 5,
					text: "周五"
				}, {
					num: 6,
					text: "周六"
				}, {
					num: 7,
					text: "周日"
				}],
				nanny_id: "",
				uid: "",
				mapArr: [],
				map: {
					longitude: "",
					latitude: "",
					address: ""
				},
				typeSrc: ""



			}
		},
		onLoad: function(options) {
			this.service_id = options.id
			if (options.type == 0) {
				this.typeSrc = "../../static/index/ontrial.png"
			}
			if (options.type == 1) {
				this.typeSrc = "../../static/index/long.png"
			}


		},
		// onBackPress() {

		// 	uni.navigateBack({
		// 		delta: 1
		// 	});


		// },
		onShow() {
			this.getDetails()
		},
		methods: {
			//获取订单详情
			getDetails() {
				this.getAddress()
				console.log(this.service_id);
				postServicedetails({
					service_id: this.service_id

				}).then(res => {
					// console.log(res.data.start_time);
					console.log(res);
					if (res.code == 0) {

						this.nanny_id = res.data.nanny_id;
						this.uid = res.data.uid;
						this.map.longitude = res.data.longitude
						this.map.latitude = res.data.latitude
						this.map.address = res.data.address
						this.getCountdown()
						if (res.data.status == 0) {
							this.show = true;
							this.show1 = true;
							this.show2 = false;
							this.show3 = false;
							this.show4 = false;

						}
						if (res.data.status == 1) {
							this.show = true;
							this.show1 = false;
							this.show2 = true;
							this.show3 = false;
							this.show4 = false;

						}
						if (res.data.status == 2) {
							this.show = false;
							this.show1 = false;
							this.show2 = false;
							this.show3 = false;
							this.show4 = true;
							if (res.data.star_status == 0) {
								this.show5 = false;
							} else {
								this.show5 = true;
							}
							if (res.data.is_evaluate == 0) {
								this.$refs.investigation.open(this.service_id, this.nanny_id);
								this.show6 = false
							} else {
								this.show6 = true
							}

						}

						this.wek.map(item => {
							if (res.data.weeks == item.num) {
								res.data.weeks = item.text
							}
						})
						// this.news.title = res.data.goods_name = "保洁+做饭";
						// this.news.createTime=res.data.goods_name="保洁+做饭";
						this.news.day = res.data.service_time + res.data.weeks + res.data.today;
						this.news.address = res.data.address + res.data.house_number;
						this.news.phoneNumber = res.data.phone;
						if (res.data.start_time != null && res.data.start_time != 0) {
							let startArr = res.data.start_time.split(" ")
							let yearArr = startArr[0].split("-")
							let year = yearArr[0] + "." + yearArr[1] + "." + yearArr[2]
							let dateArr = startArr[1].split(":")
							let dateTime = dateArr[0] + ":" + dateArr[1]
							this.news.startTime = year + " " + " " + dateTime;
						}
						if (res.data.end_time != null && res.data.end_time != 0) {
							let endArr = res.data.end_time.split(" ")
							let endYearArr = endArr[0].split("-")
							let endYear = endYearArr[0] + "." + endYearArr[1] + "." + endYearArr[2]
							let endDateArr = endArr[1].split(":")
							let endDateTime = endDateArr[0] + ":" + endDateArr[1]
							this.news.endTime = endYear + " " + " " + endDateTime
						}

						console.log(111)



						this.news.time = res.data.part_time;


						if (res.data.laidan_time != null) {
							let timeArr = res.data.laidan_time.split(" ")
							let timeArr1 = timeArr[1].split(":")
							this.news.createTime = timeArr1[0] + ":" + timeArr1[1];
						}
						// console.log(222)

						this.news.subtitle = res.data.subtitle;

						this.news.list = [{
								"name": "面积",
								"text": res.data.family_size
							}, {
								"name": "户型",
								"text": res.data.house
							},
							// {
							// 	"name": "人数",
							// 	"text": res.data.family_number
							// }, 
							{
								"name": "雇主",
								"text": res.data.name
							},
							// {
							// 	"name": "偏好",
							// 	"text": res.data.flavor
							// },
							{
								"name": "备注",
								"text": res.data.remark
							}
						]


					} else {
						this.$refs.uToast.show({
							title: '系统错误',
						})
					}
				})
			},
			//服务开始
			start() {
				let startTime = this.getTime()
				
			
				postServicestatus({
					type: 1,
					service_id: this.service_id,
					uid: this.uid,
					longitude_after: this.mapArr[0],
					latitude_after:  this.mapArr[1]
				}).then(res => {
					console.log(res)
					let popouData = {
						service_id: this.service_id,
						uid: this.uid,
						type: 1
					}
					if (res.code == 0) {
						if (res.data.list.service_status == 0) {
							this.show1 = false
							this.show2 = true
							this.show3 = false
						}
						if (res.data.list.service_status == 1) {
							this.$refs.abnormalPrompt.open('开始服务地点异常，请确认是否与雇主达成一致', popouData);

						}
						if (res.data.list.service_status == 2) {
							this.$refs.abnormalPrompt.open('开始服务时间异常，请确认是否与雇主达成一致', popouData);
						}
						if (res.data.list.service_status == 3) {
							this.$refs.abnormalPrompt.open('开始服务时间和地点异常，请确认是否与雇主达成一致', popouData);
						}
					}
				})


			},
			confirmStart() {
				this.show1 = false
				this.show2 = true
				this.show3 = false
			},
			//服务结束
			end() {
				postServicestart({
					service_id: this.service_id,
					uid: this.uid,
					type: 2
				}).then(res => {
					// console.log(res)
					if (res.code == 0) {
						if (res.data.list.start_end_status == 1) {
							this.getDetails()
							this.$refs.investigation.open(this.service_id, this.nanny_id);

						} else {
							this.$refs.uToast.show({
								title: '服务结束失败',
							})
						}
					} else {
						this.$refs.uToast.show({
							title: '系统错误',
						})
					}

				})


			},
			endTime() {
				this.show1 = false
				this.show2 = false
				this.show3 = true
			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.news.phoneNumber,
					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}

				});
			},
			dh() {
				// pathPlanning("广州")
				uni.showModal({
					title: '提示',
					content: '这是一个模态弹窗',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							// uni.switchTab({
							//     url: '/pages/index/index'
							// });
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//打开第三方地图
			toMapAPP() {
				var options = {
					destination: { //导航终点点坐标和名称
						latitude: this.map.latitude,
						longitude: this.map.longitude,
						name: this.map.address
					},
					mode: "walk" //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
				}
				Map.openMap(options);
			},
			submission() {
				// console.log(222)
				this.show = false
				this.show4 = true
				this.show6 = true
				// console.log(this.show)
				// console.log(this.show4)
			},
			//获取当前位置经纬度
			getAddress() {
				let that = this

				uni.getLocation({
					type: 'wgs84',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					success: function(res) {
						that.mapArr = [res.longitude, res.latitude]
						console.log(that.mapArr)


					},
					fail: function() {
						uni.showToast({
							title: '获取地址失败，将导致部分功能不可用',
							icon: 'none'
						});
					}
				});


			},
			//获取当前时间
			getTime() {
				var myDate = new Date();
				let time = myDate.toLocaleString();
				let timeArr = time.split(" ")
				let daysTimeArr = timeArr[0].split("/")
				let day = daysTimeArr[0] + "-" + daysTimeArr[1] + "-" + daysTimeArr[2]
				let timeArr1 = timeArr[1].split("午")
				let timeData = day + " " + timeArr1[1]
				return timeData;
			},
			//获取倒计时
			getCountdown() {
				let time = this.getTime()
				// console.log(time)
				postCountdown({
					service_id: this.service_id,
					uid: this.uid

				}).then(res => {
					if (res.code == 0) {
						// console.log(res.data.list.time)
						if (res.data.list.time != -1 && res.data.list.time != -2 && res.data.list.time != 0) {
							// console.log(res.data.list.time)
							let time = res.data.list.time
							var hour = time.split(':')[0];
							var min = time.split(':')[1];
							var sec = time.split(':')[2];

							let s = Number(hour * 3600) + Number(min * 60) + Number(sec);
							// console.log(s); //130
							this.timestamp = s
							return;
						}
						if (res.data.list.time == 0) {
							this.timestamp = 0
							return;
						} else {
							// console.log(res.data.list.time)
							this.endTime()
							return;
						}
					}
				})
			},
			//查询服务自查记录
			historyQuery() {
				getserviceevaluate({
					service_id: this.service_id,
					nanny_id: this.nanny_id
				}).then(res => {
					// console.log(res)
					if (res.code == 0) {
						let list = res.data.list;
						this.$refs.record.open(list);
						// this.$store.commit("setRecordList",list)
					}
				})
			}


		},
		components: {
			abnormalPrompt,
			investigation,
			record,
			changeTime
		},
		computed: {
			chang() {
				return this.$store.state.order.change;
			},
		},
		watch: {
			chang(val) {
				if (val == true) {
					this.$refs.changeTime.open()
				}
				if (val == false) {
					this.$refs.changeTime.close()
				}

			}
		}

	}
</script>

<style lang="scss" scoped>
	/deep/uni-button:after {
		border: none;
	}

	.OrderDetails {
		background: #F5F5F5;
		// height: 100vh;
		padding-bottom: 80upx;
		// height: 100%;

		.OrderDetails-content {
			position: relative;
			border-radius: 16px;
			margin-left: 30upx;
			margin-right: 30rpx;
			padding-top: 40rpx;

			.OrderDetails-content-newsBox {
				.Receivingorders-nav-list-item {
					background-color: #fff;
					padding-left: 30upx;
					padding-right: 30upx;
					border-radius: 16upx;
					margin-bottom: 100upx;

					.Receivingorders-nav-list-item-title {
						height: 116upx;
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.Receivingorders-nav-list-item-title-left {
							display: flex;
							align-items: center;

							.Receivingorders-nav-list-item-title-left-type {
								.ontrial {
									margin-top: 18upx;
									width: 80upx;
									height: 48upx;
								}

							}

							.Receivingorders-nav-list-item-title-left-text {
								font-size: 40upx;
								margin-left: 20upx;
								font-weight: 500;
								color: #202020;

							}
						}

						.Receivingorders-nav-list-item-title-right {
							font-size: 32upx;
							font-weight: 400;
							color: #646464;

						}

					}

					.Receivingorders-nav-list-xian {
						height: 2upx;
						background: #EDEDED;
						margin: auto;
					}

					.Receivingorders-nav-list-item-time {
						margin-top: 31upx;
						display: flex;
						align-items: center;
						margin-bottom: 22rpx;

						.Receivingorders-nav-list-item-time-day {
							font-size: 40upx;
							font-weight: 500;
							color: #202020;
							line-height: 57upx;
							margin: 14upx;
						}

						.Receivingorders-nav-list-item-time-num {
							font-size: 40upx;
							font-weight: 500;
							color: #FF8666;
							line-height: 57upx;
						}
					}

					.Receivingorders-nav-list-item-address {
						display: flex;
						justify-content: space-between;
						padding-bottom: 40upx;

						.Receivingorders-nav-list-item-address-left {
							width: 511upx;
							font-size: 40upx;
							font-weight: 500;
							color: #202020;
							line-height: 57upx;
						}

						.Receivingorders-nav-list-item-address-right {
							display: flex;
							flex-direction: column;
							justify-content: center;

							.Receivingorders-nav-list-item-address-top {
								.Receivingorders-nav-list-item-address-top-src {
									width: 74upx;
									height: 74upx;
								}
							}

							.Receivingorders-nav-list-item-address-nav {
								font-size: 29upx;
								font-weight: 500;
								color: #202020;
								line-height: 40upx;

							}
						}

					}

					.Receivingorders-nav-list-item-news {
						padding-bottom: 152upx;

						.Receivingorders-nav-list-item-news-list {

							padding-bottom: 24upx;

							.Receivingorders-nav-list-item-news-list-item {
								display: flex;
								margin-bottom: 24upx;

								.Receivingorders-nav-list-item-news-list-item-title {
									font-size: 32upx;
									font-weight: 400;
									color: #999999;
									line-height: 44upx;
									margin-right: 40upx;
									width: 64rpx;
									flex-shrink: 0;

								}

								.Receivingorders-nav-list-item-news-list-item-text {
									font-size: 36upx;
									font-weight: 500;
									color: #202020;
									line-height: 50upx;
									flex-shrink: 0;
									width: 544rpx;

								}
							}
						}
					}

					.switchBut {
						padding-bottom: 48upx;


						.butStyle {
							width: 630upx;
							height: 80upx;
							background: #F5F5F5;
							border-radius: 12upx;
							font-size: 32upx;
							font-weight: 400;
							color: #333333;
							line-height: 80upx;

						}

						.butStyle::after {
							border: none;
						}
					}

					.Receivingorders-nav-list-item-accept {
						display: flex;
						padding-bottom: 40upx;

						.noaccept {
							width: 136upx;
							height: 116upx;
							background: #6B6B6B;
							border-radius: 12px;
							font-size: 32upx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 116upx;
						}

						.accept {
							width: 464upx;
							height: 116upx;
							background: linear-gradient(45deg, #FFBB9F 0%, #FF8666 100%);
							border-radius: 12upx;
							font-size: 32upx;
							font-weight: 500;
							color: #FFFFFF;
							line-height: 116upx;
							margin-left: 30upx;

						}
					}

					.Receivingorders-nav-notReceived {
						padding-bottom: 40upx;

						.notReceived-style {
							width: 630upx;
							height: 116upx;
							background: #EBEBEB;
							border-radius: 12upx;
							font-size: 32upx;
							font-weight: 500;
							color: #BDBDBD;
							line-height: 116upx;
						}

						.notReceived-style::after {
							border: none;
						}

						.notReceived-confirmedBut {
							width: 630upx;
							height: 116upx;
							background: linear-gradient(45deg, #FFDCCE 0%, #FFC3B3 100%);
							border-radius: 12upx;

							font-size: 32upx;

							font-weight: 500;
							color: #FFFFFF;
							line-height: 116px;
						}

						.notReceived-confirmedBut::after {
							border: none;
						}

						.notReceived-ordersSuccess {
							width: 630upx;
							height: 116upx;
							background: linear-gradient(45deg, #FFBB9F 0%, #FF8666 100%);
							border-radius: 12upx;
							font-size: 32upx;
							font-weight: 500;
							color: #FFFFFF;
							line-height: 116px;
						}

						.notReceived-ordersSuccess::after {
							border: none;
						}


					}


				}


			}

			.OrderDetails-but {
				display: flex;
				position: absolute;
				bottom: 40upx;
				right: 30upx;

				.OrderDetails-but-contact {
					width: 192upx;
					height: 70upx;
					border-radius: 35upx;
					border: 1px solid #E5E5E5;
					font-size: 32upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #202020;
					line-height: 66rpx;
					margin-right: 30upx;
					background-color: #fff;
				}

				.OrderDetails-but-navigation {
					background-color: #fff;
					width: 192upx;
					height: 70rpx;
					border-radius: 35upx;
					border: 2upx solid #FF8666;

					font-size: 32upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FF8666;
					line-height: 66upx;

				}
			}

			.OrderDetails-content-collPhone {
				position: absolute;
				bottom: 298upx;
				right: 30upx;

				.OrderDetails-content-collPhone-src {
					width: 72upx;
					height: 72upx;
					// background: #393F5A;
				}
			}
		}

		.OrderDetails-foot {
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

			.OrderDetails-foot-ordersSuccess::after {
				border: none;
			}

			.accept {
				width: 670upx;
				height: 92upx;
				border-radius: 46upx;
				border: 2upx solid #FF8666;
				font-size: 32upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FF8666;
				line-height: 92upx;
				background-color: #fff;
			}
		}

		.OrderDetails-record {
			padding: 26upx 30upx 44upx 30upx;
			background-color: #fff;
			margin-left: 30upx;
			margin-right: 30upx;
			box-shadow: 0px 0px 20upx 0px rgba(0, 0, 0, 0.06);
			border-radius: 16upx;


			.OrderDetails-record-start {
				display: flex;
				// align-items: center;
				margin-bottom: 14upx;

				.OrderDetails-record-start-yuan {
					width: 40upx;
					height: 40upx;
					background: #49D2A4;
					border-radius: 40upx;
					font-size: 24upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 40upx;
					text-align: center;
					margin-top: 4upx;


				}

				.OrderDetails-record-start-text {
					margin-right: 22upx;
					margin-left: 20upx;
					font-size: 32upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 44upx;
				}

				.OrderDetails-record-start-time {

					font-size: 36upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #202020;
					line-height: 50upx;
				}
			}

			.OrderDetails-xian {
				margin-left: 18rpx;

				.OrderDetails-xian-item {
					width: 4upx;
					height: 4upx;
					background: #D8D8D8;
					border-radius: 4upx;
					margin-bottom: 8upx;

				}
			}

			.OrderDetails-record-end {
				display: flex;
				// align-items: center;
				margin-bottom: 32upx;

				.OrderDetails-record-end-yuan {
					width: 40upx;
					height: 40upx;
					background: #FF8666;
					border-radius: 40upx;
					font-size: 24upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 40upx;
					text-align: center;
					margin-top: 4upx;


				}

				.OrderDetails-record-end-text {
					margin-right: 22upx;
					margin-left: 20upx;
					font-size: 32upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 44upx;
				}

				.OrderDetails-record-end-time {

					font-size: 36upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #202020;
					line-height: 50upx;
				}
			}

			.OrderDetails-record-line {

				height: 2upx;
				background: #F6F6F6;
				margin-bottom: 36upx;
			}

			.OrderDetails-record-but {
				display: flex;
				justify-content: space-between;
				align-items: center;


				.OrderDetails-record-but-left {
					.OrderDetails-record-but-left-src {
						width: 260upx;
						height: 70upx;
					}
				}

				.OrderDetails-record-but-right {
					.OrderDetails-record-but-right-but {
						width: 248upx;
						height: 70upx;
						border-radius: 35upx;
						border: 2upx solid #FF8666;
						font-size: 32upx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FF8666;
						line-height: 66upx;
						background-color: #fff;

					}
				}
			}




		}

	}
</style>
