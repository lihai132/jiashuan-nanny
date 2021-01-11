<template>
	<view class="app-body">
		<!-- #ifdef APP-PLUS -->
		<!-- 兼容手机顶部刘海 -->
		<view class="status-contents">
			<view class="status top-view"></view>
		</view>
		<!-- #endif -->
		<view class="app-content">
			<view class="container">
				<view class="step-wrap step-block">
					<view class="step-title">上传个人资料</view>
				</view>
				<view class="step-personal step-block">
					<view class="personal-box">
						<view class="personal-title">身份证（正面）</view>
						<view class="personal-title">健康证（正面）</view>
					</view>
					<view class="personal-form">
						<view class="personal-upload flexbox justify">
							<view class="personal-upload-item flexbox center middle">
								<image class="upload-bg" :src="form.idcard_image_front == '' ? '../../static/personal/idcard-bg1.png' : form.idcard_image_front"></image>
								<view class="upload-postion">
									<image class="upload-icon" src="../../static/personal/icon-camera.png" mode="widthFix" @click="uploadImg"
									 data-type="1"></image>
								</view>
							</view>
							<view class="personal-upload-item flexbox center middle">
								<image class="upload-bg" :src="form.health_image_front == '' ? '../../static/personal/idcard-bg1.png' : form.health_image_front"></image>
								<view class="upload-postion">
									<image class="upload-icon" src="../../static/personal/icon-camera.png" mode="widthFix" @click="uploadImg"
									 data-type="2"></image>
								</view>
							</view>
						</view>
						<u-form :model="form" ref="uForm" style="margin-bottom:90rpx">
							<u-form-item label="身份证号码:" prop="idcard" :label-style="labelStyle" label-width="105px">
								<u-input v-model="form.idcard" @blur="nativePlace" placeholder="请输入您的身份证号" :custom-style="inputStyle" />
							</u-form-item>
							<u-form-item label="姓名:" prop="name" :label-style="labelStyle" label-width="54px">
								<u-input v-model="form.name" placeholder="请输入您的姓名" :custom-style="inputStyle" />
							</u-form-item>
							<u-form-item label="生日:" prop="birthday" :label-style="labelStyle" label-width="54px">
								<u-input v-model="form.birthday" :disabled="true" disabled placeholder="请输入出生年月日" :custom-style="inputStyle" />
								<!-- <u-picker mode="time" v-model="birthdayShow" :params="params" @confirm="birthdayConfirm"></u-picker> -->
							</u-form-item>
							<u-form-item label="民族:" prop="nation" :label-style="labelStyle" label-width="54px">
								<u-input v-model="form.nation" placeholder="请输入您的民族" :disabled="true" :custom-style="inputStyle" @click="nationShow= true" />
								<u-select v-model="nationShow" mode="single-column" :list="nationList" @confirm="nationConfirm"></u-select>
							</u-form-item>
							<u-form-item label="籍贯:" prop="native_place" :label-style="labelStyle" label-width="54px">
								<u-input v-model="form.native_place" :disabled="true" placeholder="请输入您的籍贯" :custom-style="inputStyle" />
							</u-form-item>
							<u-form-item label="地址:" prop="address" :label-style="labelStyle" label-width="54px">
								<u-input v-model="form.address" :disabled="true" placeholder="点击选择你的家庭住址" :custom-style="inputStyle" @click="choiceAddress" />
							</u-form-item>

						</u-form>
					</view>
				</view>
			</view>
		</view>
		<view class="app-footer">
			<view class="btn-box flexbox center middle">
				<button @click="submit" class="btn btn-primary">提交资料</button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		imgUploadUrl,
		postSaveInfo
	} from '../../utils/api.js';
	import addressList from '../../utils/address.js';
	export default {
		data() {
			return {
				form: {
					idcard_image_front: '',
					health_image_front: '',
					name: '',
					birthday: '', // 出生年月日
					nation: '',
					native_place: '',
					idcard: "",
					address: "",
					latitude: "",
					longitude: "",
					nanny_id:uni.getStorageSync('nanny_id')

				},
				birthdayShow: false,
				nationShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				rules: {
					name: [{
						required: true,
						message: '请输入您的姓名',
						trigger: ['change', 'blur'],
					}],
					birthday: [{
						required: true,
						message: '请输入您的年龄',
						trigger: ['change', 'blur'],
					}, ],
					nation: [{
						required: true,
						message: '请输入您的民族',
						trigger: ['change', 'blur'],
					}],
					address: [{
						required: true,
						message: '请选择你的家庭住址',
						trigger: ['change', 'blur'],
					}],
					native_place: [{
						required: true,
						message: '请输入您的籍贯',
						trigger: ['change', 'blur'],
					}],
					idcard: [{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.idCard(value);
							},
							message: '请输入正确的身份证号',
							// 触发器可以同时用blur和change
							trigger: ['blur'],
						},
						{
							required: true,
							message: '请输入您的身份证号码',
							trigger: ['change', 'blur'],
						}
					]

				},
				labelStyle: {
					"font-weight": 600,
					"font-size": "18px"
				},
				inputStyle: {
					"font-size": "18px"
				},
				nationList: [{
						value: 1,
						label: '汉族'
					},
					{
						value: 2,
						label: '蒙古族'
					},
					{
						value: 3,
						label: '回族'
					},
					{
						value: 4,
						label: '藏族'
					},
					{
						value: 5,
						label: '维吾尔族'
					},
					{
						value: 6,
						label: '苗族'
					},
					{
						value: 7,
						label: '彝族'
					},
					{
						value: 8,
						label: '壮族'
					},
					{
						value: 9,
						label: '布依族'
					},
					{
						value: 10,
						label: '朝鲜族'
					},
					{
						value: 11,
						label: '满族'
					},
					{
						value: 12,
						label: '侗族'
					},
					{
						value: 13,
						label: '瑶族'
					},
					{
						value: 14,
						label: '白族'
					},
					{
						value: 15,
						label: '土家族'
					},
					{
						value: 16,
						label: '哈尼族'
					},
					{
						value: 17,
						label: '哈萨克族'
					},
					{
						value: 18,
						label: '傣族'
					},
					{
						value: 19,
						label: '黎族'
					},
					{
						value: 20,
						label: '傈僳族'
					},
					{
						value: 21,
						label: '佤族'
					},
					{
						value: 22,
						label: '畲族'
					},
					{
						value: 23,
						label: '高山族'
					},
					{
						value: 24,
						label: '拉祜族'
					},
					{
						value: 25,
						label: '水族'
					},
					{
						value: 26,
						label: '东乡族'
					},
					{
						value: 27,
						label: '纳西族'
					},
					{
						value: 28,
						label: '景颇族'
					},
					{
						value: 29,
						label: '柯尔克孜族'
					},
					{
						value: 30,
						label: '土族'
					},
					{
						value: 31,
						label: '达翰尔族'
					},
					{
						value: 32,
						label: '么佬族'
					},
					{
						value: 33,
						label: '羌族'
					},
					{
						value: 34,
						label: '布朗族'
					},
					{
						value: 35,
						label: '撒拉族'
					},
					{
						value: 36,
						label: '毛南族'
					},
					{
						value: 37,
						label: '仡佬族'
					},
					{
						value: 38,
						label: '锡伯族'
					},
					{
						value: 39,
						label: '阿昌族'
					},
					{
						value: 40,
						label: '普米族'
					},
					{
						value: 41,
						label: '塔吉克族'
					},
					{
						value: 42,
						label: '怒族'
					},
					{
						value: 43,
						label: '乌孜别克族'
					},
					{
						value: 44,
						label: '俄罗斯族'
					},
					{
						value: 45,
						label: '鄂温克族'
					},
					{
						value: 46,
						label: '德昂族'
					},
					{
						value: 47,
						label: '保安族'
					},
					{
						value: 48,
						label: '裕固族'
					},
					{
						value: 49,
						label: '京族'
					},
					{
						value: 50,
						label: '塔塔尔族'
					},
					{
						value: 51,
						label: '独龙族'
					},
					{
						value: 52,
						label: '鄂伦春族'
					},
					{
						value: 53,
						label: '赫哲族'
					},
					{
						value: 54,
						label: '门巴族'
					},
					{
						value: 55,
						label: '珞巴族'
					},
					{
						value: 56,
						label: '基诺族'
					},

				]



			}
		},
		methods: {
			// 上传照片
			uploadImg(e) {
				// type: 1 - 正面，2 - 反面
				let type = e.currentTarget.dataset.type;
				uni.chooseImage({
					//限制上传照片数量
					count: 1,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFiles;
						if (tempFilePaths[0].size <= 2000000) {
							uni.uploadFile({
								url: imgUploadUrl,
								filePath: tempFilePaths[0].path,
								name: 'file',
								success: (res) => {
									let imageData = JSON.parse(res.data);
									if (type == 1) {
										this.form.idcard_image_front = imageData.data.url;
									} else {
										this.form.health_image_front = imageData.data.url;
									}
								}
							});
						}

					}
				})
			},
			birthdayConfirm(e) {
				this.form.birthday = e.year + '-' + e.month + '-' + e.day;
			},
			//选择民族确定事件
			nationConfirm(arr) {
				this.form.nation = arr[0].label

			},
			//身份证输入框失去焦点事件
			nativePlace() {
				let province = "";
				// let city = "";
				let provinceNum = this.form.idcard.slice(0, 2)
				let cityNum = this.form.idcard.slice(0, 4)
				for (let key in addressList.province_list) {
					if (provinceNum == key) {
						province = addressList.province_list[key]
					}

				}
				// for (let key in addressList.city_list) {
				// 	if (cityNum == key) {
				// 		city = addressList.city_list[key]
				// 	}

				// }
				this.form.native_place = province;

				var birthday = "";

				if (this.form.idcard.length == 15) {
					birthday = "19" + this.form.idcard.substr(6, 6);
				} else if (this.form.idcard.length == 18) {
					birthday = this.form.idcard.substr(6, 8);
				}

				this.form.birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
			},
			//跳转到地址选择页面
			choiceAddress() {
				let that = this
				uni.chooseLocation({
					success: function(res) {
						that.form.address = res.address + res.name;
						that.form.latitude = res.latitude;
						that.form.longitude = res.longitude;

						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			// 下一步操作
			submit() {
				if (this.form.idcard_image_front != "" && this.form.health_image_front != "") {
					this.$refs.uForm.validate(valid => {
						if (valid) {
							postSaveInfo(this.form).then(res => {
								console.log(res)
								if (res.code == 0) {
									
									uni.navigateTo({
										url: '../examine/examine?is_examine=' + "0"
									})
								} else {
									this.$refs.uToast.show({
										title: res.msg
									})
								}
							})
						} else {
							// this.$refs.uToast.show({
							// 	title: '请填写必要信息',
							// })
						}
					});
				} else {
					this.$refs.uToast.show({
						title: '请上传身份证/健康证正面',
					})
				}

			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.uni-input-placeholder {
		line-height: 70rpx !important;
	}

	.u-form-item {
		padding: 40rpx 0;
	}

	uni-page-body {
		height: 100%;
	}

	.app-body {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
	}

	.app-content {
		position: relative;
		width: 100%;
		height: calc(100% - 124rpx);
		overflow: hidden;
		overflow-y: scroll;
	}

	.container {
		width: 670rpx;
		margin: 0 40rpx;
		color: #202020;
	}

	.step-wrap {
		padding-top: 112rpx;
		padding-bottom: 70rpx;
	}

	.step-wrap .step-title {
		text-align: center;
		font-size: 48rpx;
		font-weight: 600;
	}
	.personal-box{
		display: flex;
		padding-left: 20rpx;
		.personal-title {
			font-size: 36rpx;
			font-weight: 600;
		}
		.personal-title:nth-child(2){
			margin-left: 128rpx;
		}
	}

	

	.personal-subtitle {
		font-size: 32rpx;
		color: #999999;
		margin-top: 12rpx;
		margin-bottom: 40rpx;
	}

	.personal-upload {
		margin-bottom: 50rpx;
	}

	.personal-upload-item {
		// width: 320rpx;
		// height: 206rpx;
		position: relative;

		.upload-bg {
			width: 320rpx;
			height: 206rpx;

		}

		.upload-postion {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			.upload-icon {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}

	.personal-form-item {
		padding: 40rpx 0;
		border-bottom: 2rpx solid #ededed;
	}

	.app-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	.btn-box {

		width: 100%;
		height: 124rpx;
		background-color: #fff;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
	}

	.btn-primary {
		width: 670rpx;
		height: 92rpx;
		border: none;
		color: #fff;
		border-radius: 46rpx;
		background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
	}
</style>
