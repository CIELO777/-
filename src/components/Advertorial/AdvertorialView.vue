<template>
  <div
    class="AdvertorialView"
    :style="{
      height: datas.length > 8 ? 'calc(100% - 100px)' : 'calc(100vh - 100px)',
    }"
  >
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-if="datas.length > 0"
        class="vanList"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-span="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in datas"
          :key="index"
          @click="clickColor(item)"
        >
          <!-- 单图 -->
          <div class="card" v-if="item.viewType == 1">
            <div class="title">
              <span class="line2">{{ item.title }}</span>
              <img
                :src="
                  item.thumb + '?x-oss-process=image/resize,m_fill,h_200,w_200'
                "
              />
            </div>
            <div class="footer pt12">
              <div @click="handalClickFlow">
                流量<span class="num bule">
                  {{
                    (trajectoryCounts && trajectoryCounts[item.id]) || 0
                  }}</span
                >
              </div>
              <div @click="handalClickForm">
                表单<span class="num bule">
                  {{ (formCounts && formCounts[item.id]) || 0 }}</span
                >
              </div>
              <div>
                分享<span class="num"> {{ item.shareNumber }}</span>
              </div>
            </div>
            <div class="footer">
              <div class="footerShow">
                <span>{{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span
                ><span>{{ item.readNumber1 }}人阅读 </span
                ><span>{{ item.startTime }}</span>
              </div>
            </div>
            <div class="other" @click.stop="createContent(item)">
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

          <!-- 无图 -->
          <div class="card" v-if="item.viewType == 0">
            <div class="title">
              <span class="line2">{{ item.title }}</span>
            </div>
            <div class="footer">
              <div @click="handalClickFlow">
                流量<span class="num bule">
                  {{ (trajectoryCounts && trajectoryCounts[item.id]) || 0 }}
                </span>
              </div>
              <div @click="handalClickForm">
                表单<span class="num bule">
                  {{ (formCounts && formCounts[item.id]) || 0 }}
                </span>
              </div>
              <div>
                分享<span class="num"> {{ item.shareNumber }}</span>
              </div>
            </div>
            <div class="footer">
              <div class="footerShow">
                <span>{{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span
                ><span>{{ item.readNumber1 }}人阅读 </span
                ><span>{{ item.startTime }}</span>
              </div>
            </div>
            <div class="other" @click.stop="createContent(item)">
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

          <!-- 视频 -->
          <div class="card" v-if="item.viewType == 3">
            <div class="title">
              <span class="line2">{{ item.title }}</span>
            </div>
            <div class="video">
              <div class="play">
                <van-icon name="play" size="60" color="#fff" />
              </div>
              <img
                mode="widthFix"
                :src="
                  item.thumb + '?x-oss-process=image/resize,m_fill,h_225,w_400'
                "
              />
            </div>
            <div class="footer">
              <div @click="handalClickFlow">
                流量<span class="num bule">
                  {{
                    (trajectoryCounts && trajectoryCounts[item.id]) || 0
                  }}</span
                >
              </div>
              <div @click="handalClickForm">
                表单<span class="num bule">
                  {{ (formCounts && formCounts[item.id]) || 0 }}</span
                >
              </div>
              <div>
                分享<span class="num"> {{ item.shareNumber }}</span>
              </div>
            </div>
            <div class="footer">
              <div class="footerShow">
                <span>{{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span
                ><span>{{ item.readNumber1 }}人阅读 </span
                ><span>{{ item.startTime }}</span>
              </div>
            </div>
            <div class="other" @click.stop="createContent(item)">
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

          <!-- 多图 -->
          <div class="card" v-if="item.viewType == 2">
            <div class="title">
              <span class="line2">{{ item.title }}</span>
            </div>
            <div class="photo-list">
              <div v-for="(itr, idx) in item.viewList1" :key="idx">
                <img
                  :src="itr + '?x-oss-process=image/resize,m_fill,h_200,w_200'"
                />
              </div>
            </div>
            <div class="footer">
              <div @click="handalClickFlow">
                流量<span class="num bule">
                  {{
                    (trajectoryCounts && trajectoryCounts[item.id]) || 0
                  }}</span
                >
              </div>
              <div @click="handalClickForm">
                表单<span class="num bule">
                  {{ (formCounts && formCounts[item.id]) || 0 }}</span
                >
              </div>
              <div>
                分享<span class="num"> {{ item.shareNumber }}</span>
              </div>
            </div>
            <div class="footer">
              <div class="footerShow">
                <span>{{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span
                ><span>{{ item.readNumber1 }}人阅读 </span
                ><span>{{ item.startTime }}</span>
              </div>
            </div>
            <div class="other" @click.stop="createContent(item)">
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
  name: "AdvertorialView",
  components: {},
  props: ['datas', 'trajectoryCounts', 'userMaps', 'formCounts', 'configs', 'states'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showShare: false,
      ShareContent: {}
    };
  },
  mixins: [shareMixin],
  methods: {
    onLoad() {  // 触底事件、
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

      // this.getList();
      // 加载状态结束
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
    async clickColor(item) {
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
      await this.getShareUrl(item.title, item.description, item.thumb, item.url, item.id, 1);
      if (sessionStorage.getItem('Single')) { //单聊模式发送  正常模式赋值
        wx.invoke('sendChatMessage', {
          msgtype: "news", //消息类型，必填
          news: {
            link: this.shareUrl, //H5消息页面url 必填
            title: item.title, //H5消息标题
            desc: item.description ? item.description : '暂无数据', //H5消息摘要
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
          url: item.initialUrl + '&shareType=15'
        }
      }
    },
    handalClickFlow() {

    },
    handalClickForm() {

    },
  },
  created() {
    if (this.$route.name !== 'ChatBarShare') { // 这个授权只是在工作台时候授权
      wxxx()
    }
  },
  mounted() { },
  components: { share },

};
</script>

<style lang="less" scoped>
.AdvertorialView {
  background: #eee;
  font-size: 0.32rem;
  padding: 100px 10px 0px 10px;
}
.card {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  position: relative;
  .title {
    margin: 0 15px;
    font-weight: 500;
    display: flex;
    padding: 12px 0;
    flex-direction: row;
    border-bottom: 1px solid #eee;
    span {
      flex: 1;
      margin-right: 10px;
      font-size: 0.3rem;
      word-break: break-all;
      line-height: 20px;
      padding-top: 0.02rem;
    }
    img {
      // width: 30%;
      height: 1.4rem;
    }
  }
  .line2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-weight: 600;
  }
  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px 5px 15px;
    color: #8e8b8b;
    margin-right: 20px;
    div {
      font-size: 0.28rem;
      line-height: 0.6rem;
      flex: 1;
    }
  }
  .bule {
    color: #1593ff;
  }
  .other {
    position: absolute;
    bottom: 5px;
    right: 10px;
    height: 30px;
    width: 60px;
    color: #aaa;
    font-size: 0.28rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .footerShow span {
    margin-right: 3px;
    font-size: 0.24rem;
  }
  .pt12 {
    padding-top: 12px;
  }
  .video {
    padding: 0 10px 10px 10px;
    position: relative;
    .play {
      display: block !important;
      position: absolute !important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      width: 60px;
      height: 60px;
    }
    img {
      width: 100%;
      height: 180px;
    }
  }
  .photo-list {
    display: flex;
    flex-direction: row;
    padding: 0 10px;
    justify-content: space-between;
    div:first-child,
    div:nth-child(2) {
      width: 33%;
      padding-bottom: 33%;
      height: 0;
      margin-right: 5px;
      position: relative;
    }
    div:last-child {
      width: 33%;
      padding-bottom: 33%;
      height: 0;
      position: relative;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .vanList {
    padding-top: 20px;
  }
  .shareText {
    font-size: 0.28rem;
    white-space: nowrap;
  }
}
</style>