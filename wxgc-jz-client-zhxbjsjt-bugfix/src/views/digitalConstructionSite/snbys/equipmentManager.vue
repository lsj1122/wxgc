<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
        placeholder="设备编号"
        clearable
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
      height="calc(100vh - 260px)"
      row-key="id"
      stripe
      fit
      highlight-current-row
    >
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
            v-if="scope.row.machineState == 0"
            type="success"
            effect="dark"
            >在线
          </el-tag>
          <el-tag v-if="scope.row.machineState == 1" type="info" effect="dark"
            >离线
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="400">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑
          </el-button>
          <el-button size="mini" type="info" @click="control(scope.row)"
            >设置
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删除
          </el-button>
          <el-button size="mini" type="warning" @click="lockSnbys(scope.row)"
            >锁机
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleSettings(scope.row)"
            >控制
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
                  style="width: 100%"
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
    <!--设置水泥标养室-->
    <el-dialog
      title="标养室控制"
      :visible.sync="dialogSettingsVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dialogSettingForm"
        :rules="rules"
        :model="dialogSettingForm"
        label-position="right"
        label-width="140px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备序号" prop="machineOrders">
                <el-input
                  v-model="dialogSettingForm.machineOrders"
                  disabled
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="设备编号" prop="machineNumbers">
                <el-input
                  v-model="dialogSettingForm.machineNumbers"
                  disabled
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="湿度控制" prop="humidityControl">
                <el-select
                  v-model="dialogSettingForm.humidityControl"
                  clearable
                  placeholder="请选择湿度控制"
                  style="width: 100%"
                >
                  <el-option label="正常" :value="1"></el-option>
                  <el-option label="提高湿度" :value="1"></el-option>
                  <el-option label="降低湿度" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="湿度最大值(%RH)" prop="humidityMax">
                <el-input-number
                  :controls="false"
                  v-model="dialogSettingForm.humidityMax"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="湿度最小值(%RH)" prop="humidityMin">
                <el-input-number
                  :controls="false"
                  v-model="dialogSettingForm.humidityMin"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="温度控制" prop="temperatureControl">
                <el-select
                  v-model="dialogSettingForm.temperatureControl"
                  clearable
                  placeholder="请选择温度控制"
                  style="width: 100%"
                >
                  <el-option label="正常" :value="1"></el-option>
                  <el-option label="提高温度" :value="1"></el-option>
                  <el-option label="降低温度" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="温度最大值(°C)" prop="temperatureMax">
                <el-input-number
                  :controls="false"
                  v-model="dialogSettingForm.temperatureMax"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="温度最小值(°C)" prop="temperatureMin">
                <el-input-number
                  :controls="false"
                  v-model="dialogSettingForm.temperatureMin"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSettingsVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="cementRoomControl">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!--控制水泥标养室-->
    <el-dialog
      title="标养室设置"
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
  getPageTtEleWater,
  getAllTtEleWater,
  addTtEleWater,
  updateTtEleWater,
  deleteTtEleWater,
  cementRoomControl,
} from "./api/ttelewater.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import { getPageSysProject } from "@/views/sysproject/api/sysproject";
import {
  lockSnbys,
  machineRegisterSnbys,
} from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata";
import { machineRegisterTj } from "@/views/digitalConstructionSite/tj/api/tttj"; // secondary package based on el-pagination
export default {
  name: "machine",
  components: { Pagination },
  data() {
    return {
      options: ["水表", "电表"],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      projectIdList: [],
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineNumber" },
        // {label: "设备型号", field: "machineModel"},
        { label: "项目名称", field: "projectName" },
        { label: "进场时间", field: "enterTime" },
        { label: "设备状态", field: "machineState" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        machineName: undefined,
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
      dialogSettingsVisible: false,
      dialogControlVisible: false,
      dialogStatus: "",
      dialogSettingForm: {
        humidityControl: null,
        humidityMax: null,
        humidityMin: null,
        machineNumbers: null,
        machineOrders: null,
        temperatureControl: null,
        temperatureMax: null,
        temperatureMin: null,
      },
      controlForm: {},
      temp: {
        id: null,
        machineName: null,
        machineNumber: null,
        machineModel: null,
        machineFactory: null,
        innerDate: null,
        position: null,
        machineType: null,
        projectId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        projectName: "",
        enterTime: null,
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
        machineNumbers: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        humidityControl: [
          {
            required: true,
            message: "必填湿度控制",
            trigger: ["blur", "change"],
          },
        ],
        humidityMax: [
          {
            required: true,
            message: "必填湿度最大值",
            trigger: ["blur", "change"],
          },
        ],
        humidityMin: [
          {
            required: true,
            message: "必填湿度最小值",
            trigger: ["blur", "change"],
          },
        ],
        temperatureControl: [
          {
            required: true,
            message: "必填温度控制",
            trigger: ["blur", "change"],
          },
        ],
        temperatureMax: [
          {
            required: true,
            message: "请选择温度控制",
            trigger: ["blur", "change"],
          },
        ],
        temperatureMin: [
          {
            required: true,
            message: "请选择温度最小值",
            trigger: ["blur", "change"],
          },
        ],
      },
      registerReturnJson: {},
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
    cementRoomControl() {
      this.$refs.dialogSettingForm.validate((validate) => {
        if (validate) {
          let data = { ...this.dialogSettingForm };
          data.machineNumbers = [data.machineNumbers];
          data.machineOrders = [
            data.machineOrders == null ? 0 : data.machineOrders,
          ];
          cementRoomControl(data).then((res) => {
            if (res.code === "success") {
              this.$message.success("设置成功");
              this.dialogSettingsVisible = false;
              this.loadPageData();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleSettings(row) {
      let { machineName, machineNumber, serialNumber } = row;
      this.dialogSettingsVisible = true;
      this.$nextTick(() => {
        this.$refs.dialogSettingForm.clearValidate();
        this.dialogSettingForm = this.$options.data().dialogSettingForm;
        this.dialogSettingForm.machineName = machineName;
        this.dialogSettingForm.machineNumbers = machineNumber;
        this.dialogSettingForm.machineOrders = serialNumber;
      });
    },
    settingsBys() {
      this.$refs["dialogSettingForm"].validate((valid) => {
        if (valid) {
          // 组装数据
          this.registerReturnJson.forEach((item) => {
            item.val = this.controlForm[item.name];
          });
          machineRegisterSnbys(
            { list: this.registerReturnJson },
            this.controlForm.id
          )
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("设置成功！");
                this.loadPageData();
                this.dialogControlVisible = false;
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
    lockSnbys(row) {
      this.$confirm("此操作将该设备锁机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          lockSnbys(row.id)
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
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtEleWater(rows[index].id);
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
      getPageTtEleWater(this.listQuery)
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
      let params = JSON.parse(JSON.stringify(this.listQuery));
      params.pageSize = -1;
      getPageTtEleWater(params)
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            this.allTableData.forEach((item) => {
              item.machineState == 0
                ? (item.machineState = "在线")
                : item.machineState == 1
                ? (item.machineState = "离线")
                : (item.machineState = "");
            });
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
        machineModel: null,
        machineFactory: null,
        innerDate: null,
        position: null,
        machineType: null,
        projectId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        projectName: null,
        enterTime: null,
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
          this.temp.createName = this.$store.getters.name;
          this.temp.projectName = this.$store.getters.projectName;
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtEleWater(param)
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
          updateTtEleWater(param).then((response) => {
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
    // 点击控制按钮
    control(row) {
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
