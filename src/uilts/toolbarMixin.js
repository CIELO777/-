/*
 * @Author: YUN_KONG 
 * @Date: 2021-04-27 11:13:08 
 * @Last Modified by: Tian
 * @Last Modified time: 2021-07-13 18:24:25
 * 聊天工具栏素材分享功能组件，
 */

import { generateSignature3, generateTimeout, generateNonce } from './tools'
let timeout = generateTimeout();
import sha1 from "./sha1";
import local from './localStorage';
let nonce = generateNonce();
export const Toolbar = {
	data() {
		return {
			UserId: '',
			open_userid: '',
			CorpId: '',
			Single: false,
			compId: '',
			show: false,
			accomplish: false,
			imgSrc: '',
			login2: {
				code: {}
			},
			open_userid: '',
			UI: '0',
			CI: '',
		}
	},
	inject: ['registerOpen'],
	async created() {
		let url = window.location.href;
		let urlparame = window.location.search; //通过location.href获取code 和suiteId;
		// console.log(sessionStorage.getItem('userinfo'), 'sessionStorage.getIteuserinfo')
		if (sessionStorage.getItem('userinfo')) { // 通过userinfo字段判断是从哪个接口进入的
			if (this.$route.name !== 'ChatCustomer' && this.$route.name !== 'HaiRing') { // 客户画像模块不需要 执行如下方法
				this.loading()
				await this.getTabList();  // 存在就是从第三方应用进入的，没有存在就是从通讯录进入的
				await this.getList();
			} else if (this.$route.name === 'HaiRing') { // 朋友圈逻辑
				this.masking = '';
				this.loading();
				this.getList();
				// this.initMineInfo(); // 头像,背景墙,
			}
		} else {
			if (this.$route.name == 'HaiRing') { // 朋友圈授权比较特殊，单独处理
				let code = this.$route.query.code;
				if (sessionStorage.getItem('codeBasice')) {// 如果存在 
					let { compId, userId } = JSON.parse(sessionStorage.getItem('codeBasice'))
					this.UI = userId;
					this.CI = compId;
				};
				if (code) {
					this.getList();  //推送
					this.haringUser(code);
				} else {
					this.login2.code = this.urlcut(urlparame); // 将suiteId 和 code 信息储存 data 中
					sessionStorage.setItem("codeBasice", JSON.stringify(this.login2.code));
					let { compId, userId } = this.login2.code;
					let env = process.env.VUE_APP_ROUTE
					let urljoin = 'https://wxa.jiain.net' + env + 'haiRing?compId=' + compId + '&userId=' + userId;
					let url = encodeURI(urljoin)
					location.href = 'https://wxa.jiain.net/work/mp/authorize?url=' + url + '&compId=' + compId;
				}
			} else { // 聊天工具栏normal
				if (url.includes('suiteId') && url.includes('code')) { //如果有参数请求信息
					this.login2.code = this.urlcut(urlparame); // 将suiteId 和 code 信息储存 data 中
					sessionStorage.setItem("codeBasice", JSON.stringify(this.login2.code))
					this.getUserinfo()
				} else {
					this.$toast('url有误,请检查配置。')
				}
			}
		}
	},
	methods: {
		async getUserinfo() {
			// 获取用户信息
			let that = this;
			await this.$get("/work/wx/get/userinfo", {
				params: {
					code: this.login2?.code?.code,
					suiteId: this.login2?.code?.suiteId,
					ticket: 1,
				},
			}).then(
				async (res) => {
					if (res.code === 200 && res.msg == 'success' && JSON.stringify(res.data) != "{}") {
						// openid 和wxid 都存在在发送请求，请求用户信息
						this.UserId = res.data.userId;
						this.compId = res.data.compId;  // 会话存储后的公司ID  不可变更
						this.open_userid = res.data.open_userid;
						this.CorpId = res.data.corpId;
						await sessionStorage.setItem('bind_UserID', res.data.userId);
						sessionStorage.setItem('bind_compId', res.data.compId);
						sessionStorage.setItem("openId", that.open_userid); // 保存openID 解绑用
						sessionStorage.setItem("CorpId", res.data.corpId); // 保存openID 解绑用
						if (res.data.user) { // itr 那么就缓存itr数据
							// console.log(2131231,res.data.user)
							if (res.data.compId === 0 || !res.data.compId) { // 通过compID判断当前是否绑定了联系人。
								// 没有绑定
								this.$toast.clear();
								this.registerOpen();
							} else {    // 如果不等于0 && 存在 那么就拉取数据
								let a = { ...res.data.user, bind_comp_id: this.compId, bind_comp_id1: res.data.user.bind_comp_id };
								sessionStorage.setItem("userinfo", JSON.stringify(a)); // 公司id 存入本地；
								localStorage.clear(); // 如果拉去到的话，那么就清除他的值
								console.log(this.$route.name)
								if (this.$route.name === 'ChatBarShare' || this.$route.name === 'ColorPage') { // 素材库
									this.outData(res.data.user.id);  // 获取是否过期；
									this.getTabList();  // 存在就是从第三方应用进入的，没有存在就是从通讯录进入的
									this.getList();
									console.log('weqeqwkejqwjehwqehqwikehjqwikewhqioewjoweqjieoqwjeioqwjeqwioej')
									this.$router.push('/chatBarShare')
								} else if (this.$route.name === 'ChatCustomer') { // 营销画像
									this.init() // 请求数据
									this.accomplish = true;
								}
								// else if (this.$route.name === 'HaiRing') {  //朋友圈素材
								// 	this.initMineInfo(); //
								// 	this.getList();
								// 	this.pushText() // 推送
								// }
								sessionStorage.setItem('Single', true);
								this.masking = ''; //清空mengban
							}
						} else { //没有绑定直接弹框
							this.registerOpen();
							this.$toast.clear()
						}
						if (res.data.tickets) {
							sessionStorage.setItem('tickets', JSON.stringify(res.data.tickets))
						}
					} else {
						this.$toast(res, 'userinfoError');
					}
				}
			)
				.catch(function (error) {
					console.log(error);
				});
		},
		outData(cid) { // 过期校验
			let signature = generateSignature3(
				this.$U || local.U(),
				timeout,
				nonce
			);
			this.$get("/api/request/itr/comp/permission/current", {
				params: {
					userId: cid || this.$U || local.U(),
					timeout: timeout,
					nonce: nonce,
					signature: signature
				},
			}).then((res) => {
				if (res.license[2] == undefined || Object.keys(res).length == 0 || !res.license[2].startTime || res.license[2].startTime == '' || !res.license[2].expireTime || res.license[2].expireTime == '') {
					sessionStorage.setItem("pastDate", true)  // 过期
					this.$toast('过期')
				} else {
					sessionStorage.setItem("pastDate", false) // 
				}
			})
				.catch((error) => {
					console.log(error);
				});
		},
		urlcut(url) {
			let theRequest = new Object()
			if (url.indexOf('?') != -1) {
				var str = url.substr(1) //substr()方法返回从参数值开始到结束的字符串；
				var strs = str.split('&')
				for (var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
				}
				return theRequest //{code:'1213',suiteId:'456',state:0} 返回格式;
			}
		},
		haringUser(code) { // 获取朋友圈userinfo限定。
			this.$get("/work/mp/get/userinfo", {
				params: {
					code,
					compId: this.CI,
				},
			}).then((res) => {
				if (res.code == 200 && res.msg == 'success') {
					this.pushText(res.data.nickname || '') // 推送
				}
			})
				.catch(function (error) {
					console.log(error);
				});
		}
	}
};