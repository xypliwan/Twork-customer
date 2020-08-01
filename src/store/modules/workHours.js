//工时系统
const workHours = {
  state: {
    projectData: []
  },
  mutations: {
    SET_PROJECTLIST: (state, data) => {
      state.projectData = data
    }
  },
  actions: {
    setProjectList: ({ commit }, data) => {
      return commit('SET_PROJECTLIST', data)
    }
  },
  getters: {
    projectData: state => state.projectData
  }
}

export default workHours
