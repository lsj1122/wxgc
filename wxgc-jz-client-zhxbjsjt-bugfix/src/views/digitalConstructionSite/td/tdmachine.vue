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
      stripe
      fit
      height="calc(100vh - 250px)"
      highlight-current-row
    >
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

      <!-- <el-table-column prop="machineModel" label="设备型号" align="center">
      </el-table-column> -->

      <el-table-column prop="machineFactory" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>

      <el-table-column prop="enterTime" label="进场时间" align="center">
      </el-table-column>

      <!-- <el-table-column prop="machineType" label="设备类型" align="center">
      </el-table-column>

      <el-table-column prop="name" label="司机姓名" align="center">
      </el-table-column>

      <el-table-column prop="phone" label="手机号码" align="center">
      </el-table-column>

      <el-table-column prop="iotCardNumber" label="作业证编号" align="center">
      </el-table-column> -->
      <el-table-column prop="machineState" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.machineState == 0"
            type="success"
            effect="dark"
            >在线
          </el-tag>
          <el-tag v-if="scope.row.machineState == 1" type="info" effect="dark"
            >离线
          </el-tag>
          <el-tag v-if="scope.row.machineState == 2" type="danger" effect="dark"
            >报警
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="350" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑
          </el-button>
          <el-button size="mini" type="primary" @click="searchForm(scope.row)"
            >查看
          </el-button>
          <el-button size="mini" type="info" @click="handleSettings(scope.row)"
            >设置
          </el-button>
          <el-button size="mini" type="warning" @click="lockTd(scope.row)"
            >锁机
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删除
          </el-button>
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
          <el-col :span="24">
            <div class="grid-content bg-purple">
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

              <el-form-item label="产权备案号" prop="propertyNo">
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

              <el-form-item label="产权单位" prop="propertyCompany">
                <el-input
                  v-model="temp.propertyCompany"
                  placeholder="产权单位"
                />
              </el-form-item>
              <el-form-item label="安装单位" prop="installCompany">
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
        <el-tab-pane label="基本属性" name="0"></el-tab-pane>
        <!-- <el-tab-pane label="转发信息" name="1"></el-tab-pane> -->
        <el-tab-pane label="传感器标定信息" name="2"></el-tab-pane>
        <el-tab-pane label="报警信息" name="3"></el-tab-pane>
      </el-tabs>
      <el-form
        :model="formData"
        label-width="160px"
        disabled
        v-loading="loading"
      >
        <div v-if="activeName == 0">
          <el-form-item label="设备编号">
            <el-input v-model="formData.machineNumber"></el-input>
          </el-form-item>
          <el-form-item label="吊笼类型">
            <el-input
              :value="
                formData.cageType == 0
                  ? '单笼'
                  : formData.cageType == 1
                  ? '左笼'
                  : formData.cageType == 2
                  ? '右笼'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="当前楼高(m)">
            <el-input v-model="formData.currentHeight"></el-input>
          </el-form-item>
          <el-form-item label="最大楼层(层)">
            <el-input v-model="formData.maxFloor"></el-input>
          </el-form-item>
          <el-form-item label="最小楼层(层)">
            <el-input v-model="formData.minFloor"></el-input>
          </el-form-item>
          <el-form-item label="额定人数/最大承载人数">
            <el-input v-model="formData.specificPersons"></el-input>
          </el-form-item>
          <el-form-item label="额定载重(kg)">
            <el-input v-model="formData.specificLoad"></el-input>
          </el-form-item>
          <el-form-item label="额定上行速度(m/s)">
            <el-input v-model="formData.specificUpSpeed"></el-input>
          </el-form-item>
          <el-form-item label="额定下行速度(m/s)">
            <el-input v-model="formData.specificDownSpeed"></el-input>
          </el-form-item>
          <el-form-item label="高度传感器">
            <el-input
              :value="
                formData.heightSensor == 0
                  ? '关闭'
                  : formData.heightSensor == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="重量传感器">
            <el-input
              :value="
                formData.weightSensor == 0
                  ? '关闭'
                  : formData.weightSensor == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="倾角传感器">
            <el-input
              :value="
                formData.angleSensor == 0
                  ? '关闭'
                  : formData.angleSensor == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="风速传感器">
            <el-input
              :value="
                formData.windSensor == 0
                  ? '关闭'
                  : formData.windSensor == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="人脸识别">
            <el-input
              :value="
                formData.faceRecognition == 0
                  ? '关闭'
                  : formData.faceRecognition == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="电梯抓拍">
            <el-input
              :value="
                formData.elevatorSnapshot == 0
                  ? '关闭'
                  : formData.elevatorSnapshot == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="人数识别">
            <el-input
              :value="
                formData.helmetMonitor == 0
                  ? '关闭'
                  : formData.helmetMonitor == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="防坠器在位监测">
            <el-input
              :value="
                formData.fallArresterMonitor == 0
                  ? '关闭'
                  : formData.fallArresterMonitor == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="GPS功能">
            <el-input
              :value="
                formData.gpsFunction == 0
                  ? '关闭'
                  : formData.gpsFunction == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="制动控制">
            <el-input
              :value="
                formData.brakeControl == 0
                  ? '关闭'
                  : formData.brakeControl == 1
                  ? '启用'
                  : ''
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="保留">
            <el-input v-model="formData.test"></el-input>
          </el-form-item>
        </div>
        <!-- <div v-if="activeName == 1">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备IP">
                <el-input v-model="formData.test"></el-input>
              </el-form-item>
              <el-form-item label="吊笼编号">
                <el-input v-model="formData.test"></el-input>
              </el-form-item>

              <el-form-item label="人脸识别照片">
                <el-input v-model="formData.picture"></el-input>
              </el-form-item>

              <el-form-item label="风速校准">
                <el-input v-model="formData.windCalibrate"></el-input>
              </el-form-item>
              <el-form-item label="备案编号">
                <el-input v-model="formData.propertyNo"></el-input>
              </el-form-item>
              <el-form-item label="司机姓名">
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="数据间隔">
                <el-input v-model="formData.uploadDate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="吊笼类型">
                <el-input v-model="formData.cageType"></el-input>
              </el-form-item>

              <el-form-item label="电梯抓拍照片">
                <el-input v-model="formData.elevatorSnapshot"></el-input>
              </el-form-item>

              <el-form-item label="转发">
                <el-input v-model="formData.test"></el-input>
              </el-form-item>
              <el-form-item label="施工楼号">
                <el-input v-model="formData.test"></el-input>
              </el-form-item>
              <el-form-item label="司机联系电话">
                <el-input v-model="formData.phone"></el-input>
              </el-form-item>
              <el-form-item label="物联网卡">
                <el-input v-model="formData.iotCardNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
        <div v-if="activeName == 2">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="认证有效时间(s)">
                <el-input v-model="formData.validCertify"></el-input>
              </el-form-item>
              <el-form-item label="一楼净高(m)">
                <el-input v-model="formData.firstFloorHeight"></el-input>
              </el-form-item>
              <el-form-item label="其他楼净高(m)">
                <el-input v-model="formData.otherFloorHeight"></el-input>
              </el-form-item>
              <el-form-item label="重量空载AD定值">
                <el-input v-model="formData.weightNoLoadSample"></el-input>
              </el-form-item>
              <el-form-item label="重量负载AD定值">
                <el-input v-model="formData.weightLoadSample"></el-input>
              </el-form-item>
              <el-form-item label="高度底端AD值">
                <el-input v-model="formData.heightBottomSample"></el-input>
              </el-form-item>
              <el-form-item label="高度顶端AD值">
                <el-input v-model="formData.heightTopSample"></el-input>
              </el-form-item>
              <el-form-item label="倾角X轴零点校准">
                <el-input v-model="formData.angleXCalibrate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二楼净高(m)">
                <el-input v-model="formData.secondFloorHeight"></el-input>
              </el-form-item>
              <el-form-item label="重量空载实际值(kg)">
                <el-input v-model="formData.weightNoLoadReal"></el-input>
              </el-form-item>
              <el-form-item label="重量负载实际值(kg)">
                <el-input v-model="formData.weightLoadReal"></el-input>
              </el-form-item>
              <el-form-item label="高度底端实际值(m)">
                <el-input v-model="formData.heightBottomReal"></el-input>
              </el-form-item>
              <el-form-item label="高度顶端实际值(m)">
                <el-input v-model="formData.heightTopReal"></el-input>
              </el-form-item>
              <el-form-item label="倾角Y轴零点校准">
                <el-input v-model="formData.angleYCalibrate"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="activeName == 3">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="重量比率报警阈值(%)">
                <el-input v-model="formData.weightRatioError"></el-input>
              </el-form-item>
              <el-form-item label="速度比率报警阈值(%)">
                <el-input v-model="formData.speedRatioError"></el-input>
              </el-form-item>
              <el-form-item label="风速报警阈值(m/s)">
                <el-input v-model="formData.windError"></el-input>
              </el-form-item>
              <el-form-item label="倾角报警阈值(°)">
                <el-input v-model="formData.angleError"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量比率预警阈值(%)">
                <el-input v-model="formData.weightRatioWarning"></el-input>
              </el-form-item>
              <el-form-item label="速度比率预警阈值(%)">
                <el-input v-model="formData.speedRatioWarning"></el-input>
              </el-form-item>
              <el-form-item label="风速预警阈值(m/s)">
                <el-input v-model="formData.windWarning"></el-input>
              </el-form-item>
              <el-form-item label="倾角预警阈值(°)">
                <el-input v-model="formData.angleWarning"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-dialog>
    <!--控制水泥标养室-->
    <el-dialog
      title="塔机设置"
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
import uploadFile from "@/components/Upload/uploadFile";
import {
  getPageTtTd,
  getAllTtTd,
  addTtTd,
  updateTtTd,
  deleteTtTd,
  selectSingle,
  machineRegisterTd,
  lockTd,
} from "./api/tttd.js";
import { deepClone, parseTime } from "@/utils";
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";

