<template>
  <div class="agentD">
    <!-- <div class="backGo" @click="backgo">
      <van-icon name="arrow-left" size="17px" color="#fff" />
    </div> -->
    <div class="agenTitle">日程内容</div>
    <van-field v-model="message" rows="3" autosize label="留言" type="textarea" placeholder="请输入留言" />
    <div class="agenTitle">提醒时间</div>
    <van-cell is-link title="选择提醒时间" :value="time" @click="agenTime = timeShow = true" />
    <van-popup v-model="timeShow" position="bottom">
      <van-datetime-picker type="datetime" title="选择完整时间" @confirm="timeOk" v-model="currentDate" />
    </van-popup>
    <div class="agenTitle">开启日程</div>
    <van-cell center title="开启日程">
      <template #right-icon>
        <van-switch v-model="checked" active-value="1" inactive-value="0" size="24" />
      </template>
    </van-cell>
    <van-button type="primary" size="large" style="margin-top:50px;background:#51BBBA" @click="AgendSave">保存</van-button>
  </div>
</template>

<script>
import local from '../uilts/localStorage';
import { formatDateTime } from '../uilts/date'
import { generateTimeout, generateNonce, generateSignature3, randomWord } from '../uilts/tools';
let timeout = generateTimeout()
let nonce = generateNonce();
export default {
  name: 'Agendadetail',
  data() {
    return {
      timeShow: false,
      datetime: '',
      checked: false,
      message: '',
      currentDate: new Date(),
      time: '',
      EditId: '',

    }
  },
  methods: {
    AgendSave(id) {  // 新增
      let that = this;
      let { checked, message, time } = this;
      let nonce = randomWord(true, 32, 32)
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let signature = generateSignature3(this.EditId, crmInfo, local.U(), local.C(), timeout, nonce);
      let param = {
        compId: this.$C,
        id: this.EditId,
        nonce,
        ptId: crmInfo,
        remindStatus: Number(checked),
        time: time,
        timeout: timeout,
        title: message,
        userId: this.$U,
        signature: signature,
      };
      this.$get('/api/request/itr/comp/customer/remind/save', {
        params: param,
      })
        .then(function (res) {
          let title = that.EditId == 0 ? "新增成功" : "编辑成功"
          that.$toast({
            message: title,
            position: 'bottom',
          });
          setTimeout(() => {
            that.$router.push('/linkDetailed')
            sessionStorage.setItem('tabNum', 3)
          }, 800)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    timeOk(value) {
      this.time = formatDateTime(value);
      this.timeShow = false;
    },
    backgo() {
      if (this.$route.name == 'Agendadetail') {
        this.$router.push('/linkDetailed')
        sessionStorage.setItem('tabNum', 3);

      };

    }
  },
  created() {
    this.EditId = this.$route.params.id;
    if (this.$route.params.param) {
      this.time = this.$route.params.time;
      this.checked = this.$route.params.remindStatus + "";
      this.message = this.$route.params.title;
    }
  }
}
</script>

<style lang="less" scoped>
.agentD {
  height: calc(~"100vh - 50px");
  background: #f1f1f1;
  font-size: 14px;
  .agenTitle {
    height: 41px;
    line-height: 41px;
    padding-left: 14px;
    color: #597896;
    background: #f1f1f1;
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
      padding-left: 16px;
    }
  }
}
</style>