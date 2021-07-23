<template>
  <div class="ChatConfig">
    <iframe
      src="https://api.jiain.net/web/#/p/2a3c1a305f7983e578207d3daeb5faa0"
      frameborder="0"
      class="Configiframe"
    ></iframe>
    <div class="form">
      <van-field v-model="compID" label="compID" placeholder="请输入公司ID" />
      <van-button type="primary" block class="btn" @click="getConfig"
        >拉取</van-button
      >
      <!-- <van-field
        v-model="secretKey"
        label="secretKey"
        placeholder="请输入secretKey"
      /> -->
      <template v-if="List && List.length > 0">
        <van-swipe-cell class="card" v-for="(item, index) in List" :key="index">
          <van-field
            v-model="item.secretKey"
            rows="4"
            label="会话存档Secret"
            type="textarea"
            placeholder="会话存档Secret"
            show-word-limit
          />
          <van-field
            v-model="item.id"
            label="	RSA私钥ID"
            placeholder="	RSA私钥ID"
            show-word-limit
          />
          <van-cell title="版本">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #title>
              <span class="custom-title">版本</span>
              <van-tag plain type="primary">请选择版本</van-tag>
            </template>
            <template #right-icon>
              <van-stepper integer v-model="item.version" />
            </template>
          </van-cell>
          <van-field
            v-model="item.privateKey"
            rows="4"
            label="私钥"
            type="textarea"
            placeholder="请输入私钥"
            show-word-limit
          />
          <van-field
            v-model="item.wxCompId"
            label="企业微信公司ID"
            placeholder="请输入企业微信公司ID"
            show-word-limit
          />
          <van-field
            v-model="item.compId"
            label="乐语公司ID"
            placeholder="请输入乐语公司ID"
            show-word-limit
          />
          <template #left>
            <van-button
              square
              type="primary"
              text="新增"
              style="height: 100%"
              @click="add(item, index)"
            />
          </template>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              style="height: 100%"
              @click="dele(item, index)"
            />
          </template>
        </van-swipe-cell>
      </template>
      <van-button type="primary" block class="btn" @click="Save"
        >保存配置</van-button
      >
    </div>
  </div>
</template>

<script>
import local from '../uilts/localStorage';
import {
  generateTimeout,
  generateNonce,
  generateSignature4
} from '../uilts/tools';
let timeout = generateTimeout();
let nonce = generateNonce();

export default {
  name: "ChatConfig",
  components: {},
  props: [],
  data() {
    return {
      secretKey: '',
      List: [],
      compID: '40000013'
    };
  },
  watch: {},
  computed: {},
  methods: {
    getConfig() {
      let signature = generateSignature4(this.$C || local.C(), timeout, nonce)
      this.$get("/work/session/config/list", {
        params: {
          compId: this.compID,
          timeout,
          nonce,
          signature
        },
      })
        .then((res) => {
          if (res.code === 200 && res.msg == 'success') {
            this.List = res.data;
            // else {
            //   this.List = [{ privateKey: '', version: 1, id: 0, wxCompId: sessionStorage.getItem('CorpId'), compId: this.$C || local.C() }]
            // }
            // this.secretKey = secretKey;
            // console.log(this.secretKey);
          } else {
            this.$toast.fail('请求失败，请稍后再试！')
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dele(item, index) {  // 删除数组
      console.log(item);
      if (item.id === 0) {
        this.List.splice(index, 1);
      } else {
        let signature = generateSignature4(item.id, this.$U || local.U(), this.$C || local.C(), timeout, nonce)
        this.$get("/wx-crm-server/session/conf/delete", {
          params: {
            id: item.id,
            userId: this.$U || local.U(),
            compId: this.$C || local.C(),
            timeout,
            nonce,
            signature
          },
        })
          .then((res) => {
            if (res.code === 200 && res.msg == 'success') {
              this.List.splice(index, 1);
            } else {
              this.$toast('删除失败')
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    add(item, index) { // 新增数组
      this.List.push({ privateKey: '', version: 1, id: 0, wxCompId: sessionStorage.getItem('CorpId'), compId: this.$C || local.C() })
    },
    Save() {
      let signature = generateSignature4(timeout, nonce);
      this.$post1(`/wx-crm-server/session/conf/save?timeout=${timeout}&nonce=${nonce}&signature=${signature}`, {
        userId: this.$U || local.U(),
        secretKey: this.secretKey,
        privateKeyList: this.List
      }
      ).then((res) => {
        console.log(res);
        if (res.code === 200 && res.msg == 'success') {
          this.getConfig();
          this.$toast('保存成功')
        } else {
          this.$toast('保存失败')
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  created() {
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.ChatConfig {
  font-size: 0.32rem;
  background: #eee;
  display: flex;
  .Configiframe {
    width: 60%;
    height: 100vh;
  }
  .form {
    flex: 1;
  }
  .custom-title {
    margin-right: 5px;
  }
  /deep/ .van-cell__title {
    width: auto;
  }
  .card{
    margin-bottom: 20px;
  }
}
</style>