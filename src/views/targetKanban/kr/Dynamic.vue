<template>
  <div>
    <el-dialog
      title="关键结果动态"
      :append-to-body="true"
      top="50px"
      :visible.sync="dialog"
      width="1100px"
      :before-close="handleClose"
    >
      <div class="log-box-wrapper">
        <div class="left">
          <title-line title="指定关键结果查看"></title-line>
          <kr-list-static
            :krIdToDynamic="krIdToDynamic"
            :targetId="targetId"
            ref="krStaticRef"
            @changeKrId="changeKrId"
          ></kr-list-static>
        </div>
        <div class="right">
          <kr-log :krId="krId" ref="logRef" :targetId="targetId"></kr-log>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KrLog from './KrLog'
import KrListStatic from './KrListStatic'
import TitleLine from '_c/common/TitleLine'
export default {
  props: {
    targetId: [String, Number],
    dialog: Boolean,
    krIdToDynamic: [String, Number] //动态传过来的kr id
  },
  data() {
    return {
      krId: ''
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.$nextTick(async () => {
          await this.$refs.krStaticRef.getKrLists()
          this.$refs.logRef.initLog()
        })

        // this.logList = [];
        // this.params.page = 1;
        // this.getActionLog();
        // this.$nextTick(() => {
        //   this.$refs.krStaticRef.getKrLists();
        //   this.$refs.chartWeekRef.getTargetChartList();
        // });
      }
    }
  },
  methods: {
    changeKrId(krId) {
      this.krId = krId
    },
    handleClose() {
      this.$emit('update:dialog', false)
    }
  },
  components: {
    KrLog,
    KrListStatic,
    TitleLine
  }
}
</script>

<style lang="scss" scoped>
.log-box-wrapper {
  display: flex;
  .left {
    flex: 1;
  }
  .right {
    padding: 0 10px;
    width: 400px;
  }
}
</style>
