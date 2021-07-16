/*
 * @Author: YUN_KONG 
 * @Date: 2021-04-27 11:48:39 
 * @Last Modified by: Tian
 * @Last Modified time: 2021-07-16 19:02:54
   聊天工具栏客户管理工具栏,和我的客户对话时候快捷打开
   1.先获取当前企业微信联系人ID，并通过code 授权获取this.U and this.C()。
   2.拉取联系人列表通过（wx。wxcrmID）判断在联系人列表里有是否有当前联系人。
   3.如果有直接拉取信息并回显。
   4.没有的话新增一条联系人信息。
 */
<template>
  <div class="ChatCustomer">
    <div :style="maskings">
      <van-loading
        size="36"
        color="rgb(25, 137, 250)"
        v-if="maskings"
        type="spinner"
      />
    </div>
    <header>
      <img :src="userInfo.avatar || imgSrc" alt="" style="border-radius: 5px" />
      <div class="infoBox">
        <p style="display: flex; align-items: center">
          <strong class="namebold"
            >名字：{{ userInfo.remark || userInfo.name }}</strong
          >
          <template v-if="userInfo.gender == 1 || userInfo.gender == 2">
            <img
              :src="require(`../../assets/img/sex${userInfo.gender}.png`)"
              alt=""
              style="width: 20px; height: 20px; vertical-align: text-bottom"
            />
          </template>
          <van-icon name="question-o" v-else />
        </p>
        <div class="details">
          <span style="color: #6b6a6a">添加时间：{{ userInfo.createtime }}</span
          ><span @click="details">详情 ></span>
        </div>
      </div>
    </header>
    <!--   个人信息暂时隐藏
    <article class="info">
      <p class="origin">
        <span @click="applyComp">手机：{{ crmInfos.phone }}</span>
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
      </ul>
    </article> -->
    <!-- <article class="add">
      <p class="origin"><span>Ta添加的：</span><span>-</span></p>
      <span>共{{}}个群聊 ></span>
    </article> -->
    <article class="dynamic">
      <van-tabs v-model="active" color="#53b1d8" swipe-threshold="3">
        <van-tab title="企业标签">
          <article class="tab">
            <div class="company">
              <template v-if="TagList2.length > 0">
                <div
                  v-for="(item, index) in TagList2"
                  :key="index"
                  style="margin-top: 5px"
                >
                  <p class="grade" v-show="item.checked">
                    {{ item.group_name }}
                  </p>
                  <div v-if="item.tag && item.tag.length > 0">
                    <template v-for="(item1, index1) in item.tag">
                      <van-button
                        v-show="item1.checked"
                        plain
                        type="default"
                        style="
                          margin: 0 10px 5px 0;
                          color: #767676;
                          background-color: #f5f5f5;
                        "
                        size="mini"
                        :key="index1"
                        >{{ item1.name }}</van-button
                      >
                    </template>
                  </div>
                </div>
              </template>
              <van-empty
                v-else
                image-size="40px"
                @click="Tabclick(4)"
                image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
                description="暂未添加标签，点击添加标签"
              >
                <span @click="Tabclick(4)"></span
              ></van-empty>
            </div>
          </article>
        </van-tab>
        <van-tab title="跟进记录">
          <CustomerFollow
            :height="height"
            :userInfo="userInfo"
            ref="customerFollow"
            @onTavclick="Tabclick"
          ></CustomerFollow>
        </van-tab>
        <!-- <van-tab title="访问轨迹">
          <CustomerTrack></CustomerTrack>
        </van-tab> -->
        <!-- <van-tab title="企微记录">
          <CustomerChaing
            :height="height"
            :userInfo="userInfo"
          ></CustomerChaing>
        </van-tab> -->
        <van-tab title="操作记录">
          <CustomerOpera :height="height" :userInfo="userInfo"></CustomerOpera>
        </van-tab>
      </van-tabs>
    </article>
    <van-tabbar v-model="TabActive" active-color="#646566" z-index="99">
      <van-tabbar-item @click="Tabclick(4)">
        <span>添加标签</span>
        <template #icon="props">
          <img src="../../assets/img/chatTag.png" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="plus" @click="Tabclick(1)">
        <span>添加跟进</span>
        <template #icon="props">
          <img src="../../assets/img/跟进记录.png" /> </template
      ></van-tabbar-item>
      <!-- <van-tabbar-item icon="friends-o" @click="Tabclick(2)"
        >转接客户</van-tabbar-item
      >  -->
      <van-tabbar-item @click="Tabclick(3)">
        <span>拨打电话</span>
        <template #icon="props">
          <img src="../../assets/img/电话.png" />
        </template>
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
          <img :src="imgSrc" alt="" style="border-radius: 5px" />
          <div class="infoBox">
            <p>名字：{{ userInfo.name }}</p>
            <div class="details">
              <span>添加时间：{{ userInfo.createtime }}</span>
            </div>
          </div>
        </header>
      </div>
      <div class="detailBox">
        <template v-for="(item, index) in form">
          <van-cell
            style="max-height: 44px"
            v-if="item._checked && item.key !== 'tagIds'"
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
      position="bottom"
      class="enterPrisePop"
      :style="{ height: '80%', width: '100%' }"
    >
      <p>添加企业标签</p>
      <article style="height: 63vh; overflow-y: scroll; margin-top: 8px">
        <div
          v-for="(item, index) in TagList"
          :key="index"
          style="margin-top: 5px"
        >
          <p class="grade">{{ item.group_name }}</p>
          <div v-if="item.tag && item.tag.length > 0">
            <template v-for="(item1, index1) in item.tag">
              <van-button
                style="margin-right: 5px; margin-bottom: 6px"
                :type="item1.checked ? 'info' : 'default'"
                size="mini"
                @click="hitTagBtn(item, index, item1, index1)"
                :key="index1"
                >{{ item1.name }}</van-button
              >
            </template>
          </div>
        </div>
        <van-empty
          v-if="emptyTag"
          image-size="40px"
          class="custom-image"
          image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
          description="没有标签，请到企业微信后台配置"
        />
      </article>
      <!-- <van-tabs v-model="tagAction" color="#53b1d8">
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
        color="#53b1d8"
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
          clearable
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
        :userInfo="userInfo"
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
        clearable
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
        clearable
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
        clearable
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
        clearable
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
        clearable
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
      <van-field
        label=""
        v-model="formData.wx"
        clearable
        placeholder="请输入微信号"
      />
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
      <van-field
        label=""
        v-model="formData.qq"
        clearable
        placeholder="请输入QQ号"
      />
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
      <van-field
        label=""
        v-model="formData.email"
        clearable
        placeholder="请输入邮箱号"
      />
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
import BindPop from '../../components/ChatCustomer/BindPop'
import wxxxChat from '../../uilts/wxconfigChat.js';
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
import CustomerTrack from '../../components/CustomerModule/CustomerTrack.vue'
import Utils from '../../uilts/utils';
import Sheetimg from '../../components/Sheetimg.vue';
export default {
  name: "ChatCustomer",
  components: { VDistpicker, compInfo, shareUser, CustomerFollow, CustomerOpera, CustomerChaing, CustomerTrack, Sheetimg, BindPop },
  mixins: [Toolbar],
  inject: ['reload'],
  data() {
    return {
      height: '68vh',
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
      emptyTag: false,
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
      imgSrc: 'http://ego-file.soperson.com/itver/15/2016/icon_tel_user.png?x-oss-process=image/resize,m_fill,h_200,w_200,quality,q_1',
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
      maskings: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
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
        let result = this.check_mobil(this.crmInfos.phone_back)
        if (result) {
          window.location.href = `tel:${this.crmInfos.phone_back}`; // type== 0 关闭弹框
          this.telClick()
        } else {
          if (result == null) {
            this.$toast('初始化,请稍后...')
          } else {
            this.$dialog.confirm({
              title: '温馨提示',
              message: '手机号未设置，是否设置手机号？',
            })
              .then(() => {
                this.popShow.phone = true; // 打开弹框
                this.formData.phone = this.crmInfos.phone; // 回显数据
                // on confirm
              })
              .catch(() => {
                // on cancel
              });
          }
        }
      } else if (data == 4) {
        this.AddTab();
      }
    },
    check_mobil(phone) { // 校验手机号
      if (!(/^1[3456789]\d{9}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    },
    telClick() {  // 点击拨打电话
      let crmInfo = sessionStorage.getItem('linkmanId');
      let U = JSON.parse(sessionStorage.getItem('userinfo')).id;
      let C = sessionStorage.getItem('bind_compId');
      let signature = generateSignature3(0, C, U, crmInfo, timeout, nonce);
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("signature", signature);
      param.append("id", 0);
      param.append("title", "拨打了电话");
      param.append("content", "");
      param.append("itrId", U);
      param.append("pid", crmInfo);
      param.append("type", 2);
      param.append("compId", C);
      this.$post1('/api/request/itr/comp/customer/record/save', param
      ).then((res) => {
        if (res.error === 'success') {
          this.$nextTick(() => {
            this.$refs.customerFollow.getAgendaList()
          })
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    showPopup(e, d, items) {
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
          }).join(',');
          this.$refs.shareUser.clickshare(this.share.ids, {
            id: this.userInfo.itr_external_userid,
            itr_userid: this.userInfo.itr_userid,
            itr_compid: this.userInfo.itr_compid
          }) // 触发子元素方法目的请求已经共享的数据
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
    details() {
      setTimeout(() => {
        this.detailsPop = true;
      }, 200)
      this.getCrm();
      this.getCid();
      this.getColumn();  // 拉去表单页面
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
      crm.id = this.userInfo.itr_external_userid;
      crm.itrId = this.userInfo.itr_userid;
      crm.compId = this.userInfo.itr_compid;
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
      crm.id = this.userInfo.itr_external_userid;
      crm.itrId = this.userInfo.itr_userid;
      crm.compId = this.userInfo.itr_compid;
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
      let compID = this.userInfo.itr_compid;
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
      let compID = this.userInfo.itr_compid;
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
        this.userInfo.itr_userid,
        this.userInfo.itr_compid,
        timeout,
        nonce
      );
      let param = new URLSearchParams();
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("userId", this.userInfo.itr_userid);
      param.append("signature", signature);
      param.append("compId", this.userInfo.itr_compid);
      this.$post1("/api/request/itr/comp/column/config/detail", param)
        .then((res) => {
          let form = JSON.parse(res.data);
          console.log(form)
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
      console.log(this.userInfo)
      let { itr_external_userid, itr_compid, itr_userid } = this.userInfo;
      let signature = generateSignature3(itr_external_userid, itr_compid, itr_userid, timeout, nonce);
      await this.$get('/api/request/itr/comp/customer/detail', {
        params: {
          id: itr_external_userid,
          compId: itr_compid,
          userId: itr_userid,
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
            this.imgSrc = res.portrait;
            this.crmInfos = a;
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
      this.wxxxx().then(res => { // 企业微信授权
        this.getlinkmanDetail() // 拉取联系人详情。
      })
    },
    wxxxx() { // 企业微信授权 获取当前客户的wxID
      return new Promise((resolve, reject) => {
        wxxxChat().then(res => {
          this.wxcrmId = res;
          sessionStorage.setItem('wxcrmId', res)
          resolve(res);
        }).catch(error => {
          reject(error)
        })
      })
    },
    async getlinkmanDetail() { // 获取联系人详情
      await this.$get("/work/contact/detail", {
        params: {
          external_userid: sessionStorage.getItem('wxcrmId') || 'wmoqMGCgAA5ozhmAajLTV-IZ2tjbxtnA',
          itrId: JSON.parse(sessionStorage.getItem('userinfo'))?.id || 13394171296,
          compId: JSON.parse(sessionStorage.getItem('userinfo'))?.bind_comp_id || 40007760,
          suiteId: JSON.parse(sessionStorage.getItem('codeBasice'))?.suiteId || 'wx067ebd9128dbc908',
        },
      })
        .then((res) => {
          if (res.code == 200 && res.msg === 'success') {
            this.userInfo = res.data;
            sessionStorage.setItem('linkmanId', res.data.itr_external_userid)
            res.data.createtime ? this.userInfo.createtime = timestampToTime(res.data.createtime) : this.userInfo.createtime = '-';
            if (res.data.tags) {
              this.getdispost(res.data.tags) // 赋值标签
            }
            this.maskings = '';  // 清空蒙版
            this.$toast.clear();
            setTimeout(() => {
              // this.getTagList();
              this.getCrm()
            }, 500)
          } else {
            this.$toast.fail(res.msg);
          };
        })
        .catch((error) => {
          console.log(error);
          this.$toast.clear();
        });
    },
    getdispost(data) { // 处理detail 数据
      let arr = [];
      let arr1 = [];
      let obj = {};
      if (!data) return;
      data.forEach(item => {
        arr.push(item.group_name)
      });
      Array.from(new Set(arr)).forEach(item => {
        let tag = [];
        data.forEach(item1 => {
          if (item == item1.group_name) {
            obj = {
              checked: true,
              group_name: item1.group_name,
              tag: tag,
            };
            obj.tag.push({
              ...item1,
              checked: true,
              name: item1.tag_name
            })
          }
        })
        arr1.push(obj);
      })
      this.TagList2 = arr1;
    },
    AddTab() {
      this.enterpriseTab = true;
      if (!this.TagList.length) { // 没有的时候证明没请求
        this.getTagList();
      }
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
      param.append("wxCrmId", this.wxcrmId); //  联系人的微信ID 'wmmmFVEAAAQbwte-CPVAc-zHKbGgErzA'
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
      this.TagList = qList;
    },
    allocation() { }, //转接客户
    userInfos() { // 获取当前联系人信息
      return JSON.parse(sessionStorage.getItem('userinfo'));
    },
    oneselfWxId() { // 获取当前wxID
      return sessionStorage.getItem('openId');
    },
    colseSheet() { // 添加跟进记录
      this.sheetPop = false;
      this.active = 1;  //tab切换到跟进记录
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
    OpenDataClick(event, data, index) { // 转接客户
      this.pitchIndex = index;
      this.takeover_userid = data.wxUserId;
      // this.changeOverEnter = true;
    },
    findPitchTag(unlist) { // 处理选中元素,未选中元素包含checked：false 字段， 选中元素包含 checked：true 字段。
      let pitchTags = this.userInfo.tags;
      let pithchId = new Array();
      pitchTags && pitchTags.length > 0 && pitchTags.forEach(item3 => {
        pithchId.push(item3.tag_id)
      })
      unlist && unlist.length > 0 && unlist.forEach(item => {
        if (item.tag && item.tag.length > 0) {
          item.tag.forEach(item2 => {
            if (pithchId.includes(item2.id)) {
              item2.checked = true; // 给当前层级添加checked。
              item.checked = true; // 给父层级添加checked。
            } else {
              item2.checked = false; // 给子层级添加false，证明该元素没有选中。
            }
          })
        }
      })
      this.TagList2 = JSON.parse(JSON.stringify(unlist)); // 展示数组
      this.TagList = JSON.parse(JSON.stringify(unlist)); // 操作数组
      this.emptyTag = unlist.length > 0 ? false : true; // 标签空状态。
      this.$forceUpdate()
    },
    getTagList(type) { // 标签列表
      let param = new URLSearchParams();
      let signature = generateSignature4(this.userInfo.itr_compid, this.userInfo.itr_userid, timeout, nonce);
      param.append("timeout", timeout);
      param.append("nonce", nonce);
      param.append("itrId", this.userInfo.itr_userid);
      param.append("signature", signature);
      param.append("compId", this.userInfo.itr_compid);
      param.append("suiteId", JSON.parse(sessionStorage.getItem('codeBasice'))?.suiteId || 'wx067ebd9128dbc908');
      this.$post1("/work/tag/result", param)
        .then((res) => {
          this.findPitchTag(res.data) // 处理数据结构，选中添加checked
          console.log(this.TagList)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    syncTag() { // 同步标签
      let signature = generateSignature3(this.userInfos().bind_comp_id1, this.userInfos().id, timeout, nonce);
      this.$get("/api/request/crm/tag/sync", {
        params: {
          userId: this.userInfos().id,
          compId: this.userInfos().bind_comp_id1,
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
      let signature = generateSignature3('3457769eac79471ea15229a5b7c9f6b9', this.userInfos().bind_comp_id1, this.userInfos().id, timeout, nonce);
      this.$get("/api/request/crm/tag/detail", {
        params: {
          id: '3457769eac79471ea15229a5b7c9f6b9',
          compId: this.userInfos().bind_comp_id1,
          userId: this.userInfos().id,
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
      console.log(item, index, item1, index1)
      this.TagList[index].tag[index1].checked = !this.TagList[index].tag[index1].checked; // 选中状态
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
        });

    },
    saveTagWx() { // 保存企业微信打标签数据
      let signature = generateSignature4(this.userInfo.itr_compid, timeout, nonce);
      let { unwxtagIds, wxtagIds } = this.GeneralFilter();
      let params = {
        timeout,
        nonce,
        userid: sessionStorage.getItem("bind_UserID"),
        external_userid: sessionStorage.getItem("wxcrmId"),
        add_tag: wxtagIds,
        remove_tag: unwxtagIds,
        signature,
        compId: this.userInfo.itr_compid,
      }
      this.$post1("/work/tag/mark_tag" + '?compId=' + this.userInfo.itr_compid + '&timeout=' + timeout + '&nonce=' + nonce + '&signature=' + signature, params)
        .then(async (res) => {
          if (res.code == 200 && res.msg == 'success') {
            let result = JSON.parse(JSON.stringify(this.TagList.map(item => { //更新数组
              if (item.tag && item.tag.length) {
                for (let index = 0; index < item.tag.length; index++) {
                  if (item.tag[index].checked) { // 如果有check字段，那么就给父元素
                    item.checked = true;
                    break;
                  }
                  if (!item.tag[index].checked) {
                    item.checked = false;
                  }
                }
              }
              return item;
            })))
            this.TagList2 = result;
            this.$forceUpdate();
            this.$toast('标签保存成功');
          } else {
            this.$toast(res.msg)
          }
        })
        .catch((error) => {
          this.$toast('标签保存失败', error)
        });
    },
    GeneralFilter() { // 通用：过滤选中未选中状态
      let tagIds = new Array(), unwxtagIds = new Array(), wxtagIds = new Array(), showObj = new Array();
      this.TagList.forEach(item => { // 过滤选中的标签ID
        if (item.tag && item.tag.length > 0) {
          item.tag.forEach(item1 => {
            if (item1.checked) { // true 证明选中了拼接ID
              showObj.push({
                group_name: item.group_name,
                tag_name: item1.name
              });
              tagIds.push(item1.id)
              wxtagIds.push(item1.id) // 获取企业标签选中ID
            } else {
              unwxtagIds.push(item1.id) // 获取企业标签未选中ID
            }
          })
        }
      });
      console.log(showObj)
      return {
        tagIds,
        unwxtagIds,
        wxtagIds,
        showObj
      }
    },
    enterPriseSave() { // 企业标签保存按钮
      this.enterpriseTab = false;
      this.active = 0; // 改变tab指向
      this.saveTagWx();
    },
    async BindCompletes() { // 关闭弹框
      this.show = false;
      await this.getUserinfo();  // 重新拉去信息接口。
    },
    applyComp() { // 企业微信用户自动加入公司 sessionStorage.getItem('bind_compId') ||
      //  let { compId } = this.comp.item;
      // let ids = sessionStorage.getItem('temporaryId')
      let signature = generateSignature3(40021450, timeout, nonce);
      let data = {
        to: 13243259739,
        fromCompId: 40021450,
        nonce: nonce,
        signature: signature,
        timeout: timeout,
        remark: '企业微信用户自动加入',
      }
      this.$get(
        "/api/request/comp/invite/do",
        {
          params: data,
        },
      ).then((res) => {
        if (res.error == 'success') {
          // this.getUserinfo();
          let CorpId = sessionStorage.getItem('CorpId')
          let openId = sessionStorage.getItem('openId')
          this.getopenId(CorpId, openId) // 重新拉取加入公司的信息;
        } else {
          // this.comp.applyShow = false;
          // this.compApply = true;
        }
      })
        .catch((error) => {
          console.log(error);
        });
    },
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true,
        duration: 0,
      });
    }
  },
  async created() {
    // await this.getlinkmanDetail();
    // this.getTagList();
    // this.init();
    //  wxxxChat().then(res => {
    //    console.log(res)
    //     // that.wxcrmId = res;
    //     // sessionStorage.setItem('wxcrmId', res)
    //   //  resolve(res);
    //   }).catch(error => {
    //     console.log(error)
    //  })     
    // this.applyComp()
    // this.init();
    // console.log(this.getDetail())
    // console.log(this.userInfos())
    // this.syncTag()
    // this.getTagList()
    // await this.getCrm()
    // this.getCid()
    // this.getColumn();  // 拉去表单页面
  },
  computed: {},
  mounted() {
    Utils.$on("bindSuccess", (res) => {  // 该函数通过聊天工具栏客户画像列表触发，绑定手机号成功时触发。
      this.maskings = '';
      this.maskings = {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      };
      this.$nextTick(() => {
        console.log('I\'M IRON sss')
        let a = { ...res.data.user, bind_comp_id: this.compId || res.data.compId, bind_comp_id1: res.data.user.bind_comp_id };
        sessionStorage.setItem("userinfo", JSON.stringify(a)); // 公司id 存入本地；
        this.init() // 重新拉取数据
      })
    });
  },
  watch: {
    show(val, oldVal) {//普通的watch监听
      if (val) {
        this.$toast.clear();
        this.maskings = '';
      }
    },
  },
};
</script>

<style lang="less" scoped>
@fontcolor: #7a7878;
.commonPadd {
  margin-bottom: 0.2rem;
  border-bottom: 10px solid rgb(249, 249, 249);
  padding: 0.4rem 0.2rem;
}
.ChatCustomer {
  // padding: 0.4rem 0.2rem;
  font-size: 0.29rem;
  // padding-bottom: 1.3rem;
  // background: #eee;
  header {
    display: flex;
    .commonPadd;
    img {
      width: 1rem;
      height: 1rem;
    }
    .infoBox {
      flex: 1;
      align-self: center;
      margin-left: 0.3rem;
      p {
        padding-bottom: 0.24rem;
        font-weight: 600;
        font-size: 0.3rem;
      }
      .namebold {
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
    border-bottom: 1px solid #aaaaaa;
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
    border-bottom: 1px solid #ebe9e9;
    .commonPadd;
    padding-top: 0;
    padding-bottom: 0;
    border: none;
    max-height: 68vh;
    overflow-y: auto;
    .company {
      margin-bottom: 15px;
      // border-top: 10px solid #aaaaaa;
      padding: 5px;
      border-style: solid;
      // div:first-child {
      //   display: flex;
      //   justify-content: space-between;
      //   align-items: center;
      //   margin-bottom: 0.2rem;
      //   .title {
      //     font-size: 0.3rem;
      //     font-weight: 600;
      //   }
      // }
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
        color: #6b6a6a;
        font-weight: 400;
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
      line-height: 0.9rem;
      font-size: 0.32rem;
      border-bottom: 1px solid #dddbdb;
      font-weight: 600;
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
      left: 48%;
      transform: translate(-50%, 0);
      width: 86%;
    }
  }
  .detailPop {
    overflow: hidden;
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
      // border: 1px dashed #eee;
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

  .addicon {
    width: 0.32rem;
    height: 0.3rem;
    margin-right: 5px;
  }
  /deep/ .van-popup--bottom.van-popup--round {
    border-radius: 0px !important;
  }
  .van-empty {
    padding: 10px 0;
  }
  /deep/ .van-button--mini {
    padding: 0 7px;
  }
  /deep/ .van-button--default {
    background-color: #f1f4f6;
  }
  /deep/ .van-empty__bottom {
    width: 100%;
    height: 200px;
    margin-top: -110px;
    & > span {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .van-cell__title,
  .van-cell__value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>