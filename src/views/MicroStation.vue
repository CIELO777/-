<template>
  <div class="MicroStation">
    <div class="share" @click="createContent">
      <van-icon name="share" size="20px" />
    </div>
    <share
      v-if="showShare"
      :ShareContents="ShareContent"
      :showShares.sync="showShare"
    ></share>
    <iframe id="iframe" :src="url" frameborder="0" scrolling="auto"></iframe>
  </div>
</template>

<script>
import share from '../components/share'
import { generateTimeout, generateNonce, generateSignature3, generateSignature } from '../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
import local from '../uilts/localStorage';
import wxxx from '../uilts/wxconfig';

export default {
  name: "MicroStation",
  components: {},
  props: {},
  data() {
    return {
      url: '',
      showShare: false,
      remark: '',
      ShareContent: {},
      shopId: '',

    };
  },
  watch: {},
  computed: {},
  methods: {
    createContent() { // 触发分享模块
      this.showShare = true;
    },
    getMicUrl() {
      let signature = generateSignature3(this.$U || local.U(), this.$C || local.C(), nonce, timeout);
      this.$get("/api/request/console/mall", {
        params: {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          timeout,
          nonce,
          signature
        },
      })
        .then((res) => {
          if (res && res.url !== '') {
            this.url = res.url + '&shareType=15';
            console.log(this.url)
            this.$toast.clear();
          }
        })
        .catch((error) => {
          console.log(error)
        });
    },
    initMineInfo() { // 获取当前店铺url地址，店铺ID 。
      this.$get("/itver/remote/user/profile", {
        params: {
          userId: this.$U || local.U(),
          curLogin: this.$U || local.U(),
        },
      })
        .then((res) => {
          if (res?.mall?.url !== null) {
            // this.url = res.mall.url;
            this.shopId = res.mall.title;
            this.getHome();
            this.$toast.clear();
          }
        })
        .catch((error) => {
          console.log(error)
        });
    },
    getHome() {  //获取店铺的名称描述，url，封面图，分享用
      let signature = generateSignature(this.shopId, nonce, timeout);
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo")).id;
      let param = new URLSearchParams();
      param.append("id", this.shopId);
      param.append("nonce", nonce);
      param.append("timeout", timeout);
      param.append("signature", signature);
      param.append("clientType", 2);
      param.append("promote", userinfo);
      this.$post1('/view/remote/mall/shop/detail', param)
        .then((res) => {
          if (!res.error) {
            this.ShareContent = {
              title: res.title,
              imgUrl: res.thumb,
              desc: res.description,
              url: this.url,
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true,
        forbidClick: true,
        duration: 0
      });
    }
  },
  created() {
    if (sessionStorage.getItem('userinfo')) {
      this.loading()
      this.initMineInfo()
      this.getMicUrl();
      setTimeout(() => {
        wxxx();
      }, 1500);
    } else {
      this.$toast.fail({
        message: '此模块不支持聊天工具栏。',
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
    }
  },
  mounted() { },
  components: { share }
};
</script>

<style lang="less" scoped>
.MicroStation {
  position: relative;
  #iframe {
    height: 100vh;
    width: 100vw;
  }
  .share {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 10px;
    top: 0.4rem;
    width: 38px;
    height: 38px;
    background: #fff;
    border-radius: 50%;
  }
}
</style>