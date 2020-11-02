<template>
	<view class="app-body">
		<!-- #ifdef APP-PLUS -->
		<!-- 兼容手机顶部刘海 -->
		<view class="status-contents">
			<view class="status top-view"></view>
		</view>
		<!-- #endif -->
		<view class="container">
			<view class="app-title">
				<view class="app-title-text">家舒安，</view>
				<view class="app-title-text">家政师登录!</view>
			</view>
			<view class="app-form">
				<form @submit="formSubmit">
					<view class="app-form-item">
						<label class="app-form-item-label">+86</label>
						<view class="app-form-item-content">
							<view class="app-input flexbox middle">
								<input type="number" v-model="mobile" @focus="mobileFocus" @input="mobileInput" @blur="mobileBlur" placeholder="请输入手机号"
								 maxlength="11" />
								<!-- <icon type="clear" size="20" v-if="mobileClear" @click="clearMobile" /> -->
							</view>
						</view>
					</view>
					<view class="app-form-item">
						<label class="app-form-item-label">验证码</label>
						<view class="app-form-item-content">
							<view class="app-input flexbox middle justify">
								<view class="input flex1">
									<input type="number" v-model="idCard" @focus="idCardFocus" @input="idCardInput" @blur="idCardBlur" placeholder="请输入验证码"
									 maxlength="4" />
								</view>
								<view class="btns">
									<button class="btn" :disabled="verifyDisabled" @click.stop="sendClick" :class="[{'btn-info': sendStatus == 0},{'btn-primary': sendStatus == 1},{'is-primary': sendStatus == 2}]">{{sendText}}</button>
								</view>
								<!-- <icon type="clear" size="20" v-if="idCardClear" @click="clearIdCard" /> -->
							</view>
						</view>
					</view>
					<view class="uni-btn-v" :class="{disabled: btnStatus}">
						<button form-type="submit">登录</button>
					</view>
				</form>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		login,
		smsode
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				mobile: '',
				mobileClear: false, // 是否显示手机号清除按钮
				idCard: '',
				idCardClear: false, // 是否显示身份证号清除按钮
				btnStatus: true,

				verifyDisabled: false,
				sendStatus: 0, // 发送验证码状态 默认0 - 原始状态，1 - 发送状态, 2 - 倒数状态
				sendText: '获取验证码',
				timer: null,
				count: 60,
				form: {
					phone: '',
					code: '',
					login_key: ""
				}
			}
		},
		onShow() {
			if (uni.getStorageSync('phone') != '') {
				this.form.phone = uni.getStorageSync('phone');
				this.form.login_key = uni.getStorageSync('login_key');
				if (this.form.login_key) {
					console.log(111)
					this.loginKey()
				}
				// this.form.idcard = uni.getStorageSync('idcard');
				this.mobile = uni.getStorageSync('phone');
				// this.idCard = uni.getStorageSync('idcard');
				// this.formSubmit()
			}
		},
		methods: {
			// 关于手机号的事件
			mobileFocus: function() {
				if (this.mobile != '') {
					this.mobileClear = true;
				} else {
					this.mobileClear = false;
				}
			},
			mobileInput: function() {
				this.mobileFocus();
				// 判断按钮的状态
				if (this.mobile != '' && this.idCard != '') {
					this.btnStatus = false;
				} else {
					this.btnStatus = true;
				}
			},
			mobileBlur: function() {
				setTimeout(function() {
					this.mobileClear = false;
				}, 200)
				if (this.mobile == '') {
					this.$refs.uToast.show({
						title: '请输入手机号',
					})
				} else if (!(/^1[3456789]\d{9}$/.test(this.mobile))) {
					this.$refs.uToast.show({
						title: '手机号格式不正确',
					})
				} else {
					this.form.phone = this.mobile;
				}
			},
			clearMobile: function() {
				this.mobile = '';
				this.mobileClear = false;
				this.btnStatus = true;
			},
			// 关于身份证号的事件
			idCardFocus: function() {
				if (this.idCard != '') {
					this.idCardClear = true;
				} else {
					this.idCardClear = false;
				}
			},
			idCardInput: function() {
				this.idCardFocus();
				// 判断按钮的状态
				if (this.mobile != '' && this.idCard != '') {
					this.btnStatus = false;
				} else {
					this.btnStatus = true;
				}
			},
			idCardBlur: function() {
				setTimeout(function() {
					this.idCardClear = false;
				}, 200)
				if (this.idCard == '') {
					this.$refs.uToast.show({
						title: '请输入验证码',
					})
				} else {
					this.form.code = this.idCard;
				}
			},
			clearIdCard: function() {
				this.idCard = '';
				this.idCardClear = false;
				this.btnStatus = true;
			},
			// 发送验证码
			sendClick() {
				if (this.mobile == '') {
					this.$refs.uToast.show({
						title: '请输入手机号',
					})
				} else {
					smsode({
						phone: this.mobile
					}).then(res => {
						if (res.code == 0) {
							this.sendStatus = 2;
							this.verifyDisabled = true;
							this.timer = setInterval(() => {
								this.count--;
								this.sendText = this.count < 10 ? '0' + this.count + 's' : this.count + 's';
								if (this.count <= 0) {
									clearInterval(this.timer);
									this.sendText = '重新发送';
									this.sendStatus = 1;
									this.count = 60;
									this.timer = null;
									this.verifyDisabled = false;
								}
							}, 1000)
						} else {
							if (res.msg) {
								this.$refs.uToast.show({
									title: res.msg
								})
							} else {
								this.$refs.uToast.show({
									title: '请联系技术人员'
								})
							}
						}
					})

				}
			},
			// 手机号码加验证码登录
			formSubmit: function() {
				const that = this;
				if (this.mobile == '') {
					this.$refs.uToast.show({
						title: '请输入手机号',
					})
				} else if (this.idCard == '') {
					this.$refs.uToast.show({
						title: '请输入验证码',
					})
					return false;
				} else {
					login(that.form).then(res => {
						// res=JSON.parse(res)
						console.log(res)
						if (res.code == 0) {
							// uni.setStorage({
							//     key: 'username',
							//     data: this.form.phone,
							// });
							// uni.setStorage({
							//     key: 'password',
							//     data: this.form.idCard,
							// });
							uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('phone', res.data.phone);
							uni.setStorageSync('login_key', res.data.login_key);
							uni.setStorageSync('nanny_id', res.data.nanny_id);
							if (res.data.jump) {
								uni.redirectTo({
									url: '../steps/step1'
								})
							} else {
								uni.switchTab({
									url: '../index/index'
								})
							}

						}
						if (res.code == 10111) {

							uni.navigateTo({
								url: '../examine/examine?is_examine=' + "0"
							})
						}
						if (res.code == 10112) {
							uni.navigateTo({
								url: '../examine/examine?is_examine=' + "2"
							})
						}
						if (res.code == 10114) {
							this.$refs.uToast.show({
								title: res.msg
							})
						} else {
							if (res.msg) {
								this.$refs.uToast.show({
									title: res.msg
								})
							} else {
								this.$refs.uToast.show({
									title: '请联系技术人员'
								})
							}
						}
					})
				}
			},
			// 手机号码login_key登录
			loginKey() {
				login({
					phone: this.form.phone,
					code: "",
					login_key: this.form.login_key
				}).then(res => {
					// console.log(res)
					if (res.code == 0) {
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('phone', res.data.phone);
						uni.setStorageSync('login_key', res.data.login_key);
						uni.setStorageSync('nanny_id', res.data.nanny_id);
						if (res.data.jump) {
							uni.redirectTo({
								url: '../steps/step1'
							})
						} else {
							uni.switchTab({
								url: '../index/index'
							})
						}
						return;
					}
					if (res.code == 10111) {

						uni.navigateTo({
							url: '../examine/examine?is_examine=' + "0"
						})
						return;
					}
					if (res.code == 10112) {
						uni.navigateTo({
							url: '../examine/examine?is_examine=' + "2"
						})
						return;
					} else {
						this.$refs.uToast.show({
							title: res.msg
						})
						return;
					}
				})
			}
		},
	}
