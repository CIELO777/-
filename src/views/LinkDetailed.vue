<template>
  <div class="detail">
    <!-- 联系人详情头部信息 -->
    <header>
      <img :src="info.portrait" alt="" />
      <div>
        <p style="padding-top: 2px">{{ info.nickname }}</p>
        <p>{{ !info.company ? "未填写公司名称" : info.company }}</p>
      </div>
    </header>
    <van-tabs
      swipeable
      v-model="active"
      :lazy-render="false"
      color="#51BBBA"
      @change="tabsChange"
      class="tabs"
    >
      <van-tab title="联系人信息">
        <keep-alive>
          <Forms
            :sourceData="sourceData"
            ref="forms"
            :form="form"
            :crmInfo="crmInfos"
            v-if="Object.keys(crmInfos).length > 0 && active == 0"
            :active.sync="active"
            @getCrm="getCrm"
          ></Forms>
        </keep-alive>
      </van-tab>
      <van-tab title="跟进记录">
        <keep-alive>
          <FollowPage v-if="active == 1"></FollowPage>
        </keep-alive>
      </van-tab>
      <van-tab title="订单">
        <keep-alive>
          <Order v-if="active == 2" ref="Order"></Order>
        </keep-alive>
      </van-tab>
      <van-tab title="日程">
        <keep-alive>
          <Agenda v-if="active == 3"></Agenda>
        </keep-alive>
      </van-tab>
      <van-tab title="操作记录">
        <keep-alive>
          <!-- {{active}} -->
          <Operating v-if="active == 4"></Operating>
        </keep-alive>
      </van-tab>
      <van-tab title="雷达">
        <keep-alive>
          <Radar v-if="active == 5"></Radar>
        </keep-alive>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
