import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user from './modules/user'
import cachedPage from './modules/cachedPage'
import okr from './modules/okr'
import socket from './modules/socket'
import report from './modules/report'
import workHours from './modules/workHours'
export default new Vuex.Store({
  modules: {
    user,
    cachedPage,
    okr,
    socket,
    report,
    workHours
  }
})
