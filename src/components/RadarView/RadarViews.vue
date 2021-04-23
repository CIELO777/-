<template>
  <div
    class="radarViews"
    :style="{ 'padding-top': $route.name == 'SearchView' ? '0' : '93px' }"
  >
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-if="datas.length > 0"
        class="vanList"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-span="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in datas"
          @click="handelClickOrderItem(item)"
          :key="index"
          class="product"
        >
          <img
            :src="
              item.portrait + '?x-oss-process=image/resize,m_fill,h_200,w_200'
            "
          />
          <div class="content">
            <span class="toh"
              ><span class="toTit">{{ item.nickname }}</span
              ><span
                v-if="item.approve == 1"
                style="margin: 0 5px"
                class="approve"
                >V</span
              ><span class="member" v-if="item.member == 1">会员</span
              ><span class="des"
                >{{ item.createTime }}来自{{
                  sourceTypeMap[item.sourceType]
                }}</span
              ></span
            >
            <span class="toh desc">{{ item.description }}</span>
          </div>
        </div>
      </van-list>
      <van-empty
        v-else
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: "RadarViews",
  components: {},
  props: ['datas', 'configs', 'states'],
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      showShare: false,
      ShareContent: {},
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
      },
      total: 0,
      start: "【",
      end: "】",
      recordList: [],
      empty: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    onRefresh() {
      // this.$emit('refreshEmpty')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.onLoad();
    },
    onLoad() {
      console.log('来了')
      console.log(this.configs.current, this.configs.total)
      if (this.configs.current >= this.configs.total) {
        this.finished = true;
        return;
      }
      this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      setTimeout(() => {
        this.loading = false;
      }, 1800)
    },
    handelClickOrderItem(data) {
      sessionStorage.setItem('visitor_info', JSON.stringify(data));
      this.$router.push('/radardetail')
    },
  },
  created() {
    console.log(this.$route.name)
  },
  mounted() { },

};
</script>

<style lang="less" scoped>
.radarViews {
  padding-top: 93px;
  .product {
    padding: 10px 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    margin-top: 1px;
    background-color: #fff;
    img {
      height: 1rem;
      width: 1rem;
      border-radius: 5px;
    }
    .content {
      flex: 1;
      padding-left: 0.2rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: calc(~"100% - 50px");
      max-width: calc(100% - 50px);
      .toh {
        font-size: 0.26rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: .5rem;
        display: flex;
        align-items: center;
        .toTit {
          // font-size: 15px;
          font-weight: 600;
        }
        .approve {
          font-size: 0.28rem;
          font-style: italic;
          font-weight: bold !important;
          color: #f2711c !important;
        }
        .member {
          background-color: #f7831c;
          color: #fff;
          display: inline-block;
          padding: 1px 3px;
          line-height: 14px;
          border-radius: 2px;
          text-align: center;
          margin-left: 5px;
          font-size: 0.24rem;
          transform: scale(0.9, 0.9);
        }
        .des {
          padding-left: 5px;
        }
      }
    }
  }
}
</style>