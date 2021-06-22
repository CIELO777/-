<template>
  <div
    class="HaringViews"
    :style="{
      'padding-top':
        $route.name === 'HaringDetail' || UI == '0' ? '60px' : '0px',
    }"
  >
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-if="datas.length > 0"
        class="vanList"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-span="没有更多了"
        @load="onLoad"
      >
        <div class="btc">
          <img :src="userInfo.background" class="imgback" alt="" />
          <div class="imghead">
            <span class="fontS">{{ userInfo.nick }}</span>
            <img
              :src="userInfo.portrait"
              alt=""
              @click="skip(userInfo.userid)"
            />
          </div>
        </div>
        <div
          class="historyMessAge"
          v-if="$route.name == 'HaiRing'"
          @click="historyNews"
        >
          <!-- <span>查看历史消息</span> -->
        </div>
        <div class="card" v-for="(item, index1) in datas" :key="index1">
          <div class="head">
            <div class="portrait" @click="skip(item)">
              <img
                mode="widthFix"
                :src="
                  userMap[item.userId].portrait +
                  '?x-oss-process=image/resize,m_fill,h_100,w_100'
                "
              />
            </div>
            <div class="info">
              <div style="margin-right: 60px" class="line1">
                <span>
                  {{
                    userMap[item.userId]
                      ? userMap[item.userId].nickname || userMap.nickname
                      : ""
                  }}</span
                >
                <span
                  v-if="
                    userMap[item.userId]
                      ? userMap[item.userId].approve == 1
                      : false
                  "
                  class="approve"
                  >V</span
                >
                <span
                  v-if="
                    userMap[item.userId]
                      ? userMap[item.userId].member == 1
                      : false
                  "
                  class="member"
                  >会员</span
                >
              </div>
              <div>
                <span>{{ item.createTime }}</span>
              </div>
            </div>
            <!-- <div class="export" @click.stop="handelClickExport(item)">分享</div> -->
          </div>
          <div class="cont">
            <span>{{ item.title }} </span>
          </div>
          <div
            @click="handelClickFullText(index1)"
            :key="index1"
            class="full-text qs-size-24"
            v-if="item.haveMore && item.full"
          >
            全文
          </div>
          <div
            @click="handelClickFullText(index1)"
            :key="index1"
            class="full-text qs-size-24"
            v-if="item.haveMore && !item.full"
          >
            收起
          </div>
          <div class="photo-list" v-if="item.photos.length > 0">
            <div :class="item.photos.length > 1 ? 'cont' : 'cont one'">
              <div class="item" v-for="(i, index) in item.photos" :key="index">
                <img
                  @click="preview(i)"
                  :src="i + '?x-oss-process=image/resize,m_fill,h_400,w_400'"
                  id="girlImg"
                />
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <van-empty
        v-else-if="empty"
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
    </van-pull-refresh>
    <share
      :ShareContents="ShareContent"
      v-show="showShare"
      :showShares.sync="showShare"
    ></share>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import FileSaver from 'file-saver';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
import local from '../../uilts/localStorage';
import share from '../../components/share'

