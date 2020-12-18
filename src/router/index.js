import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/common',
    name: 'Common',
    component: () => import(/* webpackChunkName: "about" */ '../views/Common.vue')
  },
  {
    path: '/highSeas',
    name: 'HighSeas',
    component: () => import(/* webpackChunkName: "about" */ '../views/HighSeas.vue')
  },
  {
    path: '/checking',
    name: 'Checking',
    component: () => import(/* webpackChunkName: "about" */ '../views/Checking.vue')
  },
  {
    path: '/linkDetailed',
    name: 'LinkDetailed',
    component: () => import(/* webpackChunkName: "about" */ '../views/LinkDetailed.vue')
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: () => import(/* webpackChunkName: "about" */ '../components/OrderDetail.vue')
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: () => import(/* webpackChunkName: "about" */ '../components/Agenda.vue')
  },
  {
    path: '/agendadetail',
    name: 'Agendadetail',
    component: () => import(/* webpackChunkName: "about" */ '../components/Agendadetail.vue')
  },
  {
    path: '/radardetail',
    name: 'RadarDetail',
    component: () => import(/* webpackChunkName: "about" */ '../components/RadarDetail.vue')
  },
  {
    path: '/orderdetailinfo/:id',
    name: 'OrderDetailInfo',
    component: () => import(/* webpackChunkName: "about" */ '../components/OrderDetailInfo.vue')
  },
  {
    path: '/sheetimg',
    name: 'SheetImg',
    component: () => import(/* webpackChunkName: "about" */ '../components/Sheetimg.vue')
  },
  {
    path: '/choosecommodity',
    name: 'ChooseCommodity',
    component: () => import(/* webpackChunkName: "about" */ '../components/productlists/ChooseCommodity.vue')
  },
  {
    path: '/orderList',
    name: 'OrderList',
    component: () => import(/* webpackChunkName: "about" */ '../components/orderList.vue')
  },
  {
    path: '/detailFilter',
    name: 'detailFilter',
    component: () => import(/* webpackChunkName: "about" */ '../components/Detailfilter.vue')
  },
  {
    path: '/addcustomer',
    name: 'Addcustomer',
    component: () => import(/* webpackChunkName: "about" */ '../components/detailFilter/Addcustomer.vue')
  }, {
    path: '/compInfo',
    name: 'compInfo',
    component: () => import(/* webpackChunkName: "about" */ '../components/detailFilter/CompInfo.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/wx-crm/',
  routes
})

export default router
