/*
 * @Author: YUN_KONG 
 * @Date: 2021-02-03 11:22:09 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-04-29 11:25:31
 * 该页面是文档页面
 */
<template>
  <div class="document">
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
    <!-- <van-tabbar v-model="active" active-color="#ee0a24">
        <van-tabbar-item icon="home-o" to="/poster" :replace="true"
          >海报</van-tabbar-item
        >
        <van-tabbar-item icon="search">文档</van-tabbar-item>
      </van-tabbar> -->
  </div>
</template>

<script>
import Tab from '../../components/colorPage/Tab';
import local from '../../uilts/localStorage';
import {
  generateTimeout,
  generateNonce,
  generateSignature4,
} from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import { Toolbar } from '../../uilts/toolbarMixin';

export default {
  name: "Document",
  components: { Tab },
  props: [],
  mixins: [Toolbar],
  data() {
    return {
      active: 1,
      value: "",
      state: 'list',
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
    async getList(cur) {
      let signature = generateSignature4(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      // 获取用户信息
      await this.$get("/aliyun/remote/oss/folder", {
        params: {
          cateId: this.id,
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
          let bb = qq.data.concat(res.data).map(item => {
            return {
              ...item,
              time: item.updateTime.split(' ')[0],
              img: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`
            }
          });
          let cc = res.data.map(item => {
            return {
              ...item,
              time: item.updateTime.split(' ')[0],
              img: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`
            }
          });
          qq.data = (cur == 1 || cur == undefined) ? cc : bb;
          qq.userMap = Object.assign(qq.userMap, res.user);
          qq.config.total = res.totalPageCount;
          this.treeData = JSON.parse(JSON.stringify(this.treeData))
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
          this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          this.$toast.clear();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getTabList() {
      let signature = generateSignature4(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce,
      );
      // 获取用户信息
      await this.$get("/aliyun/remote/oss/category/result", {
        params: {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          timeout,
          nonce,
          signature
        },
      })
        .then((res) => {
          this.tabArray = res;
          this.tabArray.splice(0, 0, { title: "全部", id: 0 })
          this.tabArray.forEach(item => {  // 创建多维对象数组；
            this.treeData[item.id] = {
              data: [],
              userMap: {},
              config: {
                scroll: 0,
                current: 1,
                total: -1,
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
    onCancel() {
      this.state = 'list';
      this.treeData[this.id].config.current = 1;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList()
    },
    onSearch(cur) {
      let signature = generateSignature4(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        cateId: this.id,
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        current: cur || 1,
        size: 20,
        signature,
        timeout,
        nonce
      }
      if (this.value !== '') {
        data.fuzzy = this.value;
      }
      // 获取用户信息
      this.$get("/aliyun/remote/oss/folder", {
        params: data,
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let bb = qq.data.concat(res.data).map(item => {
            return {
              ...item,
              time: item.updateTime.split(' ')[0],
              img: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`
            }
          });
          let cc = res.data.map(item => {
            return {
              ...item,
              time: item.updateTime.split(' ')[0],
              img: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`
            }
          });
          qq.data = (cur == 1 || cur == undefined) ? cc : bb;
          qq.userMap = Object.assign(qq.userMap, res.user);
          qq.config.total = res.totalPageCount;
          this.treeData = JSON.parse(JSON.stringify(this.treeData))
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
          this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数

        })
        .catch((error) => {
          console.log(error);
        });
    },
    refreshEmptys() {
      this.config.current = 0;  // 总页
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
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
  activated() {
    this.active = 1;
  },
  async created() {
    // this.loading()
    // await this.getTabList()
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
.document {
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>