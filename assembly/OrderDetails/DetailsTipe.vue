<template>
	<view>
		<u-modal v-model="show" :content="content" :show-title="false" :show-cancel-button="true" @confirm="confirm"></u-modal>
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
				content: '开始服务时间/地点异常，请确认是否与雇主达成一致',
				formData: {}
			}
		},
		methods: {
			open(text, data) {
				this.show = true;
				this.content = text
				this.formData = data
			},
			confirm() {
				postServicestart(this.formData).then(res => {
					console.log(res)
					if (res.code == 0) {
						if (res.data.list.start_end_status == 1) {
							this.$emit("getCountdown")
							this.$emit("confirmStart")
						} else {
							this.$refs.uToast.show({
								title: '服务开始失败',
							})
						}
					} else {
						console.log(res)
						this.$refs.uToast.show({
							title: res.msg,
						})
					}

				})
			}
		}
	}
</script>
