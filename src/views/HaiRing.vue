<template>
  <div class="haiRing">
    <div :style="masking"></div>
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
import HaiRingView from '../components/HaringView/HaringViews';
export default {
  name: "HaiRing",
  components: { HaiRingView },
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
      UI: '0',
      UN: '',
      CI: '',
      external_userid: "",
      backName: '',
      backUserIds: ''
    };
  },
  methods: {
    async getList(cur) {
      let signature = generateSignature3(
        this.$U || local.U() || this.UI,
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U() || this.UI,
        nonce: nonce,
        // sort: "id",
        // direct: "desc",
        timeout: timeout,
        signature: signature,
        current: cur || 1,
        size: 20,
        type: this.type,
        categroyId: 1
      };
      this.$get("/api/request/itr/page/material/result", {
        params: data,
        // headers: { 'Company-Id': 12312312 }
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
          setTimeout(() => {
            this.$toast.clear()
          }, 800)
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
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getURl() {
      // 没有code 获取code
      let url = window.location.href;
      // console.log(this.entry, 'this.entrythis.entrythis.entrythis.entry')
      // console.log(this.CorpId, ' that.CorpId that.CorpId that.CorpId')
      // if (this.entry == 'single_chat_tools') { // 如果是通过单聊中进入的，那么就截取code
      if (url.includes('code')) {
        url = window.location.href.split('?code=')[0];
      }
      // }
      sessionStorage.setItem('RouteQuery', JSON.stringify(this.$route.query));
      // location.href = "https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=" + url;
      location.href = 'https://api.jiain.net/pay/wx/auth?compId=10000008&scope=snsapi_userinfo&state=0s&url=' + url;
    },
    async getUserinfo(code) {
      // 获取用户信息
      let that = this;
      // /wx-crm-server/wx/get/userinfo
      this.$get("/api/view/util/wx/user_info", {
        params: {
          code: code,
        },
      })
        .then(
          await function (res) {
            if (res.nickname && res.nickname !== "") {
              // that.external_userid = res.nickname; // 取名字用
              that.backName = res.nickname; // 备份IDs
              that.getList();
              // that.gethattory(); // 查看历史消息
              that.initMineInfo(); //
              that.pushText() // 推送
              // that.getname(); // 获取姓名
            } else {
              // that.getURl();
            }
          }
        )
        .catch(function (error) {
          console.log(error);
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
      this.$get("/wx-crm-server/message/push", {
        params: {
          type: 'text',
          itrId: JSON.parse(sessionStorage.getItem('RouteQuery')).userId,
          text: `客户【${this.backName}】打开了你的朋友圈。`,
        },
      }).then((res) => {
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      });
    },
  },
  async created() {
    if (sessionStorage.getItem('userinfo')) {
      this.masking = '';
      this.loading();
      this.initMineInfo(); // 头像,背景墙,
      this.getList();
      // this.getHistory(); // 查看历史消息
    } else {
      let code = this.$route.query.code;
      if (code) {
        this.loading();
        setTimeout(() => {
          this.masking = '';
        }, 800)
        let { compId, userId, userName } = JSON.parse(sessionStorage.getItem("RouteQuery"));
        this.UI = userId;
        console.log(this.UI, 'this.UI this.UI');
        console.log(compId, 'compIdcompIdcompIdcompIdcompIdcompId');
        sessionStorage.setItem("CompIdFriend", compId);
        this.UN = userName;
        this.CI = compId;
        await this.getUserinfo(code); //拿code 获取用户信息；
      } else {
        this.getURl(); // 没有code 请求code
      }
    }

    console.log(this.UI, 'this.UI ')
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