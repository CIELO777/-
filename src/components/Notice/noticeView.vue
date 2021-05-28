<template>
  <div class="noticediv">
    <div class="main">
      <div class="page-author" @click="handalClickProfile" v-if="data.user">
        <div class="img">
          <img :src="data.user.portrait" />
        </div>
        <div class="info">
          <div class="line1">
            {{ data.user.nickname }}
            <span
              v-if="data.user.approve == 1"
              style="margin: 0 5px"
              class="approve"
              >V</span
            >
          </div>
          <div class="line1 desc">发布于 {{ data.notify.createTime }}</div>
        </div>
      </div>
      <div class="content" v-if="data.notify">
        <span>{{ data.notify.content }}</span>
        <div class="img-list">
          <div
            v-for="(item, index) in imageList"
            :class="imageList.length > 3 ? 'three' : 'three'"
            :key="index"
          >
            <img
              @click="
                prediv(item + '?x-oss-process=image/resize,m_fill,h_400,w_400')
              "
              :src="item + '?x-oss-process=image/resize,m_fill,h_400,w_400'"
            />
          </div>
        </div>
      </div>
      <div class="footer" v-if="data.role == 1 || data.role == 4">
        <div @click="handalClickReadList" data-type="1">{{ read }}人阅读</div>
        <div @click="handalClickReadList" data-type="0">{{ unread }}人未读</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
  generateSignature,
  generateSignature8,
  generateSignature4,
} from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import { ImagePreview } from 'vant';

import local from '../../uilts/localStorage';
export default {
  name: "Noticediv",
  components: {},
  props: [],
  data() {
    return {
      id: "",
      read: "",
      unread: "",
      data: {},
      HttpOrHttpsReg: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/,
      imageList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    getList() {
      let signature = generateSignature3(this.id, this.$U || local.U(), timeout, nonce);
      let data = {
        itrId: this.$U || local.U(),
        id: this.id,
        signature: signature,
        timeout: timeout,
        nonce: nonce,
      }
      this.$get("/api/request/itr/staff/notify/view", {
        params: data
      }).then((res) => {
        this.data = res;
        console.log(this.data)
        if (res.notify.photoCollection) {
          let arr = res.notify.photoCollection.split(",");
          let imageList = arr.map(item => {
            return this.fullUrl(item);
          })
          this.imageList = imageList;
        }
        this.readStatus();

        if (res.role == 1 || res.role == 4) {
          this.getRead();
          this.getUnRead()
        }
      })
        .catch((error) => {
          console.log(error);
        });
    },
    getRead() {
      let signature = generateSignature3(this.id, this.$C || local.C(), timeout, nonce);
      let param = new URLSearchParams();
      param.append("id", this.id);
      param.append("compId", this.$C || local.C());
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("current", 1);
      param.append("type", 1);
      param.append("size", 1);
      this.$post1("/api/request/itr/staff/notify/log/result", param)
        .then((res) => {
          this.read = res.total;
        })
        .catch((error) => {
          this.$toast.fail("请求失败，请稍后再试");
        });
    },
    getUnRead() {
      let signature = generateSignature3(this.id, this.$C || local.C(), timeout, nonce);
      let param = new URLSearchParams();
      param.append("id", this.id);
      param.append("compId", this.$C || local.C());
      param.append("signature", signature);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("current", 1);
      param.append("type", 0);
      param.append("size", 1);
      this.$post1("/api/request/itr/staff/notify/log/result", param)
        .then((res) => {
          this.unread = res.total;
        })
        .catch((error) => {
          this.$toast.fail("请求失败，请稍后再试");
        });
    },
    handalClickProfile() {

    },
    readStatus() {
      let signature = generateSignature3(this.$U || local.U(), this.$route.params.id, timeout, nonce);
      let data = {
        userId: this.$U || local.U(),
        notifyId: this.$route.params.id,
        signature: signature,
        timeout: timeout,
        nonce: nonce
      }
      this.$get("/api/request/itr/staff/notify/log/record", {
        params: data
      }).then((res) => {
        console.log(res)
      })
        .catch((error) => {
          console.log(error);
        });
    },
    prediv(src) {
      ImagePreview({
        images: [
          src
        ],
        closeable: true,
      });
    },
    handalClickReadList() {

    },
    isHttpOrHttpsUrl(url) {
      if (!this.HttpOrHttpsReg.test(url)) {
        return false;
      }
      return true;
    },
    fullUrl(data) {
      if (!this.isHttpOrHttpsUrl(data)) {
        return "http://ego-file.soperson.com" + data;
      }
      return data;
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.getList();
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.noticediv {
  font-size: 0.28rem;
  background: #eee;
  .main {
    padding: 10px 20px;
    background: #fff;
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
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      line-height: 20px;
      margin-right: 10px;
      .line1 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .approve {
        font-size: 0.28rem;
        font-style: italic;
        font-weight: bold !important;
        color: #f2711c !important;
      }
      .desc {
        color: #aaa;
        font-size: 0.28rem;
      }
    }
  }
  .content {
    span {
      font-size: 0.28rem;
      line-height: 25px;
    }
    .img-list {
      display: flex;
      margin-right: 50px;
      margin-top: 10px;
      flex-wrap: wrap;
      .three {
        width: calc(33% - 10px);
        margin-right: 10px;
        height: 0;
        padding-bottom: 33%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
  }
  .footer {
    display: flex;
    div:first-child {
      margin-right: 0.2rem;
    }
  }
}
</style>