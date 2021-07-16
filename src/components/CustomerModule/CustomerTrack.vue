<template>
  <div class="CustomerTrack">
    <van-list
      v-if="list.length > 0"
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
        v-for="(item, index) in list"
        :key="index"
        @click="clickColor(item)"
      >
        <div class="imgView">
          <img :src="item.thumb || url" alt="" />
        </div>
        <div class="info">
          <p>{{ item.title }}</p>
          <p>{{ item.createTime }}</p>
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
    //   alert(wxcrmId, 'wxcrmId')
    //   alert(userId, 'userId')
    //   alert(compId, 'compId')
      param.append("from", wxcrmId);
      param.append("to", userId);
      param.append("compId", compId);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("size", 20);
      param.append("current", this.current || 1);
      param.append("signature", signature);
      this.$post1("/work/trajectory/log/result", param)
        .then((res) => {
        //   alert(JSON.stringify(res))
        //   alert(res.data.data.length)
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
      return;
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.pageUrl + '?shareType=15',
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
  height: 1;
  //   padding-top: 100px;
  .card {
    background: #f9f9f9;
    display: flex;
    margin: 0 10px;
    padding: 0.36rem 0.26rem;
    // background: #fff;
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
    p:first-child {
      margin-bottom: 6px;
    }
    p:last-child {
      color: #807e7e;
    }
    p {
      width: 90%;
      //   margin-bottom: 8px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 20px;
      white-space: pre;
    }
    span {
      color: #807e7e;
    }
  }
}
</style>