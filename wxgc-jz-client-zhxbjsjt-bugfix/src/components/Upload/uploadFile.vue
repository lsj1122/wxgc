<template>
  <el-upload
    :class="className"
    ref="upload"
    action=""
    v-bind="$attrs"
    v-on="$listeners"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-change="handleChange"
    :list-type="listType"
    :file-list="fileList"
    :multiple="multiple"
    :limit="limit"
    :auto-upload="false"
  >
    <!--:auto-upload 是否在选取文件后立即进行上传 -->
    <!--:file-list 上传的文件列表 -->
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <div slot="tip" class="el-upload__tip">
      只能上传{{ fileType }}文件，且不超过{{ maxSize }}M
    </div>
  </el-upload>
</template>

<script>
export default {
  props: {
    fileType: "jpg/png",
    maxSize: "",
    className: "",
    listType: "text",
    limit: {
      default: 1,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limitType: "", //显示特定的类型，如mp3
    fileListRe: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  name: "uploadFile",
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    fileListRe(newName, oldName) {
      // ...
      console.log("图片数据", oldName);
      if (newName) {
        console.log('this.fileListRe',this.fileListRe)
        this.fileList = this.fileListRe;
      }
    },
    deep: true,
    immediate: true,
  },
  methods: {
    clearData() {
      // 清空上传的文件列表
      this.fileList = [];
    },
    handleRemove(file, fileList) {
      //文件列表移除文件时的钩子
      this.$emit("change", file, fileList); //调用父组件的 change方法
    },
    addFile(file){
      this.fileList.push(file);
    },
    handlePreview(file) {
      //点击文件列表中已上传的文件时的钩子
    },
    handleChange(file, fileList) {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$message({
          type: "error",
          message: "文件过大,无法上传!",
        });
        this.fileList = [];
      } else {
        if (this.limitType == "mp3") {
          var testmsg = fileList[0].name.substring(
            file.name.lastIndexOf(".") + 1
          );
          if (testmsg != "mp3") {
            this.$message({
              message: "上传文件只能是mp3格式！",
              type: "error",
            });
            this.clearData();
            return;
          }
        }

        this.$emit("change", file, fileList, this.limitType);
      }
    },
  },
};
</script>

<style scoped>
</style>
