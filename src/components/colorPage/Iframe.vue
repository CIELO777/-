<template>
  <div class="iframesss">
    <!-- <div class="share" @click="createContent">
      <van-icon name="share-o" size="20px" />
    </div> -->
    <div class="back" @click="back">
      <van-icon name="arrow-left" size="20px" />
    </div>
    <share
      :ShareContents="ShareContent"
      v-show="showShare"
      :showShares.sync="showShare"
    ></share>
    <iframe id="iframe" :src="url" frameborder="0" scrolling="auto"></iframe>
  </div>
</template>

<script>
import share from '../../components/share';

export default {
  name: "Iframe",
  components: { share },
  props: [],
  data() {
    return {
      url: "",
      showShare: false,
      ShareContent: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    createContent() {
      this.showShare = true;
      this.ShareContent = {
        title: this.$route.params.title,
        imgUrl: this.$route.params.imgUrl,
        desc: this.$route.params.desc,
        url: this.$route.params.url,
      }
    },
    back() {
      // console.log(this.$route, 'this.$route', this.$route.params);
      // if (this.$route.params.view && this.$route.params.view == 'video') { // 如果是视频页面直接跳转两级
      //   this.$router.go(-2);
      // } else {
      this.$router.go(-1);
      // }
    }
  },
  activated() {
    console.log(213)
  },
  created() {
    this.url = this.$route.params.url;
    // console.log(this.url, 'video');
    // setTimeout(() => {
    //   wxxx(); // 为了授权分享接口使用，所以一定要在这调用
    // }, 1500);
  },
  beforeRouteEnter: (to, from, next) => {
    // console.log(to, from, next, 'to, from, nextChatBarShare')
    next(vm => {
      vm.$store.commit("cache", from.name);
    })
  },
  mounted() { },
};
</script>

<style lang="less" scoped>
.iframesss {
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
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 50%;
  }
  .sharesheet /deep/ .van-share-sheet__option {
    span {
      white-space: pre;
    }
  }
  .back {
    .share;
    left: 10px;
  }
}
</style>