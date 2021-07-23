<template>
  <div class="CustomerTrack">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-if="list.length > 0"
        class="vanList"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="clickColor(item)"
          class="follMain"
        >
          <div class="time">
            <icon
              :name="'6'"
              :w="20"
              :height="20"
              style="background: #eee; border-radius: 50%"
            ></icon>
            <div class="wire"></div>
          </div>
          <div class="info">
            <p class="font">
              {{ item.createTime }} 访问了
              <span v-if="item.pageType == 1">页面</span>
              <span v-else-if="item.pageType == 2">微站（首页）</span>
              <span v-else-if="item.pageType == 3">微站（详情页）</span>
              <span v-else-if="item.pageType == 4">微站（分类页）</span>
              <span v-else-if="item.pageType == 5">文档</span>
              <span v-else-if="item.pageType == 6">短视频</span>【{{
                item.title
              }}】
            </p>
          </div>
        </div>
      </van-list>
      <van-empty
        image-size="40px"
        v-else-if="empty"
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature4 } from '../../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
export default {
  name: "CustomerTrack",
  components: {},
  props: [],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      empty: false,
      total: 0,
      current: 1,
      url: 'http://ego-file.soperson.com/itver/13522008806/201712271708/85671523589501951.png'
    };
  },
  watch: {},
  computed: {},
  methods: {
    getAgendaList() {
      let param = new URLSearchParams();
      let compId = sessionStorage.getItem('bind_compId')
      let userId = JSON.parse(sessionStorage.getItem('userinfo'))?.id;
      let wxcrmId = sessionStorage.getItem('wxcrmId');
      let signature = generateSignature4(compId, timeout, nonce);
      param.append("from", wxcrmId || 'wmoqMGCgAAGrSMOKeEpW0g0g47V5WSJg'); //
      param.append("to", userId);
      param.append("compId", compId || 40007760);//|| 40007760
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("size", 20);
      param.append("current", this.current || 1);
      param.append("signature", signature);
      this.$post1("/work/trajectory/log/result", param)
        .then((res) => {
          if (res.code == 200 && res.msg == 'success') {
            if (res.data.data.length) {
              this.list = this.current == 1 ? res.data.data : this.list.concat(res.data.data);
              this.total = res.data.totalPageCount;
            } else {
              this.empty = true;
            }
          } else {
            this.empty = true;
            this.$toast(res, 'track')
          }
        })
        .catch((error) => {
          this.empty = true;
          console.log(error);
        });
    },
    clickColor(item) {
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.pageUrl,
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb
        }
      })
    },
    onLoad() {
      console.log(this.current, this.total)
      if (this.current >= this.total) {
        this.finished = true;
        return;
      }
      this.current = ++this.current;
      this.getAgendaList()
      setTimeout(() => {
        this.loading = false;
      }, 1500)
    },
    onRefresh() {
      this.current = 1;
      this.getAgendaList();
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
    }
  },
  created() {
    this.getAgendaList()
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.CustomerTrack {
  font-size: 0.32rem;
  overflow-y: scroll;
  height: 68vh;
  .follMain {
    display: flex;
    padding: 10px 15px;
    .time {
      margin-right: 0.3rem;
      flex-shrink: 0;
      span:first-child {
        font-size: 22px;
        font-weight: bold;
      }
      span:last-child {
        font-size: 16px;
        font-weight: 400;
        padding-left: 5px;
      }
      svg path {
        stroke: red;
        fill: red;
      }
    }
    .info {
      background: #f3f3f3;
      padding: 10px 5px;
      flex: 1;
      .font {
        line-height: 25px;
        word-break: break-all;
        padding-left: 8px;
        padding: 5px 2px;
        font-size: 0.3rem;
      }
    }
  }
  .wire {
    width: 1px;
    height: calc(100% - 25px);
    margin: 0 auto;
    margin-top: 5px;
    background: #c1bebe;
  }
}
</style>