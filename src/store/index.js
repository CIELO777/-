import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: "",
    leftShow: "",
    tabarShow: "",
    current: {
      follow: 1,
      order: 1,
      schedule: 1,
      radar: 1,
      operating: 1,
      home: 1,
      common: 1,
      highseas: 1,
      filter: 1
    },
    scroll: {
      follow: 1,
      order: 1,
      schedule: 1,
      radar: 1,
      operating: 1,
      home: 1,
      common: 1,
      highseas: 1,
      filter: 1,
      form:1
    },
    cacheState: '',
    SearchValue: "",  // taber搜索
    SearchMode: '',  //
    SearchReset: '',
    ManualData: {
      nickName: "",
      company: "",
      sheet: "",
    }

  },
  mutations: {
    saveTitle(state, pathName) {
      state.title = pathName.title;
      window.document.title = pathName.title;
      state.leftShow = pathName.leftShow;
      state.tabarShow = pathName.tabarShow;
    },
    SoundCurNum(state, pathName) {  // 计算页数
      let tabIndex = sessionStorage.getItem('TabIndex');
      if (tabIndex == 1) { // 跟进记录
        state.current.follow = ++state.current.follow;
      } else if (tabIndex == 2) { // 订单
        state.current.order = ++state.current.order;
      } else if (tabIndex == 3) { // 日程
        state.current.schedule = ++state.current.schedule;
      } else if (tabIndex == 4) { // 雷达
        state.current.radar = ++state.current.radar;
      } else if (tabIndex == 5) {  // 操作记录
        state.current.operating = ++state.current.operating;
      } else if (tabIndex == 6) {  // 首页 Home
        state.current.home = ++state.current.home;
      } else if (tabIndex == 7) {  // 常用
        state.current.common = ++state.current.common;
      } else if (tabIndex == 8) {  // 公海
        state.current.highseas = ++state.current.highseas;
      } else if (tabIndex == 9) {// 详细过滤
        state.current.filter = ++state.current.filter;
      }
    },
    ScrollSave(state, pathName) {  // 保存每个页面滚动条位置，防止页面滚动条位置耦合
      let tabIndex = sessionStorage.getItem('TabIndex');
      if (tabIndex == 1) { // 跟进记录
        state.scroll.follow = pathName;
      } else if (tabIndex == 2) { // 订单
        state.scroll.order = pathName;
      } else if (tabIndex == 3) { // 日程
        state.scroll.schedule = pathName;
      } else if (tabIndex == 4) { // 雷达
        state.scroll.radar = pathName;
      } else if (tabIndex == 5) {  // 操作记录
        state.scroll.operating = pathName;
      } else if (tabIndex == 6) {  // 首页 Home
        state.scroll.home = pathName;
      } else if (tabIndex == 7) {  // 常用
        state.scroll.common = pathName;
      } else if (tabIndex == 8) {  // 公海
        state.scroll.highseas = pathName;
      } else if (tabIndex == 9) {// 详细过滤
        state.scroll.filter = pathName;
      }else if(tabIndex == 0){
        state.scroll.form = pathName;
      }

    },
    ClearCurNum(state, pathName) {
      // console.log(state, pathName,'清除了');
      state.current[pathName] = 1;
    },
    cache(state, pathName) {
      state.cacheState = pathName;
    },
    Searchfuzzy(state, pathName) {
      state.SearchValue = pathName;
      // state.SearchMode = ''; // 此方法监听搜索框内容，然后返回，
    },
    SearchfuzzyReset(state, pathName) {
      // state.SearchValue = '';
      state.SearchMode = pathName;// 点击搜索取消按钮触发，目的是恢复默认列表
    },
    destroyedSearch(state, pathName) { // 页面销毁应该让搜索重置，
      state.SearchReset = pathName;
    },
    ManualUpdate(state, pathName) {// 手动更新列表名字，公司信息，跟进记录，目的为表单返回不刷新页面
      state.ManualData[pathName.target] = pathName.data;
      console.log(state.ManualData);
    }
  },
  actions: {
  },
  modules: {
  },

})
