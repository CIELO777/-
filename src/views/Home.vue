<template>
  <div class="home">
    <navBar
      @ClearList="ClearLists"
      :SearchtotalPageCounts="SearchtotalPageCount"
      ref="navBar"
      :modes.sync="mode"
      @Typefilter="Typefilters(arguments)"
      @unbinds="unbindsss"
      :short.sync="short"
      :shortPop.sync="shortPop"
      :shortTitle="shortTitle"
      @scrollTop="scrollTops"
      :mergeData="{
        orderStatus,
        status,
        starLeve,
      }"
    ></navBar>
    <img
      src="https://dist.jiain.net/mall/images/registerBackground.jpg"
      alt=""
      style="width: 100%"
      v-show="show"
    />
    <!-- <van-pull-refresh
      class="pull"
      :success-text="successtext"
      style="min-height: 100vh"
      head-height="40"
      v-model="isLoading"
      @refresh="onRefresh"
    > -->
    <linkman
      @userIDLength="userIDLengths"
      @userIdSave="userIdSaves(arguments)"
      @pullRefresf="onRefresh(1)"
      @click="onRefresh"
      ref="mychild"
      v-if="data.length > 0"
      :list="data"
      :totals="total"
      :users="user"
      :userMaps="userMap"
      @chengParentCur="chengParentCurs"
      padding="89px"
      :sb="caonim"
    >
    </linkman>
    <van-empty
      v-else
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
    />
    <!-- </van-pull-refresh> -->
    <!-- 企业微信验证码 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '45%' }"
      overlay-class="popup"
    >
      <div class="hint">
        <van-icon name="warning" size="25px" />
        <p class="qy-hint">企业微信绑定</p>
      </div>
      <p class="qy-hint1">当前账号没有绑定乐语，请输入手机号进行绑定</p>
      <van-field
        v-model="sms"
        type="tel"
        center
        clearable
        label="手机号"
        class="inp"
        placeholder="请输入手机号"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="clicksendCode"
            :disabled="times < 60"
            >{{ sendings }}</van-button
          >
        </template>
      </van-field>
      <van-field
        v-model="codes"
        type="digit"
        center
        clearable
        label="验证码"
        class="inp"
        placeholder="请输入验证码"
      >
        <template #button>
          <van-button
            size="small"
            type="danger"
            @click="bindlooyuCode"
            class="bind"
            >绑定</van-button
          >
        </template>
      </van-field>
    </van-popup>
    <!-- 快捷搜索弹框 -->
    <van-popup v-model="shortPop" :style="{ width: '60%' }" class="shortPop">
      <!-- 选择成交状态 -->
      <div v-show="short == 1">
        <h2>选择成交状态</h2>
        <p class="shortRow" @click="clickShort('0')">未成交</p>
        <p class="shortRow" @click="clickShort('1')">已成交</p>
        <p class="shortRow" @click="clickShort('99')">全部</p>
      </div>
      <!-- 有效性 -->
      <div v-show="short == 2">
        <h2>选择有效性</h2>
        <p class="shortRow" @click="clickShort('0')">无效</p>
        <p class="shortRow" @click="clickShort('1')">未知</p>
        <p class="shortRow" @click="clickShort('2')">有效</p>
        <p class="shortRow" @click="clickShort('99')">全部</p>
      </div>
      <!-- 修改星级 -->
      <div v-show="short == 3">
        <h2>选择等级</h2>
        <p class="shortRow" @click="clickShort('0')">未知</p>
        <p class="shortRow" @click="clickShort('1')">一星</p>
        <p class="shortRow" @click="clickShort('2')">二星</p>
        <p class="shortRow" @click="clickShort('3')">三星</p>
        <p class="shortRow" @click="clickShort('4')">四星</p>
        <p class="shortRow" @click="clickShort('5')">五星</p>
        <p class="shortRow" @click="clickShort('99')">全部</p>
      </div>
    </van-popup>
  </div>
