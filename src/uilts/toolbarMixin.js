/*
 * @Author: YUN_KONG 
 * @Date: 2021-04-27 11:13:08 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-06-22 11:16:59
 * 聊天工具栏素材分享功能组件，
 */
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
			imgSrc: ''
		}
	},
	async created() {
		// this.$router.replace('/ChatBarShare');
		// return;
		if (sessionStorage.getItem('userinfo')) { // 通过userinfo字段判断是从哪个接口进入的
			if (this.$route.name !== 'ChatCustomer') { // 客户画像模块不需要 执行如下方法
				this.loading()
				await this.getTabList();  // 存在就是从第三方应用进入的，没有存在就是从通讯录进入的
				await this.getList();
			}
			// wxxx()	
		} else {
			this.code = this.$route.query.code;
			if (this.code) {
				if (JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id) {
					this.loading()
					await this.getTabList()
					await this.getList();
				} else {
					await this.getUserinfo(); //拿code 获取用户信息
				}
			} else {
				this.getURl(); // 没有code 请求code
			}
		}
	},
	methods: {
		async getUserinfo() {
			// 获取用户信息
			let that = this;
			await this.$get("/wx-crm-server/wx/get/userinfo", {
				params: {
					code: this.code,
				},
			}).then(
				async function (res) {
					if (res.code === 200 && JSON.stringify(res.data) != "{}") {
						if (res.data.CorpId ?? res.data.open_userid) {
							// openid 和wxid 都存在在发送请求，请求用户信息
							that.CorpId = res.data.CorpId;
							that.compId = res.data.compId;  // 会话存储后的公司ID  不可变更
							await that.getopenId(res.data.CorpId, res.data.open_userid);
							that.UserId = res.data.UserId;
							await sessionStorage.setItem('bind_UserID', res.data.UserId)
							that.open_userid = res.data.open_userid;
							sessionStorage.setItem('bind_compId', res.data.compId);
							sessionStorage.setItem("openId", that.open_userid); // 保存openID 解绑用
							sessionStorage.setItem("CorpId", res.data.CorpId); // 保存openID 解绑用
						}
					} else {   //没有信息，
						// console.log(that.entry, 'that.entry1112213')
						// if (that.entry == 'single_chat_tools') {
						that.getURl(); //单聊应该先重定向拿去新code
						// } else {
						// that.show = true;  // 没有信息，让他注册账号;
						// }
					}
				}
			)
				.catch(function (error) {
					console.log(error);
				});
		},
		getURl() {
			// 没有code 获取code
			let url = window.location.href;
			//  (this.entry, 'this.entrythis.entrythis.entrythis.entry')
			// alert(this.CorpId, ' that.CorpId that.CorpId that.CorpId')
			// alert(url,'url')
			// if (this.entry == 'single_chat_tools') { // 如果是通过单聊中进入的，那么就截取code
			if (url.includes('code')) {
				location.href = url;
				url = window.location.href.split('?code=')[0]
			}
			// }
			location.href =
				"https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=" + url;
			sessionStorage.setItem('first', '1');

		},
		async getopenId(wxCompId, openId) { // 检测是否绑定公司了，
			// 拉去是否绑定企业微信
			let that = this;
			await this.$get("/wx-crm-server/wx/get/itr", {
				params: {
					wxCompId,
					openId,
				},
			}).then(function (res) {
				console.log(res, 'resresres');
				if (res.code === 500 || !res.data || res.msg == "not_bind") {
					console.log("🚀 ~ file: toolbarMixin.js ~ line 109 ~ getopenId ~ res", res)
					// 没有绑定
					that.show = true;
					sessionStorage.setItem("not_bind", true)
					that.Single = true; // 为true证明是单聊；
					sessionStorage.setItem('Single', true);
					if (that.$route.name === 'ColorPage') { // 如果是彩页，那么就跳转 分享页面
						that.$router.replace('/chatBarShare')
					} else if (that.$route.name === 'ChatCustomer') { // 如果不是那么就分享到 客户画像
						that.accomplish = true; // 目的是为了让企业微信客户端
					}
				} else if (
					res.code === 200 &&
					res.msg === "success" &&
					res.data != "{}"
				) {
					// 
					if (res.data.bind_comp_id) {
						console.log(that.$route.name, 'that.$route.name ');
						// 如果有公司ID 那么就存数据，
						let a = { ...res.data, bind_comp_id: that.compId, bind_comp_id1: 40021450 } // 会话存储，锁死compID
						sessionStorage.setItem("userinfo", JSON.stringify(a)); // 公司id 存入本地；
						// that.imgSrc = a.portrait; // 客户头像
						that.Single = true; // 为true证明是单聊；
						sessionStorage.setItem('Single', true);
						if (that.$route.name === 'ChatBarShare' || that.$route.name === 'ColorPage') {
							that.$router.push('/chatBarShare')
						} else if (that.$route.name === 'ChatCustomer') {
							// that.$router.push('/chatCustomer')
							that.init() // 请求数据
						}
						that.accomplish = true; // 目的是为了让企业微信客户端
						console.log("🚀 ~ file: toolbarMixin.js ~ line 134 ~ getopenId ~ that.accomplish", that.accomplish)
					} else {
						// 如果不存在那么就弹框提示他没有绑定公司
						that.$toast.fail("当前账号没有绑定公司，请绑定公司。");
					}
				} else {
					that.$toast.fail("未知错误，请联系管理员");
				}
			})
				.catch(function (error) {
					console.log(error);
				});
		},
	}
};