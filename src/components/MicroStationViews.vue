<template>
  <div class="MicroStationViews">
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
          <div class="info">
            <img :src="item.thumb" alt="" />
            <div class="infoUser">
              <p class="title">{{ item.title }}</p>
              <p class="desc">{{ item.description }}</p>
              <p>{{ item.createTime }}</p>
            </div>
          </div>
          <div class="other" @click.stop="createContent(item)">
            <img
              style="width: 0.28rem; margin-right: 5px"
              src="../../public/img/icon/send.png"
              alt=""
            />
            <span class="shareText">发送</span>
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
  </div>
</template>

<script>
import local from '../uilts/localStorage';

export default {
  name: "MicroStationViews",
  components: {},
  props: ['datas', 'configs', 'states', 'soless'],
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLoad() {
      if (this.configs.current >= this.configs.total) {
        this.finished = true;
        this.classify() // 判断是否拉去接口
        return;
      }
      if (this.states == 'list') {
        this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      } else if (this.states == 'search') {
        let cur = ++this.configs.current;
        this.$emit('onSearch', cur) // 触发爷组件方法更新数据下一页
      }
      setTimeout(() => {
        this.loading = false;
      }, 1500)
    },
    classify() { // 判断分类页是否需要加载
      // this.$emit("classifyList")
      // console.log(this.soless)
      if (!this.soless) { // 证明有数据
        this.loadingFalse()
        this.finished = false;
        this.$emit("classifyList")
      } else { // 证明没数据
        this.finished = true;
      }
      // this.finished = false;
      // setTimeout(() => {
      //   this.loading = false;
      // }, 1500)
    },
    loadingFalse() {
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
      //   this.onLoad();
    },
    clickColor(item) { // 点击详情页
      let url;
      if (item.type === 'micHome') {
        url = `${item.url.split('/{id}')[0]}/${item.id}?s=${item.id}&promote=${item.userId}`
      } else {
        if (item.url.includes('classify')) { // 分类页
          url = `${item.url.split('/{sid}')[0]}/${item.sid}/${item.id}?s=${item.sid}&l=${item.id}&promote=${this.$U || local.U()}`;
        } else { // 详情页
          url = `${item.url.split('/{sid}')[0]}/${item.sid}/${item.id}/0?s=${item.sid}&p=${item.id}&promote=${this.$U || local.U()}`; // url拼接处理
        }
      }
      this.$router.push({
        name: 'Iframe',
        params: {
          url: url,
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb
        }
      })
    },
    createContent(item) { // 发送
      let url;
      console.log(item.url)
      if (item.type == 'micHome') { // 微站首页
        url = `${item.url.split('/{id}')[0]}/${item.id}?s=${item.id}&promote=${item.userId}`
      }else if(!item.uuid){
        let data = `${item.url.split('/{id}')[0]}/${item.id}?s=${item.id}&promote=${item.userId}`;
        url = data.replace('{sid}',item.sid);
      } else {
        url = `${item.url.split('/{sid}')[0]}/${item.sid}/${item.id}/0?s=${item.sid}&p=${item.id}&promote=${this.$U || local.U()}` // url拼接处理
      }
      console.log(url)
      wx.invoke('sendChatMessage', {
        msgtype: "news", //消息类型，必填
        news: {
          link: url, //H5消息页面url 必填
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
    },
  },
  created() {
  },
};
</script>

<style lang="less" scoped>
.MicroStationViews {
  background: #eee;
  font-size: 0.28rem;
  padding-top: 90px;
  height: calc(100vh - 90px);
  .card {
    margin: 15px 0;
    background-color: #fff;
    padding: 10px;
    position: relative;
  }
  .card .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
    }
    .infoUser {
      margin-left: 10px;
      p {
        line-height: 25px;
      }
      .title {
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
      }
    }
    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 200px;
    }
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
  .shareText {
    font-size: 0.24rem;
  }
}
</style>