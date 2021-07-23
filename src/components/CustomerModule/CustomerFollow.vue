<template>
  <div class="CustomerFollow">
    <!-- <div class="follTit">
      <div style="margin-left: 15px">
        <img src="../../assets/img/pencil3.png" class="addicon" alt="" />
        <div style="color:'#5f97ae'">
          <span style="padding-top: 2px;color: #5f97ae;" @click="Tabclick(1)">添加记录</span>
        </div>
      </div>
      <div class="FollIcon">
        <a @click="Tabclick(3)">
          <van-icon name="phone-o" size="0.46rem" style="margin-right: 15px" />
        </a>
      </div>
    </div> -->
    <div
      @scroll="scrollEventselect"
      :style="{ height: height, overflowY: 'scroll' }"
    >
      <div class="follCont" v-if="follList.length > 0">
        <div v-for="(item, index) in follList" :key="index" class="follMain">
          <div class="time">
            <icon
              :name="item.type + ''"
              :w="20"
              :height="20"
              style="background: #eee; border-radius: 50%"
            ></icon>
            <div class="wire"></div>
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
                >-->
                  <a
                    v-if="
                      item.url &&
                      item.callRecordUrl &&
                      item.callRecordUrl !== ''
                    "
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
              </div> -->
                <!-- <van-icon size="20px" color="#AAA" name="volume-o" /> -->
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
        image-size="40px"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
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
        <audio
          :src="call.url"
          controls="controls"
          preload="auto"
          class="audio"
        />
        <!-- controlslist="nodownload" -->
      </van-popup>
    </div>
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
  props: ['height', 'userInfo'],
  data() {
    return {
      follList: [],
      followUserMap: {},
      current: 1,
      empty: false,
      limits: "",
      total: 0,
      timer: null,
      call: {
        pop: false,
        title: '',
        url: ''
      }
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
      console.log(crmInfo, 'crmInfocrmInfo')
      let signature = generateSignature3(crmInfo, this.userInfo.itr_compid, this.userInfo.itr_userid, timeout, nonce);
      this.$get('/api/request/itr/comp/customer/record/result', {
        params: {
          pid: crmInfo,
          compId: this.userInfo.itr_compid,
          userId: this.userInfo.itr_userid,
          nonce: nonce,
          timeout: timeout,
          signature: signature,
          current: this.current || 1,
          size: 20,
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
    ImgClick(src) {
      ImagePreview({
        images: src,
        closeable: true,
      });
    },
    handelClickMadiaPlay(item) {
      this.call.pop = true;
    },
    callRecord(data) { // 查看录音弹框
      this.call.pop = true;
      this.call.title = this.followUserMap[data.itrId].nickname + '于 ' + data.createTime + ' 呼叫' + data.crmName;
      this.call.url = data.callRecordUrl;
    },
    Tabclick(data) {
      console.log(data)
      // Tabclick(data);
      this.$emit('onTavclick', data)
    }
  },
  created() {
    this.timer = setInterval(() => {
      if (this.userInfo && sessionStorage.getItem('linkmanId')) { // 当有内容时候在请求数据;
        this.getAgendaList()
        clearInterval(this.timer);
      }
    }, 100)
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

};
</script>

<style lang="less" scoped>
.CustomerFollow {
  // position: relative;
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
        flex: 1;
        // margin-left: 0.2rem;
        .text {
          background: rgb(243, 243, 243);
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
  .audio {
    height: 35px;
    width: 100%;
    outline: none;
  }
  .wire {
    width: 1px;
    height: calc(100% - 35px);
    background: rgb(193 190 190);
    margin: 0 auto;
    margin-top: 5px;
  }
  audio::-webkit-media-controls-enclosure {
    background: #eee;
    border-radius: 4px;
  }
  .media-controls-container,
  .media-controls-container * {
    background: #fff;
    border-radius: 4px;
  }
  audio::-webkit-media-controls-play-button {
    height: 15px;
    width: 15px;
    min-width: 22px;
    border-radius: 50%;
    flex-basis: 22px;
  }

  // 音量隐藏
  audio::-webkit-media-controls-volume-control-container {
    display: none;
  }

  audio::-webkit-media-controls-current-time-display {
    order: 1; //设置弹性盒对象元素的顺序
    color: #000;
    text-shadow: unset;
  }

  audio::-webkit-media-controls-time-remaining-display {
    order: 2;
    color: rgba(0, 0, 0, 0.6);
    text-shadow: unset;
  }
  .follTit {
    display: flex;
    background: rgb(249, 249, 249);
    justify-content: space-between;
    // margin-top: 0.2rem;
    height: 0.8rem;
    align-items: center;
    color: #468af1;
    height: 0.6rem;
    border-bottom: 8px solid rgb(249, 249, 249);
    border-top: 8px solid rgb(249, 249, 249);
    // position: absolute;
    // left: 0;
    // width: 100%;
    // top: 0;
    div {
      display: flex;
      i {
        margin-right: 0.2rem;
        margin-top: -2px;
      }
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
  .addicon {
    width: 0.32rem;
    height: 0.3rem;
    margin-right: 5px;
  }
}
</style>