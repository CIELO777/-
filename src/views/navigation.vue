<template>
  <div class="navigation">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 100vh;">
      <div class="bulletin">
        <span>营销简报</span>
        <div class="btn">
          <button :style="style" @click="date('today')">今日</button><button :style="style1" @click="date('month')">本月</button>
        </div>
      </div>
      <section class='one'>
        <div class="module">
          <span>转发次数</span>
          <span>{{shareNumber}}次</span>
        </div>
        <div class="module">
          <span>带来流量</span>
          <span>{{trajectoryNumber}}个</span>
        </div>
        <div class="module">
          <span>新增联系人</span>
          <span>{{contactNumber}}个</span>
        </div>
        <div class="module">
          <span>联系客户</span>
          <span>{{contactCustomerNumber}}次</span>
        </div>
        <div class="module">
          <span>新增推广豆</span>
          <span>{{coinNumber}}个</span>
        </div>
        <div class="module">
          <span>新增订单</span>
          <span>{{orderNumber}}个</span>
        </div>
      </section>
      <h1>营销素材库</h1>
      <section class='two'>
        <van-badge class="two-view">
          <img src="../../public/img/icon/企业名片.png" alt="" @click="skip('card')">
          <span>企业名片</span>
        </van-badge>
        <van-badge class="two-view">
          <img src="../../public/img/icon/宣传彩页.png" alt="" @click="skip('colorPage')">
          <span>宣传彩页</span>
        </van-badge>
        <van-badge class="two-view">
          <img src="../../public/img/icon/视频素材.png" alt="" @click="skip('video')">
          <span>视频素材</span>
        </van-badge>
      </section>
      <h1>营销过程管理</h1>
      <section class='two'>
        <van-badge class="two-view">
          <img src="../../public/img/icon/客户管理.png" alt="" @click="skip('manage')">
          <span>客户管理</span>
        </van-badge>
      </section>
      <h1>内部公告</h1>
      <ul class='two' style="padding: 10px 20px;" v-if="Notice.length > 0">
        <template v-for="(item,index) in Notice">
          <li :key="index" class="notice"> <span class="circle"></span><span style="margin-right:5px">{{item.createTimes}}</span>{{item.content}}</li>
        </template>
      </ul>
    </van-pull-refresh>
    <!-- 企业微信验证码 -->
    <van-popup v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '45%' }" overlay-class="popup">
      <div class="hView">
        <div class="hint">
          <van-icon name="warning" size="25px" />
          <p class="qy-hint">
            企业微信绑定
          </p>
        </div>
        <p class="qy-hint1">当前账号没有绑定乐语，请输入手机号进行绑定</p>
      </div>
      <van-field v-model="sms" type="tel" center clearable label="手机号" class="inp" placeholder="请输入手机号">
        <template #button>
          <van-button size="small" type="primary" @click="clicksendCode" :disabled="times < 60">{{ sendings }}</van-button>
        </template>
      </van-field>
      <van-field v-model="codes" type="digit" center clearable label="验证码" class="inp" placeholder="请输入验证码">
        <template #button>
          <van-button size="small" type="danger" @click="bindlooyuCode" class="bind">绑定</van-button>
        </template>
      </van-field>
    </van-popup>
  </div>
</template>

<script>
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
  generateSignature,
  generateSignature8,
  generateSignature4,
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import Utils from "../uilts/utils";
import local from '../uilts/localStorage';

