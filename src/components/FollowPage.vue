<template>
  <div class="Follpage">
    <div class="follTit">
      <div style="margin-left: 15px">
        <van-icon name="records" size="17" />
        <div>
          <span @click="addFollPop">添加跟进记录</span>
        </div>
        <div></div>
      </div>
      <div class="FollIcon">
        <!-- 如果有userID字段 就展示对话，如果没有就选人 -->
        <a :href="'tel:' + phone" @click="telClick">
          <van-icon name="phone-o" size="0.46rem" style="margin-right: 15px" />
        </a>
        <div class="firm" v-if="wxCrmId" @click="openChat()">
          <img src="../assets/img/企业微信.png" alt="" />
        </div>
        <div class="firm" @click="linkmanClick()" v-else>
          <img src="../assets/img/企业微信1.png" alt="" />
        </div>
        <div class="firm" @click="Chatconfig()">
          <img src="../assets/img/config.png" alt="" />
        </div>
        <div class="firm" @click="ChatRecord()">
          <img style="width: 75%" src="../assets/img/记录.png" alt="" />
        </div>
      </div>

      <!-- 语音弹框 -->
      <!-- <van-popup v-model="audioPop" :style="{ height: '30%' }" position="bottom">
        <div class="circle"><span>按住说话</span></div>
      </van-popup> -->
    </div>
    <div class="follCont" v-if="follList.length > 0">
      <div v-for="(item, index) in follList" :key="index" class="follMain">
        <div class="time">
          <!-- <svg-icon icon-class="svg_td_0"></svg-icon> -->
          <icon
            :name="item.type + ''"
            :w="20"
            :height="20"
            style="background: #eee; border-radius: 50%"
          ></icon>
          <div class="wire"></div>
          <!-- <span>{{ item.day }}</span>
          <span>{{ item.month }}月</span> -->
        </div>
        <div class="content">
          <div class="text">
            <!-- 如果type === 4 证明是对话，对话展示content内容，其他展示title -->
            <template>
              <span v-if="item.type == 4" style="white-space: pre-wrap">{{
                item.content
              }}</span>
              <span style="white-space: pre-wrap"
                >{{ item.title == null ? "" : item.title }}
                <br />
                <a
                  v-if="item.url != false"
                  @click="JumpOrder(item.url)"
                  style="color: blue"
                  >查看链接</a
                >
                <!-- 通话录音查看预览 -->
                <a
                  v-else-if="item.callRecordUrl && item.callRecordUrl !== ''"
                  @click="callRecord(item)"
                  style="color: blue"
                  >查看通话录音</a
                >
              </span>
            </template>
            <div
              v-if="item.type == 0 && item.content && item.content.length > 0"
              class="img-list"
            >
              <template v-for="(itr, i) in item.content">
                <img :key="i" :src="itr" @click="ImgClick(item.content)" />
              </template>
            </div>
            <div v-if="item.type == 1">
              <!-- <div class="media" @click="handelClickMadiaPlay(item.content)">
                <van-icon size="20px" color="#AAA" name="volume-o" />
              </div> -->
              <audio
                controls="controls"
                preload="auto"
                :src="item.content"
                class="audio"
              ></audio>
            </div>
          </div>
          <div class="info">
            <span style="font-size: 12px">{{ item.detTime }}</span>
            <span v-show="limits" class="user" @click="dele(item.id, item.pid)"
              >删除</span
            >
            <span
              @click="chat(followUserMap[item.itrId], item.pid)"
              class="user"
              v-if="followUserMap[item.itrId]"
              >{{ followUserMap[item.itrId].nickname || "" }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <van-empty
      v-else-if="empty"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
    />
    <!-- 对话框 -->
    <van-popup
      :safe-area-inset-bottom="true"
      v-model="chatPop"
      position="bottom"
      :style="{ height: '250px' }"
    >
      <p class="pop-tit">向 " {{ chatName }} " 发送消息</p>
      <van-field
        v-model="chatmessage"
        rows="5"
        autosize
        type="textarea"
        maxlength="500"
        show-word-limit
      />
      <!-- <van-field label="" v-model="formData.nickname" placeholder="请输入姓名" /> -->
      <van-button
        class="chabtn"
        size="mini"
        round
        color="#60C6C6"
        type="primary"
        @click="chatFs()"
        >发送</van-button
      >
    </van-popup>
    <van-action-sheet v-model="Actionshow" closeable>
      <div class="contents">
        <div class="contentImg" @click="uploadImg">
          <div class="contIMG">
            <img src="../assets/img/contactItemPicText@2x.png" alt="" />
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
    <!-- 查看录音弹框 -->
    <van-popup
      v-model="call.pop"
      :style="{
        width: '80%',
        height: '100px',
        padding: '10px',
        fontSize: '.30rem',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        display: 'flex',
      }"
      round
    >
      <p style="margin-bottom: 20px; margin-left: 5px">{{ call.title }}</p>
      <!-- <p class="downLoad">
        <van-icon name="down" size="18px" @click="downLoadMp3" />下载
      </p> -->
      <audio :src="call.url" controls="controls" preload="auto" class="audio" />
      <!-- controlslist="nodownload" -->
    </van-popup>
    <a
      target="_self"
      :href="call.url"
      download="call.title"
      style="display: none"
      ref="call"
    ></a>
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
import communication from "../uilts/communication";
// import FileSaver from 'file-saver';
import wxxx from '../uilts/wxconfig'
export default {
  name: 'FollowPage',
  mixins: [ScorllMixin],
  inject: ["reload"],
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
      limits: "",
      chatPop: false,
      chatName: "",
      chatmessage: "",
      pid: "",
      nickname: "",
      toPhone: '',
      call: {
        pop: false,
        title: '',
        url: ''
      }
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
              let time = item.createTime.split(" ");
              let timeArr = time[0].split("-");
              item.month = timeArr[1];
              item.day = timeArr[2];
              item.detTime = that.fordate(timeArr, time[1]);
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
    fordate(timeArr, time1) { // 时间处理
      timeArr.splice(0, 1)
      timeArr.splice(1, 0, '月')
      timeArr.splice(3, 0, '日')
      let date = timeArr.join('');
      let time2 = time1.match(/(\d{2})\:(\d{2})/)
      return date + time2[0];
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
      ).then((res) => {
        if (res.error === 'success') {
          this.getAgendaList()
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    HometelClicks(id) {  // 点击拨打电话
      let crmInfo = id;
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
      ).then((res) => {
        if (res.error === 'success') {
          this.getAgendaList()
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },// 首页触发跟进记录
    ImgClick(src) { // 点击图片进入预览模式
      ImagePreview({
        images: src,
        closeable: true,
      });
    },
    openChat() {
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
      // this.saveWxCrm(1312);
      // return;
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
          this.saveWxCrm(res.userIds[0]);
          communication.$emit('update', 'msg'); //触发home 页面方法，目的是为了更新列表数据
        }
        if (res.err_msg == "selectExternalContact:ok") {
        } else {
          //错误处理
          console.log('拉取联系人错了');
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
      // crm.phone = this.phone;
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
            this.$nextTick(() => {
              this.current = 1;
              this.getAgendaList();
              window.document.documentElement.scrollTop = 0;
              let json = JSON.parse(sessionStorage.getItem('_crm_info')); // 更新dom 本地wxid
              json.wxCrmId = wxid;
              sessionStorage.setItem('_crm_info', JSON.stringify(json));
              this.wxCrmId = JSON.parse(sessionStorage.getItem('_crm_info'))?.wxCrmId;
              communication.$emit('update', { index: Number(sessionStorage.getItem('ManualIdx')), wxId: this.wxCrmId, route: sessionStorage.getItem('active') }); //触发home 页面更新列表数据
            })
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
    Unbindupdate() {
      let json = JSON.parse(sessionStorage.getItem('_crm_info')); // 更新dom 本地wxid
      json.wxCrmId = '';
      sessionStorage.setItem('_crm_info', JSON.stringify(json));
      this.wxCrmId = '';
    },// 更新解绑后的数据
    getpermission() { // 获取是不是管理员
      let param = new URLSearchParams();
      let signature = generateSignature3(this.$U || local.U(), nonce, timeout);
      param.append("userId", this.$U || local.U());
      param.append("nonce", nonce);
      param.append("timeout", timeout);
      param.append("signature", signature);
      this.$post1('/api/request/itr/comp/permission/current', param)
        .then((res) => {
          if (!res.error) {
            this.limits = res.company.role == 1 ? true : false;
          } else {
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    dele(id, pid) { // 删除跟进记录
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您确定要删除这条记录吗？',
      })
        .then(() => {
          this.deleOk(id, pid)
        })
        .catch(() => {
        });
    },
    deleOk(id, pid) { // 删除跟进记录调用接口
      // let param = new URLSearchParams();
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let signature = generateSignature3(id, pid, nonce, timeout);
      let data = {
        id,
        pid,
        nonce,
        timeout,
        signature,
      };
      this.$get("/api/request/itr/comp/customer/record/delete", {
        params: data,
      })
        .then((res) => {
          setTimeout(() => {
            this.getAgendaList()
          }, 200)
        })
        .catch(function (error) {

        });
    },
    chat(data, pid) {
      console.log(data, pid)
      this.toPhone = data.id;
      let currentId = JSON.parse(sessionStorage.getItem('userinfo'))?.id;
      this.chatName = data.nickname;
      if (currentId === data.id) {
        this.$toast.fail('不能和自己对话')
      } else {
        this.chatPop = true;
        this.chatmessage = '';
        this.pid = pid;
        this.nickname = data.nickname
      }
    },
    chatFs() {  // 发送消息
      let param = new URLSearchParams();
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let nickname = JSON.parse(sessionStorage.getItem('userinfo'))?.nickname;
      let signature = generateSignature3(crmInfo, this.$C || local.C(), timeout, nonce);
      param.append("to", this.toPhone);
      param.append("from", this.$U || local.U());
      param.append("pid", crmInfo);
      param.append("auditRecordId", "");
      param.append("compId", this.$C || local.C());
      let content = nickname + '--->' + this.nickname + ':\n' + this.chatmessage;
      param.append("content", content);
      param.append("notifyMode", 1);
      // return;
      // to:to,
      // from:from,
      // pid:pid,
      // auditRecordId:auditRecordId,
      // compId:compId,
      // content:val,
      // timeout: timeout,
      // notifyMode:1,
      // nonce: nonce,
      // signature: signature
      // param.append("type", 4);
      // param.append("id", 0);
      // param.append("compId", this.$C || local.C());
      // param.append("itrId", this.$U || local.U());
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("timeout", timeout);
      this.$post1('/api/request/itr/comp/customer/record/audit/do', param)
        .then((res) => {
          if (res.error == 'success') {
            this.$toast({
              message: '新增成功',
              position: 'bottom',
            })
            this.chatPop = false;
            setTimeout(() => {
              this.getAgendaList()
            }, 200)

          } else {
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    JumpOrder(url) { // 跳转至订单详情页面
      let result;
      if (url.indexOf('order') !== -1) {
        result = url.match(/id=(\S*)/)[1];
        this.$router.push({
          path: "/orderdetailinfo/" + result,
          // name: 'mallList',
          query: {
            id: result
          }
        })
      } else if (url.indexOf('form') !== -1) {
        this.$toast.fail('表单导入暂不支持查看详情')
      }
    },
    callRecord(data) { // 查看录音弹框
      this.call.pop = true;
      this.call.title = this.followUserMap[data.itrId].nickname + '于 ' + data.createTime + ' 呼叫' + data.crmName;
      this.call.url = data.callRecordUrl;
    },
    Chatconfig() {  // 会话配置
      this.$router.push("/ChatConfig")
    },
    ChatRecord() {
      let { wxCrmId } = JSON.parse(sessionStorage.getItem('_crm_info'));
      console.log(wxCrmId);
      if (wxCrmId) {
        this.$router.push("/ChatRecord")
      } else {
        this.$toast('没有绑定联系人,无法查看会话记录!')
      }
    },
    downLoadMp3() {
      // console.log(this.call, 'callllllllll');
      // this.$refs.call.click();
      // return;
      // const a = document.createElement('a'); // 创建a标签
      // a.setAttribute('download', 'test');// download属性
      // a.setAttribute('href', 'https://api.jiain.net/aliyun/oss/media/2175.mp3');// href链接
      // a.click();

    }
  },
  computed: {
    getIndex() {
      return this.$store.state.current.follow;
    }
  },
  mounted() {
    communication.$on('updateUnbind', () => {
      this.Unbindupdate();
    })
    communication.$on('callTel', (id) => {  // 首页电话按钮触发跟进记录
      this.HometelClicks(id)
    })
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
    await this.getpermission();
    this.getAgendaList();
    this.phone = JSON.parse(sessionStorage.getItem('_crm_info'))?.phone;
    this.wxCrmId = JSON.parse(sessionStorage.getItem('_crm_info'))?.wxCrmId;
    this.id = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
    wxxx()
  },
  async activated() {
    this.Actionshow = false;
    await this.getpermission();
    this.getAgendaList();
    this.phone = JSON.parse(sessionStorage.getItem('_crm_info'))?.phone;
    this.wxCrmId = JSON.parse(sessionStorage.getItem('_crm_info'))?.wxCrmId;
    this.id = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.follow; // 设置每个页面的scrollTop
  },
}
</script>
<style lang="less" scoped>
.Follpage {
  background: #f1f1f1;
  height: 100vh;
  .contents {
    height: 3.32rem;
    padding: 0.4rem;
    align-items: center;
    display: flex;
    text-align: center;
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
    // margin-top: 0.2rem;
    height: 0.8rem;
    align-items: center;
    color: #468af1;
    position: fixed;
    width: 100%;
    left: 0;
    height: 0.8rem;
    top: 123px;
    border-bottom: 8px solid #f1f1f1;
    border-top: 8px solid #f1f1f1;
    div {
      display: flex;
      i {
        margin-right: 0.2rem;
        margin-top: -2px;
      }
    }
  }
  .follCont:nth-child(2) {
    padding-top: 3.4rem;
  }
  .follCont {
    background-color: #fff;
    .follMain:first-child {
      padding-top: 35px;
    }
    .follMain {
      display: flex;
      padding: 10px 15px;

      .time {
        margin-right: 0.3rem;
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
        // width: 77%;
        flex: 1;
        // margin-left: 0.2rem;
        .text {
          background: #f1f1f1;
          padding: 10px 5px;
          overflow: hidden;
          span {
            line-height: 25px;
            word-break: break-all;
            padding-left: 8px;
            padding: 5px 2px;
            font-size: 0.3rem;
          }
          .img-list {
            display: flex;
            width: 90%;
            padding: 5px;  
            flex-wrap: wrap;
            padding-left: 0;
            img {
              width: 1.2rem;
              height: 1.2rem;
              margin-right: 0.1rem;
              margin-bottom: 0.1rem;
              object-fit: cover;
            }
          }
        }
        .info {
          padding: 8px 0px;
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
      width: 80%;
      height: 80%;
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
  /deep/ .van-field__word-limit {
    text-align: left;
  }
  .pop-tit {
    padding: 10px 8px;
  }
  .chabtn {
    margin: 10px;
    float: right;
  }
  .van-empty {
    padding-top: 186px;
  }
  .audio {
    height: 35px;
    width: 100%;
    outline: none;
  }
  .downLoad {
  }
  svg path {
    fill: #eee;
  }
  .wire {
    width: 1px;
    height: calc(100% - 35px);
    background: rgb(193 190 190);
    margin: 0 auto;
    margin-top: 5px;
  }
}
</style>