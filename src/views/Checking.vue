<template>
  <div class="about">
    <van-form validate-first @failed="onFailed">
      <van-field v-model="phone" name="pattern" placeholder="输入用户手机号" />
      <van-field v-model="name" name="pattern" placeholder="输入客户姓名" />
      <van-field v-model="compName" name="pattern" placeholder="输入公司名称" />
      <van-field v-model="weChat" name="pattern" placeholder="输入客户微信号" />
      <van-field v-model="qq" name="pattern" placeholder="输入客户QQ号" />
      <div style="margin: 16px;">
        <van-button round block type="default" native-type="submit" class="btn" @click="onSubmit">
          查询
        </van-button>
      </div>
    </van-form>
    <van-popup v-model="show" position="bottom" closeable :style="{ height: '100%' }" @close="closePop">
      <div class='text-ali'>查重结果</div>
      <div @scroll="scrollEvent" id="abc">
        <div class="checkView" v-for="(item,index) in data" :key="index">
          <p><span class="title">{{item.nickname}}</span><span>（{{user[item.ownerId].nickname}}）</span></p>
          <p>{{item.company === null ? "未填写公司名称" : item.company}}</p>
        </div>
      </div>

    </van-popup>
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3, randomWord } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import local from '../uilts/localStorage';

import { Notify } from 'vant';
export default {
  name: 'Checking',
  data() {
    return {
      phone: "",
      name: "",
      compName: "",
      weChat: "",
      qq: "",
      show: false,
      data: [],
      user: {},
      current: 1,
      total: 0
    }
  },
  methods: {
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
    onSubmit() {
      let that = this;
      let { phone, name, compName, weChat, qq } = this;
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      let param = new URLSearchParams();
      param.append("compId", this.$C || local.C());
      name !== "" ? param.append("name", name) : null;
      compName !== "" ? param.append("company", compName) : null;
      qq !== "" ? param.append("qq", qq) : null;
      weChat !== "" ? param.append("wx", weChat) : null;
      phone !== "" ? param.append("phone", phone) : null;
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("current", this.current);
      param.append("size", 20);
      if (phone === "" && name === "" && compName === "" && weChat === "" && qq === "") {
        this.$toast.fail('请输入要查重的客户信息');
      } else {
        // 请求并且跳转页面
        this.$post1("/api/request/itr/comp/customer/rechecking", param)
          .then(function (res) {
            if (res.data.length === 0) {
              that.$toast.fail('未查询到相关客户信息');
            } else {
              let datasss = res.data;
              console.log(datasss);
              that.data = that.current == 1 ? res.data : that.data.concat(res.data);
              that.user = res.user;
              that.show = true;
              that.total = res.totalPageCount;
              that.$toast.clear()
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    closePop() {
      this.current = 1;
    },
    scrollEvent() {
      let read = document.querySelector('#abc')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (scrollTop + windowHeight == scrollHeight) {
        console.log('============到底了13123========');
        this.current = ++this.current;
        if (this.total < this.current) return;
        this.$toast.loading('加载中...');
        this.onSubmit();
      }
    },
  },
  created() {

  },
  destroyed() {
    this.current = 1;
  }
}
</script>
<style lang="less" scoped>
.about {
  height: calc(~"100vh - 50px");
  background: #f1f1f1;
  input {
    outline: none;
  }
  .van-popup {
    background: #f1f1f1;
  }
  div:first-child {
    border-top: 1px solid #f1f1f1;
  }
  .checkView {
    display: flex;
    padding: 0.2rem 0.4rem;
    color: #3b3b3b;
    font-size: 14px;
    justify-content: center;
    flex-direction: column;
    height: 1rem;
    background: #fff;
    .title {
      font-size: 15px;
      font-weight: 800;
    }
    p:first-child {
      padding-top: 0.1 rem;
    }
    p:last-child {
      padding-top: 0.2rem;
    }
  }
  .text-ali {
    position: fixed;
    top: -1px;
    left: 0px;
    text-align: center;
    width: 100%;
    font-size: 0.32rem;
    height: 46px;
    line-height: 52px;
    background: #5c5c5c;
    color: #fff;
  }
  #abc {
    height: 100%;
    overflow-y: scroll;
    div:first-child {
      margin-top: 46px;
    }
  }
}
</style>