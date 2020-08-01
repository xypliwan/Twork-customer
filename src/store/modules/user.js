// 用户信息
import { getDepartmentInfo } from '@/api/common'
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage
} from '_u/localStorage'
const user = {
  state: {
    access_token: getLocalStorage('access_token') || '',
    userInfo: {},
    userAuth: [], //权限信息
    guideNum: 0, //引导页数值
    atUserList: [], //at人的人员列表
    ecsMsgNum: 0, //工单消息数
    webSocketUrl: '', //socketurl
    architectList: [], //公司部门架构人员
    projectIcon: [
      { icon: 'icon-guanli' },
      { icon: 'icon-guanliyuanbidu' },
      { icon: 'icon-xiangmu-mian' },
      { icon: 'icon-xiangmu' }
    ]
  },
  mutations: {
    SET_USERINFO: (state, user) => {
      state.userInfo = user
      if (user.first_login == 1) {
        //第一次登录
        state.guideNum = 1
      } else {
        state.guideNum = 0
      }
    },
    CLEAR_USERINFO: state => {
      state.userInfo = {}
    },
    SET_TOKEN: (state, token) => {
      state.access_token = token
      setLocalStorage('access_token', token) //保存token到本地
    },
    CLEAR_TOKEN: state => {
      state.access_token = ''
      removeLocalStorage('access_token') //清空本地token
    },
    GET_USERAUTH: (state, userAuth) => {
      state.userAuth = userAuth
    },
    SET_GUIDENUM: (state, num) => {
      state.guideNum = num
    },
    SET_ATUSERLIST: (state, list) => {
      state.atUserList = list
    },
    SET_ECSMSGNUM: (state, num) => {
      state.ecsMsgNum = num
    },
    SET_ARCHITECTLIST: (state, list) => {
      state.architectList = list
    }
  },
  actions: {
    setUserInfo: ({ commit }, user) => {
      return commit('SET_USERINFO', user)
    },
    clearUserInfo: ({ commit }) => {
      return commit('CLEAR_USERINFO')
    },
    setToken: ({ commit }, token) => {
      return commit('SET_TOKEN', token)
    },
    clearToken: ({ commit }) => {
      return commit('CLEAR_TOKEN')
    },
    getAuth: ({ commit }, userAuth) => {
      return commit('GET_USERAUTH', userAuth)
    },
    setGuideNum: ({ commit }, num) => {
      return commit('SET_GUIDENUM', num)
    },
    setAtUserList: ({ commit }, list) => {
      return commit('SET_ATUSERLIST', list)
    },
    setEcsMsgNum: ({ commit }, num) => {
      return commit('SET_ECSMSGNUM', num)
    },
    getArchitectList: async ({ commit }) => {
      let { data } = await getDepartmentInfo({ 'get-people': 1 })
      commit('SET_ARCHITECTLIST', data)
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    access_token: state => state.access_token,
    userAuth: state => state.userAuth,
    guideNum: state => state.guideNum,
    atUserList: state => state.atUserList,
    ecsMsgNum: state => state.ecsMsgNum,
    architectList: state => state.architectList,
    projectIcon: state => state.projectIcon
  }
}

export default user
