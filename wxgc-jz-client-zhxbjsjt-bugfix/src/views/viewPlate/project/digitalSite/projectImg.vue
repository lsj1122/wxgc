<template>
  <div @mouseup="handleup" @mousemove="handlemove($event)">
    <div class="site-right">
      <!--      <i class="iconfont iconshezhi" @click="uploadDig"></i>-->
      <!-- <i class="iconfont iconshuaxin2"></i> -->
    </div>
    <div class="site-content" id="parentBox">
      <!-- 公用所有的图标 -->
      <div
        class="site-item"
        v-for="(item, ind) in controlData"
        :key="ind"
        :style="{
          left:
            (item.radius > 0 ? item.xvalue - item.radius : item.xvalue - 11) +
            'px',
          top:
            (item.radius > 0 ? item.yvalue - item.radius : item.yvalue - 11) +
            'px',
        }"
      >
        <div
          v-show="item.showStatus"
          v-if="item.type === 'towerCrane'"
          class="tjdb-item"
          :style="{
            height: item.radius + 'px',
            transform: `rotate(${item.turn}deg)`,
          }"
        ></div>

        <span
          v-show="item.showStatus"
          class="radius-box item_active"
          :class="{
            istaji: item.type === 'towerCrane',
            isCollision: item.showAlarm,
          }"
          :style="{
            backgroundColor: item.towerCraneBGC ? item.towerCraneBGC : '',
            width: item.radius * 2 + 'px',
            height: item.radius * 2 + 'px',
          }"
        >
          <i
            :class="[
              item.ico,
              tempArr.includes(item.deviceNumber) ? 'aniwarning' : '',
            ]"
            class="iconfont imgZIndex"
            @contextmenu.prevent="showDetail(item)"
            @click="showCharts(item)"
            :style="{ color: item.color, borderColor: item.color }"
          >
            <a class="device-tips">{{ item.name }}</a>
          </i>
        </span>
      </div>

      <!-- 公用点击右键 -->
      <div
        class="control-dig"
        v-show="showDetailDig"
        :style="{
          top: currentItem.yvalue + 'px',
          left: currentItem.xvalue + 'px',
        }"
      >
        <div class="control-dig-body">
          <i class="dig-del-btn el-icon-delete" @click="delitem"></i>
          <ul>
            <li>
              <span>设备名称：</span>
              <el-input
                size="small"
                placeholder="请输入设备名称"
                style="width: 200px"
                v-model="currentItem.name"
              ></el-input>
            </li>
            <li v-if="currentItem.type === 'towerCrane'">
              <span>辐射半径：</span>
              <el-slider
                v-model="currentItem.radius"
                :min="20"
                :step="10"
                :max="200"
              ></el-slider>
              <a>{{ currentItem.radius }}</a>
            </li>
            <!-- <li v-if="currentItem.type === 'ycjc'" class="msginfo-jj">
              <span
                >pm2.5(ug/m³)：<i>{{ ycjcData.pm2Value || 0 }}</i></span
              >
              <span
                >pm10(ug/m³)：<i>{{ ycjcData.pm10Value || 0 }}</i></span
              >
              <span
                >噪音(db)：<i>{{ ycjcData.noise || 0 }}</i></span
              ><br />
              <span class="none-ml"
                >温度(℃)：<i>{{ ycjcData.temp || 0 }}</i></span
              >
              <span
                >湿度(%)：<i>{{ ycjcData.humidity || 0 }}</i></span
              >
              <span
                >风向：<i>{{ ycjcData.direction || 0 }}</i></span
              ><br />
              <span class="none-ml"
                >风速(里/s)：<i>{{ ycjcData.speed || 0 }}</i></span
              >
            </li>
            <li v-if="currentItem.type === 'eleMeter'" class="msginfo-jj">
              <span>用电量(kWh)：<i>
                </i></span>
            </li>
            <li v-if="currentItem.type === 'waterMeter'" class="msginfo-jj">
              <span>用水量(㎡)：<i>452</i></span>
            </li> -->
          </ul>
        </div>
        <div class="control-dig-btn">
          <el-button size="mini" type="primary" @click="editSubmit"
            >确定</el-button
          >
          <el-button
            size="mini"
            type="info"
            plain
            style="float: right"
            @click="cancelEdit"
            >取消</el-button
          >
        </div>
      </div>

      <!--公用左键（水表 电表 扬尘检测,用电监测）  -->
      <div
        class="control-dig"
        v-show="showDetailDigLeft"
        :style="{
          top: currentItem.yvalue + 'px',
          left: currentItem.xvalue + 'px',
        }"
      >
        <div class="control-dig-body">
          <!-- <i class="dig-del-btn el-icon-delete" @click="delitem"></i> -->
          <div class="newAddTitle">
            <div class="d1" v-if="currentItem.type === 'waterMeter'">
              <span>智能水表</span>
              <span>在线</span>
            </div>
            <div class="d1" v-if="currentItem.type === 'eleMeter'">
              <span>智能电表</span>
              <span>在线</span>
            </div>
            <div class="d1" v-if="currentItem.type === 'raiseDust'">
              <span>扬尘检测</span>
              <span>在线</span>
              <span>{{ currentItem.createTime }}</span>
            </div>
            <div class="d1" v-if="currentItem.type === 'ydjc'">
              <span>用电监测</span>
              <span>在线</span>
            </div>
          </div>
          <div class="newAddImg">
            <img
              src="../../../../assets/n1.jpg"
              alt=""
              v-if="currentItem.type === 'waterMeter'"
            />
            <img
              src="../../../../assets/n2.jpg"
              alt=""
              v-if="currentItem.type === 'eleMeter'"
            />
            <img
              src="../../../../assets/n3.jpg"
              alt=""
              v-if="currentItem.type === 'raiseDust'"
            />
            <img
              src="../../../../assets/n4.png"
              alt=""
              v-if="currentItem.type === 'ydjc'"
            />
          </div>

          <ul>
            <li
              v-if="currentItem.type === 'waterMeter'"
              class="msginfo-jj msginfo-jj2"
            >
              <span
                >用水量：<i>{{ sdbData }} ㎡</i></span
              >
            </li>
            <li
              v-if="currentItem.type === 'eleMeter'"
              class="msginfo-jj msginfo-jj2"
            >
              <span
                >用电量：<i>{{ sdbData }} kWh</i></span
              >
            </li>

            <li
              v-if="currentItem.type === 'raiseDust'"
              class="msginfo-jj msginfo-jj2"
            >
              <span
                >pm2.5：<i>{{ ycjcData.pm2Value || 0 }} ug/m³</i></span
              >
              <span
                >pm10：<i>{{ ycjcData.pm10Value || 0 }} ug/m³</i></span
              >
              <span
                >噪音：<i>{{ ycjcData.noise || 0 }} db</i></span
              >
              <span class="none-ml"
                >温度：<i>{{ ycjcData.temp || 0 }} ℃</i></span
              >
              <span
                >湿度：<i>{{ ycjcData.humidity || 0 }} %</i></span
              >
              <span
                >风向：<i>{{ ycjcData.direction || 0 }}</i></span
              >
              <span class="none-ml"
                >风速：<i>{{ ycjcData.speed || 0 }} m/s</i></span
              >
            </li>
            <li
              v-if="currentItem.type === 'ydjc'"
              class="msginfo-jj msginfo-jj2"
            >
              <span
                >电压A：<i>{{
                  ydjcData.voltA ? ydjcData.voltA : "--"
                }}</i></span
              >
              <span
                >电压B：<i>{{
                  ydjcData.voltB ? ydjcData.voltB : "--"
                }}</i></span
              >
              <span
                >电压C：<i>{{
                  ydjcData.voltC ? ydjcData.voltC : "--"
                }}</i></span
              >

              <span
                >频率A：<i>{{
                  ydjcData.rateA ? ydjcData.rateA : "--"
                }}</i></span
              >
              <span
                >频率B：<i>{{
                  ydjcData.rateB ? ydjcData.rateB : "--"
                }}</i></span
              >
              <span
                >频率C：<i>{{
                  ydjcData.rateC ? ydjcData.rateC : "--"
                }}</i></span
              >

              <span
                >温度A：<i>{{
                  ydjcData.tempA ? ydjcData.tempA : "--"
                }}</i></span
              >
              <span
                >温度B：<i>{{
                  ydjcData.tempB ? ydjcData.tempB : "--"
                }}</i></span
              >
              <span
                >温度C：<i>{{
                  ydjcData.tempC ? ydjcData.tempC : "--"
                }}</i></span
              >
            </li>
          </ul>
        </div>
        <div class="control-dig-btn">
          <!-- <el-button size="mini" type="primary" @click="editSubmit"
            >确定</el-button
          > -->
          <el-button
            size="mini"
            type="info"
            plain
            style="float: right"
            @click="cancelEdit"
            >取消</el-button
          >
        </div>
      </div>
      <!--  -->

      <!-- 公用删除键 -->
      <div
        class="control-dig-del"
        v-show="showDelDig"
        :style="{
          top: currentItem.yvalue + 'px',
          left: currentItem.xvalue + 'px',
        }"
      >
        <div class="control-dig-body">
          <span>确定删除该设备？</span>
        </div>
        <div class="control-dig-btn">
          <el-button size="mini" type="primary" @click="delSubmit"
            >确定</el-button
          >
          <el-button
            size="mini"
            type="info"
            plain
            style="float: right"
            @click="showDelDig = false"
            >取消</el-button
          >
        </div>
      </div>

      <div class="controlPanel">
        <div>
          <img
            src="../../../../assets/viewplate/screen.png"
            alt
            @click="showControl"
          />
        </div>
        <div class="control-list" v-show="IsshowControl">
          <h3>设备管理</h3>
          <ul>
            <li v-for="(item, inde) in controlList" :key="inde">
              <el-checkbox
                v-model="item.checked"
                @change="itemCheckChange(item)"
              >
                <i
                  @mousedown="downItem($event, item)"
                  :id="inde"
                  class="downTarget iconfont"
                  :class="item.ico"
                  :style="{ color: item.color }"
                  style="margin-right: 8px"
                ></i>
                {{ item.title }}
              </el-checkbox>
            </li>
          </ul>
        </div>
      </div>

      <i
        id="movitem"
        class="iconfont"
        v-show="ismove"
        :class="moveItem.ico"
        :style="{
          top: moveItem.yvalue - 11 + 'px',
          left: moveItem.xvalue - 11 + 'px',
          color: moveItem.color,
          borderColor: moveItem.color,
        }"
      ></i>

      <!-- <div class="xgtbox" :style="{ backgroundImage: 'url(' + imgUrl + ')' }">
        <img :src="imgUrl" alt />
      </div> -->
      <div class="xgtbox">
        <img class="xgtbox" :src="imgUrl" alt />
      </div>
    </div>
    <!-- 钢丝绳实时预警 -->
    <div class="gssjc" v-if="gsstable && gsstable.length != 0">
      <div
        style="
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-bottom: 1px solid #999999;
        "
      >
        <span>实时预警</span>
      </div>
      <div style="height: calc(100% - 30px)">
        <el-table
          :data="gsstable"
          style="width: 100%"
          @row-click="rowClick"
          height="100%"
        >
          <el-table-column
            prop="sensorName"
            align="center"
            label="设备名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="alarmStatus" label="状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.alarmStatus == 1 ? "异常" : "正常" }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <uploadBgDl :dialogVsb.sync="DialogVisible" @handle-getbg="getBG" />
    <tajiDialog :tj_visib.sync="showChart" :deviceObj="currentItem" />
    <carDialog :dialogVisible.sync="carDialogVisi" :deviceObj="currentItem" />
    <sjjDialog :tdDialogvisib.sync="TDvisible" :deviceItem="currentItem" />
    <spjkDialog :spjkVisible.sync="showspjkDialog" :deviceItem="currentItem" />
    <zjDialog :zjVisible.sync="showzjDialog" :deviceObj="currentItem" />
    <dbTable :dbTableShow.sync="dbTableShow" :deviceItem="currentItem" />
    <gssShowDialog :gssShow.sync="gssShow" :deviceObj="currentItem" />
    <spray-dialog :sprayVisible.sync="sprayVisible" :deviceObj="currentItem" />
    <edge-dialog :edgeVisible.sync="edgeVisible" :deviceObj="currentItem" />
    <xlptDialog :xlptvisib.sync="showxlptDialog" :deviceObj="currentItem" />
    <zndb-dialog :zndbVisible.sync="zndbVisible" :deviceObj="currentItem" />
    <znsb-dialog :znsbVisible.sync="znsbVisible" :deviceObj="currentItem" />
    <face-dialog :faceVisible.sync="faceVisible" :deviceObj="currentItem" />

    <!-- 水质监测  -->
    <waterMonitoring
      :waterMonitoringVisible.sync="waterMonitoringVisible"
      :deviceObj="currentItem"
    />

    <selectDevice
      :selectDevVisible.sync="showSelectDialog"
      @selsubmit="seleDeviSubmit"
      :siteData="controlData"
      :type="moveItem.type"
      @cancelSelct="cancelSelDevi"
    />
    <!--  -->
  </div>
