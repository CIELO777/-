import { post1 } from './https'
import {
	generateTimeout,
	generateNonce,
} from "./tools";
let timeout = generateTimeout();
import sha1 from "./sha1";
let nonce = generateNonce();
let AgentConfig = {
	signature2: '',
	jsapi2: '',
	noncestr2: '',
	appid2: '',
	timestamp2: ''
}
let wxJSjdk = {
	appId: '',
	noncestr: '',
	timestamp: '',
}
let single_chat = false; // 判断用户是否是从单聊对话进入。通过此参数去限制用户是否单聊打开
let getAgentConfig = () => {
	let param = new URLSearchParams();
	let url = location.href.split("#")[0];
	let itrId = JSON.parse(sessionStorage.getItem("userinfo"))?.id;
	param.append("timeout", timeout / 1000);
	param.append("nonce", nonce);
	param.append("url", url);
	param.append("type", 2); // 为2的时候拉去的是
	param.append("itrId", itrId);
	post1("/wx-crm-server/wx/js_api_ticket/auth", param)
		.then((res) => {
			let str1 =
				"jsapi_ticket=" +
				res.jsapi_ticket +
				"&noncestr=" +
				nonce +
				"&timestamp=" +
				timeout / 1000 +
				"&url=" +
				url;
			AgentConfig.jsapi2 = res.jsapi_ticket; // 这个值是拉取的值agentConfig 值
			AgentConfig.timestamp2 = timeout / 1000;
			AgentConfig.noncestr2 = nonce;
			AgentConfig.signature2 = sha1.hex_sha1(str1);
			AgentConfig.appid2 = res.appId;
		})
		.catch((err) => {
			// alert(err);
		});
}

let getWxJsJdk = () => {
	let param = new URLSearchParams();
	let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
	param.append("timeout", timeout);
	param.append("nonce", nonce);
	param.append("url", "wxa.jiain.net");
	param.append("type", 1);
	param.append("itrId", itrId);
	post1("/wx-crm-server/wx/js_api_ticket/auth", param)
		.then((res) => {
			wxJSjdk.appId = res.appId;
			wxJSjdk.noncestr = nonce;
			wxJSjdk.timestamp = timeout / 1000;
			let url = location.href.split("#")[0];
			let str1 =
				"jsapi_ticket=" +
				res.jsapi_ticket +
				"&noncestr=" +
				AgentConfig.noncestr2 +
				"&timestamp=" +
				AgentConfig.timestamp2 +
				"&url=" +
				url;
			let signature = sha1.hex_sha1(str1);
			wx.config({
				beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: res.appId, // 必填，企业微信的corpID
				timestamp: wxJSjdk.timestamp, // 必填，生成签名的时间戳
				nonceStr: wxJSjdk.noncestr, // 必填，生成签名的随机串
				signature: signature, // 必填，签名，见附录1
				jsApiList: ["agentConfig", "selectExternalContact", 'openEnterpriseChat'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(() => {
				// wx.hideAllNonBaseMenuItem();
				// wx.hideOptionMenu();
				wx.hideMenuItems({
					menuList: ['menuItem:share:appMessage', 'menuItem:share:wechat', 'menuItem:copyUrl', 'menuItem:openWithSafari', 'menuItem: refresh'] // 要隐藏的菜单项
				});
				wx.agentConfig({
					corpid: AgentConfig.appid2, // 必填，企业微信的corpid，必须与当前登录的企业一致
					agentid: res.agentId, // 必填，企业微信的应用id （e.g. 1000247）
					timestamp: AgentConfig.timestamp2, // 必填，生成签名的时间戳
					nonceStr: AgentConfig.noncestr2, // 必填，生成签名的随机串
					signature: AgentConfig.signature2, // 必填，签名，见附录-JS-SDK使用权限签名算法
					jsApiList: ["sendChatMessage", 'getContext'], //必填
					success: (res) => {
						console.log(res, 'getCOntext');
						wx.invoke('getContext', { // 判断用户从哪个页面进入
						}, (res) => {
							if (res.err_msg == "getContext:ok") {
								if (res.entry == 'single_chat_tools') {
									single_chat = true
								}
							} else {
								//错误处理
								console.log(res, '出错了')
							}
						});
					},
					fail: function (res) {
						console.log(res, '失败');
						if (res.errMsg.indexOf("function not exist") > -1) {
						}
					},
				});
			});
			wx.error(function (res) {
			});
		})
		.catch((err) => {
			console.log(err);
		});
}
export default function name() {
	getAgentConfig();
	getWxJsJdk();
	// return single_chat;
};
