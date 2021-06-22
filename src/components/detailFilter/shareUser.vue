<template>
  <div class="shareUser">
    <van-popup
      v-model="shareshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <template v-if="shareshow && show == false">
        <div class="choose" style="margin-bottom: 44px" @scroll="scrollEvent">
          <div
            v-for="(item, index) in shareList"
            :key="index"
            class="orderViews"
            @click="orderSelect(item.nickname, item.userId)"
          >
            <img :src="item.portrait" alt="" />
            <div class="orderText">
              <p>
                <span>{{ item.nickname }}</span>
              </p>
              <p>
                <span>{{ item.userId1 }}</span>
              </p>
            </div>
            <van-button
              plain
              hairline
              size="mini"
              round
              type="danger"
              class="cencl"
              @click="cancelShare(item)"
              >取消共享</van-button
            >
          </div>
          <van-empty
            v-show="shareList.length == 0"
            description="暂无相关消息"
            class="empty"
          />
        </div>
        <div class="btn">
          <van-button @click="goback">返回</van-button>
          <van-button type="primary" @click="add" color="#51BBBA"
            >添加</van-button
          >
        </div>
      </template>
      <div v-if="show">
        <compInfo
          @initScroll="initScrolls"
          @shareOk="shareOks"
          @Changecheck="Changechecks(arguments)"
          @touchSearchs="touchSearch"
          @search="searchs(arguments)"
          @changeCur="changeCurs"
          @loading="loading"
          height="calc(100% - 136px)"
          route="shareUser"
          ref="compInfo"
          :totalPageCounts="total"
          :compshow.sync="show"
          @updatelists="clickshare(ids)"
          :list="shareList"
          @fastComp="fastComp"
        >
        </compInfo>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import local from '../../uilts/localStorage';
import compInfo from './CompInfo';
import communication from "../../uilts/communication";

