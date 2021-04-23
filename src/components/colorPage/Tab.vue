/*
 * @Author: YUN_KONG 
 * @Date: 2021-01-12 13:43:19 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-04-05 19:04:10
 * 此模块用于彩页视频顶部tab
 */
<template>
  <div class="tab">
    <van-tabs
      :lazy-render="false"
      v-model="active"
      @change="tabsChange"
      color="#51BBBA"
    >
      <template v-for="(item, index) in tabArrays">
        <van-tab ref="dataNum" :title="item.title" :key="index">
          <!-- <keep-alive> -->
          <VideoPage
            v-bind="$attrs"
            v-on="$listeners"
            :configs="configs"
            :datas="datas"
            :states="states"
            :userMaps="userMaps"
            :ref="`videoView${index}`"
            :key="index"
            v-if="videoID == item.id && $route.name == 'Video'"
          ></VideoPage>

          <ColorView
            v-bind="$attrs"
            v-on="$listeners"
            @currentChange="currentChanges"
            v-if="id == item.id && $route.name == 'ColorPage'"
            :key="index"
            :ref="`colorView${index}`"
            :datas="datas"
            :trajectoryCounts="trajectoryCounts"
            :userMaps="userMaps"
            :configs="configs"
            :formCounts="formCounts"
            :states="states"
          ></ColorView>

          <AdvertorialView
            v-bind="$attrs"
            v-on="$listeners"
            v-if="id == item.id && $route.name == 'Advertorial'"
            :key="index"
            :ref="`AdvertorialView${index}`"
            :datas="datas"
            :trajectoryCounts="trajectoryCounts"
            :userMaps="userMaps"
            :configs="configs"
            :formCounts="formCounts"
            :states="states"
          ></AdvertorialView>

          <documentView
            v-bind="$attrs"
            v-on="$listeners"
            v-if="videoID == item.id && $route.name == 'Document'"
            :key="index"
            :ref="`documentView${index}`"
            :datas="datas"
            :userMaps="userMaps"
            :configs="configs"
            :states="states"
          ></documentView>

          <PosterView
            v-bind="$attrs"
            v-on="$listeners"
            v-if="videoID == item.id && $route.name == 'Poster'"
            :key="index"
            :ref="`PosterView${index}`"
            :datas="datas"
            :userMaps="userMaps"
            :configs="configs"
            :states="states"
          >
          </PosterView>

          <OrderView
            v-bind="$attrs"
            v-on="$listeners"
            v-if="videoID == item.id && $route.name == 'Order'"
            :key="index"
            :ref="`OrderView${index}`"
            :datas="datas"
            :configs="configs"
            :states="states"
          >
          </OrderView>

          <RadarViews
            v-bind="$attrs"
            v-on="$listeners"
            v-if="videoID == item.id && $route.name == 'Radar'"
            :key="index"
            :datas="datas"
            :configs="configs"
            :states="states"
            :ref="`RadarView${index}`"
          >
          </RadarViews>

          <VerbalView
            v-bind="$attrs"
            v-on="$listeners"
            v-if="videoID == item.id && $route.name == 'Verbal'"
            :key="index"
            :datas="datas"
            :configs="configs"
            :states="states"
            :userMaps="userMaps"
            :ref="`Verbal${index}`"
          >
          </VerbalView>
          <!-- </keep-alive> -->
        </van-tab>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import ColorView from '../../components/colorPage/ColorView';
import VideoPage from '../../components/video/VideoPage';
import AdvertorialView from '../../components/Advertorial/AdvertorialView';
import documentView from '../../components/poster/documentView';
import PosterView from '../../components/poster/PosterView';
import OrderView from '../../components/Order/OrderView';
import RadarViews from '../../components/RadarView/RadarViews';
import VerbalView from '../verBal/VerbalView';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "tab",
  inheritAttrs: true,
  props: ['tabArrays', 'datas', 'trajectoryCounts', 'userMaps', 'configs', 'formCounts', 'states'],
  data() {
    return {
      active: 0,
      id: 1,
      list: [],
      trajectoryCount: {},
      userMap: {},
      formCount: {},
      totalPageCount: 0,
      visitor: 0,
      page: {
        current: 1,
        size: 20
      },
      videoID: 0,
      category: 0,
      pageType: -1, // 销售雷达传入的参数
      fromType: 0 // 销售雷达传入的参数
    };
  },
  watch: {},
  computed: {},
  methods: {
    tabsChange(index) {
      this.id = this.tabArrays[index].id;
      this.videoID = this.tabArrays[index].id;
      // if (this.$route.name == 'Video') {
      //   this.$emit('ColorId', index) // 点击tab 获取用户点击的id，穿父组件

      // }
      this.$emit('ColorId', index) // 点击tab 获取用户点击的id，穿父组件
    },
    getList() {  // 获取当前列表
      let categroyId = sessionStorage.getItem("colorId")
      let signature = generateSignature3(
        this.$U,
        timeout,
        nonce
      );
      let data = {
        userId: this.$U,
        category: this.category,
        type: 5,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
        current: this.page.current,
        size: 20,
        categroyId
      }
      this.$get("/api/request/itr/page/recommend/result", {
        params: data,
      })
        .then((res) => {
          this.trajectoryCount = res.trajectoryCount;
          this.userMap = res.user;
          res.formCount.forEach(item => {
            this.formCount[item.id] = item.counts;
          })
          res.trajectoryCount.forEach(item => {
            this.trajectoryCount[item.id] = item.counts;
          })
          this.totalPageCount = res.totalPageCount;
          this.loading = false;
          this.list = this.list.concat(res.data).map(item => {
            return {
              ...item,
              time: item.lastUpdateTime.split(' ')[0]
            }
          });
          console.log(this.list)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    currentChanges() {  // 子组件页面触发下拉页数，这时候++CURRENT并请求数据操作；
      console.log('来了老弟')
      this.$emit('mySonChagne')
    }

  },
  created() {
    console.log(this.$route.name)
    // this.getList()
  },
  mounted() {
    // console.log(this.datas)

  },
  components: { RadarViews, OrderView, ColorView, VideoPage, AdvertorialView, documentView, PosterView, VerbalView }
};
</script>

<style lang="less" scoped>
.tab {
  // position: fixed;
  // left: 0;
  // right: 0;
  // top: 50px;
  // z-index: 999;
  /deep/ .van-tabs__wrap {
    // 兼容vant tabar 修改部分样式
    position: fixed;
    top: 48px;
    left: 0px;
    width: 100%;
    height: 44px;
    margin-bottom: 3px;
    z-index: 999;
    /deep/ .van-tabs__nav--line {
      padding-bottom: 14px;
    }
  }
}
</style>