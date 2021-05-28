/*
 * @Author: YUN_KONG 
 * @Date: 2021-02-18 14:22:08 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-05-26 11:18:05
 */
<template>
  <div class="radar">
    <div class="contar">
      <van-dropdown-menu>
        <van-dropdown-item
          @change="menuChange"
          v-model="value1"
          :options="option1"
        />
      </van-dropdown-menu>
      <div @click="searchs" class="searchIcon">
        <van-icon name="search" size="20" />
      </div>
    </div>
    <Tab
      :states="state"
      :tabArrays="tabArray"
      @ColorId="ColorIds"
      :datas="atData"
      :configs="config"
      @mySonChagne="mySonChagne"
      @refreshEmpty="refreshEmptys"
    ></Tab>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%', background: '#eee' }"
    >
      <div class="module">
        <van-cell
          title="日期区间"
          is-link
          :value="module.date"
          class="one"
          @click="lately"
        />
        <van-field v-model="value" placeholder="推广人昵称" class="two" />
        <van-cell
          title="访问来源"
          is-link
          :value="sourceValue.name"
          @click="source"
          class="three"
        />
        <van-cell
          title="访问页面"
          @click="page"
          is-link
          :value="pageValue.name"
          class="four"
        />
      </div>
      <div class="bcc">
        <van-button type="default" @click="back()">返回</van-button>
        <van-button type="default" @click="empty()">清空</van-button>
        <van-button color="rgb(81, 187, 186)" @click="Save()" type="primary"
          >搜索</van-button
        >
      </div>
    </van-popup>
    <!-- 日期区间选择 -->
    <van-popup
      v-model="module.module1"
      round
      :style="{ height: '53%', width: '60%' }"
    >
      <datainterval
        :modules.sync="module.module1"
        @timeData="timeDatas(arguments)"
        ref="dataInt"
        :module="diyTime"
        :shows.sync="dateShow"
        :type.sync="TimeType"
        @updating="updatings(arguments)"
      ></datainterval>
    </van-popup>

    <!-- 访问来源 -->
    <van-action-sheet
      description="选择访问来源"
      :actions="sourceactions"
      v-model="sourcePop"
      @select="onSelectStatus"
    />
    <!-- 访问页面 -->
    <van-action-sheet
      description="选择访问页面"
      :actions="pageactions"
      v-model="pagePop"
      @select="onSelectPage"
    />
    <!-- 自定义日期 -->
    <!--  日期区间最近已经联系 自定义时间 -->
    <van-popup v-model="dateShow" position="bottom">
      <van-datetime-picker
        @confirm="Timeok"
        @cancel="TimeCancel"
        v-model="currentDate"
        type="date"
        title="选择年月日"
      />
    </van-popup>
    <!-- 绑定操作 -->
    <BindPop :shows="Bindshow" @BindComplete="BindCompletes"></BindPop>
  </div>
</template>

