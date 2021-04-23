<template>
  <div class="verbalView">
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
          <div class="title line2">
            <i
              style="
                width: 5px;
                flex-shrink: 0;
                height: 5px;
                border-radius: 50%;
                background-color: #e4881e;
                margin-top: 12px;
                margin-right: 5px;
              "
            ></i
            >{{ item.title }}
          </div>
          <div class="footer">
            <div>
              <span style="margin-right: 5px"> {{ item.refreshTime }}</span>
              {{
                userMaps[item.userId]
                  ? userMaps[item.userId].nickname || userMaps.nickname
                  : ""
              }}
            </div>
          </div>
          <div class="other" @click.stop="createContent(item)">
            <img
              style="width: 0.2rem; margin-right: 3px"
              src="../../../public/img/icon/Copy.png"
              alt=""
            />
            <span class="shareText">复制</span>
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
import share from '../share'

export default {
  name: "VerbalView",
  components: { share },
  props: ['datas', 'userMaps', 'configs', 'states'],
  data() {
    return {
      loading: false,
      finished: false,
      showShare: false,
      refreshing: false,
      ShareContent: {},
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
      }, 1800)
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
      this.$router.push({
        name: 'VerBalDetail',
        params: {
          user: this.userMaps[item.userId],
          item,
        }
      })

    },
    createContent(item) {
      let temp = item.title;
      let content = JSON.parse(item.content);
      if (content) {
        content.forEach((item) => {
          temp += '\n' + item.data;
        })
      }
      if (sessionStorage.getItem('Single')) { //单聊模式发送  正常模式赋值
        wx.invoke('sendChatMessage', {
          msgtype: "text", //消息类型，必填
          text: {
            content: temp, //文本内容
          },
        }, function (res) {
          console.log('服务指引返回结果', res);
          if (res.err_msg == 'sendChatMessage:ok') {
            //发送成功
          }
        })
      } else {
        wx.setClipboardData({
          data: temp,
          success: (res) => {
            this.$toast('复制成功')
          },
          fail: (res) => {
            console.log(res, '失败')
            this.$toast('复制成功')
          }
        })
      }

    },
  },
  created() {

  },
  mounted() { },
};
</script>

<style lang="less" scoped>
.verbalView {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 90px;
  .card {
    margin: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
    position: relative;
    .line2 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .title {
      font-size: 0.3rem;
      font-weight: 500;
      display: flex;
      flex-direction: row;
      line-height: 30px;
      padding: 0.2rem 0.3rem 0.2rem;
    }
    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 0.3rem 0.3rem 0.3rem;
      color: #aaa;
      margin-right: 20px;
      font-size: 0.26rem;
    }
    .other {
      position: absolute;
      bottom: 5px;
      right: 10px;
      height: 30px;
      width: 60px;
      color: #aaa;
      font-size: 0.26rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .shareText {
      font-size: 0.24rem;
      white-space: nowrap;
    }
  }
}
</style>