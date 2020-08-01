import { getSocketUrl } from '@/api/common'
import { Message } from 'element-ui'
import { getDynamicNum } from '@/api/dynamic'

const socket = {
  state: {
    webSocketUrl: '', //socketurl
    dynamicList: [], //动态消息列表
    dynamicInfo: {} //新消息
  },
  mutations: {
    SET_WEBSOCKETURL: (state, url) => {
      state.webSocketUrl = url
    },
    SET_DYNAMICLIST: (state, list) => {
      state.dynamicList = list
    },
    SET_DYNAMICINFO: (state, info) => {
      state.dynamicInfo = info
    }
  },
  actions: {
    setDynamicInfo: ({ commit }, info) => {
      return commit('SET_DYNAMICINFO', info)
    },
    setWebSocketUrl: async ({ commit }) => {
      try {
        let {
          data: { uri }
        } = await getSocketUrl()
        commit('SET_WEBSOCKETURL', uri)
      } catch (error) {
        Message({
          message: error,
          type: 'error'
        })
      }
    },
    getDynamicNum: async ({ commit }) => {
      try {
        let { data } = await getDynamicNum()
        commit('SET_DYNAMICLIST', data)
      } catch (error) {
        Message({
          message: error,
          type: 'error'
        })
      }
    },
    setDynamicNum: ({ commit }, list) => {
      return commit('SET_DYNAMICLIST', list)
    }
  },
  getters: {
    webSocketUrl: state => state.webSocketUrl,
    dynamicList: state => state.dynamicList,
    dynamicInfo: state => state.dynamicInfo
  }
}

export default socket
