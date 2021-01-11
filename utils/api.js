import config_url from './config.js';
import request  from './request.js';

export const imgUploadUrl = config_url + '/uploadfile/upload';										// 上传图片

export const login = params => request('login/login', 'post', params);								// 登录

export const smsode = params => request('login/smscode', 'post', params);							// 发送注册登录验证码

export const getversion = params => request('login/getversion', 'post', params);					// 获取版本号

export const postSaveInfo = params => request('user/postsaveinfo', 'post', params);					// 完善个人资料

export const getUserInfo = params => request('user/getuserinfo', 'post', params);					// 我的

export const postSaveAuto = params => request('user/postsaveauto', 'post', params);					// 更新系统自动接单设置

export const postLeave = params => request('user/postleave', 'post', params);						// 请假

export const getLeaveList = params => request('user/getleavelist', 'post', params);					// 查看请假记录

export const postCancel = params => request('user/postcancel', 'post', params);						// 取消请假

export const getAcceptList = params => request('order/getacceptlist', 'post', params);				// 获取接单列表

export const postAcceptAgree = params => request('order/postacceptagree', 'post', params);			// 接单

export const postAcceptRefuse = params => request('order/postacceptrefuse', 'post', params);		// 不接单

export const postServicedayscount = params => request('service/servicedayscount', 'post', params);	// 获取本月有订单的日期

export const postServicedayslist = params => request('service/servicedayslist', 'post', params);	// 获取当前日期的订单列表

export const postServicedetails = params => request('service/servicedetails', 'post', params);	// 订单详情

export const postCountdown = params => request('service/countdown', 'post', params);	// 倒计时

export const postServicestatus = params => request('service/servicestatus', 'post', params);	// 查询服务开始时否是异常

export const postServicestart = params => request('service/servicestartend', 'post', params);	// 服务开始和结束接口

export const getevaluate = params => request('service/getevaluate', 'post', params);	// 自查问题接口

export const postAddserviceevaluate = params => request('service/addserviceevaluate', 'post', params);	// 提交自查

export const getserviceevaluate = params => request('service/getserviceevaluate', 'post', params);	// 查询服务自查记录

export const getoption = params => request('service/getoption', 'post', params);	// 获取菜系

export const bill = params => request('shouru/bill', 'post', params);	// 工资

export const billlist = params => request('shouru/billlist', 'post', params);	// 工资详情列表

