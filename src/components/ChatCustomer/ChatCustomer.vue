/*
 * @Author: YUN_KONG 
 * @Date: 2021-04-27 11:48:39 
 * @Last Modified by: YUN_KONG
 * @Last Modified time: 2021-06-22 14:54:02
   聊天工具栏客户管理工具栏,和我的客户对话时候快捷打开
   1.先获取当前企业微信联系人ID，并通过code 授权获取this.U and this.C()。
   2.拉取联系人列表通过（wx。wxcrmID）判断在联系人列表里有是否有当前联系人。
   3.如果有直接拉取信息并回显。
   4.没有的话新增一条联系人信息。
 */
<template>
  <div class="ChatCustomer">
    <div :style="masking"></div>
    <header>
      <img :src="imgSrc" alt="" />
      <div class="infoBox">
        <p>名字：{{ name }}</p>
        <div class="details">
          <span>添加时间：{{ createtime }}</span
          ><span @click="details = detailsPop = true">详情 ></span>
        </div>
      </div>
    </header>
    <article class="info">
      <p class="origin">
        <span>手机：{{ crmInfos.phone }}</span>
      </p>
      <ul>
        <li>
          <span>联系人等级：{{ crmInfos.starLevel }}</span>
        </li>
        <li>
          <span>有效性：{{ crmInfos.status }}</span>
        </li>
        <li>
          <span
            >所属公司：{{ crmInfos.company ? crmInfos.company : "暂无" }}</span
          >
        </li>
        <!-- <li><span>邮箱：</span><span>-</span></li> -->
      </ul>
      <!-- 星级暂时注释掉了 -->
      <!-- <div class="star" @click="starSelect">
        <p style="margin-right: 15px">星级 ></p>
        <p>{{ star.data }}</p>
      </div> -->
    </article>
    <!-- <article class="add">
      <p class="origin"><span>Ta添加的：</span><span>-</span></p>
      <span>共{{}}个群聊 ></span>
    </article> -->
    <article class="tab">
      <div class="company">
        <div>
          <span class="title">企业标签</span>
          <div>
            <van-button
              type="primary"
              size="small"
              style="margin-right: 10px"
              @click="syncTag"
              >同步</van-button
            ><van-button
              style="margin-right: 10px"
              type="info"
              size="small"
              @click="AddTab = enterpriseTab = true"
              >操作</van-button
            >
          </div>
        </div>
        <div
          v-for="(item, index) in TagList2"
          :key="index"
          style="margin-top: 5px"
        >
          <p class="grade">{{ item.name }}</p>
          <div v-if="item.tag && item.tag.length > 0">
            <template v-for="(item1, index1) in item.tags">
              <van-button
                style="margin-right: 5px"
                type="default"
                size="small"
                :key="index1"
                >{{ item1.name }}</van-button
              >
            </template>
          </div>
        </div>
        <!-- 
        <van-button type="default" size="small">一般</van-button>
        <p class="grade" style="margin-top: 10px">跟进阶段：</p>
        <van-button type="default" size="small">一般</van-button> -->
      </div>
      <!-- <div class="personage">
        <p>
          <span class="title">个人标签</span
          ><van-button type="info" size="small">添加</van-button>
        </p>
      </div> -->
    </article>
    <article class="dynamic">
      <van-tabs v-model="active" color="#1989FA">
        <van-tab title="跟进记录">
          <CustomerFollow
            :height="height"
            ref="customerFollow"
          ></CustomerFollow>
        </van-tab>
        <van-tab title="企微记录">
          <CustomerChaing :height="height"></CustomerChaing>
        </van-tab>
        <van-tab title="操作记录">
          <CustomerOpera :height="height"></CustomerOpera>
        </van-tab>
      </van-tabs>
    </article>
    <van-tabbar v-model="TabActive" active-color="#646566" z-index="99">
      <van-tabbar-item icon="search" @click="Tabclick(1)"
        >添加跟进</van-tabbar-item
      >
      <!-- <van-tabbar-item icon="friends-o" @click="Tabclick(2)"
        >转接客户</van-tabbar-item
      > -->
      <van-tabbar-item @click="Tabclick(3)">
        <template #icon>
          <van-icon name="chat-o" />
        </template>
        <span> 拨打电话</span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- 详情弹框 -->
    <van-popup
      v-model="detailsPop"
      position="bottom"
      :style="{ height: '100%' }"
      class="detailPop"
      closeable
    >
      <div>
        <p class="titles">客户详情</p>
        <header>
          <img :src="imgSrc" alt="" />
          <div class="infoBox">
            <p>名字：{{ name }}</p>
            <div class="details">
              <span>添加时间：{{ createtime }}</span>
            </div>
          </div>
        </header>
      </div>
      <div class="detailBox">
        <template v-for="(item, index) in form">
          <van-cell
            style="max-height: 44px"
            v-if="item._checked"
            :key="index"
            :is-link="item.nolink == false"
            :title="item.title"
            @click="showPopup(item.key, crmInfos[item.key], item)"
            :value="crmInfos[item.key] === null ? '' : crmInfos[item.key] + ''"
          ></van-cell>
        </template>
      </div>
    </van-popup>
    <!-- 星级选择 -->
    <van-action-sheet
      v-model="star.pop"
      :actions="star.actions"
      @select="starEnter"
    />
    <!-- 企业标签弹框  enterpriseTab-->
    <van-popup
      v-model="enterpriseTab"
      round
      class="enterPrisePop"
      :style="{ height: '60%', width: '65%' }"
    >
      <p>添加企业标签</p>
      <article style="height: 45vh; overflow-y: scroll">
        <div
          v-for="(item, index) in TagList"
          :key="index"
          style="margin-top: 5px"
        >
          <p class="grade">{{ item.name }}</p>
          <div v-if="item.tag && item.tag.length > 0">
            <template v-for="(item1, index1) in item.tags">
              <van-button
                style="margin-right: 5px; margin-bottom: 6px"
                :type="item1.checked ? 'info' : 'default'"
                size="mini"
                plain
                @click="hitTagBtn(item, index, item1, index1)"
                :key="index1"
                >{{ item1.name }}</van-button
              >
            </template>
          </div>
        </div>
      </article>
      <!-- <van-tabs v-model="tagAction" color="#1989FA">
        <van-tab title="标签">
          <div style="display: flex; flex-shirk: 1">
            <span style="flex-shrink: 0; line-height: 23px">选择标签组：</span
            ><select
              class="TagSelect"
              v-model="SelectTag"
              @change="changeSelectTag"
            >
              <option
                :value="index"
                v-for="(item, index) in TagList"
                :key="index"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
          <input
            type="text"
            placeholder="输入后回车保存标签"
            style="width: 100%; height: 50px"
            v-model="Tagname"
            @keyup.enter="addTag(1)"
          />
          <template
            v-for="(item, index) in SelectTagList"
            style="margin-top: 5px"
          >
            <van-button
              :key="index"
              size="mini"
              plain
              type="info"
              style="margin: 0 3px 7px"
              >{{ item.name
              }}<van-icon @click="deleTag(item, index, 1)" name="cross"
            /></van-button>
          </template>
        </van-tab>
        <van-tab title="标签组">
          <input
            type="text"
            placeholder="输入后回车保存标签组"
            style="width: 100%; height: 50px"
            v-model="Tagname"
            @keyup.enter="addTag(2)"
          />
          <template v-for="(item, index) in TagList">
            <van-button
              :key="index"
              size="mini"
              plain
              type="info"
              style="margin: 0 3px 7px"
              >{{ item.name
              }}<van-icon @click="deleTag(item, index, 2)" name="cross"
            /></van-button>
          </template>
        </van-tab>
      </van-tabs> -->

      <van-button
        class="btn"
        type="primary"
        block
        size="small"
        color="#1989FA"
        @click="enterPriseSave"
        >保存</van-button
      >
    </van-popup>
    <!-- column自定义弹框 -->
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="diy.show"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
    >
      <p class="pop-tit">修改{{ diy.name }}</p>
      <div v-if="diy.type === 'text' || diy.type === 'textarea'">
        <van-field
          type="textarea"
          autosize
          v-model="diy.price"
          :placeholder="diy.placeholder"
          :maxlength="100"
          rows="4"
        />
      </div>
      <van-button
        size="mini"
        color="#60C6C6"
        type="primary"
        @click="FormSave(diy.price, diy.headline, 'show')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <!-- colunmn 自定义下拉框 -->
    <van-action-sheet
      v-model="diy.showaction"
      :actions="diy.item"
      @select="onSelect"
    />
    <!-- 地区 -->
    <van-overlay
      :show="popShow.region"
      z-index="99999"
      @click.stop="regionShow"
    >
      <p class="operaTion">
        <span @click="regionPop = popShow.region = false">取消</span
        ><span>选择地区</span><span @click="regionSave">保存</span>
      </p>
      <v-distpicker
        :province="province"
        :city="city"
        :area="area"
        @province="Sprovince"
        @city="Scity"
        @area="Sarea"
        type="mobile"
      ></v-distpicker>
    </van-overlay>
    <!-- 公司信息 -->
    <compInfo
      height="calc(100% - 97px)"
      :route="routeType"
      :companys.sync="company"
      ref="compInfo"
      :totalPageCounts="totalPageCount"
      :compshow.sync="compListShow"
      :user="users"
      :list="compLists"
      @allocationChange="allocationChange"
      @allocaCur="allocaCurs"
      @search="searchs(arguments)"
    >
    </compInfo>
    <!-- 共享客户 -->
    <shareUser
      :ids.sync="share.ids"
      height="calc(100% - 94px)"
      ref="shareUser"
      :totalPageCounts="share.Count"
      :shareshow.sync="share.show"
      :list="share.list"
      @closeShare="closeShare"
    >
    </shareUser>
    <!-- 添加跟进记录 -->
    <van-popup
      v-model="sheetPop"
      position="bottom"
      closeable
      :style="{ height: '100%' }"
    >
      <Sheetimg
        @sheetClose="colseSheet"
        skip="noSkip"
        ref="Sheetimg"
      ></Sheetimg>
    </van-popup>
    <!-- 固定表单 -->
    <van-action-sheet
      :actions="actionsCoo"
      v-model="popShow.companyOcc"
      @select="onSelectJob"
    />
    <!-- 转接客户弹框 -->
    <van-popup
      v-model="changeOverPop"
      position="bottom"
      :style="{ height: '80%' }"
      closeable
      class="changeOverPop"
    >
      <p>转接客户</p>
      <van-notice-bar
        color="#1989fa"
        wrapable
        :scrollable="false"
        background="#ecf9ff"
        left-icon="info-o"
        text="注意：90天内客户只能被转接一次，一个客户最多只能被转接两次"
        style="margin: 10px 0"
      />
      <span class="title">选择员工</span>
      <!-- <van-search
        @input="StaffSearch"
        v-model="changeValue"
        placeholder="搜索......"
      /> -->
      <article @scroll="scrollClient" class="clientList">
        <div
          v-for="(item, index) in StaffList"
          :key="index"
          @click="OpenDataClick($event, item, index)"
          class="openData"
        >
          <ww-open-data type="userName" :openid="item.wxUserId" />
          <van-radio
            :key="index + 'c'"
            v-show="index == pitchIndex"
          ></van-radio>
        </div>
      </article>
      <van-button
        type="info"
        block
        @click="ChangeEnterOk = changeOverEnter = true"
        >确认</van-button
      >
    </van-popup>
    <!-- 转接客户确认弹框 -->
    <van-popup
      v-model="changeOverEnter"
      position="bottom"
      closeable
      :style="{ height: '80%' }"
      class="changeOverEnter"
      ><p>转接客户</p>
      <van-notice-bar
        color="#1989fa"
        wrapable
        :scrollable="false"
        background="#ecf9ff"
        left-icon="info-o"
        text="转接后客户将在24小时后成功转接，若客户拒绝，本次转接将不会生效"
        style="margin: 10px 0"
      />
      <span class="title">客户将接收以下消息</span>
      <article class="infos">
        <div>
          <img src="../../assets/img/userinfo.png" alt="" />
          <div class="messages">
            您好，您的服务已经升级，后续将由我的同事接替我的工作，继续为您服务!
          </div>
        </div>
      </article>
      <div class="btns">
        <van-button
          plain
          type="info"
          @click="closeOverEnter = changeOverEnter = false"
          >返回</van-button
        >
        <van-button type="info" @click="allocation">确认转接</van-button>
      </div>
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.nickname"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">姓名</p>
      <van-field
        label=""
        v-model="formData.nickname"
        placeholder="请输入姓名"
        :autofocus="true"
      />
      <van-button
        size="mini"
        color="#60C6C6"
        type="primary"
        @click="FormSave(formData.nickname, 'nickname', 'nickname')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.phone"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">手机</p>
      <van-field
        label=""
        type="tel"
        v-model="formData.phone"
        placeholder="请输入手机号"
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.phone, 'phone', 'phone')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.workNumber"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">手机2</p>
      <van-field
        label=""
        type="tel"
        v-model="formData.workNumber"
        placeholder="请输入手机号"
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.workNumber, 'workNumber', 'workNumber')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.address"
      closeable
      position="bottom"
      :style="{ height: '200px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">修改详细地址</p>
      <van-field
        label=""
        type="tel"
        v-model="formData.address"
        placeholder=""
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.address, 'address', 'address')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-action-sheet
      :actions="validityactions"
      v-model="popShow.status"
      @select="onSelectStatus"
      :close-on-click-overlay="overlay"
    />
    <van-action-sheet
      :actions="sourceData"
      v-model="popShow.customSourceType"
      @select="onSelectCID"
      :close-on-click-overlay="overlay"
    />
    <van-action-sheet
      :actions="actionsStar"
      v-model="popShow.starLevel"
      :close-on-click-overlay="overlay"
      @select="onSelectStart"
    />
    <van-action-sheet
      :actions="actionsSex"
      v-model="popShow.gender"
      :close-on-click-overlay="overlay"
      @select="onSelectSex"
    />
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.remark"
      closeable
      position="bottom"
      :style="{ height: '250px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">备注</p>
      <van-field
        label=""
        v-model="formData.remark"
        type="textarea"
        rows="4"
        placeholder="请输入备注"
      />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.remark, 'remark', 'remark')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.birthday"
      position="bottom"
      :style="{ height: '45%' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <van-datetime-picker
        v-model="formData.birthday"
        type="date"
        title="出生日期"
        @confirm="birthdayOk"
        :formatter="formatter"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.wx"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">微信</p>
      <van-field label="" v-model="formData.wx" placeholder="请输入微信号" />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        block
        @click="FormSave(formData.wx, 'wx', 'wx')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.qq"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">QQ</p>
      <van-field label="" v-model="formData.qq" placeholder="请输入QQ号" />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.qq, 'qq', 'qq')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <van-popup
      close-icon-position="top-left"
      :safe-area-inset-bottom="true"
      v-model="popShow.email"
      closeable
      position="bottom"
      :style="{ height: '180px' }"
      @click-overlay="closePop"
      :close-on-click-overlay="overlay"
    >
      <p class="pop-tit">邮箱</p>
      <van-field label="" v-model="formData.email" placeholder="请输入邮箱号" />
      <van-button
        color="#60C6C6"
        size="mini"
        type="primary"
        @click="FormSave(formData.email, 'email', 'email')"
        class="btnTb"
        >保存</van-button
      >
    </van-popup>
    <BindPop :shows="show" @BindComplete="BindCompletes"></BindPop>
  </div>
