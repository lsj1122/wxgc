<template>
  <div class="viewplate-main">
    <div id="vp-header">
      <h4 class="left-title">
        系统已监管
        <span>000</span>天
     <div class="projectvp-nav">
            <!-- <router-link v-for="item in pchid" :key="item.path" :to="item.path">{{zh.route[item.meta.title]}}</router-link> -->
          </div>
      </h4>
      <h4 class="right-title">{{currentTime}} </h4>
      <span class="left-bg"></span>
      <h1 class="title">典型项目企业级看板</h1>
      <div class="userInfo">
        <a class="el-icon-full-screen common zt" @click="setScreen"  title="全屏模式"></a>
        <a class="iconfont iconzhongtai common" @click="$router.push('/')"  title="中台"></a>
        <a class="iconfont iconshezhi common" title="设置"></a>
        <a class="iconfont iconyonghu common" title="用户"></a>
      </div>
    </div>
    <div id="vp-mian">
      <div id="vp-main-left">
        <combox title="实时监管项目" class="ssjgxm">
          <h4>项目总数</h4>
          <div class="zhanshi-shu">
            <i
              v-for="(n,index) in String(realTimeProjectData.projectCount).split('')"
              :key="index"
            >{{n}}</i>
            个
          </div>
          <h4>项目总投资</h4>
          <div class="zhanshi-shu xmztz">
            <i
              v-for="(n,index) in String(realTimeProjectData.projectInvest).split('')"
              :key="index"
            >{{n}}</i>
            亿元
          </div>
          <h4>项目总面积</h4>
          <div class="zhanshi-shu xmzmj">
            <i
              v-for="(n,index) in String(realTimeProjectData.projectArea).split('')"
              :key="index"
            >{{n}}</i>
            万平方米
          </div>
        </combox>
        <combox title="工地设备详情" style="height:calc(100% - 339px)" class="srcoll-vp-box">
          <div class="gdsb-item" @click="showWarrDet('塔机监控')">
            塔机监控
            <span>
              <i>{{ siteSbData.tj_count }}</i>个
            </span>
            <a>正常：{{ siteSbData.tj_count }}</a>
            <a class="offline">离线：{{ siteSbData.tj_offLine }}</a>
            <a class="warr">报警：0</a>
          </div>
          <div class="gdsb-item" @click="showWarrDet('升降机监控')">
            升降机监控
            <span>
              <i>{{ siteSbData.td_count }}</i>个
            </span>
            <a>正常：{{ siteSbData.td_count }}</a>
            <a class="offline">离线：{{ siteSbData.td_offLine }}</a>
            <a class="warr">报警：0</a>
          </div>
          <div class="gdsb-item" @click="showWarrDet('视频监控')">
            视频监控
            <span>
              <i>{{ siteSbData.video }}</i>个
            </span>
            <a>正常：{{ siteSbData.video }}</a>
            <a class="offline">离线：0</a>
            <a class="warr">报警：0</a>
          </div>
          <div @click="showWarrDet('车辆监控')" class="gdsb-item">
            车辆监控
            <span>
              <i>{{ siteSbData.car }}</i>个
            </span>
            <a>正常：{{ siteSbData.car }}</a>
            <a class="offline">离线：0</a>
            <a class="warr">报警：0</a>
          </div>
          <div class="gdsb-item" @click="showWarrDet('水电监控')">
            水电监控
            <span>
              <i>{{ siteSbData.EW }}</i>个
            </span>
            <a>正常：{{ siteSbData.EW }}</a>
            <a class="offline">离线：0</a>
            <a class="warr">报警：0</a>
          </div>
          <div class="gdsb-item" @click="showWarrDet('环境监控')">
            环境监控
            <span>
              <i>{{ siteSbData.ycjc_count }}</i>个
            </span>
            <a>正常：{{ siteSbData.ycjc_count }}</a>
            <a class="offline">离线：{{ siteSbData.ycjc_offLine}}</a>
            <a class="warr">报警：{{siteSbData.ycjc_offLine}}</a>
          </div>
        </combox>
      </div>
      <div id="vp-main-content">
        <combox style="height:100%;padding:0;position:relative" class="map-center-combox">
          <!-- <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handleMap"> </baidu-map> -->
          <div class="table-box" :style="{height:isDownTable?'0vh':'31.5vh'}">
            <i
              class="down-btn"
              :class="{'el-icon-arrow-down':!isDownTable,'el-icon-arrow-up':isDownTable}"
              @click="downTableBox"
            ></i>
            <el-button-group>
              <el-button type="primary" size="small" @click="isGJXQ = true">报警详情</el-button>
              <el-button type="primary" size="small" @click="isGJXQ = false">实时监管项目</el-button>
            </el-button-group>
            <combox title="报警详情" style="height:28vh" v-show="isGJXQ">
              <template #head>
                <el-select
                  v-model="gjnrValue"
                  size="small"
                  placeholder="报警内容"
                  clearable
                  @change="fnEdit"
                >
                  <el-option label="力矩报警" value="力矩报警"></el-option>
                  <el-option label="幅度限位报警" value="幅度限位报警"></el-option>
                  <el-option label="报警" value="报警"></el-option>
                </el-select>
                <el-button type="success" @click="exportExcel" size="small" style="margin-left:10px">导出</el-button>
              </template>

              <el-table
                :data="tableData"
                style="width: 100%;border-radius:10px"
                height="200"
                class="scrollTable"
              >
                <el-table-column prop="projectName" label="项目名称" width="180"></el-table-column>
                <el-table-column prop="projectManager" label="项目负责人" width="90"></el-table-column>
                <el-table-column prop="phoneNumber" label="电话" width="120"></el-table-column>
                <el-table-column prop="projectArea" label="所属地区" width="100"></el-table-column>
                <el-table-column prop="machineType" label="设备类型" width="100"></el-table-column>
                <el-table-column prop="uploadDate" label="报警时间" width="160">
                  <template slot-scope="scope">{{ scope.row.uploadDate | dateformat }}</template>
                </el-table-column>
                <el-table-column prop="systemStatus" label="报警内容" width="130">
                  <template slot-scope="scope">
                    <a style="color:red">{{scope.row.systemStatus}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="deviceName" label="设备名称" width="120"></el-table-column>
                <el-table-column prop="videoDevice" label="设备编号" width="120"></el-table-column>
              </el-table>
            </combox>
            <combox style="height:28vh" v-show="!isGJXQ">
              <div id="ssjgxm-chart"></div>
            </combox>
          </div>
        </combox>
      </div>
      <div id="vp-main-right">
        <combox title="人员概况" style="height:260px">
          <div class="person-reg" style="position:relative;">
            <img src="../../../assets/viewplate/data_bg_l.png" alt class="img Rotation" />
            <h2 style="position:absolute;left:37%;top:-1%;">1860</h2>
            <span>管理人员在册总数</span>
          </div>
          <div class="person-b" style="position:relative;">
            <img src="../../../assets/viewplate/data_bg_r.png" alt class="img Rotation" />
            <h2 style="position:absolute;left:37%;top:-1%;">8635</h2>
            <span>建筑工人在册总数</span>
          </div>
        </combox>
        <combox title="管理数据" style="height: calc(100% - 339px);" class="srcoll-vp-box">
          <ul class="glsjbox">
            <li v-for="(item,index) in mangeDataList" @click="showDetail(item)" :key="index">
              <div>
                <a>{{ item.title }}</a>
                <span>
                  <i v-for="(n,ind) in item.num.split('')" :key="ind">{{ n }}</i>
                </span>
              </div>
              <h5 :class="{'daDown':item.isDown}">
                {{ item.pre }}%
                <span>（同比昨天）</span>
              </h5>
            </li>
          </ul>
        </combox>
      </div>
    </div>
    <el-dialog
      :title="diaValue"
      :visible.sync="DialogVisible"
      width="800px"
      center
      class="dialog-wrap"
    >
      <div>
        <div class="dig-body">
          <div class style="text-align:right">
            <span>设备详情：</span>
            <el-select
              v-model="value"
              style="width:120px;margin-right:5px"
              placeholder="请选择"
              clearable
              @change="fnEdit2"
            >
              <el-option label="报警" value="警"></el-option>
              <el-option label="正常" value="正常"></el-option>
              <el-option label="离线" value="离线"></el-option>
            </el-select>
            <span>报警详情：</span>
            <el-select :disabled="!disabled"
                    v-model="value2"
                    style="width:120px;margin-right:5px"
                    placeholder="请选择"
                    clearable
                    @change="fnEdit3"
            >
              <el-option label="超载报警" value="超载"></el-option>
              <el-option label="超员报警" value="超员"></el-option>
            </el-select>
            <el-input
              placeholder="请输入内容"
              style="width:160px"
              suffix-icon="el-icon-search"
              v-model="input1"
              @blur="searchTwo"
            ></el-input>
          </div>
          <el-table :data="tableData2" style="width: 100%" height="500">
            <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.label" :width="item.width" :prop="item.prop">
                <a v-if="item.value">{{item.value}}</a>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <mgDataDialog :Dialogvisib.sync="showmgDataDial" :dialogTitle="magedataTitle"/>
  </div>
</template>


<script>
import  zh  from '../../../lang/zh';
import { mapGetters } from 'vuex'

import fullScreen from '@/utils/fullScreen'
import BaiMap from "BaiMap";
import echarts from "echarts";
import mgDataDialog from './mangeDataDialog'
import moment from "moment";
// import {
//   getltData,
//   getleftData,
//   getMapData,
//   getWarrDetData,
//   getDetailData,
//   getAreaSelect,
// } from "@/api/viewplate/enterPrise/enterprise";
export default {
  components:{
    mgDataDialog
  },
   computed: {
  },
  data() {
    return {
      zh : zh,
      pchid:null,
      tableHead:[],
      tableHead_tj:[
        {label:'设备状态',width:120,value:'在线'},
        {label:'时间',width:180,prop:"uploadDate"},
        {label:'项目',prop:'projectName'},
        {label:'告警内容',prop:'systemStatus'},
        {label:'项目负责人',width:140,prop:'projectManager'}
      ],
      tableHead_spjk:[
        {label:'时间',prop:'uploadDate'},
        {label:'项目',prop:'projectName'},
        {label:'来源',prop:'systemStatus'},
        {label:'报警',prop:'projectManager'},
        {label:'项目负责人',prop:'projectManager'},
      ],
      tableHead_cljk:[
        {label:'时间',prop:'uploadDate'},
        {label:'项目',prop:'projectName'},
        {label:'车牌号码',prop:'carNumber'},
        {label:'报警操作',prop:'systemStatus'},
        {label:'项目负责人',prop:'projectManager'},
      ],
      tableHead_hjjc:[
        {label:'时间',prop:'uploadDate'},
        {label:'项目',prop:'projectName'},
        {label:'设备编号',prop:'deviceName'},
        {label:'报警',prop:'systemStatus'},
        {label:'项目负责人',prop:'projectManager'}
      ],
      tableHead_sdjk:[
        {label:'项目',prop:'projectName'},
        {label:'安装区域',prop:'uploadDate'},
        {label:'设备编号',prop:'deviceName'},
        {label:'本月电量',prop:'projectManager'},
        {label:'阈值电量',prop:'projectManager'},
        {label:'报警',prop:'systemStatus'},
        {label:'项目负责人',prop:'projectManager'}
      ],
      showmgDataDial:false,
      magedataTitle:'',
      isGJXQ: true,
      value: "",
      TopOption: null,
      input1: "",
      value2:'',
      DialogVisible: false,
      diaValue: "",
      currentTime: "",
      disabled:true,
      realTimeProjectData: {
        projectInvest: "",
        projectCount: "",
        projectArea: "",
      },
      warrDetData: [],
      tableData: [],
      tableData2: [],
      tableData3:[],
      siteSbData: {
        td_onLine: 0,
        td_offLine: 0,
        EW: 0,
        car: 0,
        ycjc_count: 0,
        tj_count: 0,
        tj_onLine: 0,
        tj_offLine: 0,
        ycjc_onLine: 0,
        td_count: 0,
        video: 0,
        ycjc_offLine: 0,
      },
      mapSelect: {
        proName: "",
        proStatus: "",
        proType: "",
        proUse: "",
      },
      detail: [],
      gjnrValue: "",
      mangeDataList:[
        {title:'管理人员在场率',num:'001512',pre:'12.5'},
        {title:'劳务工人在场率',num:'008621',pre:'18.9',isDown:true},
        {title:'塔吊在线率',num:'001240',pre:'32.5'},
        {title:'升降机在线率',num:'005375',pre:'0.50',isDown:true},
        {title:'监控在线率',num:'000963',pre:'0.83'},
        {title:'违章提醒率',num:'000114',pre:'3.26',isDown:true}
      ],
      center: { lng: 113.27, lat: 23.13 },
      zoom: 5,
      labels: [],
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
      isDownTable: false,
      tableTimer: null,
      timer: null,
      ntimer: null,
    };
  },
  created() {
    this.setSysTime();
    this.getRealPro();
    this.getSiteDet();
    this.getWarrList();
  },
  mounted() {
    this.getViewPlateRoutes()
    this.initMap(this.mapSelect);
    this.initSSJGchart();
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.tableTimer);
  },
  methods: {
    getViewPlateRoutes(){
      this.$store.getters.permission_routes.forEach(item => {
        if(item.path === '/enterPrise'){
           this.pchid = item.children
        }
      })
      console.log(this.$store.getters.permission_routes)
    },

    setScreen(){
      fullScreen()
    },
    showDetail(item){
      this.showmgDataDial = true;
      this.magedataTitle = item.title;
    },
    exportExcel()
    {
      window.location.href='/api/system/company-board/exportExcel'
    },
    searchTwo()
    {
      this.tableData2 = this.detail;
      this.tableData2=this.tableData2.filter(
              (item) => item.projectName.indexOf(this.input1) != -1 || item.projectManager.indexOf(this.input1) != -1
      )
    },
    scrollAnima() {
      let parentEl = document.querySelector(".scrollTable ");
      let elem = parentEl.querySelector(".el-table__body-wrapper");
      let tablebox = elem.querySelector(".el-table__body");
      this.tableTimer = setInterval(function () {
        elem.scrollTop++;
        if (elem.scrollTop + elem.offsetHeight === tablebox.offsetHeight) {
          elem.scrollTop = 0;
        }
      }, 60);
    },
    searchProject() {
      this.queryMapData()
    },
    downTableBox() {
      this.isDownTable = this.isDownTable ? false : true;
    },
    fnEdit() {
      this.tableData = this.warrDetData;
      this.tableData = this.tableData.filter(
        (item) => item.systemStatus === this.gjnrValue
      );
    },
    fnEdit2() {
      this.tableData2 = this.detail;
      this.tableData2 = this.tableData2.filter(
        (item) => item.systemStatus.indexOf(this.value) != -1
      );
      if (this.value!='警')
      {
        this.disabled=false;
      }else if (this.value.indexOf('警')!=-1)
      {
        this.disabled=true;
      }
    },
    fnEdit3() {
      this.tableData3=this.detail;
      this.tableData2 = this.tableData3.filter(
              (item) => item.systemStatus.indexOf(this.value2) != -1
      );
    },
    setSysTime() {
      let that = this;
      this.timer = setInterval(function () {
        that.currentTime =moment().format('yyyy-MM-DD HH:mm:ss')
      }, 1000);
    },
    initSSJGchart() {
      let name = [];
      let count = [];
      let that = this;
      // getAreaSelect().then((res) => {
      //   for (let k in res) {
      //     name.push(k);
      //     count.push(res[k]);
      //   }
      //   that.InitOption(name, count);
      // });
    },
    InitOption(name, count) {
      let names = name;
      let counts = count;
      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#fff",
              },
            },
            data: names,
          },
        ],
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
            type: "value",
          },
        ],
        series: [
          {
            name: "项目数",
            type: "bar",
            barWidth: "30px",
            data: counts,
          },
        ],
      };
      let myChart = echarts.init(document.getElementById("ssjgxm-chart"));
      myChart.setOption(option);
    },
    getRealPro() {
      //实时监管项目
      // getltData().then((res) => {
      //   console.log(res);
      //   this.realTimeProjectData.projectInvest =
      //     Math.floor((res.projectInvest / 10000) * 100) / 100;
      //   this.realTimeProjectData.projectCount = res.projectCount;
      //   this.realTimeProjectData.projectArea =
      //     Math.floor((res.projectArea / 10000) * 100) / 100;
      // });
    },
    getSiteDet() {
      //工地设备详情数据
      // getleftData().then((res) => {
      //   this.siteSbData = res;
      // });
    },
    getWarrList() {
      //请求告警详情数据
      // getWarrDetData().then((res) => {
      //   this.warrDetData = res;
      //   this.tableData = res;
      //   this.$nextTick(function () {
      //     this.scrollAnima();
      //   });
      // });
    },
    showWarrDet(data) {
      this.diaValue = data;
      this.DialogVisible = true;
      this.value = "";
      if(data==='塔机监控'||data==='升降机监控'){
        this.tableHead = this.tableHead_tj;
      }
      if(data==='视频监控'){
        this.tableHead = this.tableHead_spjk;
      }
      if(data==='车辆监控'){
        this.tableHead = this.tableHead_cljk;
      }
      if(data==='水电监控'){
        this.tableHead = this.tableHead_sdjk;
      }
      if(data==='环境监控'){
        this.tableHead = this.tableHead_hjjc;
      }
      let param = {
        name: data,
      };
      // getDetailData(param).then((res) => {
      //   this.detail = res;
      //   this.tableData2 = res;
      //   console.log(this.detail);
      // });
    },
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
      this.queryMapData()
    },
    queryMapData(){
      // getMapData(this.mapSelect).then((res) => {
      //   // 请求地图数据
      //   this.labels = res;
      //   this.addLabel();
      // });
    },
    addLabel() {
      this.map.clearOverlays()
      this.labels.forEach((item) => {
        console.log(item)
        let point = new BaiMap.Point(item.xaxis, item.yaxis);
        let label = new BaiMap.Label(
                `<a></a><i class="el-icon-office-building"></i>${item.projectName}`,
                {
                  // 创建文本标注
                  position: point,
                  offset: new BaiMap.Size(0, 0),
                }
        );
        this.map.addOverlay(label); // 将标注添加到地图中
        label.setStyle(this.mapLabelStyle);
        label.addEventListener("click", () => {
          this.$router.push("/projectIndex/describe");
          this.$store.commit('user/SET_PROJECTID',{
            name:item.projectName,
            id:item.projectId
          })
        });
      });
    },
    loadtMapLabel() {},
  },
};
</script>

