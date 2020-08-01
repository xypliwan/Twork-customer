<template>
  <div class="form-item">
    <el-timeline>
      <template v-for="(item, index) in detailData.step">
        <el-timeline-item
          :timestamp="item.step_type_name"
          placement="top"
          :key="index"
        >
          <span class="timestamp">{{ item.updated_at }}</span>
          <div slot="dot">
            <div
              class="circle"
              :class="{ 'circle-active': item.step_status != 0 }"
            >
              <span v-if="item.step_type == 0">
                {{ detailData.create_user_name | nameFilter }}
              </span>
              <span v-if="item.step_type == 1">
                {{ item.people | nameFilter }}
              </span>
              <i
                v-if="item.step_type == 2"
                class="circle-icon el-icon-s-promotion"
              ></i>
            </div>
          </div>
          <div>
            <span class="color9" v-show="item.step_type == 0">
              {{ detailData.create_user_name }}
            </span>
            <span v-for="(el, i) in item.people" :key="i">
              <el-tag
                style="margin-right:10px"
                type="success"
                size="small"
                v-show="item.step_type == 2"
                >{{ el.username }}</el-tag
              >
              <span class="color9" v-show="item.step_type == 1">
                {{ el.username }}
                （
                <span :class="{ red: item.step_status == 3 }">
                  {{ item.step_status_name }} </span
                >）
                <!-- <span :class="{red:item.step_status==3}">{{getMappingVal(listStatus, 'id', item.step_status, 'step_status_name')}}</span>） -->
              </span>
            </span>
            <div class="comment">
              <p v-show="item.comment" style="color:#999">
                <span class="theme-color">处理意见：</span>
                {{ item.comment }}
              </p>
              <div
                v-for="(el, i) in item.reply"
                :key="i"
                style="margin-top: 5px;"
              >
                <span class="theme-color">{{ el.username }} &nbsp;</span>
                <span class="gray" style="color:#333">添加了评论</span>
                <p class="color9" style="color:#999">“{{ el.content }}”</p>
                <div v-for="(fileItem, fileIndex) in el.file" :key="fileIndex">
                  <a
                    :download="fileItem.file_name"
                    :href="fileItem.url"
                    target="_blank"
                    >{{ fileItem.file_name }}</a
                  >
                  <span
                    v-if="
                      ['xls', 'xlsx', 'doc', 'docx', 'ppt'].includes(
                        fileItem.file_name.substring(
                          fileItem.file_name.lastIndexOf('.') + 1
                        )
                      )
                    "
                    class="preview-excel"
                    @click="openReview(fileItem)"
                    >预览</span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- v-if="item.can_add_check==1" -->
          <div class="matters-box" v-if="item.step_type == 1">
            <div>
              <el-popover
                placement="right-start"
                title="添加处理事项"
                width="400"
                trigger="click"
                v-model="item.visible"
              >
                <div class="popover-content">
                  <el-input
                    style="width:100%"
                    size="mini"
                    v-model="item.addMatters.check_name"
                    placeholder="请输入事项名"
                    clearable
                  ></el-input>
                  <el-date-picker
                    style="width:100%"
                    v-model="item.addMatters.time"
                    size="mini"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="预计开始日期"
                    end-placeholder="预计结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                  <div style="margin-top: 10px;text-align:center;">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="addMatter(item)"
                      >确认</el-button
                    >
                  </div>
                </div>
                <!-- v-if="item.can_deal_check==1" -->
                <el-button
                  v-if="item.can_deal_check == 1 && item.step_status == 1"
                  slot="reference"
                  type="text"
                  size="small"
                  class="el-icon-plus"
                  >快速创建</el-button
                >
              </el-popover>
            </div>
            <div class="step" v-show="item.check.length > 0">
              <div class="li-flex">
                <span class="matters">处理事项</span>
                <span class="times">预计开始/结束</span>
                <span class="dels">操作</span>
              </div>
              <ul ref="processMatters" class>
                <li class="li-flex" v-for="(el, i) in item.check" :key="i">
                  <span class="matters text-hidden">
                    <el-checkbox
                      v-model="el.check_status"
                      :disabled="item.can_deal_check != 1"
                      true-label="1"
                      false-label="0"
                      @change="completeCheck(el)"
                    ></el-checkbox
                    >&nbsp;
                    <el-tooltip
                      class="item gray"
                      effect="dark"
                      :content="el.check_name"
                      placement="top"
                    >
                      <span>{{ el.check_name }}</span>
                    </el-tooltip>
                    <!-- 附件 -->
                    <div
                      v-if="el.file && el.file.length > 0"
                      style="margin-bottom:5px;"
                    >
                      <div
                        class="files-item"
                        v-for="(img, j) in el.file"
                        :key="j"
                      >
                        <a :href="img.url" target="_brank">{{ img.name }}</a>
                      </div>
                    </div>
                  </span>
                  <span class="times">
                    <el-date-picker
                      :disabled="
                        item.can_deal_check != 1 || el.check_status == 1
                      "
                      style="width:100%"
                      v-model="el.time"
                      size="mini"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始"
                      end-placeholder="结束"
                      format="MM/dd"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="timeChange(item, el)"
                      :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                  </span>
                  <span class="del">
                    <el-button
                      v-if="item.can_deal_check == 1 && el.check_status != 1"
                      type="text"
                      size="mini"
                      @click="delCheck(item, el, i)"
                      >删除</el-button
                    >
                    <!-- <span v-if="item.can_deal_check==1 && el.check_status!=1" class="el-icon-remove-outline red pointer" @click="delCheck(item,el,i)"></span> -->
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </el-timeline-item>
      </template>
    </el-timeline>
    <preview-excel
      :previewVisible.sync="previewVisible"
      :file="file"
    ></preview-excel>
  </div>
