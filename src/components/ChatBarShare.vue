<!-- @format -->

/* * @Author: YUN_KONG * @Date: 2021-04-25 11:04:56 * @Last Modified by: YUN_KONG * @Last Modified time: 2021-04-25 13:45:29
此模块是用户从企业微信对话聊天工具栏打开跳到此分享页面， */
<template>
  <div class="ChatBarShare">
    <van-search
      v-model="value"
      show-action
      :placeholder="inputPlaceholder"
      @clear="onCancel"
      @input="input"
    >
      <template #action>
        <div @click="search">搜索</div>
      </template>
    </van-search>
    <van-tabs v-model="active" @click="tabClick" color="#51BBBA" >
      <template v-for="(item, index) in tabArray">
        <van-tab :title="item.title" :key="index">
          <!--  宣传彩页 -->
          <main v-if="active === 0">
            <colorPage
              :datas="treeData[active].data"
              :trajectoryCounts="treeData[active].trajectoryCount"
              :userMaps="treeData[active].userMap"
              :formCounts="treeData[active].formCount"
              :configs="treeData[active].config"
              :states="treeData[active].state"
              @mySonChagne="mySonChagneColor"
              @refreshEmpty="refreshEmptys"
            ></colorPage>
          </main>

          <!-- 营销文档 -->
          <main v-if="active === 1">
            <documents
              :datas="treeData[active].data"
              :userMaps="treeData[active].userMap"
              :configs="treeData[active].config"
              :states="treeData[active].state"
              @mySonChagne="mySonChagneDoc"
              @refreshEmpty="refreshEmptys"
            ></documents>
          </main>

          <!-- 软文素材 -->
          <main v-if="active === 2">
            <verbals
              :datas="treeData[active].data"
              :userMaps="treeData[active].userMap"
              :configs="treeData[active].config"
              :states="treeData[active].state"
              @mySonChagne="mySonChagneVer"
              @refreshEmpty="refreshEmptys"
            ></verbals>
          </main>
          <!-- 微站 -->
          <main v-show="active === 3">
            <MicroStationViews
              :datas="treeData[active].data"
              :configs="treeData[active].config"
              :states.sync="treeData[active].state"
              @mySonChagne="mySonChagneMic"
              :soless="treeData[active].soles"
              @classifyList="classifyLists"
              @refreshEmpty="refreshEmptys"
              ref="child"
            ></MicroStationViews>
          </main>
          <!-- 海报素材 -->
          <!-- <main v-if="active === 4">
            <poster
              :userMaps="treeData[active].userMap"
              :datas="treeData[active].data"
              :configs="treeData[active].config"
              :states="treeData[active].state"
              @mySonChagne="mySonChagnePos"
            ></poster>
          </main> -->
          <!-- 视频素材 -->
          <main v-if="active === 4">
            <videos
              :datas="treeData[active].data"
              :userMaps="treeData[active].userMap"
              :configs="treeData[active].config"
              :states="treeData[active].state"
              @refreshEmpty="refreshEmptys"
              @mySonChagne="mySonChagneVid"
            ></videos>
          </main>
          <!-- 软文 -->
          <main v-if="active === 5">
            <advertorial
              :datas="treeData[active].data"
              :trajectoryCounts="treeData[active].trajectoryCount"
              :userMaps="treeData[active].userMap"
              :formCounts="treeData[active].formCount"
              :configs="treeData[active].config"
              :states="treeData[active].state"
              @refreshEmpty="refreshEmptys"
              @mySonChagne="mySonChagneAdv"
            >
            </advertorial>
          </main>
        </van-tab>
      </template>
    </van-tabs>
    <!-- 企业微信验证码 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '300px', zIndex: '999999' }"
      overlay-class="popup"
    >
      <div class="hView">
        <div class="hint">
          <van-icon name="warning" size="25px" />
          <p class="qy-hint">企业微信绑定</p>
        </div>
        <p class="qy-hint1">当前账号没有绑定乐语，请输入手机号进行绑定</p>
      </div>
      <van-field
        v-model="sms"
        type="tel"
        center
        clearable
        label="手机号"
        class="inp"
        placeholder="请输入手机号"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="clicksendCode"
            :disabled="times < 60"
            >{{ sendings }}</van-button
          >
        </template>
      </van-field>
      <van-field
        v-model="codes"
        type="digit"
        center
        clearable
        label="验证码"
        class="inp"
        placeholder="请输入验证码"
      >
        <template #button>
          <van-button
            size="small"
            type="danger"
            @click="bindlooyuCode"
            class="bind"
            >绑定</van-button
          >
        </template>
      </van-field>
    </van-popup>
  </div>
