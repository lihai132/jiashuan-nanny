import config from './config.js';
import md5 from './md5.js';

// 签名密钥
let key = '123456789acdefghigklmnopqrstuvwsyz!@#$%^&*()';

/**
 * 排序函数
 **/
function objKeySort(obj) {
	//对参数进行排序
	var newkey = Object.keys(obj).sort();
	//创建一个新的对象，用于存放排好序的键值对
	var newObj = {};
	//遍历newkey数组
	for (var i = 0; i < newkey.length; i++) {
		//向新创建的对象中按照排好的顺序依次增加键值对
		newObj[newkey[i]] = obj[newkey[i]];
	}
	//格式化参数格式化成url参数
	var buff = "";
	for (var j = 0; j < newkey.length; j++) {
		var k = newkey[j]
		var v = newObj[k]
		if(Array.isArray(v)){
      		v = v.toString();
    	}
		if (v != "sign" && v != "") {
			buff = buff + k + "=" + v + "&";
		}
	}
	//去除首尾&字符
	buff = buff.replace(/^(\s|&)+|(\s|&)+$/g, '')
	return buff;
}
// 封装请求
function request(url, method, params) {
	// 为请求参数附加上token
	params['token'] = uni.getStorageSync('token') || '';
	
	// 获取加密字符串
	var string = objKeySort(params);
	// 在string后加入KEY
	string = string + "&key=" + key;
	// md5加密得到签名
	string = md5.md5(string);
	// 所有字符转为大写
	string = string.toLocaleUpperCase();
	// 为请求参数附加上sign
	params['sign'] = string;
	  
	return new Promise((resolve, reject) => {
		// uni.showLoading({
		// 	title: '加载中...'
		// })

		uni.request({
			url: config + '/' + url,
			method: method,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: params,
			success: (res) => {
				if (res.data.code == 10003) {
					uni.redirectTo({
						url: '/pages/login/login'
					})
					return
				}
				resolve(res.data)
			},
			fail: (err) => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}
export default request