export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      UserId: "",
      open_userid: "",
      CorpId: "",
      show: false,
      sendings: "发送验证码",
      sms: "",
      codes: "",
      times: 60,
      coinNumber: 0,
      contactCustomerNumber: 0,
      contactNumber: 0,
      orderNumber: 0,
      shareNumber: 0,
      trajectoryNumber: 0,
      Notice: [],
      isLoading: false,
      style: {
        background: '#ff5756', color: '#fff'
      },
      style1: {
        background: '#fff', color: '#000'
      },
      dates: 'today'
    };
  },
  watch: {},
  computed: {},
  methods: {
    async getUserinfo() {
      // 获取用户信息
      let that = this;
      this.$get("/wx-crm-server/wx/get/userinfo", {
        params: {
          code: this.code,
        },
      })
        .then(
          await function (res) {
            if (res.code === 200 && JSON.stringify(res.data) != "{}") {
              if (res.data.CorpId ?? res.data.open_userid) {
                // openid 和wxid 都存在在发送请求，请求用户信息
                that.getopenId(res.data.CorpId, res.data.open_userid);
                that.UserId = res.data.UserId;
                that.open_userid = res.data.open_userid;
                that.CorpId = res.data.CorpId;
                sessionStorage.setItem("openId", that.open_userid); // 保存openID 解绑用
                sessionStorage.setItem("CorpId", res.data.CorpId); // 保存openID 解绑用
              }
            } else {
              that.show = true;
            }
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    async getopenId(wxCompId, openId) {
      // 拉去是否绑定企业微信
      let that = this;
      this.$get("/wx-crm-server/wx/get/itr", {
        params: {
          wxCompId,
          openId,
        },
      })
        .then(function (res) {
          console.log(res, 'getopenIdgetopenIdgetopenId')
          if (res.code === 500 || !res.data || res.msg == "not_bind") {
            // 没有绑定
            that.show = true;
          } else if (
            res.code === 200 &&
            res.msg === "success" &&
            res.data != "{}"
          ) {
            // clg
            if (res.data.bind_comp_id) {
              // 如果有公司ID 那么就存数据，
              that.$toast.clear()
              sessionStorage.setItem("userinfo", JSON.stringify(res.data)); // 公司id 存入本地；
              that.getConsole();
              that.getNotice()
            } else {
              // 如果不存在那么就弹框提示他没有绑定公司
              that.$toast.fail("当前账号没有绑定公司，请绑定公司。");
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getURl() {
      // 没有code 获取code
      let url = window.location.href;
      location.href =
        "https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=" + url;
    },
    totalLodding() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 800, // 持续展示 toast
      });
    },
    firstLodding() {  // 初始化时候防流氓加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
    },
    skip(data) {
      console.log('你好')
      console.log(data)
      if (data == 'manage') { //  管理
        sessionStorage.setItem('active', 'Home')
        this.$router.push('/home')
      } else if (data == 'card') {
        // this.$toast.fail('该模块正在开发中...');
        // return;
        this.$router.push('/card')
      } else if (data == 'colorPage') {
        // this.$toast.fail('该模块正在开发中...');
        // return;
        this.$router.push('/colorPage')
      } else if (data == 'video') {
        // this.$toast.fail('该模块正在开发中...');
        // return;
        this.$router.push('/video')
      }
    },
    clicksendCode() {
      //发送验证码倒计时，和发送验证码
      let that = this;
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
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
        { headers: {} }
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
    bindlooyuCode() {
      this.bindLooyu();
      return;
      // 验证码验证是否正确 验证码正确调用确认绑定
      let that = this;
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
            that.bindLooyu();

          }
        })
        .catch(function (error) {
          that.$toast.fail("请求失败，请稍后再试");
        });
    },
    bindLooyu() {
      // 确定绑定
      let that = this;
      let signature = generateSignature4(
        this.open_userid,
        this.sms,
        timeout,
        nonce
      );
      console.log(this.open_userid, this.CorpId)
      this.$get("/wx-crm-server/wx/bind/itr", {
        params: {
          openId: this.open_userid,
          itrId: this.sms,
          wxUserId: this.UserId,
          timeout,
          nonce,
          signature,
          bindWxCompId: this.CorpId,
        },
      })
        .then(function (res) {
          that.$router.push("/");
          that.show = false;
          that.getopenId(local.get('CorpId'), local.get('openId')); //绑定完成拉去是否绑定公司接口，刷新新赋值的公司信息
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getConsole() {
      console.log(this.$U || local.U())
      let signature = generateSignature3(this.$U || local.U(), timeout, nonce);
      this.$get("/api/request/console/data",
        {
          params: {
            userId: this.$U || local.U(),
            type: this.dates == 'today' ? 0 : 1,
            timeout: timeout,
            nonce: nonce,
            signature: signature,
          },
        },
      )
        .then((res) => {
          if (!res.error) {
            let { coinNumber, contactCustomerNumber, contactNumber, orderNumber, shareNumber, trajectoryNumber } = res;
            this.coinNumber = coinNumber;
            this.contactCustomerNumber = contactCustomerNumber;
            this.contactNumber = contactNumber;
            this.orderNumber = orderNumber;
            this.shareNumber = shareNumber;
            this.trajectoryNumber = trajectoryNumber;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getNotice() { // 获取公告
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      this.$get("/api/request/itr/staff/notify/result", {
        params: {
          itrId: this.$U || local.U(),
          compId: this.$C || local.C(),
          timeout,
          nonce,
          signature,
        },
      })
        .then((res) => {
          if (res.data.length > 3) {
            this.Notice = res.data.slice(0, 3).map(item => {
              let reg = item.createTime.split(' ')[0].split('-');
              return {
                ...item,
                createTimes: reg[1] + '-' + reg[2]
              }
            });
            this.$toast.clear()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onRefresh() { // 下拉刷新
      this.getConsole();
      this.getNotice()
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    date(data) {
      this.dates = data
      if (data == 'today') {
        this.style = { background: '#ff5756', color: '#fff' }
        this.style1 = { background: '#fff', color: '#000' }

      } else {
        this.style = { background: '#fff', color: '#000' }
        this.style1 = { background: '#ff5756', color: '#fff' }
      }
      this.getConsole()

    }
  },
  async created() {
    // this.firstLodding();
    let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    this.code = this.$route.query.code;
    if (this.code) {
      if (userinfo?.bind_comp_id) {
        // 有公司ID 表示登录成功 判断是否初次登录
        this.getConsole();
        this.getNotice();
        this.$toast.clear() // 清除防流氓弹框，
        let first = sessionStorage.getItem('first') || 1;
        if (first == 1) {
          this.$toast({ // 提醒登陆成功按钮
            message: '欢迎回来~',
            position: 'bottom',
          });
          sessionStorage.setItem('first', 2)
        }

      } else {
        //没有公司ID
        await this.getUserinfo(); //拿code 获取用户信息
      }
    } else {
      // 无code
      if (userinfo?.bind_comp_id) {
        // 如果有就不跳转微信页
        this.getConsole();
        this.getNotice();
      } else {
        // 没有code 请求code
        this.getURl(); // 没有code 请求code
      }
    }

  },
  mounted() {
    Utils.$on("reset", (msg) => {
      // 解绑触发该方法，重新获取code 拉去信息
      // this.getURl(); // 没有code 请求code
      // this.getUserinfo();
      // this.created()
    });
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (to.name == 'Navigation') { // 当这几个模块返回首页的时候，清空全部页面缓存
        vm.$store.commit("cache", "null");
      }
    })
  },
};
</script>
<style lang="less" scoped>
.navigation {
  font-size: 0.28rem;
  background: #f5f4fa;
  h1 {
    font-size: 0.28rem;
    font-weight: 500;
    padding: 10px 20px;
    color: #7f7f7f;
  }
  .one {
    display: flex;
    align-items: center;
    padding: 20px 20px 0;
    font-size: 0.3rem;
    background: #fff;
    flex-wrap: wrap;
  }
  .two {
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    padding: 10px 10px;
    .two-view {
      display: flex;
      box-sizing: border-box;
      width: 25%;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
      padding: 0.2rem;
      flex-direction: column;
      img {
        width: 0.8rem;
        margin-bottom: 10px;
      }
      span {
        font-size: 0.28rem;
        font-family: fantasy;
        color: #000;
      }
    }
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
  .bind {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 44px;
    width: 100%;
  }
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
}
</style>