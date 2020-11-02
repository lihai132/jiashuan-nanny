<template>
	<view class="order">
		<view :class="topHeight==false?'order-top':'order-top1'" :style="order_header">

		</view>

		<orderCalendar class="orderCalendar" ref="orderCalendar" @getmonthList="getmonthList" @showNone="showNone" @showList="showList"
		 @getOrderList="getOrderList" v-on:headIncrease="headIncrease" v-on:headReduce="headReduce"></orderCalendar>
		<OrderNav class="OrderNav" ref="OrderList" @open="open" @putAway="putAway"></OrderNav>
		<u-toast ref="uToast" />
	</view>

</template>

<script>
	import {
		postServicedayscount,
		postServicedayslist
	} from '../../utils/api.js';
	import orderCalendar from "../rili/rili.vue";
	import orderHead from "../../assembly/Order/Title.vue";
	import OrderNav from "../../assembly/Order/OrderList.vue";


	export default {

		data() {
			return {
				curDate: '',
				markDays: [],
				topHeight: false,
				heightNum: "",
				order_header: {
					height: ""
				},
				orderList: []

			}
		},
		onShow() {
			var date = new Date();
			var date1 = date.getFullYear()
			var date2 = date.getMonth()
			var date3 = date.getDate();
			let time = date1 + "-" + (date2 * 1 + 1)
			this.getmonthList(time)
		},
		methods: {
			headIncrease() {
				this.topHeight = true
			},
			headReduce() {
				this.topHeight = false
			},
			open() {
				this.$refs.orderCalendar.toggle()
			},
			putAway() {
				// console.log(222)
				this.$refs.orderCalendar.putAway()
			},
			//请求当前日期的订单数据
			getOrderList(time) {
				this.$refs.OrderList.getOrderList(time)
			},
			//请求月份订单数据
			getmonthList(time) {
				console.log(time)
				postServicedayscount({
					nanny_id: uni.getStorageSync('nanny_id'),
					service_time: time
				}).then(res => {

					if (res.code == 0) {
						console.log(res.data.list)
						if (res.data.list != null) {

							res.data.list.map((item, index) => {
								let dayArr = item.days.split("-")
								item.month = dayArr[1]
								item.day = dayArr[2]
							})
							this.orderList = res.data.list;
							this.$store.commit("setOrderList", this.orderList)
						}


					} else {
						this.$refs.uToast.show({
							title: '系统错误',
						})
					}
				})
			},
			//当前日期是否有订单
			showNone() {
				this.$refs.OrderList.showNone()
				// console.log(111)
			},
			showList() {

				this.$refs.OrderList.showList()
			}

		},
		components: {
			orderCalendar,
			orderHead,
			OrderNav
		},
		computed: {
			listData() {
				return this.$store.state.order.heightNum
			}
		},
		watch: {
			listData(val) {
				this.heightNum = val
				this.order_header.height = val + 256 + "rpx"

				// console.log(this.order_header.height)
				// console.log("vuex高度"+this.order_header.height)
			}
		}


	}
</script>

<style lang="scss" scoped>
	.order {
		height: 100%;
		background: #F5F5F5;
	}

	.orderCalendar {
		position: fixed;
		top: 0upx;
		left: 0;
		background-color: #fff;
		z-index: 5;

	}

	.OrderList {}

	.order-top {
		height: 300upx;
		width: 100%;
	}

	.order-top1 {
		height: 766upx;
		width: 100%;
	}
</style>
