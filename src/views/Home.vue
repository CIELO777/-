<template>
  <div class="home">
    <img src="https://dist.jiain.net/mall/images/registerBackground.jpg" alt="" style="width: 100%;" v-show="show">
    <linkman @userIDLength="userIDLengths" @userIdSave="userIdSaves(arguments)" ref="mychild" v-if="data.length>0 " :list="data" :totals="total" :users="user" :userMaps="userMap" @chengParentCur="chengParentCurs">
    </linkman>
    <!-- <button @click="linkmanClick">33</button> -->
    <van-empty v-show="empty" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />
    <!-- 企业微信验证码 -->
    <van-popup v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '35%' }" overlay-class="popup">
      <div class="hint">
        <van-icon name="warning" size="25px" />
        <p class="qy-hint">
          企业微信绑定
        </p>
      </div>
      <p class="qy-hint1">当前账号没有绑定企业微信，请输入手机号进行绑定</p>
      <van-field v-model="sms" type="tel" center clearable label="手机号" class="inp" placeholder="请输入手机号">
        <template #button>
          <van-button size="small" type="primary" @click="clicksendCode" :disabled="times < 60">{{sendings}}</van-button>
        </template>
      </van-field>
      <van-field v-model="codes" type="digit" center clearable label="验证码" class="inp" placeholder="请输入验证码">
        <template #button>
          <van-button size="small" type="danger" @click="bindlooyuCode">绑定</van-button>
        </template>
      </van-field>
    </van-popup>
  </div>
</template>
<script>
// @ is an alias to /src
import linkman from '../components/linkman';
import { generateTimeout, generateNonce, generateSignature3, generateSignature, generateSignature8, generateSignature4 } from '../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
import sha1 from '../uilts/sha1';
import local from '../uilts/localStorage';
import Utils from '../uilts/utils';

