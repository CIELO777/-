<template>
  <div class="Follpage">
    <div class="follTit">
      <div style="margin-left:15px">
        <van-icon name="records" size="17" />
        <div>
          <span @click="addFollPop">添加跟进记录</span>
        </div>
        <div>
        </div>
      </div>
      <div class="FollIcon">
        <!-- 如果有userID字段 就展示对话，如果没有就选人 -->
        <a :href="'tel:'+ phone" @click="telClick">
          <van-icon name="phone-o" size="28" style="margin-right:15px;" />
        </a>
        <div class="firm" v-if="wxCrmId" @click="openChat()">
          <img src="../assets/img/企业微信.png" alt="">
        </div>
        <div class="firm" @click="linkmanClick()" v-else>
          <img src="../assets/img/企业微信1.png" alt="">
        </div>
      </div>
      <van-action-sheet v-model="Actionshow" closeable>
        <div class="contents">
          <div class="contentImg" @click="uploadImg">
            <div class="contIMG">
              <img src="../assets/img/contactItemPicText@2x.png" alt="">
              <p>添加图文</p>
            </div>
          </div>
          <!-- <div class="contents">
            <div lass="contentImg" @click="uploadAudio">
              <div class="contIMG">
                <img src="../assets/img/contactItemVoice@2x.png" alt="">
                <p>添加语音</p>
              </div>
            </div>
          </div> -->
        </div>
      </van-action-sheet>
      <!-- 语音弹框 -->
      <!-- <van-popup v-model="audioPop" :style="{ height: '30%' }" position="bottom">
        <div class="circle"><span>按住说话</span></div>
      </van-popup> -->
    </div>

    <div class="follCont">
      <div v-for="(item,index) in follList" :key="index" class="follMain">
        <div class="time">
          <span>{{item.day}}</span>
          <span>{{item.month}}月</span>
        </div>
        <div class="content">
          <div class="text">
            <span>{{item.title==null?'':item.title}} <a v-if="item.url != false" :href="item.url" style="color:blue">查看链接</a></span>
            <div v-if="item.type == 0 && item.content.length > 0" class="img-list">
              <template v-for="(itr,i) in item.content">
                <img :key="i" :src="itr + '?x-oss-process=image/resize,m_fill,h_200,w_200'" @click="ImgClick(itr + '?x-oss-process=image/resize,m_fill,h_200,w_200')" />
              </template>
            </div>
            <!-- <div v-if="item.type == 1">
              <div class="media" @click="handelClickMadiaPlay(item.content)">
                <van-icon size="20px" color="#AAA" name="volume-o" />
              </div>
            </div> -->
          </div>
          <div class="info">
            <span>{{item.detTime}}</span>
            <span class="user" v-if="followUserMap[item.itrId]">{{followUserMap[item.itrId].nickname || ""}}</span>
          </div>
        </div>
      </div>
      <van-empty v-show="empty" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />

    </div>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import local from '../uilts/localStorage';
