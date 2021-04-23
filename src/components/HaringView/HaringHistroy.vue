<template>
  <div class="haringHistroy">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- :style="{ minHeight: HistroyData.length < 4 ? '100vh' : '' }" -->
      <van-list
        v-if="HistroyData.length > 0"
        class="vanList"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-span="没有更多了"
        @load="onLoad"
      >
        <div class="card" v-for="(item, index1) in HistroyData" :key="index1">
          <div class="imgView">
            <img :src="item.img" alt="" />
          </div>
          <div class="info">
            <div class="title1">
              <span class="name">
                {{
                  HistroyUser[item.user_id]
                    ? HistroyUser[item.user_id].nickname || HistroyUser.nickname
                    : ""
                }}</span
              >
              <span
                v-if="
                  HistroyUser[item.user_id]
                    ? HistroyUser[item.user_id].member == 1
                    : false
                "
                class="member"
                >会员</span
              >
            </div>
            <p class="ingo">
              {{
                HistroyUser[item.user_id]
                  ? HistroyUser[item.user_id].company || HistroyUser.company
                  : ""
              }}
            </p>
            <p class="message">
              {{ item.message }}
            </p>
            <p class="time12">{{ item.time1 }}</p>
          </div>
        </div>
      </van-list>
      <van-empty
        v-else
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无相关消息"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
import local from '../../uilts/localStorage';

export default {
  name: "HaringHistroy",
  components: {},
  props: [],
  data() {
    return {
      HistroyData: [],
      HistroyUser: {},
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      current: 1
    };
  },
  watch: {},
  computed: {},
  methods: {
    time(data) {
      return data.charAt(4) + data.charAt(5) + '月' + data.charAt(6) + data.charAt(7) + "日" + data.charAt(8) + data.charAt(9) + ':' + data.charAt(10) + data.charAt(11);
    },
    getList(cur) {
      this.$get("/itver/remote/social/result", {
        params: {
          curLid: this.$U || local.U(),
          current: cur | 1,
          size: 20,
        },
      })
        .then((res) => {
          if (res.data.length > 0) {
            this.HistroyUser = res.user;
            this.HistroyData = res.data.map(item => {
              return {
                ...item,
                img: res.user[item.user_id].portrait,
                time1: this.time(item.time)
              }
            });
            console.log(this.HistroyData)
            this.total = res.totalPageCount;

          } else {
            this.$toast('没有历史消息');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onLoad() {
      if (this.current >= this.total) {
        this.finished = true;
        return;
      } else {
        let cur = ++data;
        this.getList(cur)
      }
    },
    onRefresh() {
      this.finished = false;
      setTimeout(() => {
        this.refreshing = false;
      }, 1000);
      this.getList();
      setTimeout(() => {
        this.loading = false;
      }, 1800)
    }
  },
  created() {
    this.getList();
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.haringHistroy {
  background: #fff;
  font-size: 0.3rem;
  .card {
    display: flex;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    .imgView {
      img {
        width: 40px;
        height: 40px;
        border-radius: 25px;
        margin-right: 10px;
      }
    }
    .info {
    }
  }
  .member {
    background-color: #f7831c;
    color: #fff;
    font-size: 0.22rem !important;
    display: inline-block;
    padding: 0px 3px;
    line-height: 15px !important;
    border-radius: 2px;
    text-align: center;
    margin-left: 5px;
  }
  .title1 {
    display: flex;
    align-items: center;
    line-height: 23px;
  }
  .name {
    color: #4e4d5e;
  }
  .ingo {
    color: #767676;
    font-size: 0.25rem;
    line-height: 20px;
  }
  .message {
    font-size: 0.28rem;
    line-height: 20px;
  }
  .time12 {
    color: #767676;
    font-size: 0.25rem;
    line-height: 20px;
  }
  /deep/ .van-pull-refresh .van-pull-refresh__track {
    min-height: 100vh;
  }
  /deep/ .custom-image {
    height: 100vh;
  }
  /deep/ .van-empty {
    justify-content: flex-start !important;
  }
}
</style>