<script>
import BindPop from '../components/ChatCustomer/BindPop';
import local from '../uilts/localStorage';
import { generateTimeout, generateNonce, generateSignature, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
import { yesterday, lastSevent, month, getM, formatDate } from '../uilts/date';
import { Toolbar } from '../uilts/toolBarMixinFlow';
import Tab from '../components/colorPage/Tab';
import datainterval from '../components/detailFilter/datainterval';
export default {
  name: "Radar",
  components: { datainterval, Tab, BindPop },
  props: [],
  data() {
    return {
      state: 'list',
      atData: [],
      show: false,
      Bindshow: false,
      config: {},
      treeData: {
        0: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
            title: 6
          },
        },
        1: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
            title: 6
          },
        },
        2: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
            title: 6
          },
        },
        3: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
            title: 6
          },
        },
        4: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
            title: 6
          },
        },
        5: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
            title: 6
          },
        }
      },
      current: 1,
      total: 0,
      option1: [
        { text: '今日', value: 0 },
        { text: '昨日', value: 1 },
        { text: '近七日', value: 2 },
        { text: '本月', value: 3 },
        { text: '上月', value: 4 },
        { text: '自定义', value: 5 },
        { text: '全部', value: 6 },
      ],
      value1: 6,
      search: '',
      sourceTypeMap: {
        "0": "H5",
        "1": "乐语",
        "2": "微信",
        "3": "QQ",
        "4": "微博",
        "5": "微信朋友圈",
        "6": "微信小程序",
        "7": "短信",
        "8": "邮箱",
        "9": "QQ空间",
        "10": "二维码",
        "11": "钉钉",
        "12": "百度小程序",
        "13": "海报",
        "14": "字节小程序",
      },
      value: "",
      sourcePop: false,
      sourceValue: {},
      pageValue: {},
      sourceactions: [
        { name: "H5", value: 0 },
        { name: "乐语", value: 1 },
        { name: "微信", value: 2 },
        { name: "QQ", value: 3 },
        { name: "微博", value: 4 },
        { name: "微信朋友圈", value: 5 },
        { name: "微信小程序", value: 6 },
        { name: "短信", value: 7 },
        { name: "邮箱", value: 8 },
        { name: "QQ空间", value: 9 },
        { name: "二维码", value: 10 },
        { name: "全部", value: '' },
      ],
      pagePop: false,
      pageactions: [
        { name: "个人名片", value: 0 },
        { name: "动态/软文/彩页", value: 1 },
        { name: "店铺首页", value: 2 },
        { name: "详情页", value: 3 },
        { name: "分类页", value: 4 },
        { name: "全部", value: '' },
      ],
      module: {
        module1: false,
        module1Type: "",
        date: "",
        nolately: "",
        nolatelykey: "",
        nolatelyShow: false,
        yetslately: "",
      },
      diyTime: {
        timestart: "",
        endtime: "",
      },
      dateShow: false,
      TimeType: "",
      currentDate: new Date(),
      tabArray: [
        { title: "全部", id: 0 },
        { title: "名片", id: 1 },
        { title: "微站", id: 2 },
        { title: "文章", id: 3 },
        { title: "登录用户", id: 4 },
        { title: "匿名用户", id: 5 },
      ],
      fromType: 0, // 销售雷达传入的参数
      pageType: -1, // 销售雷达传入的参数
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
      id: 0,
      start: "【",
      end: "】",
      compId: '',
    };
  },
  mixins: [Toolbar],
  watch: {
    Bindshow(val, oldVal) {//普通的watch监听
      if (val) {
        this.$toast.clear()
      }
    },
  },
  computed: {},
  methods: {
    async getList(cur) {
      if (this.compId === '') return;
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      let params = {
        to: this.$U || local.U(),
        compId: this.$C || local.C(),
        nonce: nonce,
        timeout: timeout,
        signature: signature,
        current: cur || 1,
        size: 20,
        fromType: this.fromType
      }
      if (this.module.date !== '' && this.module.date !== '全部') {
        params.startTime = this.module.date.replace('至', ',').split(',')[0] ?? "";
        params.endTime = this.module.date.replace('至', ',').split(',')[1] ?? "";
      }
      if (this.pageType != -1) {
        params.pageType = this.pageType;
      }
      this.$get('/api/request/itr/comp/trajectory/result', {
        params,
      })
        .then((res) => {
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
                item.visitorPortrait ? from.visitorPortrait = item.visitorPortrait : from.visitorPortrait = item.toPortrait; // 兼容企业微信头像
              }
            })
            let qq = this.treeData[this.id];
            qq.data = (cur == 1 || cur == undefined) ? allArr : qq.data.concat(allArr);
            qq.config.total = res.totalPageCount;
            this.treeData = JSON.parse(JSON.stringify(this.treeData))
            this.atData = JSON.parse(JSON.stringify(this.treeData[this.id].data))  // 传入当前数组
            this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
          } else {
            this.atData = [];
          }
          this.$toast.clear();
        })
        .catch((error) => {
          this.$toast.fail('请求失败，请稍后再试');
          this.$toast.clear();
        });
    },
    getDescription(title, pageType) {
      return this.pageTypeMap[pageType] + this.start + title + this.end;
    },
    ColorIds(index) {
      this.id = this.tabArray[index].id;
      this.value1 = this.treeData[this.id].config.title; // 回显上面的日期筛选
      if (index == 0 || index == 1 || index == 2 || index == 3) {
        this.fromType = 0;
      } else if (index == 4) {
        this.fromType = 1;
      } else {
        this.fromType = 2;
      };
      console.log(index)
      if (index == 0 || index == 4 || index == 5) {
        this.pageType = -1;
      } else if (index == 1) {
        this.pageType = 0
      } else if (index == 2) {
        this.pageType = 2;
      } else if (index == 4) {
        this.pageType = 1
      } else if (index == 3) {
        this.pageType = 1
      };
      if (this.treeData[this.id].config.total == -1) { // == -1 证明第一次点击该标签a
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 1000,
          overlay: true,
        });
        this.getList();
      } else {
        this.atData = this.treeData[this.id].data;
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
    refreshEmptys() {
      this.config.current = 0;  // 总页
    },
    searchs() {
      this.show = true;
    },
    menuChange(value) {
      console.log(value)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 800,
        overlay: true,
      });
      if (value == 1) {
        this.module.date = [yesterday(-1, '-'), yesterday(-1, '-')].join('至');
        console.log(this.module.date)
      } else if (value == 2) {
        this.module.date = [lastSevent(-7), formatDate(new Date())].join('至');
      } else if (value == 3) {
        this.module.date = [month().timeStar, month().timeend].join('至');
        console.log([month().timeStar, month().timeend])
      } else if (value == 4) {
        this.module.date = [getM()[0], getM()[1]].join('至');
      } else if (value == 5) {
        this.module.date = '全部';
      } else if (value == 0) {
        this.module.date = [getM()[3], getM()[3]].join('至');
      }
      console.log(this.module.date)
      if (value !== 5) { // 如果是5那么就不保存他的title
        this.treeData[this.id].config.title = value;  // 总页数
      }
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 置顶
      this.treeData[this.id].config.current = 1 // 重置页数
      this.treeData = JSON.parse(JSON.stringify(this.treeData))
      this.config = JSON.parse(JSON.stringify(this.treeData[this.id].config));  // 总页数
      if (value == 5) {
        this.show = true;
      };

      this.getList()
      this.module.date = '';
    },
    source() {
      this.sourcePop = true;
    },
    onSelectStatus(val) {
      this.sourceValue = val;
      this.sourcePop = false;
    },
    onSelectPage(val) {
      this.pageValue = val;
      this.pagePop = false;
    },
    page() {
      this.pagePop = true;
    },
    lately() {
      this.module.module1 = true;
      this.dateShow = false;
      this.diyTime.timestart = "";
      this.diyTime.endtime = "";
      setTimeout(() => { // 初始化自定义的时间
        this.$refs.dataInt.reast()
      }, 100)
    },
    timeDatas(data) {
      this.module.date = data[0] + '至' + data[1];
    },
    updatings(data) {  // 子组件更新日期，返回数组，【2015-09-15，2016-10-16】
      console.log(data)
      data[1] == 7 ? this.module.date = "全部" : this.module.date = data[0].join().replace(',', '至')
      this.module.module1 = false; // 关闭弹框
    },
    Timeok(item) {
      if (this.TimeType == 'start') {
        this.diyTime.timestart = formatDate(item)
      } else {
        this.diyTime.endtime = formatDate(item);
      }
      console.log(this.diyTime)
      this.$refs.dataInt.DiyTime(); // 关闭弹框
      this.dateShow = false;
    },
    TimeCancel() {
      this.dateShow = false;
    },
    empty() { // 清空搜索表单
      this.module.date = '';
      this.value = '';
      this.pageValue = {
        name: '',
        value: ''
      }
      this.sourceValue = {
        name: '',
        value: ''
      }
    },
    Save() { // 搜索
      if (this.compId === '') return;
      sessionStorage.setItem('searchView', JSON.stringify({ value: this.value, date: this.module.date, sourceValue: this.sourceValue, pageValue: this.pageValue }))
      this.$router.push({
        path: '/searchView',
      })
      this.show = true;
      // this.empty()
    },
    back() {
      this.show = false;
      this.value1 = this.treeData[this.id].config.title; // 回显类型
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = this.treeData[this.id].config.scroll; // 设置每个页面的scrollTop
      })
    },
    scrollToTop() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.id].config.scroll = scrollTop;
    },
    async initMineInfo() { // 获取当前店铺url地址，店铺ID 。
      await this.$get("/itver/remote/user/profile", {
        params: {
          userId: this.$U || local.U(),
          curLogin: this.$U || local.U(),
        },
      })
        .then((res) => {
          if (res?.mall?.url !== null) {
            this.shopId = res.mall.title;
          }
        })
        .catch((error) => {
          console.log(error)
        });
    },
    async getShopDetail() { // 拉去
      let signature = generateSignature(this.shopId, nonce, timeout);
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo")).id;
      let param = new URLSearchParams();
      param.append("id", this.shopId);
      param.append("nonce", nonce);
      param.append("timeout", timeout);
      param.append("signature", signature);
      param.append("clientType", 2);
      param.append("promote", userinfo);
      await this.$post1('/view/remote/mall/shop/detail', param)
        .then((res) => {
          if (res.compId) {
            this.compId = res.compId;
          } else {
            this.$toast.fail(res.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
    async init() {
      await this.initMineInfo()
      await this.getShopDetail()
      this.getList();
    },
    async BindCompletes() { // 关闭弹框
      this.Bindshow = false;
      await this.getUserinfo();  // 重新拉去信息接口
    }
  },
  async created() {
    this.loading();
    console.log('3445')
    // if (sessionStorage.getItem('userinfo')) {
    //   this.loading()
    //   await this.initMineInfo()
    //   await this.getShopDetail()
    //   this.getList();
    // } else {
    //   this.$toast.fail({
    //     message: '此模块不支持聊天工具栏。',
    //     forbidClick: true,
    //     duration: 0,
    //     overlay: true,
    //   });
    // }
  },
  activated() {
    // this.show = false;
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
.radar {
  font-size: 0.32rem;
  .contar {
    display: flex;
    height: 48px;
    z-index: 999;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: #fff !important;
    border-bottom: 1px solid #e5e5e5;
    /deep/ .van-dropdown-menu {
      flex: 3;
    }
    .searchIcon {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  /deep/ .van-search {
    padding: 7px 12px;
  }
  .bcc {
    display: block;
    display: flex;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 44px;
    border: none;
    color: #fff;
    button {
      flex: 1;
    }
  }
  .module {
    padding: 15px;
    .module > div {
      border-radius: 5px;
    }
    .one {
      border-radius: 10px;
      margin-bottom: 10px;
      /deep/ .van-cell__title {
        max-width: 90px;
      }
      /deep/ .van-cell__value span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        width: 4rem;
        display: block;
        white-space: nowrap;
      }
    }
    .two {
      border-radius: 10px;
      margin-bottom: 10px;
    }
    .three {
      border-radius: 10px 10px 0 0;
    }
    .four {
      border-radius: 0 0 10px 10px;
    }
  }
  /deep/ .van-tabs__wrap {
    border-top: 1px solid #eee;
  }
  /deep/ .van-dropdown-item .van-popup--top {
    top: 44px;
  }
}
</style>