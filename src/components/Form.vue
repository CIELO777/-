<template>
  <div class="deaContant">
    <div class="dTitle" style="display:flex;justify-content: space-between;">
      <span>客户信息</span>
      <span @click="UnbindContact" style="margin-right: 10px;">解绑外部联系人</span>
    </div>
    <!-- 默认字段 -->
    <template v-for="(item, index) in form">
      <van-cell style="max-height:44px;" v-if="item._checked" :key="index" :is-link="item.nolink==false" @click="showPopup(item.key, crmInfo[item.key])" :title="item.title" :value="(crmInfo[item.key] === null) ? '' : crmInfo[item.key]+''"></van-cell>
    </template>
    <!-- 自定义字段  -->
    <!-- <template v-for="(item, index) in formDiy">
      <van-cell :key="index" :placeholder="item.placeholder" is-link @click="showPopup(item.name, crmInfo[item.name],item.type)" :title="item.label" :value="crmInfo[item.name] == undefined ? '' : crmInfo[item.name]"></van-cell>
    </template> -->
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.nickname" closeable position="bottom" :style="{ height: '180px' }">
      <p class="pop-tit">姓名</p>
      <van-field label="" v-model="formData.nickname" placeholder="请输入姓名" />
      <van-button size="mini" color="#60C6C6" type="primary" @click="FormSave(formData.nickname, 'nickname', 'nickname')" class="btnTb">保存</van-button>
    </van-popup>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.phone" closeable position="bottom" :style="{ height: '200px' }">
      <p class="pop-tit">手机</p>
      <van-field label="" type="tel" v-model="formData.phone" placeholder="请输入手机号" />
      <van-button color="#60C6C6" size="mini" type="primary" @click="FormSave(formData.phone, 'phone', 'phone')" class="btnTb">保存</van-button>
    </van-popup>
    <van-action-sheet :actions="validityactions" v-model="popShow.status" @select="onSelectStatus" />
    <van-action-sheet :actions="sourceData" v-model="popShow.customSourceType" @select="onSelectCID" />
    <van-action-sheet :actions="actionsStar" v-model="popShow.starLevel" @select="onSelectStart" />
    <van-action-sheet :actions="actionsSex" v-model="popShow.gender" @select="onSelectSex" />
    <!-- <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.comp" closeable position="bottom" :style="{ height: '100%' }"> -->
    <!-- 公司信息 -->
    <compInfo height="calc(100% - 94px)" route="LinkDetailed" :companys.sync="company" ref="compInfo" :totalPageCounts="totalPageCount" :compshow.sync="compListShow" :user="users" :list="compLists">
    </compInfo>
    <!-- 共享客户 -->
    <shareUser :ids.sync="share.ids" height="calc(100% - 94px)" ref="shareUser" :totalPageCounts="share.Count" :shareshow.sync="share.show" :list="share.list">
    </shareUser>
    <!-- <p class="pop-tit">公司信息</p> -->
    <!-- <van-field label="" v-model="formData.comp" placeholder="请输入公司信息" /> -->
    <!-- <van-button color="#60C6C6" round size="mini" class="btnTb" type="primary" block @click="FormSave(formData.comp,'company','comp')">保存</van-button> -->
    <!-- </van-popup> -->
    <van-action-sheet :actions="actionsCoo" v-model="popShow.companyOcc" @select="onSelectJob" />
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.remark" closeable position="bottom" :style="{ height: '250px' }">
      <p class="pop-tit">备注</p>
      <van-field label="" v-model="formData.remark" type="textarea" rows="4" placeholder="请输入备注" />
      <van-button color="#60C6C6" size="mini" type="primary" @click="FormSave(formData.remark, 'remark', 'remark')" class="btnTb">保存</van-button>
    </van-popup>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.birthday" position="bottom" :style="{ height: '45%' }">
      <van-datetime-picker v-model="formData.birthday" type="date" title="出生日期" @confirm="birthdayOk" :formatter="formatter" />
    </van-popup>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.wx" closeable position="bottom" :style="{ height: '180px' }">
      <p class="pop-tit">微信</p>
      <van-field label="" v-model="formData.wx" placeholder="请输入微信号" />
      <van-button color="#60C6C6" size="mini" type="primary" block @click="FormSave(formData.wx, 'wx', 'wx')" class="btnTb">保存</van-button>
    </van-popup>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.qq" closeable position="bottom" :style="{height: '180px'}">
      <p class="pop-tit">QQ</p>
      <van-field label="" v-model="formData.qq" placeholder="请输入QQ号" />
      <van-button color="#60C6C6" size="mini" type="primary" @click="FormSave(formData.qq, 'qq', 'qq')" class="btnTb">保存</van-button>
    </van-popup>
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.email" closeable position="bottom" :style="{ height: '180px' }">
      <p class="pop-tit">邮箱</p>
      <van-field label="" v-model="formData.email" placeholder="请输入邮箱号" />
      <van-button color="#60C6C6" size="mini" type="primary" @click="FormSave(formData.email, 'email', 'email')" class="btnTb">保存</van-button>
    </van-popup>
    <!-- <div class="dTitle">跟进记录</div>
    <div class="dTitle">成交记录</div> -->
    <!-- 自定义表单 -->
    <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="diy.show" closeable position="bottom" :style="{ height: '200px' }">
      <p class="pop-tit">修改{{diy.name}}</p>
      <div v-if="diy.type === 'text' || diy.type === 'textarea'">
        <van-field :type="diy.type" label="" v-model="diy.price" :placeholder="diy.placeholder" />
      </div>
      <van-button size="mini" color="#60C6C6" type="primary" @click="FormSave(diy.price, diy.headline, 'show')" class="btnTb">保存</van-button>
    </van-popup>
    <van-action-sheet v-model="diy.showaction" :actions="diy.item" @select="onSelect" />
  </div>
