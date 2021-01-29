<template>
  <div class="VideoPage">
    <div class="main" style="margin:35px 0px 0px 0px">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-if="datas.length > 0" finished-text="没有更多了" :immediate-check="false" v-model="loading" :finished="finished" finished-span="没有更多了" @load="onLoad">
          <div v-for="(item,index) in datas" :key="index" class="cont" @click="clickColor(item)">
            <div class="card" style="background:#fff;">
              <div class="bgc" :style="{backgroundImage:'url('+item.thumb+') ',height: backHeight +'px'}"></div>
              <div class="mask">
                <van-icon name="play" color="#fff" size="35" />
              </div>
            </div>
            <div style="line-height:25px;padding:5px 10px;background:#fff;  position: relative;">
              <div class="line1">{{item.description}}</div>
              <div class="ed">
                <div class="wa">

                  <van-icon name="eye-o" size='18' />
                  <span style="margin-right:5px">
                    {{item.visits}}
                  </span>
                  <van-icon name="share-o" size='18' />
                  {{item.shares}}
                </div>
                <div class="ca" @click.stop="createContent(item)">
                  <van-icon name="share" size='18' />
                </div>
              </div>

            </div>
          </div>
        </van-list>
        <van-empty v-else class="custom-image" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />
      </van-pull-refresh>
      <share :ShareContents="ShareContent" v-show="showShare" :showShares.sync="showShare"></share>

    </div>
  </div>
</template>

<script>
import share from '../../components/share'

export default {
  name: "VideoPage",
  components: {},
  props: ['datas', 'userMaps', 'configs', 'states'],
  data() {
    return {
      id: 0,
      screenWidth: document.body.clientWidth,     // 屏幕宽
      backWidth: 0,
      backHeight: 0,
      loading: false,
      finished: false,
      refreshing: false,
      ShareContent: {},
      showShare: false

    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {
    console.log('111')
    console.log(this.screenWidth)
    this.backWidth = this.screenWidth / 2;
    this.backHeight = this.backWidth * 1.5;
  },
  mounted() {

  },
  methods: {
    onRefresh() {
      this.$emit('refreshEmpty')
      this.refreshing = false;
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      if (this.configs.current >= this.configs.total) {
        this.finished = true;
        return;
      }
      if (this.states == 'list') {
        this.$emit('mySonChagne', this.configs.current) // 触发爷组件方法更新数据下一页
      } else {
        let cur = ++this.configs.current;
        this.$emit('onSearch', cur) // 触发爷组件方法更新数据下一页

      }
      setTimeout(() => {
        this.loading = false;
      }, 1000)
    },
    clickColor(item) {
      this.$router.push({
        name: 'Iframe',
        params: {
          url: item.url,
          title: item.title,
          desc: item.description,
          imgUrl: item.thumb

        }
      })
    },
    createContent(item) {
      console.log(item)
      this.showShare = true;
      this.ShareContent = {
        title: item.title,
        imgUrl: item.thumb,
        desc: item.description,
        url: item.url
      }
    }
  },
  components: {
    share
  }

};
</script>

<style lang="less" scoped>
.VideoPage {
  background: #eee;
  font-size: 0.32rem;
  padding-top: 70px;
  .cont {
    width: 50%;
    width: calc(100% / 2 - 5px);
    margin: 0 calc(5px / 2) 10px;
  }
  .van-list {
    display: flex;
    flex-wrap: wrap;
  }
  .card {
    position: relative;
  }
  .bgc {
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    background-color: #000;
    margin: 0 auto;
    position: relative;
    width: 100%;
  }
  .mask {
    width: 45px;
    height: 45px;
    border-radius: 100%;
    position: absolute;
    top: calc(50% - 22px);
    left: calc(50% - 22px);
    background-size: cover;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .ed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.26rem;
    color: #999;
  }
  .wa {
    display: flex;
    align-items: center;
  }
  .ca {
    display: flex;
    align-items: center;
    width: 27px;
    justify-content: flex-end;
  }
  /deep/ .van-list__loading {
    width: 100%;
  }
  /deep/ .van-list__finished-text {
    width: 100%;
  }
}
</style>