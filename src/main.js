import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/global.scss'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/element-variables.scss'
Vue.use(ElementUI)

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)

import NProgress from 'nprogress' //页面加载进度
import 'nprogress/nprogress.css'
// NProgress.inc(0.2);
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})

import mixin from '@/utils/mixin'
Vue.mixin(mixin)

import Vue2OrgTree from 'vue2-org-tree'
Vue.use(Vue2OrgTree)

import VeLine from 'v-charts/lib/line'
Vue.component(VeLine.name, VeLine)

Vue.config.productionTip = false

import './core/directive'
import './core/filters'

new Vue({
  data: {
    tableTitileStyle: {
      'background-color': '#f5f5f5',
      color: '#333333',
      'font-weight': 'bold',
      'font-size': '13px',
      height: '40px'
    },
    tableContentStyle: {
      'font-size': '13px',
      color: '#666666',
      height: '60px'
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
