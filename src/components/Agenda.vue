<template>
  <div class="agenda">
    <div class="agendaTit" @click="agendaItemClick">
      <div>
        <van-icon name="records" size="17" />
      </div>
      <span>添加日程</span>
    </div>
    <div class="agendaCont">
      <div class="schedule-main" v-for="(item,index) in scheduleList" :key="index" @click="AgendaDetail(item)">
        <h1>{{item.title}}</h1>
        <div class="smMain">
          <span class="qs-gray">{{item.time}}</span>
          <span :class="[item.status==0?'qs-org':'qs-green']" class="remind">{{item.status==0?'未提醒':'已提醒'}}</span>
        </div>
      </div>
      <van-empty v-show="empty" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />

    </div>
  </div>
</template>
<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();
import { ScorllMixin } from '@/uilts/mixins'

import local from '../uilts/localStorage';

export default {
  name: 'Agenda',
  mixins: [ScorllMixin],
  data() {
    return {
      scheduleList: [],
      total: 0,
      empty: false,
    }
  },
  methods: {
    agendaItemClick() {
      this.$router.push({
        name: 'Agendadetail',
        params: {
          id: 0,
          param: false,  // 判断是否是新增还是编辑，如果是编辑，那么就true，
        }
      })
    },
    getAgendaList() {  // 拉去列表
      let that = this;
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let signature = generateSignature3(crmInfo, this.$C || local.C(), timeout, nonce);
      this.$get('/api/request/itr/comp/customer/remind/result', {
        params: {
          ptId: crmInfo,
          compId: this.$C || local.C(),
          nonce: nonce,
          timeout: timeout,
          signature: signature,
          current: this.current,
          size: 20
        },
      })
        .then(function (res) {
          if (!res.error) {
            that.scheduleList = that.current == 1 ? res.data : that.scheduleList.concat(res.data);
            that.total = res.totalPageCount;
            if (that.scheduleList.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.$toast.clear()
          }
        })
        .catch(function (error) {
          that.$toast.fail('请求失败，请稍后再试');
        });
    },
    AgendaDetail(item) {
      this.$router.push({
        name: 'Agendadetail',
        params: {
          id: item.id,
          time: item.time,
          title: item.title,
          remindStatus: item.remindStatus,
          param: true,
        }
      })
    }
  },
  computed: {
    getIndex() {
      return this.$store.state.current.schedule
    }
  },
  watch: {
    getIndex(val) {
      this.current = val;
      if (this.total < this.current) return;
      this.$toast.loading('加载中...');
      this.getAgendaList();
    },
  },
  created() {
    this.getAgendaList();
    this.current = 1;

  }
}
</script>

<style lang="less" scoped>
.agenda {
  background: #f1f1f1;
  .agendaTit {
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
    top: 78px;
    border-bottom: 8px solid #f1f1f1;
    border-top: 8px solid #f1f1f1;
    padding-left: 0.3rem;
    i {
      margin-right: 0.2rem;
    }
  }
  .agendaCont {
    background-color: #fff;
    // padding: 8px 15px;
    .schedule-main {
      height: 1.2rem;
      background-color: #fff;
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3px 10px;
      h1 {
        font-size: 0.3rem;
        font-weight: 500;
        margin-bottom: 0.2rem;
        margin-top: 0.1rem;
        overflow: hidden;
      }
      .smMain {
        display: flex;
        justify-content: space-between;
      }
      // .remind {
      //   position: absolute;
      //   bottom: 5px;
      //   right: 10px;
      //   font-size: 28rpx;
      // }
    }
  }
  .agendaCont:nth-child(2) {
    margin-top: 1.9rem;
  }
  .qs-green {
    color: #3d8329;
  }
  .qs-gray {
    color: #9c9c9c;
    font-size: 15px;
  }
  .qs-org {
    color: #ff8000;
  }
  .van-empty {
    background: #f1f1f1;
  }
}
</style>