<template>
  <div
    class="CustomerFollow"
    @scroll="scrollEventselect"
    :style="{ height: height }"
  >
    <div class="follCont" v-if="follList.length > 0">
      <div v-for="(item, index) in follList" :key="index" class="follMain">
        <div class="time">
          <span>{{ item.day }}</span>
          <span>{{ item.month }}月</span>
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
                <!-- <a
                  v-if="item.url != false"
                  @click="JumpOrder(item.url)"
                  style="color: blue"
                  >查看链接</a
                >
                <a
                  v-else-if="item.callRecordUrl && item.callRecordUrl !== ''"
                  @click="callRecord(item)"
                  style="color: blue"
                  >查看通话录音</a
                > -->
              </span>
            </template>
            <div
              v-if="item.type == 0 && item.content && item.content.length > 0"
              class="img-list"
            >
              <template v-for="(itr, i) in item.content">
                <img :key="i" :src="itr" @click="ImgClick(itr)" />
              </template>
            </div>
            <div v-if="item.type == 1">
              <div class="media" @click="handelClickMadiaPlay(item.content)">
                <van-icon size="20px" color="#AAA" name="volume-o" />
              </div>
            </div>
          </div>
          <div class="info">
            <span style="font-size: 12px">{{ item.detTime }}</span>
            <!-- <span v-show="limits" class="user" @click="dele(item.id, item.pid)"
              >删除</span
            > -->
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
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import { generateTimeout, generateNonce, generateSignature3 } from '../../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import local from '../../uilts/localStorage';

export default {
  name: "CustomerFollow",
  components: {},
  props: ['height'],
  data() {
    return {
      follList: [],
      followUserMap: {},
      current: 1,
      empty: false,
      limits: "",
      total: 0,
      timer: null,
    };
  },
  watch: {},
  computed: {},
  methods: {
    fordate(timeArr, time1) { // 时间处理
      timeArr.splice(0, 1)
      timeArr.splice(1, 0, '月')
      timeArr.splice(3, 0, '日')
      let date = timeArr.join('');
      let time2 = time1.match(/(\d{2})\:(\d{2})/)
      return date + time2[0];
    },
    scrollEventselect() {
      let read = document.querySelector('.CustomerFollow')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (parseInt(scrollTop) + windowHeight == scrollHeight && scrollTop > 15) {
        console.log('到底',);
        if (this.total <= this.current) return;
        this.current = ++this.current;
        this.getAgendaList()
      }
    },
    getAgendaList() {  // 获取跟进记录
      let that = this;
      let crmInfo = sessionStorage.getItem('linkmanId');
      let signature = generateSignature3(crmInfo, this.userInfos()?.bind_comp_id1, this.userInfos()?.id, timeout, nonce);
      this.$get('/api/request/itr/comp/customer/record/result', {
        params: {
          pid: crmInfo,
          compId: this.userInfos()?.bind_comp_id1,
          userId: this.userInfos()?.id,
          nonce: nonce,
          timeout: timeout,
          signature: signature,
          current: this.current || 1,
          size: 20,
        },
      })
        .then(function (res) {
          console.log(res,'getAgendaList')
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
            that.follList = that.current == 1 || !that.current ? data : that.follList.concat(data);
            that.followUserMap = { ...that.followUserMap, ...res.itrUser };
            that.total = res.totalPageCount;
            if (that.follList.length == 0) that.empty = true; //如果数据大于0，就显示空信息
          } else {
            that.empty = true; //如果数据大于0，就显示空信息
          }
        })
        .catch(function (error) {
          console.log(error);
          that.$toast.fail('请求失败，请稍后再试');
          that.empty = true; //如果数据大于0，就显示空信息

        });
    },
    chat() { },
    ImgClick(src) {
      ImagePreview([src]);
    },
    userInfos() { // 获取当前联系人信息
      return JSON.parse(sessionStorage.getItem('userinfo'));
    },
    oneselfWxId() { // 获取当前wxID
      return sessionStorage.getItem('openId');
    },
  },
  created() {
    this.timer = setInterval(() => {
      if (this.userInfos()) { // 当有内容时候在请求数据;
        clearInterval(this.timer);
        this.getAgendaList()
      }
    }, 100)
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="less" scoped>
.CustomerFollow {
  overflow-y: scroll;
  .follCont:nth-child(2) {
    // padding-top: 3.4rem;
  }
  .follCont {
    background-color: #fff;
    padding-bottom: 30px;
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
        width: 77%;
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
            img {
              width: 1.2rem;
              height: 1.2rem;
              margin-right: 0.1rem;
              margin-bottom: 0.1rem;
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
  }
  .audio {
    height: 35px;
    width: 100%;
    outline: none;
  }
}
</style>