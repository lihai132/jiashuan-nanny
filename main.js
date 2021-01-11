import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);

import store from './store'

// 封装全局登录函数
Vue.prototype.checkLogin = function() {
	const token = uni.getStorageSync('token');
	if (token === '') {
		uni.reLaunch({url:'/pages/login/login'});
		return false;
	} else {
		return true;
	}
}

//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	//挂载
	store
})
app.$mount()
