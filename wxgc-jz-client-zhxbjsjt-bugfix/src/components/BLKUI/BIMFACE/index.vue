/*
  此次BIMFACE的二次开发是基于 BIMFACE官网-控制台-上传转换中的fileId，并不是同级菜单的模型集成中的integrateId。
  因为未知原因，模型集成后目录树中数据结构的最后一层-elementIds所包含的id无法关联具体构件，倘若采用其上级的fileId则tableRowClick方法中的addBlinkComponentsById构件闪烁接口据官方回复并不支持具有fileId的条件筛选
  官方人员 "BIMFACE 白玉娟" 最终给出的方案是：（暂不考虑）
    目前前端没有根据条件进行构件强调，但是我们有后端接口，可以根据条件筛选出构件id，然后在去设置强调
    https://static.bimface.com/restful-apidoc/dist/translateSingleModel.html#_getelementidsusingget
*/


<template>
  <!-- 定义DOM元素，用于在该DOM元素中显示模型或图纸 -->
  <div class="bimface">
    <div class="view">
      <!-- 定义DOM元素，用于在该DOM元素中显示模型或图纸 -->
      <div class="model" id="domId"></div>
      <!-- 控制展示面板按钮 -->
      <div class="controlBoard" v-if="modelHeaders.fileId">
        <el-button type="primary" @click="controlBoard">{{
          btnText
        }}</el-button>
      </div>
    </div>

    <!-- 右侧信息展示 -->
    <div class="info" v-loading="loading" v-if="btnText == '隐藏'">
      <!-- 进度统计 -->
      <div class="info_statistics">
        <div
          class="statistics_data"
          v-for="(item, index) in statisticsData"
          :key="index"
        >
          <span>{{ item.lable }}</span>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="item.value"
            :status="item.status"
          ></el-progress>
        </div>
      </div>

      <!-- 进度表格 -->
      <div class="info_table">
        <div class="table_head">
          <span>进度展示</span>
          <el-button type="primary" @click="openWindow()">更新进度</el-button>
        </div>
        <div class="table_body scroll">
          <el-table
            :data="tableData"
            :row-class-name="tableRowClassName" 
            @row-click="tableRowClick"
          >
            <el-table-column
              fixed
              prop="name"
              label="任务名称"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="planStartTime"
              label="计划开始时间"
              width="130"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="planFinishTime"
              label="计划结束时间"
              width="130"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="realityStartTime"
              label="实际开始时间"
              width="130"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="realityFinishTime"
              label="实际结束时间"
              width="130"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="110"
              align="center"
            >
              <template slot-scope="scope" style="background-color:#fff">
                <el-button
                  @click.native.prevent.stop="openWindow(scope)"
                  type="text"
                  size="small"
                >
                  修改
                </el-button>
                <el-button
                  @click.native.prevent.stop="deleteRow(scope, tableData)"
                  type="text"
                  size="small"
                  style="color: red"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 进度模拟 -->
      <div class="info_progress">
        <div class="progress_operation">
          <span>进度模拟</span>
          <span>
            <el-button
              type="primary"
              icon="el-icon-video-play"
              circle
              title="播放"
              @click="playback"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-video-pause"
              circle
              title="暂停"
              @click="suspension"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-view"
              circle
              title="预览"
              @click="restoreModel"
            ></el-button>
          </span>
        </div>
        <div class="progress_body">
          <el-slider
            v-if="tableData.length > 0"
            v-model="slider"
            show-stops
            :max="tableData.length - 1"
            :format-tooltip="formatTooltip"
            :marks="marks"
            @change="dragging"
          ></el-slider>
        </div>
      </div>
    </div>

    <!-- 进度数据弹窗 -->
    <el-dialog
      title="进度数据"
      width="30%"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
    >
      <el-form ref="blkForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartTime">
          <el-date-picker
            v-model="form.planStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planFinishTime">
          <el-date-picker
            v-model="form.planFinishTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="进度状态">
          <el-checkbox
            :value="form.status == 1"
            @change="
              (val) => {
                this.form.status = val ? 1 : 0;
              }
            "
            >已完成</el-checkbox
          >
        </el-form-item>
        <template v-if="form.status == 1">
          <el-form-item label="实际开始时间" prop="realityStartTime">
            <el-date-picker
              v-model="form.realityStartTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="实际结束时间" prop="realityFinishTime">
            <el-date-picker
              v-model="form.realityFinishTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item label="关联构件" prop="information">
          <el-button type="primary" @click="modelTreeVisible = true"
            >打开目录树</el-button
          >
          <el-dialog
            title="关联构件"
            width="30%"
            append-to-body
            :visible.sync="modelTreeVisible"
            :destroy-on-close="true"
          >
            <el-tree
              show-checkbox
              ref="blkTree"
              node-key="id"
              :props="props"
              :data="treeData"
              :default-checked-keys="checkedNodeIds"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="modelTreeVisible = false">取 消</el-button>
              <el-button type="primary" @click="filterCheckedBox">
                关 联
              </el-button>
            </span>
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { bimfaceToken, bimfaceGetAction } from "@/api/bimfaceManage";
import { deleteAction, getAction, postAction, putAction } from "@/api/manage";

