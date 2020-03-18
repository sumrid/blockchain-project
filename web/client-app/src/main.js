import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import BootstrapVue from 'bootstrap-vue' // Bootstrap-vue
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import CurrencyFilter from 'vue-currency-filter';
import qrReader from 'vue-qrcode-reader';
import VueCarousel from 'vue-carousel';

import { library } from '@fortawesome/fontawesome-svg-core' // Font awesome icon
import { faUserSecret, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUserSecret, faSignInAlt);

Vue.use(CurrencyFilter,
  {
    symbol: '฿',
    thousandsSeparator: ',',
    symbolPosition: 'back',
    fractionCount: 2,
    fractionSeparator: '.'
  })
Vue.use(qrReader)
Vue.use(BootstrapVue)
Vue.use(VueCarousel);
Vue.component('icon', FontAwesomeIcon);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
