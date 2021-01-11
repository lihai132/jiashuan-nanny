<template>
	<view class="app-body">
		<view class="app-content">
			<view class="container">
				<view class="step-wrap step-block">
					<view class="step-title">上传个人资料(2/3)</view>
				</view>
				<view class="step-personal step-block">
					<view class="personal-title">上传健康证（正反面）</view>
					<view class="personal-subtitle">请上传健康证完善健康信息</view>
					<view class="personal-form">
						<view class="personal-upload flexbox justify">
							<view class="personal-upload-item flexbox center middle">
								<image class="upload-bg" :src="form.health_image_front == '' ? '../../static/personal/idcard-bg1.png' : form.health_image_front"
								 ></image>
								<view class="upload-postion">
									<image class="upload-icon" src="../../static/personal/icon-camera.png"  @click="uploadImg"
									 data-type="1"></image>
								</view>
							</view>
							<view class="personal-upload-item flexbox center middle">
								<image class="upload-bg" :src="form.health_image_back == '' ? '../../static/personal/health-bg2.png' : form.health_image_back"
								 ></image>
								<view class="upload-postion">
									<image class="upload-icon" src="../../static/personal/icon-camera.png"  @click="uploadImg"
									 data-type="2"></image>
								</view>
							</view>
						</view>
						<u-form :model="form" ref="uForm" :label-width="144">
							<u-form-item label="有效期:" :label-style="labelStyle" label-width="72px" prop="health_time_limit">
								<u-input @click="healthShow = true" v-model="form.health_time_limit" disabled placeholder="请输入您的健康证有效期" :custom-style="inputStyle"/>
								<u-picker v-model="healthShow" mode="time" :params="params" @confirm="healthConfirm"></u-picker>
							</u-form-item>
						</u-form>
					</view>
				</view>
			</view>
		</view>
		<view class="app-footer">
			<view class="btn-box flexbox center middle">
				<button @click="submit" class="btn btn-primary">下一步</button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		imgUploadUrl
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				form: {
					health_image_front: '',
					health_image_back: '',
					health_time_limit: ''
				},
				healthShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				rules: {
					health_time_limit: [{
						required: true,
						message: '请输入您的健康证有效期',
						trigger: ['change', 'blur'],
					}],
				},
				labelStyle: {
					"font-weight": 600,
					"font-size": "18px"
				},
				inputStyle:{
					"font-size": "18px"
				}
			}
		},
		methods: {
			healthConfirm(e) {
				this.form.health_time_limit = e.year + '-' + e.month + '-' + e.day;
			},
			// 上传照片
			uploadImg(e) {
				// type: 1 - 正面，2 - 反面
				let type = e.currentTarget.dataset.type;
				uni.chooseImage({
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
										this.form.health_image_front = imageData.data.url;
									} else {
										this.form.health_image_back = imageData.data.url;
									}
								}
							});
						} else {
							wx.showToast({
								title: "上传图片超过2M，无法上传！！", //标题
								icon: 'none' //图标 none不使用图标，详情看官方文档
							})
						}


					}
				})
			},
			// 下一步操作
			submit() {
				if(this.form.health_image_front!=""&&this.form.health_image_back!=""){
					this.$refs.uForm.validate(valid => {
						if (valid) {
							uni.setStorageSync('form2', JSON.stringify(this.form))
							uni.navigateTo({
								url: './step3'
							})
						} else {
							console.log('验证失败');
						}
					});
				}else{
					this.$refs.uToast.show({
						title: '请上传健康证正反面',
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
	/deep/.uni-input-placeholder{
		line-height: 70rpx !important;
	}
	.u-form-item{
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
		padding-top: 24rpx;
		padding-bottom: 70rpx;
	}

	.step-wrap .step-title {
		text-align: center;
		font-size: 48rpx;
		font-weight: 600;
	}

	.personal-title {
		font-size: 36rpx;
		font-weight: 600;
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
		position: relative;

		.upload-bg {
			width: 320rpx;
			height: 206rpx;
		}

		.upload-postion {
			position: absolute;
			top: 50%;
			left: 50%;
			transform:translate(-50%,-50%);

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
	.app-footer{
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
