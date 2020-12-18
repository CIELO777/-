<template>
  <div class="compInfo">
    <van-popup v-model="compshows" position="bottom" :style="{ height: '100%' }">
      <template v-if="route == 'addcustomer' || route == 'LinkDetailed'">
        <div class='text-ali'>
          <van-icon name="arrow-left" @click="goBack" /><span>公司信息</span>
        </div>
        <div id="abc" @scroll="scrollEventselect">
          <div v-for="(item,index) in list" :key="index" class="chooseView" @click="clickItem(item)">
            <div class="img-text">
              <p>{{item.name}}</p>
              <p>所属者： {{user[item.ownerId] ? user[item.ownerId].nickname  :""}}（{{item.encrypt}}）</p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="route == 'detailfilter'">
        <div class='text-ali'>
          <van-icon name="arrow-left" @click="goBack" /><span>{{title}}</span>
        </div>
        <div id="abc" @scroll="scrollEventselect">
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
      </template>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'compInfo',
  props: ['title', 'compshow', 'list', 'user', 'totalPageCounts', 'companys', 'route'],
  data() {
    return {
      current: 1
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
    },
    scrollEventselect() { //未选列表滚动
      let read = document.querySelector('#abc')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight && scrollTop > 15) {
        console.log('到底');
        this.current = ++this.current;
        if (this.totalPageCounts < this.current) return;
        this.$toast.loading('加载中...');
        this.$parent.compList(this.current);
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
    close() {
      this.$emit('update:compshow', false)
    },

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
    height: calc(~"100% - 46px");
    overflow-y: scroll;
    margin-top: 46px;
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
          max-width: 4rem;
        }
        p:last-child {
          overflow: hidden;
          //   text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 4rem;
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
}
</style>