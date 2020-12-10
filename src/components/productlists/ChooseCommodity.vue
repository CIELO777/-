<template>
  <div class="choose" @scroll="scrollEvent">
    <div class="backGo" @click="backgo">
      <van-icon name="arrow-left" size="17px" color="#fff" />
    </div>
    <van-button class="addbtn" size="mini" @click="addList" color="#5c5c5c">添加</van-button>
    <van-popup v-model="addListshow" position="bottom" closeable :style="{ height: '100%' }" @close="closePop">
      <div class='text-ali'>请选择详情页</div>
      <div id="abc" @scroll="scrollEventselect">
        <div v-for="(item,index) in list" :key="index" class="chooseView">
          <van-checkbox v-model="item.check" class="check" @change="checkChange(item,index)"></van-checkbox>
          <div class="img-text">
            <img :src="item.thumb" alt="">
            <div>
              <p>{{item.title}}</p>
              <p>{{item.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <div v-if="selectList.length > 0">
      <template v-for="(item,index) in selectList">
        <div :key="index" class="chooseViewselect">
          <img :src="item.thumb" alt="">
          <div class="chooseText">
            <p>{{item.title}}</p>
            <p>{{item.description}}</p>
          </div>
          <van-button class="delBTN" type="primary" color="red" size="mini" plain @click="dele(item.id)">移除</van-button>

        </div>
      </template>
    </div>
    <div v-else class="info">
      <div class="infoView">
        <van-icon name="info-o" size="50px" />
        <p>还没有选择详情页</p>
      </div>
    </div>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3, randomWord } from '../../uilts/tools';
import local from '../../uilts/localStorage';
let timeout = generateTimeout()
let nonce = generateNonce();
export default {
  name: 'ChooseCommodity',
  data() {
    return {
      addListshow: false,
      list: [],
      selectList: [],
      checked: false,
      current: 1,
      total: 0,
    }
  },
  methods: {
    getChooseList(filter) {   // filter 0已选列表。 1 全部列表
      let that = this;
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let nonce = randomWord(true, 32, 32)
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      let ids = sessionStorage.getItem('shelvesIds');
      let idss
      if (ids) {
        console.log(ids);
        console.log();
        idss = JSON.parse(ids).join(',')
      }
      this.$get('/api/request/mall/product/ids/result', {
        params: {
          compId: this.$C || local.C(),
          current: this.current,
          filter,
          ids: idss || "",
          model: 1,
          nonce,
          shelvesStatus: 1,
          signature,
          timeout,
        },
      })
        .then(function (res) {
          if (!res.error) {
            if (filter === 1) {
              let datas = res.data.map(item => {
                return {
                  ...item,
                  check: false,
                }
              });
              that.list = that.current == 1 ? datas : that.list.concat(datas);
              that.total = res.totalPageCount;
              that.$toast.clear()
            } else {
              that.selectList = that.current == 1 ? res.data : that.selectList.concat(res.data);
              that.total = res.totalPageCount;
              that.$toast.clear()
            }


          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    checkChange(i, d) {
      this.list[d].check = i.check;  // 更改当前数据选中状态
    },
    addList() { // 添加商品列表
      this.addListshow = true;
      this.current = 1;
      this.total = 0;
      this.getChooseList(1);

    },
    closePop() {
      let list = [];// 备份ID 给已选详情使用
      let listData = []; // 备份数据 给新增订单使用
      this.list.forEach(item => {  // 当弹框关闭的时候找到过滤选中的ID
        if (item.check === true) {
          list.push(item.id)
          listData.push(item);
        }
      })
      let shelvesIds = sessionStorage.getItem('shelvesIds')
      let shelvesData = sessionStorage.getItem('shelvesData')
      if (list.length !== 0) { // 证明选中东西了；
        if (!shelvesIds) {  // 如果之前没有东西，证明是第一次选中；数据存本地；
          sessionStorage.setItem('shelvesIds', JSON.stringify(list))  //选中iD 存入本地listData
          sessionStorage.setItem('shelvesData', JSON.stringify(listData))  //选中iD数据 存入本地
          this.getChooseList(0);
        } else {  // 证明之前选择过东西，这时候需要数组合并，吧之前选择的东西，和现在合并
          let allList = list.concat(JSON.parse(shelvesIds))
          let allListData = listData.concat(JSON.parse(shelvesData))
          sessionStorage.setItem('shelvesData', JSON.stringify(allListData))  //选中iD数据 存入本地
          sessionStorage.setItem('shelvesIds', JSON.stringify(allList))  //选中iD 存入本地listData
          this.getChooseList(0);
        }
      }
    },
    backgo() { // 点击上面的返回上一层按钮清空数据
      this.$router.go(-1);
    },
    scrollEvent() {  // 已选列表滚动
      let read = document.querySelector('.choose')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (scrollTop + windowHeight == scrollHeight) {
        console.log('============已选数据列表到底了========');
        this.current = ++this.current;
        if (this.total < this.current) return;
        this.$toast.loading('加载中...');
        this.getChooseList(0);

      }
    },
    scrollEventselect() { //未选列表滚动
      let read = document.querySelector('#abc')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight && scrollTop > 20) {
        console.log('到底了');
        this.current = ++this.current;
        console.log(this.total, this.current);
        if (this.total < this.current) return;
        this.$toast.loading('加载中...');
        this.getChooseList(1);
      }
    },
    dele(id) { // 移除商品
      let sIds = sessionStorage.getItem('shelvesIds');
      let shelveData = sessionStorage.getItem('shelvesData');
      console.log(sIds);
      if (sIds && JSON.parse(sIds).length > 1) { // 有商品ID 并且大于一个
        let qqs = JSON.parse(sIds).filter(item => item !== id)
        sessionStorage.setItem('shelvesIds', JSON.stringify(qqs))  // 重新设置本地数据；
        let finalArr = JSON.parse(shelveData).filter((item) => item.id !== id);  // 设置 列表数据
        sessionStorage.setItem('shelvesData', JSON.stringify(finalArr))  // 重新设置本地数据；
        this.getChooseList(0)
      } else if (sIds && JSON.parse(sIds).length == 1) { //  只剩一个
        sessionStorage.removeItem('shelvesIds')  // 如果不包含，只有一项商品ID了，这时候直接remove 就ok
        sessionStorage.removeItem('shelvesData')
        this.selectList = [];  // 不请求清空全部
      }
    }
  },
  created() {
    console.log('dsa');
    let shelevs = sessionStorage.getItem('shelvesIds');
    if (shelevs && JSON.parse(shelevs).length !== 0) { // 如果本地商品id为空，那么不让他进行请求
      this.getChooseList(0)
    }
  }
}
</script>

<style lang="less" scoped>
.choose {
  font-size: 0.28rem;
  background: #f1f1f1;
  height: calc(~"100% - 46px");
  overflow-y: scroll;
  .backGo {
    width: 1rem;
    height: 45px;
    position: fixed;
    top: 0;
    z-index: 999;
    left: 0;
    background: #5c5c5c;
    i {
      padding-top: 14px;
      padding-left: 16px;
    }
  }
  .addbtn {
    position: fixed;
    top: 3px;
    z-index: 999;
    right: 1px;
    width: 80px;
    height: 40px;
  }
  .chooseView {
    display: flex;
    height: 1.6rem;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    .check {
      margin-right: 0.3rem;
      margin-left: 0.2rem;
      flex-shrink: 0;
    }
    .img-text {
      display: flex;
      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        p:first-child {
          margin-bottom: 0.16rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 4rem;
        }
        p:last-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 4rem;
        }
      }
      img {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.2rem;
      }
    }
  }
  .chooseViewselect {
    padding: 0px 15px;
    background: #fff;
    height: 1.6rem;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    position: relative;
    display: flex;
    .chooseText {
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 3.6rem;
      }
    }
    .delBTN {
      position: absolute;
      right: 0.2rem;
      top: 50%;
      transform: translateY(-50%);
    }
    img {
      width: 1.2rem;
      margin-right: 0.2rem;
      height: 1.2rem;
    }
    p:first-child {
      margin-bottom: 0.16rem;
    }
  }
  .info {
    padding-top: 60%;
    .infoView {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      p {
        margin-top: 0.2rem;
      }
    }
  }
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
  }
  #abc {
    height: calc(~"100% - 46px");
    overflow-y: scroll;
    margin-top: 46px;
  }
}
</style>