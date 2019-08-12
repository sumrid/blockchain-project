import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ProjectDetail from './views/ProjectDetail.vue';
import QRCodeReader from './views/QRCodeReader.vue';
import ConfirmDonation from './views/ConfirmDonation.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: ProjectDetail
    },
    {
      path: '/qr',
      name: 'qr',
      component: QRCodeReader
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: ConfirmDonation
    }
  ]
})
