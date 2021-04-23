<template>
  <div class="content">
    <!-- <van-search placeholder="请输入搜索关键词(手机号 昵称 公司ID)" v-model="searchData" @input="searchChange" /> -->
    <!-- 联系人or公海 -->
    <div
      class="nav"
      :style="{ paddingTop: padding }"
      v-if="
        $route.name == 'Home' ||
        $route.name == 'HighSeas' ||
        $route.name == 'detailFilter'
      "
    >
      <template v-for="(item, i) in list">
        <div :key="i" class="nav-item">
          <div class="nav-L" @click="handItemClick(item, i)">
            <div class="nav-fir">
              <div class="nickN">{{ item.nickname }}</div>
              <!-- 性别 -->
              <div class="wawa" v-if="item.gender == 2">
                <img src="../../public/img/gg/gender_unknow.png" />
              </div>
              <div class="wawa" v-if="item.gender == 1">
                <img src="../../public/img/gg/gender_man.png" />
              </div>
              <div class="wawa" v-if="item.gender == 0">
                <img src="../../public/img/gg/gender_woman.png" />
              </div>
              <!-- 公海 -->
              <template v-if="label">
                <div class="nav-comp ml" v-if="item.ownerType == 0">
                  （总公司公海）
                </div>
                <div class="nav-comp ml" v-else-if="item.ownerType == 1">
                  （分公司公海）
                </div>
                <div class="nav-comp ml" v-else-if="item.ownerType == 2">
                  （所属部门公海）
                </div>
                <div class="nav-comp ml" v-else>（个人公海）</div>
              </template>
              <!-- 联系人 -->
              <!-- {{userMaps[item.ownerId].nickname}} -->
              <div v-else class="nav-comp ml">
                <template>
                  {{
                    userMaps[item.ownerId]
                      ? "（ " + userMaps[item.ownerId].nickname + " ）"
                      : sb
                      ? "（ " + sb + " ）"
                      : ""
                  }}
                </template>
              </div>
            </div>

            <p class="nav-comp">
              {{
                item.company === undefined ||
                item.company === null ||
                item.company === ""
                  ? "未填写公司名称"
                  : item.company
              }}
            </p>
            <p class="nav-comp">{{ item.lastContactRecord }}</p>
          </div>
          <div class="nav-R" :key="i">
            <van-icon
              v-if="item.YunCall"
              name="phone"
              size="0.4rem"
              color="#586A76"
              @click="callTel(item.YunCall, 'Yun', i)"
            />
            <van-icon
              name="phone"
              size="0.4rem"
              v-else
              color="#586A76"
              @click="callTel(item.phone, 'Phone', i)"
            />
          </div>
          <template>
            <!-- 如果有userID字段 就展示对话，如果没有就选人 -->
            <div
              class="firm"
              @click="openChat(item.wxCrmId)"
              v-if="item.wxCrmId"
            >
              <img class="firmImg" src="../assets/img/企业微信.png" alt="" />
            </div>
            <div
              class="firm"
              @click="linkmanClick(item.id, item.phone, i)"
              v-else
            >
              <img src="../assets/img/企业微信1.png" alt="" />
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- 批注 -->
    <div
      :style="{ paddingTop: padding, paddingBottom: '50px' }"
      v-if="$route.name == 'Common'"
    >
      <template v-for="(item, i) in list">
        <div :key="i" class="product" @click="postil(item, i)">
          <div class="contents line1">
            <div class="toh qqpp">
              <span style="font-weight: bold; font-size: 15px">
                {{ item.crmName }}</span
              >
              <div
                class="wawa"
                v-if="item.crmGender == 2"
                style="margin-left: 5px"
              >
                <img src="../../public/img/gg/gender_unknow.png" />
              </div>
              <div
                class="wawa"
                v-if="item.crmGender == 1"
                style="margin-left: 5px"
              >
                <img src="../../public/img/gg/gender_man.png" />
              </div>
              <div
                class="wawa"
                v-if="item.crmGender == 0"
                style="margin-left: 5px"
              >
                <img src="../../public/img/gg/gender_woman.png" />
              </div>
              <span v-else class="des"
                >(
                {{
                  userMaps[item.crmOwnerId]
                    ? userMaps[item.crmOwnerId].nickname
                    : ""
                }})</span
              >
            </div>
            <span class="toh desc">{{
              item.crmCompany === undefined ||
              item.crmCompany === null ||
              item.crmCompany === ""
                ? "未填写公司名称"
                : item.crmCompany
            }}</span>
            <div class="toh desc">{{ item.content }}</div>
          </div>
          <div v-if="item.auditToRead == 0" class="hint">1</div>
        </div>
      </template>
    </div>
    <!-- YUN -->
    <van-popup
      v-model="YunShow"
      :style="{ height: 'auto', padding: '10px' }"
      round
    >
      <p
        style="
          height: 30px;
          line-height: 30px;
          text-align: center;
          padding: 0 20px;
          border-bottom: 1px solid #eee;
        "
      >
        请选择
      </p>
      <div v-if="typeof YunValue == 'array'"></div>
      <template v-for="(item, index) in YunValue">
        <div
          :key="index"
          style="
            height: 40px;
            line-height: 40px;
            text-align: center;
            padding: 0 50px;
            border-bottom: 1px solid #eee;
            white-space: nowrap;
          "
          @click="YunCallPhone(item)"
        >
          {{ item }}
        </div>
      </template>
    </van-popup>
  </div>
