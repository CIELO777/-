<template>
  <div class="detail">
    <!-- :lazy-render="false"  -->
    <van-tabs swipeable v-model="active" :lazy-render="false" color="#51BBBA" @change="tabsChange" class="tabs" offset-top="0" sticky>
      <van-tab title="客户信息">
        <keep-alive>
          <Forms :sourceData="sourceData" ref="forms" :form="form" :crmInfo="crmInfos" v-if="Object.keys(crmInfos).length >0 && active==0" :active.sync="active" @getCrm="getCrm"></Forms>
        </keep-alive>
      </van-tab>
      <van-tab title="跟进记录">
        <keep-alive>
          <FollowPage v-if="active == 0 || active == 1"></FollowPage>
        </keep-alive>
      </van-tab>
      <van-tab title="订单">
        <keep-alive>
          <Order v-if="active == 2"></Order>
        </keep-alive>
      </van-tab>
      <van-tab title="日程">
        <Agenda v-if="active == 3"></Agenda>
      </van-tab>
      <van-tab title="雷达">
        <Radar v-if="active == 4"></Radar>
      </van-tab>
      <van-tab title="操作记录">
        <Operating v-if="active == 5"></Operating>
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
      active: 1,
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
    }
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
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
    this.getCid()
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
          console.log(res)
          if (!res.error) {
            let shareStr = '';
            res.share.forEach(item => { // 遍历循环字符串
              shareStr = shareStr + res.user[item.userId].nickname + ','
            })
            console.log(shareStr)
            let a = {
              ...res,
              status: res.status == 1 ? '未知' : '有效',
              sourceType: res.sourceType == 0 ? '手动录入' : res.sourceType == 1 ? '表单导入' : '订单导入',
              itrNickname: res.user[res.creator].nickname,
              ownerNickname: res.user[res.ownerId]?.nickname || '',
              starLevel: res.starLevel == 0 ? '未知' : res.starLevel + '星客户',
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
              share1: res.share

            }
            that.crmInfos = a;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
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
        console.log(item);
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
      } else {
        vm.$store.commit("cache", "Home,Common,HighSeas");

      }

    })
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
  font-size: 16px;
  // height: calc(~"100vh - 46px");
  background: #f1f1f1;
  .tab2 {
    height: calc(~"100vh - 90px");
  }

  /deep/ .van-tabs__wrap {
    // 兼容vant tabar 修改部分样式
    position: fixed;
    top: 0;
    left: 0px;
    width: 100%;
    height: 44px;
    margin-bottom: 3px;
    /deep/ .van-tabs__nav--line {
      padding-bottom: 14px;
    }
  }
  .backGo {
    width: 1rem;
    height: 45px;
    position: fixed;
    top: 0;
    z-index: 999;
    left: 0;
    background: #5c5c5c;
    i {
      padding-top: 14px;
      padding-left: 16px;
    }
  }
}
</style>