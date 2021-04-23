<template>
  <div class="iframesss">
    <div class="share" @click="createContent">
      <van-icon name="share" size="20px" />
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
import share from '../../components/share'

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
        url: this.$route.params.url
      }

    }
  },
  created() {
    console.log(this.$route.params.url, 'paramsUrl')
    this.url = this.$route.params.url;
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