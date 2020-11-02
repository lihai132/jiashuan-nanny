// process.env.NODE_ENV 
let url_config = '';


if (process.env.NODE_ENV == 'development') {
	//测试环境
	// url_config = 'https://nannyapi.yishenjr.cn';
	
	//正式环境
	// url_config = 'https://nannyapi.top0530.top';
	
	//新域名
	url_config = 'https://nannyapi.jshuan.cn';
} else {
	//测试环境
	// url_config = 'https://nannyapi.yishenjr.cn';
	
	//正式环境
	url_config = 'https://nannyapi.jshuan.cn';
}

export default url_config