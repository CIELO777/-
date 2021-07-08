<template>
  <div class="about">
    <van-search
      @clear="onCancel"
      v-model="search"
      show-action
      placeholder="搜索批注内容"
      class="navbar"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <linkman
      ref="mychild"
      @userIDLength="userIDLengths"
      @userIdSave="userIdSaves(arguments)"
      @pullRefresf="onRefresh(1)"
      v-if="data.length > 0"
      :list="data"
      :totals="total"
      :users="user"
      :userMaps="userMap"
      @chengParentCur="chengParentCurs"
      padding="48px"
      label="Seas"
    ></linkman>
    <van-empty
      v-else
      class="van-empty"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
    />
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3, generateSignature } from '../uilts/tools';
import linkman from '../components/linkman';
let timeout = generateTimeout()
let nonce = generateNonce();
import sha1 from '../uilts/sha1';
import local from '../uilts/localStorage';
import Utils from '../uilts/utils';
import navBar from '../components/NavBar';
import communication from "../uilts/communication";
import wxxx from '../uilts/wxconfig'
import { pullMixin } from '@/uilts/pull';
export default {
  name: 'Common',
  inject: ['reload', 'unbind'],
  mixins: [pullMixin],
  data() {
    return {
      data: [],
      user: {},
      userMap: {},
      total: 0,
      empty: false,
      timestamp: "",
      noncestr: "",
      appId: "",
      appid2: "",
      timestamp2: "",
      noncestr2: "",
      signature2: "",
      jsapi2: "",
      mode: 'list', // 监听是搜索还是默认列表
      SearchtotalPageCount: 0,
      updateIndex: -1,
      search: '',
      fuzzy: '',
      isLoading: false,
      successtext: ''
    }
  },
  methods: {
    getLists(datas, id) {// 下拉联系人列表
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
      let signature = generateSignature3(this.$U || local.U(), this.$C || local.C(), timeout, nonce)
      let data = {
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        current: datas || 1,
        size: 20,
        nonce,
        timeout,
        signature,
        starLevel: 5,
      };
      this.$get('/api/request/itr/comp/customer/query', {
        params: data,
      })
        .then(function (res) {
          if (!res.error) {
            that.data = datas == 1 ? res.data : that.data.concat(res.data);
            that.userMap = Object.assign(that.userMap, res.user);
            that.user = res.user;
            that.total = res.totalPageCount;
            that.$refs?.mychild?.$toast.clear();
            if (that.data.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.successtext = '刷新成功';
            that.$toast.clear(); //清除弹框
          } else if (res.error) {
            that.successtext = '刷新失败';
            that.$toast.fail('乐语营销架构过期')
          }
          that.isLoading = false;  // 如果是刷新的情况那么就 关闭刷新状态
        })
        .catch(function (error) {
          that.isLoading = false;  // 如果是刷新的情况那么就 关闭刷新状态
          that.successtext = '刷新失败';
          console.log(error);
          that.$toast.fail('请求失败，请稍后再试');
        });
    },
    getList(datas, id) {// 下拉联系人列表
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce)
      let data = {
        auditToId: this.$U || local.U(),
        auditToHide: 0,
        compId: this.$C || local.C(),
        timeout: timeout,
        nonce: nonce,
        signature: signature,
        current: datas || 1,
        size: 20,
      };
      if (this.fuzzy) {
        data.fuzzy = this.fuzzy;
      };
      let arr = this.data;
      if (arr.length > 100) {
        arr = []
      }
      this.$get('/api/request/itr/comp/customer/record/result', {
        params: data,
      })
        .then((res) => {
          let qqd = [];
          if (datas == 1) { // 等于1直接把获取的数据赋值；
            qqd = res.data
          } else { // 不等第一页时候需要判断，如果updateIndex 这个参数为-1证明用户没点击过，非0直接从数据中删除
            if (this.updateIndex == -1) {
              qqd = arr.concat(res.data) // 没点击过直接赋值；
            } else {
              var item = arr.concat(res.data);
              var cc = item.splice(this.updateIndex, 1)
              qqd = item;
            }
          }
          this.userMap = Object.assign(this.userMap, res.user);
          this.data = qqd;
          this.total = res.totalPageCount;
          this.successtext = '刷新成功';
          this.isLoading = false;  // 如果是刷新的情况那么就 关闭刷新状态
          this.$toast.clear();
        })
        .catch((error) => {
          this.isLoading = false;  // 如果是刷新的情况那么就 关闭刷新状态
          this.successtext = '刷新失败';
          this.$toast.fail('请求失败，请稍后再试');
        });
    },
    totalLodding() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 800, // 持续展示 toast
      });
    },
    userIDLengths() {
      this.$toast({
        message: '只能关联一个外部联系人',
        position: 'bottom',
      });
    },
    userIdSaves(data) {   // 选择联系人保存成功
      this.saveWxCrm(data[0], data[1], data[2], data[3])
    },
    saveWxCrm(wxcrm, id, phone, idx) {  // 保存联系人接口
      let that = this;
      let crm = {};
      crm.id = id; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = wxcrm; phone
      // crm.phone = phone;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(async (res) => {
          if (res.error === 'success') {
            this.$toast({
              message: '关联外部联系人成功',
              position: 'bottom',
            });
            // this.getList(cur,id);
            // this.reload();
            this.data[idx].wxCrmId = wxcrm;
          } else {
            this.$toast({
              message: res.errMsg,
              position: 'bottom',
            });
          };
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    searcHome(newValue, cur) {  // 首页搜索
      let signature = generateSignature3(this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      let param = new URLSearchParams();
      param.append("type", 1);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("fuzzy", newValue);
      param.append("current", cur);  // 默认页数是1
      param.append("signature", signature);
      param.append("starLevel", 5);
      this.$post1('/api/request/itr/comp/customer/query', param
      ).then((res) => {
        if (res.data.length !== 0) { // 触发子组件传参，因为搜索和初始数据分页是不同的；
          this.mode = 'search';
          this.SearchtotalPageCount = res.totalPageCount;
          this.data = cur == 1 ? res.data : this.data.concat(res.data);
        } else {
          this.$toast({
            message: '未查询到相关内容',
            position: 'bottom',
          });
        }
      })
        .catch(function (error) {
        });
    },
    // 触发滚页方法from
    // 触发滚页方法
    chengParentCurs(data) {
      console.log(this.mode, data, 'common')
      if (sessionStorage.getItem("route") == 'LinkDetailed' || sessionStorage.getItem("route") == 'Addcustomer') return;// 如果是 LinkDetailed 就return掉
      if (this.mode === 'list') { // mode 是判断是否是搜索分页还是列表分页 
        this.$toast.loading('加载中...');
        // this.current = data;  // 备份当前的页数，目的微=为了保存时候获取到请求的当页数
        this.getList(data)
      } else if (this.mode === 'search') {
        if (this.SearchtotalPageCount < data) return;
        // this.currentSearch = data;  // 备份当前的页数，目的微=为了保存时候获取到请求的当页数
        this.$toast.loading('加载中...');
        this.searcHome(this.$store.state.SearchValue, data)
      } else if (this.mode === 'my') {  // 我的客户
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(0, data)
      } else if (this.mode === 'today') { // 今日新增
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(1, data)
      } else if (this.mode === 'noweekly') { // 一周未联系
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(2, data);
      } else if (this.mode === 'nomonth') {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(3, data);
      } else if (this.mode === 'never') {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(4, data);
      } else if (this.mode === 'yesterday') {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(5, data);
      } else if (this.mode === 'TodayContact') {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(6, data);
      } else if (this.mode === 'seven') {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(7, data);
      } else if (this.mode === 'lastMonth') {
        if (this.SearchtotalPageCount < data) return;
        this.$toast.loading('加载中...');
        this.$refs.navBar.menuChange(8, data);
      }
    },
    Typefilters(data) { // 通过类型过滤后的数据
      this.empty = false; // 关闭空加载
      if (!data?.[1]) { // 如果页数为undefined 就清空state中cur
        this.$store.commit("ClearCurNum", "common"); // 清空当前页数
        this.$toast({
          message: '查询成功',
          position: 'bottom',
        });
      }; // 如果
      this.data = data?.[1] ? this.data.concat(data[0].data) : data[0].data;
      this.SearchtotalPageCount = data[0].totalPageCount;
    },
    ClearLists() { // 清空数组
      try {
        this.data = this.data.length = 0;
        this.empty = true;
      } catch (err) {
      }
    },
    initscroll() { // 初始化滚动条
      this.$refs?.mychild?.initScroll()
    },
    unbindsss() { // 解绑
      this.unbind();
    },
    // 更新数据
    ManualUpdate(index, wxid) {
      this.data[index].wxCrmId = wxid;
      // console.log(this.data[index]);
    },
    firstLodding() {  // 初始化时候防流氓加载
      this.$toast.loading({
        message: "搜索中...",
        forbidClick: true,
        duration: 0, // 持续展示 toast
        forbidClick: true,
        overlay: true,
      });
    },
    onSearch(val) {
      console.log(this.search);
      this.fuzzy = this.search;
      this.getList(1)
      this.firstLodding()
    },
    onCancel() {
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.search = '';
      this.fuzzy = '';
      this.state = 'list';
      this.$store.commit('SearchfuzzyReset', 'off');
      this.getList(1)
    },
    onRefresh() {
      this.getList(1);
    }
  },
  async created() {
    this.totalLodding();
    this.getList();
    wxxx()

  },
  activated() {
    let index = sessionStorage.getItem('ManualIdx');
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.common;
    // 如果ManualData：true 证明姓名，电话，跟进记录修改过，这样的话就重新赋值把。
    let { nickName, company, sheet, gender } = this.$store.state.ManualData;
    try {  // 不为空的情况下回显手动更改数据
      if (nickName !== '') { this.data[index].nickname = nickName; }
      if (company !== '') { this.data[index].company = company; }
      if (sheet !== '') { this.data[index].lastContactRecord = sheet; }
      if (gender !== '') { this.data[index].gender = gender; }
    } catch (err) {
      console.log(err);
    }
    wxxx()
  },
  components: {
    linkman,
    navBar
  },
  watch: {
    "$store.state.SearchValue": {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          if (this.$route.name == 'Common') {
            this.initscroll(); // 搜索之前先清空scrolltop
            this.$store.commit("ClearCurNum", "common");
            this.searcHome(newValue, 1);  // 去搜索
          }
        }
      }
    },
    "$store.state.SearchMode": {
      deep: true,
      handler(newValue, oldValue) {
        this.mode = 'list';
        this.data.length = 0; // 重置数组
        this.getList();
      }
    }
  },
  destroyed() {
    this.$store.commit('destroyedSearch', '2');
  },
  mounted() {
    communication.$on('update', (msg) => {
      if (msg.route !== 'Common') return;
      // console.log(msg.route, 'Common');
      this.ManualUpdate(msg.index, msg.wxId)
    })
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (to.name == 'Common' && from.name == 'Addcustomer' && to.params.status == 'success') {
        vm.getList(1);
        document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      } else if (from.name === 'LinkDetailed') {  // 返回的时候消除小圆点
        let index = sessionStorage.getItem('ManualIdx');
        if (vm.data[index]) {
          try {
            vm.data[index].auditToRead = 1;
          }
          catch (err) {
            console.log('518')
          }
        }
      }
      vm.$store.commit("cache", "Home,Common,HighSeas");
    })
  },
}
</script>
<style  lang="less" scoped>
.about {
  background: #eee;
  height: 100vh;
  .navbar {
    height: 48px;
    z-index: 999;
    font-size: 0.32rem;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: #fff !important;
  }
  .van-empty {
    padding-top: 3rem;
  }
}
.pull /deep/ .van-pull-refresh__head {
  top: 45px;
}
</style>