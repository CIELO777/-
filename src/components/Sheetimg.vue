<!-- @format -->

/* * @Author: Tian * @Date: 2021-09-07 16:44:11 * @Last Modified by: Tian * @Last Modified time: 2021-09-07
16:50:40 */
<!-- @format -->
<template>
 <div class="sheetimg">
  <van-field v-model="message" rows="4" autosize type="textarea" placeholder="请输入文字" />
  <!-- <aside class="SheetTag" v-if="Ashow">
   <van-tag type="primary" closeable size="large" plain>
    <div slots="default">
     <van-icon size="14px" name="volume-o" />
     {{Audioduration}}
    </div>
   </van-tag>
  </aside> -->
  <div class="waupolad">
   <template v-for="(item, index) in imageList">
    <van-image :key="index" width="1.6rem" height="1.6rem" fit="contain" :src="item" :show-error="false">
     <template v-slot:loading>
      <van-loading color="#53b1d8" size="20" />
     </template>
    </van-image>
   </template>
   <div class="uploadView">
    <img src="../assets/img/addPhoto@2x.png" alt="" />
    <input type="file" class="upload" id="upload" @change="addImg" style="opacity: 0" />
   </div>
  </div>
  <!-- <van-cell title="点我录音" is-link icon="volume-o" @click="audio_C = audioPop = true" />
  <van-uploader accept="video/*" :before-read="uploadVideo">
   <van-cell title="上传视频" is-link icon="video-o" @click=""> </van-cell>
  </van-uploader>

  <van-cell title="拜访签到" is-link icon="location-o" /> -->
  <van-checkbox class="boxcheck" v-model="checked" shape="square">发消息给客户负责人和相关人</van-checkbox>
  <div class="btn">
   <van-button type="default" size="normal" style="margin-top: 20px" @click="backgo" v-if="skip != 'noSkip'"
    >返回</van-button
   >
   <van-button type="primary" size="normal" style="margin-top: 20px; background: #51bbba" @click="sheetSave"
    >保存</van-button
   >
  </div>
  <!-- 语音弹框 -->
  <van-popup v-model="audioPop" :style="{ height: '30%' }" position="bottom">
   <div class="circle">
    <transition name="btn">
     <button
      ref="audioBtn"
      @touchstart.prevent="start"
      @touchmove.prevent="move"
      @touchend.prevent="end"
      :style="{ background: recordColor }"
      class="pressBtn"
     >
      {{ btnElem }}
     </button>
    </transition>
   </div>
  </van-popup>
 </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from "../uilts/tools";
