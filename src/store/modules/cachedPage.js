const cachePage = {
  state: {
    // 顶部标签数组
    tabList: [
      {
        title: '首页',
        name: 'Home',
        authentication: true
      }
    ],
    keepAlive: ['Home'], //缓存的页面
    currentPage: 'Home' //当前页面组件名,用于高亮当前标签页
  },
  mutations: {
    ADD_KEEPALIVE: (state, meta) => {
      state.currentPage = meta.name
      if (!state.tabList.find(item => item.title === meta.title)) {
        state.tabList.push(meta) //添加标签页
        state.keepAlive.push(meta.name) //添加缓存
      }
    },
    DELETE_KEEPALIVE: (state, meta) => {
      state.keepAlive.splice(state.keepAlive.indexOf(meta.name), 1) //删除缓存
      state.tabList.splice(state.tabList.indexOf(meta), 1) //删除标签页
    }
  },
  actions: {
    addTablist: ({ commit }, meta) => {
      return commit('ADD_KEEPALIVE', meta)
    },
    deleteTablist: ({ commit }, meta) => {
      return commit('DELETE_KEEPALIVE', meta)
    }
  },
  getters: {
    tabList: state => state.tabList,
    keepAliveArr: state => state.keepAlive,
    currentPage: state => state.currentPage
  }
}

export default cachePage