</template>

<script>
var $ = require("jquery");
import selectDevice from "./selectDevice";
import spjkDialog from "./spjkDialog";
import uploadBgDl from "./uploadBgDialog";
import tajiDialog from "./tajiDialog";
import xlptDialog from "./xlptDialog";
import carDialog from "./carDialog";
import sjjDialog from "./sjjDialog";
import zjDialog from "./zjDialog";
import dbTable from "./dbTable";
import gssShowDialog from "./gssShowDialog";
import EdgeDialog from "./edgeDialog.vue";
import SprayDialog from "./sprayDialog.vue";
import ZndbDialog from "./zndbDialog.vue";
import ZnsbDialog from "./znsbDialog.vue";
import FaceDialog from "./faceDialog.vue";
import waterMonitoring from "./waterMonitoring.vue";
import {
  selectAllTtBuildSiteByPro,
  updateTtBuildSite,
} from "@/views/viewPlate/project/digitalSite/api/ttbuildsite";
import { selectType } from "@/views/sysproject/api/ttuploadfile";
import {
  getPageTtUnload,
  getFourHour,
} from "@/views/viewPlate/project/digitalSite/api/unload";
import {
  addTtDigitLocation,
  deleteTtDigitLocation,
  selectAllTtDigitLocationByPro,
  updateTtDigitLocation,
  getNewTjData,
  sensorRealTimeData,
  selectListByParam,
  realTimeOne,
} from "@/views/viewPlate/project/digitalSite/api/ttdigitlocation";
import {
  selectNow,
  selectYDJC,
  getByMachineNumber,
} from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata";

