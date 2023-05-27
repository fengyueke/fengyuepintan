import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload, Dialog } from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'

Vue.use(Vant)

Vue.use(Lazyload)
Vue.use(Dialog)

Vue.prototype.$dialog = Dialog
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
})
// 全局配置 axios 的请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8080/'
// 将 axios 挂载到原型上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
