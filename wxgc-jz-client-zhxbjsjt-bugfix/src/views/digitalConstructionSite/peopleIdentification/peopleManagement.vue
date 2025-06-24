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
      <el-table-column type="index" label="序号" align="center">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>

      <el-table-column prop="machineNum" label="设备编号" align="center" />

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
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="350">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
          <!-- <el-button size="mini" @click="lookOneInfo(scope)" type="primary"
            >查看</el-button
          > -->
          <el-button size="mini" type="info" @click="control(scope.row)"
            >设置</el-button
          >
          <el-button size="mini" type="warning" @click="lockRS(scope.row)"
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
              <!-- <el-form-item label="设备编号" prop="machineNum">
                <el-input
                  v-model="temp.machineNum"
                  placeholder="设备编号"
                  :disabled="dialogStatus == 'look'"
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
              <el-form-item label="电梯允许最大人数">
                <el-input
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.elevatorMax"
                  placeholder="电梯允许最大人数"
                />
              </el-form-item>
              <el-form-item label="考勤间隔">
                <el-input
                  type="number"
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.attendanceInterval"
                  placeholder="考勤间隔"
                />
              </el-form-item>
              <el-form-item label="照片上报设置" prop="machineFactory">
                <el-select v-model="temp.photoSubmit" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="心跳包间隔(s)">
                <el-input
                  type="number"
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.heartbeatInterval"
                  placeholder="心跳包间隔"
                />
              </el-form-item>
              <el-form-item label="锁机命令">
                <el-select v-model="temp.lockCommand" placeholder="请选择">
                  <el-option
                    v-for="item in lockCommandOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="设备地址">
                <el-input
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.machineAddress"
                  placeholder="设备地址"
                />
              </el-form-item>

              <el-form-item label="备注">
                <el-input
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.remark"
                  placeholder="备注"
                />
              </el-form-item>

              <el-form-item label="项目信息">
                <el-input
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.projectInfo"
                  placeholder="项目信息"
                />
              </el-form-item>
              <el-form-item label="关联设备">
                <el-input
                  :disabled="dialogStatus == 'look'"
                  v-model="temp.relationId"
                  placeholder="关联设备"
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
                <el-input
                  v-model="temp.propertyNumber"
                  placeholder="产权备案号"
                />
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
            <el-form-item label="主机编号">
              <el-input
                v-model="tempPL.nameAA"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂商代码">
              <el-input
                v-model="tempPL.nameAA"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议版本号">
              <el-input
                v-model="tempPL.nameAA"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物联网卡号">
              <el-input
                v-model="tempPL.iotCardNumber"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input
                v-model="tempPL.longitude"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input
                v-model="tempPL.latitude"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电梯允许最大人数">
              <el-input
                v-model="tempPL.elevatorMax"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考勤间隔">
              <el-input
                v-model="tempPL.attendanceInterval"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="照片上报设置">
              <el-input
                :value="handleP(tempPL.photoSubmit)"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="心跳包间隔">
              <el-input
                v-model="tempPL.heartbeatInterval"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="锁机命令">
              <el-input
                :value="handlelockCommand(tempPL.lockCommand)"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态">
              <el-input
                v-model="tempPL.nameAA"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="匹配时间">
              <el-input
                v-model="tempPL.matchTime"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="匹配状态">
              <el-input
                v-model="tempPL.matchStatus"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="项目id">
              <el-input
                v-model="tempPL.projectId"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="转发id集合">
              <el-input
                v-model="tempPL.nameAA"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input
                v-model="tempPL.createTime"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备ip">
              <el-input
                v-model="tempPL.machineIp"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备地址">
              <el-input
                v-model="tempPL.machineIp"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleOneLook = false">
          {{ $t("table.cancel") }}
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
  lockRS,
  machineRegisterRS,
} from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata";
import {
  getPagePeopleM,
  addPeopleM,
  updatePeopleM,
  deletePeopleM,
  lookOneInfoPeopleM,
} from "./api/comment.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";

export default {
  name: "machine",
  components: { Pagination },
  data() {
    return {
      dialogControlVisible: false, // 设置
      registerReturnJson: {},
      controlForm: {},

      dialogFormVisibleOneLook: false,
      tempPL: {},
      lockCommandOptions: [
        {
          value: 0,
          label: "正常运行",
        },
        {
          value: 1,
          label: "锁机",
        },
      ],
      options: [
        {
          value: 0,
          label: "不上报",
        },
        {
          value: 1,
          label: "违章上报",
        },
        {
          value: 2,
          label: "全部上报",
        },
      ],
      tableData: [], //当前分页数据
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineNum" },
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
        machineNum: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
        look: "查看",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        machineNum: null,
        machineNumber: null,
        machineModel: null,
        machineFactory: null,
        enterTime: null,
        position: null,
        machineType: null,
        projectId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        projectName: "",
        projectId: "",
      },
      rules: {
        //校验功能

        machineNum: [
          {
            required: true,
            message: "必填设备编号",
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
    handleP(photoSubmit) {
      var name = "";
      if (photoSubmit == 0) {
        name = "不上报";
      }
      if (photoSubmit == 1) {
        name = "违章上报";
      }
      if (photoSubmit == 2) {
        name = "全部上报";
      }
      return name;
    },
    handlelockCommand(lockCommand) {
      var name = "";
      if (lockCommand == 0) {
        name = "正常运行";
      }
      if (lockCommand == 1) {
        name = "锁机";
      }
      return name;
    },
    lookOneInfo(scope) {
      lookOneInfoPeopleM(scope.row.id).then((res) => {
        console.log("主键查询扬尘监测预警值设置表", res);
        this.dialogFormVisibleOneLook = true;
        this.tempPL = res.data;
      });
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
          let res = await deletePeopleM(rows[index].id);
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
      getPagePeopleM(this.listQuery)
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
    //导出列表
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      let params = JSON.parse(JSON.stringify(this.listQuery));
      getPagePeopleM(params)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            import("@/vendor/Export2Excel").then((excel) => {
              const tHeader = []; // 导出excel 的标题
              const filterVal = []; // 每个标题对应的字段
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
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            if (j == "machineState") {
              return v[j] == 0 ? "在线" : v[j] == 1 ? "离线" : "";
            } else {
              return v[j];
            }
          }
        })
      );
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
          addPeopleM(param)
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
          updatePeopleM(param).then((response) => {
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
    handleLook(scope) {},
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
          machineRegisterRS(
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
    lockRS(row) {
      this.$confirm("此操作将该设备锁机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          lockRS(row.id)
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
