<template>
  <div class="searchView">
    <RadarViews
      v-bind="$attrs"
      v-on="$listeners"
      :datas="datas"
      :configs="configs"
      :states="states"
      @mySonChagne="mySonChagne"
      @refreshEmpty="refreshEmptys"
    >
    </RadarViews>
  </div>
</template>

<script>
import RadarViews from '../../components/RadarView/RadarViews'
import local from '../../uilts/localStorage';
import { generateTimeout, generateNonce, generateSignature, generateSignature3 } from '../../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "SearchView",
  components: { RadarViews },
  props: [],
  data() {
    return {
      datas: [],
      configs: {
        current: 1,
        total: 0
      },
      states: 'list',
      date: "",
      pageValue: {},
      sourceValue: {},
      value: "",
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
      start: "【",
      end: "】",
      total: 0
    };
  },
  watch: {},
  computed: {},
  methods: {
    getList(cur) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 1200, // 持续展示 toast
      });
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      let params = {
        to: this.$U || local.U(),
        compId: this.$C || local.C(),
        nonce: nonce,
        timeout: timeout,
        signature: signature,
        current: cur || 1,
        size: 20,
      }
      if (this.date !== '' && this.date !== '全部') {
        params.startTime = this.date.replace('至', ',').split(',')[0] ?? "";
        params.endTime = this.date.replace('至', ',').split(',')[1] ?? "";
      }
      if (this.value !== '') {
        params.promoteFuzzy = this.value;
      }
      if (this.sourceValue.name !== undefined && this.sourceValue.name !== '' && this.sourceValue.name !== '全部') {
        params.sourceType = this.sourceValue.value;
      }
      if (this.pageValue.name !== undefined && this.pageValue.name !== '' && this.pageValue.name !== '全部') {
        params.pageType = this.pageValue.value;
      }
      this.$get('/api/request/itr/comp/trajectory/result', {
        params,
      })
        .then((res) => {
          console.log(res)
          let allArr = [];
          if (res.data.length > 0) {
            res.data.forEach(item => {
              let from = item.from;
              if (from) {
                from = JSON.parse(from);
                from.optType = item.optType;
                from.pageType = item.pageType;
                from.sourceType = item.sourceType;
                var arr = item.createTime.split("-");
                var arr1 = arr[2].split(" ");
                from.createTime = arr[1] + "月" + arr1[0] + "日" + arr1[1]
                from.leaveTime = item.leaveTime;
                from.to = item.to;
                from.toName = item.toName;
                from.toPortrait = item.toPortrait;
                from.status = 0;
                if (from.leaveTime) {
                  from.status = 1;
                }
                from.description = this.optMap[from.status] + this.getDescription(item.description, from.pageType);
                if (from.description) {
                  from.description = from.description.replace(/undefined/g, '');
                }
                allArr.push(from);
              }
            })
            this.configs.total = res.totalPageCount;
            this.datas = (cur == 1 || cur == undefined) ? allArr : this.datas.concat(allArr);
            console.log(allArr)
            console.log(this.datas, 'this.datasthis.datasthis.datasthis.datas')
          }
        })
        .catch((error) => {
          console.log(error)
          this.$toast.fail('请求失败，请稍后再试');
        });
    },
    mySonChagne(data) {
      let cur = ++data
      this.configs.current = cur;
      this.getList(cur)
    },
    getDescription(title, pageType) {
      return this.pageTypeMap[pageType] + this.start + title + this.end;
    },
    refreshEmptys() {
      this.configs.current = 0;  // 总页
    },
  },
  created() {
    let data = JSON.parse(sessionStorage.getItem('searchView'))
    this.date = data.date;
    console.log(data)
    this.pageValue = data.pageValue;
    this.sourceValue = data.sourceValue;
    this.value = data.value;
    this.getList()
  },
  activated() {
    console.log(this.$route.params)
  },
  mounted() { },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit("cache", 'SearchView,Radar');
    })
  },
};
</script>

<style lang="less" scoped>
.searchView {
  background: #eee;
}
</style>