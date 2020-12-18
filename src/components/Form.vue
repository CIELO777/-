<template>
  <div class="deaContant">
    <div class="dTitle">客户信息</div>
    <van-cell is-link @click="showPopup('name',crmInfo.nickname)" title="姓名" :value="crmInfo.nickname">
    </van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.name" closeable position="bottom" :style="{ height: '20%' }">
      <p class="pop-tit">姓名</p>
      <van-field label="" v-model="formData.name" placeholder="请输入姓名" />
      <van-button size="mini" round color="#60C6C6" type="primary" @click="FormSave(formData.name,'nickname','name')" class="btnTb">保存</van-button>
    </van-popup>

    <van-cell is-link @click="showPopup('phone',crmInfo.phone)" title="手机" :value="crmInfo.phone"></van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.phone" closeable position="bottom" :style="{ height: '20%' }">
      <p class="pop-tit">手机</p>
      <van-field label="" type="tel" v-model="formData.phone" placeholder="请输入手机号" />
      <van-button color="#60C6C6" round size="mini" type="primary" @click="FormSave(formData.phone,'phone','phone')" class="btnTb">保存</van-button>
    </van-popup>

    <van-cell is-link @click="showPopup('validity',crmInfo.status)" title="有效性" :value="
        crmInfo.status == 0 ? '无效' : crmInfo.status == 1 ? '未知' : '有效'
      "></van-cell>
    <van-action-sheet :actions="validityactions" v-model="popShow.validity" @select="onSelectStatus" />

    <van-cell is-link @click="showPopup('CID')" title="来源类型" :value="crmInfo.customSourceTitle||''"></van-cell>
    <van-action-sheet :actions="sourceData" v-model="popShow.CID" @select="onSelectCID" />

    <van-cell title="来源方式" :value="crmInfo.sourceType==0?'手动录入':crmInfo.sourceType==1?'表单导入':'订单导入'"></van-cell>

    <div v-if="action != 'HighSeas'">
      <van-cell title="创建者" :value="crmInfo.user[crmInfo.creator].nickname"></van-cell>
      <van-cell title="所属者" :value="crmInfo.user[crmInfo.ownerId].nickname"></van-cell>
    </div>

    <van-cell is-link @click="showPopup('start')" title="星级" :value="crmInfo.starLevel ==0?'未知':crmInfo.starLevel + '星'"></van-cell>
    <van-action-sheet :actions="actionsStar" v-model="popShow.start" @select="onSelectStart" />

    <van-cell is-link @click="showPopup('sex')" title="性别" :value="crmInfo.gender==2 ?'未知':crmInfo.gender==1? '男':'女'"></van-cell>
    <van-action-sheet :actions="actionsSex" v-model="popShow.sex" @select="onSelectSex" />

    <van-cell is-link @click="showPopup('comp',crmInfo.company)" title="公司信息" :value="crmInfo.company"></van-cell>
    <!-- <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.comp" closeable position="bottom" :style="{ height: '100%' }"> -->
    <compInfo route="LinkDetailed" :companys.sync="company" ref="compInfo" :totalPageCounts="totalPageCount" :compshow.sync="compListShow" :user="users" :list="compLists">
    </compInfo>
    <!-- <p class="pop-tit">公司信息</p> -->
    <!-- <van-field label="" v-model="formData.comp" placeholder="请输入公司信息" /> -->
    <!-- <van-button color="#60C6C6" round size="mini" class="btnTb" type="primary" block @click="FormSave(formData.comp,'company','comp')">保存</van-button> -->
    <!-- </van-popup> -->

    <van-cell is-link @click="showPopup('job')" title="公司职务" :value="cooList[crmInfo.companyOcc ==-1?7:crmInfo.companyOcc]"></van-cell>
    <van-action-sheet :actions="actionsCoo" v-model="popShow.job" @select="onSelectJob" />

    <van-cell is-link @click="showPopup('note',crmInfo.remark)" title="备注" :value="crmInfo.remark||''"></van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.note" closeable position="bottom" :style="{ height: '40%' }">
      <p class="pop-tit">备注</p>
      <van-field label="" v-model="formData.note" type="textarea" rows="4" placeholder="请输入备注" />
      <van-button color="#60C6C6" round size="mini" type="primary" @click="FormSave(formData.note,'remark','note')" class="btnTb">保存</van-button>
    </van-popup>

    <van-cell is-link @click="showPopup('birther')" title="出生日期" :value="crmInfo.birthday||''"></van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.birther" position="bottom" :style="{ height: '45%' }">
      <van-datetime-picker v-model="formData.birther" type="date" title="出生日期" @confirm="birthdayOk" :formatter="formatter" />
    </van-popup>

    <van-cell is-link @click="showPopup('weChat',crmInfo.wx)" title="微信" :value="crmInfo.wx||''"></van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.weChat" closeable position="bottom" :style="{ height: '20%' }">
      <p class="pop-tit">微信</p>
      <van-field label="" v-model="formData.weChat" placeholder="请输入微信号" />
      <van-button color="#60C6C6" size="mini" round type="primary" block @click="FormSave(formData.weChat,'wx','weChat')" class="btnTb">保存</van-button>
    </van-popup>

    <van-cell is-link @click="showPopup('qq',crmInfo.qq)" title="QQ" :value="crmInfo.qq||''"></van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.qq" closeable position="bottom" :style="{ height: '20%' }">
      <p class="pop-tit">QQ</p>
      <van-field label="" v-model="formData.qq" placeholder="请输入QQ号" />
      <van-button color="#60C6C6" size="mini" round type="primary" @click="FormSave(formData.qq,'qq','qq')" class="btnTb">保存</van-button>
    </van-popup>

    <van-cell is-link @click="showPopup('emall',crmInfo.email)" title="邮箱" :value="crmInfo.email||''"></van-cell>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.emall" closeable position="bottom" :style="{ height: '20%' }">
      <p class="pop-tit">邮箱</p>
      <van-field label="" v-model="formData.emall" placeholder="请输入邮箱号" />
      <van-button color="#60C6C6" round size="mini" type="primary" @click="FormSave(formData.emall,'email','emall')" class="btnTb">保存</van-button>
    </van-popup>

    <van-cell title="创建时间" :value="crmInfo.createTime||''"></van-cell>

    <div class="dTitle">跟进记录</div>
    <van-cell is-link @click="followUp" title="联系次数" :label="crmInfo.contactNumber+'次'"></van-cell>
    <van-cell is-link @click="followUp" title="最后跟进记录" :label="crmInfo.lastContactRecord"></van-cell>
    <van-cell is-link @click="followUp" title="最后跟进日期" :label="crmInfo.lastContactTime"></van-cell>
    <div class="dTitle">成交记录</div>
    <van-cell title="成交状态" :value="crmInfo.orderStatus==1?'已成交':'未成交'"></van-cell>
    <van-cell title="支付状态" :value="crmInfo.paymentStatus==1?'已支付':crmInfo.paymentStatus==2?'部分支付':'未支付'"></van-cell>
    <van-cell title="发货状态" :value="crmInfo.supplyStatus==0?'未发货':'已发货'"></van-cell>
    <van-cell title="开票状态" :value="crmInfo.billStatus==0?'未开票':'已开票'"></van-cell>
    <van-cell title="订单成本" :value="crmInfo.costingTotal +'元'"></van-cell>
    <van-cell title="发货日期" :value="crmInfo.supplyTime||''"></van-cell>
    <van-cell title="消费金额" :value="crmInfo.consumptionTotal ||'0' +'元'"></van-cell>
    <van-cell title="消费次数" :value="crmInfo.consumptionNumber +'次'"></van-cell>
  </div>
