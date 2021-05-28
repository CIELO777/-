/*
 * @Author: YUN_KONG 
 * @Date: 2021-04-27 11:48:39 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-05-21 14:22:59
   聊天工具栏客户管理工具栏,和我的客户对话时候快捷打开 
 */
<template>
  <div class="ChatCustomer">
    <!-- 企业微信验证码 -->
    <BindPop :shows="show" @BindComplete="BindCompletes"></BindPop>
  </div>
</template>
<script>
import wxxx from '../../uilts/wxconfig';
import wxxxChat from '../../uilts/wxconfigChat';
import { Toolbar } from '../../uilts/toolbarMixin';
import local from '../../uilts/localStorage';
import BindPop from '../../components/ChatCustomer/BindPop'
import { generateTimeout, generateNonce, generateSignature3 } from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "ChatCustomer",
  components: { BindPop },
  mixins: [Toolbar],
  data() {
    return {
      active: 0,
      TabActive: 0,
      code: '',
      UserId: '',
      open_userid: '',
      CorpId: '',
      Single: false,
      compId: '',
      detailsPop: false,
      star: {
        data: '',
        pop: false,
        actions: [
          {
            name: "未知",
            starLevel: 0,
          },
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
        ]
      },
      wxcrmId: '',
      userInfo: {},
      name: '',
      sms: '',
      codes: "",
      times: 60,
      coinNumber: 0,
      sendings: "发送验证码",
    };
  },
  watch: {
    show(val, oldVal) {//普通的watch监听
      if (val) {
        this.$toast.clear()
      }
    },
  },
  methods: {
    starEnter(action, index) { // 星级选择
      this.star.pop = false;
      this.star.data = action.name;
    },
    starSelect() {
      this.star.pop = true;
    },
    async verifyWxId() { // 校验wxcrmID 查询联系人列表是否存在
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("wxCrmId", this.wxcrmId);
      param.append("current", 1); // 默认页数是1
      param.append("signature", signature);
      await this.$post1("/api/request/itr/comp/customer/query", param)
        .then((res) => {
          console.log(this.wxcrmId, this.name, 'this.wxcrmId, name: this.name')
          // alert(res.data.length,'wxID查列表数据大于0证明绑定了')
          if (res.data.length > 0) { // 大于0证明绑定了联系人，跳转到联系人详情页面
            this.$toast.clear();
            this.userInfo = res.data[0]; // 第一个客户数据赋值；展示该数据
            sessionStorage.setItem('tabNum', 0); // 保存数据并且跳转
            sessionStorage.setItem('_crm_info', JSON.stringify(res.data[0]))
            this.$router.push({ name: 'LinkDetailed' });
          } else {
            // 没有绑定联系人。跳到新增联系人页面
            console.log(this.wxcrmId, this.name, 'this.wxcrmId, name: this.name')
            this.getName() // 只有数组大于0在去请求名字接口;
            // this.$router.push({ name: 'Addcustomer', params: { wxcrmId: this.wxcrmId, name: this.name } });
          }
        })
        .catch(function (error) { });
    },
    rand(min = 1000, max = 9999) { // 随机获取四位数字
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getName() { // 获取当前客户的企业微信名字
      // return new Promise((resolve, reject) => {
      this.$get("/wx-crm-server/wx/get/customer/info", {
        params: {
          external_userid: this.wxcrmId,
          itrId: this.$U || local.U(),
        },
      }).then((res) => {
        if (res.data && res.data.external_contact && res.data.external_contact.name) {
          this.name = res.data.external_contact.name;
        } else {
          this.name = '企业微信用户' + this.rand();
        }
        this.$toast.clear();
        this.$router.push({ name: 'Addcustomer', params: { wxcrmId: this.wxcrmId, name: this.name } });
        // resolve(this.name);
      }).catch(function (error) {
        // reject(error);
      });
      // })

    },
    wxxxx() {
      let that = this;
      return new Promise(function (resolve, reject) {
        let begin = setInterval(async () => {
          console.log("🚀 ~ file: ChatCustomer.vue ~ line 145 ~ begin=setInterval ~ that.accomplish", that.accomplish)
          if (that.accomplish) {
            // wxxx(); // 拉去企业微信授权、
            wxxxChat().then(res => {
              console.log(res, 'wwwww')
              that.wxcrmId = res;
              resolve(res)
            }).catch(error => {
              reject(error)
              console.log(error, 'wwwxxxx')
            })
            // await wxxxChat().then(res => {
            //   console.log(res)
            //   resolve(res)
            // }).catch(error => {
            //   console.log(error)
            // });
            // console.log('CHJATCURST', wxiD)
            clearInterval(begin); // 清空定时器
          }
        }, 500)
      })
    },
    getCurEx() {
      return new Promise((resolve, reject) => {
        let that = this;
        setTimeout(() => {
          wx.invoke('getCurExternalContact', {
          }, function (res) {
            if (res.err_msg == "getCurExternalContact:ok") {
              that.wxcrmId = res.userId;
              resolve(res)
            } else {
              //错误处理
              that.$toast.fail({
                message: '客户ID获取失败，请稍后再试...',
                forbidClick: true,
                duration: 0,
                overlay: true,
              });
              reject(res)
            }
          });
        }, 2000)
      })
    },
    init() { // 初始化请求
      this.$toast.loading({
        message: '加载中...',
        forbidClick: false,
        duration: 0,
        overlay: true,
      });
      this.wxxxx().then(res => { // 企业微信授权
        console.log(res, 'wxIDidIDIDIDID')
        // return this.getName(); // 获取名字
        this.verifyWxId()
        // return this.getCurEx(); // 获取企业微信客户ID
      }).catch(error => {
        console.log(error)
      }).then(res => {
        // this.wxcrmId = res.userId;
        // return this.getName(); // 获取名字
      }).catch(error => {
        console.log(error)
      }).then(res => {
        // console.log(res, ;'我要name')
        // this.verifyWxId()
      })
      sessionStorage.setItem('active', 'ChatCustomer')
    },
    async BindCompletes() { // 关闭弹框
      this.show = false;
      await this.getUserinfo();  // 重新拉去信息接口
    }
  },
  async created() {
    this.$toast.loading({
      message: '加载中...',
      forbidClick: false,
      duration: 0,
      overlay: true,
    });
    // if (sessionStorage.getItem("not_bind")) return;
    // console.log('222222222');
    // this.init()
    // wxxx()
    // setTimeout(() => {
    //   console.log('first2')
    //   let that = this;
    //   wx.invoke('getCurExternalContact', {
    //   }, function (res) {
    //     if (res.err_msg == "getCurExternalContact:ok") {
    //       that.wxcrmId = res.userId;
    //       console.log(res.userId, 'res.userIdres.userIdres.userId')
    //     } else {
    //       //错误处理
    //       that.$toast.fail({
    //         message: '网络错误，请稍后再试...',
    //         forbidClick: true,
    //         duration: 0,
    //         overlay: true,
    //       });
    //     }
    //   });
    // }, 2000)
    // setTimeout(async () => {
    //   await this.getName(); // 获取名字
    //   this.verifyWxId();
    // }, 2500)

  },

};
</script>

