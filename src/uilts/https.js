import axios from "axios";
import QS from 'qs'
let userInfo = sessionStorage.getItem('userinfo');
const instance = axios.create();
// 请求前做拦截，用于判断
const requestInterceptor = instance.interceptors.request.use(
	(config) => {
		if (config.url.indexOf("upload") !== -1) {
		} else if (config.url.indexOf("sms") !== -1 || config.url.indexOf("login") !== -1) {
			config.headers['Company-Id'] = 0; //如果本地里面有用户数 据，请求头带comp参数
		} else {
			if (sessionStorage.getItem('CompIdFriend')) { // 朋友圈请求头
				config.headers['Company-Id'] = sessionStorage.getItem('CompIdFriend');
			} else {  // 正常请求头
				let userInfo = process.env.VUE_APP_ENV === 'production' ? JSON.parse(sessionStorage.getItem('userinfo'))?.bind_comp_id || JSON.parse(sessionStorage.getItem("RouteQuery"))?.compId : 40007760
				if (userInfo) {
					config.headers['Company-Id'] = userInfo; //如果本地里面有用户数据，请求头带comp参数
				} else {
					config.headers['Company-Id'] = 0; //如果本地里面有用户数据，请求头带comp参数
				}
			}
			// || JSON.parse(sessionStorage.getItem('RouteQuery'))?.compId；
		}
		// console.log(config.headers['Company-Id'], 'config.headers');
		return config;
	},
	(error) => {
		// 立即执行失败的reject方法
		return Promise.reject(error);
	}
);

// 响应后做拦截，用于修改响应数据
const responseInterceptor = instance.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		// console.log('对响应数据做点什么',response)
		return response;
	},
	(error) => {
		// 立即执行响应的reject方法
		return Promise.reject(error);
	}
);

function get(url, params = {}) {
	return new Promise((resolve, reject) => {
		instance.get(url, params, {
			headers: { 'Content-Type': 'application/json' }
		}
		).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err.data)
		})
	});
}
function post(url, data) {
	return new Promise((resolve, reject) => {
		instance.post(
			url,
			data,
			{ headers: { 'Content-Type': 'multipart/form-data' }, processData: false, contentType: false, cache: false, async: false, }
		)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	});
}
// , {
// 	headers: {
// 		'content-type': 'application/x-www-form-urlencoded'
// 	}
// }
function post1(url, param) {
	return new Promise((resolve, reject) => {
		instance.post(url, param)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err)
			})
	})
}
export { get, post, post1 }