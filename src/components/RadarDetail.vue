<template>
  <div class="RadarDetail">
    <div class="main">
      <div class='visitor-info'>
        <span class='promote line2'>推广人员 : {{visitorInfo.toName}}({{visitorInfo.to}})</span>
        <span class='name line1'>访客信息 : {{visitorInfo.nickname}}</span>
        <div catchtap="handelClickPhone" class='name line1'>访客电话 : {{visitorInfo.id.length==11?visitorInfo.id:'无'}}</div>
      </div>
    </div>
    <div class="visitor_radar">
      <div class="i-sticky-demo">
        <div v-for="(item,index) in dateMap" :key="index">
          <div class='date-title'>{{index}} </div>
          <div v-for="(items,idxs) in item" :key="idxs" class="i-sticky-demo-item"><span>{{items.date}} </span><span>{{items.description}}</span></div>
        </div>
      </div>
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
      dateMap: {}
    }
  },
  created() {
    this.visitorInfo = JSON.parse(sessionStorage.getItem('visitor_info'))  // 基本数据回显、
    this.loadingRadarDetail();
  },
  methods: {
    loadingRadarDetail() {
      let that = this;
      let to = JSON.parse(sessionStorage.getItem('visitor_info'))?.to;
      let id = JSON.parse(sessionStorage.getItem('visitor_info'))?.id;
      let signature = generateSignature3(timeout, nonce);
      let dateMap = {};
      this.$get('/api/request/itr/comp/trajectory/detail', {
        params: {
          from: id,
          to: to,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          current: 1
        },
      })
        .then(function (res) {
          console.log(res);
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
          }
          console.log(dateMap);
          that.dateMap = dateMap;
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
    background-color: #fff;
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
    }
  }
  .visitor_radar {
    padding: 0 10px;

    margin-top: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .date-title {
      font-size: 20px;
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