<template>
  <div id="app">
    <!-- 下拉菜单 -->
    <div class="test_triangle_border" v-show="MenuPop" ref="treeWrap">
      <div class="popup">
        <ul>
          <li @click="unbind">确定解绑？</li>
        </ul>
      </div>
    </div>
    <!-- 下拉弹框 -->
    <van-popup
      closeable
      v-model="show"
      round
      :style="{ height: '350px', width: '75%' }"
      class="popUnbind"
    >
      <div class="unbindnav">
        <img src="./assets/img/unbind1.png" alt="" />
        <div class="hint">
          <p class="qy-hint" style="padding-left: 0">解绑</p>
          <van-icon name="warning" size="22px" color="red" />
        </div>
        <p style="text-align: center; font-size: 15px; line-height: 25px">
          您是否要解绑乐语ID:<span style="color: red">{{ userinfo }}</span>
        </p>
        <input
          type="text"
          v-model="unvalue"
          placeholder="请输入unbind以确认解绑该账号（不区分大小写）"
        />
      </div>
      <van-button
        type="danger"
        size="large"
        class="unbindbtn"
        round
        @click="unbindSave"
        >解绑</van-button
      >
    </van-popup>
    <Taber v-if="$store.state.tabarShow"></Taber>
    <keep-alive :include="cacheState">
      <router-view v-if="isRouterAlive" />
    </keep-alive>
  </div>
</template>
<script>
import Taber from './components/Tabbar';
import { generateTimeout, generateNonce, generateSignature3, generateSignature4 } from './uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
import websocket from './uilts/websocket'
import Utils from './uilts/utils';
export default {
  components: {
    Taber,
  },
  provide() {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
    return {
      reload: this.reload,
      unbind: this.unbind,
    }
  },
  data() {
    return {
      tabbarShow: true,
      topBar: true,
      cacheStates: '',
      MenuPop: false,
      show: false,
      userinfo: "",
      unvalue: "",
      isRouterAlive: true
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() { // 右侧点击事件
      this.MenuPop = true;
    },
    unbind() { // 解绑菜单按钮
      this.userinfo = JSON.parse(sessionStorage.getItem('userinfo'))?.id; // 回显userID
      this.show = true;
    },
    unbindSave() { // 确认解绑
      let that = this;
      if (this.unvalue.toLowerCase() === 'unbind') {
        let openId = sessionStorage.getItem("openId");
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))?.id
        let signature = generateSignature4(openId, userinfo, nonce, timeout)
        let param = new URLSearchParams();
        param.append("openId", openId);
        param.append("itrId", userinfo);
        param.append("nonce", nonce);
        param.append("timeout", timeout);
        param.append("signature", signature);
        this.$post1('/wx-crm-server/wx/un/bind/itr', param)
          .then(function (res) {
            if (res.code === 200) {
              that.$toast.success('该账号解绑成功');
              that.show = false; // 解绑成功关闭弹框
              sessionStorage.clear() // 清除所有缓存
              that.$router.replace('/') // 跳转到首页进行重新绑定
              Utils.$emit('reset', 'msg');
            } else {
              that.$toast.fail('解绑失败,请稍后再试');
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        this.$toast.fail('请在输入框输入unbind确认解绑')
      }
    },
    unbindsss() {
      this.unbind()
    },
    reload() {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;//再打开
      })
    }
  },
  computed: {
    cacheState() {
      console.log(this.$store.state.cacheState, '缓存的页面', window.location.href);
      return this.$store.state.cacheState;
    }
  },
  mounted() {
    document.addEventListener('mouseup', (e) => {
      let tree = this.$refs.treeWrap
      if (tree) {
        if (!tree.contains(e.target)) {
          this.MenuPop = false
        }
      }
    })
  },
  created() {
    // websocket.Init(); // 开启socket 连接
  }
}
</script>
<style lang="less">
html,
body {
  height: 100%;
}
/deep/ .van-loading {
  color: red;
}
/deep/ 
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  background: #f1f1f1;
  .navTit {
    width: 100vw;
    background: red;
    height: 0.92rem;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }
  .nav-bar .van-nav-bar {
    background: #5c5c5c;
    z-index: 999;
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-nav-bar__left i {
    color: #fff;
  }
}
.sha {
  width: 100vw;
  height: 40px;
  background: red;
  position: fixed;
  top: 0;
  left: 0;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.test_triangle_border {
  width: 80px;
  position: fixed;
  right: 8px;
  top: 44px;
  z-index: 99999;
  font-size: 0.28rem;
  color: #fff;
}

.test_triangle_border .popup {
  background: #4a4a4a;
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  li {
    text-align: center;
  }
}

.test_triangle_border .popup::before {
  content: "";
  width: 0px;
  height: 0px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #4a4a4a;
  left: 71%;
  top: -10px;
  position: absolute;
  margin-left: -10px;
}

.test_triangle_border .popup::after {
  content: "";
  width: 0px;
  height: 0px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #4a4a4a;
  left: 71%;
  top: -9px;
  position: absolute;
  margin-left: -10px;
}
.unbindnav {
  // padding: 0.4rem;
  font-size: 0.34rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p:nth-child(2) {
    margin-top: 0.3rem;
  }
  img {
    width: 100%;
    height: 120px;
  }
  .hint {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.2rem;
  }
  .qy-hint {
    font-size: 0.4rem;
    margin: 8px 8px;
    font-weight: 900;
    margin-top: 8px;
    color: #000;
  }
  input {
    border: 1px solid #eee;
    width: 90%;
    margin-top: 0.3rem;
    font-size: 12px;
    padding: 8px 0;
  }
}
.popUnbind {
  overflow-y: hidden;
  .unbindbtn {
    position: fixed;
    bottom: 0.4rem;
    left: 10%;
    height: 44px;
    font-size: 12px;
    width: 80%;
  }
}
</style>
