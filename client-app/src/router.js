import Vue from 'vue';
import Router from 'vue-router';

import Me from '@/views/User.vue';
import Home from './views/Home.vue';
import HomeV2 from './views/Home2.vue'
import EditProject from './views/EditProject.vue';
import QRCodeReader from './views/QRCodeReader.vue';
import CreateProject from './views/CreateProject.vue';
import ProjectDetail2 from './views/ProjectDetail2.vue';
import ConfirmDonation from './views/ConfirmDonation.vue';
import ConfirmProject from './views/receiver/ConfirmProject.vue';
import auth from './firebase';

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
      path: '/project/:id',
      name: 'project',
      component: ProjectDetail2
    },
    {
      path: '/project/:id/edit',
      name: 'editProject',
      component: EditProject
    },
    {
      path: '/project/:id/confirm-receive',
      name: 'confrimReceive',
      component: ConfirmProject
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
    },
    {
      path: '/createproject',
      name: 'createproject',
      component: CreateProject
    },
    {
      path: '/v2',
      name: 'homev2',
      component: HomeV2
    },
    {
      path: '/me',
      name: 'me',
      component: Me,
      beforeEnter: (to, from, next) => {
        if (auth.currentUser) next();
        else next(from.path);
      }
    }
  ]
})
