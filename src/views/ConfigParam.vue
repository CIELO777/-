<template>
  <div class="ConfigParam">
    <iframe
      src="https://api.jiain.net/web/#/p/c6d34aae4ef139057b138bd9815fa1e5"
      frameborder="0"
      class="Configiframe"
    ></iframe>
    <div class="form">
      <van-form validate-first @failed="onFailed" @submit="onsubmit">
        <!-- 通过 pattern 进行正则校验 -->
        <van-field
          v-model="wxCompId"
          label-width="150px"
          name="pattern"
          label="企业ID:"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <!-- 通过 validator 进行函数校验 -->
        <van-field
          v-model="wxAgentId"
          name="validator"
          label-width="150px"
          label="自建应用AgentId:"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <!-- 通过 validator 进行异步函数校验 -->
        <van-field
          v-model="wxSecret"
          name="asyncValidator"
          label="自建应用Secret:"
          label-width="150px"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="addressSecret"
          name="asyncValidator"
          label="客户联系Secret:"
          label-width="150px"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="compId"
          name="asyncValidator"
          label="乐语公司ID:"
          label-width="150px"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature4 } from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "ConfigParam",
  components: {},
  props: [],
  data() {
    return {
      wxCompId: '',
      wxAgentId: '',
      wxSecret: '',
      addressSecret: '',
      compId: '',
    };
  },
  watch: {},
  computed: {},
  methods: {
    validator(val) { // 非空校验
      return !/^\s*$/.test(val);
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
    onsubmit(values) {
      console.log(values)
      let param = new URLSearchParams();
      let signature = generateSignature4(timeout, nonce);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("addressSecret", this.addressSecret);
      param.append("wxSecret", this.wxSecret);
      param.append("wxAgentId", this.wxAgentId);
      param.append("wxCompId", this.wxCompId);
      param.append("compId", this.compId);
      this.$post1("/work/wx/corp/bind", param)
        .then((res) => {
          if (res.code == 200) {
            this.$toast.success('配置成功！')
          } else {
            this.$toast.fail(res.msg)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  created() { },
  mounted() { }
};
</script>

<style lang="less" scoped>
.ConfigParam {
  font-size: 18px;
  display: flex;
  .Configiframe {
    width: 60%;
    height: 100vh;
  }
  .form {
    flex: 1;
  }
  /deep/ .van-cell__title {
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }
  /deep/ .van-field__body {
    background: #eee;
    border-radius: 20px;
    height: 30px;
    padding: 0 5px;
    input {
      outline: none;
      background: #eee;
      &:focus {
        outline: 0;
        background: #eee;
      }
      &:-webkit-autofill {
        -ms-box-shadow: 0 0 0px 1000px #eee inset !important;
        -webkit-box-shadow: 0 0 0px 1000px #eee inset !important;
        -moz-box-shadow: 0 0 0px 1000px #eee inset !important;
      }
    }
  }
}
</style>