  <template>
  <div class="about">
    <navBar
      @unbinds="unbindsss"
      @ClearList="ClearLists"
      @Typefilter="Typefilters(arguments)"
      ref="navBar"
      :SearchtotalPageCounts="SearchtotalPageCount"
      :modes.sync="mode"
      @fastComp="fastComp"
      :contactStatus.sync="contactStatus"
    ></navBar>
    <linkman
      ref="mychild"
      @userIDLength="userIDLengths"
      @userIdSave="userIdSaves(arguments)"
      @chengParentCur="chengParentCurs"
      @pullRefresf="onRefresh(1)"
      :totals="total"
      label="Seas"
      v-if="data.length > 0"
      :list="data"
      :users="user"
      :userMaps="userMap"
      padding="85px"
    >
    </linkman>
    <van-empty
      v-else
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
import navBar from '../components/NavBar';
import communication from "../uilts/communication";
import { pullMixin } from '@/uilts/pull'
import wxxx from '../uilts/wxconfig'
export default {
  name: 'HighSeas',
  inject: ['reload', 'unbind'],
  mixins: [pullMixin],
  data() {
    return {
      isLoading: false,
      data: [],
      user: {},
      userMap: {},
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
      ownerType: 0,
      contactStatus: 9  //顶部时间筛选的数值
    }
  },
  methods: {
    getList(datas, params) {// 下拉联系人列表
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
      let signature = generateSignature3(this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      let data = {
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        current: datas || 1,
        size: 20,
        nonce,
        timeout,
        signature,
        type: 1,
        ownerId: 0,
        ownerType: this.ownerType
      };
      if (this.contactStatus && this.contactStatus !== 9) {
        data.contactStatus = this.contactStatus;
      }
      // // 追加日期等参数
      if (params && Object.keys(params).length > 0) {
        for (const key in params) {
          data[key] = params[key]
        }
      }
      this.$get('/api/request/itr/comp/customer/query', {
        params: data,
      })
        .then(function (res) {
          if (!res.error) {
            res.data.forEach(item => { // 云外呼处理
              if (item.workNumber) {
                item.YunCall = [item.phone, item.workNumber];
              }
            })
            that.data = datas == 1 ? res.data : that.data.concat(res.data);
            if (that.data.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.userMap = Object.assign(that.userMap, res.user);
            that.user = res.user;
            that.total = res.totalPageCount;
            that.successtext = '刷新成功';
            that.$refs?.mychild?.$toast.clear();
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
          that.$toast.fail('请求失败，请稍后再试');

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
      crm.wxCrmId = wxcrm;
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
            // this.reload();
            // 更新 wxCrmId,保证页面不刷新，
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
      param.append("ownerId", 0);

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
    chengParentCurs(data) {
      console.log(this.mode, 'this.mode')
      if (sessionStorage.getItem("route") == 'LinkDetailed' || sessionStorage.getItem("route") == 'Addcustomer') return;// 如果是 LinkDetailed 就return掉
      if (this.mode === 'list') { // mode 是判断是否是搜索分页还是列表分页 
        this.$toast.loading('加载中...');
        this.current = data;  // 备份当前的页数，目的微=为了保存时候获取到请求的当页数
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
        this.$store.commit("ClearCurNum", "highseas"); // 清空当前页数
        this.$toast({
          message: '查询成功',
          position: 'bottom',
        });
      }; // 如果
      this.data = data?.[1] ? this.data.concat(data[0].data) : data[0].data;
      this.SearchtotalPageCount = data[0].totalPageCount;
    },
    ClearLists() { // 清空数组
      this.data.length = 0;
      this.data = [];
      this.empty = true;
    },
    initscroll() { // 初始化滚动条
      this.$refs?.mychild?.initScroll()
    },
    unbindsss() {
      this.unbind();
    },
    // 更新数据
    ManualUpdate(index, wxid) {
      this.data[index].wxCrmId = wxid;
    },
    fastComp(data) {
      this.ownerType = data;
      this.data.length = 0;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList(1, this.$refs.navBar.Params);
      console.log(this.$refs.navBar.Params)
    },
    onRefresh() { // 下拉刷新
      this.getList(1)
    }
  },
  async created() {
    this.totalLodding();
    this.getList();
    wxxx();
  },
  async activated() {
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.highseas;
    // 如果ManualData：true 证明姓名，电话，跟进记录修改过，这样的话就重新赋值把。
    let index = sessionStorage.getItem('ManualIdx');
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
          console.log(newValue, 'hai')
          console.log(this.$route.name)
          if (this.$route.name == 'HighSeas') {
            this.initscroll(); // 搜索之前先清空scrolltop
            this.$store.commit("ClearCurNum", "highseas");
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
    this.$store.commit('destroyedSearch', '3')
  },
  mounted() {
    communication.$on('update', (msg) => {
      if (msg.route !== 'HighSeas') return;
      this.ManualUpdate(msg.index, msg.wxId);
    })
    communication.$on('AddDatabase', (msg, data) => {
      console.log(data, this.ownerType)
      if (data == this.ownerType || this.ownerType == 9) {
        // 只有当 Home页面的释放类型和当前的标签类型一样时候才会进行追加
        this.data.unshift(msg);
      }
    })
    communication.$on('AssignContacts', (msg, data) => { // 接收公海分配过来的输
      console.log(data)
      let ChangeData = this.data[msg];
      this.data.splice(msg, 1) // 本地删除原数组
      let name = JSON.parse(sessionStorage.getItem('userinfo')).nickname
      ChangeData.ownerId = data.userId;
      ChangeData.lastContactRecord = name + '给' + data.nickname + '分配了一个联系人';
      communication.$emit("linkman", ChangeData);
    })
    communication.$on('collect', (msg, str, data, id, type) => { // 公海拾取操作。删除公海的数据并追加联系人的数据
      this.data.splice(msg, 1) // 本地删除原数组
      console.log(str, data, id, type)
      communication.$emit("collectLinkman", str, data, id, type);
    })
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (to.name == 'HighSeas' && from.name == 'Addcustomer' && to.params.status == 'success') {
        vm.getList(1);
        document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      }
      vm.$store.commit("cache", "Home,Common,HighSeas");
    })
  },
  // beforeRouteLeave(to, from, next) {
  //   if (from.name == 'HighSeas') {
  //     if (to.name === 'Navigation') {
  //       next();
  //     } else {
  //       next();
  //     }
  //   } else {
  //     next();
  //   }
  // }
}
</script>

<style lang="less" scoped>
.about {
  height: 100vh;
  background: #eee;
  // height: calc(~"100% - 98px");
  .van-empty {
    padding-top: 3rem;
  }
  .pull /deep/ .van-pull-refresh__head {
    // 改变下拉框的提醒位置
    top: 85px;
  }
}
</style>
