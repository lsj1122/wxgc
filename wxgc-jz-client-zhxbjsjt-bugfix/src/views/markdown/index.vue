<template>
  <!-- markdown页面 -->
  <div class="layout">
    <div class="left" :class="mymove == true ? 'mymove' : ''">
      <div class="btn" @click="collapse">
        <i class="el-icon-d-arrow-left" v-if="!mymove"></i>
        <i class="el-icon-d-arrow-right" v-else></i>
      </div>
      <p class="title">列表</p>
      <div class="list">
        <i
          class="el-icon-circle-plus-outline"
          title="添加"
          @click="addPage"
        ></i>
        <p
          @click="search(item, index)"
          :title="item.title"
          v-for="(item, index) in pageList"
          :key="index"
          :class="selectedIndex == index ? 'current' : ''"
        >
          <span>
            {{ item.title }}
          </span>
          <i
            class="el-icon-remove-outline"
            title="删除"
            @click="deletePage(item)"
          ></i>
        </p>
      </div>
    </div>
    <div class="right" :class="mymove == true ? 'right1' : ''">
      <mavonEditor
        :toolbars="toolbars"
        v-model="formData.content"
        @change="handleInput"
        @imgAdd="$imgAdd"
        ref="mavonEditor"
        style="height: 100%"
        @save="dialogVisible = true"
      />
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      title="标题"
      :before-close="close"
    >
      <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="标题名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import {
  selectAll,
  addMarkdown,
  deleteById,
  updateMarkdown,
  simpleUpload,
} from "./api.js";
export default {
  components: {
    mavonEditor,
  },
  data() {
    return {
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      formData: {
        content: "",
        id: null,
        title: null,
      },
      dialogVisible: false,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
      mymove: false,
      pageList: [],
      selectedIndex: 0,
    };
  },
  methods: {
    handleInput(value, render) {
      // console.log(value); // 输入的内容text
      // console.log(render); // 解析后的结果[html]
    },
    // 将图片上传至服务器，返回地址添加到url中
    $imgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append("file", $file);
      simpleUpload(formdata).then((res) => {
        if (res.code == "success") {
          this.$refs.mavonEditor.$img2Url(pos, res.data);
        }
      });
    },
    save() {
      if (this.formData.content == "") {
        this.$message.info("内容不允许为空");
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.formData.id == null) {
              addMarkdown({
                content: this.formData.content,
                title: this.formData.title,
              }).then((res) => {
                if (res.code == "success") {
                  this.close();
                  this.selectAll();
                  this.$message.success("新增成功");
                }
              });
            } else {
              updateMarkdown({
                content: this.formData.content,
                title: this.formData.title,
                id: this.formData.id,
              }).then((res) => {
                if (res.code == "success") {
                  this.close();
                  this.selectAll();
                  this.$message.success("编辑成功");
                }
              });
            }
          } else return;
        });
      }
    },
    // 关闭弹框
    close() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    // 查看列表详情
    search(item, index) {
      this.formData.content = item.content;
      this.formData.id = item.id;
      this.formData.title = item.title;
      this.selectedIndex = index;
    },
    collapse() {
      this.mymove = !this.mymove;
    },
    selectAll() {
      selectAll().then((res) => {
        if (res.code == "success") {
          this.pageList = res.data;
          if (this.pageList && this.pageList.length != 0) {
            this.formData = JSON.parse(JSON.stringify(this.pageList[0]));
          }
        }
      });
    },
    addPage() {
      this.formData.content = "";
      this.formData.id = null;
      this.formData.title = null;
      this.selectedIndex = -1;
    },
    deletePage(item) {
      this.$confirm("此操作将永久删除该列表, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteById(item.id).then((res) => {
          if (res.code == "success") {
            this.$message.success("删除成功");
            this.selectAll();
          }
        });
      });
    },
  },
  created() {
    this.selectAll();
  },
};
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 10%;
    height: 98%;
    box-shadow: 0px 0px 10px #e5e5e5;
    position: relative;
    .btn {
      position: absolute;
      top: 50%;
      right: -15px;
      z-index: 9999;
    }
    .title {
      height: 30px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
    }
    .list {
      height: calc(100% - 30px);
      overflow: auto;
      padding: 0 15px;
      p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .right {
    width: 90%;
    height: 98%;
    // overflow: auto;
  }
}
.right1 {
  width: 100% !important;
  transition: 0.3s linear;
}
.mymove {
  animation: mymove 0.3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes mymove {
  from {
    width: 10%;
  }
  to {
    width: 0%;
  }
}
.current {
  font-weight: bold;
}
::v-deep .shadow img {
  width: auto !important;
  position: inherit !important;
}
</style>