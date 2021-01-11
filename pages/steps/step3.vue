<template>
	<view class="app-body">
		<view class="app-content">
			<view class="container">
				<view class="step-wrap step-block">
					<view class="step-title">上传个人资料(3/3)</view>
				</view>
				<view class="step-form">
					<view class="step-form-item">
						<view class="step-form-item-title">
							<view class="title">擅长菜系（3选）</view>
							<view class="subtitle">请选择你擅长的菜系</view>
						</view>
						<view class="items-wrap flexbox left wrap">
							<view class="items" :class="{on: item.isSelected}" v-for="(item, index) in flavorList" :key="index" @click="itemSelect(item,index)">{{item.title}}</view>
						</view>
					</view>
					<view class="step-form-item">
						<view class="step-form-item-title">
							<view class="title">上传形象照（1张）</view>
						</view>
						<view class="upload-wrap">
							<view class="upload-item" v-if="form.headimgurl != ''">
								<view class="btn-close">
									<image src="../../static/personal/icon-close.png"  @click="closeBtn"></image>
								</view>
								<image class="jsa-img" :src="form.headimgurl" ></image>
							</view>
							<view class="btn-upload flexbox center middle" @click="uploadImg" data-type="1" v-if="uploadShow">
								<image src="../../static/personal/icon-camera1.png" ></image>
							</view>
						</view>
					</view>
					<view class="step-form-item" style="margin-top: 70rpx;">
						<view class="step-form-item-title">
							<view class="title">上传展示照片（3张）</view>
						</view>
						<view class="upload-wrap">
							<view class="flexbox wrap">
								<view class="upload-item" v-for="(item, index) in imageList" :key="index">
									<view class="btn-close">
										<image src="../../static/personal/icon-close.png"  @click="closeItem(index)"></image>
									</view>
									<image class="jsa-img" :src="item" ></image>
								</view>
								<view class="btn-upload flexbox center middle" @click="uploadImg" data-type="2" v-if="this.imageList.length <3">
									<image src="../../static/personal/icon-camera1.png" ></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="app-footer">
			<view class="btn-box flexbox center middle">
				<button @click="submit" class="btn btn-primary">立即提交</button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		imgUploadUrl,
		postSaveInfo,
		getoption
	} from '../../utils/api.js';
	export default {
		data() {
			return {
				form: {
					nanny_id: wx.getStorageSync('nanny_id'),
					cuisine: [],
					headimgurl: '',
					spread_image: [],

				},
				imageList: [],
				flavorList: [{
						title: '川菜',
						isSelected: false
					},
					{
						title: '粤菜',
						isSelected: false
					},
					{
						title: '湘菜',
						isSelected: false
					},
					{
						title: '鲁菜',
						isSelected: false
					},
					{
						title: '浙菜',
						isSelected: false
					},
					{
						title: '苏菜',
						isSelected: false
					},
					{
						title: '闽菜',
						isSelected: false
					},
					{
						title: '徽菜',
						isSelected: false
					},
				],
				arr: [],
				uploadShow:true
			}
		},
		onLoad() {
			getoption({}).then(res => {
				let list = res.data.flavor;
				list.map(item => {
					item.isSelected = false
				})
				this.flavorList = list
			})
		},
		methods: {
			// 选择菜系
			itemSelect(data, index) {
				if (data.isSelected == false) {
					if (this.arr.length <= 2) {
						this.flavorList[index].isSelected = !this.flavorList[index].isSelected;
						this.arr.push(data.id);
						this.form.cuisine = this.arr;
						console.log(this.form.cuisine)
					} else {

					}
				} else {
					this.flavorList[index].isSelected = !this.flavorList[index].isSelected;
					this.form.cuisine.map((item, index) => {
						if (item == data.id) {
							this.form.cuisine.splice(index, 1)
						}
					})
					// console.log(this.form.cuisine)


				}






			},
			// 上传照片
			uploadImg(e) {
				// type: 1 - 头像，2 - 个人展示
				let type = e.currentTarget.dataset.type;
				if (type == 1) {
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
										this.form.headimgurl = imageData.data.url;
										this.uploadShow=false
									}
								});
							}else{
								wx.showToast({
									title: "上传图片超过2M，无法上传！！", //标题
									icon: 'none' //图标 none不使用图标，详情看官方文档
								})
							}

						}
					})
				} else {
					uni.chooseImage({
						count: 3,
						sizeType: ['compressed'],
						success: (chooseImageRes) => {
							// console.log(chooseImageRes)
							const tempFilePaths = chooseImageRes.tempFiles;
							let urlArr = []
							tempFilePaths.map((item, index) => {
								// console.log(item)
								if (item.size <= 2000000) {
									// console.log(item.size <= 2000000)
									uni.uploadFile({
										url: imgUploadUrl,
										filePath: item.path,
										name: 'file',
										success: (res) => {
											let imageData = JSON.parse(res.data);
											// console.log(imageData.data.url)
											this.imageList.push(imageData.data.url);

										}
									});

								} else { //图片大于2M，弹出一个提示框
									// console.log(item.size >= 2000000)
									wx.showToast({
										title: "第" + (index + 1) + "张图片超过2M，无法上传！！", //标题
										icon: 'none' //图标 none不使用图标，详情看官方文档
									})
								}

							})
							
						}
					})
				}
				console.log(this.imageList)

			},
			// 删除上传形象照
			closeBtn() {
				this.form.headimgurl = ''
			},
			// 删除上传展示照片
			closeItem(index) {
				this.form.spread_image.splice(index, 1);
			},
			// 提交
			submit() {
				// console.log(this.form.spread_image)
				let text = ""
				this.imageList.map(item => {
					text += item + ","
				})
				this.form.spread_image = text.slice(0, text.length - 1)
				// console.log(this.imageList)
				// console.log(this.form.spread_image)
				if (this.form.cuisine.length == 0) {
					this.$refs.uToast.show({
						title: '请选择你擅长的菜系'
					})
				} else if (this.form.headimgurl == '') {
					this.$refs.uToast.show({
						title: '请上传形象照'
					})
				} else if (this.form.spread_image.length == 0) {
					this.$refs.uToast.show({
						title: '请上传展示照片'
					})
				} else {
					// console.log(222)
					console.log(this.form.spread_image);
					let form1 = JSON.parse(uni.getStorageSync('form1'));
					let form2 = JSON.parse(uni.getStorageSync('form2'));
					let formData = Object.assign(this.form, form1, form2)
					console.log(formData)
					postSaveInfo(formData).then(res => {
						// console.log(res);
						if (res.code == 0) {
							uni.removeStorageSync('form1');
							uni.removeStorageSync('form2')
							uni.navigateTo({
								url: '../examine/examine?is_examine=' + "0"
							})
						} else {
							console.log(res);
						}
					})
				}
			}
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

	.jsa-img {
		width: 202upx;
		height: 202upx;
		border-radius: 12upx;
		z-index: 1;
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

	.step-form {
		margin-bottom: 50rpx;
	}

	.step-form-item {
		.step-form-item-title {
			margin-bottom: 40rpx;

			.title {
				height: 50rpx;
				line-height: 50rpx;
				font-size: 36rpx;
				color: #202020;
				font-weight: 600;
			}

			.subtitle {
				font-size: 32rpx;
				color: #999;
				height: 44rpx;
				line-height: 44rpx;
				margin-top: 12rpx;
			}
		}
	}

	.items-wrap {
		margin-bottom: 40rpx;

		.items {
			width: 150rpx;
			height: 70rpx;
			line-height: 70rpx;
			color: #51575D;
			font-size: 30rpx;
			text-align: center;
			background: #f2f2f4;
			border-radius: 12rpx;
			margin-right: 23rpx;
			margin-bottom: 30rpx;
		}

		.items:nth-child(4n) {
			margin-right: 0;
		}

		.items.on {
			background: linear-gradient(90deg, #FFBB9F 0%, #FF8666 100%);
			color: #fff;
		}
	}

	.upload-wrap {
		.upload-item {
			position: relative;
			margin-right: 32rpx;
			margin-bottom: 30rpx;
			width: 202rpx;
			height: 202rpx;
			background-color: #f6f6f6;
			border-radius: 16rpx;

			.btn-close {
				position: absolute;
				top: 16rpx;
				right: 16rpx;

				image {
					z-index: 2;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.upload-item:nth-child(3n) {
			margin-right: 0;
		}

		.btn-upload {
			width: 202rpx;
			height: 202rpx;
			background-color: #f6f6f6;
			border-radius: 16rpx;

			image {
				width: 80rpx;
				height: 72rpx;
			}
		}
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
