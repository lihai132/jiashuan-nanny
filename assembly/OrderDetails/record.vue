<template>
	<view class="investigation">
		<u-popup v-model="show" mode="bottom" border-radius="20" height="780rpx" :mask-close-able="true">
			<view class="investigation-popup">

				<view class="investigation-region">
					<view class="investigation-region-title">
						我做完的区域
					</view>
					<view class="investigation-region-list">
						<view :class="item.class" v-for="(item,index) in regionList" :key="item.text">
							{{item.text}}
						</view>
					</view>
				</view>
				<view class="investigation-choice">
					<view class="investigation-choice-title">
						回答的问题
					</view>
					<view class="investigation-choice-item" v-for="(item,index) in problemList" :key="item.text">
						<view class="investigation-choice-item-text">
							{{item.text}}
						</view>
						<view class="investigation-choice-item-right">
							<view :class="e.class" v-for="(e,i) in item.list">
								{{e.title}}
							</view>

						</view>
					</view>
				</view>



			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		postAddserviceevaluate,
		getevaluate
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				show: false,
				regionList: [{
					text: "客厅",
					class: "investigation-region-list-item"
				}, {
					text: "卧室",
					class: "investigation-region-list-item"
				}, {
					text: "厨房",
					class: "investigation-region-list-item"
				}, {
					text: "卫生间",
					class: "investigation-region-list-item"
				}, {
					text: "阳台",
					class: "investigation-region-list-item"
				}, {
					text: "餐厅",
					class: "investigation-region-list-item"
				}],
				add_class: "",
				indexList: [],
				problemList: [{
					text: "饭菜是否摆放整齐？",
					list: [{
						title: "是",
						class: "investigation-choice-item-right-yes"
					}, {
						title: "否",
						class: "investigation-choice-item-right-yes"
					}]
				}, {
					text: "被子是否叠放整齐？",
					list: [{
						title: "是",
						class: "investigation-choice-item-right-yes"
					}, {
						title: "否",
						class: "investigation-choice-item-right-yes"
					}]
				}, {
					text: "有帮您清洁卫生间的马桶吗？",
					list: [{
						title: "是",
						class: "investigation-choice-item-right-yes"
					}, {
						title: "否",
						class: "investigation-choice-item-right-yes"
					}]

				}, {
					text: "饭菜味道是否好吃？",
					list: [{
						title: "是",
						class: "investigation-choice-item-right-yes"
					}, {
						title: "否",
						class: "investigation-choice-item-right-yes"
					}]

				}],
				answer: [],
				service_id: "",
				nanny_id: ""
			}
		},
		created() {


		},
		methods: {
			open(list) {
				this.show = true
				this.regionList.map(item => {
					list.area.map(ele => {
						if (item.text == ele.title) {
							item.class = "investigation-region-list-active"
						}
					})
				})

				// list.map(item => {
				// 	item.text = item.title
				// 	item.class = "investigation-region-list-item"
				// })

				list.n_problem.map(item => {
					item.text = item.title
					if (item.checked == true) {
						item.list = [{
							title: "是",
							class: "investigation-choice-item-right-activ"
						}, {
							title: "否",
							class: "investigation-choice-item-right-yes"
						}]
					}
					if (item.checked == false) {
						item.list = [{
							title: "是",
							class: "investigation-choice-item-right-yes"
						}, {
							title: "否",
							class: "investigation-choice-item-right-activ"
						}]
					}

				})
				this.problemList = list.n_problem;

			}





		}
	}
</script>
<style lang="scss" scoped>
	.investigation {
		.investigation-popup {
			padding-top: 50upx;
			padding-left: 30upx;

			.investigation-title {
				text-align: center;
				font-size: 36upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #1A1A1A;
				line-height: 50upx;
				margin-bottom: 80upx;
			}

			.investigation-region {
				.investigation-region-title {
					font-size: 32upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #1A1A1A;
					line-height: 44upx;
					margin-bottom: 61upx;
				}

				.investigation-region-list {
					display: flex;
					flex-wrap: wrap;
					padding-bottom: 21upx;

					.investigation-region-list-item {
						width: 211upx;
						height: 61upx;
						background: #fff;
						border-radius: 30upx;
						border: 1px solid #DDDDDD;
						text-align: center;
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #202020;
						line-height: 61upx;
						margin-right: 30upx;
						margin-bottom: 40upx;

					}

					.investigation-region-list-active {
						width: 211upx;
						height: 61upx;
						border-radius: 30upx;
						text-align: center;
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FF8666;
						line-height: 61upx;
						margin-right: 30upx;
						background: rgba(255, 134, 102, 0.1);
						border: 1px solid #FF8666;
						margin-bottom: 40upx;

					}
				}
			}

			.investigation-choice {
				.investigation-choice-title {
					font-size: 32upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #1A1A1A;
					line-height: 44upx;
					margin-bottom: 62upx;
				}

				.investigation-choice-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 21rpx;
					margin-bottom: 21rpx;

					.investigation-choice-item-text {
						font-size: 32upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #1D1D1D;
						line-height: 44upx;
					}

					.investigation-choice-item-right {
						display: flex;

						.investigation-choice-item-right-yes {
							width: 88upx;
							height: 48upx;
							border-radius: 29upx;
							border: 1px solid #DDDDDD;
							text-align: center;
							font-size: 29upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #666666;
							line-height: 48upx;
							margin-right: 30upx;

						}

						.investigation-choice-item-right-activ {
							width: 88upx;
							height: 48upx;
							border-radius: 29upx;
							background: rgba(255, 134, 102, 0.1);
							border: 1px solid #FF8666;
							text-align: center;
							font-size: 29upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #FF8666;
							line-height: 48upx;
							margin-right: 30upx;

						}
					}
				}
			}

			.investigation-foot {
				// padding-right: 30upx;
				width: 100%;
				height: 124upx;
				background: #FFFFFF;
				box-shadow: 0px 0px 8upx 0px rgba(0, 0, 0, 0.16);
				padding-top: 16upx;
				position: fixed;
				left: 0;
				bottom: 0upx;

				.investigation-foot-but {
					width: 670upx;
					height: 92upx;
					background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
					border-radius: 46upx;
					font-size: 32upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 92upx;
				}
			}



		}
	}
</style>
