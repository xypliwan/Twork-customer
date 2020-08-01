<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      v-loading="addTaskLoading"
    >
      <div class="fast-task-box">
        <div class="left" @click="handleShowIcon" v-show="!isShowCreate">
          <i class="el-icon-plus"></i>
          点击此处，快速创建任务
        </div>
        <div class="right" v-show="isShowCreate">
          <div class="item1" v-if="showProjectSelect">
            <el-form-item prop="project">
              <el-select
                filterable
                v-model="ruleForm.project"
                placeholder="选择项目"
                @change="changeProject"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.project_id"
                  :label="item.project_name"
                  :value="item.project_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="item1" @click="popTaskTree()">
            <el-form-item prop="task">
              <el-input
                placeholder="选择任务类型"
                v-model="ruleForm.task"
                readonly
              ></el-input>
            </el-form-item>
          </div>
          <div class="item1">
            <el-form-item prop="title">
              <el-input
                placeholder="任务标题"
                v-model="ruleForm.title"
              ></el-input>
            </el-form-item>
          </div>
          <div class="item-person" style="width: 300px">
            <el-form-item prop="personIdArr">
              <el-select
                v-model="ruleForm.personIdArr"
                placeholder="责任人"
                multiple
              >
                <el-option
                  v-for="item in responList"
                  :key="item.user_id"
                  :label="item.username"
                  :value="item.user_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="item2">
            <el-form-item prop="time">
              <el-date-picker
                style="width:280px;"
                v-model="ruleForm.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" size="mini" @click="onSubmit('ruleForm')"
              >确认</el-button
            >
            <el-button size="mini" @click="cancel">取消</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <task-type-tree
      :treeDialogVisible="tree.treeDialogVisible"
      :status="1"
      :duoxuan="true"
      :defaultId="tree.defaultId"
      :project_id="showProjectSelect ? ruleForm.project : project_id"
      @cancleTypeTree="cancleTypeTree"
      @saveTypeTree="saveTypeTree"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TaskTypeTree from './TaskTypeTrees'
