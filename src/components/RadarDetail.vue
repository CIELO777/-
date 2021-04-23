<template>
  <div class="RadarDetail">
    <div class="main">
      <div class="visitor-info">
        <span class="promote line2"
          >推广人员 : {{ visitorInfo.toName }}({{ visitorInfo.to }})</span
        >
        <span class="name line1">访客信息 : {{ visitorInfo.nickname }}</span>
        <div catchtap="handelClickPhone" class="name line1">
          访客电话 : {{ visitorInfo.id.length == 11 ? visitorInfo.id : "无" }}
        </div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          class="vanList"
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-span="没有更多了"
          @load="onLoad"
        >
          <div class="visitor_radar">
            <div class="i-sticky-demo">
              <div v-for="(item, index) in dateMap" :key="index">
                <div class="date-title">{{ index }}</div>
                <div
                  v-for="(items, idxs) in item"
                  :key="idxs"
                  class="i-sticky-demo-item"
                >
                  <span>{{ items.date }} </span
                  ><span>{{ items.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <!-- <van-empty
          v-else
          image="https://img.yzcdn.cn/vant/custom-empty-image.png"
          description="暂无相关消息"
        /> -->
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: 'RadarDetail',
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      visitorInfo: {},
      optMap: {
        "0": "正在访问",
        "1": "浏览了"
      },
      pageTypeMap: {
        "0": "",
        "1": "你的文章",
        "2": "你的店铺",
        "3": "你的商品详情页",
        "4": "你的商品分类页",
        "5": "",
        "6": "",
        "7": "",
        "8": "",
        "9": "",
      },
      sourceTypeMap: {
        "0": "H5",
        "1": "乐语",
        "2": "微信",
        "3": "QQ",
        "4": "微博",
        "5": "微信朋友圈",
        "6": "微信小程序",
        "7": "短信",
        "8": "邮箱",
        "9": "QQ空间",
        "10": "二维码",
        "11": "钉钉",
        "12": "百度小程序",
        "13": "海报",
        "14": "字节小程序",
      },
      start: "【",
      end: "】",
      dateMap: {},
      total: 0,
      current: 1
    }
  },
  created() {
    this.visitorInfo = JSON.parse(sessionStorage.getItem('visitor_info'))  // 基本数据回显、
    this.loadingRadarDetail();
  },
  methods: {
    onRefresh() {
      // this.$emit('refreshEmpty')
      console.log('1111')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.loadingRadarDetail();
    },
    onLoad() {
      if (this.current >= this.total) {
        this.finished = true;
        return;
      }
      this.current = ++this.current;
      this.loadingRadarDetail();
      setTimeout(() => {
        this.loading = false;
      }, 1800)
    },
    loadingRadarDetail(cur) {
      let that = this;
      let to = JSON.parse(sessionStorage.getItem('visitor_info'))?.to;
      let id = JSON.parse(sessionStorage.getItem('visitor_info'))?.id;
      let signature = generateSignature3(timeout, nonce);
      let dateMap = this.dateMap;
      console.log(dateMap)
      this.$get('/api/request/itr/comp/trajectory/detail', {
        params: {
          from: id,
          to: to,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          current: this.current
        },
      })
        .then(function (res) {
          if (!res.error) {
            res.data.forEach(item => {
              let createTimeStr = item.createTime;
              let key = createTimeStr.split(" ")[0].substring(5) + "日";
              key = key.replace("-", "月");
              if (!dateMap[key]) {
                dateMap[key] = [];
              }
              item.date = createTimeStr.split(" ")[1].substring(0, 5) + "分";
              item.status = 0;
              if (item.leaveTime) {
                item.status = 1;
              }
              item.description = that.optMap[item.status] + that.getDescription(item.description, item.pageType) + that.getDurationTime(item.createTime, item.leaveTime, item.sourceType);
              if (item.description) {
                item.description = item.description.replace(/undefined/g, '');
              }
              dateMap[key].push(item);
            })
            that.dateMap = JSON.parse(JSON.stringify(dateMap));
            that.total = res.totalPageCount;
          }

        })
        .catch(function (error) {
          console.log(error);
        });

    },
    getDescription(title, pageType) {
      return this.pageTypeMap[pageType] + this.start + title + this.end;
    },
    getDurationTime(startTime, endTime, type) {
      let result = "";
      var e = new RegExp("-", "g");
      if (endTime) {
        let start = Date.parse(new Date(startTime)) || Date.parse(new Date(startTime.replace(e, "/")))
        let end = Date.parse(new Date(endTime)) || Date.parse(new Date(endTime.replace(e, "/")))
        let time = (end - start) / 1000;
        result += "停留了 " + this.timeCycle(time);
      }
      result += "来自" + this.sourceTypeMap[type];
      return result;
    },
    timeCycle(time) {
      if (time < 60) {
        return time + "秒 ";
      }
      if (time % 60 >= 0) {
        return Math.floor(time / 60) + "分 "
      }
      return time;
    },
  },
  activated() {
    console.log('actied')

  }
}
</script>

<style lang="less" scoped>
.RadarDetail {
  margin-bottom: 50px;
  width: 100vw;
  background: #f1f1f1;
  .main {
    display: flex;
    flex-direction: row;
    background-color: #eee;
    justify-items: center;
    align-items: center;
    .visitor-info {
      background-color: #fff;
      padding: 10px;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      line-height: 0.5rem;
      color: #000;
      flex: 1;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      z-index: 9;
    }
  }
  .visitor_radar {
    padding: 0 10px;
    margin-top: 105px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    width: 100vw;
    box-sizing: border-box;
    .date-title {
      font-size: 0.28rem;
      font-weight: bold;
      padding: 7px 0;
    }
    .i-sticky-demo-item {
      font-size: 14px;
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 5px;
      span:first-child {
        flex-shrink: 0;
        margin-right: 5px;
      }
      span {
        line-height: 20px;
      }
    }
  }
}
</style>