<template>
	<view class="main">
		<view class="main-head">
			<u-navbar b:is-fixed="isFixed" :title="title" :is-back="isBack" height="44px" :immersive="true">
				<view class="navbar-right" slot="right" v-if="slotRight">
					<image class="main-head-icon" src="../../static/main/setup.png" mode="" @click="goto"></image>
				</view>
			</u-navbar>
			<view class="main-content">
				<view class="nannyDetails-top">
					<image class="nannyDetails-top-src" src="../../static/main/bjt.png"></image>
					<view class="nannyDetails-head" >
						<view class="nannyDetails-head-box">
							<image class="nannyDetails-head-src" :src="mineData.headimgurl" />
						</view>
					</view>
					<view class="nannyDetails-nav-fabulous-nav">
						<u-icon name="heart-fill" color="#FFBB9F" size="20rpx"></u-icon>
						<view class="nannyDetails-nav-fabulous-nav-num">{{mineData.star}}</view>
					</view>
					<view class="nannyDetails-nav-code">
						<view class="nannyDetails-nav-mycode" @click="open(0)">
							<image class="nav-mycode-src" src="../../static/main/myCode.png" mode="" />
							<view class="nav-mycode-text">推广</view>
						</view>
						<view class="nannyDetails-nav-code-extension" @click="open(1)">
							<image class="nav-mycode-src" src="../../static/main/myCode.png" mode="" />
							<view class="nav-mycode-text">个人信息</view>
						</view>
					</view>
				</view>
				<view class="nannyDetails-nav">
					<view class="information">
						<view class="nannyDetails-nav-name">{{mineData.name}}</view>
						<view class="nannyDetails-nav-news">
							<view class="nannyDetails-nav-time">
								<view class="nav-time-title">年龄:</view>
								<view class="nav-time-text">{{mineData.age}}岁</view>
							</view>
							<view class="line"></view>
							<view class="nannyDetails-nav-time">
								<view class="nav-time-title">籍贯:</view>
								<view class="nav-time-text">{{mineData.native_place}}</view>
							</view>
							<view class="line"></view>
							<view class="nannyDetails-nav-time">
								<view class="nav-time-title">民族:</view>
								<view class="nav-time-text">{{mineData.nation}}</view>
							</view>
						</view>
					</view>
					<view class="nannyDetails-singular">
						<view class="nannyDetails-singular-box" v-for="(item, index) in numList" :key="item.src">
							<image class="nannyDetails-singular-src" :src="item.src" mode=""></image>
							<view class="singular-numList">
								<view class="singular-numList-item" v-for="(ele,i) in item.list" :key="i">
									<view class="singular-numList-item-num">
										{{ele.num}}
									</view>
									<view class="singular-numList-item-title">
										{{ele.title}}
									</view>
								</view>

							</view>
						</view>

					</view>
					<view class="Specialty">
						<view class="Specialty-nav-title">我的特长</view>
						<view class="Specialty-nav-center">
							<view class="Specialty-nav-center-nav">
								<view class="Specialty-nav-center-title">擅长菜系：</view>
								<view class="Specialty-nav-center-list">
									<view class="Specialty-nav-center-list-item" v-for="(item, index) in foodList" :key="index">{{item}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="exhibition">
						<view class="exhibition-nav-title">个人展示</view>
						<view class="exhibition-nav-list">
							<image class="exhibition-nav-list-item" :src="item" v-for="(item, index) in imgList" :key="index"></image>
						</view>
					</view>
					<view class="exhibition-foot">
						<button type="default" class="exhibition-foot-leave" @click="leave">请假</button>
						<button type="default" class="exhibition-foot-contact" @click="callStationmaster">联系站长</button>
					</view>
				</view>
			</view>




		</view>
		<u-toast ref="uToast" />
		<popup ref="popup"></popup>
	</view>
</template>

<script>
	import {
		getUserInfo
	} from '../../utils/api.js';
	import mainTop from "../../assembly/Main/popup.vue";
	import popup from "../../assembly/Main/popup.vue";
	export default {
		data() {
			return {
				headTitle: '我的',
				mineData: '', // 我的信息
				foodList: [], // 菜系
				imgList: [], // 个人展示
				numList: [{
						src: "../../static/main/long.png",
						list: [{
							title: '待进行',
							num: 0
						}, {
							title: '已完成',
							num: 0
						}]
					},
					{
						src: "../../static/main/ontrial.png",
						list: [{
							title: '待进行',
							num: 0
						}, {
							title: '已完成',
							num: 0
						}]
					}
				],
				isBack: false,
				slotRight: true,
				title: "我的",
				auto: "",
				myCode: "",
				extensionCode: ""
			}
		},
		onShow() {
			getUserInfo({
				nanny_id: uni.getStorageSync('nanny_id')
			}).then(res => {
				if (res.code == 0) {
					this.mineData = res.data;

					// console.log(res.data)
					this.numList[0].list[0].num = res.data.long_wait_count;
					this.numList[0].list[1].num = res.data.long_finish_count;
					
					this.numList[1].list[0].num = res.data.trial_wait_count;
					this.numList[1].list[1].num = res.data.trial_finish_count;
					
					this.foodList = res.data.flavor_arr;
					this.imgList = res.data.spread_image;
					this.auto = res.data.is_auto;
					this.extensionCode = res.data.userinfo_qrcode
					this.myCode = res.data.spread_qrcode
					// console.log(this.numList)
				} else {
					this.$refs.uToast.show({
						title: '系统错误'
					})
				}
			})
		},
		methods: {
			// 联系站长
			callStationmaster() {
				uni.makePhoneCall({
					phoneNumber: this.mineData.phone,
					success: (res) => {},
					fail: (res) => {}
				});
			},
			leave() {
				uni.navigateTo({
					url: '/pages/leave/leave',
				});
			},
			goto() {
				uni.navigateTo({
					url: "/pages/setup/setup?auto=" + this.auto
				})
			},
			open(num) {
				if (num == 0) {
					this.$refs.popup.open(this.myCode,1)
					console.log(this.myCode)
				}
				if (num == 1) {
					this.$refs.popup.open(this.extensionCode,2)
					console.log(this.extensionCode)
				}

			}


		},
		components: {
			mainTop,
			popup
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-navbar-inner {
		padding-bottom: 21rpx;

		.main-head-icon {
			padding-top: 8rpx;
		}
	}
	/deep/uni-button:after{
		border: none;
	}

	.main {
		position: relative;
		height: 100%;

	}

	.main-head {
		height: 100% !important;
		.main-head-icon {
			width: 34rpx;
			height: 36rpx;
			margin-right: 48rpx;
		}
	}

	.nannyDetails-top {
		position: relative;
	}

	.nannyDetails-top-src {
		height: 352rpx;
		width: 100%;
		position: relative;
	}

	.nannyDetails-head {
		z-index: 300;
		position: absolute;
		/* width: 254rpx;
	  height: 202rxp; */
		top: 200rpx;
		left: 30rpx;
		/* background:#ccc; */
		.nannyDetails-head-src{
			border-radius: 10rpx
		}

	}

	.nannyDetails-head-box {
		padding: 8rpx;
		background: #fff;
		width: 226rpx;
		height: 226rpx;
		box-sizing: border-box;
		border-radius: 24rpx;
		margin: auto;
		box-shadow: 0px 42px 40px -26px rgba(155, 67, 43, 0.3);
	}

	.nannyDetails-head-src {
		width: 210rpx;
		height: 210rpx;
	}

	.nannyDetails-nav-code {
		z-index: 10;
		position: absolute;
		bottom: -36upx;
		right: 48upx;
		display: flex;
		align-items: cnter;

		.nannyDetails-nav-mycode,
		.nannyDetails-nav-code-extension {
			display: flex;
			align-items: cnter;
			justify-content: center;
			width: 156upx;
			height: 56upx;
			background: #FFFFFF;
			box-shadow: 0px 2upx 20upx 0px rgba(0, 0, 0, 0.1);
			border-radius: 92upx;


			.nav-mycode-src {
				width: 32upx;
				height: 32upx;
				margin-right: 10upx;
				margin-top: 12upx;
			}

			.nav-mycode-text {
				font-size: 28upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #202020;
				line-height: 56upx;
			}
		}

		.nannyDetails-nav-code-extension {
			width: 212upx;
			height: 56upx;
			margin-left: 24upx;


		}
	}

	.nannyDetails-nav {
		border-radius: 24rpx 24rpx 0px 0px;
		position: absolute;
		top: 302rpx;
		background: #fff;
		width: 100%;
		// height: 500rpx;
		padding-left: 48rpx;
		box-sizing: border-box;

		.nannyDetails-singular {
			margin-top: 48rpx;

			width: 654rpx;
			height: 200rpx;
			display: flex;
			justify-content: space-between;

			.nannyDetails-singular-src {
				width: 324rpx;
				height: 200rpx;
			}

			.nannyDetails-singular-box {
				position: relative;
			}

			.singular-numList {
				width: 100%;
				padding-left: 72upx;
				padding-right: 56rpx;
				display: flex;
				justify-content: space-between;
				position: absolute;
				top: 76upx;
				left: 0;

				.singular-numList-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.singular-numList-item-num {
						font-size: 50upx;
						font-family: DINCondensed-Bold, DINCondensed;
						font-weight: 550;
						color: #FFFFFF;
						line-height: 68upx;
					}

					.singular-numList-item-title {
						font-size: 26upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(255, 255, 255, 0.7);
						line-height: 36upx;
					}
				}
			}

		}

	}


	.nannyDetails-head {
		position: absolute;
	}

	.nannyDetails-head-src {
		width: 210rpx;
		height: 210rpx;
	}

	.nannyDetails-nav-fabulous-nav {
		width: 156rpx;
		height: 56rpx;
		border-radius: 92rpx;
		box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
		margin-top: 36rpx;
		margin-left: 494rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 76rpx;
		right: 48rpx;
		background-color: #fff;


	}

	.nannyDetails-nav-fabulous-nav-num {
		font-size: 24rpx;
		line-height: 34rpx;
		color: #FFBB9F;
		margin-left: 15rpx;
	}

	

	.nannyDetails-nav-name {
		margin-top: 158rpx;
		font-size: 44rpx;
		font-weight: 500;
		color: #1D1D1D;
		line-height: 60rpx;
	}

	.nannyDetails-nav-news {
		display: flex;
		align-items: center;
		margin-top: 28rpx;
	}

	.nannyDetails-nav-time {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}

	.nav-time-title {
		font-size: 29rpx;
		line-height: 40rpx;
		color: #999999;
		margin-right: 10rpx;
	}

	.nav-time-text {
		font-size: 29rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.line {
		width: 2rpx;
		height: 20rpx;
		background: #C7CCD1;
		margin-right: 20rpx;
	}

	/* 家政师个人信息展示模块 */
	/* 家政师做菜信息展示模块 */

	.Specialty {
		margin-top: 61rpx;
	}

	.Specialty-nav-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #1D1D1D;
		line-height: 44rpx;
	}

	.Specialty-nav-center {}

	.Specialty-nav-center-title {
		margin-top: 40rpx;
		font-size: 29rpx;
		font-weight: 400;
		color: #666666;
		line-height: 40rpx;
		/* margin-bottom: 28rpx; */
	}

	.Specialty-nav-center-list {
		display: flex;
		flex-wrap: wrap;
	}

	.Specialty-nav-center-list-item {
		width: 142rpx;
		height: 70rpx;
		background: #F2F2F4;
		border-radius: 12rpx;
		font-size: 29rpx;
		font-weight: 400;
		color: #51575D;
		line-height: 70rpx;
		text-align: center;
		margin-right: 22rpx;
		margin-top: 28rpx;
	}

	.Specialty-nav-center-menuList-item {
		background: rgba(255, 134, 102, 0.1);
		border-radius: 29rpx;
		color: #FF8666;
		padding-left: 22rpx;
		padding-right: 22rpx;
		font-size: 29rpx;
		line-height: 53rpx;
		margin-right: 20rpx;
		margin-top: 28rpx;

	}

	/* 家政师做菜信息展示模块 */

	/* 个人特长展示模块 */

	.exhibition {
		margin-top: 61rpx;
		padding-bottom: 80rpx;
	}

	.exhibition-nav-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #1D1D1D;
		line-height: 44rpx;
	}

	.exhibition-nav-list {
		margin-top: 40rpx;
		display: flex;
		flex-wrap: nowrap;

		overflow: scroll;
		margin-right: 48rpx;
	}

	.exhibition-nav-list-item {
		width: 240rpx;
		height: 240rpx;
		margin-right: 24rpx;
		border-radius: 12upx;
		flex-shrink: 0;
	}

	.exhibition-nav-list::-webkit-scrollbar {
		display: none
	}

	/* 个人特长展示模块 */

	.exhibition-foot {
		width: 100%;
		// padding-left: 48rpx;
		padding-right: 48rpx;
		display: flex;

		justify-content: space-between;
		padding-bottom: 172rpx;

		.exhibition-foot-leave {
			width: 312rpx;
			height: 92rpx;
			border-radius: 100rpx;
			border: 2rpx solid #E5E5E5;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #202020;
			line-height: 92rpx;
			margin-right: 32rpx;
		}

		.exhibition-foot-contact {
			width: 312rpx;
			height: 92rpx;
			background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
			border-radius: 46rpx;
			font-size: 32upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 92rpx;
		}

		.navbar-right {
			margin-right: 30rpx;
			display: flex;

			color: #FF8666;
		}
	}
</style>