// import { initWxConfig, wxAgentConfig } from '../uilts/wx-js-sdk/wxConfig'
// import wx from 'weixin-js-sdk';
export default {
  name: 'Home',
  inject: ['reload'],
  data() {
    return {
      data: [],
      user: {},
      userMap: {},
      sms: "",
      show: false,
      UserId: "",
      open_userid: "",
      CorpId: "",
      total: 0,
      sendings: "发送验证码",
      times: 60,
      codes: "",
      empty: false,
      signature: "",
      appId: "",
      noncestr: "",
      timestamp: "",
      jsapi2: "",
      appid2: "",
      noncestr2: "",
      timestamp2: "",
      signature2: "",
      timer: ''
    }
  },
  components: {
    linkman
  },
  methods: {
    async getList(datas) {// 下拉联系人列表
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
      let signature = generateSignature3(userinfo?.id, userinfo?.bind_comp_id, timeout, nonce)
      let data = {
        userId: userinfo.id,
        compId: userinfo.bind_comp_id,
        current: datas || 1,
        size: 20,
        nonce,
        timeout,
        signature
      };
      this.$get('/api/request/itr/comp/customer/query', {
        params: data,
      })
        .then(function (res) {
          if (!res.error) {
            console.log(that.data);
            console.log(res.data);
            that.data = datas == 1 ? res.data : that.data.concat(res.data);
            that.userMap = Object.assign(that.userMap, res.user);
            console.log(that.data);
            that.user = res.user;
            that.total = res.totalPageCount;
            sessionStorage.setItem('active', 'Home');
            that.$refs?.mychild?.$toast.clear();
            if (that.data.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.$toast.clear(); //清除弹框
            sessionStorage.setItem('TabIndex', 6) // 因为触底分页需要，一进项目设置为数字6
          }
        })
        .catch(function (error) {
          console.log(error);
          that.$toast.fail('请求失败，请稍后再试');
        });
    },
    getURl() { // 没有code 获取code
      let url = window.location.href;
      location.href = 'https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=' + url;
    },
    async getUserinfo() { // 获取用户信息
      let that = this;
      this.$get('/wx-crm-server/wx/get/userinfo', {
        params: {
          code: this.code,
        },
      })
        .then(await function (res) {
          if (res.code === 200) {
            if (res.data.CorpId ?? res.data.open_userid) {   // openid 和wxid 都存在在发送请求，请求用户信息
              that.getopenId(res.data.CorpId, res.data.open_userid);
              that.UserId = res.data.UserId
              that.open_userid = res.data.open_userid;
              that.CorpId = res.data.CorpId;
              sessionStorage.setItem("openId", that.open_userid) // 保存openID 解绑用
            } else {

            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getopenId(wxCompId, openId) {// 拉去是否绑定企业微信
      let that = this;
      this.$get('/wx-crm-server/wx/get/itr', {
        params: {
          wxCompId,
          openId
        },
      })
        .then(function (res) {
          if (res.code === 500 || !res.data || res.msg == 'not_bind') {
            // 没有绑定
            that.show = true
          } else if (res.code === 200 && res.msg === 'success' && res.data != "{}") {
            // clg
            if (res.data.bind_comp_id) {  // 如果有公司ID 那么就存数据，
              sessionStorage.setItem('userinfo', JSON.stringify(res.data));// 公司id 存入本地；
            } else {  // 如果不存在那么就弹框提示他没有绑定公司
              this.$toast.fail('当前账号没有绑定公司，请绑定公司。');
            }
            that.getList(); //拉去首页数据
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clicksendCode() {   //发送验证码倒计时，和发送验证码
      let that = this;
      let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(this.sms)) {
        this.$toast.fail('请输入正确的手机号')
        return;
      }
      this.time(); // 倒计时60秒
      this.sendCode(); // 发送验证码·
    },
    time() {  // 验证码倒计时方法
      var timer = setInterval(() => {
        if (this.times == 0) {
          // 清除定时器和复原按钮
          clearInterval(timer);
          this.sendings = '重新发送'
          this.times = 60; // 重新赋值时间变量
        } else {
          this.sendings = this.times + '秒后可再次发送';
          this.times--;
        }
      }, 1000);
    },
    sendCode() { // 发送验证码
      let that = this;
      let signature = generateSignature(this.sms, 2, timeout, nonce);
      this.$get('/api/remote/util/sms', {
        params: {
          id: this.sms,
          type: 2,
          timeout: timeout,
          nonce: nonce,
          clientType: 2,
          signature: signature
        },
      }, { headers: {} })
        .then((res) => {
          if (res.error == 'success') {

          } else {
            this.$toast('获取失败，请稍后再试')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    bindlooyuCode() {  // 验证码验证是否正确 验证码正确调用确认绑定
      let that = this;
      let signature = generateSignature8(this.sms, 1, 3, timeout, nonce)
      let param = new URLSearchParams();
      param.append("id", this.sms);
      param.append("type", 1);
      param.append("code", this.codes);
      param.append("nonce", nonce);
      param.append("clientType", 3);
      param.append("timeout", timeout);
      param.append("signature", signature);
      this.$post1('/api/remote/itr/user/login', param)
        .then(function (res) {
          if (res.error != 'success') {
            that.$toast.fail('验证码错误');
          } else {
            that.bindLooyu();
          }
        })
        .catch(function (error) {
          that.$toast.fail('请求失败，请稍后再试');
        });
    },
    bindLooyu() { // 确定绑定
      let that = this;
      let signature = generateSignature4(this.open_userid, this.sms, timeout, nonce);
      this.$get('/wx-crm-server/wx/bind/itr', {
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
          that.$router.push('/')
          that.show = false;
          that.getopenId(that.CorpId, that.open_userid) //绑定完成拉去是否绑定公司接口，刷新新赋值的公司信息
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 触发滚页方法
    chengParentCurs(data) {
      this.getList(data)
    },
    totalLodding() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 10000, // 持续展示 toast
      });
    },
    async getWxJsJdk() { // 初始化init wx.config 
      let param = new URLSearchParams();
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("url", 'https://wxa.jiain.net/');
      param.append("type", 1);
      param.append("itrId", itrId);
      let that = this;
      await this.$post1('/wx-crm-server/wx/js_api_ticket/auth',
        param
      )
        .then(res => {
          // alert('点击不出来 config');
          // alert(res.jsapi_ticket)
          // this.signature = res.signature;
          this.appId = res.appId;
          this.noncestr = nonce;
          this.timestamp = timeout / 1000;
          let url = location.href.split('#')[0];
          let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + this.noncestr2 + '&timestamp=' + this.timestamp2 + '&url=' + url
          let signature = sha1.hex_sha1(str1);
          wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，企业微信的corpID
            timestamp: this.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: ['agentConfig', 'selectExternalContact'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
            wx.onHistoryBack(function () {
              return confirm('确定要放弃当前页面的修改？')
            });
            wx.agentConfig({
              corpid: that.appid2, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid: res.agentId, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp: that.timestamp2, // 必填，生成签名的时间戳
              nonceStr: that.noncestr2, // 必填，生成签名的随机串
              signature: that.signature2,// 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: ['selectExternalContact'], //必填
              success: function (res) {
                // 回调
                // alert('成功')
              },
              fail: function (res) {
                alert(JSON.stringify(res))
                if (res.errMsg.indexOf('function not exist') > -1) {
                }
              }
            });

          });
          wx.error(function (res) {//通过error接口处理失败验证
            // config信息验证失败会执行error
          });
          // } else {
          //   console.log(res.data.errorCode)
          // }
        }).catch(err => {
          console.log(err);
        })
    },
    async getAgentConfig() {  // 拉取
      let param = new URLSearchParams();
      let url = location.href.split('#')[0];
      let itrId = JSON.parse(sessionStorage.getItem("userinfo"))?.id;
      param.append("timeout", timeout / 1000);
      param.append("nonce", nonce);
      param.append("url", url);
      param.append("type", 2); // 为2的时候拉去的是
      param.append("itrId", itrId);
      await this.$post1('/wx-crm-server/wx/js_api_ticket/auth',
        param
      ).then((res) => {
        // alert('执行了出来，agentConfig')
        // alert(res)
        let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + nonce + '&timestamp=' + timeout / 1000 + '&url=' + url
        this.jsapi2 = res.jsapi_ticket  // 这个值是拉取的值agentConfig 值
        this.timestamp2 = timeout / 1000;
        this.noncestr2 = nonce;
        this.signature2 = sha1.hex_sha1(str1);
        this.appid2 = res.appId
      }).catch((err) => {
        alert(err)
      })
    },
    linkmanClick() {  // 点击拉去联系人
      wx.invoke('selectExternalContact', {
        "filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
      }, function (res) {
        if (res.err_msg == "selectExternalContact:ok") {
          this.userID = res.userId; //返回当前外部联系人userId
        } else {
          //错误处理
        }
      });
    },
    // getWXConfig() {
    //   initWxConfig().then((res) => {
    //     return wxAgentConfig()
    //   }).then((res) => {
    //   })
    //     ;
    // },
    userIDLengths(data) {  // 判断联系人长度，如果长度大于1，那么就弹窗
      this.$toast({
        message: '只能关联一个外部联系人',
        position: 'bottom',
      });
    },
    async userIdSaves(data) {   // 选择联系人保存成功
      await this.saveWxCrm(data[0], data[1], data[2])
      this.$nextTick(() => {
        this.getList(3);
      })
    },
    async saveWxCrm(wxcrm, id, phone) {  // 保存联系人接口
      let that = this;
      let crm = {};
      crm.id = id; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = wxcrm;
      crm.phone = phone;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      await this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(async (res) => {
          if (res.error === 'success') {
            this.$toast({
              message: '关联外部联系人成功',
              position: 'bottom',
            });
            // this.hackReset = false;
            // setTimeout(() => {
            //   this.reload();
            // }, 1000)
          } else {
            this.$toast({
              message: res.errMsg,
              position: 'bottom',
            });
          };
        })
        .catch(function (error) {
        });
    },
  },
  async created() {
    let that = this;
    let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
    this.code = this.$route.query.code;
    if (this.code) {  //有code
      if (userinfo?.bind_comp_id) { // 有公司ID
        this.totalLodding();
        this.getList(); // 就去请求列表
      } else { //没有公司ID 
        await this.getUserinfo()  //拿code 获取用户信息
      }
    } else {  // 无code
      if (userinfo?.bind_comp_id) {  // 如果有就不跳转微信页
        this.totalLodding();
        this.getList();  // 有公司ID 就去请求列表
      } else {   // 没有code 请求code
        this.getURl();  // 没有code 请求code
      }
    }
    setTimeout(async () => {
      await this.getAgentConfig()  // 同步执行 否则会报错
      await this.getWxJsJdk()
    }, 1500)

  },
  mounted() {
    Utils.$on('reset', (msg) => { // 解绑触发该方法，重新获取code 拉去信息
      this.getURl();  // 没有code 请求code
      this.getUserinfo();
    })

  }
}
</script>
<style lang="less" scoped>
.hint {
  display: flex;
  margin-top: 0.3rem;
}
.hint i {
  margin-top: 8px;
}
.qy-hint {
  font-size: 25px;
  margin: 8px 8px;
  font-weight: 900;
  margin-top: 8px;
  color: #000;
}
.qy-hint1 {
  font-size: 18px;
  font-weight: 500;
  color: #000;
  margin-bottom: 27px;
}
.home .van-popup {
  padding: 0 20px;
  width: 90%;
  background: #f1f1f1;
}
@field-label-width {
  width: 0.2rem;
}
</style>