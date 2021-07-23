import { generateSignature4, generateTimeout, generateNonce } from './tools';
let timeout = generateTimeout();
let nonce = generateNonce();
export const shareMixin = {
	data() {
		return {
			shareUrl: ""
		}
	},
	methods: {
		async getShareUrl(title, description, thumb, url, pageId, pageType) { // 获取URL。
			let userid = JSON.parse(sessionStorage.getItem('userinfo'))?.id;
			let comp = sessionStorage.getItem('bind_compId')
			let signature = generateSignature4(0, comp, userid, timeout, nonce);
			let param = new URLSearchParams();
			param.append("id", 0);
			param.append("title", title);
			param.append("description", description);
			param.append("thumb", thumb);
			param.append("url", encodeURI(url));
			param.append("pageId", pageId);
			param.append("pageType", pageType);
			param.append("userId", userid);
			param.append("compId", comp);
			param.append("timeout", timeout);
			param.append("signature", signature);
			param.append("nonce", nonce);
			await this.$post1("/work/trajectory/url", param)
				.then((res) => {
					if (res.code == 200 && res.msg == 'success') {
						this.shareUrl = res.data + '&to=' + sessionStorage.getItem('wxcrmId');
					} else {
						this.$toast('分享链接获取失败')
					}
				})
				.catch((error) => {
					this.$toast.fail("分享链接获取失败");
				});
		},
	}
}