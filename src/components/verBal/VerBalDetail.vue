<template>
  <div class="verBalDetail">
    <div class="main">
      <div class="page-title">
        {{ item.title }}
      </div>
      <div class="page-author">
        <div class="img">
          <img
            :src="
              user.portrait + '?x-oss-process=image/resize,m_fill,h_200,w_200'
            "
            mode="widthFix"
          />
        </div>
        <div class="info">
          <div class="line1">
            {{ user.nickname
            }}<span
              v-if="user.approve == 1"
              style="margin: 0 5px"
              class="approve"
              >V</span
            >
            <span v-if="user.member == 1" style="margin: 0 5px" class="member"
              >会员</span
            >
          </div>
          <div class="line1">{{ user.company }} {{ item.time }}</div>
        </div>
      </div>
      <div></div>

      <div class="cont" v-for="(item, index) in item.content" :key="index">
        <!-- 文字 -->
        <div v-if="item.type == 0 && item.data != '&nbsp;'">
          <div class="cont-span" :style="item.allStyle">
            <span>{{ item.data }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerBalDetail",
  components: {},
  props: [],
  data() {
    return {
      user: {},
      item: {},
      CSS_JSON_TEMPLATE: {
        semicolon: ";",
        top: 'top:',
        left: 'left:',
        right: 'right:',
        height: 'height:',
        width: 'width:',
        widthAuto: "width: auto;",
        alignCenter: 'text-align:center;',
        color: 'color:',
        size: 'font-size:',
        space: 'letter-spacing:',
        indent: 'text-indent:',
        weight: 'font-weight:',
        background: "background:",
        m0auto: 'margin:0 auto;',
        radius: 'border-radius:',
        line_height: 'line-height:',
        style: "font-style:",
        align: "text-align:",
        decoration: "text-decoration:",
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    analysisJSONtoCss(data) {
      var styles = "";
      Object.keys(data).forEach(function (key) {
        if (global.util.isNotNull(this.CSS_JSON_TEMPLATE[key])) {
          if (key == 'size') {
            data[key] = data[key] + "px";
          }
          styles += this.CSS_JSON_TEMPLATE[key] + data[key] + this.CSS_JSON_TEMPLATE.semicolon;
        }
      });
      return styles;
    },
    isNull(val) {
      if (val && val != "" && val != "null" && val != "nil" && val != null) {
        return false;
      }
      return true;
    },
    isNotNull(val) {
      return !this.isNull(val);
    },
    parseCont() {
      let item = this.item;
      item.content = JSON.parse(item.content);
      item.content.forEach(i => {
        if (i.type == 0) {
          //   let style = library.library.util.analysisJSONtoCss(i);
          //   i.allStyle = style;
        }
      })
      this.item = item;
    },
  },
  created() {
    console.log(this.$route.params)
    this.user = this.$route.params.user;
    this.item = this.$route.params.item;
    this.parseCont()
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.verBalDetail {
  background: #eee;
  font-size: 0.32rem;
  .main {
    padding: 10px;
  }
  .page-title {
    font-size: 0.4rem;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 25px;
  }
  .page-author {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
    .img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      img {
        border-radius: 50%;
        width: 100%;
      }
    }
  }
  .line1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .member {
    background-color: #f7831c;
    color: #fff;
    font-size: 0.24rem !important;
    display: inline-block;
    padding: 0px 3px;
    line-height: 15px !important;
    border-radius: 2px;
    text-align: center;
    margin-left: 5px;
    font-size: 0.24rem;
  }
  .cont-span {
    color: #221814;
    text-align: left;
    margin: 10px 0;
    padding: 5px 10px;

    font-size: 0.3rem;
    line-height: 0.6rem;
  }
  .approve {
    font-size: 0.28rem;
    font-style: italic;
    font-weight: bold !important;
    color: #f2711c !important;
  }
}
</style>