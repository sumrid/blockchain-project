import Vue from 'vue';
import Router from 'vue-router';

import Tx from './views/Tx.vue';
import Owner from "./views/Owner.vue";
import HomeV2 from './views/Home2.vue'
import Me from '@/views/user/User.vue';
import Contact from './views/Contact.vue';
import Regis from './views/user/Regis.vue';
import SendInvoice from './views/SendInvoice';
import Withdraw from './views/WithdrawFromProject';
import RegisUser from './views/user/RegisUser.vue';
import EditProject from './views/EditProject.vue';
import QRCodeReader from './views/QRCodeReader.vue';
import CreateProject from './views/CreateProject.vue';
import EditProfile from './views/user/EditProfile.vue';
import ProjectDetail2 from './views/ProjectDetail2.vue';
import RegisCreator from './views/user/RegisCreator.vue';
import ConfirmDonation from './views/ConfirmDonation.vue';
import ConfirmProject from './views/receiver/ConfirmProject.vue';
import auth from './firebase';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeV2
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
      path: '/project/:id/sendinvoice',
      name: 'sendInvoice',
      component: SendInvoice
    },
    {
      path: '/project/:id/withdraw',
      name: 'withdraw',
      component: Withdraw,
      props: true
    },
    {
      path: '/project/:id/confirm-receive',
      name: 'confrimReceive',
      component: ConfirmProject,
      beforeEnter: (to, from, next) => {
        if (auth.currentUser) next();
        else next(from.path);
      }
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
      component: CreateProject,
      beforeEnter: (to, from, next) => {
        if (auth.currentUser) next();
        else next(from.path);
      }
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
    },
    {
      path: '/me/edit',
      name: 'editprofile',
      component: EditProfile
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/tx/:txid',
      name: 'tx',
      component: Tx
    },
    {
      path: '/owner/:id',
      name: 'owner',
      component: Owner,
      props: true
    },
    {
      path: '/regis',
      name: 'regis',
      component: Regis
    },
    {
      path: '/regis/user',
      name: 'regisUser',
      component: RegisUser,
    },
    {
      path: '/regis/creator',
      name: 'regisCreator',
      component: RegisCreator
    }
  ]
})
