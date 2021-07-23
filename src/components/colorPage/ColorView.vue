/*
 * @Author: YUN_KONG 
 * @Date: 2021-01-12 13:56:29 
 * @Last Modified by: Tian
 * @Last Modified time: 2021-07-23 18:22:55
 8 此模块用于彩页，软文列表
 */
<template>
  <div
    class="colorView"
    :style="{
      height: datas.length > 8 ? 'calc(100% - 70px)' : 'calc(100vh - 70px)',
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
        <!-- {{datas}} -->
        <div
          class="card"
          v-for="(item, index) in datas"
          :key="index"
          @click="clickColor(item)"
        >
          <div class="info">
            <div v-if="visitor == 0" class="header">
              <div class="jino">
                <span
                  v-if="item.topStatus && item.topStatus == 1"
                  :class="['tag', item.userId == uid ? 'bule-bg' : 'red-bg']"
                >
                  置顶
                </span>
                <!-- <span
                  :class="['tag', item.userId == uid ? 'bule-bg' : 'red-bg']"
                  >
                  {{
                    item.userId == uid
                      ? item.draft == 0
                        ? "已发布"
                        : "未发布"
                      : "公司"
                  }}
                  </span
                > -->
                <img class="img" :src="item.thumb" />
                <div class="ldldl">{{ item.time }}</div>
              </div>
              <div class="detail">
                <span class="title line1" style="font-size: 0.28rem">{{
                  item.title
                }}</span>
                <span
                  v-if="visitor == 1"
                  class="desc line2"
                  style="line-height: 20px; margin-right: 10px; font-size: 13px"
                  >{{ item.description }}</span
                >
                <div
                  class="desc line1"
                  v-if="visitor == 0"
                  style="margin-right: 0px"
                >
                  <div catchtap="handalClickFlow">
                    <span style="margin-right: 3px">流量</span>
                    <span class="bule">{{
                      trajectoryCounts[item.id] || 0
                    }}</span>
                  </div>
                  <div catchtap="handalClickForm">
                    <span style="margin-right: 3px">表单</span>
                    <span class="bule">{{ formCounts[item.id] || 0 }}</span>
                  </div>
                  <div>
                    <span style="margin-right: 3px">分享数</span>
                    <span>{{ item.shareNumber1 }}</span>
                  </div>
                </div>
                <div class="line1 desc name1">
                  {{
                    userMaps[item.userId]
                      ? userMaps[item.userId].nickname || userMaps.nickname
                      : ""
                  }}
                  <span
                    v-if="
                      userMaps[item.userId]
                        ? userMaps[item.userId].approve == 1 || userMaps.approve
                        : ''
                    "
                    class="approve"
                    >V</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            class="other"
            v-if="visitor == 0"
            catchtap="handalClickManagement"
          >
            <div></div>
            <div class="shareA" @click.stop="createContent(item)">
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
            </div>
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
import share from '../../components/share';
import wxxx from '../../uilts/wxconfig';
import { shareMixin } from '../../uilts/shareMixin';
export default {
  name: "colorView",
  components: { share },
  props: ['datas', 'trajectoryCounts', 'userMaps', 'formCounts', 'configs', 'states'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      uid: "",
      page: {
        current: 1,
        size: 20
      },
      cid: 1,
      category: 0,
      trajectoryCount: {},
      userMap: {},
      formCount: {},
      totalPageCount: 0,
      visitor: 0,
      ShareContent: {},
      showShare: false,
    };
  },
  mixins: [shareMixin],
  methods: {
    onLoad() {  // 触底事件、
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
      // this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      setTimeout(() => {
        this.loading = false;
      }, 1000)
      // this.getList();
      // 加载状态结束
    },
    onRefresh() {  // 下拉刷新
      this.$emit('refreshEmpty')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1500);
      this.onLoad();
    },
    async clickColor(item) {
      // await this.getShareUrl(item.title, item.description, item.thumb, item.url, item.id, 1);
      // console.log(this.shareUrl, 'this.shareUrl')
      // console.log( this.$route.name == 'ChatBarShare' ? this.shareUrl : null)
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.initialUrl + '&shareType=15',
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb
        }
      })
    },
    async createContent(item) {
      await this.getShareUrl(item.title, item.description, item.thumb, item.url, item.id, 1)
      console.log(this.shareUrl)
      if (sessionStorage.getItem('Single')) { //单聊模式发送  正常模式赋值
        wx.invoke('sendChatMessage', {
          msgtype: "news", //消息类型，必填
          news: {
            link: this.shareUrl, //H5消息页面url 必填
            title: item.title, //H5消息标题
            desc: item.description, //H5消息摘要
            imgUrl: item.thumb, //H5消息封面图片URL
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
          imgUrl: item.thumb,
          desc: item.description,
          url: item.initialUrl + '&shareType=15',
        }
      }
    }
  },
  activated() {
  },
  created() {
    if (this.$route.name !== 'ChatBarShare') { // 这个授权只是在工作台时候授权
      wxxx()
    };
    this.uid = JSON.parse(sessionStorage.getItem('userinfo')).id;
    // wxxx(); // 为了授权分享接口使用，所以一定要在这调用
  },
};
</script>

<style lang="less" scoped>
.colorView {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 70px;
  height: calc(100vh - 70px);

  .card {
    margin: 10px;
    background-color: #fff;
    padding: 10px;
    position: relative;
    border-radius: 5px;
  }
  .card .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .card .other {
    position: absolute;
    bottom: 5px;
    right: 10px;
    height: 30px;
    width: 60px;
    color: #848282;
    font-size: 24rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .tag {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 45px;
    height: 20px;
    border-radius: 0 0 10px 0;
    text-align: center;
    line-height: 20px;
    font-size: 0.24rem;
    color: #fff;
  }
  .red-bg {
    background-color: #e64a38;
  }
  .card .info .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ldldl {
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 0;
    color: #fff;
    left: 0;
    width: 100%;
    text-align: center;
    height: 15px;
    line-height: 16px;
    font-size: 0.21rem;
  }
  .card .info .detail {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 0.48rem;
  }

  .card .info .desc div {
    display: inline;
    // margin-left: 10px;
    font-size: 0.24rem;
  }
  .bule {
    color: #1593ff;
  }
  .card .info .desc {
    color: #848282;
    font-size: 0.28rem;
    margin-right: 80px;
  }

  .line1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    // padding-bottom: .1rem;
    // line-height: .5rem;
  }
  .header {
    display: flex;
    width: 100%;
    align-items: center;
  }
  .jino {
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
  }
  .card .info .desc div {
    display: inline;
    margin-right: 10px;
  }
  .name1 {
    font-size: 0.24rem !important;
  }
  .vanList {
    padding-top: 20px;
  }
  .shareA {
    font-size: 0.24rem;
    display: flex;
    color: #4d4b4b;
    align-items: center;
    i {
      margin-right: 0.06rem;
    }
  }
  .approve {
    font-size: 14px;
    font-style: italic;
    font-weight: bold !important;
    color: #f2711c !important;
  }
  /deep/ .van-pull-refresh__head {
    top: 30px;
  }
  .title {
    font-weight: 550;
  }
  .bule-bg {
    background-color: #1593ff;
  }
  .shareText {
    font-size: 0.24rem;
    white-space: nowrap;
  }
}
</style>