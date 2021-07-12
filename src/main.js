import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker'
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from 'axios';
Vue.prototype.$axios = axios;
import { post, get, post1 } from './uilts/https';
import local from './uilts/localStorage';
import './uilts/reset.css';
import setTitle from './uilts/SetTitle';
import wx from "weixin-js-sdk";
import Vconsole from 'vconsole';
import UUID from 'vue-uuid';
import '@vant/touch-emulator'; //
import Icon from 'vue2-svg-icon/Icon';
Vue.component('icon',Icon);
Vue.use(UUID);
// new Vconsole();
Vue.prototype.$wx = wx; // 挂载wx-jdk 插件
Vue.prototype.$post = post;
Vue.prototype.$post1 = post1;
Vue.prototype.$get = get;  // axios二次封 装
Vue.prototype.$U = local.U();  // Userid
Vue.prototype.$C = local.C();  // Compid
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  let toP = to.name;
  let fromP = from.name;
  sessionStorage.setItem('route', toP);
  setTitle(toP || to.fullPath);// 设置表头
  if (toP == 'Home') {
    sessionStorage.setItem('TabIndex', 6);
  } else if (toP == 'Common') {
    sessionStorage.setItem('TabIndex', 7);
  } else if (toP == 'HighSeas') {
    sessionStorage.setItem('TabIndex', 8);
  } else if (toP == 'detailFilter') {
    sessionStorage.setItem('TabIndex', 9);
  }
  // 路由中是否包含即将要进入的路由，如果不包含直接跳转到首页
  next();
});

Vue.use(Vant);
let vueThis = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default vueThis