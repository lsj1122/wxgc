<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        clearable
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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button> -->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        @click="penLinSet"
      >
        服务器地址设置
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
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      height="calc(100vh - 260px)"
      stripe
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>

      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>

      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="machineFactory" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>

      <el-table-column prop="enterTime" label="进场时间" align="center">
      </el-table-column>

      <el-table-column prop="machineState" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.machineState == 0"
            >正常</el-tag
          >
          <el-tag
            type="info"
            effect="dark"
            v-else-if="scope.row.machineState == 1"
            >离线</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="350" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
          <el-button size="mini" type="primary" @click="searchForm(scope.row)"
            >查看</el-button
          >
          <el-button size="mini" type="info" @click="control(scope.row)"
            >设置</el-button
          >
          <el-button size="mini" type="warning" @click="lockXL(scope.row)"
            >锁机</el-button
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
      :before-close="cancel"
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
              <!-- <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="temp.machineName" placeholder="设备名称" />
              </el-form-item>
              <el-form-item label="设备编号" prop="machineNumber">
                <el-input v-model="temp.machineNumber" placeholder="设备编号" />
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
              <el-form-item label="实时数据间隔" prop="dataInterval">
                <el-input
                  v-model="temp.dataInterval"
                  placeholder="实时数据间隔"
                />
              </el-form-item>
              <el-form-item label="心跳包间隔" prop="heartbeatInterval">
                <el-input
                  v-model="temp.heartbeatInterval"
                  placeholder="心跳包间隔"
                />
              </el-form-item>
              <el-form-item label="锁机命令" prop="lockCommand">
                <el-input v-model="temp.lockCommand" placeholder="锁机命令" />
              </el-form-item>
              <el-form-item label="设备地址" prop="machineAdd">
                <el-input v-model="temp.machineAdd" placeholder="设备地址" />
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="temp.remarks" placeholder="备注" />
              </el-form-item>
              <el-form-item label="项目信息" prop="projectInformation">
                <el-input
                  v-model="temp.projectInformation"
                  placeholder="项目信息"
                />
              </el-form-item> -->
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
                  v-model="temp.enterTime"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="进场时间"
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
        <el-button @click="cancel">
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
    <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="0">
          <el-form :model="formData" label-width="160px" disabled>
            <el-row :gutter="20">
              <!-- <el-col :span="12">
                <el-form-item label="设备编号">
                  <el-input v-model="formData.machineNumber"></el-input>
                </el-form-item>
                <el-form-item label="协议版本号">
                  <el-input
                    v-model="formData.agreementVersionNumber"
                  ></el-input>
                </el-form-item>
                <el-form-item label="经度">
                  <el-input v-model="formData.lon"></el-input>
                </el-form-item>
                <el-form-item label="实时数据间隔">
                  <el-input v-model="formData.dataInterval"></el-input>
                </el-form-item>
                <el-form-item label="锁机命令">
                  <el-input v-model="formData.lockCommand"></el-input>
                </el-form-item>
                <el-form-item label="最大倾斜角度">
                  <el-input v-model="formData.maximumTiltAngle"></el-input>
                </el-form-item>
                <el-form-item label="重量空载实际值">
                  <el-input
                    v-model="formData.weightNoLoadActualValue"
                  ></el-input>
                </el-form-item>
                <el-form-item label="重量负载实际值">
                  <el-input v-model="formData.weightLoadActualValue"></el-input>
                </el-form-item>
                <el-form-item label="预警阈值">
                  <el-input v-model="formData.warningThreshold"></el-input>
                </el-form-item>
                <el-form-item label="匹配时间">
                  <el-input v-model="formData.matchingTime"></el-input>
                </el-form-item>
                <el-form-item label="项目id">
                  <el-input v-model="formData.projectId"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                  <el-input v-model="formData.createTime"></el-input>
                </el-form-item>
                <el-form-item label="设备地址">
                  <el-input v-model="formData.machineAdd"></el-input>
                </el-form-item>
                <el-form-item label="项目信息">
                  <el-input v-model="formData.projectInformation"></el-input>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="12">
                <el-form-item label="厂商代码">
                  <el-input v-model="formData.vendorCode"></el-input>
                </el-form-item>
                <el-form-item label="物联网卡号">
                  <el-input v-model="formData.iotCardNo"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                  <el-input v-model="formData.lat"></el-input>
                </el-form-item>
                <el-form-item label="心跳包间隔">
                  <el-input v-model="formData.heartbeatInterval"></el-input>
                </el-form-item>
                <el-form-item label="额定载重">
                  <el-input v-model="formData.ratedLoad"></el-input>
                </el-form-item>
                <el-form-item label="设备状态">
                  <el-input
                    :value="
                      formData.machineState == 0
                        ? ' 正常'
                        : formData.machineState == 1
                        ? '离线'
                        : ''
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item label="重量空载采样值">
                  <el-input
                    v-model="formData.weightNoLoadSamplingValue"
                  ></el-input>
                </el-form-item>
                <el-form-item label="重量负载采样值">
                  <el-input v-model="formData.weightLoadSampleValue"></el-input>
                </el-form-item>
                <el-form-item label="报警阈值">
                  <el-input v-model="formData.alarmThreshold"></el-input>
                </el-form-item>
                <el-form-item label="匹配状态">
                  <el-input
                    :value="
                      formData.matchingState == 0
                        ? ' 已匹配'
                        : formData.matchingState == 1
                        ? '未匹配'
                        : ''
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item label="转发id集合">
                  <el-input v-model="formData.projectChildrenIds"></el-input>
                </el-form-item>
                <el-form-item label="设备ip">
                  <el-input v-model="formData.machineIp"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formData.remarks"></el-input>
                </el-form-item>
              </el-col> -->

              <el-col :span="12">
                <el-form-item label="额定载重（kg）">
                  <el-input v-model="formData.ratedLoad"></el-input>
                </el-form-item>
                <el-form-item label="重量空载采样值">
                  <el-input
                    v-model="formData.weightNoLoadSamplingValue"
                  ></el-input>
                </el-form-item>
                <el-form-item label="重量负载采样值">
                  <el-input v-model="formData.weightLoadSampleValue"></el-input>
                </el-form-item>
                <el-form-item label="报警阈值">
                  <el-input v-model="formData.alarmThreshold"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大倾斜角度">
                  <el-input v-model="formData.maximumTiltAngle"></el-input>
                </el-form-item>
                <el-form-item label="重量空载实际值">
                  <el-input
                    v-model="formData.weightNoLoadActualValue"
                  ></el-input>
                </el-form-item>
                <el-form-item label="重量负载实际值">
                  <el-input v-model="formData.weightLoadActualValue"></el-input>
                </el-form-item>
                <el-form-item label="预警阈值">
                  <el-input v-model="formData.warningThreshold"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="转发信息" name="1"></el-tab-pane>
        <el-tab-pane label="传感器标定信息" name="2"></el-tab-pane>
        <el-tab-pane label="限位设置信息" name="3"></el-tab-pane> -->
      </el-tabs>
    </el-dialog>
    <el-dialog
      title="服务器地址设置"
      :visible.sync="mydialog"
      width="45%"
      :close-on-click-modal="false"
      :before-close="cancelForm"
    >
      <el-form
        ref="myForm"
        :rules="myrules"
        :model="myForm"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-form-item label="厂商代码" prop="vendorCodes">
          <el-input
            v-model="myForm.vendorCodes"
            placeholder="厂商代码"
            disabled
          />
        </el-form-item>
        <el-form-item label="设备编号" prop="machineNumbers">
          <el-input
            v-model="myForm.machineNumbers"
            placeholder="设备编号"
            disabled
          />
        </el-form-item>
        <el-form-item label="协议版本号" prop="agreementVersionNumbers">
          <el-input
            v-model="myForm.agreementVersionNumbers"
            disabled
            placeholder="协议版本号"
          />
        </el-form-item>
        <el-form-item label="IP地址或域名" prop="ip">
          <el-input v-model="myForm.ip" placeholder="IP地址或域名" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="myForm.port" placeholder="端口号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="setAdrr">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
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
  lockXL,
  machineRegisterXL,
} from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata";
import uploadFile from "@/components/Upload/uploadFile";
import {
  getPageTtXlpt,
  getAllTtTd,
  addTtXlpt,
  updateTtXlpt,
  deleteTtXlpt,
  selectone,
  unloadingPlatformControl,
} from "./api/ttxlpt.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";
import { simpleUploads } from "@/views/sysproject/api/ttfile"; // secondary package based on el-pagination
export default {
  name: "xlmachine",
  components: { Pagination, uploadFile },
  data() {
    return {
      dialogControlVisible: false, // 设置
      registerReturnJson: {},
      controlForm: {},

      options: ["单笼", "双笼"],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineNumber" },
        { label: "设备厂家", field: "machineFactory" },
        { label: "项目名称", field: "projectName" },
        { label: "进场时间", field: "enterTime" },
        { label: "设备状态", field: "machineState" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineNumber: undefined,
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
        machineName: null,
        machineNumber: null,
        projectName: null,
        dataInterval: 20,
        heartbeatInterval: 30,
        lockCommand: 0,
        machineAdd: null,
        remarks: null,
        projectInformation: null,
        projectId: "",
      },
      rules: {
        //校验功能
        machineName: [
          {
            required: true,
            message: "必填设备名称",
            trigger: ["blur", "change"],
          },
        ],
        machineNumber: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        hostNumber: [
          {
            required: true,
            message: "必填主机编号",
            trigger: ["blur", "change"],
          },
        ],
        enterTime: [
          {
            required: true,
            message: "必填进场时间",
            trigger: ["blur", "change"],
          },
        ],
        machineFactory: [
          {
            required: true,
            message: "必填设备厂家",
            trigger: ["blur", "change"],
          },
        ],
        port: [
          {
            required: true,
            message: "必填端口号",
            trigger: ["blur", "change"],
          },
        ],
      },
      dialogVisible: false,
      activeName: "0",
      formData: {},
      projectIdList: [],
      mydialog: false,
      myForm: {
        vendorCodes: [],
        machineNumbers: [],
        agreementVersionNumbers: [],
        ip: "",
        port: "",
      },
      myrules: {
        vendorCodes: [
          {
            required: true,
            message: "必填厂商代码",
            trigger: ["blur", "change"],
          },
        ],
        machineNumbers: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        ip: [
          {
            required: true,
            message: "必填IP地址或域名",
            trigger: ["blur", "change"],
          },
        ],
        port: [
          {
            required: true,
            message: "必填端口号",
            trigger: ["blur", "change"],
          },
        ],
      },
      multipleSelection: [],
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
    searchForm(row) {
      this.dialogVisible = true;
      selectone(row.id).then((res) => {
        if (res.code == "success") {
          this.formData = res.data;
        }
      });
    },
    cancel() {
      this.resetTemp();
      this.dialogFormVisible = false;
    },
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtXlpt(rows[index].id);
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
      getPageTtXlpt(this.listQuery)
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
      getPageTtXlpt({ ...this.listQuery })
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].matchingState =
                this.allTableData[i].matchingState == 0
                  ? "已匹配"
                  : this.allTableData[i].matchingState == 1
                  ? "未匹配"
                  : "";
              this.allTableData[i].machineState =
                this.allTableData[i].machineState == 0
                  ? "正常"
                  : this.allTableData[i].machineState == 1
                  ? "故障"
                  : "";
            }
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
                filename: "列表",
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
          if (j === "machineState") {
            return v[j] == 0 ? "正常" : v[j] == 1 ? "离线" : "";
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
        machineName: null,
        machineNumber: null,
        projectName: null,
        dataInterval: 20,
        heartbeatInterval: 30,
        lockCommand: 0,
        machineAdd: null,
        remarks: null,
        projectInformation: null,
        createBy: this.$store.getters.name,
        projectName: "",
        projectId: "",
      };
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
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
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtXlpt(param)
            .then((response) => {
              if (response.code == "success") {
                this.cancel();
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
          updateTtXlpt(param).then((response) => {
            if (response.code == "success") {
              this.cancel();
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    penLinSet() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: "请先选中",
          type: "warning",
        });
        return;
      } else {
        this.mydialog = true;
        this.myForm = {
          machineNumbers: [],
          vendorCodes: [],
          agreementVersionNumbers: [],
        };
        let arr = [];
        this.multipleSelection.forEach((item) => {
          // arr.push(item.machineNumber);
          this.myForm.machineNumbers.push(item.machineNumber);
          this.myForm.vendorCodes.push(item.vendorCode);
          this.myForm.agreementVersionNumbers.push(item.agreementVersionNumber);
        });
        // this.myForm.machineNumbersString = arr.join(";");
        // 操作
        this.$nextTick(() => {
          this.$refs["myForm"].clearValidate();
        });
      }
    },
    setAdrr() {
      this.$refs.myForm.validate((valid) => {
        if (valid) {
          unloadingPlatformControl(this.myForm).then((res) => {
            if (res.code == "success") {
              this.mydialog = false;
              this.loadPageData();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });
          });
        } else return;
      });
    },
    cancelForm() {
      this.myForm = {};
      this.mydialog = false;
      this.$nextTick(() => {
        this.$refs["myForm"].clearValidate();
      });
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
          machineRegisterXL(
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
    // 锁机按钮
    lockXL(row) {
      this.$confirm("此操作将该设备锁机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          lockXL(row.id)
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("锁机成功");
              }
            })
            .catch((error) => {
              this.$message.error("锁机失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消锁机",
          });
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
