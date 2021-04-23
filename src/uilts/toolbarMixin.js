import wxxx from '../uilts/wxconfig'
export const Toolbar = {
	data() {
		return {
			UserId: '',
			open_userid: '',
			CorpId: '',
			Single: false,
			compId: '',
		}
	},
	async created() {
		if (sessionStorage.getItem('userinfo')) { // 通过userinfo字段判断是从哪个接口进入的
			this.loading()
			await this.getTabList()  // 存在就是从第三方应用进入的，没有存在就是从通讯录进入的
			await this.getList();
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
			this.$get("/wx-crm-server/wx/get/userinfo", {
				params: {
					code: this.code,
				},
			})
				.then(
					await function (res) {
						if (res.code === 200 && JSON.stringify(res.data) != "{}") {
							if (res.data.CorpId ?? res.data.open_userid) {
								// openid 和wxid 都存在在发送请求，请求用户信息
								that.getopenId(res.data.CorpId, res.data.open_userid);
								that.UserId = res.data.UserId;
								that.open_userid = res.data.open_userid;
								that.CorpId = res.data.CorpId;
								that.compId = res.data.compId;  // 会话存储后的公司ID  不可变更
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
			// alert(this.entry, 'this.entrythis.entrythis.entrythis.entry')
			// alert(this.CorpId, ' that.CorpId that.CorpId that.CorpId')
			// alert(url,'url')
			// if (this.entry == 'single_chat_tools') { // 如果是通过单聊中进入的，那么就截取code
			if (url.includes('code')) {
				location.href = url;
				url = window.location.href.split('?code=')[0]
			}
			console.log('url', url)
			// }
			location.href =
				"https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=" + url;
			sessionStorage.setItem('first', '1');
		},
		async getopenId(wxCompId, openId) { // 检测是否绑定公司了，
			// 拉去是否绑定企业微信
			let that = this;
			this.$get("/wx-crm-server/wx/get/itr", {
				params: {
					wxCompId,
					openId,
				},
			})
				.then(function (res) {
					if (res.code === 500 || !res.data || res.msg == "not_bind") {
						// 没有绑定
						that.show = true;
					} else if (
						res.code === 200 &&
						res.msg === "success" &&
						res.data != "{}"
					) {
						// 
						if (res.data.bind_comp_id) {
							// 如果有公司ID 那么就存数据，
							// that.$toast.clear()
							// let a = { ...res.data, bind_comp_id: that.compId, bind_comp_id1: res.data.bind_comp_id } // 会话存储，锁死compID
							sessionStorage.setItem("userinfo", JSON.stringify(res.data)); // 公司id 存入本地；
							that.getTabList()
							that.getList();
							wxxx();  // 如果是单页面调用企业微信agentConfig
							that.Single = true; // 为true证明是单聊；
							sessionStorage.setItem('Single', true);
						} else {
							// 如果不存在那么就弹框提示他没有绑定公司
							that.$toast.fail("当前账号没有绑定公司，请绑定公司。");
						}
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
	}
};