</template>
<script>
// @ is an alias to /src
import linkman from "../components/linkman";
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
  generateSignature,
  generateSignature8,
  generateSignature4,
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import sha1 from "../uilts/sha1";
import local from "../uilts/localStorage";
// import Utils from "../uilts/utils";
// import Update from "../uilts/update";
import wxxx from '../uilts/wxconfig'

import navBar from "../components/NavBar";
import { pullMixin } from '@/uilts/pull';
import communication from "../uilts/communication";
export default {
  name: "Home",
  inject: ["reload", "unbind"],
  mixins: [pullMixin],
  data() {
    return {
      count: 0,
      data: [],
      user: {},
      userMap: {},
      sms: "",
      show: false,
      UserId: "",
      open_userid: "",
      CorpId: "",
      total: 0,
      sendings: "发送验证码",
      times: 60,
      codes: "",
      empty: false,
      timestamp: "",
      noncestr: "",
      appId: "",
      appid2: "",
      timestamp2: "",
      noncestr2: "",
      jsapi2: "",
      signature2: "",
      timer: "",
      mode: "list", // 监听是搜索还是默认列表
      SearchtotalPageCount: 0,
      current: 0,
      currentSearch: 0,
      short: '',
      shortPop: false,
      shortTitle: ['成交状态', '有效性', '联系人等级'],
      caonim: '',
      orderStatus: undefined,
      status: undefined,
      starLeve: undefined,
      isLoading: false,
      successtext: '',
    };
  },
  components: {
    linkman,
    navBar,
  },
  methods: {
    scrollTops() {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    async getList(datas, params) {
      // 下拉联系人列表
      let that = this;
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        current: datas || 1,
        size: 20,
        nonce,
        timeout,
        signature,
      };
      (this.orderStatus) === undefined || (this.orderStatus) === '99' ? "" : data.orderStatus = this.orderStatus;
      (this.status) === undefined || (this.status) === '99' ? "" : data.status = this.status;
      (this.starLeve) === undefined || (this.starLeve) === '99' ? "" : data.starLevel = this.starLeve;
      if (params && Object.keys(params).length > 0) {
        for (const key in params) {
          data[key] = params[key];
        }
      }
      this.$get("/api/request/itr/comp/customer/query", {
        params: data,
      }).then(function (res) {
        if (!res.error) {
          res.data.forEach(item => { // 云外呼处理
            if (item.phone && item.workNumber) {
              item.YunCall = [item.phone];
            } else if (item.phone) {
              item.YunCall = [item.phone]
            } else if (item.workNumber) {
              item.YunCall = [item.workNumber]
            }
          })
          that.data = datas == 1 || !data ? res.data : that.data.concat(res.data);
          that.userMap = Object.assign(that.userMap, res.user);
          that.user = res.user;
          that.total = res.totalPageCount;
          sessionStorage.setItem("active", "Home");
          that.$refs?.mychild?.$toast.clear();
          if (that.data.length == 0) that.empty = true; //如果数据大于0，就显示空信息
          sessionStorage.setItem("TabIndex", 6); // 因为触底分页需要，一进项目设置为数字6
          that.successtext = '刷新成功';
        } else if (res.error) {
          that.successtext = '刷新失败';
          that.$toast.fail("乐语营销架构过期");
        }
        setTimeout(() => {
          that.ClearToast();
        }, 500)
        that.isLoading = false;  // 如果是刷新的情况那么就 关闭刷新状态
      })
        .catch(function (error) {
          console.log(error);
          that.isLoading = false;  // 如果是刷新的情况那么就 关闭刷新状态
          that.successtext = '刷新失败';
          that.$toast.fail("请求失败，请稍后再试");
        });
    },
    getURl() {
      // 没有code 获取code
      let url = window.location.href;
      location.href =
        "https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=" + url;
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
    userIDLengths(data) {
      // 判断联系人长度，如果长度大于1，那么就弹窗
      this.$toast({
        message: "只能关联一个外部联系人",
        position: "bottom",
      });
    },
    userIdSaves(data) {
      // 选择联系人保存成功 
      this.saveWxCrm(data[0], data[1], data[2], data[3]);
      // this.$nextTick(() => {
      // this.getList(3);
      // })
    },
    saveWxCrm(wxcrm, id, phone, idx) {
      // 保存联系人接口
      let crm = {};
      crm.id = id; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = wxcrm;
      // crm.phone = phone;
      let signature = generateSignature3(
        crm.id,
        crm.itrId,
        crm.compId,
        timeout,
        nonce
      );
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(async (res) => {
          if (res.error === "success") {
            this.$toast({
              message: "关联外部联系人成功",
              position: "bottom",
            });
            // 更新 wxCrmId,保证页面不刷新，
            this.data[idx].wxCrmId = wxcrm;
            // this.data[idx].wxCrmId = wxcrm;
            // this.getList(datas, id) // 更新联系人列表；传入页数，id 去查询这个ID 然后单独更新
            // this.reload();
          } else {
            this.$toast({
              message: res.errMsg,
              position: "bottom",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    searcHome(newValue, cur) {
      // 首页搜索
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("type", 1);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("fuzzy", newValue);
      param.append("current", cur); // 默认页数是1
      param.append("signature", signature);
      this.$post1("/api/request/itr/comp/customer/query", param)
        .then((res) => {
          if (res.data.length !== 0) {
            // 触发子组件传参，因为搜索和初始数据分页是不同的；
            this.mode = "search";
            this.SearchtotalPageCount = res.totalPageCount;
            this.data = cur == 1 ? res.data : this.data.concat(res.data);
          } else {
            this.$toast({
              message: "未查询到相关内容",
              position: "bottom",
            });
            this.data.length = 0;
          }
        })
        .catch(function (error) { });
    },
    // 触发滚页方法
    chengParentCurs(data) {
      if (sessionStorage.getItem("route") == 'LinkDetailed' || sessionStorage.getItem("route") == 'Addcustomer') return;// 如果是 LinkDetailed 就return掉
      if (this.mode === "list") {
        // mode 是判断是否是搜索分页还是列表分页
        this.$toast.loading("加载中...");
        // this.current = data;  // 备份当前的页数，目的微=为了保存时候获取到请求的当页数
        this.getList(data);
      } else if (this.mode === "search") {
        if (this.SearchtotalPageCount < data) return;
        // this.currentSearch = data;  // 备份当前的页数，目的微=为了保存时候获取到请求的当页数
        this.$toast.loading("加载中...");
        this.searcHome(this.$store.state.SearchValue, data);
      } else if (this.mode === "my") {
        // 我的客户
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(0, data);
      } else if (this.mode === "today") {
        // 今日新增
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(1, data);
      } else if (this.mode === "noweekly") {
        // 一周未联系
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(2, data);
      } else if (this.mode === "nomonth") {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(3, data);
      } else if (this.mode === "never") {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(4, data);
      } else if (this.mode === "yesterday") {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(5, data);
      } else if (this.mode === "TodayContact") {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(6, data);
      } else if (this.mode === "seven") {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(7, data);
      } else if (this.mode === "lastMonth") {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading("加载中...");
        this.$refs.navBar.menuChange(8, data);
      }

    },
    Typefilters(data) {
      // 通过类型过滤后的数据
      this.empty = false; // 关闭空加载
      if (!data?.[1]) {
        // 如果页数为undefined 就清空state中cur
        this.$store.commit("ClearCurNum", "home"); // 清空当前页数
        this.$toast({
          message: "查询成功",
          position: "bottom",
        });
      } // 如果
      this.data = data?.[1] ? this.data.concat(data[0].data) : data[0].data;
      this.SearchtotalPageCount = data[0].totalPageCount;
      // setTimeout(() => {
      // this.initscroll();
      // }, 800)
    },
    ClearLists() {
      // 清空数组
      this.data = this.data.length = 0;
      this.empty = true;
    },
    initscroll() {
      // 初始化滚动条
      this.$refs?.mychild?.initScroll();
    },
    unbindsss() {
      // 解绑
      this.unbind();
    },
    ClearToast() {
      this.$toast.clear(); //清除弹框
    },
    // 更新数据
    ManualUpdate(index, wxid) {
      this.data[index].wxCrmId = wxid;
    },
    clickShort(data) {
      if (this.short == 1) {
        switch (Number(data)) {
          case 0:
            this.shortTitle[0] = '未成交';
            this.$set(this.shortTitle, 0, '未成交')
            break;
          case 1:
            this.shortTitle[0] = '已成交';
            this.$set(this.shortTitle, 0, '已成交')
            break;
          case 99:
            this.shortTitle[0] = '全部';
            this.$set(this.shortTitle, 0, '全部')
            break;
        }
        this.orderStatus = data;
      } else if (this.short == 2) {
        switch (Number(data)) {
          case 0:
            this.shortTitle[1] = '无效';
            this.$set(this.shortTitle, 1, '无效')
            break;
          case 1:
            this.shortTitle[1] = '未知';
            this.$set(this.shortTitle, 1, '未知')
            break;
          case 2:
            this.shortTitle[1] = '有效';
            this.$set(this.shortTitle, 1, '有效')
            break;
          case 99:
            this.shortTitle[1] = '全部';
            this.$set(this.shortTitle, 1, '全部')
            break;
        }
        this.status = data;
      } else {
        switch (Number(data)) {
          case 0:
            this.shortTitle[2] = '未知';
            this.$set(this.shortTitle, 2, '未知')
            break;
          case 1:
            this.shortTitle[2] = '一星客户';
            this.$set(this.shortTitle, 2, '一星客户')
            break;
          case 2:
            this.shortTitle[2] = '二星客户';
            this.$set(this.shortTitle, 2, '二星客户')
            break;
          case 3:
            this.shortTitle[2] = '三星客户';
            this.$set(this.shortTitle, 2, '三星客户')
            break;
          case 4:
            this.shortTitle[2] = '四星客户';
            this.$set(this.shortTitle, 2, '四星客户')
            break;
          case 5:
            this.shortTitle[2] = '五星客户';
            this.$set(this.shortTitle, 2, '五星客户')
            break;
          case 99:
            this.shortTitle[2] = '全部';
            this.$set(this.shortTitle, 2, '全部')
            break;
        }
        this.starLeve = data;
      }
      this.getList(1, this.$refs.navBar.Params);
      this.shortPop = false;
    },
    onRefresh() {
      this.getList(1)
    },
  },
  async activated() {
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.home; // 设置每个页面的scrollTop
    // 如果ManualData：true 证明姓名，电话，跟进记录修改过，这样的话就重新赋值把。
    let index = sessionStorage.getItem('ManualIdx');
    let { nickName, company, sheet, gender, userId, name } = this.$store.state.ManualData;
    try {  // 不为空的情况下回显手动更改数据
      if (nickName !== '') { this.data[index].nickname = nickName; }
      if (company !== '') { this.data[index].company = company; }
      if (sheet !== '') { this.data[index].lastContactRecord = sheet; }
      if (gender !== '') { this.data[index].gender = gender; }
      if (userId !== '') {
        if (this.data[index]) {
          this.data[index].ownerId = userId;
          this.caonim = name;
          this.$set(this.data[index], 'ownerId', userId);
        }
      }

    } catch (err) {
      console.log(err);
    }
    wxxx(); // 拉取企业微信授权接口---统一封装
  },
  async created() {
    if (sessionStorage.getItem('userinfo')) {
      this.loading();
      this.getList(); // 就去请求列表
      wxxx(); // 拉取企业微信授权接口---统一封装
    } else {
      this.$toast.fail({
        message: '此模块不支持聊天工具栏。',
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
    }

  },
  watch: {
    "$store.state.SearchValue": {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          if (this.$route.name == 'Home') {  // 因为页面都缓存了，所以第一遍没问题，当页面缓存了之后，wathc会监听三个页面的搜素值的改变
            this.initscroll(); // 搜索之前先清空scrolltop
            this.$store.commit("ClearCurNum", "home");
            this.searcHome(newValue, 1); // 去搜索

          }
        }
      },
    },
    "$store.state.SearchMode": {
      deep: true,
      handler(newValue, oldValue) {
        this.mode = "list";
        this.data.length = 0; // 重置数组
        this.getList();
      },
    },

  },
  mounted() {
    communication.$on('update', (msg) => {
      if (msg.route !== 'Home') return;
      this.ManualUpdate(msg.index, msg.wxId)
    })
    communication.$on('callTel', (id) => {  // 首页电话按钮触发跟进记录
      // this.HometelClicks(id)
    })
    communication.$on('release', (msg, data) => {// 动态给公海追加数据;
      let ChangeData = this.data[msg];
      this.data.splice(msg, 1) // 本地删除原数组
      let name = JSON.parse(sessionStorage.getItem('userinfo')).nickname
      ChangeData.ownerType = data;
      ChangeData.ownerId = "0"
      let str = '';
      if (data == 0) {
        str = '释放联系人到公司公海'
      } else if (data == 1) {
        str = '释放联系人到分公司公海'
      } else if (data == 2) {
        str = '释放联系人到部门公海'
      } else if (data == 4) {
        str = '释放联系人到个人公海'
      }
      ChangeData.lastContactRecord = name + str;
      communication.$emit("AddDatabase", ChangeData, data);
    })
    communication.$on('linkman', (msg) => {
      this.data.unshift(msg);
    })
    communication.$on('collectLinkman', (str, data, id, type) => { // 公海拾取的追加到联系人上
      let result = data;
      result.ownerId = id;
      result.lastContactRecord = str;
      result.ownerType = type; // 将ownerTYpe类型赋值为3
      this.data.unshift(result);
    });
  },
  destroyed() {
    this.$store.commit("destroyedSearch", "1");
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (to.name == 'Home' && from.name == 'Addcustomer' && to.params.status == 'success') {
        vm.getList(1);
        document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      }
      vm.$store.commit("cache", "Home,Common,HighSeas");
    })
  },
};
</script>
<style lang="less" scoped>
.home {
  height: 100vh;
  background: #eee;
}
.hint {
  display: flex;
  margin-top: 0.3rem;
}
.hint i {
  margin-top: 8px;
}
.qy-hint {
  font-size: 0.4rem;
  margin: 8px 8px;
  font-weight: 900;
  margin-top: 8px;
  color: #000;
}
.qy-hint1 {
  font-size: 0.28rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 11px;
  line-height: 30px;
}
.home .van-popup {
  padding: 0 20px;
  width: 90%;
  background: #f1f1f1;
}
@field-label-width {
  width: 0.2rem;
}
.bind {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
}
.van-empty {
  padding-top: 3rem;
}
.pull /deep/ .van-pull-refresh__head {
  // 改变下拉框的提醒位置
  top: 85px;
}
.shortcut {
  height: 40px;
  width: 100%;
  background: red;
}
.shortPop {
  font-size: 0.28rem;
  text-align: center;
  padding: 0 !important;
  background: #fff !important;
  border-radius: 10px;
  h2 {
    height: 40px;
    line-height: 40px;
    font-weight: 600;
    border-bottom: 0.5px solid #eee;
  }
  .shortRow {
    height: 40px;
    line-height: 40px;
    border-bottom: 0.5px solid #eee;
  }
}
</style>
