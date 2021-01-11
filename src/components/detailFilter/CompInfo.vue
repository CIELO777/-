<template>
  <div class="compInfo">
    <van-popup v-model="compshows" position="bottom" :style="{ height: '100%' }">
      <template v-if="route == 'addcustomer' || route == 'LinkDetailed' || route == 'shareUser'">
        <van-search v-model="SearchValue" placeholder="请输入搜索关键词" @input="searchChange" />
        <div id="abc" @scroll="scrollEventselect" :style="{ height: height }">
          <template v-if="route != 'shareUser'">
            <div v-for="(item,index) in list" :key="index" class="chooseView" @click="clickItem(item)">
              <div class="img-text">
                <p>{{item.name}}</p>
                <p>所属者： {{user[item.ownerId] ? user[item.ownerId].nickname  :""}}（{{item.encrypt}}）</p>
              </div>
            </div>
            <button @click="goBack" class="backBtn">
              返回
            </button>
          </template>
          <template v-else>
            <div v-for="(item,index) in list" :key="index" class="orderViews">
              <van-checkbox @change="checkChange(item,index)" v-model="item.check" style="margin-right:10px;"></van-checkbox>
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
            <div class="btn">
              <van-button @click="goBack">
                返回
              </van-button>
              <van-button @click="shareOk" color="rgb(81, 187, 186)">
                共享
              </van-button>
            </div>
          </template>

        </div>

      </template>
      <template v-if="route == 'detailfilter'">
        <!-- <div class='text-ali'>
          <van-icon name="arrow-left" @click="goBack" /><span>{{title}}</span>
        </div> -->
        <div id="abc" @scroll="scrollEventselect" :style="{ height: height }">
          <div v-for="(item,index) in list" :key="index" class="chooseView" @click="clickItem(item)">
            <div class="createManView">
              <div class="img"><img :src="item.portrait" alt=""></div>
              <div class="text">
                <p><span>{{item.nickname}}</span><span>({{item.userId}})</span></p>
                <p><span>{{item.groupName}}</span><span>{{item.nodeName}}</span><span>{{item.roleName}}</span></p>
              </div>
            </div>
          </div>
        </div>
        <button @click="goBack" class="backBtn">
          返回
        </button>
      </template>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'compInfo',
  props: ['title', 'height', 'compshow', 'list', 'user', 'totalPageCounts', 'companys', 'route'],
  data() {
    return {
      current: 1,
      SearchValue: "",
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
    },
    scrollEventselect() { //未选列表滚动
      let read = document.querySelector('#abc')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (scrollTop + windowHeight == scrollHeight && scrollTop > 15) {
        this.current = ++this.current;
        console.log('到底', this.current, this.totalPageCounts);
        if (this.totalPageCounts < this.current) return;
        this.$toast.loading('加载中...');
        if (this.SearchValue !== '') {  // 如果搜索框上有文字那么就触发搜锁
          console.log(this.current);
          if(this.route == 'shareUser'){ // 区分是哪个页面调用的
            this.$emit('touchSearchs',[this.SearchValue, this.current])

          }else {
            this.$parent.searchs([this.SearchValue, this.current]);
          }
        } else {
          if(this.route == 'shareUser'){ // 区分是哪个页面调用的
            this.$emit('changeCur',this.current)
          }else {
            this.$parent.compList(this.current);
          }

        }
      }
    },
    clickItem(item) {
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
    searchChange(value, cur) {
      this.current = 1;
      let abc = document.querySelector('#abc')
      abc.scrollTop = 0; // 清除滚动条位置
      if (value === '') {
        if(this.route == 'shareUser'){ // 区分是哪个页面调用的
          this.$emit('changeCur',1)
        }else {
          this.$parent.compList(1);
        }
      } else {
        this.$emit('search', value, this.current)
      }
    },
    close() {
      this.$emit('update:compshow', false)
    },
    checkChange(item, index) { // 共享客户选择
      // console.log(item, index)
      this.$emit('Changecheck',item,index)
      // this.list[d].check = i.check;  // 更改当前数据选中状态
    },
    shareOk(){ // 共享确认
      this.$emit('shareOk')
      
    }
  },
  created() {
    // console.log(this.height);
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
    // height: calc(100% - 94px);
    overflow-y: scroll;
    margin-bottom: 40px;
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
          max-width: 5rem;
        }
        p:last-child {
          overflow: hidden;
          //   text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 6rem;
          color: #aaaaaa;
          font-size: 13px;
        }
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
      padding: 3px;
    }
  }
  .btn {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgb(81, 187, 186);
    height: 44px;
    border: none;
    color: #fff;

    button {
      width: 50%;
    }
  }
}
</style>