<template>
	<view class="investigation">
		<u-popup v-model="show" mode="bottom" border-radius="20" height="1032rpx" :mask-close-able="true">
			<view class="investigation-popup">
				<view class="investigation-title">
					请如实记录今日工作内容
				</view>
				<view class="investigation-region">
					<view class="investigation-region-title">
						我做完的区域(多选)
					</view>
					<view class="investigation-region-list">
						<view :class="item.class" v-for="(item,index) in regionList" :key="item.text" @click="dj(item,index,item.class)">
							{{item.text}}
						</view>
					</view>
				</view>
				<view class="investigation-choice">
					<view class="investigation-choice-title">
						请回答以下全部问题
					</view>
					<view class="investigation-choice-item" v-for="(item,index) in problemList" :key="item.text">
						<view class="investigation-choice-item-text">
							{{item.text}}
						</view>
						<view class="investigation-choice-item-right">
							<view :class="e.class" v-for="(e,i) in item.list" @click="whether(item,index,i,e.title)">
								{{e.title}}
							</view>

						</view>
					</view>
				</view>
				<view class="investigation-foot">
					<button type="default" class="investigation-foot-but" @click="submit">确认提交</button>
				</view>
				<u-toast ref="uToast" />

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
			open(service_id, nanny_id) {
				this.show = true
				this.service_id = service_id
				this.nanny_id = nanny_id
				this.getList()

			},
			dj(item, i, name) {
				if (name == "investigation-region-list-item") {
					this.indexList.push(i)
					this.regionList[i].class = "investigation-region-list-active"

				}
				if (name == "investigation-region-list-active") {
					let num = ""
					this.indexList.map((item, index) => {
						if (item == i) {
							num = index
						}
					})
					this.indexList.splice(num, 1);
					this.regionList[i].class = "investigation-region-list-item";

				}

			},
			whether(data,index, i, text) {
				// console.log(data)
				this.problemList.map((item, num) => {

					if (index == num) {
						item.list.map((ele, test) => {
							if (test == i) {
								this.problemList[index].list[i].class = "investigation-choice-item-right-activ";
							} else {
								ele.class = "investigation-choice-item-right-yes"
							}
						})
					}
				})

				this.answer.map((item, num) => {
					if (item.id == data.id) {
						if (text == "是") {
							item.checked = true
							item.whether = 1
						} else {
							item.checked = false
							item.whether = 1
						}
					}
				})
				console.log(this.answer)
			},
			submit() {
				let area = []
				this.indexList.map(item => {
					this.regionList.map((ele, index) => {
						if (item == index) {
							area.push({
								id: ele.id,
								title: ele.title
							})
						}
					})
				})
				console.log(area)
				console.log(this.answer)
				if (this.indexList.length == 0) {
					this.$refs.uToast.show({
						title: '请最少选择一个你所打扫的区域'
					})
					return;
				}
				let text = true
				this.answer.map((item) => {
					console.log(item.whether)
					if (item.whether == 0) {
						text = false

					} else {
						// text = true
					}

				})
				if (text == false) {
					this.$refs.uToast.show({
						title: '请回答全部问题'
					})
				} else {
					let n_problem = JSON.stringify(this.answer)
					area = JSON.stringify(area)
					console.log(n_problem)
					console.log(area)
					
					postAddserviceevaluate({
						service_id: this.service_id,
						nanny_id: this.nanny_id,
						n_problem: n_problem,
						area: area

					}).then(res => {
						if (res.code == 0) {
							this.show = false
							this.answe = []
							this.indexList = []
							this.$emit("submission")
						} else {
							this.$refs.uToast.show({
								title: '系统错误'
							})
						}
					})
				}

			},
			getList() {
				getevaluate({
					service_id: this.service_id,
				}).then(res => {
					if (res.code == 0) {
						res.data.area.map(item => {
							item.text = item.title
							item.class = "investigation-region-list-item"
						})

						res.data.option.map(item => {
							item.text = item.title
							item.list = [{
								title: "是",
								class: "investigation-choice-item-right-yes"
							}, {
								title: "否",
								class: "investigation-choice-item-right-yes"
							}]
						})


						this.regionList = res.data.area;
						this.problemList = res.data.option;
						res.data.option.map((item) => {
							this.answer.push({
								id: item.id,
								whether: 0,
								title: item.title

							})
						})
						console.log(res.data.option);
						console.log(this.answer)
					} else {
						this.$refs.uToast.show({
							title: '系统错误',
						})
					}
				})
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
