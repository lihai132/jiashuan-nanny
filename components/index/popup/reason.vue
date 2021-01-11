<template>

	<u-popup v-model="show" mode="bottom" height="900rpx" :closeable="true">
		<view class="reason-title">
			说明原因
		</view>
		<view class="reason-nav-list">
			<view :class=" item.class" v-for="(item,index) in list" :key="index.text" @click="choice(index,item.class)">
				{{item.text}}
			</view>
		</view>
		<view class="reason-nav-input">
			<textarea class="reason-text" v-model="textarea" placeholder="选填" :maxlength="200"></textarea>
			<view class="reason-nav-input-num">
				{{contrast}}/200
			</view>
		</view>
		<view class="reason-nav-but">
			<u-button :class="className" shape="circle" hover-class="none" :disabled="but" @click="submit">确认提交</u-button>
		</view>
		<u-toast ref="uToast" />
	</u-popup>

</template>

<script>
	import {
		postAcceptRefuse
	} from '../../../utils/api.js';

	export default {
		data() {
			return {
				show: false,
				// list: ["临时有事", "距离太远", "不匹配", "其他"],
				list: [{
					text: "临时有事",
					class: "reason-nav-list-item"
				}, {
					text: "距离太远",
					class: "reason-nav-list-item"
				}, {
					text: "不匹配",
					class: "reason-nav-list-item"
				}, {
					text: "其他",
					class: "reason-nav-list-item"
				}, ],
				selected: 0,
				indexList: [],
				textarea: "",
				textareaLength: '',
				contrast: 0,

				form: {
					cause: ""
				},
				className: "custom-none",
				but: true
			}
		},

		methods: {

			open() {
				this.show = true

			},
			//多选
			// xz(i, name) {
			// 	if (name == "reason-nav-list-item") {
			// 		this.indexList.push(i)
			// 		this.list[i].class = "reason-nav-list-item-active"

			// 	}
			// 	if (name == "reason-nav-list-item-active") {
			// 		let num = ""
			// 		this.indexList.map((item, index) => {
			// 			if (item == i) {
			// 				num = index
			// 			}
			// 		})
			// 		this.indexList.splice(num, 1);
			// 		this.list[i].class = "reason-nav-list-item";
			// 	}
			// },

			//单选
			choice(i, name) {
				if (name == "reason-nav-list-item") {
					this.list.map((item, index) => {
						if (index == i) {
							item.class = "reason-nav-list-item-active"
							this.form.cause = item.text
						} else {
							item.class = "reason-nav-list-item"
						}
					})
				}
				this.className = "custom-style",
					this.but = false
			},

			submit() {
				let serviceId = this.$store.state.meet.serviceId;

				postAcceptRefuse({
					nanny_id: uni.getStorageSync('nanny_id'),
					cause: this.form.cause,
					remark: this.textarea,
					service_id: serviceId

				}).then(res => {
					if (res.code == 0) {
						this.show = false;
						this.$emit("disabled")
					} else {
						this.$refs.uToast.show({
							title: res.msg
						})
					}
				})

			}
		},

		watch: {
			textarea(val) {
				this.contrast = val.length
			}
		}
	}
</script>
<style lang="scss" scoped>
	.u-popup {}

	.reason-title {
		padding-top: 50upx;
		text-align: center;

		font-size: 36upx;

		font-weight: 400;
		color: #1A1A1A;
		line-height: 50upx;
		margin-bottom: 60rpx;
	}

	.reason-nav-list {
		display: flex;
		padding: 0 30upx;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 40upx;

		.reason-nav-list-item {
			width: 210upx;
			height: 60upx;
			border-radius: 30upx;
			border: 1px solid #DDDDDD;

			font-size: 32upx;

			font-weight: 400;
			color: #202020;

			line-height: 60upx;
			text-align: center;
			margin-top: 20upx;
			margin-bottom: 20upx;

		}

		.reason-nav-list-item-active {
			width: 210upx;
			height: 60upx;
			border-radius: 30upx;
			background: rgba(255, 134, 102, 0.1);
			font-weight: 400;
			border: 1px solid #FF8666;
			color: #FF8666;
			text-align: center;
			margin-top: 20upx;
			margin-bottom: 20upx;
			line-height: 60upx;
			font-size: 32upx;
		}

	}

	.reason-nav-input {
		padding: 0 30upx;
		position: relative;

		.reason-text {
			width: 690upx;
			height: 240upx;
			background: #F6F6F6;
			border-radius: 12upx;
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

	.reason-nav-but {
		margin-top: 90upx;

		.custom-none {
			background: linear-gradient(45deg, #FFDCCE 0%, #FFC3B3 100%);
			width: 670upx;
			height: 92upx;
			border-radius: 46upx;
			font-size: 32upx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 92upx;
		}

		.custom-style {
			width: 670upx;
			height: 92upx;
			background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
			border-radius: 46upx;

			font-size: 32upx;

			font-weight: 500;
			color: #FFFFFF;
			line-height: 92upx;


		}

		.custom-style::after {
			border: none;
		}
	}
</style>
