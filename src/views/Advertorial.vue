<template>
  <div class="advertorial">
    <van-search :clearable="false" v-model="value" show-action placeholder="请输入搜索关键词" @search="search">
      <template #action>
        <div @click="onCancel">取消</div>
      </template>
    </van-search>
    {{atData}}
    <!-- <Tab :states="state" :tabArrays="tabArray" @ColorId="ColorIds" :datas="atData" :trajectoryCounts="trajectoryCount" :userMaps="userMap" :configs="config" :formCounts="formCount" @mySonChagne="mySonChagne" @onSearch="onSearch" @refreshEmpty="refreshEmptys"></Tab> -->
  </div>
</template>

<script>
import Tab from '../components/colorPage/Tab';
import local from '../uilts/localStorage';
import ColorView from '../components/colorPage/ColorView';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "Advertorial",
  components: {},
  props: {},
  data() {
    return {
      value: "",
      tabArray: [],
      atData: [],
      treeData: {},
      userMap: {},
      trajectoryCount: {},
      config: {},
      formCount: {},
      config: {},
      state: 'list',
      current: 1,
      total: 0,
      id: 1,

    };
  },
  watch: {},
  computed: {},
  methods: {
    async getTabList() {
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
        signature: signature,
        sort: "topState",
      };
      this.$get("/api/request/itr/page/category/list", {
        params: data,
      })
        .then((res) => {
          if (res.length > 0) {
            this.tabArray = res;
            this.tabArray.splice(0, 0, { title: "全部", id: 1 }, { title: "管理员", id: 2 })
            this.tabArray.forEach(item => {  // 创建多维对象数组；
              this.treeData[item.id] = {
                data: [],
                trajectoryCount: {},
                userMap: {},
                config: {
                  scroll: 0,
                  current: 1,
                  total: -1,
                },
                formCount: {},
              }
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getList(cur) {  // 获取当前列表
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        tag: this.id,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
        current: this.current,
        sort: "sort",
        current: cur || 1,
      }
      this.$get("/api/request/itr/page/headlines/result", {
        params: data,
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let bb = qq.data.concat(res.data).map(item => {
            item.timeTemplate = this.getTimeByStr(item.timeTemplate);
            if ((item.timeTemplate + (60 * 60 * 3 * 1000)) > new Date().getTime()) {
              item.startTime = "刚刚";
            } else {
              let time = item.refreshTime.split(" ");
              item.startTime = time[0].substring(5).replace("-", "月") + "日";
              item.startTime += " " + time[1].substring(0, 5);
            }
            if (item.viewList.length > 3) { // 如果图片数量大于三，那么就 截取前三章
              item.viewList1 = item.viewList.splice(0, 3)
            }
            return item;
          });
          let cc = res.data.map(item => {
            item.timeTemplate = this.getTimeByStr(item.timeTemplate);
            if ((item.timeTemplate + (60 * 60 * 3 * 1000)) > new Date().getTime()) {
              item.startTime = "刚刚";
            } else {
              let time = item.refreshTime.split(" ");
              item.startTime = time[0].substring(5).replace("-", "月") + "日";
              item.startTime += " " + time[1].substring(0, 5);
            }
            if (item.viewList.length > 3) { // 如果图片数量大于三，那么就 截取前三章
              console.log(item.viewList.splice(0, 3))
            }
            return item;
          });
          qq.data = (cur == 1 || cur == undefined) ? cc : bb;
          qq.userMap = res.user;
          res.formCount.forEach(item => {
            qq.formCount[item.id] = item.counts;
          })
          res.trajectoryCount.forEach(item => {
            qq.trajectoryCount[item.id] = item.counts;
          })
          qq.config.total = res.totalPageCount;
          this.loading = false;
          this.treeData = JSON.parse(JSON.stringify(this.treeData))
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
          this.trajectoryCount = JSON.parse(JSON.stringify(this.treeData[this.id].trajectoryCount))  // 传入当前对象
          this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          this.formCount = JSON.parse(JSON.stringify(this.treeData[this.id].formCount))  // 传入当前对象
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
    ColorIds(index) {  // 点击tab事件
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
        this.trajectoryCount = JSON.parse(JSON.stringify(this.treeData[this.id].trajectoryCount))  // 传入当前对象
        this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
        this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
        this.formCount = JSON.parse(JSON.stringify(this.treeData[this.id].formCount))  // 传入当前对象
      }
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = this.treeData[this.id].config.scroll; // 设置每个页面的scrollTop
      })
    },
    mySonChagne(data) { // 孙子组件触发
      let cur = ++data
      this.treeData[this.id].config.current = cur;
      this.getList(cur)
    },
    search() {
      this.state = 'search';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.treeData[this.id].config.current = 1;
      console.log(this.value)
      this.onSearch(this.treeData[this.id].config.current);

    },
    onSearch(cur) {
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        timeout: timeout,
        nonce: nonce,
        signature: signature,
        sort: "sort",
        fuzzy: this.value,
        current: cur || 1,
        tag: this.id
      }
      this.$get("/api/request/itr/page/headlines/result", {
        params: data,
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let bb = qq.data.concat(res.data).map(item => {
            item.timeTemplate = this.getTimeByStr(item.timeTemplate);
            if ((item.timeTemplate + (60 * 60 * 3 * 1000)) > new Date().getTime()) {
              item.startTime = "刚刚";
            } else {
              let time = item.refreshTime.split(" ");
              item.startTime = time[0].substring(5).replace("-", "月") + "日";
              item.startTime += " " + time[1].substring(0, 5);
            }
            if (item.viewList.length > 3) { // 如果图片数量大于三，那么就 截取前三章
              item.viewList1 = item.viewList.splice(0, 3)
            }
            return item;
          });
          let cc = res.data.map(item => {
            item.timeTemplate = this.getTimeByStr(item.timeTemplate);
            if ((item.timeTemplate + (60 * 60 * 3 * 1000)) > new Date().getTime()) {
              item.startTime = "刚刚";
            } else {
              let time = item.refreshTime.split(" ");
              item.startTime = time[0].substring(5).replace("-", "月") + "日";
              item.startTime += " " + time[1].substring(0, 5);
            }
            if (item.viewList.length > 3) { // 如果图片数量大于三，那么就 截取前三章
              console.log(item.viewList.splice(0, 3))
            }
            return item;
          });
          qq.data = (cur == 1 || cur == undefined) ? cc : bb;
          qq.userMap = res.user;
          res.formCount.forEach(item => {
            qq.formCount[item.id] = item.counts;
          })
          res.trajectoryCount.forEach(item => {
            qq.trajectoryCount[item.id] = item.counts;
          })
          qq.config.total = res.totalPageCount;
          this.loading = false;
          this.treeData = JSON.parse(JSON.stringify(this.treeData))
          this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
          this.trajectoryCount = JSON.parse(JSON.stringify(this.treeData[this.id].trajectoryCount))  // 传入当前对象
          this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
          this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          this.formCount = JSON.parse(JSON.stringify(this.treeData[this.id].formCount))  // 传入当前对象
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    refreshEmptys() {  // 当用户下拉刷新是触发，清空页数
      this.config.current = 0;  // 总页
      // this.treeData[this.id].config.current = 1;
      // console.log(this.treeData)
    },
    getTimeByStr(str) {
      try {
        str = str.replace(".0", "");
        return new Date(Date.parse(new Date(str)) || Date.parse(new Date(str.replace("-", "\/").replace("-", "\/"))));
      } catch (e) {
        return
      }
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
    },
  },
  async created() {
    await this.getTabList();
    await this.getList();
  },

  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
  },
  components: {
    Tab,
    ColorView
  }
};
</script>

<style lang="less" scoped>
.advertorial {
  font-size: 0.32rem;

  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>