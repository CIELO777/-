<template>
  <div class="sheetimg">
    <!-- <div class="backGo" @click="backgo">
      <van-icon name="arrow-left" size="17px" color="#fff" />
    </div> -->
    <van-field
      v-model="message"
      rows="4"
      autosize
      type="textarea"
      placeholder="请输入文字"
    />
    <van-checkbox class="boxcheck" v-model="checked" shape="square"
      >发消息给客户负责人和相关人</van-checkbox
    >
    <div class="waupolad">
      <template v-for="(item, index) in imageList">
        <van-image
          :key="index"
          width="1.6rem"
          height="1.6rem"
          fit="contain"
          :src="item"
        />
      </template>
      <div class="uploadView">
        <img src="../assets/img/addPhoto@2x.png" alt="" />
        <input
          type="file"
          class="upload"
          id="upload"
          @change="addImg"
          style="opacity: 0"
        />
      </div>
    </div>
    <div class="btn">
      <van-button
        type="default"
        size="normal"
        style="margin-top: 20px"
        @click="backgo"
        v-if="skip != 'noSkip'"
        >返回</van-button
      >
      <van-button
        type="primary"
        size="normal"
        style="margin-top: 20px; background: #51bbba"
        @click="sheetSave"
        >保存</van-button
      >
    </div>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';

import local from '../uilts/localStorage';

export default {
  name: 'SheetImg',
  props: ['skip'],
  data() {
    return {
      message: '',
      imageList: [],
      checked: '',
      page: ''
    }
  },
  methods: {
    sheetSave() {  // 确认保存
      let that = this;
      if (this.message == "") {
        this.$toast.fail('内容不能为空')
        return;
      }
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let data = {
        id: 0,
        title: this.message,
        content: JSON.stringify(this.imageList),
        type: 0,
        timeout,
        nonce,
      };
      if (this.$route.name === 'ChatCustomer') {  // 客户画像限定
        let linkmanId = sessionStorage.getItem('linkmanId') // 当前联系人的ID
        data.itrId = this.userInfos().id;
        data.compId = this.userInfos().bind_comp_id1;
        data.pid = linkmanId;
        data.signature = generateSignature3(0, data.itrId, data.compId, linkmanId, timeout, nonce);
      } else { // 客户管理模块-跟进记录模块
        let crmInfoId = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
        data.itrId = this.$U || local.U();
        data.pid = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
        data.signature = generateSignature3(0, this.$U || local.U(), this.$C || local.C(), crmInfoId, timeout, nonce);
        data.compId = this.$C || local.C();
      };
      let param = new URLSearchParams();
      param.append("compId", data.compId);
      param.append("content", data.content);
      param.append("id", data.id);
      param.append("itrId", data.itrId);
      param.append("nonce", data.nonce);
      param.append("pid", data.pid);
      param.append("signature", data.signature);
      param.append("timeout", data.timeout);
      param.append("title", data.title);
      param.append("type", data.type);
      param.append("notifyMode", this.checked ? 1 : 0);
      this.$post1('/api/request/itr/comp/customer/record/save', param
      )
        .then(function (res) {
          if (res.error === 'success') {
            that.$toast({
              message: '新增成功',
              position: 'bottom',
            });
            that.$store.commit("ManualUpdate", { target: 'sheet', data: data.title })
            if (that.skip !== 'noSkip') { // 如果不等于noSkip 就跳转。此处时为了兼容客户画像
              setTimeout(() => {
                that.$router.replace('/linkDetailed')
                sessionStorage.setItem('tabNum', 1)
              }, 800)
            } else {
              that.$emit('sheetClose')
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    uuid() {
      return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
    },
    addImg(e) {
      let file = e.target.files[0];
      if (file == undefined) {
        return false;
      }
      var fileSize = file.size; //获得文件大小；
      var filePath = file.type.split("/")[1];
      // var fileType = filePath[filePath.length - 1]; //获得文件结尾的类型如 zip rar 这种写法确保是最后的
      if (!(filePath == "png" || filePath == "jpg" || filePath == "jpeg" || filePath == "gif")) {
        this.$toast.fail('文件格式不符合要求！目前仅支持png和jpg文件');
        return false
      } else if (fileSize > 1048576) {
        this.$toast.fail('请上传不超过1M的图片!');
        return false
      }
      this.uploadImg(file, sessionStorage.getItem('userinfo')?.id);
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    uploadImg(file, compId) {
      var that = this;
      var formData = new FormData();
      formData.append('id', this.uuid());
      formData.append('type', 1);
      formData.append('file', file);
      this.$post('//upload.jiain.net/upload', formData).then(res => {
        if (res.state === 'success') {
          let url = 'http://ego-file.soperson.com' + res.url;
          if (that.imageList.length >= 9) {
            that.$toast.fail('最多上传9张图片!');
            return;
          }
          that.imageList.push(url);
        } else {
          that.$toast.fail('上传失败请稍后再试!');
        }
      }).catch(err => {
        console.log(err)
      })
    },
    backgo() {  // 点击返回的时候保存信息
      console.log(this.$route);
      if (this.$route.name === 'SheetImg') {
        this.$router.go(-1)
        sessionStorage.setItem('tabNum', 1);
      }
    },
    userInfos() { // 获取当前联系人信息
      return JSON.parse(sessionStorage.getItem('userinfo'));
    },
    empty() { // 清空表单数据
      this.message = '';
      this.imageList.length = 0;
      this.checked = '';

    }
  },
  created() {
    console.log('dasasdas');
    console.log(this.$route, '$route.name')
    this.message = '';
    this.imageList = [];
    this.page = sessionStorage.getItem("active")
  },
  activated() {
    console.log('activatedactivatedactivated');
  }
}
</script>

<style lang="less" scoped>
.sheetimg {
  font-size: 0.28rem;
  padding: 0 0.2rem;
  .waupolad {
    display: flex;
    .van-image {
      margin-right: 0.1rem;
    }
  }
  .uploadView {
    position: relative;
    margin-left: 0.1rem;
    img {
      width: 1.6rem;
      height: 1.6rem;
    }
    .upload {
      opacity: 0;
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
    }
  }
  .van-cell {
    margin-bottom: 0.4rem;
  }
  .van-uploader {
  }
  .backGo {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 10px;
    width: 38px;
    height: 38px;
    background: #000;
    color: red;
    border-radius: 50%;
    z-index: 9;
    left: 10px;
    top: 0.2rem;
  }
  button {
    // margin-top: 10px;
    // display: block;
    // margin: 10px auto 0;
    // width: 100%;
    // position: fixed;
    // bottom: 0;
    // left: 0;
  }
  .boxcheck {
    margin: 0.4rem 0;
    padding: 0 6px;
  }
  .btn {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    button {
      flex: 1;
    }
  }
}
</style>