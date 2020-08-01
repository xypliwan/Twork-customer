<template>
  <div>
    <el-dialog
      :visible.sync="addGroupsDialogVisible"
      :show-close="false"
      title="新建分组"
      width="50%"
    >
      <el-input type="input" placeholder="输入分组名称" v-model="value">
      </el-input>
      <el-input
        type="textarea"
        class="textarea"
        :rows="8"
        placeholder="输入标签，一行一个"
        v-model="textarea"
      >
      </el-input>
      <div class="peoples">
        <div class="iconWrap"><i class="el-icon-s-custom"></i>可见人员：</div>
        <div class="items">
          <el-tag size="mini">标签一</el-tag>
          <el-tag size="mini">标签一</el-tag>
          <el-tag size="mini">标签一</el-tag>
        </div>
        <div class="add" @click="duVisible = true">
          <i class="el-icon-plus" />
          添加
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">保存分组</el-button>
        <el-button @click="cancle()">取 消</el-button>
      </span>
    </el-dialog>
    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateUser"
      :originalData="selectObj"
      :canSelectDepartment="canSelectDepartment"
      :canSelectUser="canSelectUser"
    ></select-departments-and-people>
  </div>
</template>

<script>
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
export default {
  data() {
    return {
      value: null,
      textarea: '',
      duVisible: false,
      selectObj: {
        department: [],
        user: []
      },
      canSelectDepartment: false,
      canSelectUser: true
    }
  },
  props: {
    addGroupsDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SelectDepartmentsAndPeople
  },
  created() {},
  watch: {},
  methods: {
    updateUser(obj) {
      console.log(obj)
      // Object.assign(this.ruleForm.responsible, obj)
      //   this.ruleForm.responsible.name_txt = obj.nameArr.join('、')
    },
    cancle() {
      this.$emit('cancleGroupsDialog')
    },
    save() {
      console.log(this.textarea)
      this.$emit('saveGroupsDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea {
  margin-top: 20px;
}
.peoples {
  display: flex;
  align-items: center;
  .iconWrap {
    line-height: 35px;
    i {
      color: #526ecc;
      font-size: 20px;
    }
  }
  .items {
    display: flex;
    align-items: center;
    .el-tag {
      margin-right: 5px;
    }
  }
  .add {
    padding: 0 10px;
    line-height: 20px;
    height: 20px;
    border: 1px dotted #526ecc;
    color: #526ecc;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
