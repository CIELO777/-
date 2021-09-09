<template>
  <div class="ChatRecord">
    <van-list
      v-model="loading"
      :finished="finished"
      :immediate-check="false"
      @load="onLoad"
      class="chatList"
      v-if="list.length > 0"
    >
      <template v-for="(item, index) in list">
        <div
          :key="index"
          class="card"
          :style="{
            flexDirection: openId == item.from ? 'row-reverse' : 'row',
          }"
        >
          <!-- 文字 -->
          <template v-if="item.msgType == 'text'">
            <img
              :src="
                openId == item.from
                  ? user[item.from].avatar || defaultImg
                  : user[item.from].avatar || defaultImg
              "
              alt=""
              class="head"
            />
            <div
              :class="openId == item.from ? 'chatBox' : 'chatBoxL'"
              :style="{
                marginLeft: openId == item.from ? '' : '10px',
                marginRight: openId == item.from ? '10px' : '',
                background: openId == item.from ? '#C5E9FF' : '#eee',
              }"
            >
              {{ item.content }}
            </div>
          </template>
          <!-- 图片 -->
          <template v-if="item.msgType == 'image'">
            <img
              :src="
                openId == item.from
                  ? user[item.from].avatar || defaultImg
                  : user[item.from].avatar || defaultImg
              "
              alt=""
              class="head"
            />
            <div
              class="ImgBack"
              @click="ClickImgBack(item.itrFileUrl)"
              :style="{
                backgroundImage: 'url(' + item.itrFileUrl + ') ',
                backgroundPositionX: openId == item.from ? 'right' : 'left',
                marginLeft: openId == item.from ? '' : '10px',
                marginRight: openId == item.from ? '10px' : '',
              }"
            ></div>
          </template>
          <!-- 视频 -->
          <template v-if="item.msgType == 'video'">
            <img
              :src="
                openId == item.from
                  ? user[item.from].avatar || defaultImg
                  : user[item.from].avatar || defaultImg
              "
              alt=""
              class="head"
            />
            <div
              @click="VedioClick(item.itrFileUrl + '?frame=1')"
              class="mack"
              :style="{
                left: openId == item.from ? '3.2rem' : '10px',
                right: openId == item.from ? '10px' : '1.35rem',
                top: '10px',
              }"
            >
              <img
                src="../assets/img/fullWhite.png"
                alt=""
                style="width: 0.4rem; height: 0.4rem"
              />
            </div>
            <iframe
              :src="item.itrFileUrl + '?frame=1'"
              height="300"
              width="500"
              class="iframeS"
              scrolling="auto"
              :style="{
                marginLeft: openId == item.from ? '' : '10px',
                marginRight: openId == item.from ? '10px' : '',
              }"
            >
            </iframe>
          </template>
          <!-- 语音 -->
          <template v-if="item.msgType == 'voice'">
            <img
              :src="
                openId == item.from
                  ? user[item.from].avatar || defaultImg
                  : user[item.from].avatar || defaultImg
              "
              alt=""
              class="head"
            />
            <audio
              @play="onPlay(item.auidoInfo)"
              @error="onError(item, index)"
              @pause="onPause"
              @timeupdate="updateTime"
              v-if="item.auidoInfo"
              :src="item.auidoInfo"
              controls="false"
              controlslist="nodownload"
              :style="{
                marginLeft: openId == item.from ? '10px' : '3px',
                marginRight: openId == item.from ? '3px' : '10px',
              }"
            />
            <van-icon
              name="replay"
              v-show="item.error"
              @click="errorUpdate(item)"
            />
          </template>
        </div>
      </template>
    </van-list>
    <van-empty
      image-size="40px"
      v-else-if="empty"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
    />
    <van-popup
      closeable
      v-model="show"
      :style="{ height: '100%', width: '100%' }"
    >
      <iframe
        :src="videoSrc"
        height="300"
        width="500"
        class="iframePop"
        scrolling="auto"
      >
      </iframe>
    </van-popup>
  </div>
</template>
<script>
import { ImagePreview } from 'vant';

