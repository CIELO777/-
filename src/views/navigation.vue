<template>
  <div class="navigation">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      style="min-height: 100vh"
    >
      <div class="bulletin">
        <span>营销简报</span>
        <div class="btn">
          <button :style="style" @click="date('today')">今日</button
          ><button :style="style1" @click="date('month')">本月</button>
        </div>
      </div>
      <section class="one">
        <div class="module" @click="briefSkip(0)">
          <span>转发次数</span>
          <span>{{ shareNumber }}次</span>
        </div>
        <div class="module" @click="briefSkip(1)">
          <span>带来流量</span>
          <span>{{ trajectoryNumber }}个</span>
        </div>
        <div class="module" @click="briefSkip(2)">
          <span>新增联系人</span>
          <span>{{ contactNumber }}个</span>
        </div>
        <div class="module" @click="briefSkip(3)">
          <span>联系客户</span>
          <span>{{ contactCustomerNumber }}次</span>
        </div>
        <div class="module" @click="briefSkip(4)">
          <span>新增订单</span>
          <span>{{ orderNumber }}个</span>
        </div>
        <div class="module" @click="briefSkip(5)">
          <span>新增推广豆</span>
          <span>{{ coinNumber }}个</span>
        </div>
      </section>
      <h1>营销素材管理</h1>
      <section class="two">
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/企业名片.png"
            alt=""
            @click="skip('card')"
          />
          <span>企业名片</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/宣传彩页.png"
            alt=""
            @click="skip('colorPage')"
          />
          <span>宣传彩页</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/企业微站.png"
            alt=""
            @click="skip('MicroStation')"
          />
          <span>企业微站</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/营销文档.png"
            alt=""
            @click="skip('document')"
          />
          <span>营销文档</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/软文素材.png"
            alt=""
            @click="skip('advertorial')"
          />
          <span>软文素材</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/海报素材.png"
            alt=""
            @click="skip('poster')"
          />
          <span>海报素材</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/视频素材.png"
            alt=""
            @click="skip('video')"
          />
          <span>视频素材</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/发圈素材.png"
            alt=""
            @click="skip('haiRing')"
          />
          <span>发圈素材</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/营销话术.png"
            alt=""
            @click="skip('verbal')"
          />
          <span>营销话术</span>
        </van-badge>
        <!-- <button @click="WXsend">发送消息</button> -->
      </section>
      <h1>营销过程管理</h1>
      <section class="two">
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/销售雷达.png"
            alt=""
            @click="skip('radar')"
          />
          <span>流量监测</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/客户管理.png"
            alt=""
            @click="skip('manage')"
          />
          <span>客户管理</span>
        </van-badge>
        <van-badge class="two-view">
          <img
            src="../../public/img/icon/订单管理.png"
            alt=""
            @click="skip('order')"
          />
          <span>订单管理</span>
        </van-badge>
      </section>
      <h1>内部公告</h1>
      <ul class="two" style="padding: 10px 20px" v-if="Notice.length > 0">
        <template v-for="(item, index) in Notice">
          <li
            :key="index"
            class="notice"
            @click="handelClickNoticeItem(item.id)"
          >
            <span class="circle"></span
            ><span style="margin-right: 5px">{{ item.createTimes }}</span
            >{{ item.content }}<i v-if="item.status == 0" class="redot"></i>
          </li>
        </template>
      </ul>
      <ul v-else class="two" style="padding: 10px 20px">
        <p class="notice">暂无公告信息</p>
      </ul>
    </van-pull-refresh>
    <!-- 企业微信验证码 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '300px' }"
      overlay-class="popup"
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
    <!-- 企业微信绑定公司操作 -->
    <van-popup
      v-model="comp.show"
      :close-on-click-overlay="false"
      round
      :style="{ height: '250px', width: '70%' }"
      overlay-class="popup"
    >
      <div class="compTop">
        <h1 class="compTit">加入公司</h1>
        <van-search
          v-model="comp.value"
          show-action
          placeholder="请输入公司ID或名称"
        >
          <template #action>
            <div @click="Search">搜索</div>
          </template>
        </van-search>
      </div>
      <van-list
        v-if="comp.list.length > 0"
        v-model="comp.loading"
        :finished="comp.finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <template v-for="(item, index) in comp.list">
          <div :key="index" class="compView" @click="apply(item)">
            <div style="width: 80%">
              <p>{{ item.title }}（{{ item.compId }}）</p>
              <p>{{ item.createTime }}</p>
            </div>
            <van-button type="primary" size="mini">加入</van-button>
          </div>
        </template>
      </van-list>
    </van-popup>
    <van-dialog
      v-model="comp.applyShow"
      title="申请加入公司"
      :width="300"
      :show-confirm-button="false"
      :show-cancel-button="false"
    >
      <p class="applyTit">你需要发送验证申请，等待对方通过</p>
      <input
        class="applyInp"
        type="text"
        v-model="comp.applyInp"
        placeholder="请输入加入公司原因"
      />
      <div class="applyBtn">
        <van-button plain @click="qx = comp.applyShow = false">取消</van-button
        ><van-button plain @click="confirms()">确定</van-button>
      </div>
    </van-dialog>
    <img src="../assets/1.jpg" alt="" v-show="compApply" class="coverImg" />
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
import sha1 from "../uilts/sha1";
let nonce = generateNonce();
import local from '../uilts/localStorage';
import Utils from "../uilts/utils";
import debounce from '../uilts/debounce'
import { Switch } from 'vant';
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
      dates: 'today',
      websock: null,
      comp: {
        show: false,
        value: '',
        loading: false,
        finished: false,
        list: [],
        total: 0,
        current: 1,
        applyShow: false,
        item: {},
        applyInp: '',
      },
      noncestr2: '',
      timestamp2: '',
      appid2: '',
      signature2: '',
      jsapi2: '',
      entry: '',
      compApply: false,
      compId: '',
    };
  },
  watch: {
    show(val) { // 监听 show 绑定用户弹框是否显示，如果显示就清除loading 框，如果不清楚loading 的权重会大于弹框，导致用户不能输入
      if (val == true) {
        this.$toast.clear();
      }
    }
  },
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
              console.log(res)
              if (res.data.CorpId ?? res.data.open_userid) {
                // openid 和wxid 都存在在发送请求，请求用户信息
                that.getopenId(res.data.CorpId, res.data.open_userid);
                that.UserId = res.data.UserId;
                that.compId = res.data.compId;  // 会话存储后的公司ID  不可变更
                that.open_userid = res.data.open_userid;
                that.CorpId = res.data.CorpId;
                sessionStorage.setItem("openId", that.open_userid); // 保存openID 解绑用
                sessionStorage.setItem("CorpId", res.data.CorpId); // 保存openID 解绑用
              }
            } else {   //没有信息，
              // console.log(that.entry, 'that.entry1112213')
              // if (that.entry == 'single_chat_tools') {
              that.getURl(); //单聊应该先重定向拿去新code
              // } else {
              // that.show = true;  // 没有信息，让他注册账号;
              // }
            }
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    async getopenId(wxCompId, openId) { // 检测是否绑定公司了，
      // 拉去是否绑定企业微信
      let that = this;
      this.$get("/wx-crm-server/wx/get/itr", {
        params: {
          wxCompId,
          openId,
        },
      })
        .then(function (res) {
          console.log(res);
          if (res.code === 500 || !res.data || res.msg == "not_bind") {
            // 没有绑定
            that.show = true;
          } else if (
            res.code === 200 &&
            res.msg === "success" &&
            res.data != "{}"
          ) {
            // 
            if (res.data.bind_comp_id) {
              // 如果有公司ID 那么就存数据，
              // that.$toast.clear()
              let a = { ...res.data, bind_comp_id: that.compId, bind_comp_id1: res.data.bind_comp_id }
              sessionStorage.setItem("userinfo", JSON.stringify(res.data)); // 公司id 存入本地；
              that.outData(res.data.id);  // 获取是否过期；
              that.getConsole();
              // that.getNotice();
              that.noticeData();
              localStorage.clear(); // 如果拉去到的话，那么就清除他的值
            } else {
              sessionStorage.setItem('temporaryId', res.data.id) //这个数据是备份的id 因为加入绑定公司的操作，肯定·是没有上面的bind——comp——id的。那么这个时候就存一下他的ID 然后给绑定公司的方法用一下就ok
              let comapply = localStorage.getItem('compApply');
              if (comapply) {  // 如果为true 证明他申请加入过公司，这时候给他个蒙版
                that.compApply = true;
              } else { // 如果为fasle 如果不存在那么就弹框提示他没有绑定公司
                that.$toast.fail("当前账号没有绑定公司，请绑定公司。");
                that.comp.show = true;
              }
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
      // console.log(this.entry, 'this.entrythis.entrythis.entrythis.entry')
      // console.log(this.CorpId, ' that.CorpId that.CorpId that.CorpId')
      // if (this.entry == 'single_chat_tools') { // 如果是通过单聊中进入的，那么就截取code
      if (url.includes('code')) {
        url = window.location.href.split('?code=')[0]
      }
      // }
      location.href = "https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=" + url;
      sessionStorage.setItem('first', '1');
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
        forbidClick: true,
        overlay: true,
      });
    },
    skip(data) {
      let compId = local.get('userinfo')?.bind_comp_id;
      let outData = JSON.parse(sessionStorage.getItem('pastDate'))  // 营销架构过期
      if (!JSON.parse(sessionStorage.getItem('userinfo'))?.bind_comp_id) {  // 没有加入公司 模块全部不让进
        this.$notify({ type: 'danger', message: '当前未加入公司' }); return;
      };
      if (data == 'manage') { //  管理
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        };
        sessionStorage.setItem('active', 'Home')
        this.$router.push('/home')
      } else if (data == 'card') {
        this.$router.push('/card')
      } else if (data == 'colorPage') {
        this.$router.push('/colorPage')
      } else if (data == 'video') {
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        };
        this.$router.push('/video')
      } else if (data == 'MicroStation') {
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        }
        this.$router.push('/microStation')
      } else if (data == 'poster') {
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        };
        this.$router.push('/poster')
      } else if (data == 'advertorial') {
        this.$router.push('/advertorial')
      } else if (data == 'document') {
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        };
        this.$router.push('/document')
      } else if (data == 'order') {
        this.$router.push('/order')
      } else if (data == 'radar') {
        this.$router.push('/radar')
      } else if (data == 'haiRing') {
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        };
        this.$router.push('/haiRing')
      } else if (data == 'verbal') {
        if (outData) {
          this.$toast('营销架构已到期，不能使用');
          return;
        };
        this.$router.push('/verbal')
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
      // 验证码验证是否正确 验证码正确调用确认绑定
      // this.bindLooyu();
      // return;
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
          that.getopenId(sessionStorage.getItem('CorpId'), sessionStorage.getItem('openId')); //绑定完成拉去是否绑定公司接口，刷新新赋值的公司信息
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getConsole() {
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
    onRefresh() { // 下拉刷新
      this.getConsole();
      // this.getNotice();
      this.noticeData()
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    date: debounce(function (data) {
      this.dates = data
      if (data == 'today') {
        this.style = { background: '#ff5756', color: '#fff' }
        this.style1 = { background: '#fff', color: '#000' }
      } else {
        this.style = { background: '#fff', color: '#000' }
        this.style1 = { background: '#ff5756', color: '#fff' }
      }
      this.getConsole()
    }, 200),
    briefSkip(key) {
      switch (key) {
        case 0:

          break;
        case 1:
          this.$router.push('/radar')
          break;
        case 2:
          this.$router.push('/home')
          break;
        case 3:
          this.$router.push('/home')
          break;
        case 4:
          this.$router.push('/order')
          break;
        case 5:

          break;
      }
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
        if (res.license[2] == undefined || Object.keys(res).length == 0 || !res.license[2].startTime || res.license[2].startTime == '' || !res.license[2].expireTime || res.license[2].expireTime == '') {
          sessionStorage.setItem("pastDate", true)  // 过期
        } else {
          sessionStorage.setItem("pastDate", false) // 
        }
      })
        .catch((error) => {
          console.log(error);
        });
    },
    // 内部公告小圆点
    noticeData() {
      if (this.$U || local.U()) {
        let signature = generateSignature3(this.$U || local.U(), this.$C || local.C(), timeout, nonce);
        let param = new URLSearchParams();
        param.append("itrId", this.$U || local.U());
        param.append("compId", this.$C || local.C());
        param.append("signature", signature);
        param.append("timeout", timeout);
        param.append("nonce", nonce);
        param.append("current", 0);
        param.append("size", 3);
        this.$post1("/api/request/itr/staff/notify/result", param)
          .then((res) => {
            res.data.forEach(item => {
              item.createTime = item.createTime.split(" ")[0].substring(5);
            })
            this.Notice = res.data;
            this.$toast.clear() // 清除防流氓弹框，
          })
          .catch((error) => {
            this.$toast.fail("请求失败，请稍后再试");
          });
      }
    },
    handelClickNoticeItem(id) {
      console.log(id)
      this.$router.push({
        name: 'NoticeView',
        params: {
          id: id,
        }
      })
    },
    initWebSocket() { //初始化weosock09et
      let add = Math.floor(Math.random() * 100000000000000000000);
      const wsuri = `wss://yg2.soperson.com/itver/socket?userId=13394171296&token=${add}`;
      this.websock = new WebSocket(wsuri);
      console.log(new WebSocket(wsuri));
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      console.log('要发送数据')
    },
    websocketonerror() {//连接建立失败重连
      console.log("连接错误")
      // this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      const redata = JSON.parse(e.data);
      console.log(e.type, redata, '接收的消息')
    },
    websocketsend(Data) {//数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {  //关闭
      console.log('断开连接', e);
    },
    Search() {
      this.comp.list.length = 0;
      document.documentElement.scrollTop = document.body.scrollTop = 0 // 设置每个页面的scrollTop
      this.onSearch();
    },
    onSearch() {
      let signature = generateSignature3(timeout, nonce);
      this.$get(
        "/api/request/itr/comp/search",
        {
          params: {
            fuzzy: this.comp.value,
            timeout: timeout,
            nonce: nonce,
            signature: signature,
            current: this.comp.current
          },
        },
      ).then((res) => {
        if (!res.error) {
          this.comp.list = this.comp.current == 1 ? res.data : this.comp.list.concat(res.data);
          this.comp.total = res.totalPageCount;
          this.comp.loading = false;
          if (res.totalPageCount == 1) {
            this.comp.finished = true;
          }
        } else {
          this.$toast("获取失败，请稍后再试");

        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    onLoad() {
      console.log('到底了')
      if (this.current >= this.total) {
        this.comp.finished = true;
        return;
      } else {
        this.comp.current = ++this.comp.current;
        this.onSearch()
      }
    },
    apply(item) {
      this.comp.item = item;
      this.comp.applyShow = true;
    },
    confirms() { // 加入公司申请
      localStorage.setItem('compApply', true)
      let { compId } = this.comp.item;
      let ids = sessionStorage.getItem('temporaryId')
      let signature = generateSignature3(compId, timeout, nonce);
      let data = {
        to: sessionStorage.getItem('temporaryId'),
        fromCompId: compId,
        nonce: nonce,
        signature: signature,
        timeout: timeout,
        remark: this.comp.applyInp
      }
      this.$get(
        "/api/request/comp/invite/do",
        {
          params: data,
        },
      ).then((res) => {
        if (res.error == 'success') {
          // this.$toast('已成功加入该公司');
          this.comp.applyShow = false;
          this.comp.show = false;
          this.laqu();
        } else {
          this.comp.applyShow = false;
          this.compApply = true;
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    cancel() {
    },
    async getWxJsJdk() {
      // 初始化init wx.config
      let param = new URLSearchParams();
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("url", "wxa.jiain.net");
      param.append("type", 1);
      param.append("itrId", itrId);
      let that = this;
      await this.$post1("/wx-crm-server/wx/js_api_ticket/auth", param)
        .then((res) => {
          this.appId = res.appId;
          this.noncestr = nonce;
          this.timestamp = timeout / 1000;
          let url = location.href.split("#")[0];
          let str1 =
            "jsapi_ticket=" +
            res.jsapi_ticket +
            "&noncestr=" +
            this.noncestr2 +
            "&timestamp=" +
            this.timestamp2 +
            "&url=" +
            url;
          let signature = sha1.hex_sha1(str1);
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，企业微信的corpID
            timestamp: this.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.noncestr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
            jsApiList: ["agentConfig", "selectExternalContact", 'openEnterpriseChat', 'selectEnterpriseContact', 'getClipboardData'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(() => {
            // wx.hideAllNonBaseMenuItem();
            // wx.hideOptionMenu();
            // wx.hideMenuItems({
            //   menuList: ['menuItem:share:appMessage', 'menuItem:share:wechat', 'menuItem:copyUrl', 'menuItem:openWithSafari', 'menuItem: refresh'] // 要隐藏的菜单项
            // });
            wx.agentConfig({
              corpid: that.appid2, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid: res.agentId, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp: that.timestamp2, // 必填，生成签名的时间戳
              nonceStr: that.noncestr2, // 必填，生成签名的随机串
              signature: that.signature2, // 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: ["sendChatMessage", 'getContext', 'getClipboardData'], //必填
              success: (res) => {
                wx.invoke('getContext', {
                }, (res) => {
                  if (res.err_msg == "getContext:ok") {
                    if (res.entry == 'single_chat_tools') {
                      this.entry = res.entry; //返回进入H5页面的入口类型，目前有normal、contact_profile、single_chat_tools、group_chat_tools
                    }
                  } else {
                    //错误处理
                    console.log(res, '出错了')
                  }
                });
                // 回调
                // alert('成功')
              },
              fail: function (res) {
                console.log(res, '失败');
                if (res.errMsg.indexOf("function not exist") > -1) {
                }
              },
            });
          });
          wx.error(function (res) {
            //通过error接口处理失败验证
            // config信息验证失败会执行error
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getAgentConfig() {
      // 拉取
      let param = new URLSearchParams();
      let url = location.href.split("#")[0];
      let itrId = JSON.parse(sessionStorage.getItem("userinfo"))?.id;
      param.append("timeout", timeout / 1000);
      param.append("nonce", nonce);
      param.append("url", url);
      param.append("type", 2); // 为2的时候拉去的是
      param.append("itrId", itrId);
      await this.$post1("/wx-crm-server/wx/js_api_ticket/auth", param)
        .then((res) => {
          let str1 =
            "jsapi_ticket=" +
            res.jsapi_ticket +
            "&noncestr=" +
            nonce +
            "&timestamp=" +
            timeout / 1000 +
            "&url=" +
            url;
          this.jsapi2 = res.jsapi_ticket; // 这个值是拉取的值agentConfig 值
          this.timestamp2 = timeout / 1000;
          this.noncestr2 = nonce;
          this.signature2 = sha1.hex_sha1(str1);
          this.appid2 = res.appId;
        })
        .catch((err) => {
          // alert(err);
        });
    },
    // WXsend() {
    //   wx.invoke('sendChatMessage', {
    //     msgtype: "text", //消息类型，必填
    //     text: {
    //       content: "你好", //文本内容
    //     },
    //   }, function (res) {
    //     console.log('服务指引返回结果', res);
    //     if (res.err_msg == 'sendChatMessage:ok') {
    //       //发送成功
    //     }
    //   })
    // },
    async laqu() {
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      this.code = this.$route.query.code;
      let first = sessionStorage.getItem('first');
      if (first == 1) {
        this.firstLodding();
        sessionStorage.setItem('first', 2)
      }
      if (this.code) {
        if (userinfo?.bind_comp_id) {
          // 有公司ID 表示登录成功 判断是否初次登录
          this.getConsole();
          // this.getNotice();
          this.noticeData();
          // this.initWebSocket();
        } else {
          //没有公司ID
          await this.getUserinfo(); //拿code 获取用户信息
        }
      } else {
        // 无code
        if (userinfo?.bind_comp_id) {
          // 如果有就不跳转微信页
          this.getConsole();
          // this.getNotice();
          this.noticeData();
        } else {
          // 没有code 请求code
          this.getURl(); // 没有code 请求code
        }
      }
      setTimeout(async () => {
        await this.getAgentConfig(); // 同步执行 否则会报错
        await this.getWxJsJdk();
      }, 1500);

    }
  },
  async created() {
    this.outData();
    let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    this.code = this.$route.query.code;
    let first = sessionStorage.getItem('first');
    if (first == 1) {
      this.firstLodding();
      sessionStorage.setItem('first', 2)
    }
    if (this.code) {
      if (userinfo?.bind_comp_id) {
        // 有公司ID 表示登录成功 判断是否初次登录
        this.getConsole();
        this.noticeData();
        // this.initWebSocket();
      } else {
        //没有公司ID
        await this.getUserinfo(); //拿code 获取用户信息
      }
    } else {
      // 无code
      if (userinfo?.bind_comp_id) {
        // 如果有就不跳转微信页
        this.getConsole();
        this.noticeData();
      } else {
        // 没有code 请求code
        this.getURl(); // 没有code 请求code
      }
    }
    setTimeout(async () => {
      await this.getAgentConfig(); // 同步执行 否则会报错
      await this.getWxJsJdk();
    }, 1500);

  },
  mounted() {
    Utils.$on("reset", (msg) => {
      // 解绑触发该方法，重新获取code 拉去信息
      // this.getURl(); // 没有code 请求code
      // this.getUserinfo();
      this.created()
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
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    padding: 10px 20px;
    .two-view {
      display: flex;
      box-sizing: border-box;
      width: 25%;
      justify-content: center;
      align-items: center;
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
  .compView {
    display: flex;
    padding: 10px 0;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
    p:first-child {
      font-size: 0.28rem;
      color: #000;
      font-weight: 550;
      margin-bottom: 0.16rem;
      width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .compTop {
    position: sticky;
    top: 0px;
    background: #fff;
    z-index: 999999;
  }
  .applyTit {
    text-align: center;
    font-size: 14px;
    margin: 20px 0;
  }
  .applyInp {
    text-align: center;
    height: 38px;
    font-size: 12px;
    display: inline-block;
    width: 80%;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    margin: 0 auto 10px;
    display: block;
  }
  .applyBtn {
    width: 100%;
    display: flex;
    button {
      flex: 1;
    }
  }
  .coverImg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }
}
</style>