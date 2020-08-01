<template>
  <div class="wrap">
    <div class="item" v-for="(item, index) in tableData" :key="index">
      <div class="title">
        {{ item.project_name }}
      </div>
      <div class="mains">
        <div class="main" v-for="(item2, index2) in item.child" :key="index2">
          <div class="subtitle">
            <i class="iconfont el-icon-paperclip"></i>
            {{ item2.create_name }}提交的“{{ item2.title }}”流程
          </div>
          <!-- <div class="edit">
            <el-input
              placeholder="退仓换标产品明细表格，上传给到仓库管理."
              size="mini"
            >
            </el-input>
          </div> -->
          <div class="status">
            <i class="iconfont el-icon-watch-1"></i>
            {{ item2.task_status_name }}
          </div>
          <div class="peoples">
            <div
              class="peopleItem"
              v-for="(item3, index3) in item2.nameArr"
              :key="index3"
            >
              {{ item3.substr(1) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 300px;
    border: 1px solid #ccc;
    margin: 0 5px;
    font-size: 13px;
    border-radius: 5px;
    margin-bottom: 10px;
    .title {
      background: #f1f1f1;
      line-height: 45px;
      padding: 0 5px;
      border-bottom: 1px solid #ccc;
    }
    .mains {
      padding: 5px;
      max-height: 250px;
      height: 250px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 8px;
        height: 13px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #d9d9d9;
      }

      &::-webkit-scrollbar-track {
        /* -webkit-box-shadow: inset 0 0 5px #fff; */
        border-radius: 0;
        /* background: rgba(0, 121, 71, 0.1); */
        background: none;
      }
      .main {
        padding: 0 5px;
        margin-bottom: 5px;
        border: 1px solid #ccc;
        .subtitle {
          line-height: 30px;
          color: #c8c8c8;
          i {
            color: #526ecc;
          }
        }
        .edit {
          ::v-deep .el-input__inner {
            border: 1px solid rgba(0, 0, 0, 0);
            font-size: 13px;
            padding: 0;
            // text-align: center;
            &:hover {
              color: #409eff;
            }
          }
          &:hover {
            ::v-deep .el-input__inner {
              border: 1px solid #dcdfe6;
            }
          }
        }
        .status {
          color: rgba(245, 154, 35, 1);
          margin: 3px 0;
        }
        .peoples {
          display: flex;
          flex-wrap: wrap;
          margin: 5px 0;
          .peopleItem {
            background-color: #526ecc;
            font-size: 12px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            color: #fff;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
