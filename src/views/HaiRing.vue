<template>
  <div class="haiRing">
    <div :style="masking">
      <van-loading
        size="36"
        color="rgb(25, 137, 250)"
        v-if="masking"
        type="spinner"
      />
    </div>
    <van-search
      @clear="onCancel"
      v-model="value"
      v-if="UI == '0'"
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
      :UI="UI"
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
import { Toolbar } from '../uilts/toolbarMixin';

import HaiRingView from '../components/HaringView/HaringViews';
export default {
  name: "HaiRing",
  components: { HaiRingView },
  mixins: [Toolbar],
  data() {
    return {
      value: "",
      masking: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        zIndex: 999,
      },
      type: 1,
      show: false,
      datas: [],
      userMap: {},
      comment: {},
      thumb: {},
      total: 0,
      current: 1,
      empty: false,
      haveMore: false,
      state: 'list',
      userInfo: {},
      // UI: '0',
      // CI: '',
      external_userid: "",
      backName: '',
      backUserIds: '',
      login2: {
        code: {}
      },
    };
  },
  methods: {
    getList(cur) {
      let signature = generateSignature3(
        this.$U || local.U() || this.UI,
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U() || this.UI,
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
        headers: { 'Company-Id': this.CI }
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
          this.datas = (cur == 1 || cur == undefined) ? res.data : this.datas.concat(res.data);
          // qq.config.empty = qq.data.length > 0 ? false : true;
          this.empty = this.datas.length > 0 ? true : false;
          this.userMap = Object.assign(this.userMap, res.user);
          this.comment = Object.assign(this.comment, res.comment);
          this.thumb = Object.assign(this.thumb, res.thumb);
          this.total = res.totalPageCount;
          console.log(this.$U || local.U() || this.UI)
          this.userInfo = {
            nick: res.user[this.$U || local.U() || this.UI]?.nickname || '粉丝' + this.UI.substring(11 - 4),
            background: res.user[this.UI]?.background || 'http://ego-file.soperson.com/itver/18600630743/20171016/33971508152959763.png',
            portrait: res.user[this.UI]?.portrait || 'http://ego-file.soperson.com/itver/13522008806/201712271708/85671523589501951.png'
          };
          this.masking = '';
          // setTimeout(() => {
          //   this.$toast.clear()
          // }, 800)
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
        this.$U || local.U() || this.UI,
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U() || this.UI,
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
        headers: { 'Company-Id': this.CI }
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
          curLid: this.$U || local.U() || this.UI,
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
          userId: this.$U || local.U() || this.UI,
          curLogin: this.$U || local.U() || this.UI,
        },
      })
        .then((res) => {
          this.userInfo = res;
          this.s = '';
        })
        .catch((error) => {
          console.log(error, 'error');
        });
    },
    async getCompId(code) {
      // 获取用户信息
      this.$get("/wx-crm-server/wx/get/userinfo", {
        params: {
          code: code,
        },
      })
        .then(
          await function (res) {
            if (res.data.compId ?? res.data.open_userid) {
              sessionStorage.setItem("compIdFriend", res.data.compId); // 保存openID 解绑用
            }
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    getname() { // 获取名字;
      this.$get("/wx-crm-server/wx/get/customer/info", {
        params: {
          external_userid: this.external_userid,
          itrId: JSON.parse(sessionStorage.getItem('RouteQuery')).userId,
        },
      }).then((res) => {
        if (res.data && res.data.external_contact && res.data.external_contact.name) {
          this.backName = res.data.external_contact.name;
        } else {
          this.backName = this.backUserIds;
        }
      }).catch(function (error) {
        this.backName = this.backUserIds;
      });
    },
    pushText() { // 推送;
      this.$get("/work/message/push", {
        params: {
          type: 'text',
          itrId: this.UI,
          compId: this.CI,
          text: '客户访问了你的朋友圈。',
          // text: `客户【${this.backName}】打开了你的朋友圈。`,
        },
      }).then((res) => {
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      });
    }
  },
  async created() {
  },
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
    z-index: 100;
  }
}
</style>