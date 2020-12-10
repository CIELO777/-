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
    },
    cacheState: '',

  },
  mutations: {
    saveTitle(state, pathName) {
      state.title = pathName.title;
      window.document.title =  pathName.title;
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
      }
    },
    ClearCurNum(state, pathName) {
      state.current[pathName] = 1;
    },
    cache(state, pathName) {
      state.cacheState = pathName;
    },
  },
  actions: {
  },
  modules: {
  },

})
