<template>
  <div class="shareView">
    <van-share-sheet @click-overlay="close" class="sharesheet" @select="onSelect" v-model="showShare" title="立即分享给好友" :options="options" />
    <van-popup v-model="show">
      <img :src="this.Qcory" alt="">
    </van-popup>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3, generateSignatureQrcode } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import sha1 from "../uilts/sha1";

export default {
  name: "share",
  components: {},
  props: ['showShares', 'ShareContents'],
  data() {
    return {
      show: false,
      url: '',
      options: [
        [
          { name: '好友', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat' },
          { name: '我的客户', icon: require('../assets/img/我的客户1.png') },
          { name: '微博', icon: 'weibo' },
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '邮箱', icon: require('../assets/img/邮箱.png') },
          { name: '短信', icon: require('../assets/img/短信.png') },
          // { name: '二维码', icon: 'qrcode' },
        ],
      ],
      noncestr: "",
      timestamp: "",
      noncestr2: "",
      signature2: "",
      Qcory: "",
    };
  },
  computed: {
    showShare: {
      get() {
        return this.showShares
      },
      set(v) {

      }
    }
  },
  methods: {
    onSelect(option) { // 分享
      let name = option.name;
      var a = document.createElement('a');
      console.log(this.ShareContents)
      if (name == '好友') {
        wx.invoke(
          "shareWechatMessage", {
          title: this.ShareContents.title, // 分享标题
          desc: this.ShareContents.desc, // 分享描述
          link: this.ShareContents.url, // 分享链接
          imgUrl: this.ShareContents.imgUrl // 分享封面
        }, function (res) {
          console.log(res);
        }
        );
      } else if (name == '朋友圈') {
        this.$toast('请打开右上角菜单，选择朋友圈分享');
      } else if (name == '企业微信联系人') {
        wx.invoke(
          "shareAppMessage", {
          title: this.ShareContents.title, // 分享标题
          desc: this.ShareContents.desc, // 分享描述
          link: this.ShareContents.url, // 分享链接
          imgUrl: this.ShareContents.imgUrl // 分享封面
        }, function (res) {
          console.log(res, '分享到企业微信')
        }
        );
      } else if (name == '邮箱') {
        a.href = "mailto:";
        a.click();
      } else if (name == '短信') {
        a.href = "sms:";
        a.click();
      } else if (name == '微博') {
        window.sharetitle = this.ShareContents.title; //分享内容的标题
        window.shareUrl = encodeURIComponent(this.ShareContents.url);
        this.wbshare()
      } else if (name == '复制链接') {
        wx.setClipboardData({
          data: 'data',    // 设置的
          success: function (res) {
            console.log(res.errMsg)
          }
        })
      } else if (name == '二维码') {
        let signature = generateSignatureQrcode(
          0,
          timeout,
          nonce
        );
        this.show = true;

        this.Qcory = 'https://api.jiain.net/api/remote/util/qrCode?content=' + this.url + '&logo=' + imgUrl + '&size=166&timeout=' + timeout + '&nonce=' + nonce + '&clientType=0&signature=' + signature;
      }
      this.showShare = false;
    },
    close() {
      this.$emit('update:showShares', false)
    },
    wbshare() {
      var d = window;
      d.location.href = "http://v.t.sina.com.cn/share/share.php?url=" + d.shareUrl + "&title=" + d.sharetitle +
        "&searchPic=true"; //微博自动抓取图片用这个
      // d.location.href = "http://service.weibo.com/share/share.php?url=" + d.shareUrl + "&title=" + d.sharetitle +
      //   "&pic=" + d.shareImg; //自定义图片用这个
    },
    async getWxJsJdk() {
      // 初始化init wx.config
      let param = new URLSearchParams();
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("url", "wxa.jiain.net");
      param.append("type", 1);
      param.append("itrId", itrId);
      let that = this;
      await this.$post1("/wx-crm-server/wx/js_api_ticket/auth", param)
        .then((res) => {
          this.appId = res.appId;
          this.noncestr = nonce;
          this.timestamp = timeout / 1000;
          let url = location.href.split("#")[0];
          let str1 =
            "jsapi_ticket=" +
            res.jsapi_ticket +
            "&noncestr=" +
            this.noncestr2 +
            "&timestamp=" +
            this.timestamp2 +
            "&url=" +
            url;
          let signature = sha1.hex_sha1(str1);
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，企业微信的corpID
            timestamp: this.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.noncestr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
            jsApiList: ["onMenuShareWechat", "onMenuShareTimeline", 'shareAppMessage', 'shareWechatMessage', 'updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
            wx.hideMenuItems({
              menuList: ['menuItem:share:appMessage', 'menuItem:share:wechat', 'menuItem:copyUrl', 'menuItem:openWithSafari'] // 要隐藏的菜单项
            });
            // 朋友圈分享

            wx.onMenuShareTimeline({
              title: this.ShareContents.title, // 分享标题
              link: this.ShareContents.url, // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
              imgUrl: this.ShareContents.imgUrl, // 分享图标
              success: function () {
                console.log('朋友圈成功')
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                console.log('朋友圈失败')
                // 用户取消分享后执行的回调函数
              }
            });
          });
          wx.error(function (res) {
            console.log(res, 'error')
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getAgentConfig() {
      // 拉取
      let param = new URLSearchParams();
      let url = location.href.split("#")[0];
      let itrId = JSON.parse(sessionStorage.getItem("userinfo"))?.id;
      param.append("timeout", timeout / 1000);
      param.append("nonce", nonce);
      param.append("url", url);
      param.append("type", 2); // 为2的时候拉去的是
      param.append("itrId", itrId);
      await this.$post1("/wx-crm-server/wx/js_api_ticket/auth", param)
        .then((res) => {
          // alert('执行了出来，agentConfig')
          // alert(res)
          let str1 =
            "jsapi_ticket=" +
            res.jsapi_ticket +
            "&noncestr=" +
            nonce +
            "&timestamp=" +
            timeout / 1000 +
            "&url=" +
            url;
          this.jsapi2 = res.jsapi_ticket; // 这个值是拉取的值agentConfig 值
          this.timestamp2 = timeout / 1000;
          this.noncestr2 = nonce;
          this.signature2 = sha1.hex_sha1(str1);
        })
        .catch((err) => {
          // alert(err);
        });
    },
  },
  async created() {
    let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    // console.log(this.ShareContents)
    // this.url = this.ShareContents.url;
    await this.getAgentConfig(); // 同步执行 否则会报错
    await this.getWxJsJdk();
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.sharesheet /deep/ .van-share-sheet__option {
  span {
    white-space: pre;
  }
}
</style>