  /*
 * @Author: YUN_KONG 
 * @Date: 2021-05-19 09:51:48 
 * @Last Modified by: Tian
 * @Last Modified time: 2021-07-07 17:49:45
   绑定弹框组件
 */
<template>
  <van-popup
    class="bindPop"
    v-model="shows"
    :close-on-click-overlay="false"
    position="bottom"
    :style="{ height: '300px' }"
    overlay-class="popup"
    @close="popclose"
  >
    <div class="hView">
      <div class="hint">
        <van-icon name="warning" size="25px" />
        <p class="qy-hint">企业微信绑定</p>
      </div>
      <p class="qy-hint1">当前账号没有绑定乐语，请输入手机号进行绑定</p>
    </div>
    <van-field
      v-model="sms"
      type="tel"
      center
      clearable
      label="手机号"
      class="inp"
      placeholder="请输入手机号"
    >
      <template #button>
        <van-button
          size="small"
          type="primary"
          @click="clicksendCode"
          :disabled="times < 60"
          >{{ sendings }}</van-button
        >
      </template>
    </van-field>
    <van-field
      v-model="codes"
      type="digit"
      center
      clearable
      label="验证码"
      class="inp"
      placeholder="请输入验证码"
    >
      <template #button>
        <van-button
          size="small"
          type="danger"
          @click="bindlooyuCode"
          class="bind"
          >绑定</van-button
        >
      </template>
    </van-field>
  </van-popup>
</template>

<script>
import { generateTimeout, generateSignature, generateSignature8, generateNonce, generateSignature4 } from "../../uilts/tools";
let nonce = generateNonce();
let timeout = generateTimeout();
import local from '../../uilts/localStorage';
export default {
  name: "bindPop",
  components: {},
  inject: ['registerOpen', 'registerClose'],
  props: ['shows'],
  data() {
    return {
      sms: '',
      codes: "",
      times: 60,
      coinNumber: 0,
      sendings: "发送验证码",
    };
  },
  watch: {},
  computed: {},
  methods: {
    clicksendCode() {
      let that = this;
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(this.sms)) {
        this.$toast.fail("请输入正确的手机号");
        return;
      }
      this.time(); // 倒计时60秒
      this.sendCode(); // 发送验证码·
    },
    time() {
      // 验证码倒计时方法
      var timer = setInterval(() => {
        if (this.times == 0) {
          // 清除定时器和复原按钮
          clearInterval(timer);
          this.sendings = "重新发送";
          this.times = 60; // 重新赋值时间变量
        } else {
          this.sendings = this.times + "秒后可再次发送";
          this.times--;
        }
      }, 1000);
    },
    sendCode() {
      // 发送验证码
      let that = this;
      let signature = generateSignature(this.sms, 2, timeout, nonce);
      this.$get(
        "/api/remote/util/sms",
        {
          params: {
            id: this.sms,
            type: 2,
            timeout: timeout,
            nonce: nonce,
            clientType: 2,
            signature: signature,
          },
        },
      )
        .then((res) => {
          if (res.error == "success") {
          } else {
            this.$toast("获取失败，请稍后再试");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    userInfos() { // 获取当前联系人信息
      return JSON.parse(sessionStorage.getItem('userinfo'));
    },
    bindlooyuCode() {
      let that = this;
      this.bindLooyu()
      return;
      let signature = generateSignature8(this.sms, 1, 3, timeout, nonce);
      let param = new URLSearchParams();
      param.append("id", this.sms);
      param.append("type", 1);
      param.append("code", this.codes);
      param.append("nonce", nonce);
      param.append("clientType", 3);
      param.append("timeout", timeout);
      param.append("signature", signature);
      this.$post1("/api/remote/itr/user/login", param)
        .then(function (res) {
          if (res.error != "success") {
            that.$toast.fail("验证码错误");
          } else {
            that.bindLooyu(); // 绑定乐语
          }
        })
        .catch(function (error) {
          that.$toast.fail("请求失败，请稍后再试");
        });
    },
    bindLooyu() {
      // 确定绑定
      if (!this.codes) {
        this.$toast('请输入验证码')
        return;
      }
      let CorpId = sessionStorage.getItem("CorpId"); // 保存openID 解绑用
      let openId = sessionStorage.getItem("openId"); // 保存openID 解绑用
      let bind_UserID = sessionStorage.getItem("bind_UserID"); // 保存openID 解绑用
      let UserId = sessionStorage.getItem("UserId"); // 保存openID 解绑用 
      let code = JSON.parse(sessionStorage.getItem('codeBasice'))
      let signature = generateSignature4(
        openId,
        this.sms,
        timeout,
        nonce
      );
      this.$get("/work/wx/bind/itr", {
        params: {
          openId: openId,
          itrId: this.sms,
          wxUserId: bind_UserID || UserId,
          timeout,
          nonce,
          signature,
          bindWxCompId: CorpId,
          code: this.codes,
          suiteId: code.suiteId,
          remark:'通过企业微信加入'
        },
      })
        .then((res) => {
          console.log(res,'QQA')
          if (res.msg == 'success' && res.code == 200) {
            console.log(2132131)
            this.registerClose(res);
            this.times = 60;
          } else {
            this.$toast(res.msg)
            this.times = 60;
          }
        })
        .catch((error) => {
          console.log(error,'123312')
        });
    },
    popclose() { // 关闭时候清空状态
      this.sms = '';
      this.codes = '';
      this.times = 60;
    }
  },
  created() { },
  mounted() { }
};
</script>

<style lang="less" scoped>
.bindPop {
  .hView {
    padding: 0 16px;
  }
  .module {
    width: 33%;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    span:first-child {
      margin-bottom: 10px;
      font-size: 0.28rem;
      color: #767676;
    }
    span:last-child {
      margin-bottom: 10px;
      font-size: 0.32rem;
      font-weight: 550;
    }
  }
  .circle {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    background: #868686;
    vertical-align: middle;
    display: inline-block;
    margin-right: 0.1rem;
  }
  .notice {
    list-style-type: initial;
    width: 100%;
    color: #868686;
    height: 35px;
    line-height: 25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bulletin {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 25px;
    background: #fff;
    margin-bottom: 1.5px;
    span {
      color: #7f7f7f;
      font-weight: 500;
    }
  }
  .btn {
    button {
      background: #fff;
      border: none;
      height: 0.5rem;
      padding: 0 10px;
      font-size: 0.24rem;
      border: 1px solid #eee;
      line-height: 0.55rem;
    }
    button:first-child {
      color: #fff;
      background: #ff5756;
      border-radius: 5px 0 0 5px;
    }
    button:last-child {
      background: #fff;
      color: #000;
      border-radius: 0 5px 5px 0;
      border-left: none;
    }
  }
  .redot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: red;
    margin: 12px 5px 1.5px 3px;
    float: right;
    display: inline-block;
  }
  .compTit {
    text-align: center;
    font-size: 16px;
    color: #000;
    border-bottom: 1px solid #eee;
  }
  .hint {
    display: flex;
    margin-top: 0.3rem;
  }
  .hint i {
    margin-top: 8px;
  }
  .qy-hint {
    font-size: 0.4rem;
    margin: 8px 8px;
    font-weight: 900;
    margin-top: 8px;
    color: #000;
  }
  .qy-hint1 {
    font-size: 0.28rem;
    font-weight: 500;
    color: #000;
    margin-bottom: 11px;
    line-height: 30px;
  }
}
</style>