import FollowPage from '../components/FollowPage';
import Order from '../components/Order';
import Agenda from '../components/Agenda';
import Forms from '../components/Form';
import Operating from '../components/Operating';
import Radar from '../components/Radar';
import local from '../uilts/localStorage';
import communication from "../uilts/communication";
import { ImagePreview } from 'vant';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: 'LinkDetailed',
  data() {
    return {
      active: 0,
      navigationList: [
        { name: '客户信息' },
        { name: '跟进记录' },
        { name: '订单' },
        { name: '日程' },
        { name: '雷达' },
        { name: '操作记录' }
      ],
      CidList: [],
      crmInfos: {},
      form: [],
      formDiy: [],
      cooList: [
        "职员",
        "经理",
        "总监",
        "总经理",
        "董事长",
        "企业法人",
        "公司股东",
        "未知",
      ],
      sourceData: [],
      hackReset: true,
      componentKey: 0,
      info: {
        company: '',
        nickname: '',
        portrait: '',
      }
    }
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  activated() {
    let tabnum = sessionStorage.getItem('tabNum');
    if (tabnum == 1) {
      this.active = 1;
    } else if (tabnum == 2) {
      this.active = 2;
    } else if (tabnum == 3) {
      this.active = 3;
    } else if (tabnum == 0) {
      this.active = 0;
    }
    if (this.$route.params.userId) { // 如果参数，证明新增成功了
      this.$refs.Order.orderList.length = 0;
      this.$refs.Order.current = 1;
      this.$refs.Order.getOrderList()
    }
  },
  created() {
    let tabnum = sessionStorage.getItem('tabNum');
    if (tabnum == 1) {
      this.active = 1;
    } else if (tabnum == 2) {
      this.active = 2;
    } else if (tabnum == 3) {
      this.active = 3;
    } else if (tabnum == 0) {
      this.active = 0;
    }
    // sessionStorage.setItem('TabIndex', this.active)
    this.getCrm();
    this.getCid();
    ["portrait", "nickname", "company"].forEach((key) => { // 获info基本信息；
      if (key in JSON.parse(sessionStorage.getItem('_crm_info'))) {
        this.info[key] = JSON.parse(sessionStorage.getItem('_crm_info'))[key]
      }
    })
  },
  methods: {
    getCrm() { // 获取基本信息
      let that = this;
      let crmInfoId = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let signature = generateSignature3(this.$U || local.U(), this.$C || local.C(), crmInfoId, timeout, nonce);
      this.$get('/api/request/itr/comp/customer/detail', {
        params: {
          id: crmInfoId,
          compId: this.$C || local.C(),
          userId: this.$U || local.U(),
          nonce,
          timeout,
          signature: signature
        },
      })
        .then((res) => {
          if (!res.error) {
            let shareStr = '';
            res.share.forEach(item => { // 遍历循环字符串
              shareStr = shareStr + res.user[item.userId].nickname + ','
            })
            let ownerNickname = '';
            if (sessionStorage.getItem('active') === 'HighSeas') {
              if (res.ownerType == '0') {
                ownerNickname = '总公司公海'
              } else if (res.ownerType == '1') {
                ownerNickname = '分公司公海'
              } else if (res.ownerType == '2') {
                ownerNickname = '部门公海'
              } else if (res.ownerType == '4') {
                ownerNickname = '个人公海'
              }
            } else {
              ownerNickname = res.user[res.ownerId]?.nickname || '';
            }
            let a = {
              ...res,
              status: res.status == 0 ? '无效' : (res.status == 1 ? "未知" : "有效"),
              sourceType: res.sourceType == 0 ? '手动录入' : res.sourceType == 1 ? '表单导入' : '订单导入',
              itrNickname: res.user[res.creator].nickname,
              ownerNickname: ownerNickname,
              starLevel: this.conversionNum(res.starLevel),
              gender: res.gender == 2 ? '未知' : res.gender == 1 ? '男' : '女',
              companyOcc: this.cooList[res.companyOcc == -1 ? 7 : res.companyOcc],
              contactNumber: res.contactNumber + '次',
              orderStatus: res.orderStatus == 1 ? '已成交' : '未成交',
              paymentStatus: res.paymentStatus == 1 ? '已支付' : res.paymentStatus == 2 ? '部分支付' : '未支付',
              supplyStatus: res.supplyStatus == 0 ? '未发货' : '已发货',
              billStatus: res.billStatus == 0 ? '未开票' : '已开票',
              consumptionTotal: res.consumptionTotal + '元',
              consumptionNumber: res.consumptionNumber + '元',
              customSourceType: res.customSourceTitle,
              share: shareStr,
              share1: res.share,
              phone_back: res.phone,
              phone: res.phone && res.phone.replace(res.phone.substring(3, 7), "****")
            }
            that.crmInfos = a;
            that.info.nickname = res.nickname;
            that.info.company = res.company;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    conversionNum(data) {
      let result = '';
      if (data == 0) {
        result = '未知'
      } else if (data == 1) {
        result = '一星'
      } else if (data == 2) {
        result = '二星'
      } else if (data == 3) {
        result = '三星'
      } else if (data == 4) {
        result = '四星'
      } else if (data == 5) {
        result = '五星'
      }
      return result;
    },
    getCid() {
      // 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id;
      let signature = generateSignature3(compID, timeout, nonce);

      let data = {
        current: 1,
        size: 999,
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      this.$get("/api/request/itr/comp/customer/source/result", {
        params: data,
      })
        .then(function (res) {
          if (!res.error) {
            that.sourceData = res.data.map((item) => {
              return {
                ...item,
                name: item.title,
              };
            });
            // console.log(that.sourceData);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    findSourceType(item) {
      // console.log(item);
      this.sourceData.find(item => {
      })
    },
    tabsChange(e) {
      this.active = e;
      sessionStorage.setItem('TabIndex', e)
      sessionStorage.setItem('tabNum', e)  // 点击保存当前索引，目的返回上一层记忆上一次选中的标签
    },
    backgo() {
      let active = sessionStorage.getItem('active')
      if (active == 'Home') {
        this.$router.replace('/Home');
      } else if (active == 'Common') {
        this.$router.replace('/common');
      } else if (active == 'HighSeas') {
        this.$router.replace('/highSeas');
      } else if (active == 'Checking') {
        this.$router.replace('/checking');
      }
    },
  },
  components: {
    FollowPage,
    Order,
    Agenda,
    Forms,
    Operating,
    Radar
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (from.name == 'detailFilter') {
        vm.$store.commit("cache", "Home,Common,HighSeas,detailFilter");
      } else if (from.name == 'sheetimg') { // 跟进记录
        vm.$store.commit("cache", "Home,Common,HighSeas");
      } else if (from.name == 'OrderDetailInfo') {
        vm.$store.commit("cache", "Order,LinkDetailed");
      } else if (from.name == 'Addcustomer ') {
        vm.$store.commit("cache", "null");
      } else {
        vm.$store.commit("cache", "Home,Common,HighSeas,LinkDetailed");
      }
    })
  },
  beforeRouteLeave: (to, from, next) => {
    if (to.name === 'ChatCustomer') {
      next(false);
    } else {
      next();
    }
  },
  mounted() {
    communication.$on('updatecrm', (msg) => {
      this.getCrm()  // 共享联系人选择完毕重新拉去接口
    })
  }
}
</script>

<style lang="less" scoped>
.detail {
  font-size: 0.3rem;
  header {
    padding: 5px 20px;
    height: 80px;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    display: flex;
    align-items: center;
    img {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      margin-right: 10px;
    }
    > div {
      flex: 1;
      & p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      & p:first-child {
        margin-bottom: 10px;
        font-weight: 600;
      }
      & p:last-child {
        color: #5f5f5f;
        font-size: 0.27rem;
        padding-top: 2px;
      }
    }
  }
  // height: calc(~"100vh - 46px");
  background: #f1f1f1;
  .tab2 {
    height: calc(~"100vh - 90px");
  }

  /deep/ .van-tabs__wrap {
    // 兼容vant tabar 修改部分样式
    position: fixed;
    top: 80px;
    left: 0px;
    width: 100%;
    height: 44px;
    margin-bottom: 3px;
    background: #fff;
    z-index: 9;
    /deep/ .van-tabs__nav--line {
      padding-bottom: 14px;
    }
  }
  /deep/ .van-sticky--fixed {
    z-index: 1;
  }
  .backGo {
    width: 1rem;
    height: 45px;
    position: fixed;
    top: 0;
    z-index: 9999;
    left: 0;
    background: #5c5c5c;
    i {
      padding-top: 14px;
      padding-left: 16px;
    }
  }
}
</style>