</template>

<script>

import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
import {
  formatDate,
  formatDateTime
} from '../uilts/date'
let timeout = generateTimeout();
let nonce = generateNonce();
import local from '../uilts/localStorage';
import compInfo from './detailFilter/CompInfo';
export default {
  name: "forms",
  props: ["crmInfo"],
  data() {
    return {
      sourceData: [],
      minDate: 0,
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`;
        }
        return value;
      },
      currentDate: new Date().getTime(),
      popShow: {
        name: false,
        phone: false,
        validity: false,
        CID: false,
        weChat: false,
        qq: false,
        start: false,
        emall: false,
        sex: false,
        job: false,
        note: false,
        birther: false,
        comp: false,
        relation: false,
        follow: false,
        followDate: false,
      },
      formData: {
        name: "",
        phone: "",
        validity: "",
        CID: "",
        weChat: "",
        qq: "",
        emall: "",
        start: "",
        sex: "",
        job: "",
        note: "",
        birther: "",
        comp: "",
        relation: "",
        follow: "",
        followDate: "",
      },
      cooList: ["职员", '经理', '总监', '总经理', '董事长', '企业法人', '公司股东', "未知"],
      validityactions: [{ name: '无效', status: 0 }, { name: '未知', status: 1 }, { name: '有效', status: 2 }],
      actionsStar: [
        {
          name: "一星",
          starLevel: 1,
        },
        {
          name: "二星",
          starLevel: 2,
        },
        {
          name: "三星",
          starLevel: 3,
        },
        {
          name: "四星",
          starLevel: 4,
        },
        {
          name: "五星",
          starLevel: 5,
        },
      ],
      actionsSex: [
        {
          name: "女",
          gender: 0,
        },
        {
          name: "男",
          gender: 1,
        },
        {
          name: "未知",
          gender: 2,
        },
      ],
      actionsCoo: [
        {
          name: "未知",
          companyOcc: -1,
        },
        {
          name: "职员",
          companyOcc: 0,
        },
        {
          name: "经理",
          companyOcc: 1,
        },
        {
          name: "总监",
          companyOcc: 2,
        },
        {
          name: "总经理",
          companyOcc: 3,
        },
        {
          name: "董事长",
          companyOcc: 4,
        },
        {
          name: "企业法人",
          companyOcc: 5,
        },
        {
          name: "公司股东",
          companyOcc: 6,
        },
      ],
      action: '',
      company: "",
      totalPageCount: "",
      compListShow: false,
      users: {},
      compLists: [],
    };
  },
  methods: {
    showPopup(e, d) { //  回显表单数据
      if (e == 'comp') { this.compListShow = true; }
      this.popShow[e] = true;  // 打开弹框
      this.formData[e] = d;  // 回显数据
    },
    FormSave(data, type, ourType) {  // 保存表单数据
      let that = this;
      let crm = {};
      crm.id = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.phone = JSON.parse(sessionStorage.getItem('_crm_info'))?.phone;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      if (crm.sourceType) {
        crm.customSourceType = crm.sourceType || "";
      }
      if (crm.companyOcc == 7) {
        crm.companyOcc = -1;
      }
      console.log(data, type);
      console.log(type == 'nickname' && data === '');
      if (type == 'nickname' && data === '' || data === null) {
        this.$toast({
          message: '姓名不能为空',
          position: 'bottom',
        });
        return
      } else if (type == 'phone' && data === '' || data === null) {
        this.$toast({
          message: '手机不能为空',
          position: 'bottom',
        });
        return
      }
      switch (type) {
        case 'nickname':
          crm[type] = data;
          // 手动更新列表数据，防止返回刷新，scrolltop 丢失；
          this.$store.commit("ManualUpdate", { target: 'nickName', data })
          break;
        case 'phone':
          crm[type] = data;
          break;
        case 'wx':
          crm[type] = data;
          break;
        case 'qq':
          crm[type] = data;
          break;
        case 'email':
          crm[type] = data;
          break;
        case 'remark':
          crm[type] = data;
          break;
        case 'company':
          crm.company = data;
          this.$store.commit("ManualUpdate", { target: 'company', data })
          break;
      };
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(function (res) {
          if (res.error === 'success') {
            that.popShow[ourType] = false;  // 关闭弹框
            that.$emit('getCrm');
          };
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onSelectStatus(item, index) {
      this.saveSelect('status', item.status, 'validity')
    },
    onSelectCID(item, index) {
      this.saveSelect('customSourceType', item.id, 'CID')
    },
    onSelectStart(item) {
      this.saveSelect('starLevel', item.starLevel, 'start')
    },
    onSelectSex(item) {
      this.saveSelect('gender', item.gender, 'sex')
    },
    onSelectJob(item) {
      this.saveSelect('companyOcc', item.companyOcc, 'job')
    },
    birthdayOk(value) {
      this.saveSelect('birthday', formatDate(value), 'birther')
    },
    saveSelect(key, data, ourName) {  // 下拉表单提交
      let that = this;
      let crm = {};
      crm.id = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.phone = JSON.parse(sessionStorage.getItem('_crm_info'))?.phone;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      crm[key] = data;
      if (crm.sourceType) {
        crm.customSourceType = crm.sourceType || "";
      }
      if (crm.companyOcc == 7) {
        crm.companyOcc = -1;
      }
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(function (res) {
          if (res.error === 'success') {
            that.popShow[ourName] = false; // 关闭弹框
            that.$emit('getCrm'); // 更新数据
          };
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    followUp() {// 跟进记录点击跳转
      this.$emit("update:active", 1)
    },
    getCid() {// 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id;
      let signature = generateSignature3(compID, timeout, nonce);

      let data = {
        current: 1,
        size: 60,
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
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    compList(cur) {// 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: cur || 1,
        size: 20,
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      this.$get("/api/request/itr/comp/customer/company/result", {
        params: data,
      })
        .then((res) => {
          if (!res.error && res.data.length > 0) {
            let data = res.data.map(item => {
              var reg = /^(\d{3})\d{4}(\d{4})$/;
              return {
                ...item,
                encrypt: item.ownerId.replace(reg, "$1****$2")
              }
            });
            this.compLists = cur ? this.compLists.concat(data) : data;
            this.totalPageCount = res.totalPageCount;
            this.users = res.user;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getCid();
    // this.action = ;
  },
  created() {
    this.action = sessionStorage.getItem('active');
    this.compList();
  },
  updated() {
    this.crmInfos = this.crmInfo;
  },
  components: { compInfo }
};
</script>

<style lang="less" scoped>
.deaContant {
  margin-top: 44px;
  .btnTb {
    position: absolute;
    right: 10px;
    width: 1.3rem;
    top: 13px;
  }
  .dTitle {
    height: 41px;
    line-height: 41px;
    padding-left: 14px;
    color: #597896;
    background: #f1f1f1;
  }
  .pop-tit {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
