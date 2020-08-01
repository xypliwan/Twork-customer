<template>
  <div class="task-type" v-loading="listLoading">
    <div v-if="!showDeatil">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="project_name" label="项目名称">
          <template slot-scope="scope">
            <div
              class="name"
              style="color:#526ecc"
              @click="chooseProject(scope.row)"
            >
              <span>{{ scope.row.project_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="deleteTaskType(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <detail v-if="showDeatil" :projectId="projectId" @goBack="goBack" />
    <el-dialog title="修改" :visible.sync="showEdit" width="600px">
      <div class="create-cont">
        <el-input
          clearable
          size="small"
          v-model="editForm.name"
          placeholder="请输入"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Detail from './components/Details'
import {
  projectListTask,
  delCategory,
  nupdateCategoryName
} from '@/api/workHours'
export default {
  name: 'TaskType',
  data() {
    return {
      listLoading: false,
      showDeatil: false,
      projectId: null,
      tableData: [],
      showEdit: false,
      editForm: {
        project_id: '',
        name: ''
      }
    }
  },
  created() {
    this.projectListTask()
  },
  watch: {},
  methods: {
    async projectListTask() {
      this.listLoading = true
      try {
        let obj = {
          project_name: this.filterTxt
        }
        let { data } = await projectListTask(obj)
        this.tableData = data
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    deleteTaskType(item) {
      this.$confirm(
        '此操作将删除该分类及该分类下所有任务类型, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let obj = {
            project_id: item.project_id
          }
          this.delCategory(obj)
        })
        .catch(() => {})
    },
    async delCategory(item) {
      try {
        let obj = {
          project_id: item.project_id
        }
        await delCategory(obj)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.addValue = ''
        this.projectHasList()
        this.projectListTask()
      } catch (error) {
        this._message(error)
      }
    },
    changeName(item) {
      item.showInput = false
    },
    edit(item) {
      this.editForm.project_id = item.project_id
      this.editForm.name = item.project_name
      this.showEdit = true
    },
    chooseProject(item) {
      this.showDeatil = true
      this.projectId = item.project_id
    },
    goBack() {
      this.showDeatil = false
    },
    async save() {
      try {
        await nupdateCategoryName(this.editForm)
        this.showEdit = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.projectListTask()
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    Detail
  }
}
</script>
<style lang="scss" scoped>
.task-type {
  .name {
    cursor: pointer;
    span {
      text-decoration: underline;
      margin-left: 5px;
    }
  }
}
.create-cont {
  margin: 50px 10px;
}
</style>
