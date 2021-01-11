<template>
	<view class="setup">
		<u-navbar back-text="" title="设置"></u-navbar>
		<view class=" setup-content">
			<view class="setup-content-nav">
				<view class="setup-content-nav-left">
					系统派单时自动接单
				</view>
				<view class="setup-content-nav-right">
					<u-switch v-model="checked" :loading="loading" active-color="#FF8666" @change="changeStatus"></u-switch>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { postSaveAuto } from '../../utils/api.js';
	export default {
		data() {
			return {
				checked: 'true',
				loading: false,
				// 中间变量，避免在watch中多次回调，造成无限循环
				controlStatus: false
			}
		},
		onLoad(options) {
			// 获取设置自动接单的参数 判断开关状态 0-关闭，1-开启
			if (options.auto == 1) {
				this.checked = true;
			} else {
				this.checked = false;
			}
		},
		methods: {
			// switch打开或者关闭时触发，值为true或者false,
			changeStatus(status) {
				console.log(status);
				if (status == false) {
					this.checked = true;
					this.loading = true;
					setTimeout(() => {
						this.controlStatus = true;
						// 后端允许用户关闭switch，设置checked为false，结束loading状态
						this.loading = false;
						this.checked = false;
					}, 1500);
				} else {
					this.checked = true;
				}
				postSaveAuto({nanny_id: uni.getStorageSync('nanny_id')}).then(res => {
					if (res.code != 0) {
						this.$refs.uToast.show({ title: '系统错误' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.setup-content {
		.setup-content-nav {
			padding: 62rpx 30rpx;
			display: flex;
			justify-content: space-between;

			.setup-content-nav-left {
				font-size: 36upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #202020;
				line-height: 50upx;
			}

			.setup-content-nav-right {}
		}
	}
</style>
