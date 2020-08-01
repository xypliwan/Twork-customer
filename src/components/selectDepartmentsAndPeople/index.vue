<template>
  <div>
    <el-dialog
      append-to-body
      title="请选择部门和人"
      :visible="visible"
      width="800px"
      top="50px"
      @close="handleClose"
    >
      <div class="select-box">
        <div class="box">
          <div class="select-title">选择:</div>
        </div>
        <div class="box">
          <div class="select-title">已选:</div>
        </div>
      </div>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, i) in breadcrumbList" :key="i">
            <span v-if="i == 0" @click="initData">
              通讯录
            </span>
            <span
              v-else
              style="cursor: pointer;"
              @click="handleNext(item, i)"
              >{{ item.department_name }}</span
            >
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="select-box">
        <div class="box">
          <div class="area">
            <el-input
              clearable
              placeholder="请输入关键词"
              size="mini"
              prefix-icon="el-icon-search"
              v-model="keywords"
              @input="changeIpt"
              @clear="clearKeywords"
            >
            </el-input>
            <el-checkbox
              v-show="!showSearch"
              style="margin: 10px 0"
              @change="changeAll"
              :indeterminate="indeterminateStatus"
              v-model="checkAll"
              >全选</el-checkbox
            >
            <div class="list-box">
              <select-list
                :showSearch="showSearch"
                :searchDarList="searchDarList"
                :searchUserList="searchUserList"
                :userSelectList="userSelectList"
                :selectList="selectList"
                :canSelectDepartment="canSelectDepartment"
                :canSelectUser="canSelectUser"
                @nextDepartment="nextDepartment"
                @changeDar="changeDar"
                @changeUser="changeUser"
              ></select-list>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="area">
            <target-list
              :targetDar="targetDarList"
              :targetUserList="targetUserList"
              @clearUser="clearUser"
              @clearDar="clearDar"
            ></target-list>
          </div>
        </div>
      </div>
      <div class="buttom-box">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { formateAllUser, arrDeWeight } from '_u/utils'
