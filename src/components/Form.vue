<template>
  <div class="deaContant">
    <div class="allocation">
      <div class="handle">
        <div class="waooo" @click="shareOpera" style="margin-right: 15px">
          <img src="../assets/img/svg_customer_share.png" />
          <span class="handleTxt">共享</span>
        </div>
        <div class="waooo" @click="allocation" style="margin-right: 15px">
          <img src="../assets/img/svg_customer_distribution.png" />
          <span class="handleTxt">分配</span>
        </div>
        <div class="waooo">
          <div
            v-if="block != 0 && block != 1 && block != 2 && block != 4"
            @click="release"
            class="waooo"
          >
            <img src="../assets/img/svg_customer_principal.png" />
            <span class="handleTxt">释放</span>
          </div>
          <div v-else @click="pickup" class="waooo">
            <img src="../assets/img/svg_customer_pickup.png" />
            <span class="handleTxt">拾取</span>
          </div>
        </div>
      </div>
      <span @click="UnbindContact" style="margin-right: 10px; color: #597896">
        解绑外部联系人</span
      >
    </div>
    <!-- 默认字段 -->
    <template v-for="(item, index) in form">
      <van-cell
        style="max-height: 44px"
        v-if="item._checked"
        :key="index"
        :is-link="item.nolink == false"
        @click="showPopup(item.key, crmInfo[item.key], item)"
        :title="item.title"
        :value="crmInfo[item.key] === null ? '' : crmInfo[item.key] + ''"
      ></van-cell>
    </template>
    <!-- 自定义字段  -->
    <!-- <template v-for="(item, index) in formDiy">
      <van-cell :key="index" :placeholder="item.placeholder" is-link @click="showPopup(item.name, crmInfo[item.name],item.type)" :title="item.label" :value="crmInfo[item.name] == undefined ? '' : crmInfo[item.name]"></van-cell>
    </template> -->

    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.nickname"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">姓名</p>
      <van-field
        label=""
        v-model="formData.nickname"
        placeholder="请输入姓名"
        :autofocus="true"
      />
      <van-button
        size="mini"
        color="#60C6C6"
        type="primary"
        @click="FormSave(formData.nickname, 'nickname', 'nickname')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.phone"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">手机</p>
      <van-field
        label=""
        type="tel"
        v-model="formData.phone"
        placeholder="请输入手机号"
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.phone, 'phone', 'phone')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.workNumber"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">手机2</p>
      <van-field
        label=""
        type="tel"
        v-model="formData.workNumber"
        placeholder="请输入手机号"
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.workNumber, 'workNumber', 'workNumber')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.address"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">修改详细地址</p>
      <van-field
        label=""
        type="tel"
        v-model="formData.address"
        placeholder=""
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.address, 'address', 'address')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-action-sheet
      :actions="validityactions"
      v-model="popShow.status"
      @select="onSelectStatus"
      :close-on-click-overlay="overlay"
    />
    <van-action-sheet
      :actions="sourceData"
      v-model="popShow.customSourceType"
      @select="onSelectCID"
      :close-on-click-overlay="overlay"
    />
    <van-action-sheet
      :actions="actionsStar"
      v-model="popShow.starLevel"
      :close-on-click-overlay="overlay"
      @select="onSelectStart"
    />
    <van-action-sheet
      :actions="actionsSex"
      v-model="popShow.gender"
      :close-on-click-overlay="overlay"
      @select="onSelectSex"
    />
    <!-- <van-popup close-icon-position="top-left" :safe-area-inset-bottom="true" v-model="popShow.comp" closeable position="bottom" :style="{ height: '100%' }"> -->
    <!-- 公司信息 -->
    <compInfo
      :height="
        routeType == 'LinkDetailed' ? 'calc(100% - 94px)' : 'calc(100% - 140px)'
      "
      :route="routeType"
      :companys.sync="company"
      ref="compInfo"
      :totalPageCounts="totalPageCount"
      :compshow.sync="compListShow"
      :user="users"
      :list="compLists"
      @allocationChange="allocationChange"
      @allocaCur="allocaCurs"
      @search="searchs(arguments)"
    >
    </compInfo>

    <!-- 共享客户 -->
    <shareUser
      :ids.sync="share.ids"
      height="calc(100% - 94px)"
      ref="shareUser"
      :totalPageCounts="share.Count"
      :shareshow.sync="share.show"
      :list="share.list"
    >
    </shareUser>
    <!-- <p class="pop-tit">公司信息</p> -->
    <!-- <van-field label="" v-model="formData.comp" placeholder="请输入公司信息" /> -->
    <!-- <van-button color="#60C6C6" round size="mini" class="btnTb" type="primary" block @click="FormSave(formData.comp,'company','comp')">保存</van-button> -->
    <!-- </van-popup> -->
    <van-action-sheet
      :actions="actionsCoo"
      v-model="popShow.companyOcc"
      @select="onSelectJob"
      :close-on-click-overlay="overlay"
    />
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.remark"
      closeable
      position="bottom"
      :style="{ height: '250px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">备注</p>
      <van-field
        label=""
        v-model="formData.remark"
        type="textarea"
        rows="4"
        placeholder="请输入备注"
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.remark, 'remark', 'remark')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.birthday"
      position="bottom"
      :style="{ height: '45%' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <van-datetime-picker
        v-model="formData.birthday"
        type="date"
        title="出生日期"
        @confirm="birthdayOk"
        :formatter="formatter"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.wx"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">微信</p>
      <van-field label="" v-model="formData.wx" placeholder="请输入微信号" />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        block
        @click="FormSave(formData.wx, 'wx', 'wx')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.qq"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">QQ</p>
      <van-field label="" v-model="formData.qq" placeholder="请输入QQ号" />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.qq, 'qq', 'qq')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.email"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">邮箱</p>
      <van-field label="" v-model="formData.email" placeholder="请输入邮箱号" />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.email, 'email', 'email')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <!-- <div class="dTitle">跟进记录</div>
    <div class="dTitle">成交记录</div> -->
    <!-- 自定义表单 -->
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="diy.show"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">修改{{ diy.name }}</p>
      <div v-if="diy.type === 'text' || diy.type === 'textarea'">
        <van-field
          type="textarea"
          autosize
          v-model="diy.price"
          :placeholder="diy.placeholder"
          :maxlength="100"
          rows="4"
        />
      </div>
      <van-button
        size="mini"
        color="#60C6C6"
        type="primary"
        @click="FormSave(diy.price, diy.headline, 'show')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-action-sheet
      v-model="diy.showaction"
      :actions="diy.item"
      :close-on-click-overlay="overlay"
      @select="onSelect"
    />
    <van-popup v-model="shortPop" :style="{ width: '60%' }" class="shortPop">
      <!-- 选择成交状态 -->
      <div>
        <h2>选择要释放的公海</h2>
        <p class="shortRow" @click="releaseSelect('0')">总公司公海</p>
        <p class="shortRow" @click="releaseSelect('1')">分公司公海</p>
        <p class="shortRow" @click="releaseSelect('2')">所属部门公海</p>
        <p class="shortRow" @click="releaseSelect('4')">个人公海</p>
      </div>
    </van-popup>
    <van-overlay :show="popShow.region" z-index="999" @click.stop="regionShow">
      <p class="operaTion">
        <span @click="regionPop = popShow.region = false">取消</span
        ><span>选择地区</span><span @click="regionSave">保存</span>
      </p>
      <v-distpicker
        :province="province"
        :city="city"
        :area="area"
        @province="Sprovince"
        @city="Scity"
        @area="Sarea"
        type="mobile"
      ></v-distpicker>
    </van-overlay>
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
// import { delete } from 'vue/types/umd';
import VDistpicker from 'v-distpicker'