<style lang="less" scoped>
@import "../../../styles/font.css";

@subColor: #c3c3c3;
@comheight: 95px;
.viewplate-main {
  height: 100vh;
  //min-height: 900px;
  // min-width: 1600px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #0f152f;
  color: @fcolor;
  #vp-header {
    height: @comheight;
    position: relative;
    background: url("../../../assets/viewplate/head_bg.png") no-repeat center;
    a.xitongbq {
      display: block;
      position: absolute;
      cursor: pointer;
      color: #00baff;
      background: url("../../../assets/viewplate/t_bg.png") no-repeat;
      width: 180px;
      height: 44px;
      line-height: 53px;
      font-weight: 600;
      font-size: 17px;
      right: 15%;
      top: 50px;
    }
    h1.title {
      margin: 0;
      height: @comheight;
      line-height: @comheight;
      font-weight: 500;
      color: #fff;
      text-shadow: 0 0 35px @fcolor;
    }
    span.left-bg {
      display: block;
      width: 295px;
      height: 90px;
      position: absolute;
      background: url("../../../assets/viewplate/left_bg.png") no-repeat center;
      left: 0;
      top: 0;
    }
    .left-title {
      position: absolute;
      left: 335px;
      top: 50px;
      z-index: 99;
      font-weight: 400;
    }
    .right-title {
      position: absolute;
      right: 10px;
      top: 10px;
      font-weight: 400;
      margin: 0;
    }
    .userInfo {
      position: absolute;
      right: 20px;
      bottom: 0;
      z-index: 99;
      .common{
        font-size:20px;
        cursor: pointer;
        margin-left: 13px;
      }
      .user-head {
        display: inline-block;
        font-size: 32px;
        width: 43px;
        height: 43px;
        border: 1px solid #0086bb;
        line-height: 49px;
        border-radius: 30px;
      }
      a {
        margin-left: 7px;
        text-align: left;
        font-size: 16px;
        display: inline-block;
        span {
          color: #fff;
          display: block;
          i {
            font-style: normal;
          }
        }
      }
      img {
        width: 40px;
        height: 40px;
        background: #fff;
      }
    }
  }
  #vp-mian {
    display: flex;
    height: calc(100% - 130px);
    margin: @spacing;
    #vp-main-left {
      width: 360px;
      display: flex;
      flex-direction: column;
      .ssjgxm {
        height: 260px;
        h4 {
          font-size: 14px;
          color: @subColor;
          font-weight: 400;
          margin: 7px 0 11px 0;
        }
        div.zhanshi-shu {
          color: @subColor;
          display: block;
          margin-bottom: 14px;
          i {
            display: inline;
            padding: 3px 5px;
            font-size: 25px;
            color: #87eaff;
            background: #021550;
            margin-right: 8px;
            border: 2px solid #2eb7fd;
            font-style: normal;
          }
        }
        div.xmztz {
          i {
            background: #443425;
            color: #ffb5a0;
            border-color: #e48d23;
          }
        }
        div.xmzmj {
          i {
            background: #014e56;
            color: #a2febb;
            border-color: #06ffa7;
          }
        }
      }
      .gdsb-item {
        padding: 10px 15px 8px 15px;
        float: left;
        width: 38%;
        border: 1px solid #00b7fd;
        border-radius: 8px;
        color: @subColor;
        margin: 0 2% 10px 0;
        span {
          display: block;
          margin: 5px 0;
          i {
            color: #63aeff;
            font-size: 22px;
            font-family: "dzfont";
            font-style: normal;
            margin-right: 8px;
          }
        }
        a {
          display: block;
          color: #59d000;
          margin-bottom: 4px;
        }
        a.offline {
          color: #eace00;
        }
        a.warr {
          color: #ff0303;
        }
      }
    }
    #vp-main-content {
      flex-grow: 1;
      margin: 0 18px;
      .bm-view {
        width: 100%;
        height: 100%;
      }
    }
    #vp-main-right {
      animation: spin 1s linear infinite;
      width: 360px;
      display: flex;
      flex-direction: column;
      .glsjbox {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          padding: 10px 8px 10px 68px;
          border: 1px solid #10a4c5;
          margin-bottom: 12px;
          border-radius: 8px;
          overflow: hidden;
          background: url("../../../assets/viewplate/mangedata_ico.png")
            no-repeat;
          div {
            float: left;
            color: @subColor;
            span {
              display: block;
              margin-top: 1px;
              i {
                display: inline-block;
                font-style: normal;
                padding: 3px;
                margin-right: 4px;
                background: #233364;
              }
            }
          }
          h5 {
            float: right;
            margin: 0;
            font-family: "dzfont";
            color: #3ff45a;
            font-size: 22px;
            position: relative;
            text-align: center;
            &::before {
              content: "\25B2";
              position: absolute;
              left: -7px;
              color: #3ff35c;
              font-family: auto;
              font-size: 12px;
              top: 4px;
            }
            span {
              font-size: 12px;
              display: block;
              color: @scolor;
            }
          }
          h5.daDown {
            color: #ff3c50;
            &::before {
              content: "\25BC";
              color: #ff3c50;
            }
          }
        }
      }
      .person-reg,
      .person-b {
        animation: spin 1s linear infinite;
        float: left;
        height: 170px;
        width: 45%;
        background-size: 100%;
        text-align: center;
        position: relative;
        line-height: 135px;
        color: #fff;
        span {
          position: absolute;
          bottom: -30px;
          display: block;
          line-height: 20px;
          left: 16%;
          color: @subColor;
        }
      }
      .person-b {
        float: right;
      }
    }
  }
}
.query-form {
  position: absolute;
  top: 20px;
  right: 80px;
  z-index: 99;
  .mapQuery-btn {
    display: inline-block;
    height: 30px;
    width: 30px;
    font-size: 23px;
    line-height: 30px;
    background: #010220;
    text-align: center;
    border: 1px solid #0d85a9;
    border-radius: 4px;
    cursor: pointer;
  }
}
.table-box {
  position: absolute;
  bottom: 0;
  left: 0;
  transition: all 0.3s;
  z-index: 99;
  background: rgba(5, 31, 58, 0.74);
  width: 100%;
  .down-btn {
    position: absolute;
    left: 50%;
    bottom: 0;
    font-size: 25px;
    z-index: 999;
  }
}
.map-center-combox {
  /deep/.cb-content {
    height: 100%;
    overflow: hidden;
    position: relative;
  }
}
/deep/ label.BMapLabel {
  a {
    display: block;
    position: absolute;
    left: -26px;
    top: 0;
    width: 20px;
    height: 28px;
    background: url("../../../assets/viewplate/map_label_ico.png") no-repeat;
  }
}
.table-box {
  /deep/.el-button-group {
    position: absolute;
    left: 40%;
    top: 10px;
    z-index: 99;
  }
}
/deep/.table-box .com-box {
  margin: 0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  i.jiao {
    display: none;
  }
  .cb-head {
    height: 35px;
    .combox-title {
      color: #00cff1;
    }
  }
  .el-table {
    background: none;
    tr {
      background: none;
      &:hover {
        td {
          background: rgba(0, 41, 58, 0.7);
        }
      }
    }
    th {
      background: none;
      border: 0;
    }
    td,
    th {
      padding: 7px 0;
      border: 0;
    }
    td {
      color: #fff;
    }
    &::before {
      background: none;
    }
    .el-table__body-wrapper {
      height: 20vh;
      overflow: hidden;
    }
  }
}
.srcoll-vp-box {
  // overflow: hidden;
  // overflow-y: auto;
  margin-bottom: 0;
}

#ssjgxm-chart {
  width: 57vw;
  height: 28vh;
}

@media screen and (max-width: 1919px) {
  .srcoll-vp-box {
    overflow: hidden;
    overflow-y: auto;
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.Rotation {
  transform: rotate(360deg);
  animation: rotation 5s linear infinite;
}

</style>