// import { getUserList } from '@/api/common'
import { addTask, getProjectList, nameList } from '@/api/workHours'
export default {
  data () {
    return {
      projectList: [], //项目列表
      ruleForm: {
        project: null,
        task: null,
        taskId: null,
        title: null,
        person: null,
        personIdArr: [],
        time: [new Date(), new Date()]
      },
      rules: {
        project: [{ required: true, message: '请选择', trigger: 'change' }],
        task: [{ required: true, message: '请选择', trigger: 'change' }],
        title: [{ required: true, message: '请输入', trigger: 'change' }],
        time: [{ required: false, message: '请选择', trigger: 'change' }],
        personIdArr: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      addTaskLoading: false,
      isShowCreate: false,
      tree: {
        treeDialogVisible: false,
        defaultId: null
      },
      responList: [] //责任人
    }
  },
  props: {
    project_id: {
      type: [Number, String],
      default: null
    },
    showProjectSelect: {
      type: Boolean,
      default: false
    },
    responsibleId: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: {
    TaskTypeTree
  },
  watch: {
    userInfo () {
      // this.ruleForm.personIdArr = []
      // this.ruleForm.personIdArr.push(String(this.userInfo.id))
    },
    responsibleId: {
      // eslint-disable-next-line no-unused-vars
      handler: function (newValue, oldValue) {
        this.ruleForm.personIdArr = this.responsibleId
      },
      deep: true
    },
    project_id () {
      //没有project_id传进来的需要展示项目列表选择
      this.isShowCreate = false
      this.ruleForm.personIdArr = []
      this.ruleForm.project = ''
      this.ruleForm.task = ''
      this.ruleForm.taskId = ''
      this.ruleForm.title = ''
      this.getNameList()
    }
  },
  created () {
    this.isShowCreate = false
    this.ruleForm.personIdArr = []
    this.ruleForm.project = ''
    this.ruleForm.task = ''
    this.ruleForm.taskId = ''
    this.ruleForm.title = ''
    // this.ruleForm.personIdArr.push(String(this.userInfo.id))
    // this.getUserListFn()
    this.getProjectListFn()
    this.getNameList()
  },

  methods: {
    changeProject () {
      this.ruleForm.task = ''
      this.ruleForm.taskId = ''
      this.ruleForm.title = ''
    },
    async getProjectListFn () {
      try {
        let { data } = await getProjectList()
        this.projectList = data
      } catch (error) {
        this._message(error)
      }
    },
    async getNameList () {
      if (this.project_id === null || this.project_id === '') {
        return
      }
      try {
        let { data } = await nameList({ project_id: this.project_id })
        this.responList = data
      } catch (error) {
        this._message(error)
      }
    },
    async addTask () {
      this.addTaskLoading = true
      //添加任务
      try {
        let params = {
          title: this.ruleForm.title, //标题
          project_id: this.showProjectSelect
            ? this.ruleForm.project
            : this.project_id, //项目id
          category_id: this.ruleForm.taskId, //分类id
          start_at: this.ruleForm.time ? this.ruleForm.time[0] : null, //开始时间
          end_at: this.ruleForm.time ? this.ruleForm.time[1] : null, //结束时间
          responsible: this.ruleForm.personIdArr //责任人id数组
        }
        let { message } = await addTask(params)
        this.ruleForm.title = ''
        this.ruleForm.task = ''
        this._message(message, 'success')
        this.$emit('addTaskOk')
        this.cancel()
      } catch (error) {
        this._message(error)
      }
      this.addTaskLoading = false
    },
    onSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addTask()
        } else {
          return false
        }
      })
    },
    //获取责任人
    // async getUserListFn() {
    //   try {
    //     let { data } = await getUserList()
    //     this.responList = data
    //   } catch (error) {
    //     this._message(error)
    //   }
    // },
    saveTypeTree (item) {
      if (item[0]) {
        let task = []
        let taskId = []
        let title = []
        item.map(i => {
          task.push(i.category_name)
          taskId.push(i.category_id)
          title.push(i.category_name)
        })
        this.ruleForm.task = task.join(',')
        this.ruleForm.taskId = taskId
        this.ruleForm.title = task.join(',')
      }
      this.tree.treeDialogVisible = false
    },
    cancleTypeTree () {
      this.tree.treeDialogVisible = false
    },
    // eslint-disable-next-line no-unused-vars
    popTaskTree () {
      if (this.ruleForm.taskId) {
        this.tree.defaultId = this.ruleForm.taskId
      } else {
        this.tree.defaultId = null
      }
      this.tree.treeDialogVisible = true
    },
    handleShowIcon () {
      this.isShowCreate = !this.isShowCreate
      this.getNameList()
    },
    cancel () {
      this.isShowCreate = false
      // this.$refs.ruleForm.resetFields()
      // this.ruleForm.personIdArr = []
      // this.ruleForm.personIdArr.push(String(this.userInfo.id))
    }
  }
}
</script>
<style lang="scss" scoped>
.fast-task-box {
  height: 60px;
  display: flex;
  align-items: center;
  background: #f1f1f1;
  .left {
    width: auto;
    font-size: 14px;
    padding: 0 5px;
    font-weight: 800;
    color: #999;
    cursor: pointer;
  }
  .right {
    flex: 1;
    padding-top: 15px;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    ::v-deep .el-input__inner {
      padding: 0 5px;
      border: none;
    }
    .item1 {
      width: 130px;
      overflow: hidden;
      margin: 0 5px;
    }
    .item2 {
      width: 300px;
      overflow: hidden;
      margin: 0 5px;
    }
    .item-person {
      width: 200px;
      overflow: hidden;
      margin: 0 5px;
    }
  }
}
</style>
