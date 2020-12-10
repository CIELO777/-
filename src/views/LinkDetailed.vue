<template>
  <div class="detail">
    <div class="backGo" @click="backgo">
      <van-icon name="arrow-left" size="17px" color="#fff" />
    </div>
    <van-tabs v-model="active" color="#51BBBA" @change="tabsChange" class="tabs" offset-top="46" sticky>
      <van-tab v-for="(item,index) in navigationList" :title="item.name" :key="index">
        <div v-show="active == 0">
          <Forms :crmInfo="crmInfos" v-if=" Object.keys(crmInfos).length >0" :active.sync="active" @getCrm="getCrm"></Forms>
        </div>
        <div v-show="active == 1" class="tab1">
          <FollowPage></FollowPage>
        </div>
        <div v-show="active == 2" class="tab1">
          <Order></Order>
        </div>
        <div v-show="active == 3" class="tab1">
          <Agenda></Agenda>
        </div>
        <div v-show="active == 4" class="tab2">
          <Radar></Radar>
        </div>
        <div v-show="active == 5" class="tab2">
          <Operating></Operating>
        </div>
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
    }
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  created() {
    // ImagePreview({
    //   images: [
    //     'https://img.yzcdn.cn/vant/apple-1.jpg',
    //     'https://img.yzcdn.cn/vant/apple-2.jpg',
    //   ],
    //   startPosition: 1,
    // });
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
        .then(function (res) {
          if (!res.error) {
            that.crmInfos = res;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    tabsChange(e) {
      this.active = e;
      sessionStorage.setItem('TabIndex', e)
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

  /deep/ .van-tabs__wrap {  // 兼容vant tabar 修改部分样式
    position: fixed;
    top: 45px;
    left: 0px;
    width: 100%;
    height: 44px;
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