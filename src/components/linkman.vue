<template>
  <div class="content">
    <!-- <van-search placeholder="请输入搜索关键词(手机号 昵称 公司ID)" v-model="searchData" @input="searchChange" /> -->
    <div class="nav" :style="{paddingTop:padding}">
      <template v-for="(item ,i) in list">
        <div :key="i" class="nav-item">
          <div class="nav-L" @click="handItemClick(item,i)">
            <div class="nav-fir">
              <div class="nickN">{{item.nickname}}</div>
              <!--  {{item.id}} -->
              <template v-if="label">
                <div class="nav-comp ml" v-if="item.ownerType ==0">（总公司公海）</div>
                <div class="nav-comp ml" v-else-if="item.ownerType ==1">（分公司公海）</div>
                <div class="nav-comp ml" v-else-if="item.ownerType ==2">（所属部门公海）</div>
                <div class="nav-comp ml" v-else>（个人公海）</div>
              </template>
              <div v-else class="nav-comp ml">{{userMaps[item.ownerId] ? '（ '+userMaps[item.ownerId].nickname +'）':""}}</div>
            </div>

            <p class="nav-comp"> {{item.company === undefined ||item.company === null || item.company === ""?  "未填写公司名称" :item.company}}</p>
            <p class="nav-comp">{{item.lastContactRecord}}</p>
          </div>
          <div class="nav-R" :key="i">
            <a :href="'tel:'+item.phone">
              <van-icon name="phone" size="22" color="#586A76" @click="callTel(item.id)" />
            </a>
          </div>
          <template>
            <!-- 如果有userID字段 就展示对话，如果没有就选人 -->
            <div class="firm" @click="openChat(item.wxCrmId)" v-if="item.wxCrmId">
              <img class="firmImg" src="../assets/img/企业微信.png" alt="">
            </div>
            <div class="firm" @click="linkmanClick(item.id,item.phone,i)" v-else>
              <img src="../assets/img/企业微信1.png" alt="">
            </div>
          </template>
        </div>
      </template>

    </div>
  </div>
</template>
<script> 
import { initWxConfig, wxAgentConfig } from '../uilts/wx-js-sdk/wxConfig'
import { ScorllMixin } from '@/uilts/mixins';
import communication from "../uilts/communication";

export default {
  props: ["padding", "list", "users", "userMaps", "label", "totals", 'ramdom'], //props接收
  mixins: [ScorllMixin],
  data() {
    return {
      searchData: '',
      route: '',
      userIds: [],
      chatuserID: "",
    }
  },
  methods: {
    // searchChange() {
    // },
    handItemClick(data, index) {
      sessionStorage.setItem('tabNum', 0);
      sessionStorage.setItem('_crm_info', JSON.stringify(data))
      sessionStorage.setItem('ManualIdx', index) // 记录点击的数据索引，为了列表更新数据用
      this.$router.push({ name: 'LinkDetailed' });
    },
    linkmanClick(id, phone, idx) {  // 点击拉去联系人
      console.log(id, phone, idx, 'linkmanClick')
      wx.invoke('selectExternalContact', {
        "filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
      }, (res) => {console.log(res,'selectExternalContact')
        if (res.userIds.length > 1) {  // 如果多选了，提示他，只能选择一个外部联系人
          this.$emit('userIDLength', 2)
          return;
        } else {   // 如果单选了，保存当前userid
          this.chatuserID = res.userIds[0];
          this.$emit('userIdSave', res.userIds[0], id, phone, idx)  // 一参是WXid  二参是 当前id ，手机号，
        }
        if (res.err_msg == "selectExternalContact:ok") {
          console.log(res, '成功')
        } else {
          console.log(res, '失败')
          //错误处理
          if (err_msg.indexOf('nopermission') !== -1) {
            this.$toast.fail('请联系管理员开通客户联系权限')
          }
        }
      });
    },
    openChat(wxCrmId) {
      console.log(wxCrmId,'对话')
      wx.openEnterpriseChat({ // 调用对话
        // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
        userIds: '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        externalUserIds: wxCrmId, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
        groupName: '',  // 会话名称。单聊时该参数传入空字符串""即可。
        chatId: "", // 若要打开已有会话，需指定此参数。如果是新建会话，chatId必须为空串
        success: function (res) {
          console.log(res,'success')
          var chatId = res.chatId; //返回当前群聊ID，仅当使用agentConfig注入该接口权限时才返回chatId
          // 回调
        },
        fail: function (res) {
          console.log(res,'fail')
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
    callTel(id) {
      console.log(id)
      communication.$emit('callTel', id); //触发home 页面方法，目的是为了更新列表数据
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
      // console.log(this.totals ,this.current);
      if (this.totals < this.current) return;
      if (this.current !== 1) {
        console.log('31');
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
@FColor: #aaaaaa;
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
  padding-top: 48px;
  .nav-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 1px;
    height: 88px;
    background: #fff;
    padding: 5px 12px;
    align-items: center;
    box-sizing: border-box;
    .nav-fir {
      // margin-bottom: .1rem;
      display: flex;
      .nickN {
        color: #3b3b3b;
        font-size: 15px;
        font-weight: 800;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex-shrink: 0;
        word-break: break-all;
        max-width: 60%;
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
      height: 35px;
      width: 35px;
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
  margin-left: 5px;
}
.nav-comp {
  color: @FColor;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80%;
  // margin-bottom: .1rem;
}
</style>