</template>
<script> 
import { initWxConfig, wxAgentConfig } from '../uilts/wx-js-sdk/wxConfig'
import { ScorllMixin } from '@/uilts/mixins';
import communication from "../uilts/communication";
import ColorPageVue from '../views/ColorPage.vue';
import local from '../uilts/localStorage';
import { generateSignature3, generateTimeout, generateNonce } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
export default {
  props: ["sb", "padding", "list", "users", "userMaps", "label", "totals", 'ramdom'], //props接收
  mixins: [ScorllMixin],
  data() {
    return {
      searchData: '',
      route: '',
      userIds: [],
      chatuserID: "",
      YunShow: false,
      YunValue: [],
      index: 0
    }
  },
  methods: {
    handItemClick(data, index) {
      sessionStorage.setItem('tabNum', 0);
      sessionStorage.setItem('_crm_info', JSON.stringify(data))
      sessionStorage.setItem('ManualIdx', index) // 记录点击的数据索引，为了列表更新数据用
      this.$router.push({ name: 'LinkDetailed' });
    },
    linkmanClick(id, phone, idx) {  // 点击拉去联系人
      wx.invoke('selectExternalContact', {
        "filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
      }, (res) => {
        // 防止报错
        if (res.userIds) {
          if (res.userIds.length > 1) {  // 如果多选了，提示他，只能选择一个外部联系人
            this.$emit('userIDLength', 2)
            return;
          } else {   // 如果单选了，保存当前userid
            this.chatuserID = res.userIds[0];
            this.$emit('userIdSave', res.userIds[0], id, phone, idx)  // 一参是WXid  二参是 当前id ，手机号，
          }
        }
        // 如果没有提示弹框
        if (res.err_msg == "selectExternalContact:ok") {
          console.log(res, '成功');
        } else {
          console.log(res, '失败');
          //错误处理
          if (res.err_msg.indexOf('permission') !== -1) {
            this.$toast.fail('请联系管理员开通客户联系权限')
          } else {
            this.$toast.fail(`绑定联系人失败,${res.err_msg}`)
          }
        }
      });
    },
    openChat(wxCrmId) {
      console.log(wxCrmId, '对话')
      wx.openEnterpriseChat({ // 调用对话
        // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
        userIds: '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        externalUserIds: wxCrmId, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
        groupName: '',  // 会话名称。单聊时该参数传入空字符串""即可。
        chatId: "", // 若要打开已有会话，需指定此参数。如果是新建会话，chatId必须为空串
        success: function (res) {
          console.log(res, 'success')
          var chatId = res.chatId; //返回当前群聊ID，仅当使用agentConfig注入该接口权限时才返回chatId
          // 回调
        },
        fail: function (res) {
          console.log(res, 'fail')
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      });
    },
    initScroll() { // 选择会触发滚动条位置，所以每次请求结束清除滚动位置；
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = 0;

      })
    },
    callTel(id, type, i) {
      console.log(id, type, i);
      this.index = i; //获取点击了列表的第几个index
      if (type == 'Yun') {
        this.YunShow = true;
        this.YunValue = id;
      } else {
        window.location.href = `tel:${id}`; // type== 0 关闭弹框
        // this.Yun(id, this.list[this.index].id)  // 调用YUN 外呼接口
      }
    },
    YunCallPhone(item) {  // 多个电话弹框
      this.Yun(item, this.list[this.index].id)  // 调用YUN 外呼接口
    },
    Yun(phone, pid) { // 云外呼接口
      let param = new URLSearchParams();
      let signature = generateSignature3(pid, this.$U || local.U(), this.$C || local.C(), nonce, timeout)
      param.append("phone", phone);
      param.append("pid", pid);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("nonce", nonce);
      param.append("timeout", timeout);
      param.append("signature", signature);
      this.$post1('/api/request/itr/comp/customer/record/call', param)
        .then((res) => {
          if (res.type == 1) { //type === 1 为云外呼
            this.YunShow = false; // 关闭弹框
            this.$toast({
              message: '请稍后，正在唤起云外呼...',
              duration: 0, // 持续展示 toast
              forbidClick: true
            })
            setTimeout(() => {  // 延迟关闭
              this.$toast.clear();
            }, 5000)
          } else {
            window.location.href = `tel:${phone}`; // type== 0 关闭弹框
            this.YunShow = false; // 关闭弹框
            communication.$emit('callTel', phone); //触发home 页面方法，目的是为了更新列表数据
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    postil(item, index) {
      console.log(item, index)
      let ids = item.id;
      let backItem = JSON.parse(JSON.stringify(item))
      backItem.id = backItem.pid;
      backItem.index = 2;
      sessionStorage.setItem('tabNum', 1);
      sessionStorage.setItem('_crm_info', JSON.stringify(backItem))
      sessionStorage.setItem('ManualIdx', index) // 记录点击的数据索引，为了列表更新数据用
      this.readRecord(ids);
      this.$router.push({ name: 'LinkDetailed' });
    },
    readRecord(ids) {
      let signature = generateSignature3(ids, this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      let data = {
        id: ids,
        compId: this.$C || local.C(),
        userId: this.$U || local.U(),
        timeout: timeout,
        nonce: nonce,
        signature: signature
      };

      this.$get('/api/request/itr/comp/customer/record/audit/read', {
        params: data,
      })
    }

  },
  created() {
    this.route = this.$route.name;
  },
  computed: {
    getIndex() {
      if (this.route == 'HighSeas') {
        return this.$store.state.current.highseas;
      } else if (this.route == 'Common') {
        return this.$store.state.current.common;
      } else if (this.route == 'Home') {
        return this.$store.state.current.home;
      } else if (this.route == 'detailFilter') {
        return this.$store.state.current.filter;
      }
    },
  },
  watch: {
    getIndex(val) {
      this.current = val;
      console.log(this.totals, this.current);
      if (this.totals < this.current) return;
      if (this.current !== 1) {
        this.$emit('chengParentCur', this.current);
      }
    },
  },
  mounted() {
    // console.log('zhxingl1');
    // window.document.documentElement.scrollTop = sessionStorage.getItem('histroyScrollTop') || 0;
  }
}

</script>
<style lang="less" scoped>
@bgColor: #f1f1f1;
@FColor: #726f6f;
.content {
  font-size: 14px;
  height: calc(~"100vh - 90px");
  background: @bgColor;
  .van-search {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100vw;
  }
}
.nav {
  margin: 0 auto;
  box-sizing: border-box;
  padding-bottom: 50px;
  background: #f1f1f1;
  .nav-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 1px;
    // height: 88px;
    background: #fff;
    padding: 0.17rem 12px;
    align-items: center;
    box-sizing: border-box;
    .nav-fir {
      // margin-bottom: .1rem;
      display: flex;
      align-items: center;
      padding-top: 1px;
      .nickN {
        color: #3b3b3b;
        font-size: 0.3rem;
        font-weight: 800;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex-shrink: 0;
        word-break: break-all;
        max-width: 60%;
        margin-right: 0.1rem;
        height: 0.4rem;
        line-height: 0.4rem;
      }
    }
    .nav-L {
      flex: 7;
      overflow: hidden;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .nav-R {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      // background-color: #60c6c6;
      // background-color: #eee
      height: 0.7rem;
      width: 0.7rem;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .firm {
      height: 0.56rem;
      width: 0.7rem;
      padding-top: 2px;
      // flex: 1;
      flex-shrink: 0;
      margin-left: 0.1rem;
      display: flex;
      align-items: center;
      img {
        width: 80%;
        height: 80%;
      }
    }
  }
  // .btn {
  //   position: fixed;
  //   left: 0;
  //   background:#fff;
  //   line-height:44px;
  //   bottom: 0;
  //   width: 100%;
  //   height: 44px;
  //   text-align: center;
  //   border-top: 1px solid #eee;
  // }
}
.ml {
}
.nav-comp {
  color: @FColor;
  font-size: 0.26rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  line-height: 0.45rem;
  height: 0.45rem;
  // margin-bottom: .1rem;
}
.wawa {
  display: inline-block;
  img {
    width: 0.3rem;
    height: 0.3rem;
  }
}
.product {
  padding: 7px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-top: 1px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  z-index: 0;
  position: relative;
  .contents {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 50px);
    max-width: calc(100% - 50px);
    margin-right: 20px;
    div {
      color: #3b3b3b;
      display: flex;
      align-items: center;
    }
  }
  .hint {
    position: absolute;
    right: 10px;
    top: 40px;
    color: #fff;
    background: red;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
  }
  .toh {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 0.52rem;
  }
  .qqpp {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 0.3rem;
  }
  .des {
    color: #555 !important;
    padding-left: 0.15rem;
    font-weight: 400;
    font-size: 0.25rem;
  }
  .desc {
    color: #555 !important;
    font-size: 0.25rem;
  }
  .YunPop {
  }
}
</style>