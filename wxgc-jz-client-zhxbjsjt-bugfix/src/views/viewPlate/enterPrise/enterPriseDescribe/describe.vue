<template>
  <div>
    <!-- 弹出框 -->
    <el-dialog
      :modal-append-to-body="false"
      title="物联网设备统计"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="handleClose"
      center
      @close="closeDialog"
    >
      <div class="box1" v-show="tableLook.showBox1">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <!-- <el-input
              v-model="listQuery.proId"
              placeholder="项目名称"
            ></el-input> -->
            <el-select v-model="projectSelect" placeholder="请选择项目名称">
              <el-option
                v-for="item in selectoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select v-model="typeSelect" placeholder="请选择设备类型">
              <el-option
                v-for="item in selectoptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
          <el-input  placeholder="设备名称" size="mini"></el-input>
        </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              @click="loadPageData1"
              style="border: 1px solid #00baff; color: #00baff"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer"> -->
        <el-table :data="equipmentData" fit height="400">
          <el-table-column prop="projectName" label="项目名称" align="center">
          </el-table-column>
          <el-table-column prop="machineName" label="设备名称" align="center">
          </el-table-column>
          <el-table-column prop="shebeiNmae" label="设备类型" align="center">
          </el-table-column>
          <el-table-column prop="machineNumber" label="设备编号" align="center">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="设备状态"
            align="center"
            width="130"
          ></el-table-column>
          <!-- <el-table-column label="报警次数" align="center" width="100"
            >0</el-table-column
          > -->

          <el-table-column label="操作" align="center" width="130">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                style="border: 0; color: #00baff"
                >查看</el-button
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
          @current-change="loadPageData($event)"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 弹出框2 -->
    <el-dialog
      :title="equipmentTitle"
      :visible.sync="dialogVisible2"
      width="60%"
      :before-close="handleClose"
      center
    >
      <div class="box2" v-show="tableLook.showBox2">
        <table1 ref="tableeee"></table1>
      </div>

      <div class="box3" v-show="tableLook.showBox3">
        <table2 ref="tableeee2"></table2>
      </div>

      <div class="box4" v-show="tableLook.showBox4">
        <table3 ref="tableeee3"></table3>
      </div>
      <div class="box5" v-show="tableLook.showBox5">
        <table4 ref="tableeee4"></table4>
      </div>
    </el-dialog>

    <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>

    <div class="content">
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'项目状态统计'"
          :title2="'Project status statistics'"
        >
          <div class="icon-document">
            <div class="projectType"></div>
            <div class="projectType-bottom" style="height: 100%">
              <projectTypeEcharts ref="projectType"></projectTypeEcharts>
            </div>
          </div>
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="complete(1)"
              />
            </el-tooltip>
          </template>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'环境监测统计'"
          :title2="'Environmental monitoring statistics'"
        >
          <div class="icon-document">
            <div class="environmentTongji" style="height: 100%">
              <environmentTongjiEcharts
                ref="environmentTongjiEcharts"
              ></environmentTongjiEcharts>
            </div>
          </div>
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="complete(4)"
              />
              <!-- <span class="el-icon-s-unfold" @click="complete(1)"></span> -->
            </el-tooltip>
          </template>
        </com-line>
        <com-line
          class="content-left-bottom"
          :title="'AI抓拍统计'"
          :title2="'AI capture statistics'"
        >
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="complete(6)"
              />
            </el-tooltip>
          </template>
          <div class="icon-document">
            <div class="AIbox" style="height: 100%">
              <aIboxEcharts ref="aIboxEcharts"></aIboxEcharts>
            </div>
          </div>
        </com-line>
        <!-- <com-line
          class="content-left-center"
          :title="'物联网设备统计'"
          :title2="'Internet of things equipment statistics'"
        >
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <span class="el-icon-s-unfold" @click="complete(2)"></span>
            </el-tooltip>
          </template>
          <div class="icon-document">
            <div class="internetTongji" style="height: 100%">
              <internetTongjiEcharts
                ref="internetTongji"
              ></internetTongjiEcharts>
            </div>
          </div>
        </com-line> -->
      </div>
      <!-- 中间部分 -->
      <div class="content-mid">
        <div class="mapBox">
          <div class="bm-view" id="mapBOX"></div>
          <div class="query-form">
            <el-select
              v-model="mapSelect.proName"
              size="medium"
              placeholder="请选择项目"
              style="width: 300px"
              @change="proNameSelect1(index)"
            >
              <el-option
                v-for="(item, index) in projectOptions"
                :key="index"
                :label="item.proName"
                :value="item.proName"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              style="margin-left: 20px; background: #0b97f9"
              @click="searchProject"
              >搜索</el-button
            >
            <!-- <el-row :gutter="10">
              <el-col :span="5">
                <el-select
                  v-model="mapSelect.proName"
                  size="small"
                  placeholder="请选择项目"
                  @change="proNameSelect1(index)"
                >

                  <el-option
                    v-for="(item, index) in projectOptions"
                    :key="index"
                    :label="item.proName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="mapSelect.proStatus"
                  size="small"
                  placeholder="请选择项目状态"
                >

                  <el-option
                    v-for="(item, index1) in selOptions.dict1"
                    :key="index1"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="mapSelect.proType"
                  size="small"
                  placeholder="请选择工程类型"
                >

                  <el-option
                    v-for="(item, index2) in selOptions.dict2"
                    :key="index2"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="mapSelect.proUse"
                  size="small"
                  placeholder="请选择建筑类型"
                >

                  <el-option
                    v-for="(item, index3) in selOptions.dict3"
                    :key="index3"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2">
                <img
                  style="cursor: pointer"
                  src="../../../../assets/viewplate/screen.png"
                  alt
                  @click="searchProject"
                />
              </el-col>
            </el-row> -->
          </div>
        </div>
        <div class="aa">
          <com-line2
            class="content-left-bottom"
            :title="'IOT设备及报警统计'"
            :title2="'Equipment warning record'"
          >
            <el-button-group>
              <el-button
                type="primary"
                :class="{ active: warnActive == 0 }"
                size="mini"
                @click="warnChoose(0)"
                >报警实时记录</el-button
              >
              <el-button
                type="primary"
                :class="{ active: warnActive == 1 }"
                size="mini"
                @click="warnChoose(1)"
                >预警报警统计</el-button
              >
            </el-button-group>

            <!-- <template #head>
              <el-select
                v-model="gjnrValue"
                size="small"
                placeholder="报警内容"
                @change="fnEdit"
                v-if="warnChooseShow"
              >
                <el-option label="报警" value="报警"></el-option>
                <el-option label="预警" value="预警"></el-option>
              </el-select>

              <el-button
                type="success"
                v-if="warnChooseShow"
                @click="exportExcel"
                size="small"
                style="margin-left: 15px"
                >导出</el-button
              >
            </template> -->
            <div class="icon-document">
              <div class="warningRecord" style="height: 100%">
                <warningRecordEcharts ref="warnRef"></warningRecordEcharts>
              </div>
            </div>
          </com-line2>
        </div>
      </div>
      <!-- 右边部分 -->
      <div class="content-right">
        <com-line
          class="content-left-bottom"
          :title="'安全问题统计'"
          :title2="'Safety Statistics'"
        >
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="complete(3)"
              />
            </el-tooltip>
          </template>
          <div class="icon-document">
            <div class="safetyTongji" style="height: 100%">
              <safetyTongjiEcharts
                ref="safetyTongjiEcharts"
              ></safetyTongjiEcharts>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-bottom"
          :title="'质量问题统计'"
          :title2="'Quality problem statistics'"
        >
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="complete(7)"
              />
            </el-tooltip>
          </template>
          <div class="icon-document">
            <div class="qualityProblem" style="height: 100%">
              <qualityProblem ref="qualityProblem"></qualityProblem>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-center"
          :title="'劳务人员统计'"
          :title2="'Personnel profile'"
        >
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="complete(5)"
              />
            </el-tooltip>
          </template>
          <!-- <template #head>
            <el-button-group>
              <el-button
                type="primary"
                size="mini"
                :class="{ active: peopleActive == 0 }"
                @click="pChooseFive(0)"
                >在册人员统计</el-button
              >
              <el-button
                type="primary"
                size="mini"
                :class="{ active: peopleActive == 1 }"
                @click="pChooseFive(1)"
                >出勤统计</el-button
              >
            </el-button-group>
          </template> -->
          <div class="icon-document">
            <div class="personnelSituation" style="height: 100%">
              <personnelSituationEcharts
                ref="perplecharts"
              ></personnelSituationEcharts>
            </div>
          </div>
        </com-line>
      </div>
    </div>
  </div>
