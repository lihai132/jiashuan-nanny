<template>
	<view>
		<u-modal v-model="show" :content="content" :show-title="false" :show-cancel-button="false" @confirm="confirm"></u-modal>
		
	</view>
</template>
	
<script>
	export default {
		data() {	
			return {
				show: false,
				content: '发现新版本，请更新'
			}
		},
		methods: {
			open() {
				this.show = true;
			},
			confirm(){
				
				this.$emit("doUpData")
			}
		}
	}
</script>