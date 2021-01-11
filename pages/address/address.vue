<template>
	<web-view id="myMap" width="100%" height="100%"
            @message="getMes"
            src="../../html/map.html">
	</web-view>
</template>
<script>
	export default {
		data() {
			return {
				mapArr: [],
				
			}
		},
		onShow() {
			this.getAddress();
			this.createMap()
		},
		methods: {
			//获取当前位置经纬度
			getAddress() {
				let that = this

				uni.getLocation({
					type: 'wgs84',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					success: function(res) {
						that.mapArr = [res.longitude, res.latitude]
						console.log(that.mapArr)


					},
					fail: function() {
						uni.showToast({
							title: '获取地址失败，将导致部分功能不可用',
							icon: 'none'
						});
					}
				});


			},
			//生成地图
			createMap() {
				uni.chooseLocation({
					success: function(res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			getMes(res){
				console.log(res)
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
