import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import CurrencyFilter from 'vue-currency-filter'
import qrReader from 'vue-qrcode-reader'

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
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
