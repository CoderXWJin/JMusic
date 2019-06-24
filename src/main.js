import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

// Vue.config.productionTip = false
import 'common/stylus/index.styl'

fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router // routr内设置好  main中引入并调用  在app.vue中使用
})