import SelectList from './SelectList'
import TargetList from './TargetList'
export default {
  props: {
    visible: Boolean,
    originalData: Object,
    canSelectDepartment: {
      // 是否可以选择部门
      type: Boolean,
      default: true
    },
    canSelectUser: {
      //是否可以选择人员
      type: Boolean,
      default: true
    }
  },
  components: {
    SelectList,
    TargetList
  },
  data() {
    return {
      keywords: '',
      // 搜索结果列表  部门/人员
      searchDarList: [],
      searchUserList: [],
      //面包屑列表
      breadcrumbList: [],
      //待选择的部门/人员
      selectList: [],
      userSelectList: [],
      //选中的部门/人员
      targetDarList: [],
      targetUserList: [],
      indeterminateStatus: false,
      checkAll: false,
      showSearch: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.targetDarList = this.originalData.department
        this.targetUserList = this.originalData.user
        this.initData()
      }
    }
  },
  computed: {
    ...mapGetters(['architectList']),
    formatUser() {
      let userArr = JSON.parse(JSON.stringify(this.architectList))
      return formateAllUser(userArr)
    }
  },
  created() {},
  methods: {
    save() {
      if (!this.targetDarList.length && !this.targetUserList.length) {
        this._message('请选择部门或人员', 'warning')
        return
      }
      /* eslint-disable */
      let nameArr = []
      this.targetDarList.forEach(el => {
        nameArr.push(el.department_name)
      })
      this.targetUserList.forEach(el => {
        nameArr.push(el.username)
      })
      this.$emit('updateUser', {
        department: this.targetDarList,
        user: this.targetUserList,
        nameArr
      })
      /* eslint-disable */
      this.handleClose()
    },
    clearKeywords() {
      this.showSearch = false
      this.searchDarList = []
      this.searchUserList = []
    },
    changeIpt() {
      if (this.keywords.trim().length) {
        this.searchDarList = []
        this.searchUserList = []
        this.searchfromKeywords(this.formatUser, this.keywords)
        this.searchDarList = arrDeWeight(this.searchDarList, 'department_id')
        this.searchUserList = arrDeWeight(this.searchUserList, 'user_id')
        this.showSearch = true
      } else {
        this.showSearch = false
        this.searchDarList = []
        this.searchUserList = []
      }
    },
    searchfromKeywords(arr, keywords) {
      arr.forEach(el => {
        if (el.department_name.indexOf(keywords) !== -1) {
          this.searchDarList.push(el)
        }
        if (el.people && el.people.length) {
          el.people.forEach(peopleItem => {
            if (peopleItem.username.indexOf(keywords) !== -1) {
              this.searchUserList.push(peopleItem)
            }
          })
        }
        if (el.children) {
          this.searchfromKeywords(el.children, keywords)
        }
        this.checkSearchData()
      })
    },
    clearDar(item) {
      this.targetDarList = this.targetDarList.filter(
        el => el.department_id !== item.department_id
      )
      this.selectList.forEach(el => {
        if (el.department_id == item.department_id) {
          el.select = false
        }
      })
      this.searchDarList.forEach(el => {
        if (el.department_id == item.department_id) {
          el.select = false
        }
      })
    },
    clearUser(item) {
      this.targetUserList = this.targetUserList.filter(
        el => el.user_id !== item.user_id
      )
      this.userSelectList.forEach(el => {
        if (el.user_id == item.user_id) {
          el.select = false
        }
      })
      this.searchUserList.forEach(el => {
        if (el.user_id == item.user_id) {
          el.select = false
        }
      })
    },
    checkSearchData() {
      this.searchDarList.forEach(el => {
        el.select = false
      })
      this.searchUserList.forEach(el => {
        el.select = false
      })

      this.targetDarList.forEach(el => {
        this.searchDarList.forEach(ev => {
          if (el.department_id == ev.department_id) {
            ev.select = true
          }
        })
      })
      this.targetUserList.forEach(el => {
        this.searchUserList.forEach(ev => {
          if (el.user_id == ev.user_id) {
            ev.select = true
          }
        })
      })
    },
    checkData() {
      this.selectList.forEach(el => {
        el.select = false
      })
      this.userSelectList.forEach(el => {
        el.select = false
      })

      this.targetDarList.forEach(el => {
        this.selectList.forEach(ev => {
          if (el.department_id == ev.department_id) {
            ev.select = true
          }
        })
      })
      this.targetUserList.forEach(el => {
        this.userSelectList.forEach(ev => {
          if (el.user_id == ev.user_id) {
            ev.select = true
          }
        })
      })
    },
    changeAll(e) {
      if (e) {
        this.indeterminateStatus = false
        if (this.canSelectDepartment) {
          this.selectList.forEach(el => {
            if (!el.select) {
              this.targetDarList.push(el)
              el.select = true
            }
          })
        }
        if (this.canSelectUser) {
          this.userSelectList.forEach(el => {
            if (!el.select) {
              this.targetUserList.push(el)
              el.select = true
            }
          })
        }
      } else {
        if (this.canSelectDepartment) {
          this.selectList.forEach(el => {
            el.select = false
            this.targetDarList.forEach((ev, j) => {
              if (el.department_id == ev.department_id) {
                this.targetDarList.splice(j, 1)
              }
            })
          })
        }
        if (this.canSelectUser) {
          this.userSelectList.forEach(el => {
            el.select = false
            this.targetUserList.forEach((ev, j) => {
              if (el.user_id == ev.user_id) {
                this.targetUserList.splice(j, 1)
              }
            })
          })
        }
      }
    },
    changeUser(info) {
      let { item, flg } = info
      if (flg) {
        this.targetUserList.push(item)
      } else {
        this.targetUserList = this.targetUserList.filter(
          el => el.user_id !== item.user_id
        )
        this.indeterminateStatus = true
      }
    },
    changeDar(info) {
      let { item, flg } = info
      if (flg) {
        this.targetDarList.push(item)
      } else {
        this.targetDarList = this.targetDarList.filter(
          el => el.department_id !== item.department_id
        )
        this.indeterminateStatus = true
      }
    },
    nextDepartment(item) {
      this.breadcrumbList.push(item)
      this.selectList = item.children || []
      this.userSelectList = item.people || []
      this.checkData()
    },
    handleNext(item, i) {
      this.indeterminateStatus = false
      this.checkAll = false
      this.selectList = item.children || []
      this.userSelectList = item.people || []
      this.breadcrumbList.splice(i + 1, this.breadcrumbList.length - i)
      this.checkData()
    },
    initData() {
      this.breadcrumbList = []
      let item = this.formatUser[0]
      this.breadcrumbList.push(item)
      this.selectList = this.formatUser
      this.userSelectList = item.people
      this.checkData()
    },
    reretData() {
      this.breadcrumbList = []
      this.selectList = []
      this.userSelectList = []
      this.targetDarList = []
      this.targetUserList = []
      this.checkAll = false
      this.showSearch = false
      this.keywords = ''
      this.searchDarList = []
      this.searchUserList = []
    },
    handleClose() {
      this.reretData()
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-box {
  display: flex;
  .box {
    flex: 1;
    padding: 5px;
    margin: 0 5px;
    .select-title {
      color: #333;
      font-size: 15px;
      margin-bottom: 15px;
    }
    .area {
      background: #f1f1f1;
      padding: 10px;
      border-radius: 3px;
      height: 100%;
      height: 500px;
      overflow-y: auto;
    }
  }
}
.breadcrumb {
  margin: 10px 10px;
}
.buttom-box {
  text-align: center;
  margin-top: 20px;
}
</style>