</script>

<style scoped>
	.container {
		width: 100%;
		padding: 0 40rpx;
		border-top: 10px solie #ccc;
	}

	.app-title {
		margin-top: 72rpx;
	}

	.app-title .app-title-text {
		color: #202020;
		font-size: 64rpx;
		font-weight: bold;
		line-height: 1.5;
	}

	.app-form {
		margin-top: 70rpx;
	}

	.app-form-item {
		margin-bottom: 53rpx;
	}

	.app-form-item-label {
		height: 50rpx;
		line-height: 50rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #202020;
	}

	.app-input {
		padding-top: 20rpx;
		padding-bottom: 28rpx;
		border-bottom: 2rpx solid #ededed;
	}

	.app-input input {
		width: 100%;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 48rpx;
	}

	.uni-btn-v {
		padding-top: 40rpx;
	}

	.uni-btn-v uni-button {
		border: none;
		height: 92rpx;
		line-height: 92rpx;
		border-radius: 46rpx;
		font-size: 32rpx;
		color: #fff;
		background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
	}

	.uni-btn-v.disabled {
		opacity: .6
	}

	.btns .btn {
		font-size: 24upx;
		width: 198upx;
		height: 64upx;
		line-height: 64upx;
		text-align: center;
		border-radius: 32upx;
		color: #fff;
	}

	.btns .btn::after {
		border: none;
	}

	.btns .btn-info {

		background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
		color: #fff !important;
	}

	.btns .btn-primary {
		background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%) !important;
		color: #fff !important;
	}

	.btns .is-primary {
		background-color: #fff !important;
		border: 2upx solid #ffcbbb !important;
		color: #aaa !important;
	}

	.app-body {
		border-top: 10px solie #ccc;
	}
</style>
