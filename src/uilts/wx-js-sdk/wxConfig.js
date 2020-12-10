import { post1 } from "../https";

import {
	generateTimeout,
	generateNonce,
	generateSignature3,
	generateSignature,
	generateSignature4,
} from "../tools";
import sha1 from "../sha1";
let timeout = generateTimeout() / 1000;
let nonce = generateNonce();
// console.log(wx);
//  生成 签名
let setsignature = (jsapi, noncestr, timestamp, url) => {
	let str1 =
		"jsapi_ticket=" +
		jsapi +
		"&noncestr=" +
		noncestr +
		"&timestamp=" +
		timestamp +
		"&url=" +
		url;
	return sha1.hex_sha1(str1);
};
// wx.config
// const initConfig = new Promise((resolve, reject) => {
// 	// wx.config api
// 	let param = new URLSearchParams();
// 	let url = location.href.split("#")[0];
// 	let itrId = JSON.parse(sessionStorage.getItem("userinfo"))?.id;
// 	param.append("timeout", timeout);
// 	param.append("nonce", nonce);
// 	param.append("url", url);
// 	param.append("type", 1);
// 	param.append("itrId", itrId);
// 	post1("/wx-crm-server/wx/js_api_ticket/auth", param)
// 		.then((res) => {
// 			let signature = setsignature(res.jsapi_ticket, nonce, timeout, url);
// 			wx.config({
// 				beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
// 				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
// 				appId: res.appId, // 必填，企业微信的corpID
// 				timestamp: timeout, // 必填，生成签名的时间戳
// 				nonceStr: nonce, // 必填，生成签名的随机串
// 				signature: signature, // 必填，签名，见附录1
// 				jsApiList: ["agentConfig", "selectExternalContact"], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
// 			});
// 			wx.ready(() => {
// 				resolve();
// 			});
// 			wx.error((res) => {
// 				reject(res);
// 			});
// 		})
// 		.catch((err) => {
// 			console.log("dfsffsf");
// 			reject(err);
// 		});
// });
// wx.wxAgentConfig
// const wxAgentConfigs = new Promise((resolve, reject) => {
// 	// wx.config api
// 	let param = new URLSearchParams();
// 	let url = location.href.split("#")[0];
// 	let itrId = JSON.parse(sessionStorage.getItem("userinfo"))?.id;
// 	param.append("timeout", timeout);
// 	param.append("nonce", nonce);
// 	param.append("url", url);
// 	param.append("type", 2); // jsapi_ticke参数 config 和AgentConfig 不一样。type2 是正确的wxAgentConfig
// 	param.append("itrId", itrId);
// 	post1("/wx-crm-server/wx/js_api_ticket/auth", param)
// 		.then((res) => {
// 			let signature = setsignature(res.jsapi_ticket, nonce, timeout, url);
// 			wx.agentConfig({
// 				corpid: res.appId, // 必填，企业微信的corpid，必须与当前登录的企业一致
// 				agentid: "1000061", // 必填，企业微信的应用id （e.g. 1000247）
// 				timestamp: timeout, // 必填，生成签名的时间戳
// 				nonceStr: nonce, // 必填，生成签名的随机串
// 				signature: signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
// 				jsApiList: ["selectExternalContact"], //必填
// 				success: function (res) {
// 					resolve(res);
// 				},
// 				fail: function (res) {
// 					if (res.errMsg.indexOf("function not exist") > -1) {
// 						reject(res);
// 					}
// 				},
// 			});
// 		})
// 		.catch((err) => {
// 			reject(err);
// 		});
// });

function initWxConfig() {
	return initConfig;
}
function wxAgentConfig() {
	return wxAgentConfigs;
}
export { initWxConfig, wxAgentConfig };
