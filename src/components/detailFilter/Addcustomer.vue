<template>
  <div class="Addcustomer">
    <!-- <van-cell :value="formData.name" is-link @click="clickCell(1)">
      <template #title>
        <span class="custom-title">姓名</span>
        <span style="color: red; font-size: 18px">*</span>
      </template>
    </van-cell>
    <van-cell :value="formData.phone" is-link @click="clickCell(13)">
      <template #title>
        <span class="custom-title">手机</span>
        <span style="color: red; font-size: 18px">*</span>
      </template>
    </van-cell>
    <van-cell
      :value="sheetData.gender ? sheetData.gender.value : ''"
      is-link
      @click="clickCell(2)"
      title="性别"
    ></van-cell>
    <van-cell
      :value="company"
      is-link
      @click="clickCell(3)"
      title="所属公司"
    ></van-cell>
    <van-cell
      :value="sheetData.companyOcc ? sheetData.companyOcc.value : ''"
      is-link
      @click="clickCell(4)"
      title="公司职务"
    ></van-cell>
    <van-cell
      :value="formData.note"
      is-link
      @click="clickCell(5)"
      title="备注"
    ></van-cell>
    <van-cell
      :value="sheetData.title ? sheetData.title.value : ''"
      is-link
      @click="clickCell(6)"
      title="来源类型"
    ></van-cell>
    <van-cell
      :value="sheetData.status ? sheetData.status.value : ''"
      is-link
      @click="clickCell(7)"
      title="有效性"
    ></van-cell>
    <van-cell
      :value="formData.wechat"
      is-link
      @click="clickCell(8)"
      title="微信"
    ></van-cell>
    <van-cell
      :value="formData.qq"
      is-link
      @click="clickCell(9)"
      title="QQ"
    ></van-cell>
    <van-cell
      :value="formData.email"
      is-link
      @click="clickCell(10)"
      title="邮箱"
    ></van-cell>
    <van-cell
      :value="sheetData.starLevel ? sheetData.starLevel.value : ''"
      is-link
      @click="clickCell(11)"
      title="星级"
    ></van-cell>
    <van-cell
      :value="birthday ? birthday : ''"
      is-link
      @click="clickCell(12)"
      title="出生日期"
    ></van-cell> -->
    <van-dialog v-model="show" title="标题" show-cancel-button>
      <img src="https://img01.yzcdn.cn/vant/apple-3.jpg" />
    </van-dialog>
    <!--自定义列表 -->
    <template v-for="(item, index) in diyColumn">
      <van-cell
        is-link
        :key="index"
        v-if="item.display == 1"
        @click="showPopup(item, index)"
        :title="item.label"
        :value="item.value"
        :required="item.required == 1 ? true : false"
        >{{ item.value }}</van-cell
      >
    </template>
    <addpop
      ref="addpop"
      :data="data"
      @birthday="birthdays"
      @savasheet="savasheets"
      @savaForm="savaForms"
      :formDatas="formData"
      @childClose="close"
    ></addpop>
    <!-- 输入框和选择框 -->
    <compInfo
      height="calc(100% - 94px)"
      @search="searchs(arguments)"
      route="addcustomer"
      :companys.sync="company"
      ref="compInfo"
      :totalPageCounts="totalPageCount"
      :compshow.sync="compListShow"
      :user="users"
      :list="compLists"
    ></compInfo>
    <!-- 公司信息列表 -->
    <!-- 自定义表单 -->
    <van-popup
      @close="closePop"
      :safe-area-inset-bottom="true"
      v-model="diy.show"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <p class="pop-tit">修改{{ diy.name }}</p>
      <div v-if="diy.type === 'text' || diy.type === 'textarea'">
        <van-field
          :type="diy.type"
          label=""
          v-model="diy.price"
          :placeholder="diy.placeholder"
          :formatter="formatter"
        />
      </div>
      <van-button
        size="mini"
        color="#60C6C6"
        @click="DiySave"
        type="primary"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-action-sheet
      v-model="diy.showaction"
      :actions="diy.item"
      @select="onSelect"
    />
    <van-action-sheet v-model="diy.checkoutPop" @close="actionSheet">
      <template v-for="(item, index) in diy.item">
        <van-checkbox
          @click="checkBoxChange(item, index)"
          :key="index"
          v-model="item.check"
          :data-check="item.check"
          style="
            font-size: 14px;
            height: 40px;
            border-bottom: 1px solid #eee;
            padding: 0 20px;
          "
          >{{ item.label }}</van-checkbox
        >
      </template>
    </van-action-sheet>
    <van-button
      color="rgb(81, 187, 186)"
      @click="$route.params.name ? checkIng() : Save()"
      class="hehi"
      type="primary"
      block
      >保存</van-button
    >
  </div>
