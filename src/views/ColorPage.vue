<template>
  <div class="colorPage">
    <van-search :clearable="false" v-model="value" show-action placeholder="请输入搜索关键词" @search="search">
      <template #action>
        <div @click="onCancel">取消</div>
      </template>
    </van-search>
    <!-- {{treeData[id].data.lenght > 0}} -->
    <!-- {{treeData[id].data}} -->
    <!-- v-if="isShowTab" -->
    <Tab :states="state" :tabArrays="tabArray" @ColorId="ColorIds" :datas="atData" :trajectoryCounts="trajectoryCount" :userMaps="userMap" :configs="config" :formCounts="formCount" @mySonChagne="mySonChagne" @onSearch="onSearch" @refreshEmpty="refreshEmptys"></Tab>
    <!-- <template v-for="(item,index) in tabArray">
      <ColorView :show="id == item.id" :cid="id" :key="index" :ref="`colorView${index}`" :datas="data"></ColorView>
    </template> -->
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
  name: "ColorPage",
  components: {},
  props: [],
  data() {
    return {
      value: "",
      id: 1,
      tabArray: [],
      data: [],
      page: {
        current: 1,
        size: 20
      },
      list: [],
      category: 0,
      trajectoryCount: {},
      userMap: {},
      formCount: {},
      totalPageCount: 0,
      visitor: 0,
      treeData: {},
      atData: [],
      userMap: {},
      config: {},
      state: 'list'
    };
  },
  watch: {},
  computed: {
    isShowTab() {
      const { treeData, id } = this
      return treeData[id]
    }
  },
  methods: {
    async getTabList() {
      let signature = generateSignature3(
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        type: 5,
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
            this.tabArray.splice(0, 0, { title: "全部", id: 1 }, { title: "管理员", id: 2 }, { title: "我的", id: 3 })
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
    ColorIds(index) {  // 点击tab事件
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
        this.trajectoryCount = JSON.parse(JSON.stringify(this.treeData[this.id].trajectoryCount))  // 传入当前对象
        this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
        this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
        this.formCount = JSON.parse(JSON.stringify(this.treeData[this.id].formCount))  // 传入当前对象
      }
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = this.treeData[this.id].config.scroll; // 设置每个页面的scrollTop
      })
    },
    async getList(cur) {  // 获取当前列表
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        category: this.category,
        type: 5,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
        current: cur || 1,
        size: 20,
        categroyId: this.id
      }
      this.$get("/api/request/itr/page/recommend/result", {
        params: data,
      })
        .then((res) => {
          let qq = this.treeData[this.id];
          let bb = qq.data.concat(res.data).map(item => {
            return {
              ...item,
              time: item.lastUpdateTime.split(' ')[0]
            }
          });
          let cc = res.data.map(item => {
            return {
              ...item,
              time: item.lastUpdateTime.split(' ')[0]
            }
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
    deepClone(target) {
      // 定义一个变量
      let result;
      // 如果当前需要深拷贝的是一个对象的话
      if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
          result = []; // 将result赋值为一个数组，并且执行遍历
          for (let i in target) {
            // 递归克隆数组中的每一项
            result.push(deepClone(target[i]))
          }
          // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
          result = null;
          // 判断如果当前的值是一个RegExp对象的话，直接赋值    
        } else if (target.constructor === RegExp) {
          result = target;
        } else {
          // 否则是普通对象，直接for in循环，递归赋值对象的所有值
          result = {};
          for (let i in target) {
            result[i] = deepClone(target[i]);
          }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
      } else {
        result = target;
      }
      // 返回最终结果
      return result;
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
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
      this.onSearch(this.treeData[this.id].config.current);
    },
    onSearch(cur) {
      this.treeData[this.id].config.current = cur;
      let signature = generateSignature3(
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        timeout: timeout,
        nonce: nonce,
        current: cur,
        fuzzy: this.value,
        signature: signature,
        version: 1,
        categroyId: this.id
      };
      this.$get("/api/request/itr/page/recommend/result", {
        params: data,
      })
        .then((res) => {
          if (res.data.length > 0) {

            let qq = this.treeData[this.id];
            let bb = qq.data.concat(res.data).map(item => {
              return {
                ...item,
                time: item.lastUpdateTime.split(' ')[0]
              }
            });
            let cc = res.data.map(item => {
              return {
                ...item,
                time: item.lastUpdateTime.split(' ')[0]
              }
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
          } else {
            this.$toast({
              message: '未查询到相关内容',
              position: 'bottom',
            });
          }

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
    onCancel() {
      // if (this.value === '') return;
      this.state = 'list';
      this.treeData[this.id].config.current = 1;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList()
    }
  },
  activated() {
    console.log('activated')
  },
  async created() {
    await this.getTabList()
    await this.getList();
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
  },
  activated() {
  },
  components: {
    Tab,
    ColorView
  }
};
</script>

<style lang="less" scoped>
.colorPage {
  font-size: 0.32rem;
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>