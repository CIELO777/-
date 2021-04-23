<template>
  <div class="Addcustomer">
    <van-cell :value="formData.name" is-link @click="clickCell(1)">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">姓名</span>
        <span style="color: red; font-size: 18px">*</span>
      </template>
    </van-cell>
    <van-cell :value="formData.phone" is-link @click="clickCell(13)">
      <!-- 使用 title 插槽来自定义标题 -->
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
    ></van-cell>
    <!--自定义列表 -->
    <template v-for="(item, index) in diyColumn">
      <van-cell
        is-link
        :key="index"
        v-if="item.display == 1"
        @click="showPopup(item, index)"
        :title="item.label"
        :value="item.value"
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
      @click="Save"
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
      diy: {
        name: "",
        show: false,
        showaction: false,
        type: '',
        placeholder: "",
        item: [],
        price: "",
        checkoutPop: false,
      }

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
      if (JSON.stringify(this.formData) == '{}') {
        this.$toast({
          message: '请填写姓名和手机',
          position: 'bottom',
        });
        return;
      }
      if (this.formData.name === '') {
        this.$toast({
          message: '姓名不能为空',
          position: 'bottom',
        });
      } else if (this.formData.phone === '') {
        this.$toast({
          message: '手机不能为空',
          position: 'bottom',
        });
      } else {
        let crm = {};
        crm.id = 0;
        crm.itrId = this.$U || local.U();
        crm.compId = this.$C || local.C();
        crm.phone = this.formData.phone;
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
        // crm.validity = this.sheetData.status;
        crm.crmCompId = 0;
        crm.birthday = this.birthday;
        let signature = generateSignature3(0, crm.itrId, crm.compId, timeout, nonce);
        crm.timeout = timeout;
        crm.nonce = nonce;
        crm.signature = signature;
        if (crm.companyOcc == 7) {
          crm.companyOcc = -1;
        }
        // columus 自定义字段添加
        if (this.diyColumn.length > 0) {
          this.diyColumn.forEach(item => {
            if (item.value) {
              console.log(item)
              crm[item.name] = item.value;
            }
          })
        }
        // return;
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
                this.$router.replace({ name: 'Home', params: { status: 'success' } })
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
      await this.$post1("/api/request/itr/comp/column/query", param)
        .then((res) => {
          this.diyColumn = res;
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
    }
  },
  components: { addpop, compInfo },
  async created() {
    await this.getColumnConfig()
    this.getCid();

  }
}
</script>

<style lang="less" scoped>
.Addcustomer {
  margin-bottom: 44px;
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
}
</style>