/*
 * @Author: YUN_KONG 
 * @Date: 2021-02-03 14:12:55 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-06-04 10:51:53
 * 文档数据展示
 */
<template>
  <div
    class="docView"
    :style="{
      height: datas.length > 8 ? 'calc(100% - 100px)' : 'calc(100vh - 100px)',
    }"
  >
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
            <p>{{ item.title }}</p>
            <span
              style="
                font-size: 13px;
                display: flex;
                width: 94%;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span style="margin-right: 5px"
                >{{ item.time }}
                <span>
                  {{
                    userMaps[item.userId]
                      ? userMaps[item.userId].nickname || userMaps.nickname
                      : ""
                  }}</span
                >
              </span>
              <div @click.stop="createContent(item)" class="ShareCenter">
                <template v-if="$route.name == 'ChatBarShare'">
                  <img
                    style="width: 0.28rem; margin-right: 5px"
                    src="../../../public/img/icon/send.png"
                    alt=""
                  />
                  <span class="shareText">发送</span>
                </template>
                <template v-else>
                  <img
                    style="width: 0.28rem; margin-right: 3px"
                    src="../../../public/img/icon/share.png"
                    alt=""
                  />
                  <span class="shareText">分享</span>
                </template>
              </div></span
            >
          </div>
        </div>
      </van-list>
      <van-empty
        v-else-if="configs.empty"
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
import wxxx from '../../uilts/wxconfig'
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
          url: item.initialUrl + '?shareType=15',
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb
        }
      })
    },
    createContent(item) {
      if (sessionStorage.getItem('Single')) { //单聊模式发送  正常模式赋值
        wx.invoke('sendChatMessage', {
          msgtype: "news", //消息类型，必填
          news: {
            link: item.initialUrl + '?shareType=15', //H5消息页面url 必填
            title: item.title, //H5消息标题
            desc: item.description, //H5消息摘要
            imgUrl: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`, //H5消息封面图片URL
          },
        }, function (res) {
          console.log('服务指引返回结果', res);
          if (res.err_msg == 'sendChatMessage:ok') {
            //发送成功
          }
        })
      } else {
        this.showShare = true;
        this.ShareContent = {
          title: item.title,
          imgUrl: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`,
          desc: item.description,
          url: item.initialUrl + '?shareType=15'
        }

      }

    },
    getImgUrl(item) {
      return require("./fileType/" + item + ".png");
      // const urlPath = `assets/img/fileType/${item.fileSuffix}.png`
      // return require(`@/${urlPath}`);
    },
  },
  created() {
    if (this.$route.name !== 'ChatBarShare') { // 这个授权只是在工作台时候授权
      wxxx()
    }
  },
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
    padding: 0.36rem 0.26rem;
    background: #fff;
    margin-bottom: 8px;
    border-radius: 5px;
    position: relative;
    height: 48px;
    align-items: center;
    .share {
      position: absolute;
      right: 12px;
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
      left: 0px;
      top: 1px;
      background: #f6c110;
      width: 29px;
      border-radius: 3px;
      color: #000;
      font-size: 10px;
      text-align: center;
      padding: 2px;
    }
    img {
      width: 0.9rem;
      height: 0.9rem;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 8px;
    font-size: 14px;
    height: auto;
    width: 90%;
    flex-shrink: 0;
    // min-height: 60px;
    p {
      width: 90%;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 20px;
    }
    span {
      color: #807e7e;
    }
  }
  /deep/ .van-list__loading {
    width: 100%;
  }
  /deep/ .van-list__finished-text {
    width: 100%;
  }
  .ShareCenter {
    display: flex;
    align-items: center;
  }
  .shareText {
    font-size: 0.24rem;
  }
}
</style>