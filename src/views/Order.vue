<template>
  <div class="Order">
    <van-search
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @clear="onCancel"
    >
      <template #action>
        <div @click="search">搜索</div>
      </template>
    </van-search>
    <Tab
      :states="state"
      :tabArrays="tabArray"
      @ColorId="ColorIds"
      :datas="atData"
      :configs="config"
      @mySonChagne="mySonChagne"
      @onSearch="onSearch"
      @refreshEmpty="refreshEmptys"
    ></Tab>
  </div>
</template>

<script>
import Tab from '../components/colorPage/Tab';
import local from '../uilts/localStorage';

import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "Order",
  components: {},
  props: [],
  data() {
    return {
      value: '',
      tabArray: [
        { title: "全部", id: 0 },
        { title: "已支付", id: 1 },
        { title: "未支付", id: 2 },
        { title: "已发货", id: 3 },
        { title: "未发货", id: 4 },
      ],
      tabIndex: 0,
      state: 'list',
      atData: [],
      treeData: {
        0: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          }
        },
        1: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          }
        },
        2: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          }
        },
        3: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          }
        },
        4: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          }
        }
      },
      config: {},
      current: 1,
      total: 0,
      id: 0,
    };
  },
  watch: {},
  computed: {},
  components: { Tab },
  methods: {
    async getList(cur) {
      let signature = generateSignature3(
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        type: 1,
        compId: this.$C || local.C(),
        timeout: timeout,
        nonce: nonce,
        current: cur || 1,
        size: 20,
        signature: signature,
      };
      if (this.$U || local.U()) {
        data.creator = this.$U || local.U();
        if (this.tabIndex == 1) {
          data.paymentStatus = 1
        } else if (this.tabIndex == 2) {
          data.paymentStatus = 0
        } else if (this.tabIndex == 3) {
          data.supplyStatus = 1;
        } else if (this.tabIndex == 4) {
          data.supplyStatus = 0;
        }
      }
      this.$get("/api/request/mall/order/query", {
        params: data,
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let cc = res.data.map(item => {
            var title = '未确认';
            var color = 'qs-red'
            if (item.commissionStatus == 0) {
              if (item.cmsPromoteAmount == 0 && item.cmsCustomerAmount == 0 && item.cmsGroupAmount == 0) {
                title = '无提成'
                color = 'qs-org'
              }
            } else {
              if (item.commissionStatus == 1) {
                title = '提成有效'
                color = 'qs-green'
              } else {
                title = '提成无效'
                color = 'qs-org'
              }
            }
            item.commissionTitle = title;
            item.commissionColor = color;
            return item;
          })
          qq.data = (cur == 1 || cur == undefined) ? cc : qq.data.concat(cc);
          qq.config.total = res.totalPageCount;
          this.treeData = JSON.parse(JSON.stringify(this.treeData))
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          this.$toast.clear();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mySonChagne(data) {
      let cur = ++data
      this.treeData[this.id].config.current = cur;
      this.getList(cur)
    },
    ColorIds(index) {
      this.tabIndex = index;
      this.id = this.tabArray[index].id;
      if (this.treeData[this.id].config.total == -1) { // == -1 证明第一次点击该标签a
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 1000,
          overlay: true,
        });
        this.getList()
      } else {
        this.atData = this.treeData[this.id].data;
        this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
      }
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = this.treeData[this.id].config.scroll; // 设置每个页面的scrollTop
      })
    },
    search() {
      this.state = 'search';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.treeData[this.id].config.current = 1;
      this.onSearch(this.treeData[this.id].config.current);
    },
    onSearch(cur) {
      let signature = generateSignature3(
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        type: 2,
        compId: this.$C || local.C(),
        timeout: timeout,
        nonce: nonce,
        current: cur || 1,
        size: 20,
        fuzzy: this.value,
        signature: signature,
      };
      if (this.$U || local.U()) {
        data.creator = this.$U || local.U();
        if (this.tabIndex == 1) {
          data.paymentStatus = 1
        } else if (this.tabIndex == 2) {
          data.paymentStatus = 0
        } else if (this.tabIndex == 3) {
          data.supplyStatus = 1;
        } else if (this.tabIndex == 4) {
          data.supplyStatus = 0;
        }
      }
      this.$get("/api/request/mall/order/query", {
        params: data,
      })
        .then((res) => {
          if (res.data.length > 0) {
            let qq = this.treeData[this.id];
            console.log(qq)
            qq.data = (cur == 1 || cur == undefined) ? res.data : qq.data.concat(res.data);
            qq.config.total = res.totalPageCount;
            this.treeData = JSON.parse(JSON.stringify(this.treeData))
            this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
            this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onCancel() {
      this.state = 'list';
      this.treeData[this.id].config.current = 1;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList()
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
    },
    refreshEmptys() {
      this.config.current = 0;  // 总页
    },
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true,
        forbidClick: true,
        duration: 0
      });
    }
  },
  created() {
    if (sessionStorage.getItem('userinfo')) {
      this.loading()
      this.getList()
    } else {
      this.$toast.fail({
        message: '此模块不支持聊天工具栏。',
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)

  },
  beforeRouteEnter: (to, from, next) => {
    console.log(to.name, from.name)
    next(vm => {
      vm.$store.commit("cache", 'Order');
    })
  },
};
</script>

<style lang="less" scoped>
.Order {
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>