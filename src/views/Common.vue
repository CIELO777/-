<template>
  <div class="about">
    <linkman ref="mychild" @userIDLength="userIDLengths" @userIdSave="userIdSaves(arguments)" v-if="data.length>0" :list="data" :totals="total" :users="user" :userMaps="userMap" @chengParentCur="chengParentCurs"></linkman>
    <van-empty v-show="empty" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3, generateSignature } from '../uilts/tools';
import linkman from '../components/linkman';
// import { initWxConfig, wxAgentConfig } from '../uilts/wx-js-sdk/wxConfig'

let timeout = generateTimeout()
let nonce = generateNonce();
import sha1 from '../uilts/sha1';
import local from '../uilts/localStorage';
import Utils from '../uilts/utils';
export default {
  name: 'Common',
  inject: ['reload'],
  data() {
    return {
      data: [],
      user: {},
      userMap: {},
      total: 0,
      empty: false,
      timestamp: "",
      noncestr: "",
      appId: "",
      appid2: "",
      timestamp2: "",
      noncestr2: "",
      signature2: "",
      jsapi2: "",
    }
  },
  methods: {
    getList(datas) {// 下拉联系人列表
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
        signature,
        starLevel: 5,
      };
      this.$get('/api/request/itr/comp/customer/query', {
        params: data,
      })
        .then(function (res) {
          if (!res.error) {
            that.data = datas == 1 ? res.data : that.data.concat(res.data);
            that.userMap = Object.assign(that.userMap, res.user);
            that.user = res.user
            that.total = res.totalPageCount;
            that.$refs?.mychild?.$toast.clear();
            if (that.data.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.$toast.clear(); //清除弹框
          }
        })
        .catch(function (error) {
          console.log(error);
          that.$toast.fail('请求失败，请稍后再试');
        });
    },
    totalLodding() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 10000, // 持续展示 toast
      });
    },
    // 触发滚页方法from
    chengParentCurs(data) {
      console.log('dsadsa');
      this.getList(data)
    },
    getWXConfig() {
      initWxConfig().then((res) => {
        return wxAgentConfig()
      }).then((res) => {
      });
    },
    async getWxJsJdk() { // 初始化init wx.config 
      let param = new URLSearchParams();
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("url", 'wxa.jiain.net');
      param.append("type", 1);
      param.append("itrId", itrId);
      let that = this;
      await this.$post1('/wx-crm-server/wx/js_api_ticket/auth',
        param
      )
        .then(res => {
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
            // that.getAgentConfigApi()
            // alert(that.appid2, that.timestamp2, that.noncestr2, that.signature2)
            wx.agentConfig({
              corpid: that.appid2, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid: res.agentId, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp: that.timestamp2, // 必填，生成签名的时间戳
              nonceStr: that.noncestr2, // 必填，生成签名的随机串
              signature: that.signature2,// 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: ['selectExternalContact'], //必填
              success: function (res) {
                // alert('成功')
                // 回调
              },
              fail: function (res) {
                alert('失败')
                if (res.errMsg.indexOf('function not exist') > -1) {
                  // alert('版本过低请升级')
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
          // alert('commonError')
          // alert(err, 'commoERror');
        })
    },
    async getAgentConfig() {  // 拉取
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      let url = location.href.split('#')[0];
      let param = new URLSearchParams();
      param.append("timeout", timeout / 1000);
      param.append("nonce", nonce);
      param.append("url", url);
      param.append("type", 2); // 为2的时候拉去的是
      param.append("itrId", itrId);
      await this.$post1('/wx-crm-server/wx/js_api_ticket/auth',
        param
      ).then((res) => {
        let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + nonce + '&timestamp=' + timeout / 1000 + '&url=' + url
        this.jsapi2 = res.jsapi_ticket;  // 这个值是拉取的值agentConfig 值
        this.timestamp2 = timeout / 1000;
        this.noncestr2 = nonce;
        this.signature2 = sha1.hex_sha1(str1);
        this.appid2 = res.appId
      }).catch(() => {
        alert('commone失败')
      })
    },
    userIDLengths() {
      this.$toast({
        message: '只能关联一个外部联系人',
        position: 'bottom',
      });
    },
    userIdSaves(data) {   // 选择联系人保存成功
      this.saveWxCrm(data[0], data[1], data[2])
    },
    saveWxCrm(wxcrm, id, phone) {  // 保存联系人接口
      let that = this;
      let crm = {};
      crm.id = id; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = wxcrm; phone
      crm.phone = phone;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(async (res) => {
          if (res.error === 'success') {
            this.$toast({
              message: '关联外部联系人成功',
              position: 'bottom',
            });
            await this.getList();
            setTimeout(() => {
              this.reload();
            }, 1000)
          } else {
            this.$toast({
              message: res.errMsg,
              position: 'bottom',
            });
          };
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  async created() {
    this.totalLodding();
    this.getList();
    // setTimeout(() => {
    await this.getAgentConfig()
    await this.getWxJsJdk()
    // }, 1500)

  },
  components: {
    linkman
  }

}
</script>