export default {
  name: "digitalSite",
  data() {
    return {
      dbTableShow: false,
      gssShow: false,
      linkShow: false, //当时false 的时候 是修改后的样式，ture,让它显示之前的样式
      projectId: this.$store.getters.projectId,
      ycjcData: {
        pm2Value: "",
        pm10Value: "",
        noise: "",
        temp: "",
        humidity: "",
        direction: "",
        speed: "",
      },
      fourData: [],
      ydjcData: {},
      tjNewData: [],
      showSelectDialog: false,
      showspjkDialog: false,
      showzjDialog: false,
      showxlptDialog: false,
      TDvisible: false,
      carDialogVisi: false,
      showChart: false,
      DialogVisible: false,
      mouseUP: true,
      oldRadius: 0,
      padding: 25,
      imgUrl: "",
      fileData: null,
      unloadList: [],
      currentItem: {},
      showDetailDig: false,
      showDetailDigLeft: false,
      showDelDig: false,
      value2: 45,
      timer: null,
      IsshowControl: false,
      sdbData: "",
      edgeVisible: false,
      sprayVisible: false,
      zndbVisible: false,
      znsbVisible: false,
      faceVisible: false,
      waterMonitoringVisible: false,
      controlList: [
        {
          title: "塔机",
          ico: "icontadiao1",
          checked: true,
          radius: 50,
          color: "#2777ff",
          type: "towerCrane",
        },
        {
          title: "施工升降机",
          ico: "iconshigongshengjiangji",
          checked: true,
          color: "red",
          type: "constructElevator",
        },
        {
          title: "标养室监测",
          ico: "iconcheliangchurukou",
          checked: true,
          color: "#c04a0b",
          type: "cementCuring",
        },
        {
          title: "扬尘监测",
          ico: "iconpmzhi",
          checked: true,
          color: "#359658",
          type: "raiseDust",
        },
        {
          title: "智能电表",
          ico: "icondianbiao",
          checked: true,
          color: "#e5fe58",
          type: "eleMeter",
        },
        {
          title: "智能水表",
          ico: "iconshuibiao",
          checked: true,
          color: "#57e4ff",
          type: "waterMeter",
        },
        {
          title: "视频监控",
          ico: "iconjiankong1",
          checked: true,
          color: "#a53bfd",
          type: "video",
        },
        {
          title: "人数识别",
          ico: "iconzhaji",
          checked: true,
          color: "#899395",
          type: "peopleNumber",
        },
        {
          title: "人脸识别",
          ico: "iconrenshu",
          checked: true,
          color: "#15b5e2",
          type: "faceRecognition",
        },
        {
          title: "卸料平台",
          ico: "iconxieliaopingtai",
          checked: true,
          color: "#57e4ff",
          type: "unloadPlatform",
        },
        // {
        //   title: "用电监测",
        //   ico: "iconyongdian",
        //   checked: true,
        //   color: "#FF9B31",
        //   type: "ydjc",
        // },
        {
          title: "水质监测",
          ico: "icongongshuiguanwangshuizhijiance",
          checked: true,
          color: "#13A8A8",
          type: "waterQualityMonitor",
        },
        {
          title: "喷淋控制器 ",
          ico: "iconpenlin",
          checked: true,
          color: "#FF9B31",
          type: "sprayThrower",
        },
        {
          title: "临边防护",
          ico: "iconlinbianfanghujiance",
          checked: true,
          color: "#2D26EF",
          type: "edgeProtect",
        },
      ],
      ismove: false,
      id: null,
      moveItem: {
        type: "",
        name: "",
        xvalue: 0,
        yvalue: 0,
        ico: "",
        radius: 0,
        color: "",
        deviceNumber: "",
        showStatus: true,
      },
      parentOffset: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
      controlData: [],
      sensorData: [], //钢丝绳echarts数据
      gsstable: [],
      tempArr: [], //临时存储有异常的id
    };
  },
  components: {
    uploadBgDl,
    tajiDialog,
    carDialog,
    spjkDialog,
    zjDialog,
    xlptDialog,
    selectDevice,
    sjjDialog,
    dbTable,
    gssShowDialog,
    EdgeDialog,
    SprayDialog,
    ZndbDialog,
    ZnsbDialog,
    FaceDialog,
    waterMonitoring,
  },
  created() {
    this.getBG();
    // // 判断是不是  合肥市科技馆新馆（自然博物馆） 项目
    // console.log(1001,this.$store.state.user.name)
    //   if(this.$store.state.user.name =="hfkjg"  ||
    //    this.$store.state.project.projectName == '合肥市科技馆新馆（自然博物馆）'){
    //      this.linkShow =true
    //    }else{
    //       this.linkShow =false
    //    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    this.selectData();
    this.calculateOfffset();
  },
  methods: {
    getFourHour() {
      getFourHour().then((res) => {
        this.fourData = res;
      });
    },
    getBG() {
      selectType(12).then((res) => {
        console.log("背景图", res);
        if (res.data.length != 0) {
          this.imgUrl = res.data[0].pictureFilePath;
        }
      });
    },
    //图标的列表
    getitem() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      selectAllTtDigitLocationByPro().then((res) => {
        if (res.code == "success") {
          this.ismove = false;
          res.data.forEach((item) => {
            item.showStatus = item.showStatus === "true" ? true : false;
            item.radius = Number(item.radius);
            item.xvalue = this.parentOffset.w * item.xvalue;
            item.yvalue = this.parentOffset.h * item.yvalue;
          });
          let data = res.data;
          console.log("730", data);
          //
          // this.getTjInfo(data);
          // this.timer = setInterval(() => {
          //   this.getTjInfo(data);
          // }, 42000);
          this.realTimeOne(data);
          // this.timer = setInterval(() => {
          //   this.realTimeOne(data);
          // }, 2000);
          this.controlData = data; // 赋值

          this.controlList.forEach((item) => {
            // 根据左边的状态 栏 ，修改右边数据的展示状态
            this.rightShow(item);
          });
          this.collisionDelection(this.controlData);
          // this.selectListByParam();
        }
      });
    },
    getTjInfo(data) {
      getNewTjData().then((res) => {
        if (res.code === "success") {
          res.data.forEach((item) => {
            data.forEach((value) => {
              if (item.tjNum === value.deviceNumber) {
                if (item.alarmReason) {
                  value.showAlarm =
                    item.alarmReason.indexOf("碰撞") !== -1 ? true : false;
                }
                value.turn = item.turn;
              }
            });
          });
          console.log("this.controlData", this.controlData);
          this.controlData = data;
        }
      });
    },
    collisionDelection(arr) {
      //判断塔机覆盖是否重叠
      arr.forEach((item) => {
        if (item.radius > 0) {
          arr.forEach((item_two) => {
            if (item_two.radius > 0 && item_two.id !== item.id) {
              // 减用来检测两个圆心距
              let leftC = item_two.xvalue - item.xvalue;
              let topC = item_two.yvalue - item.yvalue;
              // pow() 方法可返回 x 的 y 次幂的值。
              // sqrt() 方法可返回一个数的平方根。
              // 水平方向圆心距的2次幂 +  垂直方向的圆心距2次幂，的平方根（勾股定理？）
              let dis = Math.sqrt(Math.pow(leftC, 2) + Math.pow(topC, 2));

              if (dis < item.radius + item_two.radius) {
                // 求出来的值小于检测的两个圆的半径的和则发生碰撞报警
                item.collision = item_two.collision = true;
              }
            }
          });
        }
      });
      setTimeout(function () {
        $(".istaji").parent().css("z-index", "90");
      }, 1000);
    },
    showCharts(item) {
      //左键点击项目图中的设备回调
      this.currentItem = item;
      console.log(594, item);
      // 清空
      this.showDetailDigLeft = false;
      switch (item.type) {
        case "towerCrane":
          this.tajiClick();
          break;
        case "constructElevator":
          this.sjjClick();
          break;
        case "cementCuring":
          this.clcrkClick();
          break;
        case "raiseDust":
          this.ycjcClick();
          break;
        case "eleMeter":
          this.zndbClick();
          break;
        case "waterMeter":
          this.znsbClick();
          break;
        case "video":
          this.videoClick();
          break;
        case "unloadPlatform":
          this.xlptClick(item.deviceNumber);
          break;
        case "peopleNumber":
          this.zjClick();
          break;
        case "faceRecognition":
          this.faceClick();
          break;
        // case "ydjc":
        //   this.ydjcClick();
        //   break;
        case "waterQualityMonitor":
          this.waterMonitoringClick();
          break;
        case "sprayThrower":
          this.sprayClick();
          break;
        case "edgeProtect":
          this.edgeClick();
          break;
        // case "db":
        //   this.dbClick();
        //   break;
        // case "sensor":
        //   this.gssClick(item.deviceNumber);
        //   break;
      }
    },
    tajiClick() {
      this.showChart = true;
    },
    sjjClick() {
      this.TDvisible = true;
    },
    clcrkClick() {
      this.carDialogVisi = true;
    },
    //鼠标左键 （扬尘检测）
    ycjcClick() {
      this.gssShow = true;
    },
    //鼠标左键 （电表）
    zndbClick() {
      // this.getByMachineNumber(deviceNumber);
      this.zndbVisible = true;
    },
    //鼠标左键 （水表）
    znsbClick() {
      // this.getByMachineNumber(deviceNumber);
      this.znsbVisible = true;
    },
    videoClick() {
      this.showspjkDialog = true;
    },
    zjClick() {
      this.showzjDialog = true;
    },
    dbClick() {
      this.dbTableShow = true;
    },
    gssClick(deviceNumber) {
      this.gssShow = true;
      // this.sensorRealTimeData(deviceNumber);
    },
    // 人脸弹框
    faceClick() {
      this.faceVisible = true;
    },
    waterMonitoringClick() {
      this.waterMonitoringVisible = true;
    },
    // 喷淋控制器
    sprayClick() {
      this.sprayVisible = true;
    },
    // 临边防护
    edgeClick() {
      this.edgeVisible = true;
    },
    xlptClick(deviceNumber) {
      this.showxlptDialog = true;
      // this.getPageTtUnload(deviceNumber);
      // this.getFourHour();
    },
    ydjcClick() {
      this.showDetailDigLeft = true;
      this.getYDJCinfo();
    },
    // 点击表格事件
    rowClick(row) {
      this.gssClick(row.sensorId);
    },
    uploadDig() {
      this.DialogVisible = true;
    },
    cancelEdit() {
      this.currentItem.radius = this.oldRadius;
      this.showDetailDig = false;
      this.showDetailDigLeft = false; //控制左键1
    },
    sensorRealTimeData(deviceNumber) {
      sensorRealTimeData({ sensorId: deviceNumber }).then((res) => {
        this.sensorData = res.data;
        this.$nextTick(() => {
          this.$refs.gssShowDialog.loadChart();
        });
      });
    },
    calculateOfffset() {
      let combox = document.querySelector("#comboxoff");
      let parentbox = document.querySelector("#parentBox");

      //求取元素与屏幕距离
      this.parentOffset.y = parentbox.offsetTop + combox.offsetTop;
      this.parentOffset.x = combox.offsetLeft;
      //求取容器宽 高
      this.parentOffset.w = parentbox.offsetWidth;
      this.parentOffset.h = parentbox.offsetHeight;
    },
    showControl() {
      //切换显示左侧设备列表框
      this.IsshowControl = this.IsshowControl ? false : true;
    },
    editSubmit() {
      //编辑设备信息提交
      let obj = JSON.parse(JSON.stringify(this.currentItem));
      obj.xvalue = obj.xvalue / this.parentOffset.w;
      obj.yvalue = obj.yvalue / this.parentOffset.h;
      updateTtDigitLocation(obj).then((res) => {
        if (res.code == "success") {
          this.showDetailDig = false;
          this.$message({
            type: "success",
            message: "更新成功!",
            duration: 2000,
            onClose: () => {},
          });
          this.getitem();
        }
      });
    },
    delSubmit() {
      //删除设备信息提交
      deleteTtDigitLocation(this.currentItem.id).then((res) => {
        if (res.code == "success") {
          this.$message.success("删除成功!");
          this.showDelDig = false;
          this.showDetailDig = false;
          this.getitem();
        }
      });
    },
    showDetail(item) {
      //弹出设备详情框
      console.log("item", item);
      this.oldRadius = item.radius;
      this.currentItem = item;
      this.showDetailDig = true;

      // if (item.type === "raiseDust") {
      //   this.getYCJCdet();
      // }
    },
    getYCJCdet() {
      selectNow().then((res) => {
        if (res.code == "success") {
          this.ycjcData = Object.assign(this.ycjcData, res.data);
        }
      });
    },
    getByMachineNumber(deviceNumber) {
      getByMachineNumber(deviceNumber).then((res) => {
        if (res.code == "success") {
          this.sdbData = res.data;
        }
      });
    },
    // 用电监测接口
    getYDJCinfo() {
      console.log(737, this.currentItem.deviceNumber);

      selectYDJC({ machineNumber: this.currentItem.deviceNumber }).then(
        (res) => {
          console.log(741, res);
          if (res.code == "success") {
            this.ydjcData = res.data;
          }
        }
      );
    },
    // 用电监测接口
    getPageTtUnload(deviceNumber) {
      getPageTtUnload({
        pageIndex: 0,
        pageSize: 10,
        deviceNo: deviceNumber,
      }).then((res) => {
        console.log(res);
        if (res.code == "success") {
          this.unloadList = res.data.records;
        }
      });
    },
    downItem(e, item) {
      //鼠标点击设备元素（左按下）触发
      //设备信息赋值给移动元素
      this.moveItem.name = "XXX" + item.title;
      this.moveItem.color = item.color;
      this.moveItem.ico = item.ico;
      this.moveItem.type = item.type;
      this.moveItem.radius = item.radius || 0;
      this.ismove = true;
      this.mouseUP = false;
    },
    handlemove(e) {
      //鼠标移动中持续触发
      if (!this.mouseUP) {
        //移动元素跟随鼠标指针移动
        let xalias = e.clientX - this.parentOffset.x;
        let yalias = e.clientY - this.parentOffset.y;
        this.moveItem.xvalue = this.setPosi(xalias, "x");
        this.moveItem.yvalue = this.setPosi(yalias, "y");
      }
    },
    setPosi(val, flag) {
      let n;
      if (flag === "x") {
        n =
          val < this.padding
            ? this.padding
            : val > this.parentOffset.w - this.padding
            ? this.parentOffset.w - this.padding
            : val;
      }
      if (flag === "y") {
        n =
          val < this.padding
            ? this.padding
            : val > this.parentOffset.h - this.padding
            ? this.parentOffset.h - this.padding
            : val;
      }
      return n;
    },
    handleup() {
      // 放开鼠标左键后触发
      this.mouseUP = true;
      if (this.ismove) {
        this.showSelectDialog = true;
      }
    },
    seleDeviSubmit(deviceObj) {
      //复制设备信息对象push到设备数据数组中，页面更新渲染
      let obj = JSON.parse(JSON.stringify(this.moveItem));
      this.moveItem.ico = "el-icon-loading";
      obj.xvalue = obj.xvalue / this.parentOffset.w;
      obj.yvalue = obj.yvalue / this.parentOffset.h;
      obj.deviceNumber = deviceObj.deviceNo;
      obj.name = deviceObj.deviceName;
      obj.machineId = deviceObj.machineId;
      obj.createPerson = this.$store.getters.name;
      console.log(obj);

      addTtDigitLocation(obj)
        .then((res) => {
          if (res.code == "success") {
            this.$message.success("添加成功!");
            this.showSelectDialog = false;
            this.getitem();
          } else {
            this.$message.error("添加失败!");
            this.ismove = false;
          }
        })
        .catch(() => {
          this.ismove = false;
        });
    },
    cancelSelDevi() {
      this.ismove = false;
    },
    delitem() {
      //弹出删除设备框
      this.showDelDig = true;
    },
    itemCheckChange(item) {
      let type = item.type;
      let checked = item.checked == true ? 0 : 1;
      let jsonStr =
        this.id != null
          ? {
              id: this.id,
              [type]: checked,
            }
          : {
              projectId: this.$store.getters.projectId,
              [type]: checked,
            };
      console.log(808, jsonStr);
      // 修改状态值
      this.addOrUpdate(jsonStr);
      //左侧设备列表选中回调
      this.rightShow(item);
      console.log(800, item);
    },
    rightShow(item) {
      // console.log(item)
      this.controlData.forEach((n) => {
        if (n.type === item.type) {
          n.showStatus = item.checked;
        }
      });
    },
    addOrUpdate(jsonStr) {
      // 点击后右侧 显示数据
      updateTtBuildSite(jsonStr).then((res) => {
        // console.log(844,res)
        this.selectData();
      });
    },
    selectData() {
      selectAllTtBuildSiteByPro().then((res) => {
        if (res.data.length != 0) {
          this.id = res.data[0].id;

          // 查询当前设备哪些是显示，哪些是隐藏
          this.controlList.forEach((item) => {
            // console.log(res.data[0][item.type]);
            item.checked = res.data[0][item.type] == 0 ? true : false;
            console.log(item.checked);
          });

          this.getitem();
        }
      });
    },
    // 查询预警的钢丝绳
    selectListByParam() {
      selectListByParam({ alarmStatus: 1 }).then((res) => {
        this.gsstable = res.data;
        this.tempArr = [];
        this.gsstable.forEach((item) => {
          this.tempArr.push(item.sensorId);
        });
      });
    },
    //
    realTimeOne(data) {
      let _this = this

      let list = [];
      data.forEach((item) => {
        if (item.type == "towerCrane") {
          list.push(item.deviceNumber);
        }
      });
      
      if (list.length > 0) {
        realTimeOne({ hostNumbers: list }).then((res) => {
          if (res.code == "success") {
            data.forEach((item, index) => {
              res.data.forEach((item2, index2) => {
                if (item2) {
                  if (item2.hostNumber == item.deviceNumber) {
                    item.turn = item2.rotationValue;
                    _this.$set(this.controlData, index, {
                      ...item,
                      turn: item2.rotationValue,
                    });
                    if (item2.alarmStatus == 0) {
                      _this.$set(this.controlData, index, {
                        ...item,
                        towerCraneBGC: "rgba(245, 107, 1, 0.27)",
                      });
                    } else if (item2.alarmStatus == 1) {
                      _this.$set(this.controlData, index, {
                        ...item,
                        towerCraneBGC: "rgba(245, 1, 1, 0.50)",
                      });
                    } else {
                      _this.$set(this.controlData, index, {
                        ...item,
                        towerCraneBGC: "",
                      });
                    }
                  }
                }
              });
            });
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes shadowAnim {
  0% {
    box-shadow: 0 0 rgb(255, 45, 45);
  }
  25% {
    box-shadow: 0 0 10px 1px rgb(255, 45, 45);
  }
  50% {
    box-shadow: 0 0 20px 3px rgb(255, 45, 45);
  }
  75% {
    box-shadow: 0 0 30px 5px rgb(255, 45, 45);
  }
  100% {
    box-shadow: 0 0 40px 7px rgb(255, 17, 17);
  }
}
.control-dig {
  max-height: 250px;
  overflow: auto;
}
.control-dig,
.control-dig-del {
  position: absolute;
  z-index: 999;
  background: rgba(0, 15, 45, 0.78);
  padding: 15px;
  border: 1px solid #04b6bf;
  border-radius: 8px;
  .control-dig-body {
    margin-bottom: 15px;
    //
    .newAddTitle {
      .d1 {
        width: 100%;
        // padding: 10px 0px;
        margin-top: -10px;
        padding-bottom: 15px;
        border-bottom: 1px solid #747070;
        span:nth-child(2) {
          float: right;
          background-color: #f66f00;
          padding: 3px;
          border-radius: 3px;
          margin-top: -3px;
        }
        span:nth-child(3) {
          float: right;
          padding: 3px;
          padding-right: 5px;
          border-radius: 3px;
          margin-top: -3px;
        }
      }
    }
    .newAddImg {
      width: 100%;
      margin-top: 10px;
      text-align: center;
      img {
        width: 270px;
        height: 100px;
      }
    }
    i.dig-del-btn {
      position: absolute;
      right: 15px;
      top: 10px;
      cursor: pointer;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        .el-slider {
          display: inline-block;
          width: 200px;
          margin: 0 15px 0 0;
          position: relative;
          top: 14px;
        }
        .el-slider__runway {
          margin: 8px 0;
        }
      }
    }
  }
  .control-dig-btn {
  }
}
.control-dig {
  padding-top: 30px;
}
.controlPanel {
  position: absolute;
  left: 30px;
  top: 100px;
  z-index: 999;
  display: flex;
  flex-direction: row;
  .el-button {
    padding: 6px 10px;
    background: #0c122a;
    border: 1px solid #4aa4be;
    color: #4aa4be;
    float: left;
  }
  .control-list {
    float: left;
    padding: 10px;
    margin-left: 8px;
    background: #0c122aa8;
    border: 1px solid #4aa4be;
    border-radius: 8px;
    h3 {
      margin: 0;
      font-size: 14px;
      color: #00c2d6;
      font-weight: 400;
    }
    ul {
      margin: 0;
      padding: 10px 0 0 3px;
      li {
        margin-bottom: 10px;
        list-style: none;
      }
    }
  }
}
.site-right {
  i {
    display: inline-block;
    font-size: 17px;
    margin-left: 10px;
    color: @fcolor;
  }
}
.digital-site {
  height: 100%;
}
.site-content {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 45px;
  i#movitem {
    position: absolute;
    z-index: 9;
    -webkit-animation: none;
    animation: none;
    border: 2px solid;
    background: #fff;
    padding: 3px;
    border-radius: 50%;
    &::after {
      content: "\25BC";
      font-size: 16px;
      position: absolute;
      left: 2px;
      bottom: -20px;
    }
  }
  .xgtbox {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-origin: content-box;
    background-size: 75% 100%; /*按比例缩放*/

    // background-repeat:no-repeat;
    // background-attachment:fixed;
    // background-position:center;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 75%;
      height: 100%;
    }
  }
  .xgtbox2 {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-origin: content-box;
    background-size: 100% 100%; /*按比例缩放*/

    // background-repeat:no-repeat;
    // background-attachment:fixed;
    // background-position:center;
    img {
      // width: 100%;
      // max-height: 100%;
    }
  }
}
.el-icon-suitcase-1 {
  color: rgb(223, 67, 67);
}
.site-item {
  position: absolute;
  z-index: 98;

  div.tjdb-item {
    position: absolute;
    width: 4px;
    background: rgba(255, 126, 64, 0.74);
    z-index: 9;
    left: 50%;
    transform-origin: center bottom;
    margin-left: -2px;
    transition: all 1.5s linear;
  }
  &:hover {
    div.tjdb-item {
      background: rgb(255, 126, 64);
    }
  }
  span {
    display: block;
    border-radius: 50%;
    text-align: center;
    min-width: 30px;
    position: relative;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      border: 3px solid;
      background: #fff;
      padding: 3px;
      border-radius: 50%;
      position: relative;
      z-index: 91;
      &:hover {
        a.device-tips {
          display: block;
        }
      }
      a.device-tips {
        position: absolute;
        top: -28px;
        left: -140%;
        display: none;
        font-size: 12px;
        color: #d1f4ff;
        background: rgba(0, 75, 119, 0.57);
        border-radius: 3px;
        min-width: 86px;
        padding: 3px 0;
      }
      &::after {
        content: "\25BC";
        position: absolute;
        left: 3px;
        bottom: -20px;
      }
    }
  }
  span.isCollision {
    i {
      animation: shadowAnim 1s infinite;
      animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    }
  }
  span.istaji {
    background: rgba(1, 178, 245, 0.17);
    // background: rgba(245, 1, 1, 0.50);
    border: 1px dashed #008de0;
  }
}

.site-right {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #0183bc;
}
.msginfo-jj {
  padding: 15px 0 0 0;
  span {
    padding: 0 5px 0 15px;
    color: rgba(255, 255, 255, 0.6);
    i {
      color: @scolor;
    }
  }
  span.none-ml {
    padding-left: 0;
  }
  span:first-child {
    padding-left: 0;
  }
}
.msginfo-jj2 {
  span {
    display: block;
    padding: 0;
    i {
      float: right;
    }
  }
}
.gssjc {
  width: 200px;
  position: absolute;
  right: 20px;
  top: 20px;
  height: 200px;
  background-color: #60688980;
  border-radius: 5px;
  .el-divider--horizontal {
    margin: 15px 0;
  }
}
.aniwarning {
  animation: warning 2s linear infinite;
}
@keyframes warning {
  0% {
    box-shadow: 0 0 0px red;
  }
  50% {
    box-shadow: 0 0 30px red;
  }
  100% {
    box-shadow: 0 0 0px red;
  }
}
</style>