</template>

<script>
import { generateTimeout, generateSignature, generateSignature8, generateNonce, generateSignature3, generateSignature4 } from "../uilts/tools";
let timeout = generateTimeout();
import local from '../uilts/localStorage';
let nonce = generateNonce();
import colorPage from '../components/colorPage/ColorView';
import documents from '../components/poster/documentView';
import advertorial from '../components/Advertorial/AdvertorialView';
import poster from '../components/poster/PosterView';
import videos from '../components/video/VideoPage';
import verbals from '../components/verBal/VerbalView';
import wxxx from '../uilts/wxconfig'
import MicroStationViews from '../components/MicroStationViews'
export default {
  name: "ChatBarShare",
  components: { colorPage, documents, advertorial, poster, videos, verbals, MicroStationViews },
  props: [],
  data() {
    return {
      active: 0,
      value: "",
      tabArray: [
        { title: "彩页", id: 0 },
        { title: "文档", id: 1 },
        { title: "话术", id: 2 },
        { title: "微站", id: 3 },
        // { title: "海报", id: 4 },
        { title: "视频", id: 4 },
        { title: "软文", id: 5 },
      ],
      treeData: {
        0: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          },
          userMap: {},
          trajectoryCount: {},
          formCount: {},
          state: 'list'
        },
        1: {
          data: [],
          userMap: {},
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          },
          state: 'list'
        },
        2: {
          data: [],
          trajectoryCount: {},
          userMap: {},
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          },
          formCount: {},
          state: 'list'
        },
        3: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            currentC: 0,
            total: -1,
          },
          state: 'list',
          soles: ''
        },
        // 4: {
        //   data: [],
        //   config: {
        //     scroll: 0,
        //     current: 1,
        //     total: -1,
        //   },
        //   userMap: {},
        //   state: 'list'
        // },
        4: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          },
          userMap: {},
          state: 'list'
        },
        5: {
          data: [],
          config: {
            scroll: 0,
            current: 1,
            total: -1,
          },
          userMap: {},
          state: 'list',
          formCount: {},
          trajectoryCount: {}
        },
      },
      loading: false,
      finished: false,
      refreshing: false,
      show: false,
      sms: '',
      codes: "",
      times: 60,
      coinNumber: 0,
      sendings: "发送验证码",
      url: '',
      micInfo: {},
      ary: []
    };
  },
  watch: {
    show(val, oldVal) {//普通的watch监听
      if (val) {
        this.$toast.clear()
      }
    },
  },
  computed: {},
  methods: {
    getMicUrl() { // 获取微站url判断该公司是否开通微站
      let signature = generateSignature3(this.$U || local.U(), this.$C || local.C(), nonce, timeout);
      this.$get("/api/request/console/mall", {
        params: {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          timeout,
          nonce,
          signature
        },
      })
        .then((res) => {
          if (res && res.url !== '') {
            this.url = res.url;
            setTimeout(() => {
              this.$toast.clear()
            }, 1500);
          }
        })
        .catch((error) => {
          console.log(error)
          this.$toast.clear()

        });
    },
    async getMicInfo() {  // 微站信息接口 
      let signature = generateSignature3(this.$C || local.C(), nonce, timeout);
      await this.$get("/api/request/mall/shop/result", {
        params: {
          userId: '',
          compId: this.$C || local.C(),
          timeout,
          nonce,
          signature
        },
      })
        .then((res) => {
          if (res && res.data.length > 0) {
            this.micInfo = res.data[0];
          }
        })
        .catch((error) => {
          console.log(error)
        });
    },
    getList(params, url, their) {
      // 获取列表数据
      this.$get(url, {
        params: params,
      })
        .then((res) => {
          let qq = this.treeData[this.active];
          let cur = qq.config.current;
          if (their === 'colorPage') {  // 宣传彩页
            let bb = qq.data.concat(res.data).map(item => {
              return {
                ...item,
                time: item.lastUpdateTime.split(' ')[0],
                shareNumber1: item.shareNumber > 10000 ? Math.round((item.shareNumber / 10000) * 1000) / 1000 + '万' : item.shareNumber,
              }
            });
            let cc = res.data.map(item => {
              return {
                ...item,
                time: item.lastUpdateTime.split(' ')[0],
                shareNumber1: item.shareNumber > 10000 ? Math.round((item.shareNumber / 10000) * 1000) / 1000 + '万' : item.shareNumber,
              }
            });
            qq.data = (cur == 1 || cur == undefined) ? cc : bb;
            qq.userMap = Object.assign(qq.userMap, res.user);
            res.formCount.forEach(item => {
              qq.formCount[item.id] = item.counts;
            })
            res.trajectoryCount.forEach(item => {
              qq.trajectoryCount[item.id] = item.counts;
            })
            qq.config.total = res.totalPageCount;
          } else if (their === 'document') {// 营销文档
            let bb = qq.data.concat(res.data).map(item => {
              return {
                ...item,
                time: item.createTime.split(' ')[0],
                img: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`
              }
            });
            let cc = res.data.map(item => {
              return {
                ...item,
                time: item.createTime.split(' ')[0],
                img: `https://dist.jiain.net/itr/dom/svg_type_${item.fileSuffix}.png`
              }
            });
            qq.data = (cur == 1 || cur == undefined) ? cc : bb;
            qq.userMap = Object.assign(qq.userMap, res.user);
            qq.config.total = res.totalPageCount;
          } else if (their === 'advertorial') { // 软文素材
            let bb = qq.data.concat(res.data).map((item, index) => {
              item.timeTemplate = this.getTimeByStr(item.timeTemplate);
              if ((item.timeTemplate + (60 * 60 * 3 * 1000)) > new Date().getTime()) {
                item.startTime = "刚刚";
              } else {
                let time = item.refreshTime.split(" ");
                item.startTime = time[0].substring(5).replace("-", "月") + "日";
                item.startTime += " " + time[1].substring(0, 5);
              }
              item.readNumber1 = item.readNumber > 10000 ? Math.round((item.readNumber / 10000) * 1000) / 1000 + '万' : item.readNumber
              if (item.viewList.length >= 3) { // 如果图片数量大于三，那么就 截取前三章
                item.viewList1 = item.viewList.splice(0, 3)
              }
              return item;
            });
            let cc = res.data.map(item => {
              item.timeTemplate = this.getTimeByStr(item.timeTemplate);
              if ((item.timeTemplate + (60 * 60 * 3 * 1000)) > new Date().getTime()) {
                item.startTime = "刚刚";
              } else {
                let time = item.refreshTime.split(" ");
                item.startTime = time[0].substring(5).replace("-", "月") + "日";
                item.startTime += " " + time[1].substring(0, 5);
              }
              if (item.viewList.length >= 3) { // 如果图片数量大于三，那么就 截取前三章
                item.viewList1 = item.viewList.splice(0, 3)
              }
              item.readNumber1 = item.readNumber > 10000 ? Math.round((item.readNumber / 10000) * 1000) / 1000 + '万' : item.readNumber
              return item;
            });
            res.formCount.forEach(item => {
              qq.formCount[item.id] = item.counts;
            })
            res.trajectoryCount.forEach(item => {
              qq.trajectoryCount[item.id] = item.counts;
            })
            qq.data = (cur == 1 || cur == undefined) ? cc : bb;
            qq.userMap = Object.assign(qq.userMap, res.user);
            qq.config.total = res.totalPageCount;

          } else if (their === 'poster') { // 海报素材
            let bb = qq.data.concat(res.data).map(item => {
              return {
                ...item,
                time: item.createTime.split(' ')[0].split('-')[1] + '-' + item.createTime.split(' ')[0].split('-')[2]
              }
            });
            let cc = res.data.map(item => {
              return {
                ...item,
                time: item.createTime.split(' ')[0].split('-')[1] + '-' + item.createTime.split(' ')[0].split('-')[2]
              }
            });
            qq.data = (cur == 1 || cur == undefined) ? cc : bb;
            qq.userMap = res.user;
            qq.config.total = res.totalPageCount;
          } else if (their === 'video') { // 视频素材
            let cc = res.data.map(item => {
              return {
                ...item,
                time: item.createTime.split(' ')[0],
                visits1: item.visits > 10000 ? Math.round((item.visits / 10000) * 1000) / 1000 + '万' : item.visits
              }
            })
            qq.data = (cur == 1 || cur == undefined) ? cc : qq.data.concat(cc);
            qq.userMap = Object.assign(qq.userMap, res.user);
            qq.config.total = res.totalPageCount;
          } else if (their === 'verbal') { // 营销话术
            let cc = res.data.map(item => {
              return {
                ...item,
                content: JSON.parse(item.content)[0]
              }
            })
            qq.data = (cur == 1 || cur == undefined) ? cc : qq.data.concat(cc);
            qq.userMap = Object.assign(qq.userMap, res.user);
            qq.config.total = res.totalPageCount;
          } else if (their === 'MicroStation') {  // 微站详情页
            qq.data = (cur == 1 || cur == undefined) ? res.data : qq.data.concat(res.data);
            if (cur == 1) { //只有第一页时候再追加
              qq.data.unshift({
                type: 'micHome',
                title: this.micInfo.title,
                description: this.micInfo.description,
                thumb: this.micInfo.thumb,
                url: this.micInfo.url,
                id: this.micInfo.id,
                userId: this.micInfo.userId,
              })
            }
            qq.config.total = res.totalPageCount;
          } else if (their === 'classify') { // 微站分类页
            console.log(this.treeData[this.active].config.currentC, res.totalPageCount)
            if (this.treeData[this.active].config.currentC == res.totalPageCount) {
              this.treeData[this.active].soles = true; // 让子组件空组件
            }
            qq.config.total = res.totalPageCount;
            if (res.data.legnth <= 0) {
              this.treeData[this.active].soles = true; // 为true 证明没有数据
            } else {
              qq.data = qq.data.concat(res.data);
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    processing(data) { // 参数加工厂
      let params = {};
      if (data.their === 'colorPage') { // 宣传彩页
        let signature = generateSignature3(
          this.$U || local.U(),
          timeout,
          nonce
        );
        params = {
          userId: this.$U || local.U(),
          category: data.category,
          type: data.type,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          current: this.treeData[this.active].config.current || 1,
          size: 20,
          version: data.version,
          categroyId: data.categroyId
        }
      } else if (data.their === 'document') {
        let signature = generateSignature4(
          this.$U || local.U(),
          this.$C || local.C(),
          timeout,
          nonce,
        );
        params = {
          userId: this.$U || local.U(),
          cateId: data.cateId,
          compId: this.$C || local.C(),
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          current: this.treeData[this.active].config.current || 1,
          size: 20,
        }
      } else if (data.their === 'advertorial') { // 软文素材
        let signature = generateSignature3(
          this.$U || local.U(),
          this.$C || local.C(),
          timeout,
          nonce
        );
        params = {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          tag: data.tag,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          current: this.treeData[this.active].config.current || 1,
          sort: data.sort,
          version: data.version
        }
        console.log(1232131)
      } else if (data.their === 'poster') { // 海报素材
        let signature = generateSignature4(
          this.$U || local.U(),
          this.$C || local.C(),
          timeout,
          nonce
        );
        params = {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          current: this.treeData[this.active].config.current || 1,
          size: 20,
          cateId: 0,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
        }
      } else if (data.their === 'video') {
        let signature = generateSignature4(
          this.$U || local.U(),
          this.$C || local.C(),
          timeout,
          nonce
        );
        params = {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          current: this.treeData[this.active].config.current || 1,
          size: 20,
          cateId: data.cateId,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
          sort: data.sort
        }
      } else if (data.their === 'verbal') {
        let signature = generateSignature3(
          this.$U || local.U(),
          this.$C || local.C(),
          timeout,
          nonce
        );
        params = {
          userId: this.$U || local.U(),
          compId: this.$C || local.C(),
          current: this.treeData[this.active].config.current || 1,
          size: 20,
          categoryId: data.categoryId,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
        }
      } else if (data.their === 'MicroStation') { // 微站
        let signature = generateSignature3(
          this.$C || local.C(),
          timeout,
          nonce
        );
        params = {
          compId: this.$C || local.C(),
          current: this.treeData[this.active].config.current || 1,
          size: 20,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
        }
      } else if (data.their === 'classify') { // 分类页
        let signature = generateSignature3(
          this.$C || local.C(),
          timeout,
          nonce
        );
        params = {
          compId: this.$C || local.C(),
          userId: '',
          current: this.treeData[this.active].config.currentC || 1,
          size: 20,
          timeout: timeout,
          nonce: nonce,
          signature: signature,
        }
      }
      data.fuzzy ? params.fuzzy = data.fuzzy : ''; // 统一增加fuzzy字段;
      this.getList(params, data.url, data.their);
    },
    tabClick(name) {  // 点击标签页
      if (this.treeData[this.active].config.total == -1) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 600,
          overlay: true,
        });
        this.searchCom();
      } else {
        this.$nextTick(() => {
          document.documentElement.scrollTop = document.body.scrollTop = this.treeData[this.active].config.scroll; // 设置每个页面的scrollTop
        })
      }
    },
    scrollToTop() { // 监听滚轮滚动
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.treeData[this.active].config.scroll = scrollTop;
    },
    getTimeByStr(str) {
      try {
        str = str.replace(".0", "");
        return new Date(Date.parse(new Date(str)) || Date.parse(new Date(str.replace("-", "\/").replace("-", "\/"))));
      } catch (e) {
        return
      }
    },
    mySonChagneColor(data) { // 宣传彩页触底事件;
      this.treeData[this.active].config.current = ++data;
      let params = {
        category: 0,
        type: 5,
        version: 1,
        categroyId: 1,
        their: "colorPage",
        url: "/api/request/itr/page/recommend/result",
      }
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params);
    },
    mySonChagneDoc(data) { // 营销文档触底事件;
      this.treeData[this.active].config.current = ++data;
      let params = {
        cateId: 0,
        their: "document",
        url: "/aliyun/remote/oss/folder",
      };
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params);
    },
    mySonChagneAdv(data) { // 软文素材触底事件;
      this.treeData[this.active].config.current = ++data;
      let params = {
        cateId: 0,
        their: "advertorial",
        url: "/api/request/itr/page/headlines/result",
        tag: 1,
        sort: "sort",
        version: 1,
      }
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params); // 软文素材
    },
    mySonChagnePos(data) { //海报素材触底事件
      this.treeData[this.active].config.current = ++data;
      let params = {
        cateId: 0,
        their: "poster",
        url: "/aliyun/remote/poster/list",
      };
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params);
    },
    mySonChagneVid(data) { // 视频素材触底事件
      this.treeData[this.active].config.current = ++data;
      let params = {
        sort: 'topState',
        their: "video",
        cateId: 0,
        url: "/aliyun/remote/vod/result",
      };
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params);
    },
    mySonChagneVer(data) { // 营销话术触底事件
      this.treeData[this.active].config.current = ++data;
      let params = {
        categoryId: 0,
        their: "verbal",
        cateId: 0,
        url: "/api/request/itr/comp/words/result",
      };
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params);
    },
    mySonChagneMic(data) { // 企业微站触底事件
      this.treeData[this.active].config.current = ++data;
      let params = {
        their: "MicroStation",
        url: "/api/request/mall/product/result",
      };
      this.tabArray[this.active].state == 'list' ? '' : params.fuzzy = this.value;
      this.processing(params);
    },
    classifyLists() { //拉去分类列表
      this.treeData[this.active].config.currentC = this.treeData[this.active].config.currentC + 1;
      this.processing({
        their: "classify",
        url: "/api/request/mall/shelves/result",
      });
    },
    search() { // 搜索
      this.tabArray[this.active].state = 'search';
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.treeData[this.active].config.current = 1;
      this.searchCom();
    },
    onCancel() { // 取消搜索
      // if (this.value === '')  return;
      console.log('21312')
      this.value = '';
      this.tabArray[this.active].state = 'list';
      this.treeData[this.active].config.current = 1;
      document.documentElement.scrollTop = document.body.scrollTop = 0; // 设置每个页面的scrollTop
      this.searchCom();
    },
    input(value) {
      console.log(value)
    },
    searchCom() { // 通用搜索方法
      if (this.active === 0) {
        this.processing({
          category: 0,
          type: 5,
          version: 1,
          categroyId: 1,
          fuzzy: this.value,
          their: "colorPage",
          url: "/api/request/itr/page/recommend/result",
        }); // 宣传彩页
      } else if (this.active === 1) {
        this.processing({
          cateId: 0,
          their: "document",
          fuzzy: this.value,
          url: "/aliyun/remote/oss/folder",
        });
      } else if (this.active === 2) {
        this.processing({
          categoryId: 0,
          their: "verbal",
          cateId: 0,
          fuzzy: this.value,
          url: "/api/request/itr/comp/words/result",
        });
      } else if (this.active === 3) {
        this.processing({
          their: "MicroStation",
          url: "/api/request/mall/product/result",
          fuzzy: this.value,
        });
      } else if (this.active === 4) {
        this.processing({
          sort: 'topState',
          their: "video",
          cateId: 0,
          url: "/aliyun/remote/vod/result",
          fuzzy: this.value,
        }); // 视频素材
      } else if (this.active === 5) {
        this.processing({
          cateId: 0,
          their: "advertorial",
          url: "/api/request/itr/page/headlines/result",
          tag: 1,
          sort: "sort",
          fuzzy: this.value,
          version: 1,
        });
      }
      //  else if (this.active === 4) {
      //   this.processing({
      //     cateId: 0,
      //     their: "poster",
      //     url: "/aliyun/remote/poster/list",
      //     fuzzy: this.value,
      //   });
      // } 
    },
    clicksendCode() {
      //发送验证码倒计时，和发送验证码
      let that = this;
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(this.sms)) {
        this.$toast.fail("请输入正确的手机号");
        return;
      }
      this.time(); // 倒计时60秒
      this.sendCode(); // 发送验证码·
    },
    time() {
      // 验证码倒计时方法
      var timer = setInterval(() => {
        if (this.times == 0) {
          // 清除定时器和复原按钮
          clearInterval(timer);
          this.sendings = "重新发送";
          this.times = 60; // 重新赋值时间变量
        } else {
          this.sendings = this.times + "秒后可再次发送";
          this.times--;
        }
      }, 1000);
    },
    sendCode() {
      // 发送验证码
      let that = this;
      let signature = generateSignature(this.sms, 2, timeout, nonce);
      this.$get(
        "/api/remote/util/sms",
        {
          params: {
            id: this.sms,
            type: 2,
            timeout: timeout,
            nonce: nonce,
            clientType: 2,
            signature: signature,
          },
        },
        { headers: {} }
      )
        .then((res) => {
          if (res.error == "success") {
          } else {
            this.$toast("获取失败，请稍后再试");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    bindlooyuCode() {
      // 验证码验证是否正确 验证码正确调用确认绑定
      let that = this;
      let signature = generateSignature8(this.sms, 1, 3, timeout, nonce);
      let param = new URLSearchParams();
      param.append("id", this.sms);
      param.append("type", 1);
      param.append("code", this.codes);
      param.append("nonce", nonce);
      param.append("clientType", 3);
      param.append("timeout", timeout);
      param.append("signature", signature);
      this.$post1("/api/remote/itr/user/login", param)
        .then(function (res) {
          if (res.error != "success") {
            that.$toast.fail("验证码错误");
          } else {
            that.bindLooyu();
          }
        })
        .catch(function (error) {
          that.$toast.fail("请求失败，请稍后再试");
        });
    },
    bindLooyu() {
      // 确定绑定
      let that = this;
      let CorpId = sessionStorage.getItem("CorpId"); // 保存openID 解绑用
      let openId = sessionStorage.getItem("openId"); // 保存openID 解绑用
      let bind_UserID = sessionStorage.getItem("bind_UserID"); // 保存openID 解绑用
      let signature = generateSignature4(
        openId,
        this.sms,
        timeout,
        nonce
      );
      console.log(openId, CorpId, bind_UserID)
      this.$get("/wx-crm-server/wx/bind/itr", {
        params: {
          openId: openId,
          itrId: this.sms,
          wxUserId: bind_UserID,
          timeout,
          nonce,
          signature,
          bindWxCompId: CorpId,
        },
      })
        .then(function (res) {
          that.show = false;
          that.getopenId(sessionStorage.getItem('CorpId'), sessionStorage.getItem('openId')); //绑定完成拉去是否绑定公司接口，刷新新赋值的公司信息
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getopenId(wxCompId, openId) { // 检测是否绑定公司了，
      // 拉去是否绑定企业微信
      let that = this;
      this.$get("/wx-crm-server/wx/get/itr", {
        params: {
          wxCompId,
          openId,
        },
      })
        .then(function (res) {
          if (res.code === 500 || !res.data || res.msg == "not_bind") {
            // 没有绑定
            that.show = true;
          } else if (
            res.code === 200 &&
            res.msg === "success" &&
            res.data != "{}"
          ) {
            // 
            if (res.data.bind_comp_id) {
              let a = { ...res.data, bind_comp_id: sessionStorage.getItem('bind_compId'), bind_comp_id1: res.data.bind_comp_id };
              sessionStorage.setItem("userinfo", JSON.stringify(a)); // 公司id 存入本地；
              // wxxx(); // 刷新页面数据
              that.processing({
                category: 0,
                type: 5,
                version: 1,
                categroyId: 1,
                their: "colorPage",
                url: "/api/request/itr/page/recommend/result",
              }); // 宣传彩页
              sessionStorage.setItem('chatBar', true)
              // let a = { ...res.data, bind_comp_id: that.compId, bind_comp_id1: res.data.bind_comp_id } // 会话存储，锁死compID
              // sessionStorage.setItem("userinfo", JSON.stringify(a)); // 公司id 存入本地；
              sessionStorage.removeItem('not_bind');

            } else {
              // 如果不存在那么就弹框提示他没有绑定公司
              that.$toast.fail("当前账号没有绑定公司，请绑定公司。");
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    refreshEmptys() {
      this.treeData[this.active].config.current = 0;
    }
  },
  computed: { // 动态计算占位符
    inputPlaceholder: {
      get: function () {
        let a = '请输入关键词搜索' + this.tabArray.find(item => item.id === this.active).title
        return a;
      },
      set: function (newValue) {
      }
    },
  },
  async created() {
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      overlay: true,
      duration: 0,
      className: 'overFFF'
    });
    if (sessionStorage.getItem('not_bind')) {
      this.show = true;
      return;
    };
    wxxx(); // 拉去企业微信授权
    await this.getMicInfo() // 获取微站信息
    this.processing({
      category: 0,
      type: 5,
      version: 1,
      categroyId: 1,
      their: "colorPage",
      url: "/api/request/itr/page/recommend/result",
    }); // 宣传彩页

    // this.processing({
    //   their: "MicroStation",
    //   url: "/api/request/mall/product/result",
    // }); // 微站详情页
    // this.processing({
    //   their: "classify",
    //   url: "/api/request/mall/shelves/result",
    // }); // 微站分类页
    sessionStorage.setItem('chatBar', true)
    this.getMicUrl() // 执行获取微站url
    // this.processing({
    //   cateId: 0,
    //   their: "document",
    //   url: "/aliyun/remote/oss/folder",
    // }); // 营销文档
    // this.processing({
    //   cateId: 0,
    //   their: "advertorial",
    //   url: "/api/request/itr/page/headlines/result",
    //   tag: 1,
    //   their: "poster",
    //   url: "/aliyun/remote/poster/l
    //   sort: "sort",
    //   version: 1,
    // }); // 软文素材
    // this.processing({
    //   cateId: 0,ist",
    // }); // 海报素材
    // this.processing({
    //   sort: 'topState',
    //   their: "video",
    //   cateId: 0,
    //   url: "/aliyun/remote/vod/result",
    // }); // 视频素材
    // this.processing({
    //   categoryId: 0,
    //   their: "verbal",
    //   cateId: 0,
    //   url: "/api/request/itr/comp/words/result",
    // }); // 营销话术
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
  },
  beforeRouteEnter: (to, from, next) => {
    // console.log(to, from, next, 'to, from, nextChatBarShare')
    next(vm => {
      vm.$store.commit("cache", "ChatBarShare");
    })
  },
  beforeRouteLeave: (to, from, next) => {
    console.log(to, from, 'beforeRouteLeave')
    if (to.name === 'ColorPage') {
      //  如果要返回colorPage return 如果不return 的话数据会出现问题
      console.log('yao clororPage')
      //  window.history.go(-1);
      // window.onbeforeunload = () => {
      //   return "我阻止了页面跳转"
      // }
      next(false);
    } else {
      next();
    }
  },
};
</script>

<style lang="less" scoped>
.ChatBarShare {
  font-size: 0.32rem;
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 48px;
    left: 0px;
    width: 100%;
    height: 44px;
    margin-bottom: 3px;
    z-index: 999;
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
}
</style>