</template>
<script>
import PreviewExcel from './PreviewExcel'
export default {
  components: {
    PreviewExcel
  },
  props: {
    detailData: Object
  },
  data() {
    return {
      previewVisible: false,
      file: {}
    }
  },
  methods: {
    openReview(fileItem) {
      console.log(
        fileItem.file_name.substring(fileItem.file_name.lastIndexOf('.') + 1)
      )
      this.file = fileItem
      this.previewVisible = true
    },
    completeCheck(el) {
      this.$emit('completeCheck', el)
    },
    timeChange(item, el) {
      this.$emit('timeChange', { item, el })
    },
    delCheck(item, el, i) {
      this.$emit('delCheck', { item, el, i })
    },
    addMatter(item) {
      this.$emit('addMatter', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.form-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  .form-item-content {
    max-height: 210px;
    overflow: hidden;
    &.form-item-active {
      max-height: unset;
      height: auto;
    }
  }
  .richText {
    line-height: 26px;
    color: #999;
  }
  .comment {
    margin-top: 10px;
    line-height: 18px;
    .preview-excel {
      cursor: pointer;
      color: #ffa500;
      margin-left: 10px;
    }
  }
  .timestamp {
    float: right;
    color: #999;
    margin-top: -20px;
  }
  .matters-box {
    padding: 10px;
    border-radius: 3px;
  }
  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -5%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #e4e7ed;
  }
  .circle-active {
    background-color: #586fcf;
  }
  .circle-icon {
    font-size: 24px;
  }
  .richText {
    line-height: 18px;
  }
  .el-popover {
    text-align: left;
  }
  .popover-content {
    padding: 15px 10px;
    .el-input {
      margin-bottom: 10px;
    }
  }
  .li-flex {
    padding: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    .matters {
      flex: 1;
      margin-right: 20px;
      .files-item {
        height: 22px;
        line-height: 22px;
      }
    }
    .times {
      text-align: center;
      width: 140px;
      margin-right: 5px;
    }
    .dels {
      width: 60px;
      text-align: center;
    }
    .del {
      width: 60px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .approval-process {
    // max-height: 400px;
    overflow: hidden;
    transition: all 0.5s ease;
    li:hover {
      background: #f1f9eb;
    }
  }
}
::v-deep .el-timeline-item__timestamp {
  color: #333;
  font-weight: bold;
  font-size: 14px;
}
::v-deep .atwho-wrap {
  width: 100%;
}
</style>
