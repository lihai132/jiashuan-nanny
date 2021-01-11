<template>
	<view>
		<u-modal v-model="show" :content="content" :show-title="false" :show-cancel-button="false" @confirm="confirm"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		postServicestart
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				show: false,
				content: '拒绝定位授权将导致app部分功能无法使用，请开启定位授权',
				formData: {}
			}
		},
		methods: {
			open(text, data) {
				this.show = true;

			},
			confirm() {
				uni.getSetting({
					success(res) {
						if (res.authSetting['scope.userLocation']) {
							console.log("userLocation位置功能已授权")
							// 如果已授权,直接获取对应参数
							uni.getLocation({
								success(res) {
									console.log(res)
								}
							})
						} else if (!res.authSetting['scope.userLocation']) {
							// 说明此时要获取的位置功能尚未授权,
							// 则设置进入页面时主动弹出，直接授权
							uni.authorize({
								scope: 'scope.userLocation',
								success(res) {
									// 授权成功
									console.log(res)
									// 成功后获取对应的位置参数
									uni.getLocation({
										success(res) {
											console.log(res)
										}
									})
								},
								fail() {
									console.log("位置授权失败")
									uni.showModal({
										content: '检测到您没打开获取信息功能权限，是否去设置打开？',
										confirmText: "确认",
										cancelText: '取消',
										success: (res) => {
											console.log(res)
											if (res.confirm) {
												uni.openSetting({
													success: (res) => {
														console.log(res);
													},
													fail: (err) => {
														console.log(err)
													}
												})
											} else {
												console.log('取消');
											}
										}
									})
								}
							})
						}
					},
					fail() {
						console.log("获取授权信息授权失败")
					}
				})

			}
		}
	}
</script>
