import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import User from '@/views/menu/Users.vue'
import Project from '@/views/menu/Projects.vue'
import Invoices from '@/views/menu/Invoices.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      components: {
        login: Login
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: Project

    },
    {
      path: '/users',
      name: 'users',
      component: User
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: Invoices
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
