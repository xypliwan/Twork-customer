<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="任务详情"
      :append-to-body="true"
      top="50px"
      :visible.sync="dialog"
      width="1300px"
      :before-close="handleClose"
    >
      <div v-loading="detailLoading" class="detail-box">
        <div class="left">
          <div class="task-title">
            <div class="input-box">
              <el-input
                v-model="detail.title"
                size="small"
                @blur="updateTaskInfo"
              ></el-input>
            </div>
            <div class="status-box task-status">
              <el-select
                size="mini"
                @change="changeStatus"
                filterable
                v-model="detail.task_status"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in processStatusList"
                  :key="item.status"
                  :label="item.name"
                  :value="item.status"
                ></el-option>
              </el-select>
            </div>
            <div class="status-box urgency-status">
              <el-select
                size="mini"
                @change="updateTaskInfo"
                filterable
                v-model="detail.priority"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in urgencyList"
                  :key="item.status"
                  :label="item.name"
                  :value="item.status"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="task-info">
            <div class="info-item user-box">
              <el-form label-width="60px">
                <el-form-item label="执行人">
                  <el-select
                    size="mini"
                    @change="changeResponsible"
                    multiple
                    collapse-tags
                    filterable
                    v-model="detail.people"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.user_id"
                      :label="item.username"
                      :value="item.user_id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="info-item time-box">
              <el-form label-width="60px">
                <el-form-item label="时间">
                  <el-date-picker
                    @change="changeTime"
                    size="mini"
                    v-model="detail.timeArr"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :clearable="true"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-form label-width="90px">
            <el-form-item :label="'进度(' + detail.process + '%)'">
              <el-slider
                @change="changeProcess"
                v-model="detail.process"
                :format-tooltip="formatTip"
                show-input
              ></el-slider>
            </el-form-item>
          </el-form>

          <div class="desc-box">
            <el-form label-width="60px">
              <el-form-item label="描述">
                <editor-detail
                  id="editDetail"
                  :contentDefault="detail.desc"
                  ref="editorRef"
                  placeholder="请输入描述"
                  @blurEditor="blurEditor"
                ></editor-detail>
                <el-button type="primary" size="mini" @click="save"
                  >保存描述</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <el-form label-width="60px">
            <el-form-item label="附件">
              <upload @upload="upload" v-show="detail.file_arr.length < 3">
                <i class="iconfont icon-shangchuantupian task-file-icon"></i>
              </upload>
              <div class="file-tip">
                最多可以上传3个文件，每个附件大小不得超过5M,附件支持zip、rar、doc、xls格式
              </div>
              <div class="file-box">
                <span
                  class="file-item"
                  v-for="(file, fileIndex) in detail.file_arr"
                  :key="fileIndex"
                >
                  <a :href="file.url" target="_blank">{{ file.file_name }}</a>
                  <i
                    class="el-icon-error close-file"
                    @click="delFile(fileIndex)"
                  ></i>
                </span>
              </div>
            </el-form-item>
          </el-form>

          <child-task
            :taskId="taskId"
            :userList="userList"
            ref="childTaskRef"
            :firstResponsibleId="firstResponsibleId"
          ></child-task>
        </div>

        <div class="right">
          <task-log ref="taskLogRef" :targetId="taskId"></task-log>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ChildTask from './ChildTask'
