<template>
  <div class="quill_box" v-loading="editLoading">
    <quill-editor
      v-model="content"
      ref="myTextEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
      <div :id="id" slot="toolbar">
        <!-- <select class="ql-size">
          <option value="small">小</option>
          <option selected>常规</option>
          <option value="large">大</option>
          <option value="huge">特大</option>
        </select>-->

        <select class="ql-header" title="字体大小">
          <option selected value="false">常规</option>
          <option value="{false}">最大</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
          <option value="4">标题4</option>
          <option value="5">标题5</option>
          <option value="6">标题6</option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <span class="ql-formats" title="加粗">
          <button type="button" class="ql-bold"></button>
        </span>
        <span class="ql-formats" title="字体颜色">
          <select class="ql-color">
            <option selected="selected"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option value="#ffffff"></option>
            <option value="#facccc"></option>
            <option value="#ffebcc"></option>
            <option value="#ffffcc"></option>
            <option value="#cce8cc"></option>
            <option value="#cce0f5"></option>
            <option value="#ebd6ff"></option>
            <option value="#bbbbbb"></option>
            <option value="#f06666"></option>
            <option value="#ffc266"></option>
            <option value="#ffff66"></option>
            <option value="#66b966"></option>
            <option value="#66a3e0"></option>
            <option value="#c285ff"></option>
            <option value="#888888"></option>
            <option value="#a10000"></option>
            <option value="#b26b00"></option>
            <option value="#b2b200"></option>
            <option value="#006100"></option>
            <option value="#0047b2"></option>
            <option value="#6b24b2"></option>
            <option value="#444444"></option>
            <option value="#5c0000"></option>
            <option value="#663d00"></option>
            <option value="#666600"></option>
            <option value="#003700"></option>
            <option value="#002966"></option>
            <option value="#3d1466"></option>
          </select>
        </span>
        <span class="ql-formats" title="背景颜色">
          <select class="ql-background">
            <option value="#000000"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option selected="selected"></option>
            <option value="#facccc"></option>
            <option value="#ffebcc"></option>
            <option value="#ffffcc"></option>
            <option value="#cce8cc"></option>
            <option value="#cce0f5"></option>
            <option value="#ebd6ff"></option>
            <option value="#bbbbbb"></option>
            <option value="#f06666"></option>
            <option value="#ffc266"></option>
            <option value="#ffff66"></option>
            <option value="#66b966"></option>
            <option value="#66a3e0"></option>
            <option value="#c285ff"></option>
            <option value="#888888"></option>
            <option value="#a10000"></option>
            <option value="#b26b00"></option>
            <option value="#b2b200"></option>
            <option value="#006100"></option>
            <option value="#0047b2"></option>
            <option value="#6b24b2"></option>
            <option value="#444444"></option>
            <option value="#5c0000"></option>
            <option value="#663d00"></option>
            <option value="#666600"></option>
            <option value="#003700"></option>
            <option value="#002966"></option>
            <option value="#3d1466"></option>
          </select>
        </span>
        <span class="ql-formats" title="斜体">
          <button type="button" class="ql-italic"></button>
        </span>
        <span class="ql-formats" title="下划线">
          <button type="button" class="ql-underline"></button>
        </span>
        <span class="ql-formats" title="删除线">
          <button type="button" class="ql-strike"></button>
        </span>
        <span class="ql-formats" title="列表">
          <button type="button" class="ql-list" value="ordered"></button>
        </span>
        <span class="ql-formats" title="列表">
          <button type="button" class="ql-list" value="bullet"></button>
        </span>
        <span class="ql-formats" title="添加链接">
          <button type="button" class="ql-link"></button>
        </span>
        <span class="ql-formats" title="添加图片">
          <button type="button" @click="imgClick" style="outline:none">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="10" width="12" x="3" y="4" />
              <circle class="ql-fill" cx="6" cy="7" r="1" />
              <polyline
                class="ql-even ql-fill"
                points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"
              />
            </svg>
          </button>
        </span>
      </div>
    </quill-editor>
  </div>
</template>
<script>
import { commonUpload } from '@/api/common'

