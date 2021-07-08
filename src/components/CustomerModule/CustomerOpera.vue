<template>
  <div
    class="CustomerOpera"
    :style="{ height: height }"
    @scroll="scrollEventselect"
  >
    <template v-if="Object.keys(optRecordMap).length > 0">
      <div v-for="(item, index) in optRecordMap" :key="index" class="OPeraBox">
        <div class="qs-title bg-color-f0">
          <span>{{ index }}</span>
        </div>
        <div
          class="record-detail"
          v-for="(items, indexs) in item"
          :key="indexs"
        >
          <span>{{ items.accurateTime }}</span>
          <span class="detail"
            >{{ optRecordUserMap[items.creator].nickname }}
          </span>
          <span class="detail qs-blue">{{ items.typeName }}</span>
          <span v-if="items.type != 6 && items.type != 7">
            <span v-if="items.type == 2"> 给 </span>
            <template v-if="items.type == 2">
              <span
                class="qs-green"
                v-for="(it, index) in items.toArr"
                :key="index"
              >
                {{ optRecordUserMap[it].nickname }}</span
              >
            </template>
            <!-- v-if="items.type == 1 || items.type == 0" -->
            <span> 该联系人</span>
          </span>
          <span v-else> 该联系人给 </span>
          <template v-if="items.type == 6 || items.type == 7">
            <span v-for="(i, indx) in items.toArr" :key="indx" class="qs-green"
              >{{ optRecordUserMap[i].nickname }}
            </span>
          </template>
        </div>
      </div>
    </template>
    <van-empty
      v-else-if="empty"
      image-size="40px"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
    />
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../../uilts/tools';
let timeout = generateTimeout()
import local from '../../uilts/localStorage';
let nonce = generateNonce();
export default {
  name: "CustomerOpera",
  components: {},
  props: ['height', 'userInfo'],
  data() {
    return {
      optRecordMap: {},
      optRecordUserMap: {},
      total: 0,
      current: 1,
      empty: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    scrollEventselect() {
      let read = document.querySelector('.CustomerOpera')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (parseInt(scrollTop) + windowHeight == scrollHeight && scrollTop > 15) {
        if (this.current >= this.total) return;
        this.current = ++this.current;
        this.getOperating()
      }
    },
    async getOperating() {  // 获取操作记录列表
      let crmInfo = sessionStorage.getItem('linkmanId');
      let signature = generateSignature3(crmInfo, this.userInfo.itr_compid, timeout, nonce);
      let that = this;
      let optRecordMap = this.optRecordMap;
      let optRecordUserMap = this.optRecordUserMap;
      this.$get('/api/request/itr/comp/customer/opt/query', {
        params: {
          ptId: crmInfo,
          compId: this.userInfo.itr_compid,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          current: this.current,
          size: 20,
        },
      })
        .then(function (res) {
          if (!res.error) {
            res.data.forEach(item => {
              let time = item.createTime.split(" ");
              let timeArr = time[0].split("-");
              let mapKey = timeArr[1] + "月" + timeArr[2] + "日";
              if (!optRecordMap[mapKey]) {
                that.optRecordMap[mapKey] = optRecordMap[mapKey] = [];
                item.accurateTime = time[1].substring(0, 5) + "分";
                optRecordMap[mapKey].push(item);
              } else {
                item.accurateTime = time[1].substring(0, 5) + "分";;
                optRecordMap[mapKey].push(item);
              }
              let toArr = []
              let toStr = '';
              if (item.to) {
                item.to = item.to.split(",");
                item.to.forEach(item => {
                  let arr = item.split("|");
                  toArr.push(arr[0])
                  toStr += arr[0] + ",";
                });
                item.toArr = toArr;
                item.toStr = toStr;
              }
              if (item.type == 0) {
                item.typeName = "新增";
              } else if (item.type == 1) {
                item.typeName = "修改";
              } else if (item.type == 2) {
                item.typeName = "分配";
              } else if (item.type == 3) {
                item.typeName = "释放";
              } else if (item.type == 4) {
                item.typeName = "拾取";
              } else if (item.type == 5) {
                item.typeName = "放弃";
              } else if (item.type == 6) {
                item.typeName = "共享";
              } else if (item.type == 7) {
                item.typeName = "取消共享";
              } else if (item.type == 8) {
                item.typeName = "修改共享";
              } else {
                item.typeName = "未知";
              }
            })
            that.optRecordMap = { ...optRecordMap };
            console.log(that.optRecordMap)
            // console.log();
            if (Object.keys(that.optRecordMap).length == 0) that.empty = true; //如果数据等于0，就显示空信息
            that.optRecordUserMap = Object.assign(optRecordUserMap, res.user);
            that.total = res.totalPageCount;

          } else {
            that.empty = true;
          }
        })
        .catch(function (error) {
          that.empty = true;
        });
    },
    userInfos() { // 获取当前联系人信息
      return JSON.parse(sessionStorage.getItem('userinfo'));
    },
  },
  created() {
    console.log('操作记录')
    this.getOperating()
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.CustomerOpera {
  overflow-y: scroll;
  height: 78vh;
  .qs-title {
    background-color: #f0f0f5;
    padding: 5px;
    font-size: 0.36rem;
  }
  .OPeraBox {
    // padding-bottom: 30px;
    padding-top: 10px;
  }
  .OPeraBox:last-of-type {
    padding-bottom: 30px;
  }
  .record-detail {
    background-color: #fff;
    // padding: 10px;
    font-size: 0.3rem;
    line-height: 36px;
    margin-bottom: 1px;
    letter-spacing: 1px;
    .detail {
      padding-left: 10px;
    }
    .qs-blue {
      color: #0000ff;
    }
  }
}
</style>