<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.createBy"
        placeholder="创建人"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
    </div>
    <!--显示列表-->
    <div class="tablebox">
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        height="100%"
        stripe
        fit
        highlight-current-row
      >
        <el-table-column prop="videoName" label="名称" align="center">
        </el-table-column>

        <el-table-column prop="area" label="位置" align="center">
        </el-table-column>

        <el-table-column prop="sort" label="排序" align="center">
        </el-table-column>

        <el-table-column prop="deviceSerial" label="序列号" align="center">
        </el-table-column>

        <el-table-column prop="channelNumber" label="通道号" align="center">
        </el-table-column>

        <el-table-column prop="videoType" label="类型" align="center">
        </el-table-column>

        <el-table-column prop="videoUrl" label="视频链接" align="center">
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>

        <el-table-column prop="createBy" label="创建人" align="center">
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页组件-->
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

    <!--增加或修改弹出层-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24"
            ><div class="grid-content bg-purple">
              <el-form-item label="名称" prop="videoName">
                <el-input v-model="temp.videoName" placeholder="名称" />
              </el-form-item>
              <!-- <el-form-item label="所属项目" prop="projectId">
                <el-cascader
                  style="width: 100%"
                  ref="cascaderArr"
                  v-model="temp.projectId"
                  :options="projectIdList"
                  @change="handleChange"
                  :show-all-levels="false"
                  :props="{ checkStrictly: true }"
                ></el-cascader>
              </el-form-item> -->
              <el-form-item label="位置" prop="videoName">
                <el-input v-model="temp.area" placeholder="名称" />
              </el-form-item>
              <el-form-item label="序列号" prop="deviceSerial">
                <el-input
                  v-model="temp.deviceSerial"
                  placeholder="设备号关系到控制球机,请勿乱填"
                />
              </el-form-item>
              <el-form-item label="通道号" prop="channelNumber">
                <el-input
                  type="number"
                  v-model="temp.channelNumber"
                  placeholder="通道号关系到控制球机,请勿乱填"
                />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number  v-model="temp.sort" controls-position="right" :min="1" placeholder="排序" />
              </el-form-item>
              <el-form-item label="进场日期" prop="innerDate">
                <el-date-picker
                  v-model="temp.innerDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="进场日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="类型" prop="videoType">
                <el-select
                  v-model="temp.videoType"
                  clearable
                  filterable
                  placeholder="请选择类型"
                >
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 类型的区别 -->

              <!-- <el-form-item label="对接格式" prop="type">
                <el-radio-group v-model="temp.type">
                  <el-radio :label="0">普通m3u8</el-radio>
                  <el-radio :label="1">萤石云平台</el-radio>
                </el-radio-group>
              </el-form-item> -->
              <!--  -->
              <div v-if="temp.type == 0">
                <el-form-item label="视频链接" prop="videoUrl">
                  <el-input v-model="temp.videoUrl" placeholder="视频链接" />
                </el-form-item>
              </div>
              <div v-if="temp.type == 1">
                <el-form-item label="萤石云appKey" prop="appKey">
                  <el-input v-model="temp.appKey" placeholder="视频链接" />
                </el-form-item>
                <el-form-item label="萤石云secret" prop="secret">
                  <el-input v-model="temp.secret" placeholder="视频链接" />
                </el-form-item>
                <!-- <el-form-item label="萤石云原始监控地址" prop="ysyVideoUrl">
                  <el-input v-model="temp.ysyVideoUrl" placeholder="例如：ezopen://open.ys7.com/E75156905/10.hd.live" />
                </el-form-item> -->

                <el-form-item label="萤石云原始监控地址" prop="videoUrl">
                  <el-input
                    v-model="temp.videoUrl"
                    placeholder="例如：ezopen://open.ys7.com/E75156905/10.hd.live"
                  />
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageTtVideo,
  getAllTtVideo,
  addTtVideo,
  updateTtVideo,
  deleteTtVideo,
} from "./api/ttvideo.js";
import { deepClone, parseTime } from "@/utils";
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";
import Pagination from "@/components/Pagination/index"; // secondary package based on el-pagination
export default {
  name: "machine",
  components: { Pagination },
  data() {
    return {
      options: ["枪机", "球机", "AI", "塔吊视频", "吊钩视频"],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "名称", field: "videoName" },
        { label: "位置", field: "area" },
        { label: "排序", field: "sort" },
        { label: "序列号", field: "deviceSerial" },
        { label: "通道号", field: "channelNumber" },
        { label: "类型", field: "videoType" },
        { label: "视频链接", field: "videoUrl" },
        // { label: "进场时间", field: "innerDate" },
        { label: "创建时间", field: "createTime" },
        { label: "创建人", field: "createBy" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        id: undefined,
        sort: undefined,
        projectId: undefined,
        createTime: undefined,
        createBy: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        videoName: null,
        area: null,
        deviceSerial: null,
        channelNumber: null,
        innerDate: null,
        sort: null,
        videoType: null,
        videoUrl: null,
        projectId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        type: 0,
        appKey: null,
        secret: null,
        projectId: "",
        projectName: "",
      },
      rules: {
        //校验功能
        videoName: [
          { required: true, message: "必填名称", trigger: ["blur", "change"] },
        ],
        area: [
          { required: true, message: "必填位置", trigger: ["blur", "change"] },
        ],
        deviceSerial: [
          {
            required: true,
            message: "必填序列号",
            trigger: ["blur", "change"],
          },
        ],
        channelNumber: [
          {
            required: true,
            message: "必填通道号",
            trigger: ["blur", "change"],
          },
        ],
        innerDate: [
          {
            required: true,
            message: "必填进场时间",
            trigger: ["blur", "change"],
          },
        ],
        sort: [
          { required: true, message: "必填排序", trigger: ["blur", "change"] },
        ],
        videoType: [
          {
            required: true,
            message: "必填类型:球机/枪机",
            trigger: ["blur", "change"],
          },
        ],
        videoUrl: [
          {
            required: true,
            message: "必填视频链接",
            trigger: ["blur", "change"],
          },
        ],
        type: [
          {
            required: true,
            message: "必选对接格式",
            trigger: ["blur", "change"],
          },
        ],
        appKey: [
          {
            required: true,
            message: "必填萤石云appKey",
            trigger: ["blur", "change"],
          },
        ],
        secret: [
          {
            required: true,
            message: "必填萤石云secret",
            trigger: ["blur", "change"],
          },
        ],
        ysyVideoUrl: [
          {
            required: true,
            message: "必填萤石云原始监控地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      noRotate: false,
      checkAll: false,
      isIndeterminate: false,
      projectIdList: [],
    };
  },
  watch: {
    "temp.type": {
      handler(newValue, oldValue) {
        if (oldValue) {
          this.temp.appKey = null;
          this.temp.secret = null;
          this.temp.videoUrl = null;
        }
      },
    },
  },
  created() {
    getPageSysProject({ pageIndex: 1, pageSize: -1 }).then((res) => {
      this.projectIdList = this.handleProject(res.data.records);
    });
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    handleChange(list) {
      const checkNode = this.$refs.cascaderArr.getCheckedNodes();
      this.temp.projectName = checkNode[0].data.label;
      this.temp.projectId = checkNode[0].data.value;
    },
    handleProject(list) {
      if (list) {
        list.forEach((item) => {
          item["value"] = item.proId;
          item["label"] = item.proName;
          if (item.children && item.children.length !== 0) {
            this.handleProject(item.children);
          } else {
            delete item.children;
          }
        });
        return list;
      }
    },
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtVideo(rows[index].id);
          if (res.code == "success") {
            rows.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {
          // this.errorMsg()
        });
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageTtVideo(this.listQuery)
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
    //搜索
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPageTtVideo(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            import("@/vendor/Export2Excel").then((excel) => {
              const tHeader = [];
              const filterVal = [];
              for (let column of self.columns) {
                tHeader.push(column.label);
                filterVal.push(column.field);
              }
              const data = this.formatJson(filterVal);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: "设备认证",
              });
              this.downloadLoading = false;
            });
          } else {
            this.errorMsg("下载数据失败");
          }
        })
        .catch((err) => {
          this.errorMsg();
        });
    },
    formatJson(filterVal) {
      return this.allTableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        id: null,
        videoName: null,
        area: null,
        deviceSerial: null,
        channelNumber: null,
        innerDate: null,
        sort: null,
        videoType: null,
        videoUrl: null,
        projectId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        type: 0,
        appKey: null,
        secret: null,
        projectName: "",
        projectId: "",
      };
    },
    //增加窗口弹出之前恢复默认值
    // handleCreate() {
    //   this.resetTemp();
    //   this.dialogStatus = "create";
    //   this.dialogFormVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs["dataForm"].clearValidate();
    //   });
    // },
    //增加
    // createData() {
    //   this.$refs["dataForm"]
    //     .validate((valid) => {
    //       if (valid) {
    //         this.temp.createBy = this.$store.getters.name;
    //         let param = JSON.parse(JSON.stringify(this.temp));
    //         addTtVideo(param).then((response) => {
    //           if (response.code == "success") {
    //             this.dialogFormVisible = false;
    //             this.loadPageData();
    //           }
    //           const data = this.formatJson(filterVal);
    //           excel.export_json_to_excel({
    //             header: tHeader,
    //             data,
    //             filename: "列表",
    //           });
    //           this.downloadLoading = false;
    //         });
    //       } else {
    //         this.errorMsg("下载数据失败");
    //       }
    //     })
    //     .catch((err) => {
    //       this.errorMsg();
    //     });
    // },
    formatJson(filterVal) {
      return this.allTableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        id: null,
        videoName: null,
        area: null,
        deviceSerial: null,
        channelNumber: null,
        sort: null,
        videoType: null,
        videoUrl: null,
        projectId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        type: 0,
        appKey: null,
        secret: null,
      };
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
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
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //增加
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.createBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          console.log(506, param);
          // if(param.videoUrl.)
          // if (param.videoUrl.indexOf("ezopen://open.ys7.com") != -1) {
          //   //这是iframe 接口 type =1
          //   param.type = 1;
          // } else if (param.videoUrl.indexOf("m3u8") != -1) {
          //   //这是m3u8 接口 type =0
          //   param.type = 0;
          // }else{
          //   //纯数字 走m3u8 接口 type =0
          //   param.type = 0;
          // }

          addTtVideo(param)
            .then((response) => {
              if (response.code == "success") {
                this.dialogFormVisible = false;
                this.loadPageData();
              }
              this.$notify({
                title: "操作提示",
                message: response.msg,
                type: response.code,
                duration: 2000,
              });
            })
            .catch((err) => {
              console.log(err);
              this.errorMsg();
            });
        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.updateBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          updateTtVideo(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageData();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });
          });
        }
      });
    },
    //弹出修改窗口之前，填充值
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogStatus = "update";
      this.temp = deepClone(scope.row);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    close() {
      this.imagecropperShow = false;
    },
    //错误提示
    errorMsg(msg) {
      if (!msg) msg = "服务器异常,稍后再试试";
      this.$notify({
        title: "操作提示",
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
}
.tablebox {
  height: calc(100% - 100px);
}
.el-pagination {
  margin-top: 20px;
}
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
.el-icon-male {
  color: #42b983;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-female {
  color: palevioletred;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-question {
  color: rebeccapurple;
  font-size: 20px;
  font-weight: bold;
}
</style>
