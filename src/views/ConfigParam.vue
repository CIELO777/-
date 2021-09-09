<template>
  <div class="ConfigParam">
    <div class="hello">
      <div data-v-168051ae=""></div>
      <div id="header"></div>
      <div id="doc-container" class="container doc-container">
        <van-form validate-first @failed="onFailed" @submit="onsubmit">
          <div class="doc-title-box">
            <span id="doc-title-span" class="dn"></span>
            <h2 id="doc-title">配置教程</h2>
            <i id="full-page" class="el-icon-full-screen"></i>
          </div>
          <div data-v-433e5482="" id="doc-body">
            <div
              data-v-433e5482=""
              id="page_md_content"
              class="page_content_main"
            >
              <div
                data-v-433e5482=""
                id="editor-md"
                class="main-editor markdown-body editormd-html-preview"
              >
                <!---->
                <h3 id="h3--p-style-color-red-api-p-">
                  <a
                    name="<p style='color:red;'>注：因企业微信API限制，配置流程比较复杂，建议联系客服进行配置</p>"
                    class="reference-link"
                  ></a
                  ><span class="header-link octicon octicon-link"></span>
                  <p style="color: red">
                    注：因企业微信API限制，配置流程比较复杂，建议联系客服进行配置
                  </p>
                </h3>
                <h4 id="h4-1-">
                  <a name="1. 安装乐语应用" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>1.
                  安装乐语应用
                </h4>
                <blockquote>
                  <p>
                    (1). 打开链接：<a
                      href="https://wxa.jiain.net/work/install?suiteId=wx067ebd9128dbc908"
                      >https://wxa.jiain.net/work/install?suiteId=wx067ebd9128dbc908</a
                    >
                    使用企业微信管理员账号，扫描链接里的二维码。并在手机上点击确定。
                  </p>
                  <p>
                    (2).
                    确定后，修改下图中的可见范围（建议全部成员可见）。并点击同意授权并添加。
                  </p>
                  <center>
                    <img
                      src="http://api.jiain.net/server/index.php?s=/api/attachment/visitFile/sign/875f43b4f97c0a66f750e7956db44d1c"
                      alt=""
                    />
                  </center>
                </blockquote>
                <h4 id="h4-2-">
                  <a name="2. 创建乐语自建应用" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>2.
                  创建乐语自建应用
                </h4>
                <blockquote>
                  <p>(1). 打开【应用管理】，在【自建】下选择【创建应用】</p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252068921080954596.png"
                    alt="创建应用"
                    title="创建应用"
                  />
                </p>
                <blockquote>
                  <!-- <p> -->
                  (2) 创建自建应用名称建议填写「乐语提醒」
                  <!-- <div class="btn">复制</div> -->
                  ，下载<a
                    href="https://ego-file.soperson.com/doc/showdoc_162520730166815547.webp"
                    >乐语logo</a
                  >进行上传，不用填写应用介绍。<br />(3)
                  在【可见范围】内【选择部门/成员】，可先选择授权给本人，之后若需要添加使用人员时可再次添加
                  <!-- </p> -->
                </blockquote>
                <h4 id="h4-2-">
                  <a name="2. 提交信息" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>2.
                  提交信息
                </h4>
                <blockquote>
                  <p>
                    (1). 获取<a
                      href="https://work.weixin.qq.com/wework_admin/frame#index"
                      >企业微信</a
                    >ID
                  </p>
                  <van-field
                    v-model="wxCompId"
                    label-width="150px"
                    type="textarea"
                    label-class="labelInp"
                    name="pattern"
                    label="企业ID:"
                    :rules="[{ validator, message: '请输入正确企业ID' }]"
                  />
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252063551658069801.png"
                    alt="企业微信ID"
                    title="企业微信ID"
                  />
                </p>
                <blockquote>
                  <p>(2). 获取自建应用AgentId</p>
                  <van-field
                    v-model="wxAgentId"
                    name="validator"
                    label-class="labelInp"
                    type="textarea"
                    label-width="150px"
                    label="自建应用AgentId:"
                    :rules="[
                      { validator, message: '请输入正确自建应用AgentId' },
                    ]"
                  />
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252078112039682072.png"
                    alt="自建应用界面"
                  />
                </p>
                <blockquote>
                  <p>(3). 获取自建应用Secret</p>
                  <van-field
                    v-model="wxSecret"
                    name="asyncValidator"
                    label="自建应用Secret:"
                    label-width="150px"
                    label-class="labelInp"
                    type="textarea"
                    :rules="[
                      { validator, message: '请输入正确自建应用Secret' },
                    ]"
                  />
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252078741060496647.png"
                    alt="应用Secret"
                  />
                </p>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252079251787802676.png"
                    alt="发送Secret"
                  />
                </p>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252081401902619756.png"
                    alt="移动端查看Secret"
                  />
                </p>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_1625208204342698009.png"
                    alt="复制Secret"
                  />
                </p>
                <blockquote>
                  <p>
                    (4). 获取客户联系Secret
                    <van-field
                      v-model="addressSecret"
                      name="asyncValidator"
                      label="客户联系Secret:"
                      label-width="150px"
                      :rules="[
                        { validator, message: '请输入正确客户联系Secret' },
                      ]"
                      label-class="labelInp"
                      type="textarea"
                    />
                    <van-field
                      v-model="compId"
                      name="asyncValidator"
                      label="乐语公司ID:"
                      label-width="150px"
                      :rules="[{ validator, message: '请输入正确乐语公司ID' }]"
                      label-class="labelInp"
                      type="textarea"
                    />
                    <br /><br />切换到【客户联系】-
                    【客户】，点击【API】展开，复制Secret后
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_1625208494397473298.png"
                    alt="客户Secret"
                  />
                </p>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252085491464229428.png"
                    alt="发送Secret"
                  />
                </p>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252081401902619756.png"
                    alt="移动端查看Secret"
                  />
                </p>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_1625208204342698009.png"
                    alt="复制Secret"
                  />
                </p>
                <h4 id="h4-3-">
                  <a name="3. 修改应用权限" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>3.
                  修改应用权限
                </h4>
                <blockquote>
                  <p>
                    选择【客户联系】-【可调用应用】，点击【设置】，如果在此之前已经进行过应用配置，点击【修改】，勾选之前创建的【乐语提醒】
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252089462064779402.png"
                    alt="应用权限"
                  />
                </p>
                <h4 id="h4-4-">
                  <a name="4. 添加员工到客户联系" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>4.
                  添加员工到客户联系
                </h4>
                <blockquote>
                  <p>
                    选择【客户联系】-【权限配置】，点击【添加/修改】将成员添加到使用范围，建议选择全部成员，点击保存
                  </p>
                  <p style="color: red">
                    注意：员工只有配置了【使用范围和管理规则】才可以使用客户联系，添加外部联系人等权限，请确保客服等人员被添加客户联系权限，否则可能会导致乐语部分功能无法使用
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252086552146270887.png"
                    alt="修改使用范围"
                  />
                </p>
                <h4 id="h4-5-">
                  <a name="5. 配置应用属性" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>5.
                  配置应用属性
                </h4>
                <blockquote>
                  <p>
                    在创建应用成功后，进入【乐语提醒详情页】找到【开发者接口】中的【网页授权及JS-SDK】页面，点击【设置可信域名】，进行设置，复制<strong
                      ><a href="" title="wxa.jiain.net"
                        >wxa.jiain.net</a
                      ></strong
                    >填入可信域名，勾选【用于OAuth2.0回调的可信域名是否校验】，点击确定即可
                  </p>
                </blockquote>
                <hr />
                <h1>
                  6.设置API接收设置
                </h1>
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252093601290294018.png"
                    alt=""
                  />
                </p>
                <br />
                <br />
                <hr />
                <p>
                  <img src="../assets/chat1.png" alt="" />
                </p>
                <p>
                  <img src="../assets/chat2.png" alt="" />
                </p>
                <blockquote>
                  <h1>URL:</h1>
                  <div style="display: flex; align-items: center">
                    <van-field
                      v-model="URL"
                      name="URL"
                      label="URL:"
                      label-width="150px"
                      label-class="labelInp"
                      type="textarea"
                    />
                    <div
                      class="btn btnurl"
                      @click="copy('url')"
                      :data-clipboard-text="URL"
                    >
                      生成并复制
                    </div>
                  </div>
                  <h1>企微自建应用接收消息Token:</h1>
                  <div style="display: flex; align-items: center">
                    <van-field
                      v-model="Token"
                      name="Token"
                      label="企微自建应用接收消息Token:"
                      label-width="150px"
                      :rules="[
                        {
                          validator,
                          message: '请输入正确企微自建应用接收消息Token',
                        },
                      ]"
                      label-class="labelInp"
                      type="textarea"
                    />
                    <div
                      class="btn btnToken"
                      @click="copy('Token')"
                      :data-clipboard-text="Token"
                    >
                      生成并复制
                    </div>
                    <br />
                  </div>
                  <h1>企微自建应用接收消息EncodingAESKey:</h1>
                  <div style="display: flex; align-items: center">
                    <van-field
                      v-model="EncodingAESKey"
                      name="EncodingAESKey"
                      label="EncodingAESKey:"
                      label-width="150px"
                      :rules="[
                        { validator, message: '请输入正确EncodingAESKey' },
                      ]"
                      label-class="labelInp"
                      type="textarea"
                    />
                    <div
                      class="btn btnEncoding"
                      @click="copy('Encoding')"
                      :data-clipboard-text="EncodingAESKey"
                    >
                      生成并复制
                    </div>
                  </div>
                </blockquote>
                <h4 id="h4-6-">
                  <a name="6. 配置侧边栏" class="reference-link"></a
                  ><span class="header-link octicon octicon-link"></span>6.
                  配置侧边栏
                </h4>
                <blockquote>
                  <p>
                    (1).
                    配置「客户画像」，配置成功后员工即可在侧边栏使用。在【乐语提醒】找到【配置到聊天工具栏】，点击【配置】，进行设置
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252099241531525463.png"
                    alt="配置到聊天工具栏"
                  />
                </p>
                <blockquote>
                  <p>
                    (2).
                    进入【配置到聊天工具栏】，进行设置。点击【配置页面】进行配置
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_16252099831587486512.png"
                    alt="配置页面"
                  />
                </p>
                <blockquote>
                  <p>
                    (3). 创建客户画像侧边栏，请按照以下内容填写<br />填写页面名称：<strong
                      >客户画像</strong
                    ><br />填写页面内容，选择自定义，链接为：<strong
                      ><a
                        href="https://wxa.jiain.net/work/wx/do?suiteId=wx067ebd9128dbc908&amp;project=looyu&amp;path=/chatCustomer"
                        title="https://wxa.jiain.net/work/wx/do?suiteId=wx067ebd9128dbc908&amp;project=looyu&amp;path=/chatCustomer"
                        >https://wxa.jiain.net/work/wx/do?suiteId=wx067ebd9128dbc908&amp;project=looyu&amp;path=/chatCustomer</a
                      ></strong
                    >
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_1625210060109075725.png"
                    alt="配置页面"
                  />
                </p>
                <blockquote>
                  <p>
                    (4). 创建发圈素材侧边栏，请按照以下内容填写<br />填写页面名称：<strong
                      >营销素材</strong
                    ><br />填写页面内容，选择自定义，链接为：<strong
                      ><a
                        href="https://wxa.jiain.net/work/wx/do?suiteId=wx067ebd9128dbc908&amp;project=looyu&amp;path=/colorPage"
                        title="https://wxa.jiain.net/work/wx/do?suiteId=wx067ebd9128dbc908&amp;project=looyu&amp;path=/colorPage"
                        >https://wxa.jiain.net/work/wx/do?suiteId=wx067ebd9128dbc908&amp;project=looyu&amp;path=/colorPage</a
                      ></strong
                    >
                  </p>
                </blockquote>
                <hr />
                <p>
                  <img
                    src="https://ego-file.soperson.com/doc/showdoc_1625210060109075725.png"
                    alt="配置页面"
                  />
                </p>
              </div>
            </div>
          </div>
          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit"
              >提交</van-button
            >
          </div>
        </van-form>
      </div>
      <div data-v-433e5482=""></div>
      <div data-v-065ddbfc="" data-v-433e5482=""></div>
      <div data-v-433e5482=""></div>
    </div>
    <!-- <iframe
      src="https://api.jiain.net/web/#/p/c6d34aae4ef139057b138bd9815fa1e5"
      frameborder="0"
      class="Configiframe"
    ></iframe> -->
    <!-- <div class="form">
      <van-form validate-first @failed="onFailed" @submit="onsubmit">
        <van-field
          v-model="wxCompId"
          label-width="150px"
          name="pattern"
          label="企业ID:"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="wxAgentId"
          name="validator"
          label-width="150px"
          label="自建应用AgentId:"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="wxSecret"
          name="asyncValidator"
          label="自建应用Secret:"
          label-width="150px"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="addressSecret"
          name="asyncValidator"
          label="客户联系Secret:"
          label-width="150px"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="compId"
          name="asyncValidator"
          label="乐语公司ID:"
          label-width="150px"
          :rules="[{ validator, message: '请输入正确内容' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div> -->
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature4 } from "../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import Clipboard from 'clipboard';
export default {
  name: "ConfigParam",
  components: {},
  props: [],
  data() {
    return {
      wxCompId: '',
      wxAgentId: '',
      wxSecret: '',
      addressSecret: '',
      compId: '',
      Token: '',
      URL: '',
      EncodingAESKey: '',
    };
  },
  watch: {},
  computed: {},
  methods: {
    validator(val) { // 非空校验
      return !/^\s*$/.test(val);
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
      this.$toast.fail(errorInfo.errors[0].message)
    },
    onsubmit(values) {
      console.log(values)
      let param = new URLSearchParams();
      let signature = generateSignature4(timeout, nonce);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("addressSecret", this.addressSecret);
      param.append("wxSecret", this.wxSecret);
      param.append("wxAgentId", this.wxAgentId);
      param.append("wxCompId", this.wxCompId);
      param.append("compId", this.compId);
      param.append("appMsgToken", this.Token);
      param.append("appMsgAesKey", this.EncodingAESKey);
      this.$post1("/work/wx/corp/bind", param)
        .then((res) => {
          if (res.code == 200) {
            this.$toast.success('配置成功！')
          } else {
            this.$toast.fail(res.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    randomString(len) {
      len = len;
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      var maxPos = $chars.length;
      var pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    copy(type) {
      switch (type) {
        case 'url':
          if (this.wxCompId === '') {
            this.$toast.fail({
              message: '请填写企业微信ID',
              forbidClick: true,
            });
            break;
          } else {
            this.URL = `https://wxa.jiain.net/work/wx/app_msg?corpId=${this.wxCompId}`;
            var clipboard = new Clipboard('.btnurl')
            clipboard.on('success', e => {
              console.log('');
              this.$toast.success({
                message: '复制成功',
              });
              //  释放内存
            })
            clipboard.on('error', e => {
              // 不支持复制
              console.log('该浏览器不支持复制')
              // 释放内存
            })
          }
          break;
        case 'Encoding':
          this.EncodingAESKey = this.randomString(43);
          var clipboard = new Clipboard('.btnEncoding')
          clipboard.on('success', e => {
            this.$toast.success({
              message: '复制成功',
            });
            //  释放内存
          })
          clipboard.on('error', e => {
            // 不支持复制
            console.log('该浏览器不支持复制')
            // 释放内存
          })
          break;
        case 'Token':
          this.Token = this.randomString(5);
          var clipboard = new Clipboard('.btnToken')
          clipboard.on('success', e => {
            this.$toast.success({
              message: '复制成功',
            });
            //  释放内存
          })
          clipboard.on('error', e => {
            // 不支持复制
            console.log('该浏览器不支持复制')
            // 释放内存
          })
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ConfigParam {
  font-size: 18px;
  .grey-bg {
    background-color: #fafafa;
  }
  #header {
    height: 80px;
  }
  .doc-container {
    position: static;
    -webkit-box-shadow: 0 1px 6px #ccc;
    -ms-box-shadow: 0 1px 6px #ccc;
    -o-box-shadow: 0 1px 6px #ccc;
    box-shadow: 0 1px 6px #ccc;
    background-color: #fff;
    border-bottom: 1px solid #d9d9d9;
    margin-bottom: 20px;
    width: 60%;
    min-height: 500px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
  }
  .doc-title-box {
    height: auto;
    width: auto;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    width: 90%;
    margin: 10px auto;
  }
  #doc-title {
    font-size: 1.8em;
  }
  #page_md_content {
    padding: 10px 10px 90px;
    overflow: hidden;
    font-size: 11pt;
    line-height: 1.7;
    color: #333;
  }
  #doc-body {
    width: 90%;
    margin: 0 auto;
    background-color: #fff;
  }
  .editormd-html-preview,
  .editormd-preview-container {
    padding: 0;
    font-size: 18px;
  }
  .markdown-body > :first-child {
    margin-top: 0 !important;
  }
  .markdown-body h3 {
    font-size: 1.25em !important;
  }
  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    position: relative;
    margin-top: 1em;
    margin-bottom: 16px;
    font-weight: 700;
    line-height: 1.4;
  }
  .markdown-body h3 {
    font-size: 1.25em !important;
  }
  // font-size: 18px;
  // display: flex;
  // .Configiframe {
  //   width: 60%;
  //   height: 100vh;
  // }
  // .form {
  //   flex: 1;
  // }
  // /deep/ .van-cell__title {
  //   user-select: none;
  //   -ms-user-select: none;
  //   -webkit-user-select: none;
  //   -moz-user-select: none;
  // }
  // /deep/ .van-field__body {
  //   background: #eee;
  //   border-radius: 20px;
  //   height: 30px;
  //   padding: 0 5px;
  //   input {
  //     outline: none;
  //     background: #eee;
  //     &:focus {
  //       outline: 0;
  //       background: #eee;
  //     }
  //     &:-webkit-autofill {
  //       -ms-box-shadow: 0 0 0px 1000px #eee inset !important;
  //       -webkit-box-shadow: 0 0 0px 1000px #eee inset !important;
  //       -moz-box-shadow: 0 0 0px 1000px #eee inset !important;
  //     }
  //   }
  // }
  /deep/ .labelInp span {
    color: #000 !important;
    font-weight: 700;
    font-size: 20px;
  }
  /deep/ .van-cell {
    height: 80px;
    font-size: 18px;
    input {
      height: 80px;
    }
  }
  /deep/ .van-cell__value.van-field__value {
    border: 1px solid #090909;
    border-radius: 10px;
  }
  @toast-max-width: 100%;
  .btn {
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
    font-size: 12px;
    color: #fff;
    background-color: #07c160;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #07c160;
    flex-shrink: 0;
  }
}
</style>