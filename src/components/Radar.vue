<template>
  <div class='rader'>
    <div class='product' v-for="(item,index) in recordList" :key="index" @click="productClick(item)">
      <img :src='item.portrait + "?x-oss-process=image/resize,m_fill,h_200,w_200"' />
      <div class='content'>
        <span class='toh'><span class="toTit">{{item.nickname}}</span><span v-if="item.approve == 1" style="margin:0 5px" class='approve'>V</span><span class='member' v-if="item.member == 1">会员</span><span class="des">{{item.createTime}}来自{{sourceTypeMap[item.sourceType]}}</span></span>
        <span class='toh desc'>{{ item.description}}</span>
      </div>
    </div>
    <van-empty v-show="empty" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无相关消息" />
  </div>
</template>

<script>
import local from '../uilts/localStorage';
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';
let timeout = generateTimeout();
import { ScorllMixin } from '@/uilts/mixins'

let nonce = generateNonce();
export default {
  name: 'Radar',
  mixins: [ScorllMixin],
  data() {
    return {
      optMap: {
        "0": "正在访问",
        "1": "浏览了"
      },
      pageTypeMap: {
        "0": "",
        "1": "你的文章",
        "2": "你的店铺",
        "3": "你的商品详情页",
        "4": "你的商品分类页",
        "5": "",
        "6": "",
        "7": "",
        "8": "",
        "9": "",
      },
      sourceTypeMap: {
        "0": "H5",
        "1": "乐语",
        "2": "微信",
        "3": "QQ",
        "4": "微博",
        "5": "微信朋友圈",
        "6": "微信小程序",
        "7": "短信",
        "8": "邮箱",
        "9": "QQ空间",
        "10": "二维码",
        "11": "钉钉",
        "12": "百度小程序",
        "13": "海报",
      },
      total: 0,
      start: "【",
      end: "】",
      recordList: [],
      empty:false,
    }
  },
  methods: {
    getDescription(title, pageType) {
      return this.pageTypeMap[pageType] + this.start + title + this.end;
    },
    getRadar() { // 获取雷达列表
      let that = this;
      let phone = JSON.parse(sessionStorage.getItem('_crm_info'))?.phone;
      let signature = generateSignature3(this.$C || local.C(), timeout, nonce);
      this.$get('/api/request/itr/comp/trajectory/result', {
        params: {
          to: this.$U || local.U(),
          compId: this.$C || local.C(),
          fuzzy: phone,
          nonce: nonce,
          timeout: timeout,
          signature: signature,
          current: this.current,
          size: 20,
        },
      })
        .then(function (res) {
          if (!res.error) {
            let allArr = [];
            res.data.forEach(item => {
              let from = item.from;
              if (from) {
                from = JSON.parse(from);
                from.optType = item.optType;
                from.pageType = item.pageType;
                from.sourceType = item.sourceType;
                from.createTime = item.createTime;
                from.leaveTime = item.leaveTime;
                from.to = item.to;
                from.toName = item.toName;
                from.toPortrait = item.toPortrait;
                from.status = 0;
                if (from.leaveTime) {
                  from.status = 1;
                }
                from.description = that.optMap[from.status] + that.getDescription(item.description, from.pageType);
                allArr.push(from);
              }
            })
            that.recordList = that.current == 1 ? allArr : that.recordList.concat(allArr);
            if (that.recordList.length == 0) that.empty = true; //如果数据大于0，就显示空信息
            that.total = res.totalPageCount;
            that.$toast.clear()

          }
        })
        .catch(function (error) {
          that.$toast.fail('请求失败，请稍后再试');
        });
    },
    productClick(data) { //点击雷达跳转
      sessionStorage.setItem('visitor_info', JSON.stringify(data));
      this.$router.push('/radardetail')
    }
  },
  computed: {
    getIndex() {
      return this.$store.state.current.radar
    }
  },
  watch: {
    getIndex(val) {
      this.current = val;
      if (this.total < this.current) return;
      this.$toast.loading('加载中...');
      this.getRadar();
    },
  },
  created() {
    this.getRadar()
  }
}
</script>

<style lang="less" scoped>
.rader {
  margin-top: 0.8rem;
  .product {
    padding: 10px 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    margin-top: 1px;
    background-color: #fff;
    img {
      height: 1rem;
      width: 1rem;
      border-radius: 5px;
    }
    .content {
      flex: 1;
      padding-left: 0.4rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: calc(~"100% - 50px");
      max-width: calc(100% - 50px);
      .toh {
        font-size: 14px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 25px;
        .toTit {
          font-size: 15px;
          font-weight: 600;
        }
        .approve {
          font-size: 14px;
          font-style: italic;
          font-weight: bold !important;
          color: #f2711c !important;
        }
        .member {
          background-color: #f7831c;
          color: #fff;
          display: inline-block;
          padding: 0px 3px;
          line-height: 15px;
          border-radius: 2px;
          text-align: center;
          margin-left: 5px;
        }
        .des {
          padding-left: 5px;
        }
      }
    }
  }
}
</style>