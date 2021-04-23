<template>
  <div class="navbar">
    <div v-show="!searchShow" class="contar">
      <van-dropdown-menu>
        <van-dropdown-item
          @change="menuChange"
          v-model="value1"
          :options="option1"
        />
      </van-dropdown-menu>
      <div @click="add" v-if="$route.name == 'Home'">
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
    <van-search
      @clear="onCancel"
      v-model="search"
      show-action
      v-show="searchShow"
      placeholder="请输入搜索关键词"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <!-- <van-search
      @search="onSearch"
      show-action
      @cancel="onCancel"
      v-show="searchShow"
      v-model="search"
      placeholder="请输入搜索关键词"
      v-if="$route.name == 'Home'"
    /> -->
    <!-- 联系人快捷搜索 -->
    <div
      class="shortcut"
      v-if="$route.name == 'Home' && shortTitle && shortTitle.length > 0"
    >
      <div @click="short('1')">
        {{ shortTitle[0] }}<van-icon name="arrow-down" />
      </div>
      <div @click="short('2')">
        {{ shortTitle[1] }}<van-icon name="arrow-down" />
      </div>
      <div @click="short('3')">
        {{ shortTitle[2] }}<van-icon name="arrow-down" />
      </div>
    </div>
    <!-- 客户管理快捷搜索 -->
    <div class="shortcut" v-if="$route.name == 'HighSeas'">
      <button
        @click="fastComp(0)"
        :style="{ color: colorIdx == 0 ? 'red' : '#000' }"
      >
        总公海
      </button>
      <button
        @click="fastComp(1)"
        :style="{ color: colorIdx == 1 ? 'red' : '#000' }"
      >
        分公司公海
      </button>
      <button
        @click="fastComp(2)"
        :style="{ color: colorIdx == 2 ? 'red' : '#000' }"
      >
        部门公海
      </button>
      <button
        @click="fastComp(4)"
        :style="{ color: colorIdx == 4 ? 'red' : '#000' }"
      >
        个人公海
      </button>
      <button
        @click="fastComp(9)"
        :style="{ color: colorIdx == 9 ? 'red' : '#000' }"
      >
        全部
      </button>
    </div>
  </div>
</template>
<script>3
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import { formatDate, yesterday, lastSevent, getFirstAndLastDay } from '../uilts/date';
import local from '../uilts/localStorage';
import debounce from '../uilts/debounce'

