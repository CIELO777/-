<template>
  <div class="sheetimg">
    <!-- <div class="backGo" @click="backgo">
      <van-icon name="arrow-left" size="17px" color="#fff" />
    </div> -->
    <van-field v-model="message" rows="4" autosize type="textarea" placeholder="请输入文字" />
    <div class="waupolad">
      <template v-for="(item,index) in imageList">
        <van-image :key="index" width="1.6rem" height="1.6rem" fit="contain" :src="item" />
      </template>
      <div class="uploadView">
        <img src="../assets/img/addPhoto@2x.png" alt="">
        <input type="file" class="upload" id="upload" @change="addImg" style="opacity:0" />
      </div>
    </div>
    <van-button type="primary" size="large" style="margin-top:20px;background:#51BBBA" @click="sheetSave">保存</van-button>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../uilts/tools';

import local from '../uilts/localStorage';

export default {
  name: 'SheetImg',
  data() {
    return {
      message: '',
      imageList: []
    }
  },
  methods: {
    sheetSave() {  // 确认保存
      let that = this;
      if (this.message == "") {
        this.$toast.fail('内容不能为空')
        return;
      }
      let crmInfoId = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let signature = generateSignature3(0, this.$U || local.U(), this.$C || local.C(), crmInfoId, timeout, nonce);
      let data = {
        id: 0,
        title: this.message,
        content: JSON.stringify(this.imageList),
        itrId: this.$U || local.U(),
        pid: crmInfoId,
        type: 0,
        compId: this.$C || local.C(),
        timeout,
        nonce,
        signature,
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
      this.$post1('/api/request/itr/comp/customer/record/save', param
      )
        .then(function (res) {
          if (res.error === 'success') {
            that.$toast({
              message: '新增成功',
              position: 'bottom',
            });
            that.$store.commit("ManualUpdate", { target: 'sheet', data: data.title })
            setTimeout(() => {
              that.$router.push({
                name: 'LinkDetailed',
              })
              sessionStorage.setItem('tabNum', 1)
            }, 800)

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
    uuid() {
      return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
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
        this.$router.push('/linkDetailed')

        sessionStorage.setItem('tabNum', 1);
      }
    },
  },
  created() {
    console.log('dasasdas');
    this.message = '',
      this.imageList = []
  },
  activated() {
    console.log('activatedactivatedactivated');
  }
}
</script>

<style lang="less" scoped>
.sheetimg {
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
    width: 1rem;
    height: 45px;
    position: fixed;
    top: 0;
    z-index: 999;
    left: 0;
    background: #5c5c5c;
    i {
      padding-top: 14px;
      display: inherit;
      padding-left: 16px;
    }
  }
  button {
    margin-top: 10px;
    display: block;
    margin: 10px auto 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>