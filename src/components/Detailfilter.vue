<template>
  <div class="detailFilter">
    <div v-if="searchList.length == 0" style="margin-bottom: 44px">
      <div class="module">
        <van-cell
          is-link
          title="日期区间"
          @click="lately('date')"
          :value="module.date"
        >
        </van-cell>
        <van-cell
          is-link
          title="最近未联系"
          @click="clickCell(0)"
          :value="clientData.nolately ? clientData.nolately.value : ''"
        >
        </van-cell>
        <van-cell
          is-link
          title="最近已联系"
          @click="lately('yetslately')"
          :value="module.yetslately"
        >
        </van-cell>
        <!-- 日期区间最近已经联系 -->
        <van-popup
          v-model="module.module1"
          round
          :style="{ height: '53%', width: '60%' }"
        >
          <div v-if="module.module1Type === 'date'">
            <datainterval
              :modules.sync="module.module1"
              @timeData="timeDatas(arguments)"
              ref="dataInt"
              :module="diyTime"
              :shows.sync="show"
              :type.sync="TimeType"
              @updating="updatings(arguments)"
            ></datainterval>
          </div>
          <div v-else-if="module.module1Type === 'yetslately'">
            <datainterval
              :modules.sync="module.module1"
              @timeData="timeDatas(arguments)"
              ref="dataInt"
              :module="diyTime"
              :shows.sync="show"
              :type.sync="TimeType"
              @updating="updatings(arguments)"
            ></datainterval>
          </div>
        </van-popup>
        <!-- 最近未联系 -->
        <van-action-sheet
          v-model="module.nolatelyShow"
          :actions="nolatelyList"
          @select="onSelect"
        />

        <!-- <van-action-sheet v-model="module.nolatelyShow" :actions="nolatelyList" @select="onSelect" /> -->
        <!--  日期区间最近已经联系 自定义时间 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
          <van-datetime-picker
            @confirm="Timeok"
            @cancel="TimeCancel"
            v-model="currentDate"
            type="date"
            title="选择年月日"
          />
        </van-popup>
      </div>
      <div class="module">
        <van-field
          label=""
          rows="4"
          placeholder="姓名/手机号/公司名称/微信号/QQ号"
          v-model="name"
        />
        <van-field
          center
          clearable
          label=""
          placeholder="创建人姓名/手机号"
          v-model="company2"
        >
          <template #button>
            <van-icon
              name="arrow"
              size="16"
              color="#9699A6"
              @click="createName('选择创建人')"
            />
          </template>
        </van-field>
        <van-field
          center
          clearable
          label=""
          placeholder="负责人姓名/手机号"
          v-model="company"
          v-if="$route.name == 'Home'"
        >
          <template #button>
            <van-icon
              name="arrow"
              size="16"
              color="#9699A6"
              @click="createName('选择所属人')"
            />
          </template>
        </van-field>
        <van-field label="" rows="4" placeholder="备注信息" v-model="note" />
        <compInfo
          height="calc(100% - 40px)"
          :title="tit"
          :companys.sync="company"
          :companys2.sync="company2"
          ref="compInfo"
          route="detailfilter"
          :totalPageCounts="totalPageCount"
          :compshow.sync="compListShow"
          :user="users"
          :list="compLists"
        ></compInfo>
      </div>
      <div class="module" style="padding-bottom: 50px">
        <van-cell
          is-link
          title="联系人等级"
          :value="clientData.starLeve ? clientData.starLeve.value : ''"
          @click="clickCell(1)"
        >
        </van-cell>
        <van-cell
          is-link
          title="联系人状态"
          :value="clientData.status ? clientData.status.value : ''"
          @click="clickCell(2)"
        >
        </van-cell>
        <van-cell
          is-link
          title="来源方式"
          :value="clientData.sourceType ? clientData.sourceType.value : ''"
          @click="clickCell(3)"
        >
        </van-cell>
        <van-cell
          is-link
          title="来源类型"
          :value="clientData.title ? clientData.title.value : ''"
          @click="clickCell(4)"
        >
        </van-cell>
        <van-cell
          is-link
          title="联系次数"
          :value="
            maxData['5'].min && maxData['5'].max
              ? maxData['5'].min + '至' + maxData['5'].max
              : maxData['5'].min && !maxData['5'].max
              ? maxData['5'].min
              : maxData['5'].max
          "
          @click="clickCell(5)"
        >
        </van-cell>
        <van-cell
          is-link
          title="消费次数"
          :value="
            maxData['6'].min && maxData['6'].max
              ? maxData['6'].min + '至' + maxData['6'].max
              : maxData['6'].min && !maxData['6'].max
              ? maxData['6'].min
              : maxData['6'].max
          "
          @click="clickCell(6)"
        >
        </van-cell>
        <van-cell
          is-link
          title="消费金额"
          :value="
            maxData['7'].min && maxData['7'].max
              ? maxData['7'].min + '至' + maxData['7'].max
              : maxData['7'].min && !maxData['7'].max
              ? maxData['7'].min
              : maxData['7'].max
          "
          @click="clickCell(7)"
        >
        </van-cell>
        <van-cell
          is-link
          title="支付状态"
          :value="
            clientData.paymentStatus ? clientData.paymentStatus.value : ''
          "
          @click="clickCell(8)"
        >
        </van-cell>
        <van-cell
          is-link
          title="发货状态"
          :value="clientData.supplyStatus ? clientData.supplyStatus.value : ''"
          @click="clickCell(9)"
        >
        </van-cell>
        <van-cell
          is-link
          title="开票状态"
          :value="clientData.billStatus ? clientData.billStatus.value : ''"
          @click="clickCell(10)"
        >
        </van-cell>
        <van-cell
          is-link
          title="成交状态"
          :value="clientData.orderStatus ? clientData.orderStatus.value : ''"
          @click="clickCell(11)"
        >
        </van-cell>
        <template v-for="(item, index) in diyColumn">
          <van-cell
            is-link
            :key="index"
            v-if="item.display == 1"
            @click="showPopup(item, index)"
            :title="item.label"
            :value="item.value"
          ></van-cell>
        </template>
        <!-- {{clientData}} -->
        <!-- 自定义表单 -->
        <van-popup
          :safe-area-inset-bottom="true"
          v-model="diy.show"
          position="bottom"
          :style="{ height: '200px' }"
        >
          <p class="pop-tit">修改{{ diy.name }}</p>
          <div v-if="diy.type === 'text' || diy.type === 'textarea'">
            <van-field
              :type="diy.type"
              label=""
              v-model="diy.price"
              :placeholder="diy.placeholder"
            />
          </div>
          <van-button
            size="mini"
            color="#60C6C6"
            @click="DiySave"
            type="primary"
            class="btnTb"
            >保存</van-button
          >
        </van-popup>
        <van-action-sheet
          v-model="diy.showaction"
          :actions="diy.item"
          @select="onSelect"
        />
        <!--  @savaForm="savaForms" -->
        <addpop
          ref="addpop"
          @MaxinSava="MaxinSavas(arguments)"
          route="detailfilter"
          :data="data"
          @savasheet="savasheets(arguments)"
          @childClose="close"
        ></addpop>
      </div>

      <div class="bcc">
        <van-button type="default" @click="empty()">清空</van-button>
        <van-button color="rgb(81, 187, 186)" @click="Save(1)" type="primary"
          >搜索</van-button
        >
      </div>
    </div>
    <van-action-sheet v-model="diy.checkoutPop" @close="actionSheet">
      <template v-for="(item, index) in diy.item">
        <van-checkbox
          @click="checkBoxChange(item, index)"
          :key="index"
          v-model="item.check"
          :data-check="item.check"
          style="
            font-size: 14px;
            height: 40px;
            border-bottom: 1px solid #eee;
            padding: 0 20px;
          "
          >{{ item.label }}</van-checkbox
        >
      </template>
    </van-action-sheet>
    <div v-if="searchList.length > 0">
      <linkman
        padding="0px"
        label="Seas"
        @userIdSave="userIdSaves(arguments)"
        @userIDLength="userIDLengths"
        @chengParentCur="chengParentCurs"
        ref="mychild"
        :list="searchList"
        :totals="searchTotal"
        :users="searchUser"
        :userMaps="userMap"
      >
      </linkman>
      <van-button class="btn" @click="goBack"> 返回 </van-button>
    </div>
  </div>
