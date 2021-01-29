<template>
  <div class="video">
    <van-search :clearable="false" v-model="value" show-action placeholder="请输入搜索关键词" @search="search" @cancel="onCancel" />
    <Tab :states="state" :tabArrays="tabArray" @ColorId="ColorIds" :datas="atData" :userMaps="userMap" :configs="config" @mySonChagne="mySonChagne" @onSearch="onSearch" @refreshEmpty="refreshEmptys"></Tab>
  </div>
</template>

<script>
import Tab from '../components/colorPage/Tab';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
  generateSignature4
} from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import local from '../uilts/localStorage';

export default {
  name: "Video",
  components: { Tab },
  props: {},
  data() {
    return {
      value: "",
      tabArray: [],
      current: 1,
      id: 0,
      list: [],
      total: 0,
      userData: {},
      treeData: {},
      atData: [],
      userMap: {},
      config: {},
      state: 'list'

    };
  },
  watch: {},
  computed: {},
  activated() {
    console.log('act')
  },
  methods: {
    getCategoryList() {  // 获取自定义行
      let signature = generateSignature4(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        level: 1,
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        timeout: timeout,
        nonce: nonce,
        size: 50,
        signature: signature
      }
      this.$get("/aliyun/remote/vod/category/result", {
        params: data,
      })
        .then((res) => {
          if (!res.error) {
            this.tabArray = res.data.sort(function (a, b) {
              return a.sort - b.sort;
            });
            this.tabArray.splice(0, 0, { title: "全部", id: 0 });
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
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getList(cur) { // 获取视频列表
      let signature = generateSignature4(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let data = {
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
        timeout: timeout,
        nonce: nonce,
        signature: signature,
        sort: "topState",
        current: cur || 1,
        size: 20,
        cateId: this.id
      }
      this.$get("/aliyun/remote/vod/result", {
        params: data,
      })
        .then((res) => {
          if (!res.error) {
            let qq = this.treeData[this.id];
            qq.data = (cur == 1 || cur == undefined) ? res.data : qq.data.concat(res.data);
            qq.userMap = res.user;
            qq.config.total = res.totalPageCount;
            this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
            this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
            this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
            console.log(this.treeData)
          } else {
            that.$toast.fail("请求失败，请稍后再试");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ColorIds(index) {  // 点击tab事件
      this.id = this.tabArray[index].id;
      if (this.treeData[this.id].config.total == -1) { // == -1 证明第一次点击该标签a
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
      console.log(val)
      this.state = 'search';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.treeData[this.id].config.current = 1;
      this.onSearch(this.treeData[this.id].config.current);
    },
    onSearch(cur) {
      console.log(cur)
      this.treeData[this.id].config.current = cur;
      let signature = generateSignature4(
        this.$U || local.U(),
        this.$C || local.C(),
        timeout,
        nonce
      );
      let data = {
        timeout: timeout,
        nonce: nonce,
        current: cur,
        fuzzy: this.value,
        signature: signature,
        cateId: this.id,
        userId: this.$U || local.U(),
        compId: this.$C || local.C(),
      };
      this.$get("/aliyun/remote/vod/result", {
        params: data,
      })
        .then((res) => {
          console.log(res)
          if (res.data.length > 0) {
            let qq = this.treeData[this.id];
            qq.data = (cur == 1 || cur == undefined) ? res.data : qq.data.concat(res.data);
            qq.userMap = res.user;
            qq.config.total = res.totalPageCount;
            this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
            this.userMap = JSON.parse(JSON.stringify(this.treeData[this.id].userMap))  // 传入当前对象
            this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
            console.log(this.treeData)
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
    onCancel() {
      if (this.value === '') return;
      this.state = 'list';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.getList()
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
    },
    refreshEmptys() {  // 当用户下拉刷新是触发，清空页数
      this.config.current = 0;  // 总页
    },
  },
  created() {
    this.getCategoryList();
    this.getList()
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)

  }
};
</script>

<style lang="less" scoped>
.video {
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>