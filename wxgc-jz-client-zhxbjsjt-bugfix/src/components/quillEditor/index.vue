<template>
  <div>
    <quill-editor class="ql-editor" @change="onEditorChange($event)"
                  id="desc" ref="quill" v-model="desc" :options="editorOption">
    </quill-editor>
  </div>
</template>

<script>
import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import resizeImage from 'quill-image-resize-module' // 图片缩放组件引用
import {ImageDrop} from 'quill-image-drop-module'; // 图片拖动组件引用


Quill.register('modules/imageDrop', ImageDrop); // 图片拖动
Quill.register('modules/resizeImage ', resizeImage) // 图片大小
Quill.register('modules/ImageExtend', ImageExtend)  //图片上传
export default {
  components: {
    quillEditor,
    Quill,
  },
  data() {
    return {
      desc: '',
      editorOption: {
        placeholder: '此处输入内容',
        modules: {
          imageDrop: true,      //图片拖拽
          ImageExtend: {
            loading: true,
            name: 'file',//图片参数名
            size: 5, // 可选参数 图片大小，单位为M，1M = 1024kb
            action: '/wxgc-api/wxgc/plus/exam_question/upload',//上传的服务器地址，如果action为空，则采用base64插入图片
            // response 为一个函数，用来获取服务器返回的具体图片地址
            response: res => {
              return res.data.aliyunUrl
            },
            headers: xhr => {
              // 上传图片请求需要携带token的 在xhr.setRequestHeader中设置，这里我的token存放在sessionStorage中
              // xhr.setRequestHeader("token", window.sessionStorage.getItem('token'))
            },
            // 可选参数 设置请求头部
            sizeError: (err) => {
              this.$message.warning("仅支持上传图片,且图片大小不超过5M")
            }, // 图片超过大小的回调
            start: () => {
            }, // 可选参数 自定义开始上传触发事件
            end: () => {
            }, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            error: () => {
            }, // 可选参数 上传失败触发的事件
            success: () => {
              this.$message.success("图片上传成功")
            }, // 可选参数  上传成功触发的事件
            change: (xhr, formData) => {
              // xhr.setRequestHeader('myHeader','myValue')
              // formData.append('token', 'myToken')
            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          // 如果不上传图片到服务器，此处不必配置
          toolbar: {
            // container为工具栏，此次引入了全部工具栏，也可自行配置
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{header: 1}, {header: 2}],
              [{list: "ordered"}, {list: "bullet"}],
              [{script: "sub"}, {script: "super"}],
              [{indent: "-1"}, {indent: "+1"}],
              [{direction: "rtl"}],
              [{size: ["small", false, "large", "huge"]}],
              [{header: [1, 2, 3, 4, 5, 6, false]}],
              [{color: []}, {background: []}],
              [{font: []}],
              [{align: []}],
              ["image"]
            ],
            // 上传成功，回显图片（会进入如上面ImageExtend的各过程，返回<img src="http://xx.xx.xx.xx:xxxx/file/xxx.jpg">）
            handlers: {
              image: function () {
                // 劫持原来的图片点击按钮事件
                QuillWatch.emit(this.quill.id)
              }
            }
          },
          imageResize: {          //放大缩小
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
        }
      },
    }
  },
  mounted() {
  },
  methods: {
    // quill的change事件
    onEditorChange(e) {
      if (e.html) {
        this.$emit("change", e.html)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .ql-editor {
  padding: 0;

  .ql-toolbar.ql-snow {
    border: 1px solid #DCDFE6;
    border-radius: 4px 4px 0 0;
  }

  .ql-container.ql-snow {
    border: 1px solid #DCDFE6;
    border-top: none;
    border-radius: 0 0 4px 4px;
  }

  .ql-container {
    height: 300px;
  }
}
</style>
