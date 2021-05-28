<template>
  <div class="order">
    <div class="orderTit" @click="orderItemClick">
      <div>
        <van-icon name="records" size="17" />
      </div>
      <span>新增订单</span>
    </div>
    <div class="orderCont" v-if="orderList.length > 0">
      <div
        v-for="(item, index) in orderList"
        @click="handelClickOrderItem(item.id)"
        :key="index"
        style="border-bottom: 1px solid #f1f1f1"
      >
        <div class="main-order">
          <div>
            <div class="line1">
              <span>客户信息：</span>
              <span class="bold">{{ item.receiptName }}</span>
            </div>
            <div class="line1">
              <span>推广昵称：</span>
              <span class="qs-gray">{{ item.promoteName }}</span>
            </div>
            <div class="line1">
              <span>订单金额：</span>
              <span class="qs-red bold">{{ item.total }} 元</span>
            </div>
            <div class="line1">
              <span>付款状态：</span>
              <span
                :class="item.paymentStatus == 0 ? 'qs-blue' : 'qs-green'.bold"
                >{{ item.paymentStatus == 0 ? "未支付" : "已支付" }}</span
              >
            </div>
          </div>
          <div>
            <div class="line1">
              <span>提成状态：</span>
              <span
                :class="
                  item.commissionStatus == 0
                    ? 'qs-red'
                    : item.commissionStatus == 1
                    ? 'qs-green'
                    : 'qs-red'
                "
                >{{
                  item.commissionStatus == 0
                    ? "未确认"
                    : item.commissionStatus == 1
                    ? "提成有效"
                    : "提成无效"
                }}</span
              >
            </div>
            <div class="line1">
              <span class="qs-gray">推广人员：</span>
              <span class="qs-gray">{{
                item.promote === "undefined" || item.promote === null
                  ? "无"
                  : item.promote
              }}</span>
            </div>
            <div class="line1">
              <span class="qs-gray">支付方式：</span>
              <span class="qs-gray">{{ item.paymentTypeName }}</span>
            </div>
            <div class="line1">
              <span>发货状态：</span>
              <span :class="item.supplyStatus == 0 ? 'qs-blue' : 'qs-green'">{{
                item.supplyStatus == 0 ? "未发货" : "已发货"
              }}</span>
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
    <van-empty
      v-else
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关消息"
      class="null"
    />
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import { ScorllMixin } from '@/uilts/mixins';
import local from '../uilts/localStorage';

export default {
  name: 'order',
  mixins: [ScorllMixin],
  data() {
    return {
      orderList: [],
      current: 1,
      total: 0,
      empty: false,
    }
  },
  methods: {
    orderItemClick() {  // 跳转到订单表单页面
      let userInfo = JSON.parse(sessionStorage.getItem('_crm_info')); // 默认给显示选中的姓名手机； 
      this.$router.push({
        name: 'OrderDetail',
        params: {
          add: true,
          name: userInfo.nickname,
          phone: userInfo.phone,

        }
      })
    },
    getOrderList() {
      let that = this;
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      this.$get('/api/request/mall/order/query', {
        params: {
          compId: this.$C || local.C(),
          current: this.current,
          size: 20,
          customerId: crmInfo,
          nonce,
          signature,
          timeout,
        },
      })
        .then(function (res) {
          if (!res.error) {
            that.orderList = that.current == 1 ? res.data : that.orderList.concat(res.data);
            that.total = res.totalPageCount;
            if (that.orderList.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.$toast.clear()
          }
        })
        .catch(function (error) {
          that.$toast.fail('请求失败，请稍后再试');

        });
    },
    handelClickOrderItem(id) { // 跳转到详细页面
      this.$router.push({
        path: `/orderdetailinfo/${id}`,
      })
    },

  },
  created() {
    // console.log('created')
    this.getOrderList();
    this.current = 1;
  },
  computed: {
    getIndex() {
      return this.$store.state.current.order
    }
  },
  watch: {
    getIndex(val) {
      this.current = val;
      if (this.total < this.current) return;
      this.$toast.loading('加载中...');
      this.getOrderList();
    },
  },
  activated() {
    // console.log('activated')
    document.documentElement.scrollTop = document.body.scrollTop = this.$store.state.scroll.order; // 设置每个页面的scrollTop
  },
}
</script>

<style lang="less" scoped>
.order {
  background: #f1f1f1;
  font-size: 15px;
  height: 100vh;
  .orderTit {
    z-index: 998;
    display: flex;
    background: #fff;
    margin-top: 0.2rem;
    height: 0.8rem;
    align-items: center;
    color: #468af1;
    position: fixed;
    width: 100%;
    left: 0;
    height: 0.8rem;
    top: 114px;
    border-bottom: 8px solid #f1f1f1;
    border-top: 8px solid #f1f1f1;
    padding-left: 0.3rem;
    i {
      margin-right: 0.2rem;
    }
  }
  .orderCont {
    // padding: 8px 8px;
    background-color: #fff;
    padding-top: 3.5rem;
    .main-order {
      padding: 0px 0.2rem;
      // background-color: #fff;
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
      height: 0.48rem;
      display: flex;
      span {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 2rem;
      }
    }
    .qs-red {
      color: #c42400;
    }
    .qs-blue {
      color: #0000ff;
    }
    .qs-gray {
      color: #6b6969;
    }
    .order-date {
      background-color: #fff;
      font-size: 14px;
      padding: 10px 0;
    }
    .pl {
      padding-left: 0.2rem;
    }
  }

  .van-empty {
    background: #f1f1f1;
    padding-top: 186px;
  }
}
</style>