let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "HaringViews",
  components: { share },
  props: ['datas', 'userMap', 'current', 'total', 'states', 'comment', 'thumb', 'userInfo', 'UI', 'empty'],
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      showShare: false,
      ShareContent: {},
      ShareContent: {},
      HistroyData: [],
      HistroyUser: {},
    };
  },
  watch: {},
  computed: {},
  methods: {
    skip(item) {
      console.log(typeof (item))
      item = typeof (item) === 'object' ? item.userId : item;
      this.$router.push({
        name: 'HaringDetail',
        params: {
          id: item
        }
      })
    },
    handelClickExport(item) {
      // console.log(item)
      // console.log(item)
      // this.showShare = true;
      // this.ShareContent = {
      //   title: item.title,
      //   imgUrl: item.thumb,
      //   desc: item.description,
      //   url: item.url
      // }
      var img = document.getElementById('girlImg'); // 获取要下载的图片
      var url = img.src;
      // console.log(url);
      // let blob = new Blob([url], {
      //   type: "image/jpeg/jpg"
      // });
      // this.downLoad(url, "image.jpg")
      // FileSaver.saveAs(url, "image.jpg");
      // FileSaver.saveAs(blob, 'filename.jpg');
    },
    handelClickFullText(index) {
      let title = this.datas[index].title;
      this.datas[index].full = !this.datas[index].full;
      this.datas[index].title = this.datas[index].allCont;
      this.datas[index].allCont = title;
    },
    preview(src) {
      ImagePreview({
        images: [src],
        closeable: true,
      });
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.onLoad();
      setTimeout(() => {
        this.loading = false;
      }, 1800)
    },
    onLoad() {
      if (this.current >= this.total) {
        this.finished = true;
        return;
      }
      if (this.states == 'list') {
        this.$emit('mySonChagne', this.current) // 触发爷组件方法更新数据下一页
      } else {
        let cur = ++this.current;
        this.$emit('onSearch', cur) // 触发爷组件方法更新数据下一页

      }
      setTimeout(() => {
        this.loading = false;
      }, 1800)
    },

    historyNews() {
      this.$router.push({
        path: '/haringHistroy'
      })
    },
    // 下载的方法
    downLoad(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', '*');
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        var _dataURL = canvas.toDataURL('image/png'); //得到图片的base64编码数据

        var blob_ = this.dataURLtoBlob(_dataURL); // 用到Blob是因为图片文件过大时，在一部风浏览器上会下载失败，而Blob就不会

        var url = {
          name: name || "图片.png", // 图片名称不需要加.png后缀名
          src: blob_
        };

        if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
          navigator.msSaveBlob(url.src, url.name);//filename文件名包括扩展名，下载路径为浏览器默认路径
        } else {
          var link = document.createElement("a");
          link.setAttribute("href", window.URL.createObjectURL(url.src));
          link.setAttribute("download", url.name + '.png');
          document.body.appendChild(link);
          link.click();
        }
      };
      image.src = imgsrc;
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

  },
};
</script>

<style lang="less" scoped>
.HaringViews {
  font-size: 0.3rem;
  padding-top: 60px;
  .card {
    background-color: #fff;
    margin: 10px;
    border-bottom: 1px #f1f1f1 solid;
  }
  .head {
    display: flex;
    flex-direction: row;
    position: relative;
  }
  .cont {
    font-size: 0.28rem;
    // margin: 10px 20px 10px 50px;
    margin: 0rem 0.4rem 0.3rem 1rem;
    // line-height: 50rpx;
    span {
      line-height: 0.5rem;
    }
  }
  .portrait img {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.12rem;
    margin-right: 0.2rem;
  }
  .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    font-size: 0.24rem;
    line-height: 0.4rem;
    .line1 {
      display: flex;
      align-items: center;
    }
  }
  .export {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 10px;
    font-size: 0.24rem;
    color: orange;
    border: 1px orange solid;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  .photo-list .cont {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
  .photo-list .one .item {
    // width: 50%;
    img {
      height: 3.24rem;
      object-fit: cover;
    }
  }
  .cont div {
    margin: 0px 0.1rem 0px 0;
    width: calc(33% - 5px);
    position: relative;
    height: 0;
    padding-bottom: 33%;
    overflow: hidden;
    margin-bottom: 0.1rem;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .full-text {
    margin-left: 1rem;
    color: #4a5185;
    margin-bottom: 10px;
  }
  .qs-size-24 {
    font-size: 0.24rem;
  }
  .member {
    background-color: #f7831c;
    color: #fff;
    font-size: 0.22rem !important;
    display: inline-block;
    padding: 2px 3px;
    line-height: 0.24rem !important;
    border-radius: 2px;
    text-align: center;
    margin-left: 5px;
  }
  .btc {
    height: 200px;
    position: relative;
    .imghead {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      position: absolute;
      right: 1.5rem;
      bottom: -15px;
      display: flex;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .fontS {
        font-size: 0.3rem;
        white-space: nowrap;
        align-self: center;
        color: #fff;
        margin-right: 0.1rem;
      }
    }
    .imgback {
      height: 200px;
      width: 100%;
      object-fit: cover;
    }
  }
  /deep/ .vanList .card:nth-child(2) {
    padding-top: 60px;
  }
  .historyMessAge {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      width: 32%;
      height: 35px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.28rem;
      border-radius: 8px;
    }
  }
  .approve {
    font-size: 14px;
    font-style: italic;
    font-weight: bold !important;
    color: #f2711c !important;
    margin-left: 0.06rem;
  }
}
</style>