export default {
  props: {
    id: String,
    //默认内容
    contentDefault: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    /*上传图片的地址*/
    uploadUrl: {
      type: String,
      default: '/common/upload'
    },
    /*上传图片的file控件name*/
    fileName: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      content: '',
      editorOption: {
        placeholder: this.placeholder,
        modules: {
          toolbar: '#' + this.id
        }
      },
      isFocous: false,
      editLoading: false
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    }
  },
  watch: {
    contentDefault() {
      this.content = this.contentDefault
    }
  },
  mounted() {
    this.content = this.contentDefault
    document.addEventListener('paste', e => {
      this.pasteInfo(e)
    })
  },
  methods: {
    getHtml() {
      //获取html
      return this.content
    },
    clearHtml() {
      this.content = ''
    },
    onEditorBlur() {
      //失去焦点事件
      this.isFocous = false
      document.removeEventListener('paste', this.pasteInfo(2))
      this.$emit('blurEditor', this.content)
    },
    onEditorFocus() {
      //获得焦点事件
      this.isFocous = true
    },
    onEditorChange() {
      //内容改变事件
      this.$emit('getcode', this.content)
    },
    pasteInfo(e) {
      const cbd = e.clipboardData
      const ua = window.navigator.userAgent
      // 如果是 Safari 直接 return
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      if (
        cbd.items &&
        cbd.items.length === 2 &&
        cbd.items[0].kind === 'string' &&
        cbd.items[1].kind === 'file' &&
        cbd.types &&
        cbd.types.length === 2 &&
        cbd.types[0] === 'text/plain' &&
        cbd.types[1] === 'Files' &&
        ua.match(/Macintosh/i) &&
        Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
      ) {
        return
      }
      for (let i = 0; i < cbd.items.length; i++) {
        let item = cbd.items[i]
        if (item.kind == 'file') {
          // blob 就是从剪切板获得的文件，可以进行上传或其他操作
          const blob = item.getAsFile()
          if (blob.size === 0) {
            return
          }
          if (this.isFocous) {
            this.uploadFilePic(blob)
          }
        }
      }
    },

    /*点击上传图片按钮*/
    imgClick() {
      var input = document.createElement('input')
      input.type = 'file'
      input.name = this.fileName
      input.multiple = 'multiple'
      input.accept = 'image/jpeg,image/png,image/jpg,image/gif'
      input.onchange = this.onFileChange
      input.click()
    },
    /*选择上传图片切换*/
    onFileChange(e) {
      var fileInput = e.target
      if (fileInput.files.length === 0) {
        return
      }
      this.editor.focus()
      //多选时
      for (let i = 0; i < fileInput.files.length; i++) {
        this.uploadFilePic(fileInput.files[i])
      }
    },
    // 上传图片到服务器
    uploadFilePic(imgSource) {
      let formData = new FormData()
      formData.append('upload_file', imgSource)
      this.editLoading = true
      commonUpload(formData)
        .then(res => {
          this.editLoading = false
          // 获取光标所在位置
          let length = this.editor.getSelection().index
          this.editor.insertEmbed(length, 'image', res.data.url)
          // 调整光标到最后
          this.editor.setSelection(length + 1)

          //此处只为解决 粘贴时 SB火狐浏览器兼容，粘贴时会产生额外一张图片（base64形式）的处理
          try {
            let editorDom = this.editor.root
            let imgs = editorDom.getElementsByTagName('img')
            for (let i = 0; i < imgs.length; i++) {
              let content = imgs[i].attributes['src'].value
              if (content.search('base64') !== -1) {
                imgs[i].remove()
              }
            }
          } catch (error) {
            console.log(error)
          }
        })
        .catch(err => {
          this.editLoading = false
          console.log(err)
          // this._message(err);
        })
    }
  }
}
</script>

<style lang="scss">
.quill_box {
  select {
    outline: none;
  }
  .ql-toolbar.ql-snow {
    border-color: #dcdfe6;
  }
  .ql-container {
    height: 200px !important;
    border-color: #dcdfe6;
  }
  .ql-snow .ql-color-picker .ql-picker-label svg,
  .ql-snow .ql-icon-picker .ql-picker-label svg {
    position: relative;
    top: -6px;
  }
  .ql-color {
    padding-top: 3px;
  }
  .ql-background {
    padding-top: 2px;
  }
  .ql-size {
    height: 30px;
    line-height: 30px;
  }
}
</style>
