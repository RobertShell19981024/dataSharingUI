import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import moment from 'moment'
import * as filters from './filters' // global filters
import jsonView from 'vue-json-viewer'
Vue.prototype.$moment = moment;//赋值使用
moment.locale('zh-cn');//需要汉化
Vue.use(Element, {
  locale: 'zh',
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});
import VueClipboard from 'vue-clipboard2'
Vue.use(jsonView)
Vue.use(VueClipboard);
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {App}
});
