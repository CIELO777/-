<template>
  <div class="VideoPage">
    <div class="main" style="margin: 35px 0px 0px 0px">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-if="datas.length > 0"
          finished-text="没有更多了"
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-span="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="(item, index) in datas"
            :key="index"
            class="cont"
            @click="clickColor(item, index)"
          >
            <div class="card">
              <div class="top" v-if="item.topState == 1">置顶</div>
              <div
                class="bgc"
                :style="{
                  backgroundImage: 'url(' + item.thumb + ') ',
                  height: backHeight,
                }"
              ></div>
              <div class="mask">
                <van-icon name="play" color="#fff" size="35" />
              </div>
              <div class="mask1">
                <span>{{ item.time }}</span>
                <span>{{
                  userMaps[item.userId]
                    ? userMaps[item.userId].nickname || userMaps.nickname
                    : ""
                }}</span>
              </div>
            </div>
            <div class="HbTit">
              <div class="line1">{{ item.description }}</div>
              <div class="ed">
                <div class="wa">
                  <van-icon name="eye" size="18" />
                  <span style="margin-right: 5px">
                    {{ item.visits1 }}
                  </span>
                  <template v-if="$route.name !== 'ChatBarShare'">
                    <img
                      style="width: 15px; margin-right: 3px"
                      src="../../../public/img/icon/share.png"
                      alt=""
                    />
                    {{ item.shares }}
                  </template>
                </div>
                <div class="ca" @click.stop="createContent(item)">
                  <img
                    style="width: 15px; margin-right: 3px"
                    :src="
                      Single
                        ? require('../../../public/img/icon/send.png')
                        : require('../../../public/img/icon/menu.png')
                    "
                    alt=""
                  />
                  <span v-if="Single" style="word-break: keep-all">发送</span>
                </div>
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
  </div>
</template>

<script>
import share from '../../components/share'
import communication from "../../uilts/communication";
import { getM } from '../../uilts/date';
import wxxx from '../../uilts/wxconfig'
export default {
  name: "VideoPage",
  components: {},
  props: ['datas', 'userMaps', 'configs', 'states'],
  data() {
    return {
      id: 0,
      screenWidth: document.body.clientWidth || document.documentElement.clientWidth,     // 屏幕宽
      backWidth: 0,
      backHeight: 0,
      loading: false,
      finished: false,
      refreshing: false,
      ShareContent: {},
      showShare: false,
      Single: false,
    };
  },
  watch: {
  },
  computed: {},
  methods: {},
  created() {
    this.backWidth = this.screenWidth / 2;
    this.backHeight = (this.backWidth * 1.5) + 'px';
    this.$nextTick(() => {
      this.Single = sessionStorage.getItem('Single') || false;

    })
    if (this.$route.name !== 'ChatBarShare') { // 这个授权只是在工作台时候授权
      setTimeout(() => {
        wxxx()
      }, 1000);
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {  // 兼容企业微信客户端pc 端高度;
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
        that.backWidth = that.screenWidth / 2;
        that.backHeight = (that.backWidth * 1.5) + 'px';
      })()
    }
  },
  methods: {
    onRefresh() {
      this.$emit('refreshEmpty')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.onLoad();
    },
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
    clickColor(item, index) {
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.initialUrl + '?shareType=15',
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb,
          view: 'video'
        }
      })
      communication.$emit('dateViodeo', index, getM()[3]); //触发home 页面方法，目的是为了更新列表数据
    },
    createContent(item) {
      if (sessionStorage.getItem('Single')) { //单聊模式发送  正常模式赋值
        wx.invoke('sendChatMessage', {
          msgtype: "news", //消息类型，必填
          news: {
            link: item.initialUrl + '?shareType=15', //H5消息页面url 必填
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
          url: item.initialUrl + '?shareType=15'
        }
      }
    }
  },

  components: {
    share
  }

};
</script>

<style lang="less" scoped>
.VideoPage {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 70px;
  height: calc(100vh - 70px);
  .cont {
    width: 50%;
    width: calc(100% / 2 - 5px);
    margin: 0 calc(5px / 2) 10px;
  }
  .van-list {
    display: flex;
    flex-wrap: wrap;
  }
  .card {
    position: relative;
  }
  .bgc {
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    background-color: #000;
    margin: 0 auto;
    position: relative;
    width: 100%;
    border-radius: 10px;
  }
  .mask {
    width: 45px;
    height: 45px;
    border-radius: 100%;
    position: absolute;
    top: calc(50% - 22px);
    left: calc(50% - 22px);
    background-size: cover;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: #000;
    font-size: 0.28rem;
  }
  .ed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.26rem;
    color: #999;
  }
  .wa {
    display: flex;
    align-items: center;
    i {
      margin-right: 3px;
    }
  }
  .ca {
    display: flex;
    align-items: center;
    width: 27px;
    justify-content: flex-end;
  }
  /deep/ .van-list__loading {
    width: 100%;
  }
  /deep/ .van-list__finished-text {
    width: 100%;
  }
  .top {
    position: absolute;
    left: 10px;
    top: 9px;
    background: #f6c110;
    width: 29px;
    border-radius: 3px;
    color: #000;
    font-size: 10px;
    text-align: center;
    padding: 2px;
    z-index: 998;
  }
  .mask1 {
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
    border-radius: 0 0 9px 9px;
  }
  .HbTit {
    line-height: 25px;
    padding: 5px 10px;
    background: #fff;
    position: relative;
    min-height: 85px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
}
</style>