import { ScorllMixin } from '@/uilts/mixins'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { ImagePreview } from 'vant';
import sha1 from '../uilts/sha1';
import Utils from '../uilts/utils';
console.log(wx, 'followWX')
export default {
  name: 'FollowPage',
  mixins: [ScorllMixin],
  data() {
    return {
      follList: [],
      followUserMap: {},
      Actionshow: false,
      action: '',
      // current: 1,
      total: 0,
      phone: "",
      empty: false,
      audioPop: false,
      wxCrmId: false,
      jsapi2: "",
      appid2: "",
      noncestr2: "",
      timestamp2: "",
      signature2: "",
      signature: "",
      appId: "",
      noncestr: "",
      timestamp: "",
      chatuserID: "",
    }

  },
  methods: {
    getAgendaList() {  // 获取跟进记录
      let that = this;
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let signature = generateSignature3(crmInfo, this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      this.$get('/api/request/itr/comp/customer/record/result', {
        params: {
          pid: crmInfo,
          compId: this.$C || local.C(),
          userId: this.$U || local.U(),
          nonce: nonce,
          timeout: timeout,
          signature: signature,
          current: this.current,
          size: 20,
          follList: [],
          followUserMap: {}
        },
      })
        .then(function (res) {
          if (!res.error) {
            let str = '';
            let data = res.data.map(item => {
              let time = item.createTime.split(" ")[0];
              let timeArr = time.split("-");
              item.month = timeArr[1];
              item.day = timeArr[2];
              item.detTime = item.createTime.split(" ")[1].substring(0, 5);
              if (item.type == 0) {
                item.content = JSON.parse(item.content)
              }
              if (item.title && item.title.match(/链接：(\S*)/)) {  // 有链接截取网址
                str = item.title.match(/链接：(\S*)/)[1];
                item.title = item.title.replace(/链接：(\S*)/g, '');  // 把title字段链接都截取下去
              } else {
                str = false;
              }
              return {
                ...item,
                url: str
              };
            })
            console.log(data);
            that.follList = that.current == 1 ? data : that.follList.concat(data);
            that.followUserMap = { ...that.followUserMap, ...res.itrUser };
            that.total = res.totalPageCount;
            if (that.follList.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.$toast.clear()
          }
        })
        .catch(function (error) {
          console.log(error);
          that.$toast.fail('请求失败，请稍后再试');

        });
    },
    addFollPop() { //点击添加跟进记录
      this.Actionshow = true;
    },
    uploadImg() {
      this.$router.push('/sheetimg')
    },
    uploadAudio() {
      this.Actionshow = false;
      this.audioPop = true;
      wx.startRecord();
    },
    onScroll() {
      // 可滚动容器的高度
      let innerHeight = document.querySelector('.follCont').offsetHeight;
      // 屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight
      // 可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.documentElement.scrollTop
      // scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight <= (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (outerHeight + scrollTop >= innerHeight) {
        // 加载更多操作
        console.log('触底了');
      }
    },
    telClick() {  // 点击拨打电话
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let signature = generateSignature3(0, this.$C || local.C(), this.$U || local.U(), crmInfo, timeout, nonce);
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("id", 0);
      param.append("title", "拨打了电话");
      param.append("content", "");
      param.append("itrId", this.$U || local.U());
      param.append("pid", crmInfo);
      param.append("type", 2);
      param.append("compId", this.$C || local.C());
      this.$post1('/api/request/itr/comp/customer/record/save', param
      )
        .then(function (res) {
          if (res.error === 'success') {
            console.log(res);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ImgClick(src) { // 点击图片进入预览模式
      console.log(src);
      ImagePreview([src]);
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
        console.log(res, 'getAgentConfig');
        let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + nonce + '&timestamp=' + timeout / 1000 + '&url=' + url
        this.jsapi2 = res.jsapi_ticket  // 这个值是拉取的值agentConfig 值
        this.timestamp2 = timeout / 1000;
        this.noncestr2 = nonce;
        this.signature2 = sha1.hex_sha1(str1);
        this.appid2 = res.appId
      }).catch((err) => {
        console.log(err)
      })
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
          console.log(res, 'getWxJsJdk');
          this.appId = res.appId;
          this.noncestr = nonce;
          this.timestamp = timeout / 1000;
          let url = location.href.split('#')[0];
          let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + this.noncestr2 + '&timestamp=' + this.timestamp2 + '&url=' + url
          let signature = sha1.hex_sha1(str1);
          // console.log(this.timestamp, this.noncestr, signature, 'configData');
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
            console.log(that.appid2, 'appid2', that.timestamp2, that.noncestr2, that.signature2);
            wx.agentConfig({
              corpid: that.appid2, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid: res.agentId, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp: that.timestamp2, // 必填，生成签名的时间戳
              nonceStr: that.noncestr2, // 必填，生成签名的随机串
              signature: that.signature2,// 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: ['selectExternalContact'], //必填
              success: function (res) {
                console.log(res, 'successgetWxJsJdk');
                // 回调
                // alert('成功')
              },
              fail: function (res) {
                console.log(error, 'erroragentConfig');
                if (res.errMsg.indexOf('function not exist') > -1) {
                }
              }
            });

          });
          wx.error(function (res) {//通过error接口处理失败验证
            // config信息验证失败会执行error
            console.log('执行失败', res);
          });
        }).catch(err => {
          console.log(err, 'readyRrror');
        })
    },
    openChat() {
      console.log('cHAT',this.wxCrmId);
      wx.openEnterpriseChat({ // 调用对话
        // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
        userIds: '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        externalUserIds: this.wxCrmId, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
        groupName: '',  // 会话名称。单聊时该参数传入空字符串""即可。
        chatId: "", // 若要打开已有会话，需指定此参数。如果是新建会话，chatId必须为空串
        success: function (res) {
          var chatId = res.chatId; //返回当前群聊ID，仅当使用agentConfig注入该接口权限时才返回chatId
          // 回调
        },
        fail: function (res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      });
    },
    linkmanClick() {  // 点击拉去联系人
      console.log('linkmanClick');
      wx.invoke('selectExternalContact', {
        "filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
      }, (res) => {
        if (res.userIds.length > 1) {  // 如果多选了，提示他，只能选择一个外部联系人
          this.$toast({
            message: '只能关联一个外部联系人',
            position: 'bottom',
          });
          return;
        } else {   // 如果单选了，保存当前userid
          // this.wxCrmId = res.userIds[0];
          console.log(res.userIds[0], 'res.userIds[0]');
          this.saveWxCrm(res.userIds[0]);
        }
        if (res.err_msg == "selectExternalContact:ok") {
        } else {
          //错误处理
          console.log('拉区联系人错了');
        }
      });
    },
    saveWxCrm(wxid) {  // 保存联系人接口
      let that = this;
      let crm = {};
      crm.id = this.id; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = wxid;
      crm.phone = this.phone;
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
            // await this.getAgendaList();
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
          console.log(error);
        });
    },
  },
  computed: {
    getIndex() {
      return this.$store.state.current.follow
    }
  },
  watch: {
    getIndex(val) {
      this.current = val;
      if (this.total < this.current) return;
      this.$toast.loading('加载中...');
      this.getAgendaList();

    },
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,  // 挂载图片预览组件
  },
  async created() {
    this.getAgendaList();
    this.phone = JSON.parse(sessionStorage.getItem('_crm_info'))?.phone;
    this.wxCrmId = JSON.parse(sessionStorage.getItem('_crm_info'))?.wxCrmId;
    console.log(this.wxCrmId, 'wxcrmid');
    this.id = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
    await this.getAgentConfig()  // 同步执行 否则会报错
    await this.getWxJsJdk();
  },

}
</script>
<style lang="less" scoped>
.Follpage {
  background: #f1f1f1;
  height: 100%;
  .contents {
    height: 3.32rem;
    padding: 0.4rem;
    .contIMG {
      display: flex;
      flex-direction: column;
      img {
        width: 1.5rem;
        margin-bottom: 0.3rem;
        height: 1.4rem;
      }
    }
  }
  .follTit {
    display: flex;
    background: #fff;
    justify-content: space-between;
    margin-top: 0.2rem;
    height: 0.8rem;
    align-items: center;
    color: #468af1;
    position: fixed;
    width: 100%;
    left: 0;
    height: 0.8rem;
    top: 78px;
    border-bottom: 8px solid #f1f1f1;
    border-top: 8px solid #f1f1f1;
    div {
      display: flex;
      align-items: center;
      i {
        margin-right: 0.2rem;
        margin-top: -2px;
      }
    }
  }
  .follCont:nth-child(2) {
    margin-top: 1.9rem;
  }
  .follCont {
    background-color: #fff;
    .follMain {
      display: flex;
      padding: 10px 15px;

      .time {
        width: 1.6rem;
        flex-shrink: 0;
        span:first-child {
          font-size: 22px;
          font-weight: bold;
        }
        span:last-child {
          font-size: 16px;
          font-weight: 400;
          padding-left: 5px;
        }
      }
      .content {
        flex: 3;
        margin-left: 0.2rem;
        .text {
          background: #f1f1f1;
          padding: 10px 5px;
          overflow: hidden;
          span {
            line-height: 25px;
            word-break: break-all;
            padding-left: 8px;
          }
          .img-list {
            display: flex;
            width: 90%;
            padding: 5px;
            flex-wrap: wrap;
            img {
              width: 1.2rem;
              height: 1.2rem;
              margin-right: 0.1rem;
              margin-bottom: 0.1rem;
            }
          }
        }
        .info {
          padding: 8px 10px;
          color: #aaa;
          font-size: 13px;

          .user {
            font-size: 13px;
            color: #4e5e87;
            padding-left: 5px;
          }
        }
      }
    }
    .van-empty {
      background: #f1f1f1;
    }
  }
  .firm {
    width: 0.7rem;
    height: 0.6rem;
    padding-top: 2px;
    flex: 1;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .FollIcon {
    margin-right: 0.2rem;
    a {
      margin-top: 0.1rem;
    }
  }
  .circle {
    width: 2rem;
    height: 2rem;
    background: #2a85c2;
    border-radius: 50%;
    color: #fff;
    justify-content: center;
    margin: 0 auto;
    span {
      text-align: center;
    }
  }
}
</style>