/*
 * @Author: Tian 
 * @Date: 2021-07-02 15:18:13 
 * @Last Modified by: Tian
 * @Last Modified time: 2021-08-02 10:58:21
 * 公共微信授权接口。项目全部授权接口全部走此授权（客户画像比较特殊单独走了一个）
 */
import { get } from './https';
import { Toast } from 'vant';
import {
	generateTimeout,
	generateNonce
} from "./tools";
let timeout = generateTimeout();
import sha1 from "./sha1";
let nonce = generateNonce();
import router from '../router/index';
// console.log(router,11111111111111)

let getWxJsJdk = () => {
	let { id, bind_comp_id } = JSON.parse(sessionStorage.getItem("userinfo"));
	let { suiteId } = JSON.parse(sessionStorage.getItem("codeBasice"));
	let param = {
		itrId: id,
		compId: bind_comp_id,
		suiteId: suiteId,
	}
	get("/work/wx/js_api_ticket/auth", { params: param })
		.then((res) => {
			if (res.code === 200 && res.msg == 'success') {
				let url = location.href.split("#")[0];
				let config = { // config授权参数
					appId: sessionStorage.getItem('CorpId'),
					timestamp: timeout / 1000,
					nonceStr: nonce,
					signature: sha1.hex_sha1("jsapi_ticket=" +
						res.data.corpTicket +
						"&noncestr=" +
						nonce +
						"&timestamp=" +
						timeout / 1000 +
						"&url=" +
						url)
				}
				let agentConfig = {  // angetConfig 授权参数
					agentid: res.data.agentId,
					signature: sha1.hex_sha1("jsapi_ticket=" +
						res.data.agentTicket +
						"&noncestr=" +
						nonce +
						"&timestamp=" +
						timeout / 1000 +
						"&url=" +
						url)
				}
				wx.config({
					beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: config.appId, // 必填，企业微信的corpID
					timestamp: config.timestamp, // 必填，生成签名的时间戳
					nonceStr: config.nonceStr, // 必填，生成签名的随机串
					signature: config.signature, // 必填，签名，见附录1 "agentConfig"
					jsApiList: ['agentConfig', 'closeWindow', "selectExternalContact", 'openEnterpriseChat', 'getCurExternalContact'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(() => {
					wx.hideOptionMenu();
					console.log('wx.hideOptionMenu()')
					// wx.hideMenuItems({
					// 	menuList: ['menuItem:share:appMessage', 'menuItem:share:wechat', 'menuItem:copyUrl', 'menuItem:openWithSafari', 'menuItem: refresh'] // 要隐藏的菜单项
					// });

					wx.agentConfig({
						corpid: config.appId, // 必填，企业微信的corpid，必须与当前登录的企业一致
						agentid: agentConfig.agentid, // 必填，企业微信的应用id （e.g. 1000247）
						timestamp: config.timestamp, // 必填，生成签名的时间戳
						nonceStr: config.nonceStr, // 必填，生成签名的随机串
						signature: agentConfig.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
						jsApiList: ["sendChatMessage", 'getContext', 'getCurExternalContact'], //必填
						success: (res) => {
							wx.invoke('getContext', {
							}, function (res) {
								if (res.err_msg.includes('ok')) {
									if (res.entry === 'group_chat_tools') {
										// Toast.fail({
										// 	message: '外部群不支持营销素材功能',
										// 	forbidClick: true,
										// 	duration: 0,
										// 	overlay: true,
										// });
										// reject('客户ID获取失败，请稍后再试...');
									} else {
										// alert(router.history._startLocation.includes("colorPage"))
										// alert(router.history._startLocation)
										if (router.history._startLocation.includes("colorPage")) { // 只有分享获取外部联系人ID٩( 'ω' )و 
											wx.invoke('getCurExternalContact', {
											}, (res) => {
												console.log(res, 'getCurExternalContact')
												if (res.err_msg == "getCurExternalContact:ok") {
													sessionStorage.setItem('wxcrmId', res.userId)
												} else {
													Toast.fail({
														message: res.err_msg,
														forbidClick: true,
														duration: 0,
														overlay: true,
													});
												}
											});
										}

									}
								} else {
									Toast.fail({
										message: '授权失败，请重试',
										forbidClick: true,
										duration: 0,
										overlay: true,
									});
								}
							});
						},
						fail: (res) => {
							Toast.fail(res);
							if (res.errMsg.indexOf("function not exist") > -1) {
							};
						},
					});
				});
				wx.error((res) => {
					console.log('22222222res', res);
				});
			}
		})
		.catch((err) => {
			console.log(err, 'asjkdaskdh');
		});
}
export default getWxJsJdk;