import Recorder from "js-audio-recorder";
import local from "../uilts/localStorage";
import mp3 from "../uilts/mp3.js";
let posStart = 0; //初始化起点坐标
let posEnd = 0; //初始化终点坐标
let posMove = 0; //初始化滑动坐标
let startTime = 0; // 开始点击的时间
let continueTime = 0; // 持续时间
export default {
 name: "SheetImg",
 props: ["skip", "userInfo"],
 data() {
  return {
   message: "",
   imageList: [],
   checked: "",
   page: "",
   audioPop: false,
   voiceDic: "",
   recorder: new Recorder(),
   recordColor: "#2887c1",
   btnElem: "按住说话",
   show: true,
   continueTime: 0,
   starTime: 0,
   Audioduration: "",
   Ashow: false,
  };
 },
 methods: {
  sheetSave() {
   // 确认保存
   this.$toast.loading({
    message: "保存中...",
    forbidClick: true,
    overlay: true,
   });
   let that = this;
   if (this.message == "") {
    this.$toast.fail("内容不能为空");
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
   if (this.$route.name === "ChatCustomer") {
    // 客户画像限定
    let linkmanId = sessionStorage.getItem("linkmanId"); // 当前联系人的ID
    data.itrId = this.userInfo.itr_userid;
    data.compId = this.userInfo.itr_compid;
    data.pid = linkmanId;
    data.signature = generateSignature3(
     0,
     this.userInfo.itr_userid,
     this.userInfo.itr_compid,
     linkmanId,
     timeout,
     nonce
    );
   } else {
    // 客户管理模块-跟进记录模块
    let crmInfoId = JSON.parse(sessionStorage.getItem("_crm_info"))?.id;
    data.itrId = this.$U || local.U();
    data.pid = JSON.parse(sessionStorage.getItem("_crm_info"))?.id;
    data.signature = generateSignature3(
     0,
     this.$U || local.U(),
     this.$C || local.C(),
     crmInfoId,
     timeout,
     nonce
    );
    data.compId = this.$C || local.C();
   }
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
   this.$post1("/api/request/itr/comp/customer/record/save", param)
    .then(function(res) {
     if (res.error === "success") {
      that.$toast({
       message: "新增成功",
       position: "bottom",
      });
      that.$store.commit("ManualUpdate", { target: "sheet", data: data.title });
      if (that.skip !== "noSkip") {
       // 如果不等于noSkip 就跳转。此处时为了兼容客户画像
       setTimeout(() => {
        that.$router.replace("/linkDetailed");
        sessionStorage.setItem("tabNum", 1);
       }, 800);
      } else {
       that.$emit("sheetClose");
      }
      that.$toast.clear();
     } else {
      that.$toast.fail("新增失败");
     }
    })
    .catch(function(error) {
     console.log(error);
     that.$toast.fail("新增失败");
    });
  },
  S4() {
   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  },
  uuid() {
   return this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4();
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
    this.$toast.fail("文件格式不符合要求！目前仅支持png和jpg文件");
    return false;
   } else if (fileSize > 1048576) {
    this.$toast.fail("请上传不超过1M的图片!");
    return false;
   }
   this.uploadImg(file, sessionStorage.getItem("userinfo")?.id);
  },
  uploadImg(file, compId) {
   var that = this;
   var formData = new FormData();
   formData.append("id", this.uuid());
   formData.append("type", 1);
   formData.append("file", file);
   that.imageList.push("1");
   let index = that.imageList.length - 1;
   this.$post("//upload.jiain.net/upload", formData)
    .then((res) => {
     if (res.state === "success") {
      let url = "http://ego-file.soperson.com" + res.url;
      if (that.imageList.length >= 9) {
       that.$toast.fail("最多上传9张图片!");
       return;
      }
      console.log(url);
      that.imageList[index] = url; //成功就填充
      that.$forceUpdate();
      console.log(that.imageList);
     } else {
      that.$toast.fail("上传失败请稍后再试!");
      that.imageList.splice(index, 1);
     }
    })
    .catch((err) => {
     console.log(err);
     that.imageList.splice(index, 1);
    });
  },
  backgo() {
   // 点击返回的时候保存信息
   if (this.$route.name === "SheetImg") {
    this.$router.go(-1);
    sessionStorage.setItem("tabNum", 1);
   }
  },
  userInfos() {
   // 获取当前联系人信息
   return JSON.parse(sessionStorage.getItem("userinfo"));
  },
  empty() {
   // 清空表单数据
   this.message = "";
   this.imageList.length = 0;
   this.checked = "";
  },
  uploadVideo(file, name) {
   if (file == undefined) {
    return false;
   }
   let type = ["ogm", "wmv", "mpg", "webm", "ogv", "mov", "asx", "mpeg", "mp4", "m4v", "avi"];
   var fileSize = file.size; //获得文件大小；
   var filePath = file.type.split("/")[1];
   if (!type.find((item) => item == filePath)) {
    this.$toast.fail("请上传视频类型文件！");
    return false;
   } else if (fileSize > 1073741824) {
    this.$toast.fail("请上传不超过1GB的视频!");
    return false;
   }
   var formData = new FormData();
   formData.append("file", file);
   formData.append("msgType", "video");
   formData.append("compId", this.$C);
   formData.append("userId", this.$U);
   this.$post("/session/media/upload", formData)
    .then((res) => {})
    .catch((err) => {
     this.$toast.fail(err, "upload:error");
    });
  },
  start(event) {
   // 开始录音
   startTime = event.timeStamp;
   //  console.log(startTime, "开始时间");
   posStart = 0;
   posStart = event.touches[0].pageY; //获取起点坐标
   this.btnElem = "松开结束";
   this.recordColor = "red";
   this.$refs.audioBtn.style.transform = "scale(1.1)";
   this.recorder.start().then(
    () => {
     // 开始录音
     console.log(21312321);
    },
    (error) => {
     // 出错了
     console.log(error);
    }
   );
  },
  move(event) {
   posMove = 0;
   posMove = event.targetTouches[0].pageY; //获取滑动实时坐标
   if (posStart - posMove < 200) {
    this.btnElem = "松开结束";
    this.recordColor = "red";
    this.recorder.resume(); // 继续录音
   } else {
    this.btnElem = "松开手指，取消发送";
    this.recordColor = "red";
    this.recorder.pause(); // 暂停录音
   }
  },
  end(event) {
   posEnd = 0;
   posEnd = event.changedTouches[0].pageY; //获取终点坐标
   this.btnElem = "按住说话";
   this.recordColor = "#2887c1";
   this.$refs.audioBtn.style.transform = "scale(1)";
   console.log("end", event.timeStamp, "当前时间", startTime, "开启时间");

   if (event.timeStamp - startTime < 700) {
    // 按的太短了，弹框提示
    this.$toast.fail("You're too short!");
   } else {
    // console.log(posStart, posEnd);
    setTimeout(() => {
     if (posStart - posEnd < 200) {
      console.log("发发发");
      this.getAudioFile();
     } else {
      console.log("取消取消");
     }
    }, 300);
   }
  },

  getAudioFile() {
   // 文件格式转换
   let a = mp3(this.recorder.getWAV(), this.recorder); //WAV ==> mp3
   let files = new window.File([a], "sgg.mp3", { type: a.type }); //blob ===> file
   this.upload(files); // 上传
  },
  upload(file, name) {
   var formData = new FormData();
   formData.append("file", file);
   let phone = JSON.parse(sessionStorage.getItem("_crm_info")).phone;
   this.$post("/upload/temp/9" + phone, formData)
    .then((res) => {
     this.voiceDic = "http://a.looyu.com/temp/9" + phone + "/" + res.id;
     this.Ashow = true;
     this.Audioduration = Math.round(this.recorderduration * 10) / 10;
     console.log(this.voiceDic);
    })
    .catch((err) => {
     this.$toast.fail(err, "upload:error");
    });
  },
 },
 created() {
  this.message = "";
  this.imageList = [];
  this.page = sessionStorage.getItem("active");
 },
 activated() {},
};
</script>

<style lang="less" scoped>
.sheetimg {
 font-size: 0.28rem;
 padding: 0 0.2rem;
 .waupolad {
  display: flex;
  margin-bottom: 10px;
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
   height: 100%;
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
 .circle {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
 }
 /deep/ .van-uploader {
  width: 100%;
  .van-uploader__wrapper {
   width: 100%;
   .van-uploader__input-wrapper {
    width: 100%;
   }
  }
 }
 .pressBtn {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: none;
  color: #fff;
  transition: all 0.5s;
 }
 .SheetTag {
  margin-bottom: 10px;
 }
 .btn-enter-active,
 .btn-leave-active {
  transition: all 0.3s;
 }
}
</style>