import { getTaskDetail, updateTaskInfo } from '@/api/targetOkr'
import EditorDetail from '@/components/common/Editor'
import Upload from '_c/common/Upload'
import TaskLog from './TaskLog'
export default {
  props: {
    dialog: Boolean,
    taskId: [String, Number],
    userList: Array
  },
  data() {
    return {
      detailLoading: false,
      detail: {
        task_id: '',
        title: '',
        start_at: '', //开始时间
        deadline: '', //结束时间
        task_status: 0, //0未开始 1进行中 2完成
        desc: '', //详细内容
        priority: '', //0 低 1中 2高 3紧急
        people: [], //user_id   username
        timeArr: [],
        process: 0, //进度
        kr_id: '',
        file_arr: [] //附件上传
      },
      processStatusList: [
        { status: 0, name: '未开始' },
        { status: 1, name: '进行中' },
        { status: 2, name: '完成' }
      ],
      urgencyList: [
        { status: 0, name: '低' },
        { status: 1, name: '中' },
        { status: 2, name: '高' },
        { status: 3, name: '紧急' }
      ],
      snpaProcess: 0,
      firstResponsibleId: '' //默认责任人id
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.getTaskDetail()
        this.$nextTick(() => {
          this.$refs.childTaskRef.getSonList()
          this.$refs.taskLogRef.initLog()
        })
      }
    }
  },
  methods: {
    upload(data) {
      this.detail.file_arr.push(data)
      this.updateTaskInfo()
    },
    delFile(i) {
      this.detail.file_arr.splice(i, 1)
      this.updateTaskInfo()
    },
    async save() {
      this.detailLoading = true
      this.detail.desc = this.$refs.editorRef.getHtml()
      await this.updateTaskInfo('save')
      this.detailLoading = false
    },
    changeResponsible() {
      // if (this.detail.people.length > 0) {
      //   this.firstResponsibleId = this.detail.people[0];
      // }
      this.updateTaskInfo()
    },
    changeStatus() {
      if (this.detail.task_status == 2) {
        this.detail.process = 100
      }
      this.updateTaskInfo()
    },
    changeTime() {
      if (this.detail.timeArr == null) {
        this._message('请选择日期', 'warning')
        return
      }
      this.detail.start_at = this.detail.timeArr[0]
      this.detail.deadline = this.detail.timeArr[1]
      this.updateTaskInfo()
    },
    blurEditor(cont) {
      this.detail.desc = cont
      this.updateTaskInfo()
    },
    changeProcess() {
      if (this.detail.process >= 100) {
        this.detail.task_status = 2
      } else {
        this.detail.task_status = 1
      }
      this.updateTaskInfo()
    },
    formatTip(e) {
      return `当前进度: ${e} %`
    },
    async updateTaskInfo(txt) {
      if (!this.detail.title.trim().length) {
        this._message('任务标题不能为空', 'warning')
        return
      } else if (this.detail.people.length <= 0) {
        this._message('执行人不能为空', 'warning')
        return
      }
      try {
        this.detail.desc = this.$refs.editorRef.getHtml()
        await updateTaskInfo(this.detail)
        if (txt == 'save') {
          this._message('保存成功', 'success')
        }
        this.snpaProcess = this.detail.process
        this.$refs.taskLogRef.initLog()
        this.$emit('updateOk')
      } catch (error) {
        this.detail.process = this.snpaProcess
        this._message(error)
      }
    },
    async getTaskDetail() {
      this.detailLoading = true
      this.detail.timeArr = []

      try {
        let { data } = await getTaskDetail({ task_id: this.taskId })
        Object.assign(this.detail, data)
        this.detail.timeArr.push(this.detail.start_at)
        this.detail.timeArr.push(this.detail.deadline)
        this.snpaProcess = this.detail.process
        if (this.detail.people.length > 0) {
          this.firstResponsibleId = this.detail.people[0]
        }
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    },
    handleClose() {
      // this.$refs.editorRef.clearHtml();
      // this.detail.desc = "";
      this.$emit('update:dialog', false)
    }
  },
  components: {
    ChildTask,
    EditorDetail,
    TaskLog,
    Upload
  }
}
</script>

<style lang="scss" scoped>
.detail-box {
  display: flex;
  .left {
    flex: 1;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid #f1f1f1;
    .task-title {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f1f1f1;
      margin-bottom: 10px;
      .input-box {
        flex: 1;
        ::v-deep .el-input__inner {
          font-size: 18px;
          border: 1px solid #fff;
        }
        &:hover {
          ::v-deep .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
      .status-box {
        width: 90px;
        margin-left: 15px;
      }
      .task-status {
        ::v-deep .el-input__inner {
          border: 1px solid #fff;
        }
        &:hover {
          ::v-deep .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
      .urgency-status {
        ::v-deep .el-input__inner {
          border: 1px solid #fff;
        }
        &:hover {
          ::v-deep .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
    }
    .task-info {
      display: flex;
      justify-content: space-between;
      .info-item {
        width: 380px;
        ::v-deep .el-range-editor.el-input__inner {
          width: 320px;
        }
      }
      .user-box {
        ::v-deep .el-input__inner {
          border: 1px solid #fff;
        }
        ::v-deep .el-input__icon {
          display: none;
        }
        &:hover {
          ::v-deep .el-input__icon {
            display: block;
          }
          ::v-deep .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
      .time-box {
        ::v-deep .el-input__inner {
          border: 1px solid #fff;
        }
        ::v-deep .el-range__close-icon {
          display: none;
        }
        &:hover {
          ::v-deep .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
    }
    .desc-box {
      ::v-deep .el-textarea__inner {
        border: 1px solid #fff;
      }
      &:hover {
        ::v-deep .el-textarea__inner {
          border: 1px solid #dcdfe6;
        }
      }
    }
    .file-box {
      .file-item {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 10px;
      }
    }
    .task-file-icon {
      font-size: 35px;
    }
  }
  .right {
    width: 400px;
  }
}
</style>
