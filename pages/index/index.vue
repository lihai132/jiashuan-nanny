
<template>
	<view class="Receivingorders">
		<!-- <view class="Receivingorders-head">
			<view class="Receivingorders-head-title">接单</view>
		</view> -->
		<view class="Receivingorders-nav">
			<view class="Receivingorders-nav-list" v-if="acceptList.length > 0">
				<view class="Receivingorders-nav-list-item" v-for="(item,index) in acceptList" :key="index">
					<view class="Receivingorders-nav-list-item-title">
						<view class="Receivingorders-nav-list-item-title-left">
							<view class="Receivingorders-nav-list-item-title-left-type">
								<image class="ontrial" :src="item.typeSrc" mode=""></image>
							</view>
							<view class="Receivingorders-nav-list-item-title-left-text">
								{{item.subtitle}}
							</view>
						</view>
						<view class="Receivingorders-nav-list-item-title-right">
							来单时间 {{item.time}}
						</view>
					</view>
					<view class="Receivingorders-nav-list-xian">
					</view>
					<view class="Receivingorders-nav-list-item-time">
						<view class="list-item-box">
							<view class="Receivingorders-nav-list-item-time-day">
								{{item.service_time}}
							</view>
							<view class="Receivingorders-nav-list-item-time-num">
								{{item.part_time}}
							</view>
						</view>
						<view class="list-item-number">
							({{item.service_number}}次)
						</view>

					</view>
					<view class="Receivingorders-nav-list-item-address">
						<view class="Receivingorders-nav-list-item-address-left">
							{{item.address}}
						</view>
						<view class="Receivingorders-nav-list-item-address-right">
							<view class="Receivingorders-nav-list-item-address-top">
								<image @click="toMapAPP(item)" class="Receivingorders-nav-list-item-address-top-src" src="../../static/index/map.png"
								 mode=""></image>
							</view>
							 
						</view>
					</view>
					<view class="Receivingorders-nav-list-item-news" v-if="item.news">
						<view class="Receivingorders-nav-list-item-news-list">
							<view class="Receivingorders-nav-list-item-news-list-item" v-for="(ele) in item.list" :key="item.text">
								<view class="Receivingorders-nav-list-item-news-list-item-title">
									{{ele.name}}
								</view>
								<view class="Receivingorders-nav-list-item-news-list-item-text">
									{{ele.text}}
								</view>
							</view>
						</view>
					</view>
					<view class="switchBut">
						<button type="info" class="butStyle" @click="open(item)">
							{{item.iconText}}
							<u-icon :name="item.icon" info></u-icon>
						</button>
					</view>

					<!-- 按钮组 -->
					<view class="Receivingorders-nav-list-item-accept" v-if="item.show1">
						<button type="info" class="noaccept" @click="noAnswer(item.service_id,index)">
							不接
						</button>
						<button type="info" class="accept" @click="determine(item.service_id,index)">
							点击接单
							<u-count-down :show-hours="false" @end="endTime" :timestamp="item.countdown" :show-border="false"
							 separator-color="#fff" bg-color="none" color="#fff"></u-count-down>
							秒后自动接单
						</button>
					</view>
					<view class="Receivingorders-nav-notReceived" v-if="item.show2">
						<u-button class="notReceived-style" :disabled="true">{{item.disabledText}}</u-button>
					</view>
					<view class="Receivingorders-nav-notReceived" v-if="item.show3">
						<u-button class="notReceived-confirmedBut" :disabled="true" @click="successfully">待客户确认</u-button>
					</view>
					<view class="Receivingorders-nav-notReceived" v-if="item.show4">
						<u-button class="notReceived-ordersSuccess" hover-class="none">接单成功</u-button>
					</view>
				</view>
			</view>
			<view class="no-data" v-else>
				<view class="no-data-img flexbox center">
					<image src="../../static/index/no-accept.png" mode="widthFix"></image>
				</view>
				<view class="no-data-text flexbox center">
					今日暂无订单！
				</view>
			</view>
		</view>
		<noAnswer ref="noAnswer" @reason="reason"></noAnswer>
		<threeReminders ref="threeReminders" @reason="reason"></threeReminders>
		<reason ref="reason" @disabled="disabled"></reason>
		<toUpdate ref="toUpdate" @doUpData="doUpData"></toUpdate>
		<changeTime ref="changeTime"></changeTime>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getAcceptList,
		postAcceptAgree,
		getversion
	} from '../../utils/api.js';
	import voice from '../../utils/voice.js';
	import pathPlanning from '../../utils/path-planning.js';
	import noAnswer from "../../components/index/popup/noAnswer.vue";
	import threeReminders from "../../components/index/popup/threeReminders.vue";
	import reason from "../../components/index/popup/reason.vue";
	import changeTime from "../../components/index/popup/changeTime.vue";
	import toUpdate from "../../components/index/popup/toUpdate.vue";
	const badge_module = uni.requireNativePlugin('Laowu-BadgeModule');
	import Map from '@/js_sdk/fx-openMap/openMap.js';

	var num = 3;
	var socketTask;
	//测试环境
	var wsUrl = "wss://socket.yishenjr.cn";


	//正式域名
	// var wsUrl = "wss://socket.jshuan.cn";

	var heartflag = false; //心跳开关
	var openflag = false;

	export default {
		data() {
			return {
				acceptList: [],
				page: 1, // 页数
				timestamp: 120,
				miao: 120,
				title: 'Hello',
				itemList: [{
					head: '1',
					body: '2'
				}],
				news: false,
				newsList: [],

				openList: [{
					text: '查看完整信息',
					icon: "arrow-down"
				}],
				disabledText: "未接单",
				frequency: "",
				operationIndex: "",
				version: "1.0.3",
				timeout: 2 * 1000, //10秒一次心跳
				timeoutObj: null, //心跳心跳倒计时
				serverTimeoutObj: null, //心跳倒计时
				timeoutnum: null, //断开 重连倒计时
			}
		},
		onLoad() {
			const isLogin = this.checkLogin();
			if (!isLogin) {
				return false
			}
			this.websocket();
		},
		onShow() {
			this.getDataList();
			this.update()
			// this.openVoice()
			

		},

		methods: {

			// 获取接单列表
			getDataList() {

				let page = this.page;
				getAcceptList({
					nanny_id: uni.getStorageSync('nanny_id'),
					page: page
				}).then(res => {

					if (res.code == 0) {
						// console.log(res.data)
						let arr = Object.values(res.data.list)
						console.log(arr)
						this.frequency = res.data.refuse_count;
						arr.map((item, index) => {
							let timeArr = item.create_time.split(" ")
							if (item.order_type == 0) {
								item.typeSrc = "../../static/index/ontrial.png"
							}
							if (item.order_type == 1) {
								item.typeSrc = "../../static/index/long.png"
							}
							let timeArr1 = timeArr[1].split(":")
							item.time = timeArr1[0] + ":" + timeArr1[1]

							item.iconText = '查看完整信息'
							item.icon = "arrow-down"
							item.news = false


							item.distance = "1.2km";
							
							item.address = item.address
							if (item.remark) {
								item.list = [{
										"name": "单号",
										"text": item.service_id
									}, {
										"name": "面积",
										"text": item.family_size
									}, {
										"name": "户型",
										"text": item.house
									},
									// {
									// 	"name": "人数",
									// 	"text": item.family_number
									// }, 
									{
										"name": "雇主",
										"text": item.name
									},
									
									{
										"name": "备注",
										"text": item.remark
									}
								]
							} else {
								item.list = [{
										"name": "单号",
										"text": item.service_id
									}, {
										"name": "面积",
										"text": item.family_size
									}, {
										"name": "户型",
										"text": item.house
									},
									
									{
										"name": "雇主",
										"text": item.name
									}
								]
							}


							if (item.order_status == 0) {
								item.show1 = true;
								item.show2 = false;
								item.show3 = false;
								item.show4 = false;
								item.disabledText = "未接单";

							}
							if (item.order_status == 1) {
								item.show1 = false;
								item.show2 = false;
								item.show3 = true;
								item.show4 = false;
								item.disabledText = "未接单"
							}
							if (item.order_status == 2) {
								item.show1 = false;
								item.show2 = true;
								item.show3 = false;
								item.show4 = false;
								item.disabledText = "未接单"
							}
							if (item.order_status == 3) {
								item.show1 = false;
								item.show2 = false;
								item.show3 = false;
								item.show4 = true;
								item.disabledText = "未接单";
							}
							if (item.order_status == 4) {
								item.show1 = false;
								item.show2 = true;
								item.show3 = false;
								item.show4 = false;
								item.disabledText = "接单失败"
							}
						})
						this.acceptList = arr;
						// console.log(this.acceptList);
					} else {
						this.$refs.uToast.show({
							title: '系统错误'
						})
					}
				})
			},
			open(item) {
				if (item.iconText == "查看完整信息") {
					item.iconText = "收起"
					item.icon = "arrow-up"
					item.news = true
					return
				}
				if (item.iconText == "收起") {
					item.iconText = "查看完整信息"
					item.icon = "arrow-down"
					item.news = false
					return
				}
			},
			//确认是否不接这个单的弹窗
			noAnswer(id, index) {
				this.operationIndex = index
				this.$store.commit("setServiceId", id)
				if (this.frequency > 3) {
					this.$refs.threeReminders.open()
				} else {
					this.$refs.noAnswer.open()
				}


			},
			//确认不接单后弹出理由和原因
			reason() {
				this.$refs.reason.open()
			},


			//点击接单待客户确认状态
			determine(id, index) {
				this.operationIndex = index
				postAcceptAgree({
					nanny_id: uni.getStorageSync('nanny_id'),
					service_id: id
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.acceptList[index].show1 = false
						this.acceptList[index].show2 = false
						this.acceptList[index].show3 = true
						this.acceptList[index].show4 = false

					} else {
						this.$refs.uToast.show({
							title: res.msg
						})
					}
				})

			},
			//确认不接单之后改变显示的按钮
			disabled() {

				this.getDataList()

			},
			//接单成功状态
			successfully() {

				this.getDataList()
			},
			//接单失败状态
			successfully() {

				this.getDataList()
			},
			//跳转到订单列表
			gotoOrder() {

				uni.switchTab({
					url: '/pages/order/order',
				});
			},
			
			//打开第三方地图
			toMapAPP(item) {
				var options = {
					destination: { //导航终点点坐标和名称
						latitude: item.latitude,
						longitude: item.longitude,
						name: item.address
					},
					mode: "walk" //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
				}
				Map.openMap(options);
			},
			//版本更新
			update() {
				getversion({

				}).then(res => {
					console.log(res.data.nanny_android_version)
					if (res.data.nanny_android_version > this.version) {
						this.$refs.toUpdate.open();
					}
				})
			},
			//下载新版本
			
			doUpData() {
				uni.showLoading({
					title: '更新中……'
				})
				uni.downloadFile({ //执行下载
					// url: 'https://static.yishenjr.cn/appversion/nanny/jsa_nanny_1.0.apk', //正式下载地址
					url: 'https://static.yishenjr.cn/appversion/nanny/nanny_test.apk', //测试下载地址
					success: downloadResult => { //下载成功
						uni.hideLoading();
						if (downloadResult.statusCode == 200) {
							uni.showModal({
								title: '',
								content: '更新成功，确定现在安装吗？',
								confirmText: '安装',
								confirmColor: '#EE8F57',
								success: function(res) {
									if (res.confirm == true) {
										plus.runtime.install( //安装
											downloadResult.tempFilePath, {
												force: true
											},
											function(res) {
												utils.showToast('更新成功，重启中');
												plus.runtime.restart();
											}
										);
									}
								}
							});
						}
					}
				});
			},

			openWebsocket() {
				if (openflag == false) {
					this.websocket();
				}
			},
			close() {
				heartflag = true;
				socketTask.close()
				
			},
			websocket() {
				heartflag = false;
				//创建websocket
				socketTask = uni.connectSocket({
					url: wsUrl,
					success: (e) => {}
				});
				//打开websocket
				socketTask.onOpen(() => {
					console.log("开始连接")
					openflag = true;
					//通过websocket发送消息告诉后端服务器你是谁
					socketTask.send({
						data: "user_type=2&uid=" + uni.getStorageSync('nanny_id'),
						async success(res) {

						},
					})
					this.sendMsg();
				})
				//接受到websocket发送给前端的消息后进行处理
				socketTask.onMessage(data => {

					var data = JSON.parse(data.data)
					if (data) {
						num = 3;
					}
					this.handle(data)

				})
				//websocket错误提示
				socketTask.onError(function() {
					// console.log('错误');
					socketTask.onOpen()
				})

				// websocket关闭
				socketTask.onClose(() => {
					// console.log('关闭')
					if (heartflag == false) {
						this.reconnect()
					}
					openflag = false;
					socketTask.onOpen()

				});
			},
			reconnect() {
				setTimeout(() => {
					this.websocket();
				}, 3000)
			},
			heart() {
				this.sendMsg();
				
			},
			sendMsg() {
				if (heartflag == true) {
					return;
				}
				socketTask.send({
					data: "user_type=2&uid=" + uni.getStorageSync('nanny_id'),
					async success(res) {
						// this.handle(res)
						// console.log("消息发送成功");
					}
				})
				//此处为心跳包
				setTimeout(() => {
					this.heart()
				}, 3000)
			},
			//处理websocket返回数据的方法
			handle(data) {

				if (data.code == 0) {
					let msg = JSON.parse(data.msg)
					if (msg.opt == "order_taking") {

						this.getDataList();

						this.setBadge()
					}
					if (msg.opt == "taking_notice") {
						
						if (msg.result == "SUCCESS") {
							this.getDataList();
							this.setSuccess()
							this.setBadge()
							if (msg.order_type == 0) {
								this.openVoice('你有新的体验订单，请及时查看');
							}
							if (msg.order_type == 1) {
								this.openVoice('你有新的长期订单，请及时查看');
							}


						} else {
							this.getDataList();
							this.setFail();
							this.setBadge()
						}
						console.log(111)

					}
					if (msg.opt == "service_finish") {
						this.setComplete()
						this.$store.commit("setOrderRefresh", 1)
						this.openVoice('你有订单服务时间已到，请及时确认');

					}
				} else {


				}

			},

			// 设置角标
			setBadge() {

				badge_module.setBadge(1);
			},
			// 清除角标
			cleanBadge() {
				badge_module.cleanBadge();
			},
			// 获取手机品牌
			getManufacturer() {
				badge_module.getManufacturer(function(res) {
					console.log(res);
				})

			},
			setPush() {
				// 推送服务
				badge_module.setPush({
					title: '接单信息',
					content: '你有新的接单信息，请及时查看！'
				});
			},
			setSuccess() {
				// 推送服务
				badge_module.setPush({
					title: '接单信息',
					content: '接单成功，请及时查看！'
				});
			},
			setFail() {
				// 推送服务
				badge_module.setPush({
					title: '接单信息',
					content: '接单失败，请及时查看！'
				});
			},
			setComplete() {
				// 推送服务
				badge_module.setPush({
					title: '订单信息',
					content: '你有一个订单已完成，请及时进入详情查看！'
				});
			},
			//接单倒计时归零之后的操作
			endTime() {
				this.getDataList()
			},
			openVoice(text) {
				voice(text);
			}


		},
		components: {
			noAnswer,
			reason,
			threeReminders,
			toUpdate,
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

	.Receivingorders {
		height: 100%;
		background: #F5F5F5;
		display: flex;
		flex-direction: column;

		.Receivingorders-head {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 88upx;
			background-color: #fff;

			.Receivingorders-head-title {
				margin-left: 40upx;
				font-size: 36upx;
				line-height: 88upx;
				font-weight: 500;
				color: #1A1A1A;
			}
		}

		.Receivingorders-nav {

			flex: 1;
			padding-left: 30upx;
			padding-right: 30upx;
			overflow: scroll;

			.Receivingorders-nav-list {
				height: 100%;
				overflow: scroll;
				padding-top: 100upx;

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
								font-weight: 550;
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

					.list-item-box {

						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.Receivingorders-nav-list-item-time {
						margin-top: 31upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 22rpx;

						.Receivingorders-nav-list-item-time-day {
							font-size: 40upx;
							font-weight: 550;
							color: #202020;
							line-height: 57upx;
							margin: 14upx 0;
						}

						.Receivingorders-nav-list-item-time-num {
							font-size: 40upx;
							font-weight: 500;
							color: #FF8666;
							line-height: 57upx;
						}

						.list-item-number {
							font-size: 40upx;
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
							font-weight: 550;
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
									font-weight: 550;
									color: #202020;
									line-height: 50upx;
									flex-shrink: 0;
									width: 544rpx;
									// flex: 1;
									// padding-right: 30rpx;
									// flex-wrap: wrap;
									word-wrap: break-word;

									// word-break: normal;

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

			.Receivingorders-nav-list::-webkit-scrollbar {
				display: none;
			}

		}
	}
</style>