</template>

<script>
import linkman from '../components/linkman';
import addpop from '../components/detailFilter/addpop';
import compInfo from '../components/detailFilter/CompInfo';
import datainterval from '../components/detailFilter/datainterval';
import {
  generateTimeout,
  generateNonce,
  generateSignature3,
} from "../uilts/tools";
import local from '../uilts/localStorage';
import sha1 from '../uilts/sha1';
import { formatDate } from '../uilts/date';
let timeout = generateTimeout();
let nonce = generateNonce();
export default {
  name: "detailFilter",
  inject: ['reload'],
  data() {
    return {
      show: false,
      module: {
        module1: false,
        module1Type: "",
        date: "",
        nolately: "",
        nolatelykey: "",
        nolatelyShow: false,
        yetslately: "",
      },
      diyTime: {
        timestart: "",
        endtime: "",
      },
      data: {
        popshow: false,
        types: "",
      },
      sourceData: [],
      company: "",
      company2: "",
      totalPageCount: 0,
      compListShow: false,
      users: {},
      compLists: [],
      tit: "",
      section: {},
      type: "",
      name: "",
      note: "",
      cur: "",
      maxData: {
        5: { max: "", min: "", },
        6: { max: "", min: "", },
        7: { max: "", min: "", },
      },
      clientData: {
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
      currentDate: new Date(),
      TimeType: "",
      nolatelyList: [],
      listShow: false,
      searchList: [],
      searchUser: {},
      searchTotal: 0,
      userMap: {},
      timestamp: "",
      noncestr: "",
      appId: "",
      appid2: "",
      timestamp2: "",
      noncestr2: "",
      signature2: "",
      jsapi2: "",
      diyColumn: [],
      diy: {
        name: "",
        show: false,
        showaction: false,
        type: '',
        placeholder: "",
        item: [],
        price: "",
        checkoutPop: false,
      }
    }
  },
  methods: {
    createName(tit) { // 打开列表
      this.tit = tit; // 改变组件的 标题
      this.compListShow = true; // 打开组件
      this.compList();
      this.$refs.compInfo.emptyCur()
      this.$nextTick(() => {  // 滚动条重置
        document.querySelector('#abc').scrollTop = 0; // 重置滚动条
      })
    },
    lately(data) { // 第一模块表单事件
      this.module.module1Type = data;
      this.module.module1 = true;
      this.show = false;
      this.diyTime.timestart = "";
      this.diyTime.endtime = "";
      setTimeout(() => { // 初始化自定义的时间
        this.$refs.dataInt.reast()
      }, 100)
    },
    updatings(data) {  // 子组件更新日期，返回数组，【2015-09-15，2016-10-16】
      if (this.module.module1Type == 'date') {
        data[1] == 7 ? this.module.date = "全部" : this.module.date = data[0].join().replace(',', '至')
      } else if (this.module.module1Type == 'nolately') {
        data[1] == 7 ? this.module.nolately = "全部" : this.module.nolately = data[0].join().replace(',', '至')
      } else {
        data[1] == 7 ? this.module.yetslately = "全部" : this.module.yetslately = data[0].join().replace(',', '至')
      }
      this.module.module1 = false; // 关闭弹框
    },
    clickCell(data) {
      console.log(data)
      if (data == 1) { //客户等级
        this.data = {
          types: 1,
          popshow: true,
          list: [
            {
              name: "未知",
              starLeve: 0,
            },
            {
              name: "一星",
              starLeve: 1,
            },
            {
              name: "二星",
              starLeve: 2,
            },
            {
              name: "三星",
              starLeve: 3,
            },
            {
              name: "四星",
              starLeve: 4,
            },
            {
              name: "五星",
              starLeve: 5,
            },
            {
              name: "全部",
              starLeve: '',
            }
          ],
        };
      } else if (data == 2) { //客户状态
        this.data = {
          types: 1,
          popshow: true,
          list: [
            {
              name: "无效",
              status: 0,
            },
            {
              name: "未知",
              status: 1,
            },
            {
              name: "有效",
              status: 2,
            },
            {
              name: "全部",
              status: '',
            },
          ],
        }
      } else if (data == 3) {//来源方式
        this.data = {
          types: 1,
          popshow: true,
          list: [
            {
              name: "手工录入",
              sourceType: 0,
            },
            {
              name: "表单导入",
              sourceType: 1,
            },
            {
              name: "订单导入",
              sourceType: 2,
            },
            {
              name: "全部",
              sourceType: '',
            },
          ],
        }
      } else if (data == 4) {//来源类型
        this.data = {
          types: 1,
          popshow: true,
          title: "来源类型",
          list: this.sourceData,
          form: 'type',
        }
      } else if (data == 5) {//联系次数
        this.data = {
          types: 4,
          popshow: true,
          title: "联系次数"
        };
        this.$refs.addpop.updateMax(this.maxData['5'].min, this.maxData['5'].max)
      } else if (data == 6) {//消费次数
        this.data = {
          types: 4,
          popshow: true,
          title: "消费次数"
        }
        this.$refs.addpop.updateMax(this.maxData['6'].min, this.maxData['6'].max)
      } else if (data == 7) {//消费金额
        this.data = {
          types: 4,
          popshow: true,
          title: "消费金额"
        }
        this.$refs.addpop.updateMax(this.maxData['7'].min, this.maxData['7'].max)
      } else if (data == 8) {//支付状态
        this.data = {
          types: 1,
          popshow: true,
          title: "支付状态",
          list: [
            {
              name: "未支付",
              paymentStatus: 0,
            },
            {
              name: "已支付",
              paymentStatus: 1,
            },
            {
              name: "部分支付",
              paymentStatus: 2,
            },
            {
              name: "全部",
              paymentStatus: "",
            },
          ],
          form: 'type',
        }
      } else if (data == 9) {//发货状态
        this.data = {
          types: 1,
          popshow: true,
          title: "支付状态",
          list: [
            {
              name: "未发货",
              supplyStatus: 0,
            },
            {
              name: "已发货",
              supplyStatus: 1,
            },
            {
              name: "部分发货",
              supplyStatus: 2,
            },
            {
              name: "全部",
              supplyStatus: "",
            },
          ],
          form: 'type',
        }
      } else if (data == 10) {//开票状态
        this.data = {
          types: 1,
          popshow: true,
          title: "支付状态",
          list: [
            {
              name: "未开票",
              billStatus: 0,
            },
            {
              name: "已开票",
              billStatus: 1,
            },
            {
              name: "部分开票",
              billStatus: 2,
            },
            {
              name: "全部",
              billStatus: "",
            },
          ],
          form: 'type',
        }
      } else if (data == 11) {//成交状态
        this.data = {
          types: 1,
          popshow: true,
          title: "支付状态",
          list: [
            {
              name: "未成交",
              orderStatus: 0,
            },
            {
              name: "已成交",
              orderStatus: 1,
            },
            {
              name: "全部",
              orderStatus: "",
            },
          ],
          form: 'type',
        }
      } else if (data == 0) {
        this.data = {
          types: 1,
          popshow: true,
          title: "支付状态",
          list: [
            { name: '从未联系过', nolately: 1 },
            { name: '超过1周未联系', nolately: 2 },
            { name: '超过2周未联系', nolately: 3 },
            { name: '超过1月未联系', nolately: 4 },
            { name: '超过2月未联系', nolately: 5 },
            { name: '超过3月未联系', nolately: 6 },
            { name: '全部', nolately: 0 },
          ],
          form: 'type',
        }
      };
      this.type = data;
    },
    savasheets(data) {
      // 回显当前那一项
      this.clientData[data[1]] = data[0][data[1]];
    },
    close() { // 关闭窗口
      this.data.popshow = false;
    },
    MaxinSavas(data) { // 区间保存
      this.maxData[this.type].min = data[0];
      this.maxData[this.type].max = data[1];
    },
    compList(cur) {// 所属人下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let signature = generateSignature3(this.$C || local.C(), this.$U || local.U(), timeout, nonce);
      let data = {
        current: cur || 1,
        size: 20,
        compId: this.$C || local.C(),
        timeout: timeout,
        nonce: nonce,
        userId: this.$U || local.U(),
        signature: signature,
      };
      this.$get("/api/request/itr/comp/staff/colleagues", {
        params: data,
      })
        .then((res) => {
          if (!res.error) {
            this.totalPageCount = res.totalPageCount;
            this.compLists = cur ? this.compLists.concat(res.data) : res.data;
            // console.log(res);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getCid() {// 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = JSON.parse(sessionStorage.getItem("userinfo"))?.bind_comp_id;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: 1,
        size: 60,
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      this.$get("/api/request/itr/comp/customer/source/result", {
        params: data,
      })
        .then(function (res) {
          if (!res.error) {
            that.sourceData = res.data.map((item) => {
              return {
                ...item,
                name: item.title,
              };
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    Timeok(item) { // 自定义时间确认
      console.log(this.module.module1Type, item, this.TimeType)
      if (this.module.module1Type == 'date') { // 三个地方用到自定义时间，为了区分
        if (this.TimeType == 'start') {
          this.diyTime.timestart = formatDate(item)
        } else {
          this.diyTime.endtime = formatDate(item);
        }
        this.$refs.dataInt.DiyTime(); // 关闭弹框
      } else if (this.module.module1Type == 'nolately') {
        if (this.TimeType == 'start') {
          this.diyTime.timestart = formatDate(item)
        } else {
          this.diyTime.endtime = formatDate(item);
        }
        this.$refs.dataInt.DiyTime(); // 关闭弹框
      } else if (this.module.module1Type == 'yetslately') {
        if (this.TimeType == 'start') {
          this.diyTime.timestart = formatDate(item)
        } else {
          this.diyTime.endtime = formatDate(item);
        }
        this.$refs.dataInt.DiyTime(); // 关闭弹框 
      }
      this.show = false;
    },
    TimeCancel() {// 自定义时间取消
      this.show = false;
    },
    timeDatas(data) {
      if (this.module.module1Type == 'date') {
        this.module.date = data[0] + '至' + data[1];
      } else if (this.module.module1Type == 'nolately') {
        this.module.nolately = data[0] + '至' + data[1];
      } else {
        this.module.yetslately = data[0] + '至' + data[1];
      }
    },
    latelys() { this.module.nolatelyShow = true; },
    onSelect(item) {
      this.module.nolately = item.name;
      this.module.nolatelykey = item.key;
      this.module.nolatelyShow = false;
    },
    async getColumnConfig() {
      // 请求自定义列表
      let signature = generateSignature3(this.$C || local.C(),
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("compId", this.$C || local.C());
      await this.$post1("/api/request/itr/comp/column/query", param)
        .then((res) => {
          console.log(res);
          res.forEach(item => {
            if (item.type == 'select') {
              let a = JSON.parse(item.items)
              a.push({label:'全部'})
            }
          })
          this.diyColumn = res;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    Save(datas) { // 搜索确认
      this.cur = datas;
      let signature = generateSignature3(this.$U || local.U(), this.$C || local.C(), timeout, nonce);
      let name = sessionStorage.getItem('active');
      let param = new URLSearchParams();
      if (name === 'Common') { // 区分是哪个页面搜索的，加相应字段，防止在全部中过滤
        // param.append("starLevel", 5);
      } else if (name == 'HighSeas') {
        param.append("ownerId", 0);
      }
      param.append("type", 1);
      param.append("userId", this.$U || local.U());
      param.append("compId", this.$C || local.C());
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("current", datas || 1);
      param.append("size", 20);
      param.append("signature", signature);
      if (this.module.date !== '' && this.module.date !== '全部') {
        param.append("startTime", this.module.date.replace('至', ',').split(',')[0] ?? "");
        param.append("endTime", this.module.date.replace('至', ',').split(',')[1] ?? "");
      }
      if (this.module.yetslately !== '' && this.module.yetslately !== '全部') {
        param.append("startContactTime", this.module.yetslately.replace('至', ',').split(',')[0]);
        param.append("endContactTime", this.module.yetslately.replace('至', ',').split(',')[1]);
      }
      if ((this.clientData.nolately?.key !== undefined && this.clientData.nolately?.key != '') && this.clientData.nolately !== undefined) {
        param.append("contactStatus", this.clientData.nolately?.key);
      }
      // return;
      this.name === '' ? "" : param.append("fuzzy", this.name);
      this.company2 === '' ? "" : param.append("creator", this.company2);
      this.company === '' ? "" : param.append("ownerId", this.company);
      this.note === '' ? "" : param.append("remark", this.note);
      (this.clientData.starLeve.key) === '' ? "" : param.append("starLevel", this.clientData.starLeve.key);
      (this.clientData.status.key) === '' ? "" : param.append("status", this.clientData.status.key);
      console.log(this.clientData.sourceType);
      (this.clientData.sourceType.key) === '' ? "" : param.append("sourceType", this.clientData.sourceType.key);
      (this.clientData.title.key) === '' ? "" : param.append("customSourceType", this.clientData.title.key);
      (this.maxData['5'].min === '') ? "" : param.append("minContactNumber", this.maxData['5'].min);
      (this.maxData['5'].max === '') ? "" : param.append("maxContactNumber", this.maxData['5'].max);
      (this.maxData['6'].min === '') ? "" : param.append("minConsumptionNumber", this.maxData['6'].min);
      (this.maxData['6'].max === '') ? "" : param.append("maxConsumptionNumber", this.maxData['6'].max);
      (this.maxData['7'].min === '') ? "" : param.append("minConsumptionTotal", this.maxData['7'].min);
      (this.maxData['7'].max === '') ? "" : param.append("maxConsumptionTotal", this.maxData['7'].max);
      (this.clientData.paymentStatus.key) === '' ? "" : param.append("paymentStatus", this.clientData.paymentStatus.key);
      (this.clientData.supplyStatus.key) === '' ? "" : param.append("supplyStatus", this.clientData.supplyStatus.key);
      (this.clientData.billStatus.key) === '' ? "" : param.append("billStatus", this.clientData.billStatus.key);
      (this.clientData.orderStatus.key) === '' ? "" : param.append("orderStatus", this.clientData.orderStatus.key);
      // 自定义字段
      let str = '';
      this.diyColumn.length > 0 && this.diyColumn.forEach(item => {
        if (item.value) {
          str += item.name + '_' + item.value + '|';
        } else {
          str += item.name + '_' + '|';
        }
      })
      param.append("fuzzys", str.slice(0, str.length - 1))
      this.$post1('/api/request/itr/comp/customer/query', param)
        .then((res) => {
          if (!res.error) {
            if (res.data.length != 0) {
              this.listShow = true;
              this.searchList = datas == 1 ? res.data : this.searchList.concat(res.data);
              console.log(this.searchList)
              this.searchUser = res.user;
              this.userMap = Object.assign(this.userMap, res.user);
              this.searchTotal = res.totalPageCount;
              if (datas == 1) {
                this.$nextTick(() => {
                  this.$refs?.mychild?.initScroll()
                })
              }
              this.$refs?.mychild?.$toast.clear();
            } else {
              this.$toast.fail('未查询到相关信息')
            }

          } else {
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    empty() { // 清空表单
      this.module.date = '';
      this.module.yetslately = '';
      this.clientData.nolately.key = '';
      this.clientData.nolately.value = '';
      this.name = '';
      this.company2 = '';
      this.company = '';
      this.note = '';
      this.clientData.starLeve.key = '';
      this.clientData.status.key = '';
      this.clientData.sourceType.key = '';
      this.clientData.title.key = '';
      this.clientData.starLeve.value = '';
      this.clientData.status.value = '';
      this.clientData.sourceType.value = '';
      this.clientData.title.value = '';
      this.maxData['5'].min = '';
      this.maxData['5'].max = '';
      this.maxData['6'].min = '';
      this.maxData['6'].max = '';
      this.maxData['7'].min = '';
      this.maxData['7'].max = '';
      this.clientData.paymentStatus.key = '';
      this.clientData.supplyStatus.key = '';
      this.clientData.billStatus.key = '';
      this.clientData.orderStatus.key = '';
      this.clientData.paymentStatus.value = '';
      this.clientData.supplyStatus.value = '';
      this.clientData.billStatus.value = '';
      this.clientData.orderStatus.value = '';
      this.diyColumn = this.diyColumn.map(item => {
        return { ...item, value: '' };
      })
    },
    chengParentCurs(data) {
      console.log('daodi')
      if (this.cur == 1 && this.$store.state.current.filter == 1) return; // 第一次搜索没问题，但是搜索后，返回表单，会有触底的时间，很奇怪，所以监听一个用户是否是第一次点击了搜索按钮,如果是的话，那么就不执行
      this.Save(data);
      this.$toast.loading("加载中...");
    },
    goBack() {
      this.$nextTick(() => {
        this.searchList = [];
        this.$refs?.mychild?.initScroll()
      })
    },
    async getWxJsJdk() { // 初始化init wx.config 
      let param = new URLSearchParams();
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("url", 'https://wxa.jiain.net/');
      param.append("type", 1);
      param.append("itrId", itrId);
      let that = this;
      await this.$post1('/wx-crm-server/wx/js_api_ticket/auth',
        param
      )
        .then(res => {
          console.log(res, 'getWxJsJdk')
          // this.signature = res.signature;
          this.appId = res.appId;
          this.noncestr = nonce;
          this.timestamp = timeout / 1000;
          let url = location.href.split('#')[0];
          console.log(url, 'url')
          let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + this.noncestr2 + '&timestamp=' + this.timestamp2 + '&url=' + url
          let signature = sha1.hex_sha1(str1);
          wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，企业微信的corpID
            timestamp: this.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: ['agentConfig', 'selectExternalContact'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
            // that.getAgentConfigApi()
            console.log(that.appid2, that.timestamp2, that.noncestr2, that.signature2)
            wx.agentConfig({
              corpid: that.appid2, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid: res.agentId, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp: that.timestamp2, // 必填，生成签名的时间戳
              nonceStr: that.noncestr2, // 必填，生成签名的随机串
              signature: that.signature2,// 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: ['selectExternalContact'], //必填
              success: function (res) {
                console.log(res, 'readySuccess')
                // 回调
              },
              fail: function (res) {
                alert('失败', res)
                if (res.errMsg.indexOf('function not exist') > -1) {
                  // alert('版本过低请升级')
                }
              }
            });

          });
          wx.error(function (res) {//通过error接口处理失败验证
            console.log(res, 'wx.error')
            // config信息验证失败会执行error
          });
          // } else {
          //   console.log(res.data.errorCode)
          // }
        }).catch(err => {
          // alert('commonError')
          // alert(err, 'commoERror');
        }).catch((err) => {
          console.log(err, 'getWxJsJdkerror');
        });
    },
    async getAgentConfig() {  // 拉取
      let param = new URLSearchParams();
      let url = location.href.split('#')[0];
      let itrId = JSON.parse(sessionStorage.getItem("userinfo")).id;
      param.append("timeout", timeout / 1000);
      param.append("nonce", nonce);
      param.append("url", url);
      param.append("type", 2); // 为2的时候拉去的是
      param.append("itrId", itrId);
      await this.$post1('/wx-crm-server/wx/js_api_ticket/auth',
        param
      ).then((res) => {
        let str1 = 'jsapi_ticket=' + res.jsapi_ticket + '&noncestr=' + nonce + '&timestamp=' + timeout / 1000 + '&url=' + url
        this.jsapi2 = res.jsapi_ticket;  // 这个值是拉取的值agentConfig 值
        this.timestamp2 = timeout / 1000;
        this.noncestr2 = nonce;
        this.signature2 = sha1.hex_sha1(str1);
        this.appid2 = res.appId
      }).catch(() => {
        // alert('commone失败')
      })
    },
    userIDLengths() {
      this.$toast({
        message: '只能关联一个外部联系人',
        position: 'bottom',
      });
    },
    totalLodding() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 10000, // 持续展示 toast
      });
    },
    userIdSaves(data) {   // 选择联系人保存成功
      this.saveWxCrm(data[0], data[1], data[2], data[3])
    },
    saveWxCrm(wxcrm, id, phone, cur) {  // 保存联系人接口
      let that = this;
      let crm = {};
      crm.id = id; // 获取子组件点击的id ，userIdSave
      crm.itrId = this.$U || local.U();
      crm.compId = this.$C || local.C();
      crm.wxCrmId = wxcrm; phone
      // crm.phone = phone;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(async (res) => {
          if (res.error === 'success') {
            this.$toast({
              message: '关联外部联系人成功',
              position: 'bottom',
            });
            this.$nextTick(() => {
              this.Save(1)
              window.document.documentElement.scrollTop = 0;
            })
          } else {
            this.$toast({
              message: res.errMsg,
              position: 'bottom',
            });
          };

        })
        .catch(function (error) {
          console.log(error);
        });
    },
    showPopup(item, index) {  // 打开自定义表单
      console.log(item, index);
      if (item.type == 'text' || item.type == 'textarea') {
        this.diy.show = true;
      } else if (item.type == 'checkbox') {
        console.log(item);
        let backItem = JSON.parse(item.items);
        let a = backItem.find(item => item.check);
        console.log(a, 'aaaaaa');
        if (!a) {
          this.diy.item = backItem.map(item => {
            return {
              ...item,
              check: false
            }
          });
        } else {
          this.diy.item = backItem;
        }
        this.diy.checkoutPop = true;

      } else {
        this.diy.showaction = true;
      }
      // this.diy.headline = e;
      this.diy.name = item.label;
      this.diy.type = item.type;
      this.diy.placeholder = item.placeholder
      this.index = index;
      this.diy.item = JSON.parse(item.items).map(item => {
        return {
          ...item,
          name: item.label
        }
      });
      // this.diy.price = d;
    },
    DiySave() {
      this.diy.show = false;
      this.diyColumn[this.index].value = this.diy.price;
    },
    onSelect(value) { // select选择确认
      console.log(value)
      this.diyColumn[this.index].value = value.value;
      this.diy.showaction = false;
    },
    actionSheet() { // 当多选类型框关闭的时候，进行过滤
      let value = '';
      let label = '';
      this.diy.item.forEach(item => {
        if (item.check) {
          value += item.id + ',';
          label += item.label + ',';
        }
      });
      console.log(this.diyColumn[this.index], 'diyColumndiyColumn', this.index)
      this.diyColumn[this.index].value = label;
      this.$set(this.diyColumn, this.index, this.diyColumn[this.index])
      // this.diy.checkoutPop = false;
    },
    checkBoxChange(item, index) {  // 
      this.diy.item[index].check = item.check;
      let origin = JSON.parse(this.diyColumn[this.index].items);
      let check = { check: item.check };
      let result = { ...JSON.parse(this.diyColumn[this.index].items)[index], ...check }
      origin[index] = JSON.parse(JSON.stringify(result));
      this.diyColumn[this.index].items = JSON.stringify(origin);
    },
  },
  components: { datainterval, addpop, compInfo, linkman },
  async created() {
    // console.log('created')
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    await this.getAgentConfig()
    await this.getWxJsJdk()
    await this.getColumnConfig()
    this.getCid()
  },
  watch: {
    searchList(newName, oldName) {
      if (newName.length == 0) {
        this.$store.commit("ClearCurNum", "filter"); // 等于0的时候我们要清除页数
        this.searchTotal = 0;
      }
    }
  },
  activated() {
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit("cache", "Home,Common,HighSeas,LinkDetailed,detailFilter");
    })
  },
}
</script>

<style lang="less" scoped>
.detailFilter {
  font-size: 0.32rem;
  .module {
    margin-bottom: 8px;
  }
  .bcc {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgb(81, 187, 186);
    height: 44px;
    border: none;
    color: #fff;
    button {
      width: 50%;
    }
  }
  .btn,
  .js {
    margin-top: 10px;
    display: block;
    margin: 10px auto 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .text-ali {
    position: fixed;
    top: -1px;
    left: 0px;
    text-align: center;
    width: 100%;
    font-size: 16px;
    height: 46px;
    line-height: 52px;
    z-index: 999;
    background: #5c5c5c;
    color: #fff;
    i {
      float: left;
      line-height: 48px;
      padding-left: 5px;
    }
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // padding: 10px;
    // box-sizing: border-box;
  }
  #abc {
    height: calc(~"100% - 46px");
    overflow-y: scroll;
  }
  .btnTb {
    position: fixed;
    right: 0;
    width: 100%;
    bottom: 0;
    height: 40px;
    font-size: 0.3rem;
  }
  .pop-tit {
    font-size: 16px;
    padding: 10px;
  }
}
</style>