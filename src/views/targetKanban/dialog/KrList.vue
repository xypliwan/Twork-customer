<template>
  <div class="create-wrapper">
    <div class="create-box create-box-bg">
      <div class="ipt">关键结果( Key Result )</div>
      <div class="responsible-box">责任人</div>
      <div class="rank-box">信心指数</div>
      <div class="create-btn">操作</div>
    </div>
    <div style="position: relative;">
      <div class="create-box" v-for="(item, i) in tableData" :key="i">
        <div class="ipt">
          <el-input
            type="text"
            @keyup.enter.native="createKr(i)"
            v-model="item.kr_name"
            placeholder="快速创建关键结果，回车即可"
            :disabled="okrFlg == '1'"
          />
        </div>
        <div class="responsible-box">
          <el-select
            :disabled="okrFlg == '1'"
            size="mini"
            filterable
            v-model="item.user_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.username"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </div>
        <div class="rank-box">
          <div class="confidence-box">
            <i class="iconfont icon-favorite"></i>
            <div class="confidence-it">
              <el-select
                :disabled="okrFlg == '1'"
                size="mini"
                filterable
                v-model="item.score"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in confidenceList"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
            分
          </div>
        </div>
        <div class="create-btn">
          <el-link
            :disabled="okrFlg == '1'"
            type="primary"
            @click="delKrItem(i)"
            v-if="tableData.length > 1 || i !== 0"
            >删除</el-link
          >
          <span v-if="tableData.length > 1 || i !== 0">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-tooltip
            class="item"
            effect="dark"
            content="在当前KR下面新增一条"
            placement="top"
          >
            <el-link
              type="primary"
              @click="createKr(i)"
              :disabled="okrFlg == '1'"
              >创建</el-link
            >
          </el-tooltip>
        </div>
      </div>
      <five-step></five-step>
    </div>
  </div>
</template>

<script>
import FiveStep from '_c/guide/FiveStep'
export default {
  props: {
    tableData: Array,
    userList: Array,
    okrFlg: String
  },
  data() {
    return {
      createInfo: {},
      confidenceList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //信息指数
    }
  },
  methods: {
    createKr(i) {
      this.$emit('insetKrItem', i)
    },
    delKrItem(i) {
      this.$emit('delKrItem', i)
    }
  },
  components: {
    FiveStep
  }
}
</script>

<style lang="scss" scoped>
.create-box-bg {
  background: #f7f7f7;
  padding-left: 10px;
  padding-right: 10px;
}
.create-box {
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #f1f1f1;
  .ipt {
    flex: 1;
    ::v-deep .el-input__inner {
      border: none;
    }
  }
  .responsible-box {
    width: 140px;
    padding: 0 10px;
    line-height: 36px;
  }
  .rank-box {
    width: 190px;
    padding: 0 10px;
    line-height: 36px;
    ::v-deep .el-rate {
      margin-top: 10px;
    }
  }
  .create-btn {
    width: 115px;
    padding: 0 10px;
    text-align: center;
  }
}
.confidence-box {
  display: flex;
  align-items: center;
  width: 120px;
  font-size: 13px;
  .icon-favorite {
    color: #f6af42;
    font-size: 17px;
  }
  .confidence-it {
    width: 70px;
    margin: 0 5px;
  }
}
</style>
