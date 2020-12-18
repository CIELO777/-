import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from 'axios'
Vue.prototype.$axios = axios;
import { post, get, post1 } from './uilts/https';
import local from './uilts/localStorage';
import './uilts/reset.css'
import setTitle from './uilts/SetTitle'
import wx from "weixin-js-sdk";
import Vconsole from 'vconsole';
// new Vconsole();
Vue.prototype.$wx = wx; // 挂载wx-jdk 插件
Vue.prototype.$post = post;
Vue.prototype.$post1 = post1;
Vue.prototype.$get = get;  // axios二次封装
Vue.prototype.$U = local.U();  // Userid
Vue.prototype.$C = local.C();  // Compid
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  let toP = to.name;
  let fromP = from.name;
  console.log(toP, fromP);
  if (toP === 'OrderDetail' || toP === 'ChooseCommodity' || toP === 'OrderList') {
    store.commit('cache', 'OrderDetail') // 如果这三个页面，那么就缓存订单页面
  } else if (toP === 'LinkDetailed' && fromP === 'Home') {
    store.commit('cache', 'Home')
  } else if (toP === 'LinkDetailed' && fromP === 'Common') {
    store.commit('cache', 'Common')
  } else if (toP === 'LinkDetailed' && fromP === 'HighSeas') {
    store.commit('cache', 'HighSeas')
  } else if ((toP === 'Home' || toP === 'HighSeas' || toP === 'Common') && fromP !== 'LinkDetailed') {
    store.commit('cache', 'null') // 一级页面，如果上一个路由不是LinkDetailed 那么就不是重表单跳转过来的
  } else {
    store.commit('cache', toP)
  }

  setTitle(toP || to.fullPath);// 设置表头
  if (toP == 'Home') {
    sessionStorage.setItem('TabIndex', 6);
  } else if (toP == 'Common') {
    sessionStorage.setItem('TabIndex', 7);
  } else if (toP == 'HighSeas') {
    sessionStorage.setItem('TabIndex', 8);

  }
  // 路由中是否包含即将要进入的路由，如果不包含直接跳转到首页
  let include = router.options.routes.find(item => item.name == toP);
  if (include) {
    next()
  } else {
    next({
      path: '/'
    })
  }
});

Vue.use(Vant);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
