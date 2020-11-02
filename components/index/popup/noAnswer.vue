<template>
	<view>
		<u-modal v-model="show" :content="content" :show-title="false" :show-cancel-button="true" @confirm="confirm"></u-modal>
		
	</view>
</template>
	
<script>
	export default {
		data() {	
			return {
				show: false,
				content: '确定不接这单吗？'
			}
		},
		methods: {
			open() {
				this.show = true;
			},
			confirm(){
				console.log(111)
				this.$emit("reason")
			}
		}
	}
</script>