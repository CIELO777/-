<template>
  <div class="compInfo">
    <van-popup
      v-model="compshows"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <template
        v-if="
          route == 'addcustomer' ||
          route == 'LinkDetailed' ||
          route == 'shareUser'
        "
      >
        <van-search
          v-model="SearchValue"
          placeholder="请输入搜索关键词"
          @input="searchChange"
        />
        <!-- 客户管理快捷搜索 -->
        <div class="shortcut" v-if="route == 'shareUser'">
          <button
            @click="fastComp(2)"
            :style="{ color: colorIdx == 2 ? 'red' : '#000' }"
          >
            本部门
          </button>
          <button
            @click="fastComp(1)"
            :style="{ color: colorIdx == 1 ? 'red' : '#000' }"
          >
            本分公司
          </button>
          <button
            @click="fastComp(0)"
            :style="{ color: colorIdx == 0 ? 'red' : '#000' }"
          >
            全部
          </button>
        </div>
        <div id="abc" @scroll="scrollEventselect" :style="{ height: height }">
          <!--route ==  LinkDetailed  公司信息-->
          <template v-if="route != 'shareUser'">
            <div
              v-for="(item, index) in list"
              :key="index"
              class="chooseView"
              @click="clickItem(item)"
            >
              <div class="img-text">
                <p>{{ item.name }}</p>
                <!-- <p v-if="route != 'addcustomer'">
                  所属者：
                  {{
                    user[item.ownerId] ? user[item.ownerId].nickname : ""
                  }}（{{ item.encrypt }}）
                </p> -->
              </div>
            </div>
            <button @click="goBack" class="backBtn">返回</button>
          </template>
          <!-- route == shareUser  共享  -->
          <template v-else>
            <div v-for="(item, index) in list" :key="index" class="orderViews">
              <van-checkbox
                @change="checkChange(item, index)"
                v-model="item.check"
                style="margin-right: 10px"
              ></van-checkbox>
              <img :src="item.portrait" alt="" />
              <div class="orderText">
                <p>
                  <span class="orderTit">{{ item.nickname }}</span>
                  <span class="member" v-if="item.member == 1">会员</span>
                </p>
                <p>
                  <span>{{ item.userId1 }}</span>
                </p>
              </div>
            </div>
          </template>
        </div>
        <div class="btn">
          <van-button @click="goBack"> 返回 </van-button>
          <van-button @click="shareOk" color="rgb(81, 187, 186)">
            共享
          </van-button>
        </div>
      </template>
      <template v-if="route == 'allocation'">
        <van-search
          v-model="SearchValue"
          placeholder="请输入搜索关键词"
          @input="searchChange"
        />
        <!-- 分配的快捷搜索栏 -->
        <div class="shortcut">
          <button
            @click="fastComp1(3)"
            :style="{ color: colorIdx1 == 3 ? 'red' : '#000' }"
          >
            最近分配
          </button>
          <button
            @click="fastComp1(2)"
            :style="{ color: colorIdx1 == 2 ? 'red' : '#000' }"
          >
            本部门
          </button>
          <button
            @click="fastComp1(1)"
            :style="{ color: colorIdx1 == 1 ? 'red' : '#000' }"
          >
            本分公司
          </button>
          <button
            @click="fastComp1(0)"
            :style="{ color: colorIdx1 == 0 ? 'red' : '#000' }"
          >
            全部
          </button>
        </div>
        <div id="abc" @scroll="scrollEventselect" :style="{ height: height }">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="chooseView"
            @click="allocationItem(item)"
          >
            <div class="createManView">
              <div class="img"><img :src="item.portrait" alt="" /></div>
              <div class="text">
                <p style="font-size: 15px; margin-bottom: 3px">
                  {{ item.nickname }}
                </p>
                <p style="font-size: 13px; color: #9c9c9c">
                  {{ item.userId1 }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button @click="goBack" class="backBtn">返回</button>
      </template>
      <template v-if="route == 'detailfilter'">
        <!-- <div class='text-ali'>
          <van-icon name="arrow-left" @click="goBack" /><span>{{title}}</span>
        </div> -->
        <div id="abc" @scroll="scrollEventselect" :style="{ height: height }">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="chooseView"
            @click="clickItem(item)"
          >
            <div class="createManView">
              <div class="img"><img :src="item.portrait" alt="" /></div>
              <div class="text">
                <p>
                  <span>{{ item.nickname }}</span
                  ><span>({{ item.userId }})</span>
                </p>
                <p>
                  <span>{{ item.groupName }}</span
                  ><span>{{ item.nodeName }}</span
                  ><span>{{ item.roleName }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button @click="goBack" class="backBtn">返回</button>
      </template>
    </van-popup>
  </div>
</template>

<script>
import debounce from '../../uilts/debounce';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import communication from "../../uilts/communication";
import local from "../../uilts/localStorage";

export default {
  name: 'compInfo',
  props: ['title', 'height', 'compshow', 'list', 'user', 'totalPageCounts', 'companys', 'route'],
  data() {
    return {
      current: 1,
      SearchValue: "",
      colorIdx: 2,
      colorIdx1: 3,
      backItem: {},
    }
  },
  computed: {
    compshows: {
      get() {
        return this.compshow
      },
      set(v) {
      }
    },
  },
  methods: {
    goBack() {  // 关闭弹窗
      this.$emit('update:compshow', false)
      this.SearchValue = '';
      if (this.route == 'shareUser') { // 如果是共享联系人，那么就触发方法，目的展示共享联系人，更新list
        this.$emit('initScroll')
        this.$emit('loading');
        this.$emit('updatelists')
      }
      this.current = 1; // 清空页数
      let abc = document.querySelector('#abc')
      abc.scrollTop = 0; // 清除滚动条位置
      this.colorIdx1 = 3;
      this.colorIdx = 2;
    },
    scrollEventselect() { //未选列表滚动
      let read = document.querySelector('#abc')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      // console.log(scrollTop,parseInt(scrollTop) ,windowHeight, scrollHeight)
      if (parseInt(scrollTop) + windowHeight == scrollHeight && scrollTop > 15) {
        console.log('到底', this.totalPageCounts, this.current);
        if (this.totalPageCounts <= this.current) return;
        this.current = ++this.current;
        this.$toast.loading('加载中...');
        if (this.SearchValue !== '') {  // 如果搜索框上有文字那么就触发搜锁
          console.log(this.current);
          if (this.route == 'shareUser') { // 区分是哪个页面调用的
            this.$emit('touchSearchs', [this.SearchValue, this.current])
          } else if (this.route == 'LinkDetailed') {
            this.$parent.compList(this.current);

          } else {
            this.$parent.searchs([this.SearchValue, this.current]);
          }
        } else {
          if (this.route == 'shareUser') { // 区分是哪个页面调用的
            this.$emit('changeCur', this.current)
          } else if (this.route == 'allocation') {
            console.log(this.current)
            this.$emit('allocaCur', this.current)
          } else {
            console.log(this.current, 'asdsasa')
            this.$parent.compList(this.current);
          }
        }
      }
    },
    clickItem(item) {
      console.log(item)
      console.log(this.route)
      if (this.route == 'detailfilter') {// 
        if (this.title == '选择创建人') {
          this.$emit('update:companys2', item.userId)
        } else if (this.title == '选择所属人') {
          this.$emit('update:companys', item.userId);
        }
      } else {
        if (this.route == 'LinkDetailed') {
          this.$parent.FormSave(item.name, 'company', 'comp')
        }
        this.$emit('update:companys', item.name);
      }
      this.close()
    },
    allocationItem(item) {
      this.backItem = item;
      this.$dialog.confirm({
        title: '温馨提示',
        message: `确定要把该客户分配给 "${item.nickname}" 吗？`,
        beforeClose: this.active
      })
    },
    active(action, done) {
      done()
      if (action === 'confirm') {
        this.FENPEI()
      } else {
        done();
      }
    },
    FENPEI(data) {
      let ids = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let ownerType = JSON.parse(sessionStorage.getItem('_crm_info'))?.ownerType;
      let to = this.backItem.userId;
      let signature = generateSignature3(
        this.$C || local.C(),
        this.$U || local.U(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("from", ids);
      param.append("type", 2);  // 当前的ids
      param.append("to", to);  // 当前的ids
      param.append("userId", this.$U || local.U()); //queryStatus ==0 未共享列表
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("compId", this.$C || local.C());
      this.$post1("/api/request/itr/comp/customer/opt", param)
        .then((res) => {
          if (res.error == 'success') {
            if (ownerType == 0 || ownerType == 1 || ownerType == 2 || ownerType == 4) {
              this.$router.go(-1)
              let idx = sessionStorage.getItem('ManualIdx')
              communication.$emit("AssignContacts", Number(idx), this.backItem);
            } else {
              this.$router.go(-1)
              let str = JSON.parse(sessionStorage.getItem('userinfo')).nickname + '给' + this.backItem.nickname + '分配了一个联系人。'
              this.$store.commit("ManualUpdate", { target: "sheet", data: str });
              this.$store.commit("ManualUpdate", { target: "userId", data: this.backItem.userId });
              this.$store.commit("ManualUpdate", { target: "name", data: this.backItem.nickname });


            }
            this.$toast('分配成功')
          }
        })
        .catch((error) => {

          console.log(121321, error);
        });
    },
    searchChange(value) {
      this.current = 1;
      let abc = document.querySelector('#abc')
      abc.scrollTop = 0; // 清除滚动条位置
      if (value === '') {
        if (this.route == 'shareUser') { // 区分是哪个页面调用的
          this.$emit('changeCur', 1)
        } else {
          console.log('清空；额')
          this.$parent.compList(1);
        }
      } else {
        if (this.route === 'LinkDetailed') {
          this.$parent.searchcompList(this.current, value);
        } else {
          this.$emit('search', value, this.current)
        }
      }
    },
    close() {
      this.$emit('update:compshow', false)
    },
    checkChange(item, index) { // 共享客户选择
      // console.log(item, index)
      this.$emit('Changecheck', item, index)
      // this.list[d].check = i.check;  // 更改当前数据选中状态
    },
    shareOk() { // 共享确认
      this.$emit('shareOk')
    },
    emptyCur() {
      this.current = 1
    },
    fastComp: debounce(function (type) {
      this.current = 1;
      this.colorIdx = type;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.$emit('fastComp', type)
    }, 200),
    fastComp1: debounce(function (type) {
      this.current = 1;
      this.colorIdx1 = type;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.$emit('allocationChange', type)
    }, 200)
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
.compInfo {
  font-size: 0.32rem;
  .text-ali {
    position: fixed;
    top: -1px;
    left: 0px;
    text-align: center;
    width: 100%;
    font-size: 16px;
    height: 46px;
    line-height: 52px;
    background: #5c5c5c;
    color: #fff;
    i {
      float: left;
      line-height: 48px;
      padding-left: 5px;
    }
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // padding: 10px;
    // box-sizing: border-box;
  }
  #abc {
    height: calc(100% - 100px);
    overflow-y: scroll;
    margin-bottom: 42px;
    .chooseView {
      display: flex;
      flex: 1;
      height: 1.3rem;
      padding: 0 10px;
      border-bottom: 1px solid #f1f1f1;
      overflow: hidden;
      align-items: center;
      .img-text {
        p:first-child {
          margin-bottom: 0.16rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 6rem;
        }
        // p:last-child {
        //   overflow: hidden;
        //   //   text-overflow: ellipsis;
        //   white-space: nowrap;
        //   max-width: 6rem;
        //   color: #aaaaaa;
        //   font-size: 13px;
        // }
      }
      .createManView {
        display: flex;
        align-items: center;
        justify-content: center;
        .img {
          flex: 1;
          margin-right: 10px;
          img {
            width: 1rem;
            height: 1rem;
            overflow: hidden;
            object-fit: cover;
          }
        }
        .text {
          flex: 4;
          display: flex;
          flex-direction: column;
          p:first-child {
            span:first-child {
              color: #000;
              font-size: 0.32rem;
              margin-right: 0.1rem;
            }
            span:last-child {
              color: #aaaaab;
              font-size: 15px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 80%;
            }
          }
          p:last-child {
            margin-top: 5px;
            span:first-child {
              color: #aaaaab;
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 80%;
              margin-right: 3px;
            }
            span:nth-child(2) {
              color: #aaaaab;
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 80%;
              margin-right: 3px;
            }
            span:nth-child(3) {
              color: #aaaaab;
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 80%;
            }
          }
        }
      }
    }
  }
  .backBtn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 44px;
    font-size: 16px;
    background: rgb(81, 187, 186);
    color: #fff;
    border: none;
  }
  .orderViews {
    padding: 0 0.2rem;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    height: 1.2rem;
    display: flex;
    font-size: 0.26rem;
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
        margin-bottom: 0.2rem;
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
      padding: 3px;
    }
  }
  .btn {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 44px;
    border: none;
    color: #fff;
    z-index: 999999;
    button {
      width: 50%;
    }
  }
  .shortcut {
    height: 40px;
    width: 100%;
    display: flex;
    background: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    align-items: center;
    flex-shrink: 0;
    padding: 0 13px;
    box-sizing: border-box;
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
      margin-right: 12px;
    }
  }
  .orderTit {
    font-size: 0.32rem;
    font-weight: 540;
  }
  .member {
    background-color: #f7831c;
    color: #fff;
    font-size: 20rpx !important;
    display: inline-block;
    padding: 0px 3px;
    line-height: 15px !important;
    border-radius: 2px;
    text-align: center;
    margin-left: 5px;
  }
}
</style>