export default {
  name: "forms",
  props: ["crmInfo", 'sourceData'],
  data() {
    return {
      overlay: true,
      // sourceData: [],
      item: {},
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2060, 10, 1),
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
        workNumber: false,
        address: false,
        region: false,
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
        birthday: new Date(),
        company: "",
        relation: "",
        follow: "",
        followDate: "",
        workNumber: "",
        address: '',
        region: '',
      },
      province: '北京市',
      city: '北京市',
      area: '海淀区',
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
          name: "未知",
          starLevel: 0,
        },
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
      },
      block: "",
      orderList: [],
      queryType: 3,
      routeType: '',
      shortPop: false,
    };
  },
  methods: {
    findSelect(name) { // 查询自定义行数当前·数据
      return this.form.find(item => name === item.key)
    },
    showPopup(e, d, items) {
      this.item = items; // 备份ITEM; 必填校验用
      // 如果在公海并且点击了相关人， 那么就不让他进去
      let route = sessionStorage.getItem("active");
      if (route == 'HighSeas' && e == 'share') {
        this.$dialog.alert({
          title: '温馨提示',
          message: '公海客户不能共享!',
        }).then(() => {
        });
        return;
      };
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
          this.compList();
          this.compListShow = true;
          this.routeType = 'LinkDetailed';
        }
        if (e == "share") { // 共享客户弹框
          this.share.show = true;
          this.share.ids = this.crmInfo.share1.map(item => {
            return item.userId
          }).join(',')
          // console.log(this.share.ids)
          this.$refs.shareUser.clickshare(this.share.ids) // 触发子元素方法目的请求已经共享的数据
        };
        if (e == 'region' && d) { // 地区回显
          this.province = d.split('-')[0];
          this.city = d.split('-')[1];
          this.area = d.split('-')[2];
        }
        this.popShow[e] = true; // 打开弹框
        if (e == 'share') {
          this.formData[e] = d; // 回显数据
        }
        this.formData[e] = d; // 回显数据
        if (e == 'phone') { // 如果是手机号那么弹框显示全部手机号
          this.formData[e] = this.crmInfo.phone_back; // 回显数据
        }
      }
    },
    Sprovince(data) {
      this.province = data.value;
    },
    Scity(data) {
      this.city = data.value;
    },
    Sarea(data) {
      this.area = data.value;
    },
    regionSave() {
      let { province, city, area } = this;
      if (province !== '' && city !== '' && city !== '市' && area !== '区' && area !== '') {
        // this.popShow.region = false;
        this.formData.region = this.province + '-' + this.city + '-' + this.area;
        this.saveSelect("region", this.formData.region, "region");
      }
    },
    regionShow() { // 选中
      // this.popShow.region = false;
      let { province, city, area } = this;
      if (province !== '' && city !== '' && area !== '') {
        // this.popShow.region = false;
      }
    },
    onSelect(e) {
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
      // crm.phone = this.crmInfo.phone;  // 传这个参数会导致有时联系人已经存在
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
        case "workNumber":
          crm[type] = data;
          break;
        case "address":
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
      // _checked ? '显示' ： '隐藏';
      // required  && required=1 ? '必填' ： ‘不必填’
      if (this.item?.required && this.item.required == 1 && data === '') { // 必填 && 数据为空;
        this.$toast.fail("表单为必填项，请填写内容")
        return;
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
            that.$emit("getCrm");  // 更新列表信息
          } else {
            if (lock == 0) {
              that.popShow[ourType] = false
            } else {
              that.diy[ourType] = false
            }
            that.$toast(res.errMsg)
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
    closePop() {
      // this.forData.birthday
      // this.popShow.birthday = true;
    },
    saveSelect(key, data, ourName) {
      // 下拉表单提交
      let that = this;
      let crm = {};
      crm.id = JSON.parse(sessionStorage.getItem("_crm_info"))?.id;
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      // crm.phone = this.crmInfo.phone; // 去掉
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
      // 手动更新列表数据，防止返回刷新，scrolltop 丢失；
      crm[key] = data;
      if (key == 'gender') {
        that.$store.commit("ManualUpdate", { target: "gender", data }); // 更新列表数据
      }
      if (crm.sourceType) {
        crm.customSourceType = crm.sourceType || "";
      }
      if (crm.companyOcc == 7) {
        crm.companyOcc = -1;
      }
      // if(crm.starLevel == 0 || crm.starLevel === undefined){
      //   delete crm.starLevel 
      // }
      if (this.item?.required && this.item.required == 1 && key === '') { // 必填 && 数据为空;
        this.$toast.fail("表单为必填项，请填写内容")
        return;
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
    searchcompList(cur, DATAS) {
      // 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: cur[0] || 1,
        size: 20,
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      if (DATAS !== '') {
        data.fuzzy = cur
      } else {
        delete data.fuzzy
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
            this.compLists = cur == 1 ? data : this.compLists.concat(data);
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
          if (form.length !== 0) {
            // 数组转对象。偷个懒去控制显隐。这个只支持默认表单隐藏
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
                if (item.title === '公司信息') {
                  item.title = '所属公司'
                }
                return item;
              })
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
      param.append("version", 1);
      param.append("compId", this.$C || local.C());
      this.$post1("/api/request/itr/comp/column/query", param)
        .then((res) => {
          this.formDiy = res;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    shareOpera() {
      if (this.block == 0 || this.block == 1 || this.block == 2 || this.block == 4) {
        this.$dialog.alert({
          title: '温馨提示',
          message: '公海客户不能共享!',
        }).then(() => {
        });
        return
      }
      this.share.show = true;
      this.share.ids = this.crmInfo.share1.map(item => {
        return item.userId
      }).join(',')
      this.$refs.shareUser.clickshare(this.share.ids) // 触发子元素方法目的请求已经共享的数据
    },
    async allocation() {
      let role = sessionStorage.getItem('role');
      let route = sessionStorage.getItem('active');
      let name = JSON.parse(sessionStorage.getItem('userinfo')).nickname;
      if (route === 'Home' || route === 'ChatCustomer') {  // 如果是home 页面如果是三种权限并且nickname == ‘负责人的name’
        if (role == 'true' || this.crmInfo.ownerNickname === name) {
          this.routeType = 'allocation';
          this.queryType = 3;
          this.compLists.length = 0;
          await this.allocationList()
          this.compListShow = true;
        } else {
          this.$toast('该联系人没有分配权限')
          return;
        }
      } else if (route === 'HighSeas') {
        this.routeType = 'allocation';
        this.queryType = 3;
        this.compLists.length = 0;
        await this.allocationList()
        this.compListShow = true;
      }
    },
    release() {
      let role = sessionStorage.getItem('role');
      let route = sessionStorage.getItem('active');
      let name = JSON.parse(sessionStorage.getItem('userinfo')).nickname;
      if (route === 'Home' || route === 'ChatCustomer') {  // 如果是home 页面如果是三种权限并且nickname == ‘负责人的name’
        if (role == 'true' || this.crmInfo.ownerNickname === name) {
          this.$dialog.confirm({
            title: '温馨提示',
            message: '确定要释放该客户么？',
          })
            .then(() => {
              this.shortPop = true;
            })
            .catch(() => {
              // on cancel
            });
        } else {
          this.$toast('该联系人没有释放权限')
        }
      } else if (route === 'HighSeas') {
        if (role == 'true') {
          this.$dialog.confirm({
            title: '温馨提示',
            message: '确定要释放该客户么？',
          })
            .then(() => {
              this.shortPop = true;
            })
            .catch(() => {
              // on cancel
            });
        } else {
          this.$toast('该联系人没有释放权限')
        }
      }

    },
    releaseSelect(data) {  // 释放
      this.block = 0;
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("from", crmInfo);
      param.append("toType", data);
      param.append("type", 3);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      this.$post1("/api/request/itr/comp/customer/opt", param)
        .then((res) => {
          if (res.error == 'success') {
            let idx = sessionStorage.getItem('ManualIdx')
            communication.$emit("release", Number(idx), data);
            this.$toast('释放成功')
          }
          this.shortPop = false;
        })
        .catch(function (error) {
          console.log(error);
          this.shortPop = false;
        });
    },
    pickup() {
      this.block = 1;
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("from", crmInfo);
      param.append("type", 4);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      this.$post1("/api/request/itr/comp/customer/opt", param)
        .then((res) => {
          if (res.error == 'success') {
            this.$dialog.alert({
              title: '温馨提示',
              message: '拾取成功',
            }).then(() => {
              let Idx = sessionStorage.getItem('TabIndex')
              let data = JSON.parse(sessionStorage.getItem('_crm_info'));
              let name = JSON.parse(sessionStorage.getItem('userinfo')).nickname;
              let ownerId = JSON.parse(sessionStorage.getItem('userinfo')).id;
              let str = '';
              console.log(data.ownerType)
              if (data.ownerType == 0) {
                str = `【客户】${name}从公司公海拾取了这个联系人`;
                // '释放联系人到公司公海';
              } else if (data.ownerType == 1) {
                str = `【客户】${name}从分公司公海拾取了这个联系人`;
              } else if (data.ownerType == 2) {
                str = `【客户】${name}从部门公海拾取了这个联系人`;
              } else if (data.ownerType == 4) {
                str = `【客户】${name}从个人公海拾取了这个联系人`;
              } else if (data.ownerType == 3) {
                str = `【客户】${name}从公海拾取了这个联系人`;
              }
              this.block = 3;
              console.log(Idx)
              console.log(str)
              communication.$emit("collect", Idx, str, data, ownerId, 3); // 清空followPage本地数据，
            });
          } else {
            this.$dialog.alert({
              title: '温馨提示',
              message: '拾取失败，请稍后再试！',
            })
          }
        })
        .catch(function (error) {
        });

    },
    allocationChange(data) {
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.queryType = data;
      this.allocationList();
    },
    allocaCurs(data) {
      this.allocationList(data)
    },
    async allocationList(cur) {
      let staff_id = JSON.parse(sessionStorage.getItem('userinfo'))?.bind_staff_id;
      let signature = generateSignature3(this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      await this.$get('/api/request/itr/comp/staff/result', {
        params: {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          current: cur || 1,
          size: 20,
          queryType: this.queryType,
          signature,
          timeout,
          nonce,
        },
      })
        .then((res) => {
          if (!res.error) {
            if (res.data && res.data.length > 0) {
              let datas = res.data.map(item => {
                var reg = /^(\d{3})\d{4}(\d{4})$/;
                item.userId1 = item.userId.replace(reg, "$1****$2");
                return item;
              });
              this.compLists = cur ? this.compLists.concat(datas) : datas;
              this.totalPageCount = res.totalPageCount;
              this.$toast.clear()
            } else {
              this.compLists = [];
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    searchs(data) {
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      this.$get('/api/request/itr/comp/staff/ids/result', {
        params: {
          compId: this.$C || local.C(),
          current: data[1] || 1,
          fuzzy: data[0],
          filter: 1,
          ids: '',
          queryStatus: 0,
          size: 20,
          signature,
          timeout,
          nonce,
        },
      })
        .then((res) => {
          if (!res.error) {
            if (res.data && res.data.length > 0) {
              let datas = res.data.map(item => {
                var reg = /^(\d{3})\d{4}(\d{4})$/;
                item.userId1 = item.userId.replace(reg, "$1****$2");
                return item;
              });
              this.compLists = data[1] === 1 ? datas : this.compLists.concat(datas);
              this.totalPageCount = res.totalPageCount;
              this.$toast.clear()
            } else {
              this.compLists.length = 0;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 营销架构是否过期
    outData(cid) {
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      this.$get("/api/request/itr/comp/permission/current", {
        params: {
          userId: cid || this.$U || local.U(),
          timeout: timeout,
          nonce: nonce,
          signature: signature
        },
      }).then((res) => {
        if (res.company.role == 1 || res.company.role == 2 || res.company.role == 3 || res.company.role == 6) {
          sessionStorage.setItem('role', true)
        } else {
          sessionStorage.setItem('role', false)
        }
      })
        .catch((error) => {
          console.log(error);
        });
    },

  },
  beforeCreate() {
    sessionStorage.setItem("TabIndex", 0); // 清空tabindex 防止表单触发触底事件
  },
  created() {
    this.getColumn(); //
    this.outData();
    this.getColumnConfig()
    this.action = sessionStorage.getItem("active");
    console.log(JSON.parse(sessionStorage.getItem('_crm_info')).ownerType)
    this.block = JSON.parse(sessionStorage.getItem('_crm_info')).ownerType;
    // this.getShareList();
    // console.log(this.crmInfo)
  },
  activated() {

    // this.outData();
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.form; // 设置每个页面的scrollTop
  },
  updated() {
    this.crmInfos = this.crmInfo;
  },
  components: { compInfo, shareUser, VDistpicker },
};
</script>

<style lang="less" scoped>
.deaContant {
  margin-top: 164px;
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
    color: rgb(124, 120, 120);
  }
  .allocation {
    height: 40px;
    background: #eee;
    display: flex;
    align-items: center;
    padding: 0 10px;
    position: fixed;
    left: 0;
    right: 0;
    top: 123px;
    z-index: 999;
    justify-content: space-between;
    .handle {
      display: flex;
    }
  }
  .waooo {
    margin-right: 12px;
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    img {
      padding-right: 5px;
      width: 15px;
      height: 15px;
    }
    .handleTxt {
      font-size: 0.25rem;
    }
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
  .distpicker-address-wrapper {
    z-index: 99999;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 45%;
    overflow-y: auto;
    background: #eee;
  }
  /deep/ .address-header {
    background: #eee !important;
    color: #000;
  }
  /deep/ .address-container {
    background: #eee;
    color: #000;
  }
  /deep/ .address-container {
    > ul {
      border-bottom: none;
      li {
        border-bottom: none;
        border-top: none;
      }
    }
  }
  .operaTion {
    position: fixed;
    bottom: 45%;
    left: 0;
    background: #eee;
    font-size: 16px;
    padding: 8px;
    right: 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #c5c4c4;
  }
}
</style>