export default {
  data() {
    return {
      viewer3D: "",
      viewToken: "",
      modelHeaders: {},
      treeData: [],
      checkedNodeIds: [],
      tableData: [],
      slider: 0,
      currentIndex: 0,
      progress: null,
      form: {
        name: "",
        status: 0,
        information: [],
      },
      rules: {
        name: [{ required: true, message: "请输入该项内容", trigger: "blur" }],
        information: [
          { required: true, message: "请勾选相关构件", trigger: "blur" },
        ],
      },
      statisticsData: [
        {
          lable: "已完成",
          value: 0,
          status: "success",
        },
        {
          lable: "未完成",
          value: 0,
          status: "warning",
        },
      ],
      btnText: "展开",
      dialogVisible: false,
      loading: true,
      modelTreeVisible: false,
      props: {
        label: "actualName",
        children: "items",
      },
      status: "",
      marks: {
        0: "起点",
      },
    };
  },

  mounted() {
    this.initBIMFACE();
  },

  methods: {
    initBIMFACE() {
      if (this.viewToken.length <= 0) {
        // 获取模型信息
        getAction("/wxgc/plus/tt-bimface/select/list").then((res) => {
          if (res.code != "success") {
            this.$message.error("模型数据不完整，无法加载模型");
            return;
          }
          // console.log('获取模型信息',res)
          let data = res.data.records[0];
          let bimfaceHeaders = {  // appkey 和 appSecret
            Authorization: `Basic ${window.btoa(
              `${data.appKey}:${data.appSecret}`
            )}`,
          };
          this.modelHeaders = data.integrateId   //取key
            ? { integrateId: data.integrateId }
            : { fileId: data.fileId };
          console.log(
            "getBimfaceModelInfo",
            data,
            bimfaceHeaders,
            this.modelHeaders
          );
          // 重置 bimfaceToken 
          this.$store.dispatch("bimface/resetToken");
          // 连接bimface  获取Access Token 的接口/oauth2/token
          // 地址，参数，请求头
          bimfaceToken("/oauth2/token", null, bimfaceHeaders).then((res) => {
          // 设置vuex 中 bimfaceToken 的值~
            this.$store.dispatch(
              "bimface/setToken",
              `Bearer ${res.data.token}`
            );
            // 初始化模型 获取 View Token
            bimfaceGetAction("/view/token", this.modelHeaders).then((res) => {
              // console.log("获取 View Token",res)
              this.viewToken = res.data;
              // 准备工作结束
              var options = new BimfaceSDKLoaderConfig();
              options.viewToken = this.viewToken;
              BimfaceSDKLoader.load(
                options,
                this.successCallback,
                this.failureCallback
              );
            });
          });
        });
      }
    },

    // 初始化成功，展示模型
    successCallback(viewMetaData) {
      if (viewMetaData.viewType == "3DView") {
        // ======== 判断是否为3D模型 ========
        // 获取DOM元素
        let dom4Show = document.getElementById("domId");
        let webAppConfig = new Glodon.Bimface.Application.WebApplication3DConfig();
        webAppConfig.domElement = dom4Show;
        // 创建WebApplication
        let app = new Glodon.Bimface.Application.WebApplication3D(webAppConfig);
        // 添加待显示的模型
        app.addView(this.viewToken);
        // 从WebApplication获取viewer3D对象
        this.viewer3D = app.getViewer();
        // 增加加载完成监听事件
        let that = this;
        this.viewer3D.addEventListener(
          Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded,
          function () {
            // 调用viewer3D对象的Method，可以继续扩展功能
            //自适应屏幕大小
            window.onresize = function () {
              that.viewer3D.resize(
                document.documentElement.clientWidth,
                document.documentElement.clientHeight - 40
              );
            };
            // 渲染3D模型 渲染场景
            that.viewer3D.render();
            // 获取"构建的"目录树 数据
            that.viewer3D.getModelTree(function (data) {
              // console.log("getModelTree获取构件目录树：", data);
              that.recursiveTreeData(data);
              that.treeData = data;
            });
            // 逻辑上应该先展示模型再展示相关数据用以操作，同样还得减少资源占用
            if (that.modelHeaders.fileId) that.tableLoadData();
          }
        );
      }
    },

    // 初始化失败，error
    failureCallback(error) {
      console.log(error);
    },

    // 递归构件目录树 （处理了数据）
    recursiveTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        let target = data[i];
        if (!target.items) {
          let elementIds = target.elementIds;
          target.id = target.fileId;
          target.actualName = "全部构件";
          target.items = [];
          // console.log("recursiveTreeData", target);
          for (let j = 0; j < elementIds.length; j++) {
            target.items[j] = {
              id: elementIds[j],
              actualName: elementIds[j],
            };
          }
          return;
        } else {
          this.recursiveTreeData(target.items);
        }
      }
    },

    // 根据期限过滤，展示效果（展示table表格的颜色 ，warning-row 是偏粉色，success-row 偏淡绿色）
    tableRowClassName({ row, rowIndex }) { //修改背景
      if (!row.realityFinishTime || row.status == 0) return "";
      return new Date(row.planFinishTime) < new Date(row.realityFinishTime)
        ? "warning-row"
        : "success-row";
    },

    // 加载构件进度table表格数据
    tableLoadData() {
      this.loading = true;
      getAction("/wxgc/model/select/all").then((res) => {
        // console.log("加载构件进度表格数据:",res)
        if (res.code === "success") {
          this.tableData = res.data;
          // 获取已勾选的构件数组
          this.checkedNodeIds = [];
          for (let i = this.tableData.length - 1; i >= 0; i--) {
            this.checkedNodeIds = this.checkedNodeIds.concat(
              JSON.parse(this.tableData[i].information) // 后台以字符串的形式存储数组
            );
            // 设置进度条下标
            this.marks[i] = this.tableData[i].planFinishTime;
          }
          this.loading = false;
        }
      });
      // 进度统计数据
      getAction("/wxgc/model/selete/countReinforceState").then((res) => {
        this.statisticsData[0].value = res.data.cpReinforceState;
        this.statisticsData[1].value = res.data.ipReinforceState;
      });
    },

    // 点击表格中的一行数据时触发 (让构建闪烁)
    tableRowClick(row, column, event) {
      let information = JSON.parse(row.information);
      // console.log('点击table表格中的某一行：',information)
      this.restoreModel();
      this.viewer3D.transparentAllComponents(); // 进度展示时所有组件半透明
      this.viewer3D.opaqueComponentsById(information); // 显示该进度的关联构件
      // 相关构件闪烁
      this.viewer3D.getModel().addBlinkComponentsById(information);
      this.viewer3D.setBlinkColor(
        new Glodon.Web.Graphics.Color("#32D3A6", 0.8)
      );
      this.viewer3D.enableBlinkComponents(true);
      this.viewer3D.setBlinkIntervalTime(800);
      this.viewer3D.render();
      // console.log("tableRowClick", row, information);
    },

    // 删除一行进度数据
    deleteRow(data) {
      deleteAction(`/wxgc/model/delete/${data.row.id}`).then((res) => {
        if (res.code === "success") this.tableLoadData();
        this.$message.info(res.msg);
      });
    },

    // 打开进度数据展示弹窗,进行新增和修改
    openWindow(scoped) {
      this.status = scoped ? "edit" : "add";
      this.form = scoped
        ? scoped.row
        : {
            name: "",
            status: 0,
          };
      this.dialogVisible = true;
    },

    // 点击目录树复选框，关联构件
    filterCheckedBox(data, checkNode) {
      let nodes = this.$refs.blkTree.getCheckedKeys(true);
      // 获取新勾选的构件id
      let tmp = [];
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (!this.checkedNodeIds.includes(nodes[i])) tmp.push(nodes[i]);
      }
      this.$set(this.form, "information", tmp);
      this.modelTreeVisible = false;
      // console.log("filterCheckedBox", nodes, this.form.information);
    },

    // 进度表单数据提交
    submit() {
      this.$refs.blkForm.validate((valid) => {
        if (!valid) return;
        switch (this.status) {
          case "add":
            postAction("/wxgc/model/save", this.form).then((res) => {
              if (res.code === "success") {
                this.tableLoadData();
                this.dialogVisible = false;
              }
              this.$message.info(res.msg);
            });
            break;
          case "edit":
            putAction("/wxgc/model/update", this.form).then((res) => {
              if (res.code === "success") {
                this.tableLoadData();
                this.dialogVisible = false;
              }
              this.$message.info(res.msg);
            });
            break;
          default:
            break;
        }
      });
    },

    // 进度条tooltip格式化
    formatTooltip(index) {
      if (index === null) return;
      return this.tableData[index].name;
    },

    // 播放
    playback() {
      this.restoreModel();
      this.viewer3D.hideAllComponents(); // 全部构件隐藏
      this.currentIndex = this.slider = 0; // 重置进度条
      this.progress = setInterval(() => {
        this.viewer3D.showComponentsById(
          JSON.parse(this.tableData[this.slider].information)
        );
       
        if (this.slider == this.tableData.length - 1) {
          clearInterval(this.progress);
          return;
        }
        this.currentIndex = this.slider++;
      }, 1000);
    },
    // 暂停
    suspension() {
      clearInterval(this.progress);
    },
    // 默认展示全部模型
    restoreModel() {
      if (this.progress) clearInterval(this.progress);
      this.viewer3D.restoreDefault(); // 重置模型至默认状态
      this.viewer3D.clearAllBlinkComponents(); // 清除构件闪烁效果
      this.viewer3D.render();
    },
    // FIXME 拖拽暂时没有性能更优的方式，临时改为点击展示
    dragging(index) {
      this.tableRowClick(this.tableData[index]);
    },

    // 控制面板显示、隐藏
    controlBoard() {
      if (this.btnText == "展开") {
        this.btnText = "隐藏";
        document.querySelector(".view").style.width = "75%";
        // 定义进度条长度
        this.$nextTick(() => {
          document.querySelector(".el-slider__runway").style.width = `${
            this.tableData.length * 100
          }px`;
        });
      } else {
        this.btnText = "展开";
        document.querySelector(".view").style.width = "100%";
      }
    },
  },

  beforeDestroy() {
    clearInterval(this.progress);
  },
};
</script>

