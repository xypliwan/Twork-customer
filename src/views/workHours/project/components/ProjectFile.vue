<template>
  <div class="wrap">
    <div class="filterWrap">
      <div class="filter">
        <el-input size="mini" v-model="title" placeholder="请输入任务标题搜索">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeFilter"
          ></el-button>
        </el-input>
      </div>
      <div class="btns">
        <common-upload
          formKey="file"
          :list="flieList"
          desc=""
          changeUploadBt="project"
          @successOk="successOk"
        ></common-upload>
        <!-- <el-button
          type="success"
          size="mini"
          style="margin-left: 10px"
          @click="uploadDoc"
          >上传</el-button
        > -->
        <el-button
          type="danger"
          size="mini"
          style="margin-left: 10px"
          @click="deleteDoc"
          >删除文档</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="file_name" label="名称">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.file_name }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="create_user_name" label="创建人">
      </el-table-column>
      <el-table-column prop="created_at" label="上传时间">
        <template slot-scope="scope">{{
          scope.row.created_at | checkTime
        }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { docList, delDoc, uploadDoc } from '@/api/workHours'
import CommonUpload from '_c/common/CommonUpload'
import common from '@/utils/common'
export default {
  data() {
    return {
      title: null,
      tableData: [],
      multipleSelection: [],
      file: [],
      flieList: []
    }
  },
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getFileList()
  },
  watch: {
    projectId() {
      this.getFileList()
    }
  },
  methods: {
    async deleteDoc() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选文档',
          type: 'warning'
        })
        return
      }
      try {
        let docID = []
        this.multipleSelection.map(item => {
          docID.push(item.file_id)
        })
        let params = {
          project_id: this.projectId,
          doc_id: docID
        }
        await delDoc(params)
        this.getFileList()
      } catch (error) {
        this._message(error)
      }
    },
    async getFileList() {
      try {
        let params = {
          project_id: this.projectId, //项目id
          file_name: this.title //文件名称
        }
        let { data } = await docList(params)
        this.tableData = data
      } catch (error) {
        this._message(error)
      }
    },
    async uploadDoc() {
      try {
        let params = {
          project_id: this.projectId, //项目id
          file: this.file
        }
        await uploadDoc(params)
        this.flieList = []
        this.file = []
        this.getFileList()
      } catch (error) {
        this._message(error)
      }
    },
    successOk(data, formKey) {
      this[formKey].push({
        url: data.url,
        file_name: data.file_name
      })
      console.log(this.file)
      this.uploadDoc()
    },
    changeFilter() {
      this.getFileList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  components: {
    CommonUpload
  },
  filters: {
    checkTime(time) {
      if (time == 0) {
        return 0
      }
      return common.timestampToTime(time)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .filterWrap {
    line-height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    background-color: #eff1f6;
    margin-bottom: 10px;
    .filter {
      width: 300px;
    }
  }
  .btns {
    display: flex;
    align-items: center;
  }
}
</style>
