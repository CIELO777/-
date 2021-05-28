<template>
  <div class="addpop">
    <!-- 1.type为选择框 -->
    <!-- {{ this.client.starLeve}} -->
    <van-action-sheet
      v-model="datas.popshow"
      :actions="datas.list"
      @select="onSelect"
    />
    <!-- 2.type为输入框 -->
    <van-popup
      :overlay="false"
      v-model="datas.popshow"
      :style="{ height: '250px' }"
      v-if="datas.types == 2"
      @click-overlay="close"
      position="bottom"
    >
      <div class="module">
        <p>{{ datas.title }}</p>
        <van-field
          v-model="message"
          rows="4"
          autosize
          label=""
          :placeholder="datas.placeholder"
          :type="datas.inpType"
          :maxlength="datas.maxLength"
          show-word-limit
        />
        <van-button
          color="#60C6C6"
          size="mini"
          type="primary"
          @click="savaForm(datas.form)"
          >保存</van-button
        >
      </div>
    </van-popup>
    <!-- 3.type为日期 -->
    <van-popup
      :overlay="false"
      v-if="datas.types == 3"
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="datas.popshow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-datetime-picker
        v-model="datas.birther"
        type="date"
        title="出生日期"
        @confirm="birthdayOk"
        @cancel="cancel"
        :formatter="formatter"
      />
    </van-popup>
    <!-- 4. 区间选择-->
    <van-popup
      v-model="datas.popshow"
      :style="{ height: '300px' }"
      v-if="datas.types == 4"
      @click-overlay="close"
      position="bottom"
    >
      <div class="module">
        <p>{{ datas.title }}</p>
        <div class="max">
          <input
            type="text"
            :placeholder="'最小' + datas.title"
            class="inp"
            v-model="min"
          />
          <input
            type="text"
            :placeholder="'最大' + datas.title"
            class="inp"
            v-model="max"
          />
        </div>
        <van-button color="#60C6C6" size="mini" type="primary" @click="maxSave"
          >保存</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script>
import { formatDate } from '../../uilts/date'

