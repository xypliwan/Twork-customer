// okr页面
const okr = {
  state: {
    needRefreshKrList: false,
    needCreateOkr: 0
  },
  mutations: {
    SET_NEED_REFRESH_KR_LIST: state => {
      state.needRefreshKrList = !state.needRefreshKrList
    },
    SET_NEEDCREATEOKR: state => {
      state.needCreateOkr = state.needCreateOkr + 1
    }
  },
  actions: {
    setNeedRefreshKrList: ({ commit }) => {
      return commit('SET_NEED_REFRESH_KR_LIST')
    },
    setNeedCreateOkr: ({ commit }) => {
      return commit('SET_NEEDCREATEOKR')
    }
  },
  getters: {
    needRefreshKrList: state => state.needRefreshKrList,
    needCreateOkr: state => state.needCreateOkr
  }
}

export default okr
