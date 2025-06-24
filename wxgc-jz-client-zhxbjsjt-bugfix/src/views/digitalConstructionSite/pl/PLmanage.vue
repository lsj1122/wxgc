<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNum"
        placeholder="设备编号"
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
      <!-- <el-button class="filter-item" type="success" @click="handlePLNew">
        {{ $t("喷淋设置") }}
      </el-button> -->
    </div>
    <!--显示列表-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      height="calc(100vh - 260px)"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <!--      <el-table-column prop="machineOrder" label="设备序号" align="center">-->
      <!--      </el-table-column>-->

<!--      <el-table-column type="selection" width="55"> </el-table-column>-->
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="machineNum" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="machineFactory" label="设备厂家" align="center">
      </el-table-column>

      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="enterTime" label="进场时间" align="center">
      </el-table-column>
      <!--  -->
      <!-- <el-table-column prop="matchStatus" label="匹配状态" align="center">
      </el-table-column>
      <el-table-column prop="matchTime" label="匹配时间" align="center">
      </el-table-column> -->

      <el-table-column prop="machineStatus" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.machineStatus == 0"
            >在线</el-tag
          >
          <el-tag
            type="info"
            effect="dark"
            v-else-if="scope.row.machineStatus == 1"
            >离线</el-tag
          >
          <!-- <el-tag type="danger"  effect="dark" v-else>报警</el-tag> -->
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="400" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
          <el-button size="mini" type="primary" @click="lookOneInfoPL(scope)"
            >查看</el-button
          >
          <el-button size="mini" type="info" @click="control(scope.row)"
            >设置</el-button
          >
          <!-- <el-button size="mini">转发</el-button> -->
          <el-button size="mini" type="success" @click="handlePLNew(scope)">
            {{ $t("喷淋设置") }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
              <!-- 这里  只有 添加 -->
              <div v-if="dialogStatus == 'create'">
                <el-form-item label="设备序号" prop="machineOrder">
                  <el-input
                    v-model="temp.machineOrder"
                    placeholder="设备序号"
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="设备编号" prop="machineNum">
                  <el-input
                    v-model="temp.machineNum"
                    placeholder="设备编号"
                    type="number"
                  />
                </el-form-item>
              </div>

              <!-- 这里共有 -->
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="temp.machineName" placeholder="设备名称" />
              </el-form-item>

              <el-form-item label="设备厂家" prop="machineFactory">
                <el-input
                  v-model="temp.machineFactory"
                  placeholder="设备厂家"
                />
              </el-form-item>
              <el-form-item label="所属项目" prop="projectId">
                <el-cascader
                  style="width: 100%"
                  ref="cascaderArr"
                  v-model="temp.projectId"
                  :options="projectIdList"
                  @change="handleChange"
                  :show-all-levels="false"
                  :props="{ checkStrictly: true }"
                ></el-cascader>
              </el-form-item>

              <el-form-item label="产权备案号">
                <el-input v-model="temp.propertyNo" placeholder="产权备案号" />
              </el-form-item>

              <el-form-item label="进场时间" prop="enterTime">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="temp.enterTime"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="产权单位">
                <el-input
                  v-model="temp.propertyCompany"
                  placeholder="产权单位"
                />
              </el-form-item>
              <el-form-item label="安装单位">
                <el-input
                  v-model="temp.installCompany"
                  placeholder="安装单位"
                />
              </el-form-item>
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
        <!-- <el-button type="primary" @click="updateData()">
          {{ $t("table.confirm") }}
        </el-button> -->
      </div>
    </el-dialog>
    <!-- 喷淋设置 -->
    <el-dialog
      :title="titleComment"
      :visible.sync="dialogFormVisiblePL"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormPL"
        :rules="rulesPL"
        :model="tempPL"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row v-if="titleComment == '喷淋设置'">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备序号" prop="machineNum">
                <el-input
                  v-model="tempPL.machineNum"
                  placeholder="设备序号"
                  disabled
                />
              </el-form-item>
              <el-form-item label="设备编号" prop="machineOrder">
                <el-input
                  v-model="tempPL.machineOrder"
                  placeholder=" 设备编号"
                  disabled
                />
              </el-form-item>
              <el-form-item label="工作时间(s)" prop="sprayPeriod">
                <el-input
                  type="number"
                  v-model="tempPL.sprayPeriod"
                  placeholder="工作时间(s)"
                />
              </el-form-item>
              <el-form-item label="喷淋开关" prop="taskType">
                <el-radio-group v-model="tempPL.taskType">
                  <el-radio :label="0">立即执行</el-radio>
                  <el-radio :label="1">延迟执行</el-radio>
                  <el-radio :label="2">定时执行</el-radio>
                  <el-radio :label="3">关闭定时</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="延迟时间(s)"
                prop="delay"
                v-if="tempPL.taskType && tempPL.taskType == 1"
              >
                <el-input
                  type="number"
                  v-model="tempPL.delay"
                  placeholder="延迟时间(s)"
                  class="input-with-select"
                >
                  <el-select
                    v-model="tempPL.unit"
                    slot="append"
                    placeholder="请选择单位"
                    style="width: 110px"
                  >
                    <el-option label="s(秒)" value="s"></el-option>
                    <el-option label="h(小时)" value="h"></el-option>
                    <el-option label="d(天)" value="d"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>

              <el-form-item
                label="cron表达式"
                prop="cron"
                v-if="tempPL.taskType && tempPL.taskType == 2"
              >
                <el-input
                  v-model="tempPL.cron"
                  placeholder="请输入cron执行表达式"
                >
                  <template slot="append">
                    <el-button type="primary" @click="handleShowCron">
                      生成表达式
                      <i class="el-icon-time el-icon--right"></i>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row v-if="titleComment == '喷淋查看'">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备编号" prop="">
                <el-input v-model="tempPL.machineNum" placeholder="" disabled />
              </el-form-item>
              <el-form-item label="所属项目" prop="">
                <el-input
                  v-model="tempPL.projectName"
                  placeholder=""
                  disabled
                />
              </el-form-item>
              <el-form-item label="设备状态">
                <el-input
                  :value="
                    tempPL.machineStatus == 0
                      ? '在线'
                      : tempPL.machineStatus == 1
                      ? '离线'
                      : ''
                  "
                  placeholder=""
                  disabled
                />
              </el-form-item>
              <el-form-item label="定时状态">
                <el-input
                  disabled
                  :value="
                    tempPL.taskStatus == null
                      ? '无任务'
                      : tempPL.taskStatus == 0
                      ? '运行中'
                      : tempPL.taskStatus == 1
                      ? '暂停中'
                      : ''
                  "
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="定时周期">
                <el-input disabled v-model="tempPL.cron" placeholder="" />
              </el-form-item>

              <el-form-item label="下次喷淋时间">
                <el-input
                  disabled
                  v-model="tempPL.nextTaskTime"
                  placeholder=""
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblePL = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="upDataPL"
          v-if="titleComment == '喷淋设置'"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="Cron表达式生成器"
      :visible.sync="openCron"
      append-to-body
      destroy-on-close
      class="scrollbar"
    >
      <crontab
        @hide="openCron = false"
        @fill="crontabFill"
        :expression="expression"
      ></crontab>
    </el-dialog>

    <!--  点击设置页面 -->
    <el-dialog
      title="设置"
      :visible.sync="dialogControlVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dialogSettingForm"
        :rules="rules"
        :model="controlForm"
        label-position="right"
        label-width="140px"
        style="margin-left: 5px"
      >
        <el-form-item
          :label="item.desc"
          :prop="item.name"
          v-for="item in registerReturnJson"
          :key="item"
        >
          <el-input v-model="controlForm[item.name]" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogControlVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="settingsBys">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  upDataPL,
  addPL,
  getPagePL,
  updatePL,
  deletePL,
} from "./api/comment.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";
import { machineRegisterPL } from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata";
import Crontab from "@/components/Crontab";
export default {
  name: "machine",
  components: { Pagination, Crontab },
  data() {
    return {
      dialogControlVisible: false, // 设置
      registerReturnJson: {},
      controlForm: {},

      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: "",
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineNum" },
        { label: "设备厂家", field: "machineFactory" },
        { label: "项目名称", field: "projectName" },
        { label: "进场时间", field: "enterTime" },
        { label: "设备状态", field: "machineStatus" },
        { label: "喷淋状态", field: "sprayStatus" },
      ],
      titleComment: "",
      dialogFormVisiblePL: false,
      tempPL: {
        machineOrder: null,
        machineNum: null,
        sprayStatus: null,
        sprayPeriod: 30,
      },

      rulesPL: {
        //校验功能
        machineOrder: [
          {
            required: true,
            message: "设备序号",
            trigger: ["blur", "change"],
          },
        ],
        machineNum: [
          {
            required: true,
            message: "设备编号",
            trigger: ["blur", "change"],
          },
        ],
        taskType: [
          {
            required: true,
            message: "喷淋状态",
            trigger: ["blur", "change"],
          },
        ],
        delay: [
          {
            required: true,
            message: "延迟时间",
            trigger: ["blur", "change"],
          },
        ],
        delay: [
          {
            required: true,
            message: "延迟时间",
            trigger: ["blur", "change"],
          },
        ],
        cron: [
          {
            required: true,
            message: "cron执行表达式不能为空",
            trigger: "blur",
          },
        ],
         sprayPeriod: [
          {
            required: true,
            message: "工作时间(s)",
            trigger: ["blur", "change"],
          },
        ],
      },

      options: [
        {
          value: 0,
          label: "未匹配",
        },
        {
          value: 1,
          label: "已匹配",
        },
      ],
      multipleSelection: [],
      tableData: [], //当前分页数据
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        machineFactory: undefined,
        innerDate: undefined,
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
      temp: {},
      rules: {
        //校验功能
        machineOrder: [
          {
            required: true,
            message: "设备序号",
            trigger: ["blur", "change"],
          },
        ],
        machineNum: [
          {
            required: true,
            message: "设备编号",
            trigger: ["blur", "change"],
          },
        ],
        machineName: [
          {
            required: true,
            message: "设备名称",
            trigger: ["blur", "change"],
          },
        ],
        machineFactory: [
          {
            required: true,
            message: "设备厂家",
            trigger: ["blur", "change"],
          },
        ],
        enterTime: [
          {
            required: true,
            message: "进场时间",
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
  created() {
    getPageSysProject({ pageIndex: 1, pageSize: -1 }).then((res) => {
      this.projectIdList = this.handleProject(res.data.records);
    });
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.tempPL.cron;
      this.openCron = true;
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.tempPL.cron = value;
    },
    lookOneInfoPL(scope) {
      this.titleComment = "喷淋查看";
      this.dialogFormVisiblePL = true;
      this.tempPL = scope.row;

    },
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
    upDataPL() {
      console.log("tempPL", this.tempPL);
      this.$refs["dataFormPL"].validate((valid) => {
        if (valid) {
          upDataPL(this.tempPL)
            .then((response) => {
              if (response.code == "success") {
                this.dialogFormVisiblePL = false;
                this.loadPageData();
              }
              this.$notify({
                title: "操作提示",
                message: response.msg,
                type: response.code,
                duration: 3000,
              });
            })
            .catch((err) => {
              console.log(err);
              this.errorMsg();
            });
        }
      });
    },
    handlePLNew(scope) {
      this.titleComment = "喷淋设置";
      this.dialogFormVisiblePL = true;

      this.tempPL = {
        deviceId: scope.row.id,
        cron: "",
        delay: 0,
        // 设备类型 0 扬尘检测、1 喷淋设备
        deviceType: 1,
        taskType: 0,
        unit: "s",
        sprayPeriod:30,
        machineNum: scope.row.machineNum,
        machineOrder: scope.row.machineOrder,
      };

      this.$nextTick(() => {
        this.$refs["dataFormPL"].clearValidate();
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除单行
    deleteRow(index, rows) {
      let _this = this;
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deletePL(rows[index].id);
          if (res.code == "success") {
            if (rows.length == 1) {
              this.listQuery.pageIndex =
                this.listQuery.pageIndex - 1 >= 1
                  ? this.listQuery.pageIndex - 1
                  : 1;
              _this.loadPageData();
            } else {
              rows.splice(index, 1);
            }
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
      getPagePL(this.listQuery)
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

    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        id: null,
        machineOrder: null,
        machineNum: null,
        machineModel: null,
        machineFactory: null,
        innerDate: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        projectId: "",
        projectName: "",
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
          // this.temp.projectId = this.$store.getters.projectId;
          // this.temp.projectName = this.$store.getters.projectName;
        this.temp.projectChildrenIds = this.$store.getters.projectChildrenIds
          let param = JSON.parse(JSON.stringify(this.temp));
          console.log("参数",param);
          addPL(param)
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
          let param = JSON.parse(JSON.stringify(this.temp));
          updatePL(param).then((response) => {
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
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPagePL(this.listQuery)
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
                filename: "喷淋设备管理",
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
            if (j == "machineStatus") {
              var name = v[j] == 0 ? "在线" : v[j] == 1 ? "离线" : "";
              return name;
            } else if (j == "sprayStatus") {
              var name = v[j] == 0 ? "关闭" : v[j] == 1 ? "开启" : "";
              return name;
            } else {
              return v[j];
            }
          }
        })
      );
    },
    // 点击控制按钮
    control(row) {
      console.log(row);
      if (row.registerReturnJson) {
        this.controlForm = this.$options.data().controlForm;
        this.registerReturnJson = JSON.parse(row.registerReturnJson);
        console.log(this.registerReturnJson);
        this.registerReturnJson.forEach((item) => {
          // 初始化设置表单值
          this.$set(this.controlForm, item.name, item.val);
          // 初始化设置表单效验
          this.$set(this.rules, item.name, [
            {
              required: true,
              message: `必填${item.desc}`,
              trigger: ["blur", "change"],
            },
          ]);
        });
        this.controlForm.id = row.id;
        this.dialogControlVisible = true;
        this.$nextTick(() => {
          this.$refs.dialogSettingForm.clearValidate();
        });
        return;
      }
      this.$message.warning("暂不可设置");
    },
    settingsBys() {
      let _this = this;
      this.$refs["dialogSettingForm"].validate((valid) => {
        if (valid) {
          // 组装数据
          this.registerReturnJson.forEach((item) => {
            item.val = this.controlForm[item.name];
          });
          machineRegisterPL(
            { list: this.registerReturnJson },
            this.controlForm.id
          )
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("设置成功！");
                // 关闭页面，刷新数据
                this.dialogControlVisible = false;
                _this.loadPageData();
              }
            })
            .catch((res) => {
              this.$message.error("设置失败！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