</template>

<script>
var $ = require("jquery");
import {
  mapInfo,
  deviceStatisticsTbale,
  getMapInfoTitle,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

import projectTypeEcharts from "./modules/projectTypeEcharts";
import internetTongjiEcharts from "./modules/internetTongjiEcharts";
import safetyTongjiEcharts from "./modules/safetyTongjiEcharts";
import qualityProblem from "./modules/qualityProblem";
import environmentTongjiEcharts from "./modules/environmentTongjiEcharts";
import personnelSituationEcharts from "./modules/personnelSituationEcharts";
import aIboxEcharts from "./modules/AIboxEcharts";
import warningRecordEcharts from "./modules/warningRecordEcharts";
import ComLine from "../../components/comline";
import ComLine2 from "../../components/comlineone";

import timeButton from "../aModules/timeButton";
import table1 from "./modules/table1";
import table2 from "./modules/table2";
import table3 from "./modules/table3";
import table4 from "./modules/table4";

import BaiMap from "BaiMap";
import echarts from "echarts";
export default {
  props: {},
  components: {
    ComLine,
    projectTypeEcharts,
    internetTongjiEcharts,
    safetyTongjiEcharts,
    environmentTongjiEcharts,
    personnelSituationEcharts,
    aIboxEcharts,
    warningRecordEcharts,
    timeButton,
    table1,
    table2,
    table3,
    table4,
    qualityProblem,
    ComLine2,
  },
  data() {
    return {
      showimg: true,
      // 项目选择框现行选中项
      projectSelect: "",
      // 设备类型选择框现行选中项
      typeSelect: "",
      // select 项目名称数据
      selectoptions: [],
      pointFlag: false,
      // select 设备名称数据
      selectoptions2: [
        { label: "全部", value: "qb" },
        { label: "塔式起重机", value: "tj" },
        { label: "施工升降机", value: "td" },
        // { label: "视频监控", value: "spjk" },
        { label: "智能水电", value: "znsd" },
        { label: "卸料平台", value: "xlpt" },
        { label: "扬尘监测", value: "ycjc" },
      ],
      equipmentTitle: "详细数据",

      warnChooseShow: true,
      gjnrValue: "报警", // 报警，预警
      mapSelect: {
        proName: "",
        proStatus: "",
        proType: "",
        proUse: "",
      },
      selOptions: {
        dict1: ["在建", "完工", "筹备", "立项", "停工", "竣工验收"],
        dict2: [
          "房屋建筑工程",
          "市政公用工程",
          "机电安装工程",
          "铁路工程",
          "公路工程",
          "港口与航通工程",
          "水利水电工程",
          "电力工程",
          "矿山工程",
          "冶炼工程",
          "化工石油工程",
          "通信工程",
          "其他",
        ],
        dict3: [
          "居住建筑",
          "住宅建筑",
          "宿舍建筑",
          "商业建筑",
          "综合建筑",
          "教育建筑",
          "道路交通",
        ],
      },
      projectOptions: [],
      projectOptionsOneObject: null,

      tableLook: {
        oneInfo: "",
        showBox1: true,
        showBox2: false,
        showBox3: false,
        showBox4: false,
      },
      // 分页
      total: 1,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,

        type: "qb", // 设备类题现行选中项

        proId: "", // 项目名称现行选中项
      },
      // 表格数据
      equipmentData: "",

      // 搜索框表单数据
      formInline: {
        user: "",
        region: "",
      },

      // 弹框显示和隐藏
      dialogVisible: false,
      // 内层弹框显示和隐藏
      dialogVisible2: false,

      //点击Echarts显示表格详细数据
      type: "",

      dateChooseArr: ["今日", "本周", "当月"],
      isActive: 2, //默认选中 "今日", "本周", "当月"
      peopleActive: 0, //默认选中 人员概况
      warnActive: 0, //默认选中 预警告警统计

      mapLabelStyle: {
        // 设置label的样式
        color: "#d1e0e3",
        fontSize: "15px",
        boxShadow: "inset 0 0 5px #d1e0e3",
        background: "#081333",
        padding: "5px 15px",
        border: "1px solid #000",
        borderRadius: "3px",
      },
      mapLabelStyle2: {
        // 设置label的样式
        color: "#ffffff",
        fontSize: "14px",
        //  background: "#081333",
      },
      center: { lng: 120.635815, lat: 10.907211 },
      zoom: 1,
      labels: [
        {
          projectName: "和美三标",
          xaxis: "112.211734",
          yaxis: "26.164692",
        },
        {
          projectName: "原岸四期",
          xaxis: "111.510938",
          yaxis: "25.55923",
        },
      ],
    };
  },
  created() {
    this.getprojectInfo();
  },
  mounted() {
     console.log("url:",window.location.protocol + '//' + window.location.host + '/jz.apk');
    this.initMap();
  },
  methods: {
    // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          this.selectoptions.unshift({ value: "全部" });
        }
      });
    },
    complete(i) {
      // i的值  1 项目状态统计 2 项目状态统计 3 安全问题统计 4 环境监测统计 5 人员概况 6 AI抓拍统计 7 质量问题
      switch (i) {
        case 1:
          this.$refs.projectType.onSubmit1();
          this.$refs.projectType.DialogVisible = true;
          break;
        case 2:
          this.dialogVisible = true;
          this.showTable("塔式起重机");
          break;
        case 3:
          this.$refs.safetyTongjiEcharts.getProjectName();
          this.$refs.safetyTongjiEcharts.onSubmit();
          this.$refs.safetyTongjiEcharts.DialogVisible = true;
          break;
        case 4:
          console.log("woshi4");
          this.$refs.environmentTongjiEcharts.dialogVisible = true;
          // this.$refs.environmentTongjiEcharts.loadPageData();
          break;
        case 5:
          this.$refs.perplecharts.dialogVisible = true;
          // this.$refs.perplecharts.getProjectName()
          this.$refs.perplecharts.loadPageData();
          break;
        case 6:
          this.$refs.aIboxEcharts.getProjectName();
          this.$refs.aIboxEcharts.loadPageData();
          this.$refs.aIboxEcharts.dialogVisible = true;
          break;
        case 7:
          this.$refs.qualityProblem.getProjectName();
          this.$refs.qualityProblem.onSubmit();
          this.$refs.qualityProblem.DialogVisible = true;
          break;
      }
    },
    // Dialog对话框关闭 重置listQuery
    closeDialog() {
      this.projectSelect = "";
      this.typeSelect = "";
      this.listQuery = {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        type: "qb",
        proId: "",
      };
    },
    loadPageData1(index) {
      if (this.projectSelect == "全部") {
        // 项目没有选择时默认全部
        this.listQuery.proId = "";
      } else {
        this.listQuery.proId = this.projectSelect;
      }
      if (this.typeSelect == "") {
        // 类型没有选择默认全部
        this.listQuery.type = "qb";
      } else {
        this.listQuery.type = this.typeSelect;
      }

      this.tableLook = {
        oneInfo: "",
        showBox1: true,
        showBox2: false,
        showBox3: false,
        showBox4: false,
      };
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },
    loadPageData(index) {
      deviceStatisticsTbale(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            var dataArr = res.data.records;
            for (var i = 0; i < dataArr.length; i++) {
              if (dataArr[i].category == "tj") {
                dataArr[i].shebeiNmae = "塔式起重机";
              }
              if (dataArr[i].category == "td") {
                dataArr[i].shebeiNmae = "施工升降机";
              }
              //  if(dataArr[i].category =='spjk'){
              //     dataArr[i].shebeiNmae ="视频监控"
              // }
              if (dataArr[i].category == "znsd") {
                dataArr[i].shebeiNmae = "智能水电";
              }
              if (dataArr[i].category == "xlpt") {
                dataArr[i].shebeiNmae = "卸料平台";
              }
              if (dataArr[i].category == "ycjc") {
                dataArr[i].shebeiNmae = "扬尘监测";
              }
            }

            this.equipmentData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    showTable(params) {
      //获取项目
      this.getProjectName();
      this.tableLook = {
        oneInfo: "",
        showBox1: true,
        showBox2: false,
        showBox3: false,
        showBox4: false,
      };
      console.log(1011, this.listQuery.type);
      // 判断Type的值是否为空 防止为空时请求报错
      deviceStatisticsTbale(this.listQuery).then((res) => {
        if (res.code == "success") {
          console.log(res);

          var dataArr = res.data.records;
          for (var i = 0; i < dataArr.length; i++) {
            if (dataArr[i].category == "tj") {
              dataArr[i].shebeiNmae = "塔式起重机";
            }
            if (dataArr[i].category == "td") {
              dataArr[i].shebeiNmae = "施工升降机";
            }
            //  if(dataArr[i].category =='spjk'){
            //     dataArr[i].shebeiNmae ="视频监控"
            // }
            if (dataArr[i].category == "znsd") {
              dataArr[i].shebeiNmae = "智能水电";
            }
            if (dataArr[i].category == "xlpt") {
              dataArr[i].shebeiNmae = "卸料平台";
            }
            if (dataArr[i].category == "ycjc") {
              dataArr[i].shebeiNmae = "扬尘监测";
            }
          }

          this.equipmentData = res.data.records;
          this.total = res.data.total;
          this.dialogVisible = true; // 显示对话框
        }
      });
    },
    getMapInfo() {},
    // 地图函数方法
    initMap() {
      this.map = new BaiMap.Map("mapBOX");
      let point = new BaiMap.Point(this.center.lng, this.center.lat);
      this.map.setMapType(BMAP_EARTH_MAP);
      this.map.centerAndZoom(point, this.zoom);
      this.map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
      this.map.enableDragging(); //启用地图拖拽，默认启用
      this.map.enableDoubleClickZoom(); //启用双击放大，默认启用
      this.map.setMapStyleV2({
        styleId: "f3424686c2ea291f79d73af9d36314bd",
      });
      this.queryMapData();
    },
    queryMapData() {
      // getMapData(this.mapSelect).then((res) => {
      //   // 请求地图数据
      //   this.labels = res;
      //   this.addLabel();
      // });
      this.addLabel();
    },
    addLabel() {
      var _this = this;
      //加载地图的数据
      mapInfo({ parentId: this.$store.state.project.projectId }).then((res) => {
        // console.log("地图数据", res);
        // this.projectOptions = res.data;
        this.map.clearOverlays();
        console.log('初始化节点',res)
        res.data.forEach((item) => {
          let point = new BaiMap.Point(
            Number(item.xaxis) ,
            Number(item.yaxis)
          ); //x,y 坐标
          let label = new BaiMap.Label(
            `<a></a><i class="el-icon-office-building"></i>${item.proName}`,
            {
              // 创建文本标注
              position: point,
              offset: new BaiMap.Size(0, 0),
            }
          );
          this.map.addOverlay(label); // 将标注添加到地图中
          label.setStyle(this.mapLabelStyle); //添加样式

          label.addEventListener("click", (res) => {
            console.log(1111, res);
            _this.showimg = true;
            for (var j = 0; j < _this.projectOptions.length; j++) {
              if (item.proId == _this.projectOptions[j].proId) {
                if (_this.projectOptions[j].onclickNumber == 1) {
                  return;
                }
                _this.projectOptions[j].onclickNumber = 1;

                let pointDiv = new BaiMap.Point(
                  Number(item.xaxis) + 0.0006 - 0.0005,
                  Number(item.yaxis) + 0.0005
                ); //x,y 坐标
                let proBox = new BaiMap.Label(
                  `<div class ='showProjectBox' >
                     <span class ='span1' name='${j}' @click="cancelSpan()"></span>
                     <p><i></i>${_this.projectOptions[j].proName}</p>

                     <p><i>项目类型: </i>${
                       _this.projectOptions[j].projectType
                     }</p>
                      <p><i>项目位置: </i>${_this.projectOptions[j].city}</p>
                     <p><i>项目状态: </i>${
                       _this.projectOptions[j].projectStatus
                     }</p>
                     <p><i>建筑面积: </i>${
                       _this.projectOptions[j].buildArea
                         ? _this.projectOptions[j].buildArea + " 平方米"
                         : "- -"
                     }</p>
                     <p><i>工程造价: </i>${
                       _this.projectOptions[j].projectPrice
                         ? _this.projectOptions[j].projectPrice
                         : "- -"
                     }</p>
                     <span class="span2"
                     >查看更多 ></span>
                  </div>`,
                  {
                    // 创建文本标注
                    position: pointDiv,
                    offset: new BaiMap.Size(0, 0),
                  }
                );
                _this.map.addOverlay(proBox); // 将标注添加到地图中
                proBox.setStyle(_this.mapLabelStyle2); //添加样式
                // proBox.addEventListener("click", (res) => {

                // });

                $(".showProjectBox .span2").each(function () {
                  $(this).click(function () {
                    console.log(123456, item);
                    // _this.$store.commit("项目级", {
                    //   name: item.proName,
                    //   id: item.proId,
                    // });
                    _this.$store.dispatch("project/setProjectId", item.proId);
                    _this.$store.dispatch(
                      "project/setProjectName",
                      item.proName
                    );
                    _this.$store.dispatch("project/setProjectChildrenIds", [
                      item.proId,
                    ]);
                    _this.$store.dispatch("project/setParentId", item.parentId);
                    _this.$router.push("/viewPlate/describe/describe");
                    // _this.$router.push("/viewPlate/describe/describe");
                  });
                });

                $(".showProjectBox .span1").each(function () {
                  $(this).click(function () {
                    console.log(789);

                    var j = $(this).attr("name");
                    _this.projectOptions[j].onclickNumber = 0;

                    $(this).parent().remove();
                  });
                });

                return;
              }
            }

            // 点击后跳转
            // this.$store.commit('user/SET_PROJECTID',{
            //   name:item.projectName,
            //   id:item.projectId
            // })
            //  this.$router.push("/projectIndex/describe");
          });
        });
      });
    },
    commitProId() {},
    // 地图函数方法

    pChooseFive(item) {
      this.peopleActive = item;
      if (item == 0) {
        this.$refs.perplecharts.ways(this.isActive, "one");
      } else {
        this.$refs.perplecharts.ways(this.isActive, "two");
      }
    },
    warnChoose(item) {
      this.warnActive = item;
      if (item == 0) {
        this.warnChooseShow = true;
        this.$refs.warnRef.changeBox1(this.isActive, this.gjnrValue);
      } else {
        this.warnChooseShow = false;
        this.$refs.warnRef.changeBox2(this.isActive);
      }
    },
    zongLanChoose(index) {
      this.isActive = index;
      // 调用 环境 人员 AI 抓拍 方法
      // 默认第一个：
      this.peopleActive = 0;
      this.warnActive = 0;
      this.$refs.environmentTongjiEcharts.ways(index);
      this.$refs.perplecharts.ways(index, "one");
      this.$refs.aIboxEcharts.ways(index);
      //预警告警统计
      this.$refs.warnRef.ways(index, this.gjnrValue);
      this.$refs.safetyTongjiEcharts.ways(index);
    },
    handleEdit(index, row) {
      // 处理数据  跳转页面
      this.listQuery1 = {
        pageIndex: 1,
        pageSize: 10,
        tjNum: row.machineNumber,
        tdNum: row.machineNumber,
        machineNum: row.machineNumber,
      };
      this.tableLook.showBox1 = true;
      //弹出第二个框
      this.dialogVisible2 = true;

      if (row.category == "tj") {
        this.$nextTick(function () {
          this.$refs.tableeee.loadPageData(this.listQuery1);
          this.tableLook.showBox2 = true;
          this.equipmentTitle = "塔式起重机详情";
        });
      } else if (row.category == "td") {
        //
        this.$nextTick(function () {
          this.tableLook.showBox3 = true;
          this.$refs.tableeee2.loadPageData(this.listQuery1);
          this.equipmentTitle = "施工升降机详情";
        });
      } else if (row.category == "ycjc") {
        //
        this.$nextTick(function () {
          this.tableLook.showBox4 = true;
          this.$refs.tableeee3.loadPageData(this.listQuery1);
          this.equipmentTitle = "扬尘监测详情";
        });
      } else if (row.category == "spjk") {
        //
        //  this.tableLook.showBox5 = true;
        // this.$nextTick(function () {
        //   this.$refs.tableeee4.loadPageData(row);
        //   this.equipmentTitle = "视频播放详情";
        // });
      } else {
        alert("暂无详细数据");
      }
      //

      //
      // this.tableLook.oneInfo =row
      // this.tableLook.showBox1 =row
      // this.showImage = true
    },
    searchProject() {
      // 选择后调整 地图的位置

      if (this.projectOptionsOneObject) {
        // 去取 横纵坐标
        console.log("坐标", this.projectOptionsOneObject);
        let point = new BaiMap.Point(
          this.projectOptionsOneObject.xaxis ,
          this.projectOptionsOneObject.yaxis
        );
        this.map.centerAndZoom(point, 12);

        // var zoom = 7;
        // var aa = setInterval(() => {
        //   zoom++;
        //   this.map.centerAndZoom(point, zoom);
        //   if (zoom >= 10) {
        //     clearInterval(aa);
        //   }
        // }, 1000);
        // setTimeout(() =>{
        //     this.map.centerAndZoom(point, 12);
        // },5000)
      } else {
        alert("请先选择项目");
      }
    },
    fnEdit() {
      // 切换图标
      console.log(this.gjnrValue);
      this.$refs.warnRef.changeBox1(this.isActive, this.gjnrValue);
    },
    exportExcel() {
      //导出信息
      console.log(this.$store.state.project.projectId);
      console.log(this.$store.state.project.projectChildrenIds);
      var aa = this.$store.state.project.projectChildrenIds;
      var projectChildrenIds = "";
      for (var i = 0; i < aa.length; i++) {
        projectChildrenIds = projectChildrenIds + aa[i] + ",";
      }
      projectChildrenIds = projectChildrenIds.substr(
        0,
        projectChildrenIds.length - 1
      );
      console.log(projectChildrenIds);
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-qualitysafe-manager/exportAlarmExcel?flag=" +
        this.isActive +
        "&warning=" +
        this.gjnrValue +
        "&projectId=" +
        this.$store.state.project.projectId +
        "&projectChildrenIds=" +
        projectChildrenIds;
    },
    getprojectInfo() {
      getMapInfoTitle().then((res) => {
        console.log("地图数据", res);
        this.projectOptions = res.data;
      });
    },
    proNameSelect1() {
      for (var i = 0; i < this.projectOptions.length; i++) {
        if (this.mapSelect.proName == this.projectOptions[i].proName) {
          //项目选中的 对象数据
          console.log("id", this.mapSelect.proName);
          this.projectOptionsOneObject = this.projectOptions[i];
          this.mapSelect.proStatus = this.projectOptions[i].projectStatus;
          this.mapSelect.proType = this.projectOptions[i].projectType;
          this.mapSelect.proUse = this.projectOptions[i].projectPurpose;
          return;
        }
      }
    },
    lookSpan() {
      alert(111);
    },
  },
  watch: {
    dialogVisible2: {
      handler: function (newV, oldV) {
        //newV 变化后, oldV 变化前
        if (newV == false) {
          this.tableLook = {
            oneInfo: "",
            showBox1: true,
            showBox2: false,
            showBox3: false,
            showBox4: false,
          };
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="less">
::v-deep .aa.content-left-bottom.commonbox {
  background: url("../../../../assets/compent/cdc.png") no-repeat !important;
}
.mapBox {
  .anchorBL {
    img {
      display: none !important;
    }
  }
}
</style>
<style lang="less" scoped>
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: 20px;

  // min-height: 830px;
  // overflow:auto;
  display: flex;
}
.content-left {
  width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  //  border: 2px solid pink;
  .content-left-top {
    margin-bottom: 26px;
  }
  .icon-document {
    width: 100%;
    height: 22vh;
    min-height: 170px;
    box-sizing: border-box;
  }
}
//中间大模块
.content-mid {
  //  border: 2px solid pink;
  position: relative;
  min-width: 863px;
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  justify-content: space-between;

  /////
  .query-form {
    position: absolute;
    top: 20px;
    right: 2%;
    // transform: translate(-50%, 0);
    z-index: 99;
    .mapQuery-btn {
      display: inline-block;
      height: 30px;
      width: 30px;
      font-size: 23px;
      line-height: 30px;
      // background: #010220;
      text-align: center;
      border: 1px solid #0d85a9;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  ////
  /* 地图 */
  .mapBox {
    position: relative;
    // height: 100%;
    height: 56vh;
    // padding-top:25px ;
    margin-bottom: 18px;
    /deep/ label.BMapLabel {
      a {
        display: block;
        position: absolute;
        left: -26px;
        top: 0;
        width: 20px;
        height: 28px;
        background: url("../../../../assets/viewplate/map_label_ico.png")
          no-repeat;
      }
    }
    .bm-view {
      width: 100%;
      height: 100%;
    }
    /deep/.showProjectBox {
      padding: 10px;
      padding-left: 30px;
      width: 400px;
      height: 260px;
      font-weight: 400;
      background: url("../../../../assets/viewplate/picture_tankuang.png")
        no-repeat;
      position: absolute;
      bottom:0%;
      right: 9%;
      z-index: 9999;
      background-size: 400px 260px;
      p {
        i {
          color: #556a86;
          margin-right: 10px;
        }
      }
      p:nth-of-type(1) {
        color: #fff;
        font-family: PingFang SC;
        font-size: 20px;
        i {
          display: inline-block;
          width: 24px;
          height: 15px;
          background: url("../../../../assets/viewplate/picture_jiantou.png")
            no-repeat;
          background-size: 24px 15px;
          margin-right: 15px;
        }
      }
      p:nth-of-type(2) {
      }
      .span1 {
        display: inline-block;
        padding: 12px;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 25px;
        right: 20px;
        background: url("../../../../assets/viewplate/picture_guanbi.png")
          no-repeat;
        background-size: 20px 20px;
      }
      .span2 {
        color: #fff;
        padding: 10px 0;
      }
    }
  }
  .aa {
    // padding-top: 5px;
    // background-color: rgba(5, 15, 47, 0.8);
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 99;
    // bottom: 0.2vh;
    bottom: 0%;
    .content-left-bottom {
      position: relative;
      margin: 0;

      .el-select {
        // margin: 0 15px;
        margin-left: 15px;
      }
      .el-button-group {
        position: absolute;
        top: 10px;
        left: 75%;
        // transform: translate(-50%, 0);
        z-index: 100;
      }
    }
  }
  .icon-document {
    width: 100%;
    height: 22vh;
    min-height: 170px;
    box-sizing: border-box;
  }
}

//最右边
.content-right {
  //  border: 2px solid pink;
  width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .icon-document {
    width: 100%;
    height: 22vh;
    min-height: 170px;
    box-sizing: border-box;
  }
}

.vp-project-content .el-button {
  // 默认状态
  background: none;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 186, 255, 0.5);
}
.active {
  //选中状态
  color: #00baff !important;
  border: 1px solid rgba(0, 186, 255, 1) !important;
}

.icon-document,
.internetTongji,
.personnelSituation {
  width: 100%;
  height: 100%;
}
@media screen and (max-width: 1024px) {
  .content-left,
  .content-right {
    height: 100%;
  }
  .content-mid {
    height: 100%;
    margin-top: 10px;
  }
  .content-mid .mapBox {
    // height: 69.5vh !important;
  }
  .content-mid .aa {
    // height: calc(100% - 69.5vh);
  }
}
/deep/ .el-dialog {
  width: 50%;
  // max-height: 680px;
  min-height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0vh !important;
}
/deep/ .el-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}

/deep/ .el-dialog .el-dialog__header {
  margin-top: 20px;
  .el-dialog__title {
    color: #fff;
  }
}
.el-pagination {
  text-align: center;
}
.el-select {
  margin-left: 10px;
}
// /deep/.content-left-bottom .com-box{
//   margin-bottom:0px!important;
// }
/deep/.el-loading-mask {
  background: rgba(3, 7, 34, 0.8);
}
</style>