export default {
  props: ['shareshow', 'ids'],
  data() {
    return {
      show: false,
      shareList: [],
      Search: "",
      current: 1,
      total: 0,
      queryType: 2
    }
  },
  methods: {
    initScrolls() {
      this.current = 1;
      let dom = document.querySelector('.choose');
      // console.log(dom)
      dom.scrollTop = 0;
    },
    goback() {
      communication.$emit("updatecrm", "msg"); // 清空followPage本地数据，
      this.$emit("closeShare")
      setTimeout(() => { // 延迟关闭，为了先让数据回显
        this.$emit('update:shareshow', false);
      }, 200)
    },
    cancelShare(item) { // 取消共享
      let a = JSON.parse(JSON.stringify(this.ids.split(',')))
      a.splice(a.findIndex(i => i == item.userId), 1)
      this.$emit('update:ids', a.join(','))
      let id = JSON.parse(sessionStorage.getItem('_crm_info'))?.id
      this.offShare(id + '|' + item.userId);
      this.getShareList(0, a.join(','), 1);
    },
    offShare(ids) {
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("from", ids);
      param.append("type", 7);  // 当前的ids
      param.append("userId", this.$U || local.U()); //queryStatus ==0 未共享列表
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("compId", this.$C || local.C());
      // param.append("signature", signature);

      this.$post1("/api/request/itr/comp/customer/opt", param)
        .then((res) => {
          console.log(res)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    add() {
      this.show = true;
      this.shareList.length = 0;
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 1000,
      });
      this.getShareList(1, this.ids, 1)
    },
    orderSelect(nickname, userId) {
      console.log(nickname, userId)
    },
    getShareList(filter, ids, cur) {
      //   console.log(filter, ids, queryStatus);
      // 请求自定义列表
      let compID =  this.$C || local.C();
      let signature = generateSignature3(
        compID,
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("compId", this.$C || local.C());
      param.append("userId", this.$U || local.U());
      param.append("current", cur || 1);
      param.append("filter", filter); // 0 是未过滤 1是可过滤
      param.append("ids", ids);  // 当前的ids
      param.append("queryStatus", 0); //queryStatus ==0 未共享列表
      param.append("size", 20);
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("queryType", this.queryType);
      this.$post1("/api/request/itr/comp/staff/ids/result", param)
        .then((res) => {
          let datas = res.data.map(item => {
            var reg = /^(\d{3})\d{4}(\d{4})$/;
            item.userId1 = item.userId.replace(reg, "$1****$2");
            return item;
          });
          this.shareList = (cur == 1 || cur == undefined) ? datas : this.shareList.concat(datas);
          this.total = res.totalPageCount
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clickshare(ids) { //触发请求共享联系人列表，由父元素调用
      this.getShareList(0, ids, this.current)
    },
    loading() {
      this.shareList.length = 0;
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 1000,
      });
    },
    changeCurs(cur) { // 数据请求分页
      this.getShareList(1, this.ids, cur);
    },
    searchs(value) { // 为共享资源的搜索接口
      // console.log(value[0])
      let compID =  this.$C || local.C();
      let signature = generateSignature3(
        compID,
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("compId", this.$C || local.C());
      param.append("current", value[1] || 1);
      param.append("fuzzy", value[0]); // 0 是未过滤 1是可过滤
      param.append("filter", 1); // 0 是未过滤 1是可过滤
      param.append("ids", this.ids);  // 当前的ids
      param.append("queryStatus", 0); //queryStatus ==0 未共享列表
      param.append("size", 20);
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("ownerType", nonce);
      this.$post1("/api/request/itr/comp/staff/ids/result", param)
        .then((res) => {
          let datas = [];
          if (res.data.length > 0) {
            datas = res.data.map(item => {
              var reg = /^(\d{3})\d{4}(\d{4})$/;
              item.userId1 = item.userId.replace(reg, "$1****$2");
              return item;
            });
            if (this.show) {
              datas = datas.map(item => {
                return {
                  ...item,
                  check: false,
                }
              })
            }
          } else {
            datas.length = 0;
          }
          this.shareList = value[1] === 1 ? datas : this.shareList.concat(datas);
          this.total = res.totalPageCount
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 触发上面方法
    touchSearch(value) {
      this.searchs(value)
    },
    Changechecks(value) { // 共享选择 更变数据中的check，这个就是选中的数据
      this.shareList[value[1]].check = value[0].check;
    },
    shareOks() { // 共享确认 ,check==true过滤userid
      let str = "";
      let data = [];
      let userId = [];
      this.shareList.forEach(item => {  // 当弹框关闭的时候找到过滤选中的ID
        if (item.check === true) {
          data.push(str + item.userId + '|' + 1);
          userId.push(item.userId);
        }
      })
      // console.log(userId.join(',') + ',' + this.ids)
      this.$emit('update:ids', userId.join(',') + ',' + this.ids)
      if (data.length == 0) {
        this.$toast({
          message: '请选择共享人',
          position: 'bottom',
        });
        return;
      }
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let ids = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let param = new URLSearchParams();
      param.append("from", ids);
      param.append("to", data.join(','));
      param.append("type", 6);  // 当前的ids
      param.append("userId", this.$U || local.U()); //queryStatus ==0 未共享列表
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("compId", this.$C || local.C());
      this.shareList.length = 0;
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 1000,
      });
      this.$post1("/api/request/itr/comp/customer/opt", param)
        .then((res) => {
          if (res.error == 'success') {
            this.$toast({
              message: '共享成功！',
              position: 'bottom',
            });
            this.show = false; // 关闭未共享员工列表
            this.getShareList(0, userId.join(',') + ',' + this.ids, 1, 1)
          } else {
            this.$toast({
              message: '共享失败，请稍后再试',
              position: 'bottom',
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    scrollEvent() {  // 已选列表滚动
      let read = document.querySelector('.choose')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      console.log(scrollTop, 'scroll', windowHeight, 'window', scrollHeight, 'scroll')
      if (scrollTop + windowHeight == scrollHeight) {
        console.log('============已选数据列表到底了========');
        this.current = ++this.current;
        if (this.total < this.current) return;
        this.$toast.loading('加载中...');
        this.getShareList(0, this.ids, 1, this.current)
      }
    },
    fastComp(data) {
      this.queryType = data;
      this.getShareList(1, this.ids, 1)
    }
  },
  created() {
  },
  components: { compInfo }
}
</script>

<style lang="less" scoped>
.shareUser {
  font-size: 0.26rem;
  background: #fff;
  height: 100%;
  overflow-y: scroll;
  .btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 44px;
    border: none;
    color: #fff;
    z-index: 99999;
    button {
      width: 50%;
    }
  }
  .orderViews {
    padding: 0 0.2rem;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    height: 1.2rem;
    display: flex;
    justify-content: space-between;
    img {
      width: 1rem;
      height: 1rem;
      margin-right: 0.2rem;
    }
    .orderText {
      flex: 1;
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
    .cencl {
      padding: 2px 5px;
    }
  }
  .choose {
    height: calc(~"100% - 46px");
    overflow-y: scroll;
  }
  .empty {
    width: 100%;
    height: 100%;
  }
}
</style>