</template>

<script>
import addpop from '../../components/detailFilter/addpop';
import compInfo from '../../components/detailFilter/CompInfo';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
import local from '../../uilts/localStorage';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "Addcustomer",
  data() {
    return {
      data: {
        popshow: false,
        types: "",
      },
      sourceData: [],
      compListShow: false,
      company: "",
      compLists: [],
      totalPageCount: 0,
      users: {},
      formData: {},
      sheetData: {},
      birthday: "",
      diyColumn: [],
      show:false,
      diy: {
        name: "",
        show: false,
        showaction: false,
        type: '',
        placeholder: "",
        item: [],
        price: "",
        checkoutPop: false,
      },
      whetherExist: false,
      findPhone: '',
    }
  },
  methods: {
    clickCell(data) {
      if (data == 1) { //姓名
        this.data = {
          types: 2,
          popshow: true,
          title: "填写姓名",
          maxLength: 25,
          form: 'name',
          inpType: "textarea"
        }
        this.$refs.addpop.update('name', this.formData)
      } else if (data == 13) { //手机
        this.data = {
          types: 2,
          popshow: true,
          title: "填写手机/微信”",
          maxLength: 50,
          placeholder: "手机号/微信号/QQ号",
          form: 'phone',
          inpType: "tel"
        }
        this.$refs.addpop.update('phone', this.formData)
      } else if (data == 5) { //备注
        this.data = {
          types: 2,
          popshow: true,
          title: "填写备注",
          maxLength: 500,
          form: 'note',
          inpType: "textarea"
        }
        this.$refs.addpop.update('note', this.formData)
      } else if (data == 8) { //微信
        this.data = {
          types: 2,
          popshow: true,
          title: "填写微信",
          maxLength: 50,
          form: 'wechat',
          inpType: "textarea"
        }
        this.$refs.addpop.update('wechat', this.formData)
      } else if (data == 9) { //QQ
        this.data = {
          types: 2,
          popshow: true,
          title: "填写QQ",
          maxLength: 20,
          form: 'qq',
          inpType: "digit"
        }
        this.$refs.addpop.update('qq', this.formData)
      } else if (data == 10) { //邮箱
        this.data = {
          types: 2,
          popshow: true,
          title: "填写邮箱",
          maxLength: 50,
          form: 'email',
          inpType: "textarea"
        }
        this.$refs.addpop.update('email', this.formData)
      } else if (data == 2) { //性别
        this.data = {
          types: 1,
          popshow: true,
          title: "修改性别",
          list: [
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
          form: 'gender'
        };
        this.$refs.addpop.updateSheet('gender', this.sheetData?.gender?.value)
      } else if (data == 4) { //公司职务
        this.data = {
          types: 1,
          popshow: true,
          title: "修改职务",
          list: [
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
          form: 'job'

        }
      } else if (data == 6) { //来源类型
        this.data = {
          types: 1,
          popshow: true,
          title: "来源类型",
          list: this.sourceData,
          form: 'type',
        }

      } else if (data == 7) { // 有效性
        this.data = {
          types: 1,
          popshow: true,
          title: "修改有效性",
          form: 'validity',
          list: [{ name: '无效', status: 0 }, { name: '未知', status: 1 }, { name: '有效', status: 2 }],
        }
      } else if (data == 11) { //星级
        this.data = {
          types: 1,
          popshow: true,
          title: "选择等级",
          list: [
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
          form: 'star'
        }
      } else if (data == 12) { // 日期
        this.data = {
          types: 3,
          popshow: true,
          title: "出生日期",
          birther: new Date(),
          form: 'date',
        }
      } else if (data == 3) {// 公司信息
        this.compListShow = true;
        this.compList(1);
        this.$refs.compInfo.current = 1;
        this.$nextTick(() => {  // 滚动条重置
          document.querySelector('#abc').scrollTop = 0;
        })
      }
    },
    close() {
      this.data.popshow = false;
    },
    getCid() {// 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = this.$C || local.C();
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
      console.log(cur, 'cur');
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
            console.log(cur !== 1 || cur !== undefined);
            this.compLists = cur !== 1 ? this.compLists.concat(data) : data;
            this.totalPageCount = res.totalPageCount;
            this.users = res.user;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    savaForms(data) {  // 保存输入框
      this.formData = data;
    },
    savasheets(data) { // 保存下拉框
      console.log(data)
      this.sheetData = data;
    },
    birthdays(data) {
      this.birthday = data;
    },
    Save() { // 表单保存
      let lock = true;
      this.diyColumn.forEach(item => { // 是否为空校验
        if (item.required == 1 && !item.value) {
          lock = false;
        }
      });
      if (!lock) {
        this.$toast('还有必填项没有填写,请填写!')
      } else {
        let crm = {};
        crm.id = 0;
        crm.itrId = this.$U || local.U();
        crm.compId = this.$C || local.C();
        // crm.phone = this.formData.phone;
        crm.nickname = this.formData.name;
        crm.wx = this.formData.wechat;
        crm.qq = this.formData.qq;
        crm.remark = this.formData.note;
        crm.email = this.formData.email;
        crm.gender = this.sheetData.gender?.key;
        console.log(this.company)
        crm.company = this.company;
        console.log(this.sheetData.companyOcc)
        crm.companyOcc = this.sheetData.companyOcc?.key;
        crm.customSourceType = this.sheetData.title?.key;
        // crm.validity = this.sheetData.status?.key;
        crm.status = this.sheetData.status?.key;
        crm.starLevel = this.sheetData.starLevel?.key;
        crm.crmCompId = 0;
        crm.birthday = this.birthday;
        let signature = generateSignature3(0, crm.itrId, crm.compId, timeout, nonce);
        crm.timeout = timeout;
        crm.nonce = nonce;
        crm.signature = signature;
        if (this.$route.params.name && this.$route.params.wxcrmId) { // 如果路由中有参数，聊天工具栏中跳转过来需要绑定wxID
          crm.wxCrmId = this.$route.params.wxcrmId;
        }
        if (crm.companyOcc == 7) {
          crm.companyOcc = -1;
        }
        // columus 自定义字段添加
        if (this.diyColumn.length > 0) {
          this.diyColumn.forEach(item => {
            if (item.value) {
              crm[item.name] = item.value;
            }
          })
        }
        this.$get("/api/request/itr/comp/customer/save", {
          params: crm,
        })
          .then((res) => {
            if (res.error === 'success') {
              this.$toast({
                message: '新增成功',
                position: 'bottom',
              });
              setTimeout(() => {
                if (this.$route.params.name && this.$route.params.wxcrmId) {
                  // 跳转到
                  this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                    overlay: true,
                  });
                  this.getListUserInfo(res.id)
                } else {
                  this.$router.replace({ name: 'Home', params: { status: 'success' } })
                }
              }, 400)
            } else {
              this.$toast.fail(res.errMsg);
            };
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    searchs(value) { // 搜索
      console.log(value[0], value[1]);
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: value[1] || 1,
        size: 20,
        fuzzy: value[0],
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      this.$get("/api/request/itr/comp/customer/company/result", {
        params: data,
      })
        .then((res) => {
          // console.log(res);
          if (!res.error) {
            let data = [];
            if (res.data.length > 0) {
              data = res.data.map(item => {
                var reg = /^(\d{3})\d{4}(\d{4})$/;
                return {
                  ...item,
                  encrypt: item.ownerId.replace(reg, "$1****$2")
                }
              });
            } else {
              data.length = 0;
            }
            this.compLists = value[1] !== 1 ? this.compLists.concat(data) : data;
            this.totalPageCount = res.totalPageCount;
            this.users = res.user;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getColumnConfig() {
      // 请求自定义列表
      let signature = generateSignature3(this.$C || local.C(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("compId", this.$C || local.C());
      param.append("version", 1);
      await this.$post1("/api/request/itr/comp/column/query", param)
        .then((res) => {
          let [List, Lists] = [[], []];
          res.forEach((item) => {  // 合并数组
            if (item.required === 1) {
              List.push(item)
            } else {
              Lists.push(item)
            }
          });
          this.diyColumn = List.concat(Lists)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    showPopup(item, index) {  // 打开自定义表单
      if (item.type == 'text' || item.type == 'textarea') {
        this.diy.show = true;
        this.diy.item = JSON.parse(item.items).map(item => {
          return {
            ...item,
            name: item.label
          }
        });
      } else if (item.type == 'checkbox') {
        // 分为两种情况第一种情况是y用用户曾经选中过。
        // 这样的话就不能check=false; 反之check= false；
        let backItem = JSON.parse(item.items);
        let a = backItem.find(item => item.check);
        console.log(a, 'aaaaaa')
        if (!a) {
          this.diy.item = backItem.map(item => {
            return {
              ...item,
              check: false
            }
          });
        } else {
          this.diy.item = backItem;
        }
        console.log(this.diy.item)
        this.diy.checkoutPop = true;
      } else {
        this.diy.showaction = true;
        this.diy.item = JSON.parse(item.items).map(item => {
          return {
            ...item,
            name: item.label
          }
        });
      }
      this.diy.name = item.label;
      this.diy.type = item.type;
      this.diy.placeholder = item.placeholder
      this.index = index;
      this.diy.price = item.value;
    },
    DiySave() {  // 自定义确定
      this.diy.show = false;
      console.log(this.diy.price)
      this.diyColumn[this.index].value = this.diy.price;
    },
    onSelect(value) { // select选择确认
      this.diyColumn[this.index].value = value.value;
      this.diy.showaction = false;
    },
    actionSheet() { // 当多选类型框关闭的时候，进行过滤
      let value = '';
      let label = '';
      this.diy.item.forEach(item => {
        if (item.check) {
          value += item.id + ',';
          label += item.label + ',';
        }
      });
      console.log(this.diyColumn[this.index], 'diyColumndiyColumn', this.index)
      this.diyColumn[this.index].value = label;
      this.$set(this.diyColumn, this.index, this.diyColumn[this.index])
      // this.diy.checkoutPop = false;
    },
    checkBoxChange(item, index) {  // 
      this.diy.item[index].check = item.check;
      let origin = JSON.parse(this.diyColumn[this.index].items);
      let check = { check: item.check };
      let result = { ...JSON.parse(this.diyColumn[this.index].items)[index], ...check }
      origin[index] = JSON.parse(JSON.stringify(result));
      this.diyColumn[this.index].items = JSON.stringify(origin);
    },
    closePop() {
      this.diy.show = false;
    },
    async checkIng() { // 查重数据每次保存时候查重时候有这个数据
      let lock = false;
      let rg = /^wm/;
      this.diyColumn.forEach(item => { // 判断是手机号还是微信ID
        if (item.name === 'phone') {
          if (item.value.length > 30 && rg.test(item.value)) { // 长度限制。开都字母限制
            lock = true;
          }
        }
      });
      if (lock) { // 两种情况第一种没有改变输入框，直接保存并且绑定
        this.Save()
      } else {      // 2.改变了手机输入框为手机号,查重并弹框
        this.$toast.loading({
          message: '查询中...',
          forbidClick: false,
          duration: 0,
          overlay: true,
        });
        let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
        let param = new URLSearchParams();
        let phone;
        this.diyColumn.forEach(item => {
          if (item.name === 'phone') {
            phone = item.value;
          }
        });
        this.findPhone = phone;
        await this.whetherList();
        param.append("compId", this.$C || local.C());
        param.append("phone", phone);
        param.append("nonce", nonce);
        param.append("signature", signature);
        param.append("timeout", timeout);
        param.append("current", 1);
        param.append("size", 20);
        // 请求并且跳转页面
        this.$post1("/api/request/itr/comp/customer/rechecking", param)
          .then((res) => {
            // alert(res.data.length)
            // alert(this.whetherExist)
            // alert(res.data[0].wxCrmId)
            if (res.data.length === 0) { // 查重不存在直接保存 
              this.Save()
            } else if (res.data.length > 0) { // 查重存在 && 
              if (this.whetherExist && res.data[0].wxCrmId) { // 联系人列表存在 && 绑定了联系人
                this.$dialog.confirm({
                  title: '温馨提示',
                  message: '该手机号已经绑定其他用户，继续绑定会解绑已绑定用户，是否继续保存。',
                })
                  .then(() => {
                    this.edit(res.data[0].id) // 绑定企业微信ID;
                  })
                  .catch(() => {
                    wx.closeWindow(); // 关闭页面
                  });
              } else if (this.whetherExist && !res.data[0].wxCrmId) {
                this.edit(res.data[0].id) // 绑定企业微信ID
                this.$toast('绑定联系人成功')
              } else {
                this.$toast('该手机号已存在且不属于你，请联系管理员处理'); // 联系人列表不存在
                setTimeout(() => {
                  wx.closeWindow() // 退回到聊天框
                }, 3000)
              }
            }
            // if (res.data.length === 0 && !this.whetherExist) { // 证明没有数据。不能保存
            //   wx.closeWindow() // 退回到聊天框
            // } else if (res.data.length > 0 && res.data[0].wxCrmId) { // 有数据且绑定了联系人
            //   console.log('有数据并且绑定了联系人')
            //   this.$dialog.confirm({
            //     title: '温馨提示',
            //     message: '是否继续保存',
            //   })
            //     .then(() => {
            //       // on confirm
            //       this.edit(res.data[0].id) // 绑定企业微信ID;
            //     })
            //     .catch(() => {
            //       wx.closeWindow(); // 关闭页面
            //     });
            // } else if (res.data.length > 0 && !res.data[0].wxCrmId) { // 有数据且没绑定联系人
            //   this.edit(res.data[0].id) // 绑定企业微信ID
            //   this.$toast('绑定联系人成功')
            // }
            // this.$toast.clear()
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      return;
    },
    async whetherList() {// 判断手机号在联系人列表里存在么？
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      let phone;
      this.diyColumn.forEach(item => {
        if (item.name === 'phone') {
          phone = item.value;
        }
      });
      param.append("type", 1);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("fuzzy", this.findPhone);
      param.append("current", 1); // 默认页数是1
      param.append("signature", signature);
      await this.$post1("/api/request/itr/comp/customer/query", param)
        .then((res) => {
          console.log(res)
          if (res.data.length > 0) { // 证明联系人列表中存在
            this.whetherExist = true;
          }
        })
        .catch(function (error) { });
    },
    formatter(value) {  // 限制字符串类型 
      if (this.diyColumn[this.index].name === 'phone') {  // 表单类型为手机时候就校验
        var re = /[^0-9a-zA-Z\-\_]*$/g;  // 数字字母_-允许
        return value.replace(re, '');
      } else {
        return value;
      }
    },
    edit(wxId) { // 聊天工具栏绑定wxcrmID用。
      let crm = {};
      crm.id = wxId; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = this.$route.params.wxcrmId;
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
          this.$toast.loading({
            message: '保存中...',
            forbidClick: true,
            duration: 0,
            overlay: true,
          });
          this.getListUserInfo(res.id)
        })
        .catch(function (error) {
          console.log(error);
          this.$toast.clear()
        });
    },
    getListUserInfo(id) { // 此接口通过列表项的id 获取当前联系人数据，主要跳转用；
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("fuzzy", id);
      param.append("current", 1); // 默认页数是1
      param.append("signature", signature);
      this.$post1("/api/request/itr/comp/customer/query", param)
        .then((res) => {
          sessionStorage.setItem('tabNum', 0); // 保存数据并且跳转
          sessionStorage.setItem('_crm_info', JSON.stringify(res.data[0]))
          this.$toast.clear()
          this.$router.replace({ name: 'LinkDetailed' });
        })
        .catch(function (error) {
          this.$toast.clear()
        });
    },
  },
  components: { addpop, compInfo },
  async created() {
    console.log(this.$route.params.name)
    await this.getColumnConfig();
    this.getCid();
    console.log(this.$route, 'this.$routethis.$reoute')
    if (this.$route.params.name && this.$route.params.wxcrmId) { // 如果存在这两个参数，证明是从客户画像中跳转过来的

      this.diyColumn.forEach(item => { //  回显数据...
        if (item.name === 'nickname') {
          item.value = this.$route.params.name;
        } else if (item.name === 'phone') {
          item.value = this.$route.params.wxcrmId;
        }
      })
      this.$forceUpdate()
    }
  },
  beforeRouteLeave: (to, from, next) => {
    if (to.name === 'ChatCustomer') {
      next(false);
    } else {
      next();
    }
  }
}
</script>

<style lang="less" scoped>
.Addcustomer {
  padding-bottom: 44px;
  .hehi {
    margin-top: 10px;
    display: block;
    margin: 10px auto 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .btnTb {
    position: fixed;
    right: 0;
    width: 100%;
    bottom: 0;
    height: 40px;
    font-size: 0.3rem;
  }
  .pop-tit {
    font-size: 16px;
    padding: 10px;
  }
  /deep/ .van-cell__value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 3rem;
    color: #7c7878;
  }
}
</style>