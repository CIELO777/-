<template>
  <div class="Addcustomer">
    <van-cell :value="formData.name" is-link @click="clickCell(1)">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">姓名</span>
        <span style="color:red;font-size:18px">*</span>
      </template>
    </van-cell>
    <van-cell :value="formData.phone" is-link @click="clickCell(13)">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">手机</span>
        <span style="color:red;font-size:18px">*</span>
      </template>
    </van-cell>
    <van-cell :value="sheetData.gender ? sheetData.gender.value : ''" is-link @click="clickCell(2)" title="性别"></van-cell>
    <van-cell :value="company" is-link @click="clickCell(3)" title="公司信息"></van-cell>
    <van-cell :value="sheetData.companyOcc ? sheetData.companyOcc.value : ''" is-link @click="clickCell(4)" title="公司职务"></van-cell>
    <van-cell :value="formData.note" is-link @click="clickCell(5)" title="备注"></van-cell>
    <van-cell :value="sheetData.title ? sheetData.title.value : ''" is-link @click="clickCell(6)" title="来源类型"></van-cell>
    <van-cell :value="sheetData.status ? sheetData.status.value : ''" is-link @click="clickCell(7)" title="有效性"></van-cell>
    <van-cell :value="formData.wechat" is-link @click="clickCell(8)" title="微信"></van-cell>
    <van-cell :value="formData.qq" is-link @click="clickCell(9)" title="QQ"></van-cell>
    <van-cell :value="formData.email" is-link @click="clickCell(10)" title="邮箱"></van-cell>
    <van-cell :value="sheetData.starLevel ? sheetData.starLevel.value : ''" is-link @click="clickCell(11)" title="星级"></van-cell>
    <van-cell :value="birthday ? birthday : ''" is-link @click="clickCell(12)" title="出生日期"></van-cell>
    <addpop ref="addpop" :data="data" @birthday="birthdays" @savasheet="savasheets" @savaForm="savaForms" :formDatas="formData" @childClose="close"></addpop> <!-- 输入框和选择框 -->
    <compInfo route="addcustomer" :companys.sync="company" ref="compInfo" :totalPageCounts="totalPageCount" :compshow.sync="compListShow" :user="users" :list="compLists"></compInfo> <!-- 公司信息列表 -->
    <van-button color="rgb(81, 187, 186)" @click="Save" type="primary" block>保存</van-button>
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
    }
  },
  methods: {
    clickCell(data) {
      if (data == 1) { //姓名
        this.data = {
          types: 2,
          popshow: true,
          title: "修改姓名",
          maxLength: 25,
          form: 'name',
          inpType: "textarea"
        }
        this.$refs.addpop.update('name', this.formData)
      } else if (data == 13) { //手机
        this.data = {
          types: 2,
          popshow: true,
          title: "修改手机",
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
          title: "修改备注",
          maxLength: 500,
          form: 'note',
          inpType: "textarea"
        }
        this.$refs.addpop.update('note', this.formData)
      } else if (data == 8) { //微信
        this.data = {
          types: 2,
          popshow: true,
          title: "修改微信",
          maxLength: 50,
          form: 'wechat',
          inpType: "textarea"
        }
        this.$refs.addpop.update('wechat', this.formData)
      } else if (data == 9) { //QQ
        this.data = {
          types: 2,
          popshow: true,
          title: "修改QQ",
          maxLength: 20,
          form: 'qq',
          inpType: "digit"
        }
        this.$refs.addpop.update('qq', this.formData)
      } else if (data == 10) { //邮箱
        this.data = {
          types: 2,
          popshow: true,
          title: "修改邮箱",
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
          title: "修改星级",
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
        this.compList();
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
    savaForms(data) {  // 保存输入框
      this.formData = data;
    },
    savasheets(data) { // 保存下拉框
      this.sheetData = data;
    },
    birthdays(data) {
      this.birthday = data;
    },
    Save() {
      console.log(this.formData, this.sheetData, this.company, this.birthday);
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
        crm.gender = this.sheetData.gender?.key;
        crm.company = this.sheetData.company?.key;
        crm.companyOcc = this.sheetData.companyOcc?.key;
        crm.customSourceType = this.sheetData.title?.key;
        crm.validity = this.sheetData.status?.key;
        crm.starLevel = this.sheetData.starLevel?.key;
        crm.crmCompId = 0;
        crm.birthday = this.birthday;
        let signature = generateSignature3(0, crm.itrId, crm.compId, timeout, nonce);
        crm.timeout = timeout;
        crm.nonce = nonce;
        crm.signature = signature;
        // if (crm.sourceType) {
        //   crm.customSourceType = crm.sourceType || "";
        // }
        if (crm.companyOcc == 7) {
          crm.companyOcc = -1;
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
                this.$router.replace('/')
              }, 800)
            } else {
              this.$toast.fail(res.errMsg);
            };
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  },
  components: { addpop, compInfo },
  created() {
    this.getCid();

  }
}
</script>

<style lang="less" scoped>
.Addcustomer {
  button {
    margin-top: 10px;
    display: block;
    margin: 10px auto 0;
    width: 94%;
  }
}
</style>