export default {
  props: ['SearchtotalPageCounts', 'modes', 'shortTitle', 'mergeData'],
  name: 'Navbar',
  data() {
    return {
      value1: 9,
      search: '',
      searchShow: false,
      option1: [
        // { text: '我的联系人', value: 0 },
        { text: '今日新增', value: 1 },
        { text: '超一周未联系', value: 2 },
        { text: '超一月未联系', value: 3 },
        { text: '从未联系过客户', value: 4 },
        { text: '昨日联系过的', value: 5 },
        { text: '今日联系过的', value: 6 },
        { text: '近七日联系过的', value: 7 },
        { text: '本月联系过的', value: 8 },
        { text: '全部联系人', value: 9 },
      ],
      pullValue: 9,
      colorIdx: 0,
      Params: {}
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
      console.log(this.search)
      this.$store.state.SearchValue = '' //先重置，再触发，目的是为了触发页面watch
      this.$store.commit('Searchfuzzy', this.search);
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
      this.$emit('update:contactStatus', value)
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
      let Params = {};
      let route = this.$route.name.toLowerCase();
      if (value == 0) {
        this.$emit('update:modes', 'my') // 触发我的客户选择器
        Params = {
          type: 1,
          ownerId: this.$U || local.U(),
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 9) { // 全部数据，
        this.$emit('update:modes', 'list')
        this.$parent.getList(1)
      } else if (value == 1) { //今日新增
        this.$emit('update:modes', 'today')
        Params = {
          endTime: formatDate(new Date()),
          startTime: formatDate(new Date()),
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 2) { // 一周未联系
        this.$emit('update:modes', 'noweekly')
        Params = {
          contactStatus: 2,
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 3) { // 一月未联系
        this.$emit('update:modes', 'nomonth')
        Params = {
          contactStatus: 4,
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 4) { // 一月未联系
        this.$emit('update:modes', 'never')
        Params = {
          contactStatus: 1,
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 5) { // 昨日联系
        this.$emit('update:modes', 'yesterday')
        Params = {
          endContactTime: yesterday(-1, '-'),
          startContactTime: yesterday(-1, '-'),
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 6) { // 今日联系过的
        this.$emit('update:modes', 'TodayContact')
        Params = {
          endContactTime: formatDate(new Date()),
          startContactTime: formatDate(new Date()),
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 7) { // 近七日联系过的
        this.$emit('update:modes', 'seven')
        Params = {
          startContactTime: lastSevent(-7),
          endContactTime: formatDate(new Date()),
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      } else if (value == 8) {
        this.$emit('update:modes', 'lastMonth')
        Params = {
          startContactTime: getFirstAndLastDay()[0],
          endContactTime: getFirstAndLastDay()[1],
          type: 1,
        };
        route == 'home' ? this.$parent.getList(1, Params) : this.Allroads(Params, cur);
      }
      this.Params = Params;
    },
    Allroads(Params, cur) { // 动态添加key：value
      let data = Object.entries(Params);
      console.log(data)
      let param = new URLSearchParams();
      let signature = generateSignature3(this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      if (this.$route.name.toLowerCase() == 'highseas') { // 公海数据
        for (let i = 0; i < data.length; i++) {
          param.append(data[i][0], data[i][1]);
        }
        param.append('ownerId', 0);
        param.append('ownerType', this.colorIdx);
        param.append('compId', this.$C || local.C());
        param.append('current', cur || 1);
        param.append('nonce', nonce);
        param.append('signature', signature);
        param.append('size', 20);
        param.append('timeout', timeout);
        param.append('userId', this.$U || local.U());
      }
      // if (this.$route.name.toLowerCase() == 'common') {
      //   // common 添加starLevel ：5
      //   param.append('starLevel', 5);
      // }
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
    },
    short(type) {
      this.$emit('update:shortPop', true);
      this.$emit('update:short', type);
      this.$emit('scrollTop', '0');
      let name = this.$route.name.toLowerCase();//动态获取清空当前页数
      this.$store.commit("ClearCurNum", name);
      // if (type == 1) {
      //   this.$emit('update:modes', 'short1')
      // } else if (type == 2) {
      //   this.$emit('<update></update>:modes', 'short2')
      // } else {
      //   this.$emit('update:modes', 'short3')
      // }
    },
    fastComp: debounce(function (type) {
      this.colorIdx = type;
      this.$emit('fastComp', type)
      let name = this.$route.name.toLowerCase();//动态获取清空当前页数
      this.$store.commit("ClearCurNum", name);
    }, 200)
  },
  watch: {
    "$store.state.SearchReset": {
      deep: true,
      handler(newValue, oldValue) {
        this.search = "";
        this.searchShow = false;
      }
    }
  },
  created() {
    if (this.$route.name == 'Home') {
      this.option1.unshift({ text: '我的联系人', value: 0 })
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 48px;
  z-index: 999;
  font-size: 0.32rem;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  background: #fff !important;
  // border-bottom: 1px solid #e5e5e5;
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
  .shortcut {
    height: 40px;
    width: 100%;
    display: flex;
    background: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    justify-content: space-evenly;
    align-items: center;
    flex-shrink: 0;
    div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.24rem;
      padding: 0 0.1rem;
    }
    button {
      background: #eee;
      border: none;
      padding: 7px;
      font-size: 0.24rem;
      border-radius: 12px;
    }
  }
  /deep/ .van-button {
    color: rgb(27, 26, 26) !important;
    font-size: 0.26rem;
  }
}
</style>