import Pagination from "@/components/Pagination";
import { simpleUploads } from "@/views/sysproject/api/ttfile"; // secondary package based on el-pagination
export default {
  name: "tdmachine",
  components: { Pagination, uploadFile },
  data() {
    return {
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
        id: undefined,
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
        hostId: null,
        propertyNo: null,
        matchTime: null,
        machineType: null,
        video: null,
        propertyCompany: null,
        installCompany: null,
        specification: null,
        projectName: "",
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
        machineFactory: [
          {
            required: true,
            message: "必填设备厂家",
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
      },
      dialogVisible: false,
      activeName: "0",
      formData: {},
      loading: false,
      projectIdList: [],
      controlForm: {},
      registerReturnJson: null,
      dialogControlVisible: false,
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
    // 点击设置按钮
    handleSettings(row) {
      if (row.registerReturnJson) {
        this.controlForm = this.$options.data().controlForm;
        this.registerReturnJson = JSON.parse(row.registerReturnJson);
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
    // 设置对话框确认
    settingsBys() {
      this.$refs.dialogSettingForm.validate((valid) => {
        if (valid) {
          // 组装数据
          this.registerReturnJson.forEach((item) => {
            item.val = this.controlForm[item.name];
          });
          machineRegisterTd(
            { list: this.registerReturnJson },
            this.controlForm.id
          )
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("设置成功！");
                this.dialogControlVisible =false
              }
            })
            .catch((res) => {
              this.$message.error("设置失败！");
                this.dialogControlVisible =false
            });
        }
      });
    },
    // 锁机按钮
    lockTd(row) {
      this.$confirm("此操作将该设备锁机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          lockTd(row.id)
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
      this.loading = true;
      selectSingle(row.id).then((res) => {
        if (res.code == "success") {
          this.loading = false;
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
          let res = await deleteTtTd(rows[index].id);
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
      getPageTtTd(this.listQuery)
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
      getPageTtTd({ ...this.listQuery })
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].machineState =
                this.allTableData[i].machineState == 0
                  ? "在线"
                  : this.allTableData[i].machineState == 1
                  ? "离线"
                  : this.allTableData[i].machineState == 2
                  ? "报警"
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
        machineName: null,
        machineNumber: null,
        hostId: null,
        propertyNo: null,
        matchTime: null,
        machineType: null,
        video: null,
        propertyCompany: null,
        installCompany: null,
        specification: null,
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
          simpleUploads(this.fileList).then((res) => {
            this.temp.picture = res[0];
            this.temp.createBy = this.$store.getters.name;
            let param = JSON.parse(JSON.stringify(this.temp));
            addTtTd(param)
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
          });
        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          simpleUploads(this.fileList).then((res) => {
            this.temp.picture = res[0];
            this.temp.updateBy = this.$store.getters.name;
            let param = JSON.parse(JSON.stringify(this.temp));
            updateTtTd(param).then((response) => {
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
