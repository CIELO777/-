/*
 * @Author: YUN_KONG 
 * @Date: 2021-02-07 16:29:18 
 * @Last Modified by: Tian
 * @Last Modified time: 2021-07-19 10:56:32
 */
<template>
  <div
    class="OrderView"
    :style="{
      height: datas.length > 5 ? 'calc(100% - 100px)' : '100vh',
    }"
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
        <div class="orderCont">
          <div
            v-for="(item, index) in datas"
            @click="handelClickOrderItem(item.id, item)"
            :key="index"
            style="border-bottom: 1px solid #f1f1f1; margin-bottom: 8px"
          >
            <div class="main-order">
              <div>
                <div class="line1">
                  <span>客户信息：</span>
                  <span class="bold">{{ item.receiptName }}</span>
                </div>
                <div class="line1">
                  <span>推广昵称：</span>
                  <span class="qs-gray">{{
                    item.promoteName ? item.promoteName : "无"
                  }}</span>
                </div>
                <div class="line1">
                  <span>订单金额：</span>
                  <span class="qs-red bold">{{ item.total }} 元</span>
                </div>
                <div class="line1">
                  <span>付款状态：</span>
                  <span
                    :style="{
                      color:
                        item.paymentStatus == 0
                          ? '#E34A38'
                          : item.paymentStatus == 1
                          ? '#26802A'
                          : '#f18e2c',
                    }"
                    >{{
                      item.paymentStatus == 0
                        ? "未支付"
                        : item.paymentStatus == 1
                        ? "已支付"
                        : "部分支付"
                    }}</span
                  >
                </div>
              </div>
              <div>
                <div class="line1">
                  <span>提成状态：</span>
                  <span :class="item.commissionColor">{{
                    item.commissionTitle
                  }}</span>
                </div>
                <div class="line1">
                  <span class="qs-gray">推广人员：</span>
                  <span class="qs-gray">{{
                    item.promote === "undefined" ? "" : item.promote
                  }}</span>
                </div>
                <div class="line1">
                  <span class="qs-gray">支付方式：</span>
                  <span class="qs-gray">{{ item.paymentTypeName }}</span>
                </div>
                <div class="line1">
                  <span>发货状态：</span>
                  <span
                    :style="{
                      color:
                        item.supplyStatus == 0
                          ? '#0000ff'
                          : item.supplyStatus == 1
                          ? '#26802A'
                          : '#f18e2c',
                    }"
                    >{{
                      item.supplyStatus == 0
                        ? "未发货"
                        : item.supplyStatus == 1
                        ? "已发货"
                        : "部分发货"
                    }}</span
                  >
                </div>
              </div>
              <div>
                <van-icon size="20px" color="#AAA" name="arrow" />
              </div>
            </div>
            <div class="order-date">
              <span class="qs-gray line1 pl"
                ><span style="color: #2c3e50">下单时间：</span
                >{{ item.createTime }}</span
              >
            </div>
          </div>
        </div>
      </van-list>
      <van-empty
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: "OrderView",
  components: {},
  props: ['datas', 'configs', 'states'],
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      showShare: false,
      ShareContent: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    onRefresh() {
      this.$emit('refreshEmpty')
      this.finished = false;
      this.loading = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.onLoad();
    },
    onLoad() {
      if (this.configs.current >= this.configs.total) {
        this.finished = true;
        return;
      }
      if (this.states == 'list') {
        this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      } else {
        let cur = ++this.configs.current;
        this.$emit('onSearch', cur) // 触发爷组件方法更新数据下一页

      }
      setTimeout(() => {
        this.loading = false;
      }, 1800)
    },
    handelClickOrderItem(id, item) {

      this.$router.push({
        path: `/orderdetailinfo/${id}`,
      })
    },
  },
  created() { },
  mounted() { }
};
</script>

<style lang="less" scoped>
.OrderView {
  background: #f1f1f1;
  font-size: 15px;
  .orderCont {
    padding-top: 100px;
    .main-order {
      padding: 0px 0.2rem;
      background-color: #fff;
      font-size: 14px;
      margin-top: 2px;
      padding-top: 0.16rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .main-order div {
      flex: 1;
    }
    .main-order div span {
      font-size: 14px;
      line-height: 0.54rem;
    }
    .main-order div:last-child {
      flex: 0;
    }
    .main-order .line1 {
      height: 0.5rem;
      display: flex;
      span {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 2rem;
        font-size: 0.26rem;
      }
    }
    .qs-red {
      color: #c42400;
    }
    .qs-blue {
      color: #0000ff;
    }
    .qs-gray {
      color: #4c4a4a;
    }
    .order-date {
      background-color: #fff;
      font-size: 0.26rem;
      padding: 10px 0;
    }
    .pl {
      padding-left: 0.2rem;
    }
  }
  .orderCont:nth-child(2) {
    padding-top: 1.9rem;
  }
  .van-empty {
    background: #f1f1f1;
    padding-top: 160px;
  }
  /deep/ .van-pull-refresh__head {
    top: 100px;
  }

  .qs-org {
    color: #ff8000;
  }
  .qs-gray {
    color: #555;
  }
  .qs-red {
    color: #c42400;
  }
  .qs-blue {
    color: #0000ff;
  }
  .qs-green {
    color: #3d8329;
  }
}
</style>