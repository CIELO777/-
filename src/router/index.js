import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Navigation',
    component: () => import(/* webpackChunkName: "about" */ '../views/navigation.vue'),
  },
  {
    path: '/home',
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
  },
  {
    path: '/compInfo',
    name: 'compInfo',
    component: () => import(/* webpackChunkName: "about" */ '../components/detailFilter/CompInfo.vue')
  },
  {
    path: '/card',
    name: 'Card',
    component: () => import(/* webpackChunkName: "about" */ '../views/Card.vue')
  },
  {
    path: '/colorPage',
    name: 'ColorPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/ColorPage.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import(/* webpackChunkName: "about" */ '../views/Video.vue')
  },
  {
    path: '/iframe',
    name: 'Iframe',
    component: () => import(/* webpackChunkName: "about" */ '../components/colorPage/Iframe.vue')
  },
  {
    path: '/microStation',
    name: 'MicroStation',
    component: () => import(/* webpackChunkName: "about" */ '../views/MicroStation.vue')
  },
  {
    path: '/poster',
    name: 'Poster',
    component: () => import(/* webpackChunkName: "about" */ '../views/Poster.vue')
  },
  {
    path: '/advertorial',
    name: 'Advertorial',
    component: () => import(/* webpackChunkName: "about" */ '../views/Advertorial.vue')
  },
  {
    path: '/document',
    name: 'Document',
    component: () => import(/* webpackChunkName: "about" */ '../components/poster/document.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/wx-crmTest/',
  routes
})

export default router