</template>

<script>
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
import { formatDate, formatDateTime, getCurrentDate } from "../uilts/date";
let timeout = generateTimeout();
let nonce = generateNonce();
import local from "../uilts/localStorage";
import compInfo from "./detailFilter/CompInfo";
import communication from "../uilts/communication";
import shareUser from './detailFilter/shareUser'
export default {
  name: "forms",
  props: ["crmInfo"],
  data() {
    return {
      sourceData: [],
      minDate: 0,
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        }
        return value;
      },
      currentDate: new Date().getTime(),
      popShow: {
        nickname: false,
        phone: false,
        status: false,
        customSourceType: false,
        sourceType: false,
        wx: false,
        qq: false,
        starLevel: false,
        email: false,
        gender: false,
        companyOcc: false,
        remark: false,
        birthday: false,
        company: false,
        relation: false,
        follow: false,
        followDate: false,
      },
      formData: {
        nickname: "",
        phone: "",
        status: "",
        customSourceType: "",
        sourceType: "",
        wx: "",
        qq: "",
        email: "",
        starLevel: "",
        gender: "",
        companyOcc: "",
        remark: "",
        birthday: "",
        company: "",
        relation: "",
        follow: "",
        followDate: "",
      },
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
      validityactions: [
        { name: "无效", status: 0 },
        { name: "未知", status: 1 },
        { name: "有效", status: 2 },
      ],
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
      action: "",
      company: "",
      totalPageCount: "",
      compListShow: false,
      users: {},
      compLists: [],
      form: [],
      formObj: {},
      formDiy: [],
      diy: {
        name: '',
        show: false,
        showaction: false,
        placeholder: "",
        type: "",
        item: [],
        value: "",
        headline: "", // 标题目的获取是哪个表单用
        price: "",
      },
      share: {
        show: false,
        height: 'calc(~100% - 94px)',
        Count: 0,
        list: [],
        ids: "",
      }
    };
  },
  methods: {
    findSelect(name) { // 查询自定义行数当前·数据
      return this.formDiy.find(item => name === item.name)
    },
    showPopup(e, d) {
      // console.log(e, d);
      //  如果包含字段进行数据合并，垃圾。自定义数据不再一个接口里，在这做处理，目的获取当前自定义表单的一些详细信息（type，lable）
      if (e.includes("column")) {
        let item = this.findSelect(e);
        if (item.type == 'text' || item.type == 'textarea') {
          this.diy.show = true;
        } else {
          this.diy.showaction = true;
        }
        this.diy.headline = e;
        this.diy.name = item.label;
        this.diy.type = item.type
        this.diy.item = JSON.parse(item.items).map(item => {
          return {
            ...item,
            name: item.value
          }
        });
        this.diy.price = d;
      } else {
        //  回显表单数据
        if (
          e == "contactNumber" ||
          e == "lastContactRecord" ||
          e == "lastContactTime"
        ) {
          this.followUp();
        }
        if (e == "company") {
          this.compListShow = true;
        }
        if (e == "share") { // 共享客户弹框
          this.share.show = true;
          this.share.ids = this.crmInfo.share1.map(item => {
            return item.userId
          }).join(',')
          // console.log(this.share.ids)
          this.$refs.shareUser.clickshare(this.share.ids) // 触发子元素方法目的请求已经共享的数据
        };
        this.popShow[e] = true; // 打开弹框
        if (e == 'share') {
          this.formData[e] = d; // 回显数据
        }
        this.formData[e] = d; // 回显数据

      }
    },
    onSelect(e) {
      // console.log(e);
      this.FormSave(e.value, this.diy.headline, 'showaction')
    },
    FormSave(data, type, ourType) {
      // 保存表单数据
      let that = this;
      let crm = {};
      let lock = 0; // 如果为1走自定义编辑1了，区分弹框关闭
      crm.id = JSON.parse(sessionStorage.getItem("_crm_info"))?.id;
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.phone = this.crmInfo.phone;
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
      if (crm.sourceType) {
        crm.customSourceType = crm.sourceType || "";
      }
      if (crm.companyOcc == 7) {
        crm.companyOcc = -1;
      }
      if ((type == "nickname" && data === "") || data === null) {
        this.$toast({
          message: "姓名不能为空",
          position: "bottom",
        });
        return;
      } else if ((type == "phone" && data === "") || data === null) {
        this.$toast({
          message: "手机不能为空",
          position: "bottom",
        });
        return;
      }
      switch (type) {
        case "nickname":
          crm[type] = data;
          // 手动更新列表数据，防止返回刷新，scrolltop 丢失；
          this.$store.commit("ManualUpdate", { target: "nickName", data });
          break;
        case "phone":
          crm[type] = data;
          break;
        case "wx":
          crm[type] = data;
          break;
        case "qq":
          crm[type] = data;
          break;
        case "email":
          crm[type] = data;
          break;
        case "remark":
          crm[type] = data;
          break;
        case "company":
          crm.company = data;
          this.$store.commit("ManualUpdate", { target: "company", data });
          break;
      }

      if (type.includes('column')) { // 自定义字段
        lock = 1
        crm[type] = data;
      }
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(function (res) {
          if (res.error === "success") {
            if (lock == 0) {
              that.popShow[ourType] = false
            } else {
              that.diy[ourType] = false
            }
            that.$emit("getCrm");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onSelectStatus(item, index) {
      this.saveSelect("status", item.status, "status");
    },
    onSelectCID(item, index) {
      this.saveSelect("customSourceType", item.id, "customSourceType");
    },
    onSelectStart(item) {
      this.saveSelect("starLevel", item.starLevel, "starLevel");
    },
    onSelectSex(item) {
      this.saveSelect("gender", item.gender, "gender");
    },
    onSelectJob(item) {
      this.saveSelect("companyOcc", item.companyOcc, "companyOcc");
    },
    birthdayOk(value) {
      this.saveSelect("birthday", formatDate(value), "birthday");
    },
    saveSelect(key, data, ourName) {
      // 下拉表单提交
      let that = this;
      let crm = {};
      crm.id = JSON.parse(sessionStorage.getItem("_crm_info"))?.id;
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.phone = this.crmInfo.phone;
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
          if (res.error === "success") {
            that.popShow[ourName] = false; // 关闭弹框
            that.$emit("getCrm"); // 更新数据
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    followUp() {
      // 跟进记录点击跳转
      this.$emit("update:active", 1);
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
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    compList(cur) {
      // 来源方式下拉框接口请求
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
            let data = res.data.map((item) => {
              var reg = /^(\d{3})\d{4}(\d{4})$/;
              return {
                ...item,
                encrypt: item.ownerId.replace(reg, "$1****$2"),
              };
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
    getColumn() {
      // 请求自定义列表
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("userId", this.$U || local.U());
      param.append("signature", signature);
      param.append("compId", this.$C || local.C());
      this.$post1("/api/request/itr/comp/column/config/detail", param)
        .then((res) => {
          let form = JSON.parse(res.data);
          // console.log(form)
          if (form.length !== 0) {
            // 数组转对象。偷个懒去控制显隐。这个只支持默认表单隐藏
            var obj = {};
            //  默认表单
            this.form = form
              .map((item) => {
                if (
                  item.key == "itrNickname" ||
                  item.key == "ownerNickname" ||
                  item.key == "sourceType" ||
                  item.key == "orderStatus" ||
                  item.key == "paymentStatus" ||
                  item.key == "supplyStatus" ||
                  item.key == "billStatus" ||
                  item.key == "costingTotal" ||
                  item.key == "supplyTime" ||
                  item.key == "consumptionTotal" ||
                  item.key == "consumptionNumber"
                ) {
                  item.nolink = true;
                } else {
                  item.nolink = false;
                }
                return item;
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 拉去自定义列表
    UnbindContact() {
      if (JSON.parse(sessionStorage.getItem("_crm_info")).wxCrmId === "") {
        this.$toast.fail({
          message: "没有绑定外部联系人",
        });
      } else {
        this.$dialog.confirm({
          title: '解绑',
          message: '确定解绑外部联系人？',
        })
          .then(() => {
            let crm = {};
            crm.id = JSON.parse(sessionStorage.getItem("_crm_info"))?.id; // 获取子组件点击的id ，userIdSave
            crm.itrId = this.$U || local.U();
            crm.compId = this.$C || local.C();
            crm.wxCrmId = "";
            // crm.phone = JSON.parse(sessionStorage.getItem("_crm_info"))?.phone;
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
                    message: "解绑外部联系人成功",
                    position: "bottom",
                  });
                  // activation
                  communication.$emit("updateUnbind", "msg"); // 清空followPage本地数据，
                  communication.$emit("update", {
                    index: Number(sessionStorage.getItem("ManualIdx")),
                    wxId: "",
                    route: sessionStorage.getItem("active"),
                  }); //触发home 页面更新列表数据

                  // communication.$emit('update', 'msg') // 清空一级页面列表数据1
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
          })
          .catch(() => {
          });
      }

    },
    getColumnConfig() {
      // 请求自定义列表
      let signature = generateSignature3(
        // this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("compId", this.$C || local.C());
      this.$post1("/api/request/itr/comp/column/query", param)
        .then((res) => {
          this.formDiy = res;
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
    this.getColumn(); //
    this.getColumnConfig()
    this.action = sessionStorage.getItem("active");
    sessionStorage.setItem("TabIndex", 0); // 清空tabindex 防止表单触发触底事件
    this.compList();
    // this.getShareList();
  },
  activated() {
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.form; // 设置每个页面的scrollTop
  },
  updated() {
    this.crmInfos = this.crmInfo;
  },
  components: { compInfo, shareUser },
};
</script>

<style lang="less" scoped>
.deaContant {
  margin-top: 44px;
  .btnTb {
    position: fixed;
    right: 0;
    width: 100%;
    bottom: 0;
    height: 40px;
    font-size: 0.3rem;
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
  /deep/ .van-cell__value span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 3rem;
  }
}
</style>
