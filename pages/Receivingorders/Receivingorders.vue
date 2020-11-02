<template>
	<view class="Receivingorders">
		<view class="Receivingorders-head">
			<view class="Receivingorders-head-title">
				接单
			</view>
		</view>
		<view class="Receivingorders-nav">
			<view class="Receivingorders-nav-list">
				<view class="Receivingorders-nav-list-item">
					

				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: '接单'
			});

		},
		methods: {

		}
	}
</script>
<style>
	.uni-page-body {
		height: 100%;
		margin: 0;
	}
</style>

<style lang="scss" scoped>
	.Receivingorders {

		height: 100%;
		background: #F5F5F5;
		display: flex;
		flex-direction: column;


		.Receivingorders-head {
			width: 100%;
			height: 88upx;
			background-color: #fff;

			.Receivingorders-head-title {
				margin-left: 40upx;
				font-size: 36upx;
				line-height: 88upx;
				font-weight: 500;
				color: #1A1A1A;
			}
		}

		.Receivingorders-nav {
			flex: 1;
			overflow: scroll;

		}
	}
</style>
