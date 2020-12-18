<template>
  <div class="operat">

    <div v-for="(item,index) in optRecordMap" :key="index">
      <div class="qs-title  bg-color-f0">
        <span>{{index}}</span>
      </div>
      <div class="record-detail" v-for="(items,indexs) in item" :key="indexs">
        <span>{{items.accurateTime}}</span>
        <span class="detail" :class="items.type == 7 ?'qs-green':''">{{optRecordUserMap[items.creator].nickname}}</span>
        <span class="detail qs-blue">{{items.typeName}}</span>
        <span v-if="items.type != 6 && items.type != 7 "> 该联系人</span>
        <span v-else> 该联系人给 </span>
        <span :class="items.type == 6 ?'qs-green':''" v-if="items.type == 6 || items.type == 7 ">
          {{optRecordUserMap[items.from].nickname}} </span>
      </div>
    </div>
    <van-empty v-show="empty" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />

  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout()
import local from '../uilts/localStorage';
import { ScorllMixin } from '@/uilts/mixins'
let nonce = generateNonce();

export default {
  name: 'operating',
  mixins: [ScorllMixin],
  data() {
    return {
      optRecordMap: {},
      optRecordUserMap: {},
      total: 0,
      empty: false,

    }
  },
  methods: {
    async getOperating() {  // 获取操作记录列表
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let signature = generateSignature3(crmInfo, this.$C || local.C(), timeout, nonce);
      let that = this;
      let optRecordMap = this.optRecordMap;
      let optRecordUserMap = {};
      this.$get('/api/request/itr/comp/customer/opt/query', {
        params: {
          ptId: crmInfo,
          compId: this.$C || local.C(),
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
            if (Object.keys(that.optRecordMap).length == 0) that.empty = true; //如果数据等于0，就显示空信息
            that.total = res.totalPageCount;
            that.optRecordUserMap = Object.assign(optRecordUserMap, res.user);
            that.$toast.clear()

          } else { }
        })
        .catch(function (error) {
        });
    }
  },
  async created() {
    await this.getOperating()
    this.current = 1;
  },
  computed: {
    getIndex() {
      return this.$store.state.current.operating
    }
  },
  watch: {
    getIndex(val) {
      this.current = val;
      if (this.total < this.current) return;
      this.$toast.loading('加载中...');
      this.getOperating();
    },
  },

}
</script>

<style lang="less" scoped>
.operat {
  padding-top: 0.8rem;
  .qs-title {
    background-color: #f0f0f5;
    padding: 10px;
    font-size: 18px;
  }
  .record-detail {
    background-color: #fff;
    padding: 10px;
    font-size: 15px;
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
  .van-empty {
    background: #f1f1f1;
  }
}
</style>