<template>
  <div class="navbar">
    <div v-show="!searchShow" class="contar">
      <van-dropdown-menu>
        <van-dropdown-item @change="menuChange" v-model="value1" :options="option1" />
      </van-dropdown-menu>
      <div @click="add">
        <van-icon name="plus" size="20" />
      </div>
      <div @click="filters">
        <van-icon name="filter-o" size="20" />
      </div>
      <div @click="searchs">
        <van-icon name="search" size="20" />
      </div>
      <div @click="unbind">解绑</div>
    </div>
    <van-search @search="onSearch" show-action @cancel="onCancel" v-show="searchShow" v-model="search" placeholder="请输入搜索关键词" />
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import { formatDate, yesterday, lastSevent } from '../uilts/date';
import local from '../uilts/localStorage';

export default {
  props: ['SearchtotalPageCounts', 'modes'],
  name: 'Navbar',
  data() {
    return {
      value1: 9,
      search: '',
      searchShow: false,
      option1: [
        { text: '我的客户', value: 0 },
        { text: '今日新增', value: 1 },
        { text: '超一周未联系', value: 2 },
        { text: '超一月未联系', value: 3 },
        { text: '从未联系过客户', value: 4 },
        { text: '昨日联系过的', value: 5 },
        { text: '今日联系过的', value: 6 },
        { text: '近七日联系过的', value: 7 },
        { text: '本月联系过的', value: 8 },
        { text: '全部客户', value: 9 },
      ],
      pullValue: 9,
    };
  },
  methods: {
    unbind() {  // 解绑
      this.$emit('unbinds')
    },
    searchs() {
      this.searchShow = true;
      this.$emit('update:SearchtotalPageCounts', 0)
    },
    onSearch(val) { // 确定键搜索；
      this.$store.state.SearchValue = '' //先重置，再触发，目的是为了触发页面watch
      this.$store.commit('Searchfuzzy', val);
    },
    onCancel() {
      this.searchShow = false;
      // this.menuChange(this.pullValue, this.SearchtotalPageCounts) // 点击了搜索取消按钮，返回他上一次过滤下拉框的状态
      this.$store.state.SearchMode = '';  // 搜索取消时候默认为全部数据
      this.value1 = 9;
      this.$store.commit('SearchfuzzyReset', 'off');
    },
    menuChange(value, cur) {  // 下拉框选择 cur 为父组件传过来的监听当前滚动的页数
      this.pullValue = value;
      this.$toast.loading({
        message: '搜索中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      if (!cur) {
        if (this.$parent?.initscroll()) { // 为空的时候会清空数组，linkman 组件就不会生成。进行判断以防报错，
          try {
            this.$parent.initscroll();
          } catch (error) {
            console.log(error);
          }
        }
        let name = this.$route.name.toLowerCase();//动态获取清空当前页数
        this.$store.commit("ClearCurNum", name);
      };
      let signature = generateSignature3(this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      if (value == 0) {
        this.$emit('update:modes', 'my') // 触发我的客户选择器
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1, // cur 为undefined 时候就是默认为1;
          nonce,
          ownerId: this.$U || local.U(),
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 9) { // 全部数据，
        this.$emit('update:modes', 'list')
        this.$parent.getList(1)
      } else if (value == 1) { //今日新增
        this.$emit('update:modes', 'today')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1,
          nonce,
          endTime: formatDate(new Date()),
          startTime: formatDate(new Date()),
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 2) { // 一周未联系
        this.$emit('update:modes', 'noweekly')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1, // cur 为undefined 时候就是默认为1;
          nonce,
          contactStatus: 2,
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 3) { // 一月未联系
        this.$emit('update:modes', 'nomonth')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1, // cur 为undefined 时候就是默认为1;
          nonce,
          contactStatus: 4,
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 4) { // 一月未联系
        this.$emit('update:modes', 'never')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1, // cur 为undefined 时候就是默认为1;
          nonce,
          contactStatus: 1,
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 5) { // 昨日联系
        this.$emit('update:modes', 'yesterday')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1,
          nonce,
          endTime: yesterday(-1, '-'),
          startTime: yesterday(-1, '-'),
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 6) { // 今日联系过的
        this.$emit('update:modes', 'TodayContact')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1,
          nonce,
          endTime: formatDate(new Date()),
          startTime: formatDate(new Date()),
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 7) { // 近七日联系过的
        this.$emit('update:modes', 'seven')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1,
          nonce,
          startTime: lastSevent(-7),
          endTime: formatDate(new Date()),
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      } else if (value == 8) {
        this.$emit('update:modes', 'lastMonth')
        let Params = {
          compId: this.$C || local.C(),
          current: cur || 1,
          nonce,
          startTime: lastSevent(-30),
          endTime: formatDate(new Date()),
          signature,
          size: 20,
          timeout,
          type: 1,
          userId: this.$U || local.U(),
        };
        this.Allroads(Params, cur);
      }
    },
    Allroads(Params, cur) { // 动态添加key：value
      let data = Object.entries(Params);
      let param = new URLSearchParams();
      for (let i = 0; i < data.length; i++) {
        param.append(data[i][0], data[i][1]);
      }
      if (this.$route.name.toLowerCase() == 'common') { // common 添加starLevel ：5
        param.append('starLevel', 5);
      } else if (this.$route.name.toLowerCase() == 'highseas') { // highseas
        param.append('ownerId', 0);
      }
      this.$post1('/api/request/itr/comp/customer/query', param
      ).then((res) => {
        if (res.data.length !== 0) {
          this.$emit('Typefilter', res, cur);
        } else {
          this.$toast({
            message: '未查询到相关内容',
            position: 'bottom',
          });
          this.$emit('ClearList')
        }
        // this.$toast.clear(); //清除弹框
      })
        .catch(function (error) {
          console.log(error, 'error');

        });
    },
    filters() { // 详细过滤
      sessionStorage.setItem('TabIndex', 9);
      this.$router.push('/detailFilter')
    },
    add() { // 添加客户
      // sessionStorage.setItem('histroyScrollTop',window.document.documentElement.scrollTop)
      this.$router.push('/addcustomer')
    }
  },
  watch: {
    "$store.state.SearchReset": {
      deep: true,
      handler(newValue, oldValue) {
        this.search = "";
        this.searchShow = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 48px;

  font-size: 0.32rem;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  background: #fff !important;
  border-bottom: 1px solid #e5e5e5;
  .contar {
    align-items: center;
    display: flex;
    div {
      text-align: center;
    }
    div:first-child {
      flex: 2;
    }
    div:nth-child(n + 2) {
      flex: 1;
      height: 100%;
      vertical-align: center;
      align-items: center;
      display: flex;
      justify-content: center;
      background: #fff !important;
    }
  }
  /deep/ .van-search {
    height: 48px;
  }
}
</style>