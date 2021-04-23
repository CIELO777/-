<template>
  <div class="orderInfo">
    <!--pages/distrbution/crm/detail/order/order.wxml-->
    <div class="qs-title bg-color-f0">
      <span>客户信息</span>
    </div>
    <div class="cell">
      <div>
        <span>客户姓名：</span>
      </div>
      <div>
        <span> {{ orderInfo.receiptName }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>客户手机：</span>
      </div>
      <div>
        <span class="qs-blue" style="display: flex">
          <span style="margin-right: 5px">{{ orderInfo.receiptMobile }} </span
          ><span @click="particulars" style="margin-left: 80px"
            >查看详情</span
          ></span
        >
      </div>
    </div>
    <div class="cell">
      <div>
        <span>客户地址：</span>
      </div>
      <div>
        <span>
          {{
            !orderInfo.receiptProvince
              ? "暂未填写地址信息"
              : orderInfo.receiptProvince == 0
              ? ""
              : orderInfo.receiptProvince
          }}
          {{
            !orderInfo.receiptCity
              ? ""
              : orderInfo.receiptCity == 0
              ? ""
              : orderInfo.receiptCity
          }}{{
            !orderInfo.receiptArea
              ? ""
              : orderInfo.receiptArea == 0
              ? ""
              : orderInfo.receiptArea
          }}{{
            !orderInfo.receiptAddress
              ? ""
              : orderInfo.receiptAddress == 0
              ? ""
              : orderInfo.receiptAddress
          }}</span
        >
      </div>
    </div>

    <div class="qs-title bg-color-f0">
      <span>商品信息</span>
    </div>
    <div
      class="product-cell"
      v-for="(item, index) in orderInfo.products"
      :key="index"
    >
      <div>
        <img
          :src="item.thumb + '?x-oss-process=image/resize,m_fill,h_200,w_200'"
        />
      </div>
      <div class="item">
        <div>
          <span class="qs-green line1">{{ item.title }}</span>
        </div>
        <div>
          <span>价格:</span><span class="qs-red">{{ item.price }}元</span>
        </div>
        <div>
          <span>数量:</span><span class="qs-red">{{ item.amount }}</span>
        </div>
      </div>
    </div>
    <div class="qs-title bg-color-f0">
      <span>订单信息</span>
    </div>
    <div class="cell">
      <div>
        <span>订单ID：</span>
      </div>
      <div>
        <span> {{ orderInfo.id }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>创建时间：</span>
      </div>
      <div>
        <span> {{ orderInfo.createTime }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>买家留言：</span>
      </div>
      <div>
        <span> {{ orderInfo.loginRemark || "无" }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>订单备注：</span>
      </div>
      <div>
        <span> {{ orderInfo.remark || "无" }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>商品摘要：</span>
      </div>
      <div>
        <span> {{ orderInfo.title }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>订单金额：</span>
      </div>
      <div>
        <span> {{ orderInfo.total }}元</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>实际支付：</span>
      </div>
      <div>
        <span>
          {{ orderInfo.actualTotal }} 元
          <span style="color: #f18e2c">{{
            orderInfo.paymentStatus == 1
              ? "已支付"
              : orderInfo.paymentStatus == 2
              ? "部分支付"
              : "未支付"
          }}</span></span
        >
      </div>
    </div>
    <div class="cell">
      <div>
        <span>余额抵扣：</span>
      </div>
      <div>
        <span> {{ orderInfo.balancePay }}元</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>会员卡支付：</span>
      </div>
      <div>
        <span> {{ orderInfo.cardPay }}元</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>积分兑换：</span>
      </div>
      <div>
        <span class="qs-blue"> {{ orderInfo.integralPay }}积分</span>
      </div>
    </div>

    <div class="cell">
      <div>
        <span>会员卡充值：</span>
      </div>
      <div>
        <span class="qs-blue"> {{ orderInfo.cardPay }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>收款方：</span>
      </div>
      <div>
        <span>
          {{ orderInfo.collectCompType == 0 ? "企业自收" : "平台代收" }}</span
        >
      </div>
    </div>
    <div class="cell">
      <div>
        <span>支付方式：</span>
      </div>
      <div>
        <span> {{ orderInfo.paymentTypeName }}</span>
      </div>
    </div>

    <div class="cell">
      <div>
        <span>支付模式：</span>
      </div>
      <div>
        <span> {{ orderInfo.paymentMode == 0 ? "自动" : "手动" }}</span>
      </div>
    </div>

    <div class="cell">
      <div>
        <span>开票状态：</span>
      </div>
      <div>
        <span> {{ orderInfo.billStatus == 0 ? "未开票" : "已开票" }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>运费：</span>
      </div>
      <div>
        <span> {{ orderInfo.freight || 0 }}元</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>发票抬头：</span>
      </div>
      <div>
        <span> {{ orderInfo.invoiceTitle || "无" }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>发货：</span>
      </div>
      <div>
        <span
          :style="{
            color:
              orderInfo.supplyStatus == 0
                ? '#0000ff'
                : orderInfo.supplyStatus == 1
                ? '#26802A'
                : '#f18e2c',
          }"
          >{{
            orderInfo.supplyStatus == 0
              ? "未发货"
              : orderInfo.supplyStatus == 1
              ? "已发货"
              : "部分发货"
          }}</span
        >
      </div>
    </div>
    <div class="cell">
      <div>
        <span>发货时间：</span>
      </div>
      <div>
        <span> {{ orderInfo.supplyTime }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>快递公司：</span>
      </div>
      <div>
        <span> {{ orderInfo.courierName }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>快递单号：</span>
      </div>
      <div>
        <span> {{ orderInfo.courierNumber }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>来源类型：</span>
      </div>
      <div>
        <span>
          {{
            orderInfo.pageType == 0
              ? "微网页"
              : orderInfo.pageType == 1
              ? "手机站群"
              : "APP"
          }}</span
        >
      </div>
    </div>
    <div class="cell">
      <div>
        <span>订单图片：</span>
      </div>
      <div>
        <span
          v-if="orderInfo.photos && orderInfo.photos + '' !== 'null'"
          class="qs-blue"
          @click="handelClickImage(orderInfo.photos)"
          >查看图片</span
        >
        <span v-else>无</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>页面来源：</span>
      </div>
      <div>
        <span> {{ orderInfo.source || "" }}</span>
      </div>
    </div>
    <div class="qs-title bg-color-f0">
      <span>分销提成</span>
    </div>
    <div class="cell">
      <div>
        <span>销售提成：</span>
        <!-- <p>{{orderInfo.cmsCustomerAmount}}</p>
        <p>{{orderInfo.cmsGroupAmount}}</p> -->
      </div>
      <div>
        <span> {{ orderInfo.cmsPromoteAmount || 0 }}元</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>提成状态：</span>
      </div>
      <div>
        <span :class="orderInfo.commissionColor">
          {{ orderInfo.commissionTitle }}
        </span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>销售昵称：</span>
      </div>
      <div>
        <span> {{ orderInfo.promoteName || "" }}</span>
      </div>
    </div>
    <div class="cell">
      <div>
        <span>手机号码：</span>
      </div>
      <div>
        <span>
          {{ orderInfo.promote === "undefined" ? "" : orderInfo.promote }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3, generateSignature } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
import { ImagePreview } from 'vant';

export default {
  name: 'OrderDetailInfo',
  data() {
    return {
      orderInfo: {}
    }
  },
  created() {
    let id = this.$route.params.id;
    let that = this;
    let signature = generateSignature(id, timeout, nonce);
    this.$get('/api/remote/mall/order/detail', {
      params: {
        id: id,
        timeout: timeout,
        nonce: nonce,
        clientType: 2,
        signature: signature
      },
    })
      .then(function (res) {
        if (!res.error) {
          res.products = JSON.parse(res.products);
          console.log(res.products);
          var title = '未确认';
          var color = 'qs-red'
          if (res.commissionStatus == 0) {
            if (res.cmsPromoteAmount == 0 && res.cmsCustomerAmount == 0 && res.cmsGroupAmount == 0) {
              title = '无提成'
              color = 'qs-org'
            }
          } else {
            if (res.commissionStatus == 1) {
              title = '提成有效'
              color = 'qs-green'
            } else {
              title = '提成无效'
              color = 'qs-org'
            }
          }
          // 处理图片，如果多张的话就隔离开
          console.log(res.photos)
          if (res.photos.indexOf(',') !== -1) {
            res.photos = res.photos.split(',')
          }
          res.commissionTitle = title;
          res.commissionColor = color;
          that.orderInfo = res;
          console.log(that.orderInfo);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log('laole')
    this.$nextTick(() => {
      document.documentElement.scrollTop = 0; // 设置每个页面的scrollTop
    })
  },
  activated() {
    console.log('activated')
    this.$nextTick(() => {
      document.documentElement.scrollTop = 0; // 设置每个页面的scrollTop
    })
  },
  beforeRouteEnter: (to, from, next) => {
    console.log(to.name, from.name)
    next(vm => {
      // vm.$store.commit("cache", "Order,OrderDetailInfo");
      if (to.name == 'OrderDetailInfo' && from.name == 'Order') {
      } else if (to.name == 'OrderDetailInfo' && from.name == 'LinkDetailed') {
        // vm.$store.commit("cache", "Order,OrderDetailInfo");
      }
    })
  },
  methods: {
    handelClickImage(img) {
      if (img instanceof Array) {
        ImagePreview(img);
      } else {
        ImagePreview([img]);
      }
    },
    particulars() {
      // 替换本地crminfo id 数据
      if (sessionStorage.getItem('_crm_info')) {
        let json = JSON.parse(sessionStorage.getItem('_crm_info'))
        json.id = this.orderInfo.customerId;
        sessionStorage.setItem('_crm_info', JSON.stringify(json))
      } else {
        sessionStorage.setItem('_crm_info', JSON.stringify({
          id: this.orderInfo.customerId
        }))
      }
      sessionStorage.setItem('tabNum', 0)
      this.$router.push('/linkDetailed')
    }
  }
}
</script>

<style lang="less" scoped>
.orderInfo {
  background: #f1f1f1;
  font-size: 0.3rem;
  .bg-color-f0 {
    background-color: #f0f0f5;
  }
  .qs-title {
    padding: 0.2rem;
  }
  .cell {
    padding: 0.2rem 0.2rem 0.2rem 0.4rem;
    display: flex;
    flex-direction: row;
    margin-bottom: 1px;
    font-size: 0.28rem;
    background-color: #fff;
  }
  .cell div:first-child {
    margin-right: 0.4rem;
    flex-shrink: 0;
  }
  .cell div:last-child span {
    word-break: break-all;
  }
  .product-cell {
    padding: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
  }

  .product-cell img {
    width: 80px;
    height: 80px;
  }

  .product-cell .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 15px;
    line-height: 21px;
    padding-left: 10px;
    span {
      white-space: nowrap; //不换行
      overflow: hidden; //超出隐藏
      text-overflow: ellipsis; //变成...
      display: inline-block;
      max-width: 250px;
    }
  }
  .qs-gray {
    color: #9c9c9c;
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
  .qs-org {
    color: #ff8000;
  }
}
</style>