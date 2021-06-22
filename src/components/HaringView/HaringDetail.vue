<template>
  <div class="HaringDetail">
    <HaiRingView
      :datas="datas"
      :userMap="userMap"
      :current="current"
      :total="total"
      states="list"
      :userInfo="userInfo"
    ></HaiRingView>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import HaiRingView from './HaringViews'
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
import local from '../../uilts/localStorage';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "HaringDetail",
  components: { HaiRingView },
  props: [],
  data() {
    return {
      type: 0,
      datas: [],
      userMap: {},
      total: 0,
      haveMore: false,
      current: 1,
      userInfo: {},
    };
  },
  watch: {},
  computed: {},
  methods: {
    async getList(id, cur) {
      let signature = generateSignature3(
        id,
        timeout,
        nonce
      );
      let data = {
        userId: id,
        nonce: nonce,
        sort: "id",
        direct: "desc",
        timeout: timeout,
        signature: signature,
        current: cur || 1,
        size: 20,
        type: this.type
      };
      this.$get("/api/request/itr/page/material/result", {
        params: data,
      })
        .then((res) => {
          res.data.forEach(item => {
            if (item && item.title && item.title.length > 100) {
              item.allCont = item.title;
              item.title = item.title.substring(0, 100) + "...";
              item.full = true;
              item.haveMore = true;
            } else {
              item.haveMore = false;
            }
          })
          this.datas = (cur == 1 || cur == undefined) ? res.data : this.datas.concat(res.data)
          this.userMap = Object.assign(this.userMap, res.user);
          this.total = res.totalPageCount;
          setTimeout(() => {
            this.$toast.clear()
          }, 800)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 查看历史消息
    getHistory() {
      this.$get("/itver/remote/social/result", {
        params: {
          curLid: this.$U || local.U(),
          current: 1,
          size: 20,
        },
      })
        .then((res) => {
          console.log(res)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    initMineInfo() {
      this.$get("/itver/remote/user/profile", {
        params: {
          userId: this.$route.params.id,
          curLogin: this.$route.params.id,
        },
      })
        .then((res) => {
          this.userInfo = res;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true,
        forbidClick: true,
        duration: 0
      });
    }
  },
  created() {
    this.loading();
    this.getList(this.$route.params.id)
    this.initMineInfo();
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.HaringDetail {
  background: #fff;
}
</style>