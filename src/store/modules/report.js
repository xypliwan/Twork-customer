// 汇报

const report = {
  state: {
    //流程图标列表
    iconList: [
      {
        icon: 'icon-ribao',
        color: '#68e261'
      },
      {
        icon: 'icon-yuebao',
        color: '#69b3fa'
      },
      {
        icon: 'icon-zhoubao',
        color: '#fb7676'
      }
    ]
  },
  mutations: {},
  actions: {},
  getters: {
    iconList: state => state.iconList
  }
}

export default report