import {
  generateSignature3, generateTimeout,
  generateNonce,
  generateSignature8,
  generateSignature4
} from '../uilts/tools';
import local from '../uilts/localStorage';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "ChatRecord",
  components: {},
  props: ['userInfo'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      fromUser: {},
      toUser: {},
      openId: '',
      imgInfo: {}, // 存图片的宽高信息
      show: false,
      videoSrc: '',
      total: 0,
      current: 1,
      fileDuration: 0,
      surplus: true,
      empty: false,
      user: {},
      defaultImg: 'http://ego-file.soperson.com/itver/13522008806/201712271708/85671523589501951.png'
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLoad() {
      if (this.current >= this.total) {
        this.finished = true;
        return;
      }
      this.current = ++this.current;

      // 异步更新数据
      this.getList();
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
    getList() {
      let wxCrmId = this.$route.name == 'ChatCustomer' ? sessionStorage.getItem('wxcrmId') : JSON.parse(sessionStorage.getItem('_crm_info')).wxCrmId;
      this.openId = sessionStorage.getItem('openId');
      let from = sessionStorage.getItem('bind_UserID');
      let compId = sessionStorage.getItem('bind_compId');
      let itrId = JSON.parse(sessionStorage.getItem('userinfo')).id;
      let signature = generateSignature4(timeout, nonce, itrId);
      this.$get("/work/session/result", {
        params: {
          from: from || 'SongTianYu',
          to: wxCrmId || 'wmmmFVEAAAQbwte-CPVAc-zHKbGgErzA',
          compId: compId || 40000013,
          current: this.current,
          size: 20,
          timeout,
          nonce,
          signature
        },
      })
        .then((res) => {
          if (res.code === 200 && res.msg === 'success' && res.data.data.length > 0) {
            res.data.data.forEach(async item => {
              if (item.msgType == 'voice') {
                item.auidoInfo = await this.getVideoInfo(item.itrFileId);
                this.$set(item, 'item.auidoInfo', item.auidoInfo);
              }
            })
            this.list = this.current == 1 ? res.data.data : this.list.concat(res.data.data);
            this.total = res.data.totalPageCount;
            this.user = res.data.user;
            // this.fromUser = res.data.fromUser;
            // this.toUser = res.data.toUser;
            if (this.list.length == 0) this.empty = true; //如果数据大于0，就显示空信息
            window.document.title = res.data.toUser?.nickname ? `与${res.data.toUser.nickname}的会话记录` : '会话记录';
          } else {
            this.finished = true;
            this.empty = true;
          }
        })
        .catch((error) => {
          this.empty = true;
          console.log(error);
        });
    },
    updateList() { // 同步消息
      let CorpId = sessionStorage.getItem('CorpId') || 'wxa9317077abcb6273';
      let signature = generateSignature4(timeout, nonce);
      this.$get("/work/session/sync", {
        params: {
          wxCompId: CorpId,
          nonce,
          timeout,
          signature,
        },
      })
        .then((res) => {
          // console.log(res);
        })
        .catch(function (error) {
        });
    },
    getImgSize(url) {
      return new Promise((resolve, reject) => {
        let imgObj = new Image()
        imgObj.src = url
        imgObj.onload = () => {
          resolve({
            width: imgObj.width,
            height: imgObj.height
          })
        }
      })
    },
    ClickImgBack(src) { // 预览图片
      ImagePreview({
        images: [
          src
        ],
        closeable: true,
      });
    },
    VedioClick(src) {
      this.show = true;
      this.videoSrc = src;
    },
    getVideoInfo(id) {
      let signature = generateSignature4(id, this.$U, timeout, nonce);
      return new Promise((resolve, reject) => {
        this.$get("/aliyun/remote/vod/detail", {
          params: {
            id: id,
            playUrlState: 1,
            userId: this.$U,
            nonce,
            timeout,
            signature,
          },
        }).then((res) => {
          resolve(res.playUrl);
        })
          .catch((error) => {
            reject(error)
          });
      })
    },
    onPlay(data) {
      var audio = document.querySelector('audio');
      console.log(this.surplus);
      if (this.surplus) { // 当前用户有流量正常计费;
        this.billing(data)
      } else {
        audio.pause();
        this.$toast('当前账户流量不足，无法播放语音')
      }
    },
    billing(data) {  // 计费
      let signature = generateSignature4(this.$uuid.v1(), this.$C, timeout, nonce)
      let param = new URLSearchParams();
      param.append("id", this.$uuid.v1());
      param.append("title", data.title);
      param.append("description", data.description);
      param.append("thumb", data.thumb);
      param.append("fileId", data.id);
      param.append("fileDuration", data.fileDuration);
      param.append("fileSize", data.fileSize);
      param.append("fileDurations", data.fileDuration);
      param.append("visitorId", sessionStorage.getItem('openId'));
      param.append("visitorType", 1);
      param.append("compId", this.$C);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      this.$post1('/aliyun/vod/billing', param
      ).then((res) => { })
        .catch((error) => {
          console.log(error);
        });
    },
    balance() { // 查询余额
      var data = {};
      let signature = '';
      if (this.$route.name == 'ChatCustomer') {
        signature = generateSignature4(this.userInfo.itr_external_userid, this.userInfo.itr_compid, nonce, timeout)
        data = {
          userId: this.userInfo.itr_external_userid,
          compId: this.userInfo.itr_compid,
          nonce,
          timeout,
          signature,
        }
      } else {
        signature = generateSignature4(this.$U, this.$C, nonce, timeout)
        data = {
          userId: this.$U,
          compId: this.$C,
          nonce,
          timeout,
          signature,
        };
      }
      this.$get("/aliyun/remote/base/flow", {
        params: data,
      }).then((res) => {
        console.log(res);
        if (!res.surplus || res.surplus == 0) { // 余额不足
          this.surplus = false;
        }
      })
        .catch((error) => {
          console.log(error);
        });
    },
    onError(item, index) {
      this.$toast('部分消息拉取失败，请手动拉取', item, index);
      this.list[index].error = true;
    },
    errorUpdate(item) { // 手动同步
      this.$get("/work/session/upload", {
        params: {
          msgId: item.msgId,
        },
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onPause() {
      console.log('暂停了');
    },
    updateTime(e) {
      // console.log(e.target.currentTime);
      this.fileDuration = e.target.currentTime * 1000;
    },
 
  },
  created() {
    this.getList() // 拉数据
    this.openId = sessionStorage.getItem('bind_UserID');
    // this.balance() // 判断是否有剩余流量
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.ChatRecord {
  font-size: 0.32rem;
  // background: #eee;
  padding-top: 0.2rem;
  .card {
    display: flex;
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
    align-items: center;
    position: relative;
    .chatBox {
      height: 100%;
      //   line-height: 40px;
      font-size: 13px;
      max-width: 80%;
      color: #000;
      padding: 0.22rem 0.2rem;
      word-break: break-all;
      line-height: 0.36rem;
      border-radius: 0.2rem;
      position: relative;
    }
    .chatBox::before {
      content: "";
      position: absolute;
      top: 50%;
      right: -5px;
      width: 10px;
      height: 10px;
      //   margin-top: -10px;
      background: inherit;
      /*自动继承父元素的背景*/
      transform: translateY(-50%) rotate(45deg);
    }
    .chatBoxL {
      height: 100%;
      //   line-height: 40px;
      font-size: 13px;
      max-width: 80%;
      color: #000;
      padding: 0.22rem 0.2rem;
      word-break: break-all;
      line-height: 0.36rem;
      border-radius: 0.15rem;
      position: relative;
      background: #eee;
    }
    .chatBoxL::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -5px;
      width: 10px;
      height: 10px;
      //   margin-top: -10px;
      background: inherit;
      /*自动继承父元素的背景*/

      transform: translateY(-50%) rotate(45deg);
    }
  }
  .head {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.15rem;
  }
  .ImgBack {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 2.1rem;
    height: 3.16rem;
    // border: 1px solid rgb(117, 113, 113);
    // background-color: rgb(68, 67, 67);
  }
  .iframeS {
    height: 4rem;
    width: 2.5rem;
  }
  .mack {
    position: absolute;
    // right: 10px;
    // top: 10px;
    // width: 10px;
    // height: 10px;
  }
  .iframePop {
    width: 100vw;
    height: 100vh;
  }
  audio {
    width: 60%;
    height: 40px;
    outline: none;
    // filter: invert(10); //c3 filter(滤镜) 属性
  }

  audio::-webkit-media-controls-enclosure {
    background: rgb(197, 233, 255);
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
  .chatList {
    // min-height: 100vh;
    padding-bottom: 25px;
  }
}
</style>