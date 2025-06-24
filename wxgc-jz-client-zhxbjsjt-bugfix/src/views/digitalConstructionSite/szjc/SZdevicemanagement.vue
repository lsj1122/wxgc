<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("新增设备") }}
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

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        @click="yuZhiSet"
      >
        {{ $t("阈值设置") }}
      </el-button>
    </div>
    <!--显示列表-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      fit
      height="calc(100vh - 260px)"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column-->
      <!--        prop="machineOrderNumber"-->
      <!--        label="序号"-->
      <!--        align="center"-->
      <!--      >-->
      <!--      </el-table-column>-->
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="machineOrderNumber"
        label="设备序号"
        align="center"
      >
      </el-table-column> -->
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
            >在线</el-tag
          >
          <el-tag
            type="info"
            effect="dark"
            v-else-if="scope.row.machineState == 1"
            >离线</el-tag
          >
          <!-- <el-tag type="danger" effect="dark" v-else>报警</el-tag> -->
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="400">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
          <el-button size="mini" @click="lookOneInfo(scope)" type="primary"
            >查看</el-button
          >
          <el-button size="mini" type="info" @click="control(scope.row)"
            >设置</el-button
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
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="140px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24"
            ><div class="grid-content bg-purple">
              <div v-if="dialogStatus == 'create'">
                <el-form-item label="设备序号" prop="machineOrderNumber">
                  <el-input
                    type="number"
                    v-model="temp.machineOrderNumber"
                    placeholder="设备序号"
                    :disabled="dialogStatus == 'look'"
                  />
                </el-form-item>
                <el-form-item label="设备编号" prop="machineNumber">
                  <el-input
                    :disabled="dialogStatus == 'look'"
                    v-model="temp.machineNumber"
                    placeholder="设备编号"
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
          v-if="dialogStatus != 'look'"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- oneLook -->
    <el-dialog
      title="查看"
      :visible.sync="dialogFormVisibleOneLook"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormPL"
        :model="tempPL"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备序号">
              <el-input
                v-model="tempPL.machineOrderNumber"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号">
              <el-input
                v-model="tempPL.machineNumber"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浊度/NTU">
              <el-input
                v-model="tempPL.turbidityThreshold"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电导率报警阀值">
              <el-input
                v-model="tempPL.conductivityThreshold"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PH报警上限">
              <el-input
                v-model="tempPL.phThresholdUpper"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PH报警下限">
              <el-input
                v-model="tempPL.phThresholdLower"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水位报警上限/m">
              <el-input
                v-model="tempPL.waterThesholdUpper"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水位报警下限/m">
              <el-input
                v-model="tempPL.waterThesholdLower"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="氨氮报警阀值/ppm">
              <el-input
                v-model="tempPL.ammoniaNitrogenThreshold"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水位传感器量程/m">
              <el-input
                v-model="tempPL.rangeWaterSensor"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="污泥报警阀值/ mg/L">
              <el-input
                v-model="tempPL.sludgeYhreshold"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="上线时间">
              <el-input
                v-model="tempPL.machineName1"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下线时间">
              <el-input
                v-model="tempPL.machineName1"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleOneLook = false">
          {{ $t("table.cancel") }}
        </el-button>
      </div>
    </el-dialog>

    <!--  -->

    <!-- 阙值设置 -->
    <el-dialog
      title="阈值设置"
      :visible.sync="dialogFormVisibleQZ"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormQZ"
        :rules="rulesQZ"
        :model="tempQz"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="版本号" prop="">
              <el-input
                v-model="tempQz.vesionsString"
                placeholder=""
                disabled
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="设备序号" prop="">
              <el-input
                v-model="tempQz.machineOrderNumbersString"
                placeholder=""
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="machineNumbersString">
              <el-input
                v-model="tempQz.machineNumbersString"
                placeholder=""
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设置设备序号" prop="setMachineOrderNumber">
              <el-input
                type="number"
                v-model="tempQz.setMachineOrderNumber"
                placeholder="设置设备序号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浊度报警阈值" prop="turbidityThreshold">
              <el-input
                type="number"
                v-model="tempQz.turbidityThreshold"
                placeholder="浊度报警阈值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="PH报警上限(PH)" prop="phThresholdUpper">
              <el-input
                type="number"
                v-model="tempQz.phThresholdUpper"
                placeholder="PH报警上限(PH)"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="PH报警下限(PH)" prop="phThresholdLower">
              <el-input
                type="number"
                v-model="tempQz.phThresholdLower"
                placeholder="PH报警下限(PH)"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="水位报警上限(m)" prop="waterThesholdUpper">
              <el-input
                type="number"
                v-model="tempQz.waterThesholdUpper"
                placeholder="水位报警上限(m)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水位报警下限(m)" prop="waterThesholdLower">
              <el-input
                type="number"
                v-model="tempQz.waterThesholdLower"
                placeholder="(m)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="氨氮报警阈值" prop="ammoniaNitrogenThreshold">
              <el-input
                type="number"
                v-model="tempQz.ammoniaNitrogenThreshold"
                placeholder="氨氮报警阈值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="电导率报警阈值" prop="conductivityThreshold">
              <el-input
                type="number"
                v-model="tempQz.conductivityThreshold"
                placeholder="电导率报警阈值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="污泥报警阈值" prop="sludgeYhreshold">
              <el-input
                type="number"
                v-model="tempQz.sludgeYhreshold"
                placeholder="污泥报警阈值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="水位传感器量程(m)" prop="rangeWaterSensor">
              <el-input
                type="number"
                v-model="tempQz.rangeWaterSensor"
                placeholder="水位传感器量程(m)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleQZ = false">
          {{ $t("table.cancel") }}
        </el-button>

        <el-button type="primary" @click="upDataPL">
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
import { machineRegisterszjc } from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata";
import {
  getPageSZ,
  addSZ,
  updateSZ,
  lookOneInfoSZ,
  deleteSZ,
  waterQualityControl,
} from "./api/comment.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";
export default {
  name: "machine",
  components: { Pagination },
  data() {
    return {
      loadingLook: true,
      dialogControlVisible: false, // 设置
      registerReturnJson: {},
      controlForm: {},

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
      multipleSelection: [],
      dialogFormVisibleQZ: false,
      tempQz: {},
      rulesQZ: {
        setMachineOrderNumber: [
          {
            required: true,
            message: "必填设置设备序号",
            trigger: ["blur", "change"],
          },
        ],
        turbidityThreshold: [
          {
            required: true,
            message: "必填浊度报警阈值",
            trigger: ["blur", "change"],
          },
        ],
        phThresholdUpper: [
          {
            required: true,
            message: "必填PH报警上限",
            trigger: ["blur", "change"],
          },
        ],
        phThresholdLower: [
          {
            required: true,
            message: "必填PH报警下限",
            trigger: ["blur", "change"],
          },
        ],

        waterThesholdUpper: [
          {
            required: true,
            message: "必填水位报警上限",
            trigger: ["blur", "change"],
          },
        ],
        waterThesholdLower: [
          {
            required: true,
            message: "必填水位报警下限",
            trigger: ["blur", "change"],
          },
        ],

        ammoniaNitrogenThreshold: [
          {
            required: true,
            message: "必填氨氮报警阈值",
            trigger: ["blur", "change"],
          },
        ],
        conductivityThreshold: [
          {
            required: true,
            message: "必填电导率报警阈值",
            trigger: ["blur", "change"],
          },
        ],
        sludgeYhreshold: [
          {
            required: true,
            message: "必填污泥报警阈值",
            trigger: ["blur", "change"],
          },
        ],
        rangeWaterSensor: [
          {
            required: true,
            message: "必填水位传感器量程",
            trigger: ["blur", "change"],
          },
        ],
      },
      dialogFormVisibleOneLook: false,
      tableData: [], //当前分页数据
      tempPL: {},
      //表头（主要是下载excel时候使用）
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineNumber: null,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
        look: "查看",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {},
      rules: {
        //校验功能

        machineOrderNumber: [
          {
            required: true,
            message: "必填设备序号",
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
      this.$refs["dataFormQZ"].validate((valid) => {
        if (valid) {
          waterQualityControl(this.tempQz)
            .then((response) => {
              if (response.code == "success") {
                this.dialogFormVisibleQZ = false;
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
    yuZhiSet() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: "请先选中",
          type: "warning",
        });
        return;
      }
      this.dialogFormVisibleQZ = true;
      this.tempQz = {};

      this.tempQz = { machineNumbers: [], machineOrderNumbers: [] };
      let arr = [];
      let arr2 = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.machineNumber); // 设备编号集合
        arr2.push(item.machineOrderNumber ? item.machineOrderNumber : ""); // 版本号
        this.tempQz.machineNumbers.push(item.machineNumber);
        this.tempQz.machineOrderNumbers.push(
          item.machineOrderNumber ? item.machineOrderNumber : ""
        ); // 版本号
      });
      this.tempQz.machineNumbersString = arr.join(";"); // // 设备编号集合
      this.tempQz.machineOrderNumbersString = arr2.join(";"); // // 设备序号 集合

      this.$nextTick(() => {
        this.$refs["dataFormQZ"].clearValidate();
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
          let res = await deleteSZ(rows[index].id);
          if (res.code == "success") {
            if (rows.length == 1) {
              _this.listQuery.pageIndex =
                _this.listQuery.pageIndex - 1 > 0
                  ? _this.listQuery.pageIndex - 1
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
      getPageSZ(this.listQuery)
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
      this.temp = {};
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
          addSZ(param)
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
          updateSZ(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageData();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 3000,
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
    lookOneInfo(scope) {
      lookOneInfoSZ({ id: scope.row.id }).then((res) => {
        console.log("主键查询水质监测工作数据", res);
        if (res.data) {
          this.tempPL = res.data;
        } else {
          this.tempPL = {};
        }
        this.dialogFormVisibleOneLook = true;
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
      getPageSZ(this.listQuery)
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
            if (j == "machineState") {
              var name = v[j] == 0 ? "在线" : v[j] == 1 ? "离线" : "";
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
          machineRegisterszjc(
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
