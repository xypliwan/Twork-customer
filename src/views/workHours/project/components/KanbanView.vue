<template>
  <div class="wrap">
    <div class="item" v-for="(item, index) in tableData" :key="index">
      <div class="title">
        {{ item.title }}
      </div>
      <div class="main">
        <div class="subtitle">
          <i class="iconfont el-icon-paperclip"></i>
          {{ item.create_name }}提交的“{{ item.title }}”流程
        </div>
        <div class="status">
          <i class="iconfont el-icon-watch-1"></i>
          {{ item.task_status_name }}
        </div>
        <div class="peoples">
          <div
            class="peopleItem"
            v-for="(item2, index2) in item.nameArr"
            :key="index2"
          >
            {{ item2.substr(1) }}
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
  watch: {
    tableData() {
      this.tableData.map(item => {
        item.nameArr = item.charge_name.split(',')
      })
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

    .main {
      padding: 0 5px;
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
</style>
