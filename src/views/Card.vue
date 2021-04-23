<template>
  <div class="card">
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
import { generateTimeout, generateNonce, generateSignature3, generateSignatureQrcode } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import sha1 from "../uilts/sha1";
import local from '../uilts/localStorage';

export default {
  name: "Card",
  components: {},
  props: [],
  data() {
    return {
      url: '',
      showShare: false,
      ShareContent: {},
      remark: '',
    };
  },
  watch: {},
  computed: {},
  methods: {
    createContent() {
      this.showShare = true;
      this.ShareContent = {
        title: JSON.parse(sessionStorage.getItem('userinfo')).nickname + '的名片，请惠存',
        imgUrl: JSON.parse(sessionStorage.getItem('userinfo')).portrait,
        desc: this.remark,
        url: this.url
      }
    },
    initMineInfo() {
      this.$get("/itver/remote/user/profile", {
        params: {
          userId: this.$U || local.U(),
          curLogin: this.$U || local.U(),
        },
      })
        .then((res) => {
          if (res.url !== null) {
            this.url = res.initialUrl;
            this.$toast.clear();
          }
          if (res.remark) {
            this.remark = res.remark;
          }
        })
        .catch((error) => {
          console.log(error)
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
  async created() {
    if (sessionStorage.getItem('userinfo')) {
      this.loading()
      this.initMineInfo()
    } else {
      this.$toast.fail({
        message: '此模块不支持聊天工具栏。',
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
    }
    // let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    // this.url = `https://page.weishang99.net/itver/remote/${userinfo.id}/profile/${userinfo.id}/${userinfo.bind_comp_id}`
    // await this.getAgentConfig(); // 同步执行 否则会报错
    // await this.getWxJsJdk();
  },
  mounted() { },
  components: {
    share
  }
};
</script>

<style lang="less" scoped>
.card {
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
  .sharesheet /deep/ .van-share-sheet__option {
    span {
      white-space: pre;
    }
  }
}
</style>