<style lang="less" scoped>
@fontcolor: #7a7878;
.ChatCustomer {
  padding: 0.4rem 0.2rem;
  font-size: 0.29rem;
  // background: #eee;
  header {
    display: flex;
    margin-bottom: 0.2rem;
    img {
      width: 1rem;
      height: 1rem;
    }
    .infoBox {
      flex: 1;
      align-self: center;
      margin-left: 0.3rem;
      p {
        padding-bottom: 0.25rem;
        font-weight: 600;
        font-size: 0.3rem;
      }
      .details {
        justify-content: space-between;
        display: flex;
        padding-right: 10px;
        span:last-child {
          color: #5f97ae;
        }
      }
    }
  }
  .info {
    .origin {
      line-height: 0.6rem;
      font-size: 15px;
      color: @fontcolor;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        color: #7a7878;
        line-height: 0.6rem;
        width: 50%;
      }
    }
    .star {
      background: #ebe9e9;
      height: 50px;
      display: flex;
      align-items: center;
      font-size: 15px;
      justify-content: center;
      color: #717475;
      margin-top: 10px;
    }
  }
  .tab {
    margin-top: 10px;
    .company {
      margin-bottom: 15px;
      border-top: 1px solid #aaaaaa;
      padding-top: 10px;
      border-style: dashed;
      p {
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 0.3rem;
          font-weight: 600;
        }
      }
      .grade {
        color: @fontcolor;
        margin-bottom: 10px;
      }
    }
    .personage {
      .company;
    }
  }
  .dynamic {
    .title {
      font-size: 0.3rem;
      font-weight: 600;
    }
    .list {
      max-height: 300px;
      overflow-y: scroll;
      background: #eee;
      border-radius: 20px;
      margin-top: 10px;
    }
  }
  /deep/ .van-tabbar--fixed {
    z-index: 999;
  }
  .title {
    margin-left: 3px;
  }
  .title::before {
    content: "";
    width: 4px;
    height: 13px;
    background: #1989fa;
    position: absolute;
    left: 5px;
    border-radius: 20px;
    margin-right: 38px;
    margin-top: 1px;
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