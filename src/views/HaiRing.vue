<template>
  <div class="haiRing">
    <van-search
      @clear="onCancel"
      v-model="value"
      show-action
      placeholder="输入素材信息"
    >
      <template #action>
        <div @click="search">搜索</div>
      </template>
    </van-search>
    <HaiRingView
      :datas="datas"
      :userMap="userMap"
      :current="current"
      :total="total"
      :states="state"
      :comment="comment"
      :thumb="thumb"
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
import local from '../uilts/localStorage';
import HaiRingView from '../components/HaringView/HaringViews'
export default {
  name: "HaiRing",
  components: { HaiRingView },
  props: [],
  data() {
    return {
      value: "",
      type: 1,
      datas: [],
      userMap: {},
      comment: {},
      thumb: {},
      total: 0,
      current: 1,
      haveMore: false,
      state: 'list',
      userInfo: {},
    };
  },
  watch: {},
  computed: {},
  methods: {
    async getList(cur) {
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
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
          this.comment = Object.assign(this.comment, res.comment);
          this.thumb = Object.assign(this.thumb, res.thumb);

          this.total = res.totalPageCount;
          this.$toast.clear()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    search(val) {
      this.state = 'search';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.current = 1;
      this.onSearch(this.current);

    },
    onSearch(cur) {
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        nonce: nonce,
        sort: "id",
        direct: "desc",
        timeout: timeout,
        signature: signature,
        current: cur || 1,
        size: 20,
        type: this.type
      };
      if (this.value !== '') {
        data.fuzzy = this.value;
      }
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
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onCancel() {
      this.state = 'list';
      this.current = 1;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList()
    },
    mySonChagne(data) {
      let cur = ++data
      this.getList(cur)

    },
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true,
        forbidClick: true,
        duration: 0
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
        .catch((error) => {
          console.log(error);
        });
    },
    initMineInfo() {
      this.$get("/itver/remote/user/profile", {
        params: {
          userId: this.$U || local.U(),
          curLogin: this.$U || local.U(),
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
    if (sessionStorage.getItem('userinfo')) {
      this.loading();
      this.getList();
      this.getHistory(); // 查看历史消息
      this.initMineInfo();
    } else {
      this.$toast.fail({
        message: '此模块不支持聊天工具栏。',
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
    }

  },
  mounted() { },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit("cache", to.name);
    })
  },
};
</script>

<style lang="less" scoped>
.haiRing {
  background: #fff;
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>