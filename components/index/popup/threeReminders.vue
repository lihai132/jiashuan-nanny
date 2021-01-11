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
				content: '三次拒单后，将不再在该时间段派单确认拒单？'
			}
		},
		methods: {
			open() {
				this.show = true;
			},
			confirm(){
				this.$emit("reason")
			}
		}
	}
</script>