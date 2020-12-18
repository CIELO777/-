<template>
  <div class="datainterval">
    <div v-show="common">
      <p>选择日期区间</p>
      <van-cell title="今日" @click="clickCell(1)" />
      <van-cell title="昨日" @click="clickCell(2)" />
      <van-cell title="近七日" @click="clickCell(3)" />
      <van-cell title="本月" @click="clickCell(4)" />
      <van-cell title="上月" @click="clickCell(5)" />
      <van-cell title="自定义" @click="clickCell(6)" />
      <van-cell title="全部" @click="clickCell(7)" />
    </div>
    <div v-show="!common" class="diyTime">
      <p>
        <van-icon name="arrow-left" @click="goback" />日期区间<span color="#fff"><span @click="DiyTime"></span></span>
      </p>
      <van-cell title="起始时间" @click="lately('start')" :value="start">
      </van-cell>
      <van-cell title="截止时间" @click="lately('end')" :value="endtime">
      </van-cell>
    </div>

  </div>
</template>

<script>
import { yesterday, lastSevent, month, getM, formatDate } from '../../uilts/date';
export default {
  props: ['modules', 'shows', 'type', 'module'],
  name: "datainterval",
  data() {
    return {
      common: true,
      currentDate: false,
      start: "",
      endtime: "",

    }
  },
  methods: {
    clickCell(type) {
      if (type === 1) {
        this.$emit('updating', [formatDate(new Date()), formatDate(new Date())], 1)
      } else if (type === 2) {
        this.$emit('updating', [yesterday(-1, '-'), yesterday(-1, '-')], 2)
      } else if (type === 3) {
        this.$emit('updating', [lastSevent(-7), formatDate(new Date())], 3)
      } else if (type === 4) {
        this.$emit('updating', [month().timeStar, month().timeend], 4)
      } else if (type == 5) {
        this.$emit('updating', [getM()[0], getM()[1]], 5)
      } else if (type === 6) {
        this.common = false;
      } else if (type === 7) {
        this.$emit('updating', "", 7)

      }
    },
    goback() { // 自定义回退
      this.common = true;
    },
    lately(data) {
      this.$emit('update:shows', true);
      this.$emit('update:type', data); // 给父组件是开始还是结尾
    },
    DiyTime() {
      this.start = this.module.timestart;
      this.endtime = this.module.endtime;
      if (this.module.endtime === "" || this.module.timestart === "") {
        this.$toast({
          message: '起始时间和截止时间为必选项',
          position: 'bottom',
        })
      } else {
        this.$emit('timeData', this.start, this.endtime)
        this.$emit('update:modules', false);
        this.common = true; // 选择完重置页面，
      }

    },
    reast() {
      this.start = "";
      this.endtime = "";
    }
  }
}
</script>

<style lang="less" scoped>
.datainterval {
  padding: 10px;
  p {
    text-align: center;
  }
  .diyTime {
    p {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .diyTime > div {
      margin: 10px;
    }
  }
}
</style>