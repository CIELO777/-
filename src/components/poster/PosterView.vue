<template>
  <div class="posterView">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-if="datas.length > 0"
        class="vanList"
        finished-text="没有更多了"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-span="没有更多了"
        @load="onLoad"
      >
        <div class="ww">
          <div
            class="cont"
            v-for="(item, index) in datas"
            :key="index"
            @click="clickColor(item)"
          >
            <div
              class="bgc"
              :style="{
                backgroundImage: 'url(' + item.thumb + ') ',
                height: backHeight + 'px',
              }"
            >
              <div class="mask">
                <span style="width: 60%">{{ item.time }}</span>
                <span class="PosterTit">{{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span>
              </div>
              <!--  -->
              <div class="top" v-if="item.topState == 1">置顶</div>
            </div>
            <p class="title">{{ item.title }}</p>
            <p class="share">
              <img
                style="width: 15px; margin-right: 3px"
                src="../../../public/img/icon/share.png"
                alt=""
              />&nbsp;&nbsp;{{ item.shareNumber }}次
            </p>
            <!-- <div class="card">
            <img :src="item.thumb" alt="" style="width: 100px; height: 100px" />
          </div> -->
          </div>
        </div>
      </van-list>

      <van-empty
        v-else
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
    </van-pull-refresh>
    <PostImg :src.sync="Pthumb"></PostImg>
  </div>
</template>
<script>
import PostImg from '../../components/poster/PosterImg'; // 定制图片预览
export default {
  name: "PosterView",
  components: { PostImg },
  props: ['datas', 'userMaps', 'configs', 'states'],
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      backWidth: 0,
      backHeight: 0,
      screenWidth: document.body.clientWidth,     // 屏幕宽
      Pthumb: '',
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLoad() {
      if (this.configs.current >= this.configs.total) {
        this.finished = true;
        return;
      }
      if (this.states == 'list') {
        this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      } else {
        let cur = ++this.configs.current;
        this.$emit('onSearch', cur) // 触发爷组件方法更新数据下一页

      }
      setTimeout(() => {
        this.loading = false;
      }, 1000)
    },
    onRefresh() {
      this.$emit('refreshEmpty')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.onLoad();
    },
    clickColor(item) {
      this.Pthumb = item.thumb;
    }
  },
  created() {
    this.backWidth = this.screenWidth / 2;
    this.backHeight = this.backWidth;
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.posterView {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 105px;
  height:calc(100vh - 105px);
  .ww {
    display: flex;
    flex-wrap: wrap;
    padding: 0 4px;
  }
  .card {
    position: relative;
  }
  .cont {
    width: 50%;
    width: calc(100% / 3 - 10px);
    margin: 0 calc(10px / 2) 10px;
    .title {
      color: #000;
      font-size: 0.28rem;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .share {
      display: flex;
      align-items: center;
      font-size: 0.28rem;
      color: #999;
      i {
        margin-right: 3px;
      }
    }
  }
  .bgc {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #000;
    margin: 0 auto;
    position: relative;
    width: 100%;
    position: relative;
    .mask {
      height: 20px;
      line-height: 20px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 0.24rem;
      width: 100%;
      display: flex;
      padding: 0 8px;
      box-sizing: border-box;
      justify-content: space-between;
    }
    .top {
      position: absolute;
      left: 8px;
      top: 9px;
      background: #f6c110;
      width: 35px;
      border-radius: 3px;
      color: #000;
      font-size: 0.24rem;
      text-align: center;
      padding: 2px;
    }
  }
  /deep/ .van-list__loading {
    width: 100%;
    margin-bottom: 45px;
  }
  /deep/ .van-list__finished-text {
    width: 100%;
    margin-bottom: 45px;
  }
  .PosterTit {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>