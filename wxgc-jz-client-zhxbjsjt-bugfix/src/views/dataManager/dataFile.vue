<template>
  <div>
    <card-container
      :resp="{ span: 24 }"
      title="施工图纸"
      style="position: relative"
    >
      <div style="position: absolute; top: 20px; right: 20px; display: flex">
        <el-input
          style="width: 180px; margin-right: 10px"
          size="small"
          v-model="listQuery.fileName"
          placeholder="搜索文件名称"
        ></el-input>
        <el-button size="small" type="primary" @click="loadPageData"
          >搜索</el-button
        >
        <el-button size="small" type="primary" @click="add('create')"
          >新增类型</el-button
        >
        <el-button size="small" type="primary" @click="add('createUpFile')"
          >添加文件</el-button
        >
      </div>
      <el-row>
        <el-col :span="6" v-loading="loading">
          <div class="fileList" v-if="zsklist.length > 0">
            <!-- 树 -->
            <div class="main">
              <el-tree
                class="filter-tree"
                :data="zsklist"
                :props="defaultProps"
                check-strictly
                default-expand-all
                node-key="knowledgeBaseId"
                :highlight-current="true"
                ref="tree"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                :show-checkbox="showCheckbox"
                @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    {{ data.knowledgeBaseName }}
                  </span>
                  <!-- 操作按钮 -->
                  <span v-if="true">
                    <!-- <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => append(data)"
                    >
                      <i class="el-icon-circle-plus-outline"></i>
                    </el-button> -->
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => edit(data)"
                    >
                      <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => delZSK(data)"
                    >
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
          <ul class="fileList" v-else>
            <li>暂无数据</li>
          </ul>
        </el-col>
        <el-col :span="18">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%; border-radius: 10px"
            @selection-change="hanSeleChange_bot"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="fileName"
              label="文件名称"
              width="220"
            ></el-table-column>
            <el-table-column prop="fileSize" label="文件大小" width="120">
              <template slot-scope="scope">
                {{ scope.row.fileSize }} Kb
              </template>
            </el-table-column>
            <el-table-column
              prop="createBy"
              label="上传人"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="上传时间"
              width="220"
            ></el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template slot-scope="scope">
                <a size="mini" @click="huiFuLook(scope.$index, scope.row)"
                  >预览</a
                >
                <a
                  style="margin-left: 10px"
                  :href="
                    '/wxgc-api/wxgc/plus/tt-file/downLoadFile?filePath=' +
                    scope.row.filePath
                  "
                  >下载</a
                >
                <el-button
                  type="text"
                  style="color: red; margin-left: 10px"
                  @click="delFile(scope.row.knowledgeBaseFileId)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-pagination
              class="el-pagination"
              v-show="total > 0"
              background
              layout="prev, pager, next"
              :current-page.sync="listQuery.pageIndex"
              :page-size.sync="listQuery.pageSize"
              @current-change="loadPageData"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </card-container>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible_add"
      width="600px"
      @close="close"
    >
      <el-form ref="addform" :model="addform" :rules="rules" label-width="80px">
        <div v-if="title == '新增类型'">
          <el-row>
            <el-col>
              <el-form-item label="类型" prop="knowledgeBaseName">
                <el-input v-model="addform.knowledgeBaseName"></el-input>
              </el-form-item>
              <!--  -->
              <el-form-item label="上级组织">
                <div style="height: 23vh; overflow-y: auto">
                  <el-tree
                    ref="rolesTree"
                    :data="zsklist"
                    :props="{ label: 'knowledgeBaseName', children: 'sonList' }"
                    :check-strictly="true"
                    node-key="knowledgeBaseId"
                    show-checkbox
                    :default-expanded-keys="expandedKeys"
                    @check="handleNodeCheck"
                  ></el-tree>
                </div>
                <span style="color: red"
                  >注意：这里选择的是<strong> [上级组织] </strong
                  >，不选默认第一级</span
                >
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-else>
          <el-row>
            <el-col>
              <el-form-item label="类型" prop="currentZSKId">
                <div style="max-height: 23vh; overflow-y: auto">
                  <el-tree
                    ref="rolesTreeType"
                    :data="zsklist"
                    :props="{ label: 'knowledgeBaseName', children: 'sonList' }"
                    :check-strictly="true"
                    node-key="knowledgeBaseId"
                    show-checkbox
                    :default-expanded-keys="expandedKeys"
                    @check="handleNodeCheckType"
                  ></el-tree>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="选择文件（单个）" prop="fileListString">
                <burstUpload
                  @upUrlArr="upUrlArr"
                  ref="burstUpload"
                  @change="getFile"
                ></burstUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_add = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? savezsk() : updateFile()"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible_edit"
      width="600px"
      @close="closeeditType"
    >
      <el-form ref="addform" :model="addform" :rules="rules" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="类型" prop="knowledgeBaseName">
              <el-input v-model="addform.knowledgeBaseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="editType">确 定</el-button>
      </span>
    </el-dialog>

    <fileView ref="fileView" title="文件预览"></fileView>
  </div>
