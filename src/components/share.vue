<template>
  <div class="shareView">
    <van-share-sheet
      @click-overlay="close"
      class="sharesheet"
      @select="onSelect"
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      cancel-text=""
    />
    <van-popup v-model="show">
      <img :src="this.Qcory" alt="" />
    </van-popup>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3, generateSignatureQrcode } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import local from '../uilts/localStorage';
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
          // { name: '朋友圈', icon: 'wechat' },
          { name: '我的客户', icon: require('../assets/img/我的客户1.png') },
          // { name: '微博', icon: 'weibo' },
        ],
        [
          // { name: '邮箱', icon: require('../assets/img/邮箱.png') },
          // { name: '短信', icon: require('../assets/img/短信.png') },
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
      if (name == '好友') {
        wx.invoke(
          "shareWechatMessage", {
          title: this.ShareContents.title, // 分享标题
          desc: this.ShareContents.desc, // 分享描述
          link: this.ShareContents.url, // 分享链接
          imgUrl: this.ShareContents.imgUrl // 分享封面
        }, (res) => {
          console.log(res, '分享接口')
          if (res.err_msg == "shareWechatMessage:ok") {
            this.shareCount()
            // this.$toast('分享成功')
          } else {
            this.$toast('分享失败', res)
          }
        }
        );
      } else if (name == '朋友圈') {
        this.$toast('请打开右上角菜单，选择朋友圈分享');
      } else if (name == '我的客户') {
        wx.invoke(
          "shareAppMessage", {
          title: this.ShareContents.title, // 分享标题
          desc: !this.ShareContents.desc ? this.ShareContents.title : this.ShareContents.desc, // 分享描述
          link: this.ShareContents.url, // 分享链接
          imgUrl: this.ShareContents.imgUrl // 分享封面
        }, (res) => {
          console.log(res, '我的客户')
          if (res.err_msg == "shareAppMessage:ok") {
            this.shareCount()
            this.$toast('分享成功')
          } else {
            this.$toast('分享失败', res)
          }
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
    shareCount() {
      this.$get("/itver/remote/share/callback", {
        params: {
          url: this.ShareContents.url,
          uid: this.$U || local.U(),
        },
      })
        .then((res) => {
          console.log(res, '分享')
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  async created() {
    let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    // console.log(this.ShareContents)
    // this.url = this.ShareContents.url;
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