export default {
  props: ['data', 'route'],
  data() {
    return {
      message: "",
      sourceData: [],
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`;
        };
        return value;
      },
      formData: {
        name: "",
        phone: "",
        note: "",
        wechat: "",
        qq: "",
        email: "",
      },
      sheetData: {
        gender: { key: "", value: "" },
        company: { key: "", value: "" },
        companyOcc: { key: "", value: "" },
        title: { key: "", value: "" },
        status: { key: "", value: "" },
        starLevel: { key: "", value: "" },
      },
      client: {
        starLeve: { value: "", key: "" },
        status: { value: "", key: "" },
        sourceType: { value: "", key: "" },
        title: { value: "", key: "" },
        paymentStatus: { value: "", key: "" },
        supplyStatus: { value: "", key: "" },
        billStatus: { value: "", key: "" },
        orderStatus: { value: "", key: "" },
        nolately: { value: "", key: "" },
      },
      min: "",
      max: "",
    }
  },
  computed: {
    datas: {
      get() {
        return this.data
      },
      set(v) {
      }
    },
  },
  methods: {
    close() {
      this.$emit('childClose')
      this.message = ''; // 关闭时候清空数据
    },
    onSelect(item) { // 下拉框选择事件
      let name = this.$route.name;
      console.log(item, this.client);
      // console.log(item.hasOwnProperty('starLeve'));
      if (name === 'detailFilter') {
        if (item.hasOwnProperty('starLeve')) {
          this.client.starLeve.key = item.starLeve;
          this.client.starLeve.value = item.name;
          this.$emit('savasheet', this.client, 'starLeve');
        } else if (item.hasOwnProperty('status')) {
          this.client.status.key = item.status;
          this.client.status.value = item.name;
          this.$emit('savasheet', this.client, 'status');
        } else if (item.hasOwnProperty('sourceType')) {
          this.client.sourceType.key = item.sourceType;
          this.client.sourceType.value = item.name;
          this.$emit('savasheet', this.client, 'sourceType');
        } else if (item.hasOwnProperty('title')) {
          this.client.title.key = item.id;
          this.client.title.value = item.name;
          this.$emit('savasheet', this.client, 'title');
        } else if (item.hasOwnProperty('paymentStatus')) {
          this.client.paymentStatus.key = item.paymentStatus;
          this.client.paymentStatus.value = item.name;
          this.$emit('savasheet', this.client, 'paymentStatus');
        } else if (item.hasOwnProperty('supplyStatus')) {
          this.client.supplyStatus.key = item.supplyStatus;
          this.client.supplyStatus.value = item.name;
          this.$emit('savasheet', this.client, 'supplyStatus');
        } else if (item.hasOwnProperty('billStatus')) {
          this.client.billStatus.key = item.billStatus;
          this.client.billStatus.value = item.name;
          this.$emit('savasheet', this.client, 'billStatus');
        } else if (item.hasOwnProperty('orderStatus')) {
          this.client.orderStatus.key = item.orderStatus;
          this.client.orderStatus.value = item.name;
          this.$emit('savasheet', this.client, 'orderStatus');
        } else if (item.hasOwnProperty('nolately')) {
          this.client.nolately.key = item.nolately;
          this.client.nolately.value = item.name;
          this.$emit('savasheet', this.client, 'nolately');
        }
        // this.$emit('savasheet', this.client);
      } else if (name === 'Addcustomer') {
        if (item.hasOwnProperty('gender')) {
          this.sheetData.gender.key = item.gender;
          this.sheetData.gender.value = item.name;
        } else if (item.hasOwnProperty('companyOcc')) {
          this.sheetData.companyOcc.key = item.companyOcc;
          this.sheetData.companyOcc.value = item.name;
        } else if (item.hasOwnProperty('title')) {
          this.sheetData.title.key = item.id;
          this.sheetData.title.value = item.name;
        } else if (item.hasOwnProperty('status')) {
          this.sheetData.status.key = item.status;
          this.sheetData.status.value = item.name;
        } else if (item.hasOwnProperty('starLevel')) {
          this.sheetData.starLevel.key = item.starLevel;
          this.sheetData.starLevel.value = item.name;
        }
        this.$emit('savasheet', this.sheetData);
      }
      this.close();
    },
    birthdayOk(value) { // 开启时间框
      console.log();
      this.$emit('birthday', formatDate(value));
      this.close();
    },
    cancel() { // 关闭时间框
      this.close()
    },
    savaForm(data) {  // 输入框保存表单
      this.formData[data] = this.message;
      this.$emit('savaForm', this.formData);
      this.close();
    },
    update(data, s) { // 回显组件用
      if (s[data] !== undefined) {
        this.message = s[data]
      }
    },
    updateSheet(data, s) { // 回显组件用
      if (s !== undefined) {
        this.message = s
      }
    },
    updateMax(min, max) { // 区间表单更新数据用
      if (min !== undefined || max !== undefined) {
        this.min = min;
        this.max = max;
      }
    },
    maxSave() { // 区间选择
      this.$emit('MaxinSava', this.min, this.max);
      this.close();
    },
    formatters(value) {
      console.log(value)
    }

  },
  created() {
    console.log(this.datas)
  }

}
</script>

<style lang="less" scoped>
.addpop {
  font-size: 0.32rem;
  /deep/ .van-overlay {
    z-index: 0 !important;
  }
  .module {
    margin-top: 0.25rem;
    button {
      position: fixed;
      right: 0;
      width: 100%;
      bottom: 0;
      font-size: 0.3rem;
      height: 40px;
    }
    .inp {
      background: #eee;
      border-radius: 15px;
      width: 40%;
      height: 30px;
    }
    .max {
      display: flex;
      justify-content: center;
      margin-top: 45px;
      input:first-child {
        margin-right: 15px;
        text-align: center;
      }
      input:last-child {
        margin-right: 15px;
        text-align: center;
      }
    }
  }

  p {
    text-align: center;
  }
}
</style>