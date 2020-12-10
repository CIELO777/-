<template>
  <div class="orderList" @scroll="scrollEvent">
    <div v-for="(item,index) in orderList " :key="index" class="orderViews" @click="orderSelect(item.nickname,item.userId)">
      <img :src="item.portrait" alt="">
      <div class="orderText">
        <p><span>{{item.nickname}}</span><span>({{item.userId1}})</span></p>
        <p>
          <span>{{item.nodeName}}</span>
          <span>{{item.groupName}}</span>
          <span>{{item.roleName}}</span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3, randomWord } from '../uilts/tools';
import local from '../uilts/localStorage';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: 'orderList',
  data() {
    return {
      orderList: [],
      current: 1,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    orderSelect(name, id) {
      console.log(name, id);
      let data = {
        name,
        id,
      }
      sessionStorage.setItem('orderSelectInfo',JSON.stringify(data));
      this.$router.push('/OrderDetail')
      // this.$router.push({
      //   name: 'OrderDetail',
      //   params: {
      //     name,
      //     id
      //   }
      // })
    },
    scrollEvent() {  // 滚动触底方法
      let read = document.querySelector('.orderList')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (scrollTop + windowHeight == scrollHeight) {
        console.log('============到底了13123========');
        this.current = ++this.current;
        console.log(this.total, this.current);
        if (this.total < this.current) return;
        this.$toast.loading('加载中...');
        this.getList();
      }
    },
    getList() {
      let that = this;
      let staff_id = JSON.parse(sessionStorage.getItem('userinfo'))?.bind_staff_id;
      console.log(staff_id);
      let signature = generateSignature3(this.$C || local.C(), staff_id, timeout, nonce);
      this.$get('/api/request/itr/comp/staff/result', {
        params: {
          compId: this.$C || local.C(),
          current: this.current,
          nonce,
          queryStatus: 1,
          signature,
          size: 20,
          timeout,
          userId: staff_id,
        },
      })
        .then(function (res) {
          if (!res.error) {
            if (res.data && res.data.length > 0) {
              let datas = res.data.map(item => {
                var reg = /^(\d{3})\d{4}(\d{4})$/;
                item.userId1 = item.userId.replace(reg, "$1****$2");
                return item;
              });
              that.orderList = that.current == 1 ? datas : that.orderList.concat(datas);
              that.total = res.totalPageCount;
              that.$toast.clear()
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

  },
  destroyed() {
    this.current = 1;
  }
}
</script>

<style lang="less" scoped>
.orderList {
  font-size: 0.26rem;
  height: calc(~"100% - 46px");
  overflow-y: scroll;
  .orderViews {
    padding: 0 0.2rem;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    height: 1.2rem;
    display: flex;
    img {
      width: 1rem;
      height: 1rem;
      margin-right: 0.2rem;
    }
    .orderText {
      display: flex;
      flex-direction: column;
      justify-content: center;
      p:first-child {
        margin-bottom: 0.1rem;
        span:first-child {
          margin-right: 0.1rem;
        }
      }
      p:last-child span {
        margin-right: 0.16rem;
        color: #9c9c9c;
      }
    }
  }
}
</style> 