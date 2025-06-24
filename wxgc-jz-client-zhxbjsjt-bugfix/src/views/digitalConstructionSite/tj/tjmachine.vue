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
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增设备
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
      stripe
      fit
      height="calc(100vh - 260px)"
      highlight-current-row
    >
      <el-table-column prop="tjNum" label="塔机编号" align="center">
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="machineFactory" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="admissionTime" label="进场时间" align="center">
      </el-table-column>
      <el-table-column prop="machineState" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.machineState == 0"
            type="success"
            effect="dark"
            >在线</el-tag
          >
          <el-tag v-if="scope.row.machineState == 1" type="info" effect="dark"
            >离线</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400" fixed="right">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑
          </el-button>
          <el-button size="mini" type="primary" @click="searchForm(scope.row)"
            >查看</el-button
          >
          <el-button size="mini" type="info" @click="handleSettings(scope.row)"
            >设置</el-button
          >
          <el-button size="mini" type="warning" @click="lockTj(scope.row)"
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
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="temp.machineName" placeholder="设备名称" />
              </el-form-item>
               <el-form-item label="设备编号" prop="machineNumber">
                <el-input v-model="temp.machineNumber" placeholder="设备编号" />
              </el-form-item>
               <el-form-item label="塔机编号" prop="tjNum">
                <el-input v-model="temp.tjNum" placeholder="塔机编号" />
              </el-form-item>
              <el-form-item label="设备厂家" prop="machineFactory">
                <el-input v-model="temp.machineFactory" placeholder="设备厂家" />
              </el-form-item>
              <el-form-item label="所属项目">
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
              <el-form-item label="进场时间" prop="admissionTime">
                <el-date-picker
                  v-model="temp.admissionTime"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="进场时间"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="产权单位">
                <el-input v-model="temp.propertyUnit" placeholder="产权单位" />
              </el-form-item>
              <el-form-item label="安装单位">
                <el-input
                  v-model="temp.installationUnit"
                  placeholder="安装单位"
                />
              </el-form-item>
              <el-form-item label="塔吊视频">
                <el-input
                  v-model="temp.towerCraneVideo"
                  placeholder="塔吊视频"
                />
              </el-form-item>
              <el-form-item label="吊钩视频">
                <el-input v-model="temp.cliverVideo" placeholder="吊钩视频" />
              </el-form-item>
               <el-form-item label="司机姓名" prop="name">
                <el-input v-model="temp.name" placeholder="司机" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="temp.phone" placeholder="手机号码" />
              </el-form-item>
              <el-form-item label="作业证编号" prop="specialCard">
                <el-input
                  v-model="temp.specialCard"
                  placeholder="特种作业证编号"
                />
              </el-form-item>
              <el-form-item label="特种作业证" prop="picture1">
                <upload-file
                  file-type="jpg/png"
                  ref="clearData"
                  list-type="picture"
                  accept="image/*"
                  max-size="20"
                  @change="getFile"
                />
                <el-image
                  v-if="temp.picture1"
                  style="height: 50px; width: 50px"
                  :src="temp.picture1"
                  :preview-src-list="[temp.picture1]"
                >
                </el-image>
              </el-form-item>
              <el-form-item label="司机照片" prop="picture2">
                <upload-file
                  file-type="jpg/png"
                  ref="clearData1"
                  list-type="picture"
                  accept="image/*"
                  max-size="20"
                  @change="getFile1"
                />
                <el-image
                  v-if="temp.picture2"
                  style="height: 50px; width: 50px"
                  :src="temp.picture2"
                  :preview-src-list="[temp.picture2]"
                >
                </el-image>
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
    <!--查看塔机详细信息对话框-->
    <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="0"></el-tab-pane>
        <el-tab-pane label="传感器标定信息" name="2"></el-tab-pane>
        <el-tab-pane label="报警设置信息" name="3"></el-tab-pane>
        <el-tab-pane label="限位设置信息" name="4"></el-tab-pane>
      </el-tabs>
      <el-form :model="formData" label-width="160px" disabled>
        <div v-if="activeName == 0">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="塔机编号">
                <el-input v-model="formData.tjNum"></el-input>
              </el-form-item>
              <el-form-item label="设备编号">
                <el-input v-model="formData.machineNumber"></el-input>
              </el-form-item>
              <el-form-item label="x坐标">
                <el-input v-model="formData.coordinateX"></el-input>
              </el-form-item>
              <el-form-item label="前臂长(m)">
                <el-input v-model="formData.armLengthF"></el-input>
              </el-form-item>
              <el-form-item label="塔帽高(m)">
                <el-input v-model="formData.towerCapHeight"></el-input>
              </el-form-item>
              <el-form-item label="最大吊重(吨)">
                <el-input v-model="formData.maxLoad"></el-input>
              </el-form-item>
              <el-form-item label="产权状态">
                <el-input v-model="formData.driver1"></el-input>
              </el-form-item>
              <el-form-item label="钢丝绳倍率">
                <el-input v-model="formData.driver1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="y坐标">
                <el-input v-model="formData.coordinateY"></el-input>
              </el-form-item>
              <el-form-item label="后臂长(m)">
                <el-input v-model="formData.armLengthA"></el-input>
              </el-form-item>
              <el-form-item label="塔壁高(m)">
                <el-input v-model="formData.towerWallHeight"></el-input>
              </el-form-item>
              <el-form-item label="最大力矩(T.M)">
                <el-input v-model="formData.maxMoment"></el-input>
              </el-form-item>
              <el-form-item label="塔机型号">
                <el-input v-model="formData.hookWeight"></el-input>
              </el-form-item>
              <el-form-item label="吊钩重量">
                <el-input v-model="formData.driver1Phoen"></el-input>
              </el-form-item>
              <el-form-item label="传感器安装状态">
                <el-input v-model="formData.driver2Phoen"></el-input>
              </el-form-item>
              <el-form-item label="生产厂商">
                <el-input v-model="formData.driver1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="activeName == 2">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="高度近端标定AD值">
                <el-input v-model="formData.heightNearEndAd"></el-input>
              </el-form-item>
              <el-form-item label="高度远端标定AD值">
                <el-input v-model="formData.heightFarEndAd"></el-input>
              </el-form-item>
              <el-form-item label="近端幅度标AD定值">
                <el-input v-model="formData.nearEndAd"></el-input>
              </el-form-item>
              <el-form-item label="远端幅度标AD定值">
                <el-input v-model="formData.farEndAd"></el-input>
              </el-form-item>
              <el-form-item label="回转起点AD值">
                <el-input v-model="formData.rotationStartAd"></el-input>
              </el-form-item>
              <el-form-item label="回转终点AD值">
                <el-input v-model="formData.rotationEndAd"></el-input>
              </el-form-item>
              <el-form-item label="空载重量AD值">
                <el-input v-model="formData.emptyWeightAd"></el-input>
              </el-form-item>
              <el-form-item label="负载重量AD值">
                <el-input v-model="formData.loadWeightAd"></el-input>
              </el-form-item>
              <el-form-item label="风速校准系数">
                <el-input v-model="formData.windSpeed"></el-input>
              </el-form-item>
              <el-form-item label="风速校准系数预留">
                <el-input v-model="formData.windSpeedReserve"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="高度近端标定实际值(m)">
                <el-input v-model="formData.heightNearEndActual"></el-input>
              </el-form-item>
              <el-form-item label="高度远端标定实际值(m)">
                <el-input v-model="formData.heightFarEndActual"></el-input>
              </el-form-item>
              <el-form-item label="近端幅度标定实际值(m)">
                <el-input v-model="formData.nearEndActual"></el-input>
              </el-form-item>
              <el-form-item label="远端幅度标定实际值(m)">
                <el-input v-model="formData.farEndActual"></el-input>
              </el-form-item>
              <el-form-item label="回转起点实际角度(°)">
                <el-input v-model="formData.rotationStartActual"></el-input>
              </el-form-item>
              <el-form-item label="回转终点实际角度(°)">
                <el-input v-model="formData.rotationEndActual"></el-input>
              </el-form-item>
              <el-form-item label="空载重量实际值(kg)">
                <el-input v-model="formData.emptyWeightActual"></el-input>
              </el-form-item>
              <el-form-item label="负载重量实际值(kg)">
                <el-input v-model="formData.loadWeightActual"></el-input>
              </el-form-item>
              <el-form-item label="倾斜校准系数">
                <el-input v-model="formData.tilt"></el-input>
              </el-form-item>
              <el-form-item label="倾斜校准系数预留">
                <el-input v-model="formData.tiltReserve"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="activeName == 3">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="水平距离报警值(m)">
                <el-input v-model="formData.horizontalDistanceAlarm"></el-input>
              </el-form-item>
              <el-form-item label="垂直距离报警值(m)">
                <el-input v-model="formData.verticalDimensionAlarm"></el-input>
              </el-form-item>
              <el-form-item label="重量报警值(%)">
                <el-input v-model="formData.weightAlarm"></el-input>
              </el-form-item>
              <el-form-item label="力矩报警值(%)">
                <el-input v-model="formData.momentAlarm"></el-input>
              </el-form-item>
              <el-form-item label="风速报警值(m/s)">
                <el-input v-model="formData.windSpeedAlarm"></el-input>
              </el-form-item>
              <el-form-item label="倾斜报警值(°)">
                <el-input v-model="formData.tiltAlarm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="水平距离预警值(m)">
                <el-input
                  v-model="formData.horizontalDistanceWarning"
                ></el-input>
              </el-form-item>
              <el-form-item label="垂直距离预警值(m)">
                <el-input
                  v-model="formData.verticalDimensionWarning"
                ></el-input>
              </el-form-item>
              <el-form-item label="重量预警值(kg)">
                <el-input v-model="formData.weightWarning"></el-input>
              </el-form-item>
              <el-form-item label="力矩预警值(%)">
                <el-input v-model="formData.momentWarning"></el-input>
              </el-form-item>
              <el-form-item label="风速预警值(m/s)">
                <el-input v-model="formData.windSpeedWarning"></el-input>
              </el-form-item>
              <el-form-item label="倾斜预警值(°)">
                <el-input v-model="formData.tiltWarning"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="activeName == 4">
          <el-row>
            <el-col>
              <el-form-item label="高度限位起点值(m)">
                <el-input v-model="formData.heightStart"></el-input>
              </el-form-item>
              <el-form-item label="幅度限位起点值(m)">
                <el-input v-model="formData.rangeStart"></el-input>
              </el-form-item>
              <el-form-item label="回转限位起点值(°)">
                <el-input v-model="formData.rotationStart"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="高度限位终点值(m">
                <el-input v-model="formData.heightEnd"></el-input>
              </el-form-item>
              <el-form-item label="幅度限位终点值(m)">
                <el-input v-model="formData.rangeEnd"></el-input>
              </el-form-item>
              <el-form-item label="回转限位终点值(°)">
                <el-input v-model="formData.rotationEnd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-dialog>
    <!--控制塔机对话框-->
    <el-dialog
      title="塔机设置"
      :visible.sync="dialogControlVisible"
      width="30%"
      top="2%"
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
  getPageTtTj,
  getAllTtTj,
  addTtTj,
  updateTtTj,
  deleteTtTj,
  selectOne,
  machineRegisterTj,
  lockTj,
} from "./api/tttj.js";
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import { simpleUploads } from "@/views/sysproject/api/ttfile"; // secondary package based on el-pagination
export default {
  name: "tjmachine",
  components: { Pagination, uploadFile },
  data() {
    return {
      fileList: [],
      fileList1: [],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "塔机编号", field: "tjNum" },
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineNumber" },
        { label: "设备厂家", field: "machineFactory" },
        { label: "项目名称", field: "projectName" },
        { label: "进场时间", field: "admissionTime" },
        { label: "设备状态", field: "machineState" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        id: undefined,
        createTime: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogControlVisible: false,
      dialogStatus: "",
      temp: {
        admissionTime: null,
        cliverVideo: null,
        floorNumber: null,
        hostNumber: null,
        installationUnit: null,
        machineName: null,
        machineNumber: null,
        machineState: null,
        matchingState: null,
        matchingTime: null,
        propertyNumber: null,
        propertyUnit: null,
        specification: null,
        towerCraneModel: null,
        towerCraneVideo: null,
        projectId: null,
        manufacturer: null,
        machineFactory:null,
       tjNum:null,
       id: null,
        num: null,
        innerDate: null,
        model: null,
        armLong: null,
        rope: null,
        maxWeight: null,
        maxDistance: null,
        video1: null,
        video2: null,
        property: null,
        install: null,
        production: null,
        norm: null,
        name: null,
        phone: null,
        specialCard: null,
        picture1: null,
        picture2: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,

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
        manufacturer: [
          {
            required: true,
            message: "必填设备厂家",
            trigger: ["blur", "change"],
          },
        ],
        admissionTime: [
          {
            required: true,
            message: "必填进场时间",
            trigger: ["blur", "change"],
          },
        ],
        tjNum: [
          {
            required: true,
            message: "必填塔机编号",
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
        interval: [
          {
            required: true,
            message: "必填时间间隔",
            trigger: ["blur", "change"],
          },
        ],
         name: [
          { required: true, message: "必填司机", trigger: ["blur", "change"] },
        ],
        phone: [
          {
            required: true,
            message: "必填手机号码",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1[0-9]{10}$/,
            message: "请检查手机号是否正确",
            trigger: "blur",
          },
        ],
        specialCard: [
          {
            required: true,
            message: "必填特种作业证编号",
            trigger: ["blur", "change"],
          },
        ],
      },
      activeName: "0",
      dialogVisible: false,
      formData: {
        machineNumber: "",
        tjNum: "",
        coordinateX: "",
        armLengthF: "",
        towerCapHeight: "",
        maxLoad: "",
        driver1: "",
        driver2: "",
        simNumber: "",
        wireropeMagnification: "",
        sensorName: "",
        heightSensorState: "",
        weightSensorState: "",
        rangeSensorState: "",
        rotationSensorState: "",
        windSpeedSensorState: "",
        towerWallHeight: "",
        remarks: "",
        coordinateY: "",
        armLengthA: "",
        maxMoment: "",
        hookWeight: "",
        driver1Phoen: "",
        driver2Phoen: "",
        floorNumber: "",
        heightNearEndAd: "",
        heightFarEndAd: "",
        nearEndAd: "",
        farEndAd: "",
        rotationStartAd: "",
        rotationEndAd: "",
        emptyWeightAd: "",
        loadWeightAd: "",
        windSpeed: "",
        windSpeedReserve: "",
        heightNearEndActual: "",
        heightFarEndActual: "",
        nearEndActual: "",
        farEndActual: "",
        rotationStartActual: "",
        rotationEndActual: "",
        emptyWeightActual: "",
        loadWeightActual: "",
        tilt: "",
        tiltReserve: "",
        tiltSensorState: "",
        horizontalDistanceAlarm: "",
        horizontalDistanceWarning: "",
        weightAlarm: "",
        momentAlarm: "",
        windSpeedAlarm: "",
        tiltAlarm: "",
        verticalDimensionAlarm: "",
        verticalDimensionWarning: "",
        weightWarning: "",
        momentWarning: "",
        windSpeedWarning: "",
        tiltWarning: "",
        heightStart: "",
        rangeStart: "",
        rotationStart: "",
        heightEnd: "",
        rangeEnd: "",
        rotationEnd: "",
        projectName: "",
        projectId: "",
      },
      projectIdList: [],
      controlForm: {},
      registerReturnJson: null,
    };
  },
  created() {},
  mounted() {
    getPageSysProject({ pageIndex: 1, pageSize: -1 }).then((res) => {
      this.projectIdList = this.handleProject(res.data.records);
    });
    //加载分页数据
    this.loadPageData();
  },
  methods: {
        getFile(file, fileList) {
      this.fileList = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList = fd;
    },
    getFile1(file, fileList) {
      this.fileList1 = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList1 = fd;
    },
    // 点击设置按钮
    handleSettings(row) {
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
      //this.$message.warning("暂不可设置");
    },
    // 设置对话框确认
    settingsBys() {
      this.$refs.dialogSettingForm.validate((valid) => {
        if (valid) {
          // 组装数据
          this.registerReturnJson.forEach((item) => {
            item.val = this.controlForm[item.name];
          });
          machineRegisterTj(
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
        }
      });
    },
    // 锁机按钮
    lockTj(row) {
      this.$confirm("此操作将该设备锁机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          lockTj(row.id)
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
    open() {
      this.$prompt("上传时间(秒)", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d{3,10}$/,
        inputErrorMessage: "输入不正确,要求整数且长度3-10位数",
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: `上传间隔:${value}秒`,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    searchForm(row) {
      this.dialogVisible = true;
      selectOne({
        id: row.id,
      }).then((res) => {
        if (res.code === "success") {
          this.formData = res.data;
        }
      });
    },
    cancel() {
      this.resetTemp();
       this.$refs.clearData.clearData();
      this.$refs.clearData1.clearData();
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
          let res = await deleteTtTj(rows[index].id);
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
      getPageTtTj(this.listQuery)
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
      let params = deepClone(this.listQuery);
      getPageTtTj(params)
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records.map((item) => {
              item.machineState =
                item.machineState == 0
                  ? "在线"
                  : item.machineState == 1
                  ? "离线"
                  : "";
              return item;
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
                filename: "塔机管理",
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
        machineNumber: "",
        tjNum: "",
        coordinateX: "",
        armLengthF: "",
        towerCapHeight: "",
        maxLoad: "",
        driver1: "",
        driver2: "",
        simNumber: "",
        wireropeMagnification: "",
        sensorName: "",
        heightSensorState: "",
        weightSensorState: "",
        rangeSensorState: "",
        rotationSensorState: "",
        windSpeedSensorState: "",
        towerWallHeight: "",
        remarks: "",
        coordinateY: "",
        armLengthA: "",
        maxMoment: "",
        hookWeight: "",
        driver1Phoen: "",
        driver2Phoen: "",
        floorNumber: "",
        heightNearEndAd: "",
        heightFarEndAd: "",
        nearEndAd: "",
        farEndAd: "",
        rotationStartAd: "",
        rotationEndAd: "",
        emptyWeightAd: "",
        loadWeightAd: "",
        windSpeed: "",
        windSpeedReserve: "",
        heightNearEndActual: "",
        heightFarEndActual: "",
        nearEndActual: "",
        farEndActual: "",
        rotationStartActual: "",
        rotationEndActual: "",
        emptyWeightActual: "",
        loadWeightActual: "",
        tilt: "",
        tiltReserve: "",
        tiltSensorState: "",
        horizontalDistanceAlarm: "",
        horizontalDistanceWarning: "",
        weightAlarm: "",
        momentAlarm: "",
        windSpeedAlarm: "",
        tiltAlarm: "",
        verticalDimensionAlarm: "",
        verticalDimensionWarning: "",
        weightWarning: "",
        momentWarning: "",
        windSpeedWarning: "",
        tiltWarning: "",
        heightStart: "",
        rangeStart: "",
        rotationStart: "",
        heightEnd: "",
        rangeEnd: "",
        rotationEnd: "",
        projectName: "",
        projectId: "",
        manufacturer: null,
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
          simpleUploads(this.fileList).then((res) => {
            this.temp.picture1 = res[0];
            simpleUploads(this.fileList1).then((res) => {
              this.temp.picture2 = res[0];
              this.temp.createBy = this.$store.getters.name;
              let param = JSON.parse(JSON.stringify(this.temp));

              addTtTj(param)
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
          });
        }
      });
    },
    //修改
      updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          simpleUploads(this.fileList).then((res) => {
            this.temp.picture1 = res[0];
            simpleUploads(this.fileList1).then((res) => {
              this.temp.picture2 = res[0];
              this.temp.updateBy = this.$store.getters.name;
              let param = JSON.parse(JSON.stringify(this.temp));
              updateTtTj(param).then((response) => {
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
