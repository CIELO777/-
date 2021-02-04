/*
 * @Author: YUN_KONG 
 * @Date: 2021-02-03 14:12:55 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-02-04 13:45:54
 * 文档数据展示
 */
<template>
  <div class="docView">
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
        <div
          class="card"
          v-for="(item, index) in datas"
          :key="index"
          @click="clickColor(item)"
        >
          <div class="imgView">
            <div class="top" v-if="item.topState == 1">置顶</div>
            <img :src="item.img" alt="" />
          </div>
          <div class="info">
            <p>{{ item.description }}</p>
            <span>
              {{ item.time }}
              <span>
                {{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span
              ></span
            >
          </div>
          <div class="share" @click.stop="createContent(item)">
            <van-icon name="share-o" />分享
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
    <share
      :ShareContents="ShareContent"
      v-show="showShare"
      :showShares.sync="showShare"
    ></share>
  </div>
</template>

<script>
import share from '../../components/share'

export default {
  name: "docView",
  components: {},
  props: ['datas', 'userMaps', 'configs', 'states'],
  components: { share },
  data() {
    return {
      loading: false,
      finished: false,
      showShare: false,
      refreshing: false,
      ShareContent: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLoad() {
      console.log('111')
      console.log(this.configs.current, this.configs.total)
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
      }, 1800)
    },
    onRefresh() {  // 下拉刷新
      this.$emit('refreshEmpty')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.onLoad();
    },
    clickColor(item) {
      // 分享图片为线上图片
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.shareUrl,
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb
        }
      })
    },
    createContent(item) {
      console.log(item)
      this.showShare = true;
      this.ShareContent = {
        title: item.title,
        imgUrl: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`,
        desc: item.description,
        url: item.shareUrl
      }
    },
    getImgUrl(item) {
      return require("./fileType/" + item + ".png");
      // const urlPath = `assets/img/fileType/${item.fileSuffix}.png`
      // return require(`@/${urlPath}`);
    },
  },
  created() { },
  mounted() { }
};
</script>

<style lang="less" scoped>
.docView {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 100px;
  .card {
    display: flex;
    margin: 0 10px;
    padding: 13px 13px;
    background: #fff;
    margin-bottom: 8px;
    border-radius: 5px;
    position: relative;
    height: 48px;
    align-items: center;
    .share {
      position: absolute;
      right: 10px;
      bottom: 10px;
      display: flex;
      align-items: center;
      font-size: 0.28rem;
      i {
        margin-right: 3px;
      }
    }
  }
  .imgView {
    .top {
      position: absolute;
      left: 0;
      top: 0;
      background: #f6c110;
      width: 29px;
      border-radius: 3px;
      color: #000;
      font-size: 10px;
      text-align: center;
      padding: 0px;
    }
    img {
      width: 40px;
      height: 40px;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 8px;
    font-size: 14px;
    height: 40px;
    p {
      width: 90%;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span {
      color: #999;
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
}
</style>