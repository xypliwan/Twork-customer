import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
const minxin = {
  computed: {
    ...mapGetters(['userAuth']),
    idDev() {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    _menuPermission(code) {
      return this.userAuth.includes(code)
    },
    _message(msg, type = 'error') {
      Message({
        type: type,
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: msg
      })
    },
    getMappingVal(arr = [], valkey, val, labkey) {
      let target = arr.filter(el => el[valkey] == val)
      return target.length > 0 ? target[0][labkey] : ''
    },
    isDisabledBtn(status, arr) {
      let flag = true
      for (let i = 0; i < arr.length; i++) {
        if (status == arr[i]) {
          flag = false
          break
        } else {
          flag = true
        }
      }
      return flag
    },
    // 拥有相同key的对象赋值
    mixinObjAssign(obj1, obj2) {
      for (const key in obj1) {
        // obj1[key] = obj2[key];
        if (obj1.hasOwnProperty(key)) {
          obj1[key] = obj2[key]
        }
      }
      return obj1
    },
    // 清空
    mixinSetNullString(obj, arr) {
      for (const key in obj) {
        if (arr) {
          if (arr.indexOf(key) == -1) {
            obj[key] = ''
          }
        } else {
          obj[key] = ''
        }
      }
      return obj
    }
  }
}
export default minxin
