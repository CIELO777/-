<template>
  <div class="dynamic">
    <div
      class="follCont"
      v-if="dynamicList.length > 0"
      @scroll="scrollEventselect"
      :style="{ maxHeight: '600px', overflowY: 'auto' }"
    >
      <div v-for="(item, index) in dynamicList" :key="index" class="follMain">
        <!-- {{ item }} -->
        <div class="time">
          <icon
            :name="0 + ''"
            :w="15"
            :height="15"
            style="background: #eee; border-radius: 50%"
          ></icon>
          <div class="wire"></div>
        </div>
        <div class="content">
          <div class="text">
            <p class="headValue">
              {{ item.changeTypeback }}
            </p>
            <span
              v-if="
                item.changeType == 'add_external_contact' ||
                item.changeType == 'del_external_contact' ||
                item.changeType == 'edit_external_contact'
              "
            >
              {{ item.username }} {{ item.changeTypeback }}
              {{ item.externalUsername }}
            </span>
            <span v-else-if="item.changeType == 'del_follow_user'">
              {{ item.externalUsername }} 流失客户
              {{ item.username }}
            </span>
            <span v-else-if="item.changeType == 'msg_audit_approved'">
              {{ item.externalUsername }}
              客户同意进行{{ item.changeTypeback }}
            </span>
          </div>
          <div class="info">{{ item.createTime }}</div>
        </div>
      </div>
    </div>
    <van-empty
      v-else-if="empty"
      image-size="40px"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
    />
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature4 } from '../../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
export default {
  name: "dynamic",
  components: {},
  props: ['userInfo'],
  data() {
    return {
      dynamicList: [],
      empty: false,
      total: 0,
      current: 1,
    };
  },
  watch: {},
  computed: {},
  methods: {
    scrollEventselect() {
      let read = document.querySelector('.follCont')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (parseInt(scrollTop) + windowHeight == scrollHeight && scrollTop > 15) {
        console.log('到底',);
        if (this.total <= this.current) return;
        this.current = ++this.current;
        this.getdynamic()
      }
    },
    getdynamic() { // 动态列表拉取
      let compId = sessionStorage.getItem('bind_compId') || 40007760;
      let wxcrmId = sessionStorage.getItem('wxcrmId') || 'wmoqMGCgAA5ozhmAajLTV-IZ2tjbxtnA' || 'wmoqMGCgAAV8bDC4Zr69FX8z1pKOziNg';
      let itrId = 13394171296 || 17698931797 || JSON.parse(sessionStorage.getItem('userinfo')).id;
      let signature = generateSignature4(compId, timeout, nonce);
      let param = {
        timeout,
        nonce,
        signature,
        external_userid: wxcrmId,
        compId,
        itrId,
        current: this.current,
      };
      this.$post1("/work/event/result" + '?compId=' + compId + '&timeout=' + timeout + '&nonce=' + nonce + '&signature=' + signature + '&external_userid=' + wxcrmId + '&itrId=' + itrId, param)
        .then((res) => {
          if (res.data && res.data.length) {
            let data = res.data.map(item => {
              return {
                ...item,
                eventback: this.transitionEvent(item.event),
                changeTypeback: this.transitionChangeType(item.changeType),
                usernameback: item.username ? item.username : item.itrId,
                updateDetailback: this.getUpdateDetail(item.updateDetail),
                failReasonback: this.getFailReason(item.failReason),
                joinSceneback: this.getjoinScene(item.joinScene),
                quitSceneback: this.getQuitScene(item.quitScene),
                externalUsername: item.externalUsername.replace(/？/g, "")
              }
            });
            this.dynamicList = this.current == 1 ? data : this.dynamicList.concat(data)
            this.total = res.totalPageCount;
          } else {
            this.empty = true;
          }
        })
        .catch((error) => {
          this.empty = true;
          console.log(error);
        });
    },
    transitionEvent(data) { // 转换
      let target = {
        change_external_contact: '客户变更',
        change_external_chat: '客户群变更',
        change_external_tag: '标签变更',
      }
      return target[data] ? target[data] : ''
    },
    transitionChangeType(data) { // 转换
      let target = {
        add_external_contact: '添加客户',
        edit_external_contact: '编辑客户',
        add_half_external_contact: '外部联系人免验证添加成员',
        del_external_contact: "删除客户",
        del_follow_user: "客户流失",
        transfer_fail: "客户接替失败",
        'change_external_chat/create': "客户群创建",
        'change_external_chat/update': '客户群变更',
        'change_external_chat/dismiss': '客户群解散',
        'change_external_tag/create': '标签创建',
        'change_external_tag/update': '标签变更',
        'change_external_tag/delete': '标签删除',
        'msg_audit_approved': '聊天内容存档'
      }
      return target[data] ? target[data] : ''
    },
    getUpdateDetail(data) {
      let target = {
        add_member: '企业客户变更',
        del_member: '客户群变更',
        change_owner: '企业标签变更',
        change_name: '群名变更',
        change_notice: '群公告变更'
      }
      return target[data] ? target[data] : ''
    },
    getFailReason(data) {
      let target = {
        customer_refused: '客户拒绝',
        customer_limit_exceed: '接替成员的客户数达到上限',
      }
      return target[data] ? target[data] : '';
    },
    getjoinScene(data) {
      let target = {
        '0': '客户拒绝',
        '3': '接替成员的客户数达到上限',
      }
      return target[data] ? target[data] : '';
    },
    getQuitScene(data) {
      let target = {
        '0': '自己退群',
        '1': '群主/群管理员移出',
      }
      return target[data] ? target[data] : '';

    },
  },
  created() {
    // this.getdynamic()
    // return;
    this.timer = setInterval(() => {
      let conditon = sessionStorage.getItem('userinfo') && JSON.parse(sessionStorage.getItem('userinfo')).id && sessionStorage.getItem('wxcrmId');
      if (conditon) { // 当有内容时候在请求数据;
        this.getdynamic()
        clearInterval(this.timer);
      }
    }, 100)
  }
};
</script>

<style lang="less" scoped>
.dynamic {
  padding: 0.3rem 0.2rem;
  max-height: 600px;
  .follCont {
    background-color: #fff;
    padding-bottom: 40px;
    .follMain:first-child {
      // padding-top: 35px;
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
        flex: 1;
        // margin-left: 0.2rem;
        .text {
          // background: rgb(243, 243, 243);
          padding: 0px 5px;
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
          padding: 5px;
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
    .wire {
      width: 1px;
      height: calc(100% - 35px);
      background: rgb(193 190 190);
      margin: 0 auto;
      margin-top: 5px;
    }
  }
  .headValue {
    color: #000;
    font-size: 0.3rem;
    font-weight: 600;
    line-height: 0.48rem;
  }
}
</style>