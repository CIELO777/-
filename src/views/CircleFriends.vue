/*
 * @Author: YUN_KONG
 * @Date: 2021-05-27 16:06:40
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-06-04 13:17:10
   朋友圈模块
 */
<template>
  <div class="CircleFriends">
    <HaiRingView
      :datas="datas"
      :userMap="userMap"
      :current="current"
      :total="total"
      :states="state"
      :comment="comment"
      :thumb="thumb"
      :empty="empty"
      @mySonChagne="mySonChagne"
      :userInfo="userInfo"
    ></HaiRingView>
  </div>
</template>

<script>
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import HaiRingView from '../components/HaringView/HaringViews'

export default {
  name: "CircleFriends",
  components: { HaiRingView },
  props: [],
  data() {
    return {
      datas: [],
      userMap: {},
      type: 1,
      total: 0,
      current: 1,
      empty: false,
      state: 'list',
      userInfo: {},
      haveMore: false,
      thumb: {},
      comment: {},
    };
  },
  methods: {
    async getList(cur) {
      let signature = generateSignature3(
        this.$route.query.userId,
        timeout,
        nonce
      );
      let data = {
        userId: 13394171296,
        nonce: nonce,
        timeout: timeout,
        signature: signature,
        current: cur || 1,
        size: 20,
        type: this.type,
        categroyId: 1
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
          this.empty = this.datas.length > 0 ? true : false;
          this.userMap = Object.assign(this.userMap, res.user);
          this.comment = Object.assign(this.comment, res.comment);
          this.thumb = Object.assign(this.thumb, res.thumb);
          this.total = res.totalPageCount;
          this.$toast.clear()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mySonChagne(data) {
      let cur = ++data
      this.getList(cur)
    },
    initMineInfo() {
      this.$get("/itver/remote/user/profile", {
        params: {
          userId: this.$route.query.userId,
          curLogin: this.$route.query.userId,
        },
      })
        .then((res) => {
          this.userInfo = res;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    sessionStorage.setItem('RouteQuery', JSON.stringify(this.$route.query));
    this.getList();
    this.initMineInfo();
  },
  mounted() { },
};
</script>

<style lang="less" scoped>
.CircleFriends {
}
</style>