</template>

<script>
import {
  selectAllTtKnowledgeBaseByType,
  addTtKnowledgeBase,
  deleteTtKnowledgeBase,
  editType,
} from "@/views/safeManager/api/ttknowledgebase.js";
import {
  getPageTtKnowledgeBaseFile,
  addTtKnowledgeBaseFile,
  deleteTtKnowledgeBaseFile,
} from "@/views/safeManager/api/ttknowledgebasefile.js";
import CardContainer from "@/components/CardContainer";
import Pagination from "@/components/Pagination";
import burstUpload from "@/components/burstUpload";

import fileView from "@/components/filePreview/filePreview.vue";
export default {
  components: {
    Pagination,
    CardContainer,
    fileView,
    burstUpload,
  },
  data() {
    return {
      loading: false,
      expandedKeys: [], //默认展开节点id
      // 树默认规则
      defaultProps: {
        children: "sonList",
        label: "knowledgeBaseName",
      },

      title: "新增类型", //'新增类型','添加文件'
      options: [],
      dialogStatus: "create",

      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        knowledgeBaseFileId: undefined,
        knowledgeBaseType: 2, // 施工图纸 2
        fileName: "",
        fileTyp: 0,
      },
      searchLbInp: "",
      zsklist: [],
      currentZSKId: "0",
      tableData: [],
      total: 1,
      dialogVisible_add: false,
      dialogVisible_edit: false,
      addform: {
        fileListString: "",
        currentZSKId: "",
        fileType: 0,
      },
      rules: {
        knowledgeBaseName: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        currentZSKId: [
          {
            required: true,
            message: "请选择新增文件的类型",
            trigger: "change",
          },
        ],
        fileListString: [
          {
            required: true,
            message: "请上传文件",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.getZSKList();
  },
  methods: {
    close() {
      if (this.$refs.rolesTree) {
        this.addform.parentId = "";
        this.$refs.rolesTree.setCheckedKeys([]);
      }
      if (this.$refs.rolesTreeType) {
        this.addform.currentZSKId;
        this.$refs.rolesTreeType.setCheckedKeys([]);
      }
    },
    // 单选知识库类别
    handleNodeCheck(data, node) {
      this.addform.parentId = data.knowledgeBaseId;
      console.log(this.$refs.rolesTree);
      console.log(data);
      this.$refs.rolesTree.setCheckedKeys([data.knowledgeBaseId]);
    },
    handleNodeCheckType(data, node) {
      this.addform.currentZSKId = data.knowledgeBaseId;
      this.$refs.rolesTreeType.setCheckedKeys([data.knowledgeBaseId]);
    },
    // 点击树结构 根据编码查询子集
    handleNodeClick(data) {
      this.handZskClick(data.knowledgeBaseId);
    },
    hanSeleChange_bot() {},
    huiFuLook(index, row) {
      let type = row.filePath.substring(row.filePath.lastIndexOf(".") + 1);
      this.$refs.fileView.show(row.filePath, type); //(文件地址,文件类型)
    },
    add(content) {
      if (
        !this.$store.getters.projectId ||
        this.$store.getters.projectChildrenIds.length > 0
      ) {
        this.$message({
          message: "请先选择具体项目再添加数据",
          type: "warning",
        });
        return;
      }
      if (content == "create") {
        this.title = "新增类型";
      } else {
        this.title = "添加文件";
      }
      this.dialogVisible_add = true;
      this.dialogStatus = content;
      this.$nextTick((res) => {
        this.$refs["addform"].clearValidate();
      });
    },
    delFile(fileId) {
      this.$confirm("确定删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTtKnowledgeBaseFile(fileId).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.loadPageData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(data) {
      console.log(data);
      this.addform = JSON.parse(JSON.stringify(data));
      this.dialogVisible_edit = true;
    },
    closeeditType() {
      this.addform = {};
    },
    editType() {
      editType(this.addform)
        .then((res) => {
          this.dialogVisible_edit = false;
          this.getZSKList();
          this.addform = {};
          this.$message.success("修改成功");
        })
        .catch((error) => {
          this.$message.error("修改失败");
        });
    },
    // 获取文件
    getFile(fileList) {
      if (fileList.length > 0) {
        this.addform.fileListString = "有文件";
      } else {
        this.addform.fileListString = "";
      }
    },
    delZSK(data) {
      this.$confirm("确定删除该知识库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTtKnowledgeBase(data.knowledgeBaseId).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getZSKList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    savezsk() {
      this.$refs["addform"].validate((valid) => {
        if (valid) {
          addTtKnowledgeBase({
            knowledgeBaseName: this.addform.knowledgeBaseName,
            knowledgeBaseType: "2",
            fileType: 0,
            parentId: this.addform.parentId,
          })
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("添加知识库成功!");
                this.getZSKList();
                this.dialogVisible_add = false;
                this.clear();
              }
            })
            .catch((error) => {
              this.clear();
            });
        }
      });
    },
    clear() {
      this.addform.knowledgeBaseName = "";
      this.addform.parentId = "";
      this.addform.currentZSKId = "";
    },
    handZskClick(id) {
      this.currentZSKId = id;
      this.loadPageData();
    },
    getZSKList() {
      this.loading = true;
      selectAllTtKnowledgeBaseByType({
        knowledgeBaseType: "2",
        fileType: 0,
      }).then((res) => {
        this.loading = false;
        this.zsklist = res.data;
        this.options = res.data;
        if (res && res.data.length != 0) {
          console.log("this.options", this.options);
          this.currentZSKId = res.data[0].knowledgeBaseId || 0;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(res.data[0].knowledgeBaseId);
          });
          this.loadPageData();
        } else {
          this.loading = false;
          this.tableData = [];
        }
      });
    },
    loadPageData() {
      this.dataLoading = true;
      this.listQuery.knowledgeBaseId = this.currentZSKId;
      getPageTtKnowledgeBaseFile(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    // 添加文件
    updateFile() {
      this.$refs["addform"].validate(async (valid) => {
        if (valid) {
          await this.$refs.burstUpload.sureUploadVideo();
        }
      });
    },
    upUrlArr(data) {
      console.log("返回的数组url459 ", data);
      // 保存 参数
      // 处理数据
      let filePath = data.map((item) => {
        return item.filePath;
      });
      filePath = filePath.join(";");

      let fileName = data.map((item) => {
        return item.raw.name;
      });
      fileName = fileName.join(";");

      let fileSize = data.map((item) => {
        return item.raw.size;
      });
      fileSize = fileSize.join(";");

      addTtKnowledgeBaseFile({
        knowledgeBaseId: this.addform.currentZSKId,
        // fileId: data.id,
        filePath: filePath,
        fileName: fileName,
        fileSize: fileSize,
        fileType: 0,
        knowledgeBaseType: "2",
        createBy: this.$store.getters.name,
      })
        .then((res) => {
          if (res.code == "success") {
            this.dialogVisible_add = false;
            this.$message.success("上传成功!");
            this.loadPageData(this.currentZSKId);
            this.fileList = [];
            this.clear();
          }
        })
        .catch((error) => {
          this.clear();
          console.log(error);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.fileList {
  margin: 0 50px 0 0;
  padding: 0;
  border-right: 1px solid #eaeaea;
  li {
    &:hover {
      color: @basecolor;
      i {
        display: inline-block;
      }
    }
    cursor: pointer;
    color: #666;
    margin-bottom: 15px;
    list-style: none;
    font-size: 15px;
    text-align: left;
    i {
      display: none;
      color: #ff8080;
      font-weight: 600;
      float: right;
      margin-right: 28%;
    }
  }
  li.zsk_act {
    color: @basecolor;
  }
}
.xuanquwenjian {
  display: flex;
  margin-left: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
::v-deep .el-tree {
  height: 99%;
  min-width: 100%;
  display: inline-block;
  .el-tree__empty-text {
    width: 100%;
    position: static;
    margin: 0 auto;
  }
}
</style>
