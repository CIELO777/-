<template>
  <div class="verbal">
    <van-search
      @clear="onCancel"
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
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
      :userMaps="userMap"
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
import { Toolbar } from '../uilts/toolbarMixin';

import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();

export default {
  name: "Verbal",
  components: { Tab },
  props: [],
  mixins: [Toolbar],
  data() {
    return {
      state: 'list',
      value: "",
      tabArray: [],
      atData: [],
      userMap: [],
      treeData: {},
      config: {},
      id: 0,

    };
  },
  watch: {},
  computed: {},
  methods: {
    getList(cur) {
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      // 获取用户信息
      this.$get("/api/request/itr/comp/words/result", {
        params: {
          categoryId: this.id,
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          current: cur || 1,
          size: 20,
          signature,
          timeout,
          nonce
        },
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let cc = res.data.map(item => {
            console.log(JSON.parse(item.content))
            return {
              ...item,
              content: JSON.parse(item.content)
            }
          })
          qq.data = (cur == 1 || cur == undefined) ? cc : qq.data.concat(cc);
          qq.config.empty = qq.data.length > 0 ? false : true;
          qq.userMap = Object.assign(qq.userMap, res.user);
          qq.config.total = res.totalPageCount;
          this.treeData = JSON.parse(JSON.stringify(this.treeData));
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data));  // 传入当前数组
          this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap));  // 传入当前对象
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));// 总页数
          this.$toast.clear();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getTabList() {
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      // 获取用户信息
      await this.$get("/api/request/itr/comp/words/category/result", {
        params: {
          level: 1,
          size: 20,
          signature,
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          timeout,
          nonce,
        },
      })
        .then((res) => {
          this.tabArray = res.data;
          this.tabArray.splice(0, 0, { title: "全部", id: 0 });
          this.tabArray.forEach(item => {  // 创建多维对象数组；
            this.treeData[item.id] = {
              data: [],
              userMap: {},
              config: {
                scroll: 0,
                current: 1,
                total: -1,
                empty: false,
              },
            }
          })
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ColorIds(index) {
      this.id = this.tabArray[index].id;
      if (this.treeData[this.id].config.total == -1) { // == -1 证明第一次点击该标签a
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 800,
          overlay: true,
        });
        this.getList()
      } else {
        this.atData = this.treeData[this.id].data;
        this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
        this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
      }
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = this.treeData[this.id].config.scroll; // 设置每个页面的scrollTop
      })
    },
    refreshEmptys() {
      this.config.current = 0;  // 总页
    },
    mySonChagne(data) {
      let cur = ++data
      this.treeData[this.id].config.current = cur;
      this.getList(cur)
    },
    search(val) {
      this.state = 'search';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.treeData[this.id].config.current = 1;
      this.onSearch(this.treeData[this.id].config.current);
    },
    onSearch(cur) {
      let signature = generateSignature3(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        categoryId: this.id,
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        current: cur || 1,
        size: 20,
        signature,
        timeout,
        nonce
      };
      if (this.value !== '') {
        data.fuzzy = this.value;
      }
      // 获取用户信息
      this.$get("/api/request/itr/comp/words/result", {
        params: data
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let cc = res.data.map(item => {
            return {
              ...item,
              content: JSON.parse(item.content)[0]
            }
          })
          qq.data = (cur == 1 || cur == undefined) ? cc : qq.data.concat(cc);
          qq.config.total = res.totalPageCount;
          this.treeData = JSON.parse(JSON.stringify(this.treeData))
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
          this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
          console.log(this.userMap)
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          this.$toast.clear();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onCancel() {
      this.state = 'list';
      this.treeData[this.id].config.current = 1;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList()
    },
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true,
        forbidClick: true,
        duration: 0
      });
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
    },
  },
  async created() {
    // console.log(this.Single, 'SingleSingle');
    // this.loading();
    // await this.getTabList();
    // this.getList();
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit("cache", to.name);
    })
  },
};
</script>

<style lang="less" scoped>
.verbal {
  font-size: 0.32rem;
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>