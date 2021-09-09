<template>
  <div class="ChatConfig">
    <iframe
      src="https://api.jiain.net/web/#/p/2a3c1a305f7983e578207d3daeb5faa0"
      frameborder="0"
      class="Configiframe"
    ></iframe>
    <div class="form">
      <van-field
        v-model="compID"
        label="乐语公司ID"
        placeholder="请输入公司ID"
      />
      <van-button type="info" block class="btn" @click="getConfig"
        >拉取</van-button
      >
      <!-- <van-field
        v-model="secretKey"
        label="secretKey"
        placeholder="请输入secretKey"
      /> -->
      <template v-if="List && List.length > 0">
        <van-swipe-cell
          class="card"
          v-for="(item, index) in List"
          :key="index"
          right-width="0px"
        >
          <van-field
            v-model="item.secretKey"
            label="会话存档Secret"
            placeholder="会话存档Secret"
            show-word-limit
            :readonly="item.readonly"
          />
          <van-field
            readonly
            v-model="item.id"
            label="	RSA私钥ID"
            placeholder="	RSA私钥ID"
            show-word-limit
          />
          <van-cell title="版本">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #title>
              <span class="custom-title">版本</span>
              <!-- <van-tag plain type="primary">请选择版本</van-tag> -->
            </template>
            <template #right-icon>
              <!-- {{ item.version }} -->
              <van-stepper integer v-model="item.version" :disabled="item.readonly" />
            </template>
          </van-cell>
          <van-field
            v-model="item.privateKey"
            rows="6"
            label="私钥"
            :readonly="item.readonly"
            type="textarea"
            placeholder="请输入私钥"
            show-word-limit
          />
          <van-field
            v-model="item.wxCompId"
            label="企业微信公司ID"
            placeholder="请输入企业微信公司ID"
            show-word-limit
            :readonly="item.readonly"
          />
          <van-field
            v-model="item.compId"
            label="乐语公司ID"
            placeholder="请输入乐语公司ID"
            show-word-limit
            :readonly="item.readonly"
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
      <van-button
        v-if="List && List.length > 0"
        type="primary"
        block
        class="btn"
        @click="Save"
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
      compID: '40007760'
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
            this.List = res.data.map(item => {
              return {
                ...item,
                readonly: true, // 禁止编辑
              }
            });
            // else {
            //   this.List = [{ privateKey: '', version: 1, id: 0, wxCompId: sessionStorage.getItem('CorpId'), compId: this.$C || local.C() }]
            // }
            // this.secretKey = secretKey;
            // console.log(this.secretKey);
          } else if (res.msg == '不存在') {
            this.$toast('当前公司没有配置，请配置参数。')
            this.add()
          } else {
            this.$toast.fail(res.msg)
          }
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
      console.log(this.List)
      let idx = this.List.length > 0 ? this.List[this.List.length - 1].version + 1 : 1
      this.List.push({ secretKey: '', privateKey: '', version: idx, id: 0, wxCompId: '', compId: this.$C || local.C(), readonly: false })
    },
    Save() {
      let { id, version, wxCompId, privateKey, secretKey } = this.List[this.List.length - 1];
      if (wxCompId === '') {
        this.$toast.fail("wxCompId获取失败，请联系管理员！");
      } else if (privateKey === '') {
        this.$toast.fail("私钥不能为空");
        return;
      } else if (secretKey === '') {
        console.log(secretKey)
        this.$toast.fail("会话存档Secret")
        return;
      }
      this.$post1("/work/session/config/save", {
        id,
        version,
        secretKey: secretKey,
        privateKey,
        wxCompId,
        compId: Number(this.compID),
      }
      ).then((res) => {
        if (res.code === 200 && res.msg == 'success') {
          this.getConfig();
          this.$toast('保存成功')
        } else {
          this.$toast.fail(res.msg)
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
    width: 70%;
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
  .card {
    margin-bottom: 20px;
  }
  img {
    width: 100%;
  }
}
</style>