/*
 * @Author: YUN_KONG 
 * @Date: 2021-01-12 13:56:29 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-01-29 12:16:09
 8 此模块用于彩页，软文列表
 */
<template>
  <div class="colorView">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-if="datas.length > 0" class="vanList" finished-text="没有更多了" :immediate-check="false" v-model="loading" :finished="finished" finished-span="没有更多了" @load="onLoad">
        <!-- {{datas}} -->
        <div class="card" v-for="(item,index) in datas" :key="index" @click="clickColor(item)">
          <div class="info">
            <div v-if="visitor == 0" class="header">
              <div class="jino">
                <span :class="['tag',item.userId==uid?'bule-bg':'red-bg']">{{item.userId==uid?(item.draft==0?"已发布":"未发布"):"公司"}}</span>
                <img class="img" :src="item.thumb" />
                <div class="ldldl">{{item.time}}</div>
              </div>
              <div class="detail">
                <span class="title line1">{{item.title}}</span>
                <span v-if="visitor == 1" class="desc line2" style="line-height:20px;margin-right:10px;font-size:13px">{{item.description}}</span>
                <div class="desc line1" v-if="visitor == 0" style="margin-right:0px">
                  <div catchtap="handalClickFlow"> 流量 <span class="bule">{{trajectoryCounts[item.id]||0}}</span> </div>
                  <div catchtap="handalClickForm"> 表单 <span class="bule">{{formCounts[item.id]||0}}</span></div>
                  <div> 分享 <span>{{item.shareNumber}}</span></div>
                </div>
                <div class="line1 desc" style="font-size:14px">
                  {{userMaps[item.userId] ? (userMaps[item.userId].nickname ||userMaps.nickname): ""}}
                  <span v-if="userMaps[item.userId] ? (userMaps[item.userId].approve == 1 ||userMaps.approve): '' " class='approve'>V</span>
                </div>
              </div>
            </div>
          </div>
          <div class="other" v-if="visitor == 0" catchtap="handalClickManagement">
            <div>
            </div>
            <div class="shareA" @click.stop="createContent(item)">
              <van-icon name="share" />分享
            </div>
          </div>
        </div>
      </van-list>
      <van-empty v-else class="custom-image" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />
    </van-pull-refresh>
    <share :ShareContents="ShareContent" v-show="showShare" :showShares.sync="showShare"></share>

  </div>
</template>

<script>
import share from '../../components/share'

import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "colorView",
  components: { share },
  props: ['datas', 'trajectoryCounts', 'userMaps', 'formCounts', 'configs', 'states'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      uid: "",
      page: {
        current: 1,
        size: 20
      },
      cid: 1,
      category: 0,
      trajectoryCount: {},
      userMap: {},
      formCount: {},
      totalPageCount: 0,
      visitor: 0,
      ShareContent: {},
      showShare: false,

    };
  },
  watch: {

  },
  computed: {},
  methods: {
    onLoad() {  // 触底事件、
      console.log(this.configs.current , this.configs.total)
      if (this.configs.current >= this.configs.total) {
        this.finished = true;
        return;
      }
      console.log(this.states)
      if (this.states == 'list') {
        this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      } else {
        let cur = ++this.configs.current;
        this.$emit('onSearch', cur) // 触发爷组件方法更新数据下一页

      }
      // this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      setTimeout(() => {
        this.loading = false;
      }, 1000)

      // this.getList();
      // 加载状态结束
    },
    onRefresh() {  // 下拉刷新
      this.$emit('refreshEmpty')
      this.refreshing = false;
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    getList() {  // 获取当前列表
      // this.$toast.loading({
      //   message: '加载中...',
      //   forbidClick: true,
      //   loadingType: 'spinner',
      // });
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
    clickColor(item) {
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.url,
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb

        }
      })
    },
    createContent(item) {
      console.log(item)
      this.showShare = true;
      this.ShareContent = {
        title: item.title,
        imgUrl: item.thumb,
        desc: item.description,
        url: item.url
      }
    }
  },
  activated() {
    console.log('actived')
  },
  created() {
  },
};
</script>

<style lang="less" scoped>
.colorView {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 70px;
  .card {
    margin: 15px 0;
    background-color: #fff;
    padding: 10px;
    position: relative;
  }
  .card .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .card .other {
    position: absolute;
    bottom: 5px;
    right: 10px;
    height: 30px;
    width: 60px;
    color: #aaa;
    font-size: 24rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .tag {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 45px;
    height: 20px;
    border-radius: 0 0 10px 0;
    text-align: center;
    line-height: 20px;
    font-size: 0.24rem;
    color: #fff;
  }
  .red-bg {
    background-color: #e64a38;
  }
  .card .info .img {
    width: 90px;
    height: 90px;
  }
  .ldldl {
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 4px;
    color: #fff;
    left: 0;
    font-size: 14px;
    width: 90px;
    text-align: center;
  }
  .card .info .detail {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 30px;
  }
  .line1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .card .info .desc {
    color: #aaa;
    font-size: 16px;
    margin-right: 80px;
  }
  .card .info .desc view {
    display: inline;
    margin-left: 10px;
  }
  .bule {
    color: #1593ff;
  }
  .card .info .desc {
    color: #aaa;
    font-size: 28rpx;
    margin-right: 80px;
  }

  .line1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .header {
    display: flex;
    width: 100%;
  }
  .jino {
    position: relative;
  }
  .card .info .desc div {
    display: inline;
    margin-right: 10px;
  }
  .vanList {
    padding-top: 20px;
  }
  .shareA {
    font-size: 0.28rem;
    display: flex;
    color: #4d4b4b;
    align-items: center;
    i {
      margin-right: 0.06rem;
    }
  }
}
</style>