</template>
<script>
// import wxxx from '../../uilts/wxconfig';
import BindPop from '../../components/ChatCustomer/BindPop'
import wxxxChat from '../../uilts/wxconfigChat';
import { Toolbar } from '../../uilts/toolbarMixin';
import local from '../../uilts/localStorage';
import { generateTimeout, generateNonce, generateSignature3, generateSignature4 } from "../../uilts/tools";
let timeout = generateTimeout();
let nonce = generateNonce();
import VDistpicker from 'v-distpicker'
import compInfo from "../detailFilter/CompInfo";
import shareUser from '../detailFilter/shareUser'
import { formatDate, timestampToTime } from "../../uilts/date";
import CustomerFollow from '../../components/CustomerModule/CustomerFollow.vue';
import CustomerOpera from '../../components/CustomerModule/CustomerOpera.vue';
import CustomerChaing from '../../components/CustomerModule/CustomerChaing.vue';
import Sheetimg from '../../components/Sheetimg.vue';
export default {
  name: "ChatCustomer",
  components: { VDistpicker, compInfo, shareUser, CustomerFollow, CustomerOpera, CustomerChaing, Sheetimg, BindPop },
  mixins: [Toolbar],
  data() {
    return {
      height: '58vh',
      show: false,
      overlay: true,
      sheetPop: false,
      loading: false,
      finished: false,
      active: 0,
      TabActive: 0,
      code: '',
      UserId: '',
      open_userid: '',
      CorpId: '',
      Single: false,
      compId: '',
      detailsPop: false,
      star: {
        data: '',
        pop: false,
        actions: [
          {
            name: "未知",
            starLevel: 0,
          },
          {
            name: "一星",
            starLevel: 1,
          },
          {
            name: "二星",
            starLevel: 2,
          },
          {
            name: "三星",
            starLevel: 3,
          },
          {
            name: "四星",
            starLevel: 4,
          },
          {
            name: "五星",
            starLevel: 5,
          },
        ]
      },
      wxcrmId: '',
      userInfo: {},
      name: '',
      sms: '',
      codes: "",
      times: 60,
      coinNumber: 0,
      sendings: "发送验证码",
      enterpriseTab: false,
      form: [],
      cooList: [
        "职员",
        "经理",
        "总监",
        "总经理",
        "董事长",
        "企业法人",
        "公司股东",
        "未知",
      ],
      validityactions: [
        { name: "无效", status: 0 },
        { name: "未知", status: 1 },
        { name: "有效", status: 2 },
      ],
      actionsStar: [
        {
          name: "未知",
          starLevel: 0,
        },
        {
          name: "一星",
          starLevel: 1,
        },
        {
          name: "二星",
          starLevel: 2,
        },
        {
          name: "三星",
          starLevel: 3,
        },
        {
          name: "四星",
          starLevel: 4,
        },
        {
          name: "五星",
          starLevel: 5,
        },
      ],
      actionsSex: [
        {
          name: "女",
          gender: 0,
        },
        {
          name: "男",
          gender: 1,
        },
        {
          name: "未知",
          gender: 2,
        },
      ],
      actionsCoo: [
        {
          name: "未知",
          companyOcc: -1,
        },
        {
          name: "职员",
          companyOcc: 0,
        },
        {
          name: "经理",
          companyOcc: 1,
        },
        {
          name: "总监",
          companyOcc: 2,
        },
        {
          name: "总经理",
          companyOcc: 3,
        },
        {
          name: "董事长",
          companyOcc: 4,
        },
        {
          name: "企业法人",
          companyOcc: 5,
        },
        {
          name: "公司股东",
          companyOcc: 6,
        },
      ],
      crmInfos: {},
      item: {},
      diy: {
        name: '',
        show: false,
        showaction: false,
        placeholder: "",
        type: "",
        item: [],
        value: "",
        headline: "", // 标题目的获取是哪个表单用
        price: "",
      },
      share: {
        show: false,
        height: 'calc(~100% - 94px)',
        Count: 0,
        list: [],
        ids: "",
      },
      popShow: {
        nickname: false,
        phone: false,
        status: false,
        customSourceType: false,
        sourceType: false,
        wx: false,
        qq: false,
        starLevel: false,
        email: false,
        gender: false,
        companyOcc: false,
        remark: false,
        birthday: false,
        company: false,
        relation: false,
        follow: false,
        followDate: false,
        workNumber: false,
        address: false,
        region: false,
      },
      formData: {
        nickname: "",
        phone: "",
        status: "",
        customSourceType: "",
        sourceType: "",
        wx: "",
        qq: "",
        email: "",
        starLevel: "",
        gender: "",
        companyOcc: "",
        remark: "",
        birthday: new Date(),
        company: "",
        relation: "",
        follow: "",
        followDate: "",
        workNumber: "",
        address: '',
        region: '',
      },
      compListShow: false,
      province: '北京市',
      city: '北京市',
      area: '海淀区',
      routeType: '',
      company: "",
      totalPageCount: "",
      compListShow: false,
      users: {},
      compLists: [],
      sourceData: [],
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2060, 10, 1),
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        }
        return value;
      },
      changeOverPop: false,
      changeOverEnter: false,
      changeValue: '',
      linkmanId: '',
      imgSrc: '',
      name: '',
      createtime: '',
      StaffCur: 1,
      StaffList: [],
      StaffTotal: 0,
      takeover_userid: '',
      pitchIndex: '清空',
      TagList: [],
      TagList2: [],
      Tagname: '',
      tagAction: 0,
      SelectTag: '',
      SelectTagList: [],
      echoTag: [],
      masking: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        zIndex: 999,
      },
    };
  },
  methods: {
    starEnter() { },
    Tabclick(data) {
      if (data === 1) {
        this.sheetPop = true;
        this.$nextTick(() => {
          this.$refs.Sheetimg.empty() // 清空表单;
        })
      } else if (data == 2) {
        this.changeOverPop = true;
        this.pitchIndex = '清空'; // 清空选中按钮
        this.takeover_userid = ''; // 清空选中员工
        this.getStaffList(); // 请求员工列表
      } else if (data == 3) {
        window.location.href = `tel:${this.crmInfos.phone}`; // type== 0 关闭弹框
      }
    },
    showPopup(e, d, items) {
      console.log(e, d, items)
      this.item = items; // 备份ITEM; 必填校验用
      if (e.includes("column")) {
        let item = this.findSelect(e);
        if (item.type == 'text' || item.type == 'textarea') {
          this.diy.show = true;
        } else {
          this.diy.showaction = true;
        }
        this.diy.headline = e;
        this.diy.name = item.label;
        this.diy.type = item.type
        this.diy.item = JSON.parse(item.items).map(item => {
          return {
            ...item,
            name: item.value
          }
        });
        this.diy.price = d;
      } else {
        if (e == "company") {
          this.compList();
          this.compListShow = true;
          this.routeType = 'LinkDetailed';
        }
        if (e == "share") { // 共享客户弹框
          this.share.show = true;
          this.share.ids = this.crmInfos.share1.map(item => {
            return item.userId;
          }).join(',')
          this.$refs.shareUser.clickshare(this.share.ids) // 触发子元素方法目的请求已经共享的数据
        };
        if (e == 'region' && d) { // 地区回显
          this.province = d.split('-')[0];
          this.city = d.split('-')[1];
          this.area = d.split('-')[2];
        }
        this.popShow[e] = true; // 打开弹框
        if (e == 'share') {
          this.formData[e] = d; // 回显数据
        }
        console.log(this.popShow)
        this.formData[e] = d; // 回显数据
        if (e == 'phone') { // 如果是手机号那么弹框显示全部手机号
          this.formData[e] = this.crmInfos.phone_back; // 回显数据
        }
      }
    },
    onSelect(e) {
      this.FormSave(e.value, this.diy.headline, 'showaction')
    },
    onSelectJob(item) {
      this.saveSelect("companyOcc", item.companyOcc, "companyOcc");
    },
    closeShare() {
      this.getCrm()
    },
    closePop() { },
    regionSave() {
      let { province, city, area } = this;
      if (province !== '' && city !== '' && city !== '市' && area !== '区' && area !== '') {
        // this.popShow.region = false;
        this.formData.region = this.province + '-' + this.city + '-' + this.area;
        this.saveSelect("region", this.formData.region, "region");
      }
    },
    regionShow() { // 选中
      // this.popShow.region = false;
      let { province, city, area } = this;
      if (province !== '' && city !== '' && area !== '') {
        // this.popShow.region = false;
      }
    },
    onSelectStatus(item, index) {
      this.saveSelect("status", item.status, "status");
    },
    onSelectCID(item, index) {
      this.saveSelect("customSourceType", item.id, "customSourceType");
    },
    onSelectStart(item, index) {
      this.saveSelect("starLevel", item.starLevel, "starLevel");
    },
    onSelectSex(item, index) {
      this.saveSelect("gender", item.gender, "gender");
    },
    allocationChange(data) {
      console.log('allocationChange')

    },
    allocaCurs(data) {
      console.log('allocationChange')
    },
    searchs(data) { },
    birthdayOk(value) {
      this.saveSelect("birthday", formatDate(value), "birthday");
    },
    searchcompList(cur, DATAS) {
      // 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = this.userInfos().bind_comp_id1;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: cur[0] || 1,
        size: 20,
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      if (DATAS !== '') {
        data.fuzzy = DATAS
      } else {
        delete data.fuzzy
      };
      this.$get("/api/request/itr/comp/customer/company/result", {
        params: data,
      })
        .then((res) => {
          if (!res.error && res.data.length > 0) {
            let data = res.data.map((item) => {
              var reg = /^(\d{3})\d{4}(\d{4})$/;
              return {
                ...item,
                encrypt: item.ownerId.replace(reg, "$1****$2"),
              };
            });
            this.compLists = cur == 1 ? data : this.compLists.concat(data);
            this.totalPageCount = res.totalPageCount;
            this.users = res.user;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    saveSelect(key, data, ourName) {
      // 下拉表单提交
      let that = this;
      let crm = {};
      crm.id = this.crmInfos.id;
      crm.itrId = this.userInfos().id;
      crm.compId = this.userInfos().bind_comp_id1;
      // crm.phone = this.crmInfo.phone; // 去掉
      let signature = generateSignature3(
        crm.id,
        crm.itrId,
        crm.compId,
        timeout,
        nonce
      );
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      // 手动更新列表数据，防止返回刷新，scrolltop 丢失；
      crm[key] = data;
      // if (key == 'gender') {
      //   that.$store.commit("ManualUpdate", { target: "gender", data }); // 更新列表数据
      // }
      if (crm.sourceType) {
        crm.customSourceType = crm.sourceType || "";
      }
      if (crm.companyOcc == 7) {
        crm.companyOcc = -1;
      }
      // if(crm.starLevel == 0 || crm.starLevel === undefined){
      //   delete crm.starLevel 
      // }
      if (this.item?.required && this.item.required == 1 && key === '') { // 必填 && 数据为空;
        this.$toast.fail("表单为必填项，请填写内容")
        return;
      }
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(function (res) {
          if (res.error === "success") {
            that.popShow[ourName] = false; // 关闭弹框
            // that.$emit("getCrm"); // 更新数据
            that.getCrm()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    FormSave(data, type, ourType) {
      // 保存表单数据
      let that = this;
      let crm = {};
      let lock = 0; // 如果为1走自定义编辑1了，区分弹框关闭
      crm.id = this.crmInfos.id;
      crm.itrId = this.userInfos().id;
      crm.compId = this.userInfos().bind_comp_id1;
      // crm.phone = this.crmInfo.phone;  // 传这个参数会导致有时联系人已经存在
      let signature = generateSignature3(
        crm.id,
        crm.itrId,
        crm.compId,
        timeout,
        nonce
      );
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      if (crm.sourceType) {
        crm.customSourceType = crm.sourceType || "";
      }
      if (crm.companyOcc == 7) {
        crm.companyOcc = -1;
      }
      if ((type == "nickname" && data === "") || data === null) {
        this.$toast({
          message: "姓名不能为空",
          position: "bottom",
        });
        return;
      } else if ((type == "phone" && data === "") || data === null) {
        this.$toast({
          message: "手机不能为空",
          position: "bottom",
        });
        return;
      }
      switch (type) {
        case "nickname":
          crm[type] = data;
          break;
        case "phone":
          crm[type] = data;
          break;
        case "wx":
          crm[type] = data;
          break;
        case "qq":
          crm[type] = data;
          break;
        case "email":
          crm[type] = data;
          break;
        case "remark":
          crm[type] = data;
          break;
        case "workNumber":
          crm[type] = data;
          break;
        case "address":
          crm[type] = data;
          break;
        case "company":
          crm.company = data;
          break;
      }
      if (type.includes('column')) { // 自定义字段
        lock = 1;
        crm[type] = data;
      }
      // _checked ? '显示' ： '隐藏';
      // required  && required=1 ? '必填' ： ‘不必填’
      if (this.item?.required && this.item.required == 1 && data === '') { // 必填 && 数据为空;
        this.$toast.fail("表单为必填项，请填写内容")
        return;
      }
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then(function (res) {
          if (res.error === "success") {
            if (lock == 0) {
              that.popShow[ourType] = false
            } else {
              that.diy[ourType] = false
            }
            that.getCrm();  // 更新列表信息
          } else {
            if (lock == 0) {
              that.popShow[ourType] = false
            } else {
              that.diy[ourType] = false
            }
            that.$toast(res.errMsg)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    Sprovince(data) {
      this.province = data.value;
    },
    Scity(data) {
      this.city = data.value;
    },
    Sarea(data) {
      this.area = data.value;
    },
    compList(cur) {
      // 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = this.userInfos().bind_comp_id1;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: cur || 1,
        size: 20,
        compId: compID,
        timeout: timeout,
        nonce: nonce,
        signature: signature,
      };
      this.$get("/api/request/itr/comp/customer/company/result", {
        params: data,
      })
        .then((res) => {
          if (!res.error && res.data.length > 0) {
            let data = res.data.map((item) => {
              var reg = /^(\d{3})\d{4}(\d{4})$/;
              return {
                ...item,
                encrypt: item.ownerId.replace(reg, "$1****$2"),
              };
            });
            this.compLists = cur || cur == 1 ? data : this.compLists.concat(data);
            this.totalPageCount = res.totalPageCount;
            this.users = res.user;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getCid() {
      // 来源方式下拉框接口请求
      let that = this;
      let timeout = generateTimeout();
      let nonce = generateNonce();
      let compID = this.userInfos().bind_comp_id1;
      let signature = generateSignature3(compID, timeout, nonce);
      let data = {
        current: 1,
        size: 999,
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
    getColumn() { // 获取客户详情表单;
      let signature = generateSignature3(
        this.userInfos().id,
        this.userInfos().bind_comp_id1,
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("userId", this.userInfos().id);
      param.append("signature", signature);
      param.append("compId", this.userInfos().bind_comp_id1);
      this.$post1("/api/request/itr/comp/column/config/detail", param)
        .then((res) => {
          let form = JSON.parse(res.data);
          this.form = form
            .map((item) => {
              if (
                item.key == "itrNickname" ||
                item.key == "ownerNickname" ||
                item.key == "sourceType" ||
                item.key == "orderStatus" ||
                item.key == "paymentStatus" ||
                item.key == "supplyStatus" ||
                item.key == "billStatus" ||
                item.key == "costingTotal" ||
                item.key == "supplyTime" ||
                item.key == "consumptionTotal" ||
                item.key == "consumptionNumber"
              ) {
                item.nolink = true;
              } else {
                item.nolink = false;
              }
              if (item.title === '公司信息') {
                item.title = '所属公司'
              }
              return item;
            })
        })
        .catch((error) => {
          console.log(error);
        });
    },
    conversionNum(data) {
      let result = '';
      if (data == 0) {
        result = '未知'
      } else if (data == 1) {
        result = '一星'
      } else if (data == 2) {
        result = '二星'
      } else if (data == 3) {
        result = '三星'
      } else if (data == 4) {
        result = '四星'
      } else if (data == 5) {
        result = '五星'
      }
      return result;
    },
    async getCrm() { // 获取基本信息
      let that = this;
      let crmInfoId = this.linkmanId;
      let signature = generateSignature3(this.userInfos().id, this.userInfos().bind_comp_id1, crmInfoId, timeout, nonce);
      await this.$get('/api/request/itr/comp/customer/detail', {
        params: {
          id: crmInfoId,
          compId: this.userInfos().bind_comp_id1,
          userId: this.userInfos().id,
          nonce,
          timeout,
          signature: signature
        },
      })
        .then((res) => {
          if (!res.error) {
            let shareStr = '';
            res.share.forEach(item => { // 遍历循环字符串
              shareStr = shareStr + res.user[item.userId].nickname + ','
            })
            let ownerNickname = res.user[res.ownerId]?.nickname || '';
            let a = {
              ...res,
              status: res.status == 0 ? '无效' : (res.status == 1 ? "未知" : "有效"),
              sourceType: res.sourceType == 0 ? '手动录入' : res.sourceType == 1 ? '表单导入' : '订单导入',
              itrNickname: res.user[res.creator].nickname,
              ownerNickname: ownerNickname,
              starLevel: this.conversionNum(res.starLevel),
              gender: res.gender == 2 ? '未知' : res.gender == 1 ? '男' : '女',
              companyOcc: this.cooList[res.companyOcc == -1 ? 7 : res.companyOcc],
              contactNumber: res.contactNumber + '次',
              orderStatus: res.orderStatus == 1 ? '已成交' : '未成交',
              paymentStatus: res.paymentStatus == 1 ? '已支付' : res.paymentStatus == 2 ? '部分支付' : '未支付',
              supplyStatus: res.supplyStatus == 0 ? '未发货' : '已发货',
              billStatus: res.billStatus == 0 ? '未开票' : '已开票',
              consumptionTotal: res.consumptionTotal + '元',
              consumptionNumber: res.consumptionNumber + '元',
              customSourceType: res.customSourceTitle,
              share: shareStr,
              share1: res.share,
              phone_back: res.phone,
              phone: res.phone && res.phone.replace(res.phone.substring(3, 7), "****"),
            }
            that.imgSrc = res.portrait;
            that.crmInfos = a;
            this.masking = '';  // 清空蒙版
            this.$toast.clear(); // 清空loading框
          }
        })
        .catch((error) => {
          this.$toast.fail('加载失败，请检查配置是否正确');
          console.log(error);
        });
    },
    findSelect(name) { // 查询自定义行数当前·数据
      return this.form.find(item => name === item.key)
    },
    init() {
      this.wxxxx().then(async res => { // 企业微信授权
        await this.verifyWxId() // 检查联系人列表是否存在
      })
    },
    wxxxx() { // 企业微信授权 获取当前客户的wxID
      let that = this;
      return new Promise(function (resolve, reject) {
        let begin = setInterval(async () => {
          if (that.accomplish) {
            clearInterval(begin); // 清空定时器
            wxxxChat().then(res => {
              that.wxcrmId = res;
              sessionStorage.setItem('wxcrmId', res)
              resolve(res);
            }).catch(error => {
              reject(error)
            })
          }
        }, 500)
      })
    },
    async verifyWxId() { // 校验wxcrmID 查询联系人列表是否存在
      this.getName(); // 获取名字
      let signature = generateSignature3(
        this.userInfos().bind_comp_id1,
        this.userInfos().id,
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("userId", this.userInfos().id);
      param.append("compId", this.userInfos().bind_comp_id1);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("wxCrmId", this.wxcrmId || 'wmmmFVEAAAQbwte-CPVAc-zHKbGgErzA'); //  联系人的微信ID 'wmmmFVEAAAQbwte-CPVAc-zHKbGgErzA'
      param.append("wxUserId", this.oneselfWxId()); // 自己的微信ID
      param.append("current", 1); // 默认页数是1
      param.append("signature", signature);
      await this.$post1("/api/request/itr/comp/customer/query", param)
        .then(async (res) => {
          if (res.data.length > 0) { // 大于0证明有数据，那么就拉去数据回显
            this.linkmanId = res.data[0].id; // 当前联系人ID
            sessionStorage.setItem('linkmanId', res.data[0].id)
            await this.getTagList(); // 标签列表
            await this.getCrm()
            this.getCid()
            this.getColumn();  // 拉去表单页面
            let tagResult = Object.entries(res.tag);
            if (res.tag && tagResult[0] && tagResult[0][1].length > 0) {
              this.echoTag = tagResult[0][1];
              this.FindFatherTag(this.echoTag, this.TagList); //标签数据合并;
            };
          } else { // 新增一条联系人数据
            this.Save();
          }
        })
        .catch((error) => {
        });
    },
    FindFatherTag(data, rawData) { // 寻找父亲标签
      let idStr = []; // 保存ID
      let xlist = []; //父亲元素的集合。
      let qList = []; // 结果！
      if (!data.length > 0) return;
      data.forEach(item => {
        rawData.forEach(item1 => {
          if (item1.tags && item1.tags.length > 0) {
            item1.tags.forEach(item2 => {
              let q = JSON.parse(JSON.stringify(item1))
              let b = JSON.parse(JSON.stringify(item2))
              if (item2.id == item.id) {
                q.tags.length = 0;
                if (!idStr.includes(q.id)) {
                  idStr.push(q.id)
                  qList.push(q)
                }
                if (b.parentId == q.id) {
                  xlist.push(b);
                  item2.checked = true; // 选中状态为true,数据回显用;
                }
              }
            })
          }
        })
      })
      qList.forEach(item => {
        xlist.forEach(item1 => {
          if (item1.parentId === item.id) {
            item.tags.push(item1)
          }
        })
      })
      // 通过查找
      this.TagList2 = qList;
    },
    allocation() { }, //转接客户
    Save() { // 表单保存
      let crm = {};
      crm.id = 0;
      crm.itrId = this.userInfos().id;
      crm.compId = this.userInfos().bind_comp_id1;
      crm.phone = this.oneselfWxId();
      crm.wxCrmId = this.wxcrmId;
      crm.wxUserId = this.oneselfWxId();
      crm.nickname = this.userInfos().nickname; // + '【' + '企业微信' + '】' 
      crm.crmCompId = 0;
      let signature = generateSignature3(0, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then((res) => {
          if (res.error === 'success') {

          } else {
            this.$toast.fail(res.errMsg);
          };
          this.$toast.clear();
        })
        .catch((error) => {
          console.log(error);
          this.$toast.clear();
        });
    },
    getName() { // 获取当前客户的企业微信名字
      // return new Promise((resolve, reject) => {
      this.$get("/wx-crm-server/wx/get/customer/info", {
        params: {
          external_userid: this.wxcrmId,
          itrId: this.userInfos()?.id,
        },
      }).then((res) => {
        if (res.data && res.data.follow_user && res.data.follow_user[0]) {
          this.name = res.data.follow_user[0].remark;
          this.createtime = timestampToTime(res.data.follow_user[0].createtime) || '暂无';
        } else {
          // this.name = '企业微信用户';
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    userInfos() { // 获取当前联系人信息
      return JSON.parse(sessionStorage.getItem('userinfo'));
    },
    oneselfWxId() { // 获取当前wxID
      return sessionStorage.getItem('openId');
    },
    colseSheet() { // 添加跟进记录
      this.sheetPop = false;
      this.$nextTick(() => {
        this.$refs.customerFollow.current = 1;
        this.$refs.customerFollow.getAgendaList() // 刷新列表
      });
    },
    getStaffList(fuzzy) { // 拉取企业微信员工列表
      let params = {
        bindWxCompId: sessionStorage.getItem("CorpId"),
        size: 20,
        current: this.StaffCur,
      }
      fuzzy ? params.fuzzy = fuzzy : '';
      this.$get('/wx-crm-server/wx/staff/list', {
        params,
      })
        .then((res) => {
          if (res.msg === 'success') {
            let result = res.data.data.length > 0 && res.data.data.filter(item => {
              if (item.openId != sessionStorage.getItem("openId")) { // 把自己过滤出去，不能将客服给自己分配
                return item;
              }
            })
            this.StaffList = this.StaffCur == 1 ? result : this.StaffList.concat(result);
            this.StaffTotal = res.data.totalPageCount;
          }
        })
        .catch((error) => {
        });
    },
    StaffSearch() { // 搜索
      this.getStaffList(this.changeValue)
    },
    scrollClient() { // 员工列表触底事件
      let read = document.querySelector('.clientList')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (Math.round(scrollTop) + windowHeight == scrollHeight && scrollTop > 15) {
        if (this.StaffTotal <= this.StaffCur) return;
        this.StaffCur = ++this.StaffCur;
        this.getStaffList();
      }
    },
    OpenDataClick(event, data, index) {
      this.pitchIndex = index;
      this.takeover_userid = data.wxUserId;
      // this.changeOverEnter = true;
    },
    getTagList(type) { // 标签列表
      let param = new URLSearchParams();
      let signature = generateSignature3(40000013, 13394171296, timeout, nonce);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("userId", 13394171296);
      param.append("signature", signature);
      param.append("compId", 40000013);
      this.$post1("/api/request/crm/tag/list", param)
        .then((res) => {
          this.TagList = res;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    syncTag() { // 同步标签
      let signature = generateSignature3(40000013, 13394171296, timeout, nonce);
      this.$get("/api/request/crm/tag/sync", {
        params: {
          userId: 13394171296,
          compId: 40000013,
          timeout,
          nonce,
          signature
        },
      })
        .then(function (res) {
          if (res.error === "success") {

          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getDetail() { // 获取一条企业标签详情
      let signature = generateSignature3('3457769eac79471ea15229a5b7c9f6b9', 40000013, 13394171296, timeout, nonce);
      this.$get("/api/request/crm/tag/detail", {
        params: {
          id: '3457769eac79471ea15229a5b7c9f6b9',
          compId: 40000013,
          userId: 13394171296,
          timeout,
          nonce,
          signature
        },
      })
        .then(function (res) {
          if (res.error === "success") {
            that.popShow[ourName] = false; // 关闭弹框
            // that.$emit("getCrm"); // 更新数据
            that.getCrm()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    hitTagBtn(item, index, item1, index1) {  // 打标签确认按钮
      this.TagList[index].tags[index1].checked = !this.TagList[index].tags[index1].checked; // 选中状态
      this.$forceUpdate(); // 刷新视图
    },
    saveTagLoyoo(data) { // 保存乐语数据保存标签数据
      let { tagIds } = this.GeneralFilter();
      let crm = {};
      crm.id = this.linkmanId; // 拉取要修改的联系人ID
      crm.itrId = this.userInfos().id;
      crm.compId = this.userInfos().bind_comp_id1;
      crm.tagIds = tagIds.join(',') || '';
      crm.wxCrmId = this.wxcrmId;
      crm.crmCompId = 0;
      let signature = generateSignature3(crm.id, crm.itrId, crm.compId, timeout, nonce);
      crm.timeout = timeout;
      crm.nonce = nonce;
      crm.signature = signature;
      this.$get("/api/request/itr/comp/customer/save", {
        params: crm,
      })
        .then((res) => {
          if (res.error === 'success') {
            this.$toast('保存成功!');
          } else {
            this.$toast.fail(res.errMsg);
          };
        })
        .catch((error) => {
          console.log(error);
          this.$toast.clear();
        });

    },
    saveTagWx() { // 保存企业微信打标签数据
      let signature = generateSignature4(40000013, timeout, nonce);
      let { unwxtagIds, wxtagIds } = this.GeneralFilter();
      let params = {
        timeout,
        nonce,
        userid: sessionStorage.getItem('bind_UserID'),
        external_userid: sessionStorage.getItem('wxcrmId'),
        add_tag: wxtagIds,
        remove_tag: unwxtagIds,
        signature,
        compId: 40000013,
      }
      this.$post1("/wx-crm-server/tag/mark/tag" + '?compId=' + 40000013 + '&timeout=' + timeout + '&nonce=' + nonce + '&signature=' + signature, params)
        .then((res) => {
          this.$toast('标签保存成功')
        })
        .catch((error) => {
          this.$toast('标签保存失败', error)
        });
    },
    GeneralFilter() { // 通用：过滤选中未选中状态
      let tagIds = new Array(), unwxtagIds = new Array(), wxtagIds = new Array();
      this.TagList.forEach(item => { // 过滤选中的标签ID
        if (item.tags && item.tags.length > 0) {
          item.tags.forEach(item1 => {
            if (item1.checked) { // true 证明选中了拼接ID
              tagIds.push(item1.id)
              wxtagIds.push(item1.workTagId) // 获取企业标签选中ID
            } else {
              unwxtagIds.push(item1.workTagId) // 获取企业标签未选中ID
            }
          })
        }
      });
      return {
        tagIds,
        unwxtagIds,
        wxtagIds
      }
    },
    enterPriseSave() { // 企业标签保存按钮
      this.enterpriseTab = false;
      this.saveTagLoyoo()  // 保存乐语标签数据
      // this.saveTagWx();
    },
    async BindCompletes() { // 关闭弹框
      this.show = false;
      await this.getUserinfo();  // 重新拉去信息接口。
    }
  },
  async created() {
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      overlay: true,
      duration: 0,
    });
    // this.init();
    // console.log(this.getDetail())
    // console.log(this.userInfos())
    // this.getTagList()
    // await this.getCrm()
    // this.getCid()
    // this.getColumn();  // 拉去表单页面
  },
  computed: {},
  mounted() {
    // console.log(WWOpenData, 'WWOpenData')
  },
  watch: {
    show(val, oldVal) {//普通的watch监听
      if (val) {
        this.$toast.clear();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@fontcolor: #7a7878;
.ChatCustomer {
  padding: 0.4rem 0.2rem;
  font-size: 0.29rem;
  padding-bottom: 1.3rem;
  // background: #eee;
  header {
    display: flex;
    margin-bottom: 0.2rem;
    img {
      width: 1rem;
      height: 1rem;
    }
    .infoBox {
      flex: 1;
      align-self: center;
      margin-left: 0.3rem;
      p {
        padding-bottom: 0.25rem;
        font-weight: 600;
        font-size: 0.3rem;
      }
      .details {
        justify-content: space-between;
        display: flex;
        padding-right: 10px;
        span:last-child {
          color: #5f97ae;
        }
      }
    }
  }
  .info {
    border-bottom: 1px dashed #aaaaaa;
    .origin {
      line-height: 0.6rem;
      font-size: 15px;
      color: @fontcolor;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        color: #7a7878;
        line-height: 0.6rem;
        width: 50%;
      }
    }
    .star {
      background: #ebe9e9;
      height: 50px;
      display: flex;
      align-items: center;
      font-size: 15px;
      justify-content: center;
      color: #717475;
      margin-top: 10px;
    }
  }
  .add {
    line-height: 0.7rem;
    color: @fontcolor;
    display: flex;
    & > * {
      flex: 1;
    }
  }
  .tab {
    border-bottom: 1px dashed #aaaaaa;
    .company {
      margin-bottom: 15px;
      border-top: 1px solid #aaaaaa;
      padding-top: 10px;
      border-style: dashed;
      div:first-child {
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 0.3rem;
          font-weight: 600;
        }
      }
      p {
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 0.3rem;
          font-weight: 600;
        }
      }
      .grade {
        margin-bottom: 10px;
        color: #000;
        font-weight: 600;
      }
    }
    .personage {
      .company;
    }
  }
  .dynamic {
    .title {
      font-size: 0.3rem;
      font-weight: 600;
    }
    .list {
      max-height: 300px;
      overflow-y: scroll;
      background: #eee;
      border-radius: 20px;
      margin-top: 10px;
    }
  }
  /deep/ .van-tabbar--fixed {
    z-index: 999;
  }
  .title {
    margin-left: 3px;
  }
  .title::before {
    content: "";
    width: 4px;
    height: 13px;
    background: #1989fa;
    position: absolute;
    left: 5px;
    border-radius: 20px;
    margin-right: 38px;
    margin-top: 1px;
  }
  .hView {
    padding: 0 16px;
  }
  .module {
    width: 33%;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    span:first-child {
      margin-bottom: 10px;
      font-size: 0.28rem;
      color: #767676;
    }
    span:last-child {
      margin-bottom: 10px;
      font-size: 0.32rem;
      font-weight: 550;
    }
  }
  .grade {
    margin-bottom: 10px;
    color: #000;
    font-weight: 600;
  }
  .circle {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    background: #868686;
    vertical-align: middle;
    display: inline-block;
    margin-right: 0.1rem;
  }
  .notice {
    list-style-type: initial;
    width: 100%;
    color: #868686;
    height: 35px;
    line-height: 25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bulletin {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 25px;
    background: #fff;
    margin-bottom: 1.5px;
    span {
      color: #7f7f7f;
      font-weight: 500;
    }
  }
  .btn {
    button {
      background: #fff;
      border: none;
      height: 0.5rem;
      padding: 0 10px;
      font-size: 0.24rem;
      border: 1px solid #eee;
      line-height: 0.55rem;
    }
    button:first-child {
      color: #fff;
      background: #ff5756;
      border-radius: 5px 0 0 5px;
    }
    button:last-child {
      background: #fff;
      color: #000;
      border-radius: 0 5px 5px 0;
      border-left: none;
    }
  }
  .redot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: red;
    margin: 12px 5px 1.5px 3px;
    float: right;
    display: inline-block;
  }
  .compTit {
    text-align: center;
    font-size: 16px;
    color: #000;
    border-bottom: 1px solid #eee;
  }
  .hint {
    display: flex;
    margin-top: 0.3rem;
  }
  .hint i {
    margin-top: 8px;
  }
  .qy-hint {
    font-size: 0.4rem;
    margin: 8px 8px;
    font-weight: 900;
    margin-top: 8px;
    color: #000;
  }
  .qy-hint1 {
    font-size: 0.28rem;
    font-weight: 500;
    color: #000;
    margin-bottom: 11px;
    line-height: 30px;
  }
  /deep/ .van-tabs--line .van-tabs__wrap {
    height: 35px;
    margin-bottom: 10px;
  }
  .enterPrisePop {
    padding: 0 0.2rem;
    & > p {
      text-align: center;
      line-height: 0.7rem;
      font-size: 0.32rem;
      border-bottom: 1px solid rgb(221, 219, 219);
    }
    section {
      & > p {
        font-size: 0.28rem;
        line-height: 0.7rem;
      }
    }
    .btn {
      position: absolute;
      bottom: 10px;
      width: 92%;
    }
  }
  .detailPop {
    .titles {
      text-align: center;
      line-height: 1rem;
      font-size: 0.32rem;
      border-bottom: 1px solid #eee;
    }
    .detailBox {
      height: calc(100% - 123px);
      overflow-y: scroll;
    }
    // & > div:first-of-type {
    //   margin-top: 123px;
    // }
    // & > p {
    //   text-align: center;
    //   line-height: 1rem;
    //   font-size: 0.32rem;
    //   border-bottom: 1px solid #eee;
    //   .titles;
    //   top: 0;
    //   .icon {
    //     font-size: 18px;
    //     position: absolute;
    //     right: 10px;
    //     top: 33%;
    //   }
    // }
    // & > .titles {
    //   position: fixed;
    //   left: 0;
    //   top: 51px;
    //   width: 100%;
    //   z-index: 9;
    //   background: #fff;
    // }
    header {
      padding: 10px 16px;
      border: 1px dashed #eee;
      margin-bottom: 0;
    }
  }
  .pop-tit {
    text-align: center;
    margin-top: 20px;
  }
  .btnTb {
    position: fixed;
    right: 0;
    width: 100%;
    bottom: 0;
    height: 40px;
    font-size: 0.3rem;
  }
  .operaTion {
    position: fixed;
    bottom: 300px;
    left: 0;
    background: #eee;
    font-size: 16px;
    padding: 8px;
    right: 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #c5c4c4;
  }
  .distpicker-address-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 300px;
    /deep/ .address-container {
      height: calc(100% - 34px);
    }
  }
  .changeOverPop {
    padding: 0 0.2rem;
    box-sizing: border-box;
    & > p {
      text-align: center;
      line-height: 1rem;
      font-size: 0.32rem;
      border-bottom: 1px solid rgb(221, 219, 219);
    }
    .title {
      margin-left: 10px;
      margin-top: 10px;
      &::before {
        left: 10px;
      }
    }
    .clientList {
      width: 100%;
      // background: red;
      height: 50%;
      overflow-y: scroll;
    }
    button {
      margin-top: 10%;
    }
  }
  .changeOverEnter {
    .changeOverPop;
    .infos {
      width: 100%;
      height: 50%;
      background: #eee;
      border-radius: 10px;
      margin-top: 10px;
      & > div {
        display: flex;
        padding: 20px;
        img {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    .messages {
      margin-left: 0.2rem;
      background: #fff;
      height: 80px;
      padding: 10px;
      letter-spacing: 2px;
      line-height: 20px;
    }
    .btns {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%);
      width: 85%;
      button {
        width: 50%;
        // margin-left: 10px;
      }
    }
  }
  .openData {
    height: 40px;
    border-bottom: 1px solid #eee;
    margin-bottom: 3px;
    line-height: 40px;
    padding: 0 20px;
    display: block;
    font-size: 0.32rem;
    display: flex;
    justify-content: space-between;
  }
  .TagSelect {
    width: 100%;
    border: none;
    background: #eee;
    border-radius: 12px;
    height: 25px;
    border-style: none;
    padding: 0 10px;
    outline: none;
  }
}
</style>