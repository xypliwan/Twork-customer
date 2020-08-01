<template>
  <div class="form-box">
    <title-line title="汇报内容"></title-line>
    <div class="form-item" v-for="item in detail.fromat" :key="item.key">
      <div class="form-title">
        <span class="red" v-if="item.verify">*</span>
        {{ item.name }}
      </div>
      <!--  数字输入框 -->
      <div class="conts" v-if="item.type == 'num'">
        <el-input
          size="small"
          type="number"
          v-model="item.value"
          :placeholder="item.placeholder"
        ></el-input>
      </div>

      <!-- 多行输入框 -->
      <div class="conts" v-if="item.type == 'textarea'">
        <textarea
          class="textarea-dom"
          ref="ttl"
          type="textarea"
          v-model="item.realValue"
          :placeholder="item.placeholder"
          id=""
          :data-key="item.key"
          cols="30"
          autocomplete="off"
          rows="10"
          @focus="textAreaKey = item.key"
        ></textarea>
        <!-- </el-input> -->
      </div>

      <!-- 多选框 6 -->
      <div class="conts" v-if="item.type == 'selects'">
        <el-select v-model="item.value" multiple placeholder="请选择">
          <el-option
            size="small"
            v-for="(item, oi) in item.options"
            :key="oi"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <!-- 日期 7-->
      <div class="conts" v-if="item.type == 'datetime'">
        <el-date-picker
          size="small"
          v-model="item.value"
          type="datetime"
          :format="item.format"
          :value-format="item.format"
          :placeholder="item.placeholder"
        ></el-date-picker>
      </div>

      <!-- 附件 -->
      <div class="conts files-cont" v-if="item.type == 'accessory'">
        <common-upload
          :limit="50"
          :formKey="item.key"
          :list="item.value"
          desc=""
          @deleteFile="
            info => {
              deleteFile(index, item.value)
            }
          "
          @successOk="
            info => {
              successOk(info, item.value)
            }
          "
        ></common-upload>
      </div>
    </div>
  </div>
</template>
<script>
import CommonUpload from '_c/common/CommonUpload'
import TitleLine from '_c/common/TitleLine'
export default {
  props: {
    detail: Object
  },
  data() {
    return {
      textAreaKey: ''
    }
  },
  watch: {
    textAreaKey() {
      this.$emit('uodateTextAreaKey', this.textAreaKey)
    }
  },
  methods: {
    async focusSetVal(txt) {
      /* eslint-disable */
      let item = this.detail.fromat.find(el => el.key == this.textAreaKey)
      let itemIndex = null
      this.$refs.ttl.forEach((el, i) => {
        let dataKey = el.getAttribute('data-key')
        if (this.textAreaKey == dataKey) {
          itemIndex = i
        }
      })

      let myField = this.$refs.ttl[itemIndex]
      let myValue = item.value

      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        item.realValue =
          myField.value.substring(0, startPos) +
          txt +
          myField.value.substring(endPos, myField.value.length + txt.length)
        await this.$nextTick() // 必须
        myField.focus()
        myField.setSelectionRange(
          endPos + item.value.length + txt.length,
          endPos + item.value.length + txt.length
        )
      } else {
        item.realValue += myValue + txt.length
      }
      /* eslint-disable */
    },
    deleteFile(index, list) {
      list.splice(index, 1)
    },
    successOk(info, list) {
      list.push(info)
    }
  },
  components: {
    CommonUpload,
    TitleLine
  }
}
</script>
<style lang="scss" scoped>
.form-box {
  .form-item {
    padding: 15px 0px;
    border-radius: 3px;
    margin-bottom: 10px;
    .form-title {
      font-size: 15px;
      color: #333;
      margin-bottom: 10px;
      .red {
        color: red;
      }
    }
    .files-cont {
      display: inline-block;
    }
    .textarea-dom {
      padding: 10px 15px;
      border: 1px solid #dcdfe6;
      width: 100%;
      outline: none;
    }
  }
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type='number'] {
  -moz-appearance: textfield;
}
</style>