<style lang="scss">
.bimface .el-table td {
    border: 0;
    color: #606266 !important;  
}
.bimface .el-table th {
     background: #fff !important; 
    border: 0;
}
.bimface .info_table {
    //  background: #fff !important; 
    border: 0;
    ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb{
  background: #99a9bf !important;
;
}
::-webkit-scrollbar {
    height: 6px;
    }
}
// .bimface .el-table .warning-row {
//   background-color: #faecd8 !important;
// }
.bimface .el-table .el-table__row{
 background: #fff; 
}
.bimface .el-table__body tr.hover-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td {
      background: #d3dce6 !important; 
    }


</style>

<style lang="scss" scoped>

.bimface .el-table td {
    border: 0;
    color: #606266 !important;  
}
.bimface .el-table th {
     background: #fff !important; 
    border: 0;
}

* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
}

.bimface {
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;

  .view {
    width: 100%;
    height: 100%;
    position: relative;
    .model {
      width: 100%;
      height: 100%;
    }
    .controlBoard {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .info {
    width: 25%;
    background: white;
    > div {
      border: 1px solid lightgrey;
    }
    .info_statistics {
      color: #606266;
      height: 10%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .statistics_data {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .el-progress {
          width: 80%;
        }
      }
    }
    .info_table {
      height: 75%;
      padding: 10px;
      .table_head {
        height: 4%;
        font-weight: bold;
        color: #606266;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:first-child {
          font-weight: bold;
          color: #606266;
          font-size: 16px;
        }
        .el-button {
          padding: 5px;
        }
      }
      .table_body {
        height: 96%;
        // overflow-x: scroll;
        // overflow-y: scroll;
        overflow: auto;
      }
    }
    .info_progress {
 ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb{
  background: #99a9bf;
;
}
::-webkit-scrollbar {

    height: 6px;
    }
      height: 15%;
      .progress_operation {
        height: 30%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        span:first-child {
          font-weight: bold;
          color: #606266;
          font-size: 16px;
        }
        .el-button {
          padding: 0;
          font-size: 30px;
        }
      }
      .progress_body {
        width: 100%;
        overflow-x: auto;
        height: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-slider {
          width: 80%;
        }
      }
    }
  }
}

.scroll {
  overflow: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6 ;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99a9bf ;
    border-radius: 20px;
  }
}

::v-deep .el-dialog {
  .el-form-item {
    margin: 20px 0;
  }
}
::v-deep .el-table {
  .warning-row {
    background: #faecd8;
  }
  .success-row {
    background: #e1f3d8;
  }
}
::v-deep .el-button {
  padding: 5px;
}
::v-deep .el-tree {
  
  max-height: 300px;
  @extend .scroll;
}
::v-deep .el-slider {
  .el-slider__marks-text {
    min-width: 100px;
    text-align: center;
  }
}
</style>
