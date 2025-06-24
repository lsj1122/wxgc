<template>
  <div class="boot">
    <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>
<!-- 安徽隐患详情弹窗 -->
  <el-dialog
      :modal-append-to-body="false"
      class="el-dialog-xiangxi"
      :visible.sync="seftvisible"
      title="安全问题统计详情"
      center
      @close="closeDialog"
      width="55%"
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
          
              <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="temp.problemArea"  disabled='true'/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="temp.problemType"  disabled='true'/>
              </el-form-item>
              
              <el-form-item label="影响级别" prop="influenceLevel">
               
                <el-select
                  v-model="temp.influenceLevel"
                
                  disabled='true'
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  v-model="temp.problemDescribe"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe" >
                 <el-image
                  v-if="temp.filePath1"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath1"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

              <!-- <el-form-item label="分包单位" prop="subcontractors">
                <el-input
                  v-model="temp.subcontractors"
                  placeholder="分包单位"
                />
              </el-form-item> -->
              <el-form-item label="整改人" prop="rectificationPerson" >
                <el-input
                  v-model="temp.rectificationPerson"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="temp.rectificationMeasures"
                  
                  disabled='true'
                />
              </el-form-item>

               <el-form-item label="整改图片" prop="problemDescribe">
                    <el-image
                  v-if="temp.filePath2"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath2"
                  :preview-src-list="[temp.filePath2]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath2"
                 disabled
                 value="暂无图片"
                />
            
            
              </el-form-item>

              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                disabled='true'
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                
                >
                </el-date-picker>
              </el-form-item>
          
                  <el-form-item label="复查图片" prop="problemDescribe">
                 <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath3"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath3"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

             
               <el-form-item label="复查意见" prop="reviewResult" >
                <el-input v-model="temp.reviewResult"  disabled='true' />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult" >
                <el-input v-model="temp.auditResult"  disabled='true' />
              </el-form-item>
            
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="temp.reviewPerson" disabled='true' />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="temp.chaosongPerson"   disabled='true'/>
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>

    </el-dialog>
     <el-dialog
      :modal-append-to-body="false"
      class="el-dialog-xiangxi"
      :visible.sync="quilyvisible"
      title="质量问题统计详情"
      center
      @close="closeDialog"
      width="55%"
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
          
              <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="temp.problemArea"  disabled='true'/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="temp.problemType"  disabled='true'/>
              </el-form-item>
              
              <el-form-item label="影响级别" prop="influenceLevel">
               
                <el-select
                  v-model="temp.influenceLevel"
                
                  disabled='true'
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  v-model="temp.problemDescribe"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe" >
                 <el-image
                  v-if="temp.filePath1"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath1"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

              <!-- <el-form-item label="分包单位" prop="subcontractors">
                <el-input
                  v-model="temp.subcontractors"
                  placeholder="分包单位"
                />
              </el-form-item> -->
              <el-form-item label="整改人" prop="rectificationPerson" >
                <el-input
                  v-model="temp.rectificationPerson"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="temp.rectificationMeasures"
                  
                  disabled='true'
                />
              </el-form-item>

               <el-form-item label="整改图片" prop="problemDescribe">
                    <el-image
                  v-if="temp.filePath2"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath2"
                  :preview-src-list="[temp.filePath2]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath2"
                 disabled
                 value="暂无图片"
                />
            
            
              </el-form-item>

              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                disabled='true'
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                 
                >
                </el-date-picker>
              </el-form-item>
          
                  <el-form-item label="复查图片" prop="problemDescribe">
                 <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath3"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath3"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

             
               <el-form-item label="复查意见" prop="reviewResult" >
                <el-input v-model="temp.reviewResult" disabled='true' />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult" >
                <el-input v-model="temp.auditResult"  disabled='true' />
              </el-form-item>
            
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="temp.reviewPerson" disabled='true' />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="temp.chaosongPerson"   disabled='true'/>
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>

    </el-dialog>
  <div class="content">

    
    <div class="content-left">
      <com-box class="content-left-top" :title="'项目概况'">
        <div class="icon-document">
          <img :src="projectPicture" alt />
          <p class="scroll-anim">
            <span>{{ projectSurvey }}</span>
          </p>
        </div>
      </com-box>
      <com-box class="content-left-mid" :title="'项目位置'">
        <div class="map-btn-pro">
          <i class="iconfont iconditu" @click="setMapType(0)"></i>
          <i class="iconfont iconditu1" @click="setMapType(1)"></i>
        </div>
        <div
          class="bm-view"
          id="mapBOX"
          v-if="labels[0].center.lng != null"
        ></div>
      </com-box>
      <com-box class="content-left-bottom" :title="'安全隐患'">
        <div id="safe"></div>
          <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="lookseft"
                style="cursor:pointer"
              />
      </com-box>
      <div style="width: 0; height: 0; margin-top: 0"></div>
    </div>
    <div class="content-mid">
      <com-box class="content-mid-top" :title="'宣传视频'">
        <!--        <div class="site-right">-->
        <!--          <i class="iconfont iconshezhi" @click="openVideo"></i>-->
        <!--        </div>-->
        <div class="videoBox" v-if="playerOptions.sources[0].src != null">
          <video-player
            x5-video-player-type
            class="vjs-custom-skin video-player"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            @play="onPlayerPlay($event)"
          ></video-player>
        </div>
      </com-box>
      <com-box
        class="content-mid-bottom"
        :title="'项目进度'"
        :conentStyle="{ position: 'relative' }"
      >
        <div class="project-js">
          <ul :style="{ width: 190 * tableData1.length + 'px' }">
            <li
              v-for="(item, index) in tableData1"
              :key="item.id"
              :class="{
                firstjd: index === 0,
                noneStart: checkStartDate(item.realStart),
                workingPro: checkworkingPro(item.realStart, item.realEnd),
              }"
            >
              <h3>{{ item.progressName }}</h3>
              <p>开始：{{ item.realStart }} <br />结束：{{ item.realEnd }}</p>
            </li>
          </ul>
        </div>
      </com-box>
    </div>

    <div class="content-right">
      <com-box class="content-right-top" :title="'大事记'">
        <el-carousel style="width: 100%; height: 21vh">
          <el-carousel-item v-for="(item, index) in tableData" :key="index">
            <img :src="item.pictureFilePath" alt />
            <p>{{ item.text }}</p>
          </el-carousel-item>
        </el-carousel>
      </com-box>
      <com-box class="content-right-mid" :title="'环境监测'">
        <el-select
          v-model="valueHuanJin"
          filterable
          placeholder="请选择设备"
          value-key="id"
          class="selectBox"
          @change="changeSelectaa"
        >
          <el-option
            v-for="item in optionsHuanJin"
            :key="item.id"
            :label="item.machineName"
            :value="item"
          >
          </el-option>
        </el-select>
        <div class="huanjingjc">
          <div>
            <b> <i class="iconfont iconzaoyin icon-style"></i>噪音(db) </b>
            <span :style="{ color: getColor2 }">{{ noise }}</span>
          </div>
          <div>
            <b> <i class="el-icon-sunrise-1 icon-style"></i>pm2.5(ug/m³) </b>
            <span :style="{ color: getColor }">{{ pm2Value }}</span>
          </div>
          <div>
            <b> <i class="el-icon-s-opportunity icon-style"></i>温度(℃) </b>
            <span :style="{ color: getColor3 }" style="color: #00bd2c">{{
              temps
            }}</span>
          </div>
          <div>
            <b> <i class="el-icon-sunrise-1 icon-style"></i>pm10(ug/m³) </b>
            <span :style="{ color: getColor1 }">{{ pm10Value }}</span>
          </div>
          <div>
            <b> <i class="el-icon-sunrise-1 icon-style"></i>湿度(%) </b>
            <span :style="{ color: getColor4 }" style="color: #00bd2c">{{
              humidity
            }}</span>
          </div>
          <div>
            <b> <i class="el-icon-position icon-style"></i>风向 </b>
            <span style="color: #00bd2c; font-size: 25px;font-family:pmzd">{{ arr[direction-1] }}</span>
          </div>
          <div>
            <b> <i class="iconfont iconfengsu icon-style"></i>风速(m/s) </b>
            <span :style="{ color: getColor5 }" style="color: #00bd2c">{{
              speed
            }}</span>
          </div>
        </div>
      </com-box>
      <com-box class="content-right-bottom" :title="'质量检查'">
        <div id="quality"></div>
         <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="lookenter"
                 style="cursor:pointer"
              />
      </com-box>
    </div>

    <!-- 安全隐患对话框 -->
    <el-dialog title="安全隐患" width="1500px" :visible.sync="dialogSafe" center="center">
   <div class="top">
          <el-date-picker
            v-model="listQuery.checkTime"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="检查日期"
            style="margin-right:10px"
          >
          </el-date-picker>    
          <el-button size="small" type="primary" @click="search"
            >搜索</el-button
          >
          <el-button size="small" type="primary" @click="reset"
            >重置</el-button
          >
</div>
      <el-table
        :data="safeTable"
        height="500px"
        style="width: 100%; border-radius: 10px"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->
        <!-- <el-table-column prop="checkTime" label="项目名称"></el-table-column> -->
      <el-table-column prop="problemType" label="问题类型"></el-table-column>
 <el-table-column prop="checkPerson" label="检查人"></el-table-column>
        <el-table-column prop="checkTime" label="检查时间"></el-table-column>
         <el-table-column
          prop="rectificationPerson"
          label="整改人"
        ></el-table-column>
         <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
        ></el-table-column>
         <el-table-column
          show-overflow-tooltip="true"
          prop="auditResult"
          label="审核结果"
          width
        ></el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" round @click.stop="viewDetailed(scope.row)" class="textlook"
              >查看</el-button
            >
          </template>
        </el-table-column>

       
       
      </el-table>
      <div>
        <el-pagination
          class="el-pagination"
          v-show="safeTotal > 0"
          background
          layout="prev, pager, next"
          :current-page.sync="listQuery.pageIndex"
          page-size.sync="10"
          @current-change="loadPageData"
          :total="safeTotal"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 质量检查对话框 -->
    <el-dialog title="质量检查" width="1500px" :visible.sync="dialogQuality" center="center">
      
      <div class="top">
          <el-date-picker
            v-model="listQuery.checkTime"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="检查日期"
            style="margin-right:10px"
          >
          </el-date-picker>
    
          <!-- <el-input
            placeholder="检查人"
            size="small"
            v-model="form3.checkPerson"
            clearable
            style="width:200px"
          ></el-input> -->
   
          <el-button size="small" type="primary" @click="search1"
            >搜索</el-button
          >
       
  
          <el-button size="small" type="primary" @click="reset1"
            >重置</el-button
          >
    
</div>
      <el-table
        :data="qualityTable"
        height="500px"
        style="width: 100%; border-radius: 10px"
        @selection-change="handleSelectionChange"
 
      >
           <el-table-column
          prop="problemType"
          label="问题类型"
          width
        ></el-table-column>
        <el-table-column
          prop="checkPerson"
          label="检查人"
          width
        ></el-table-column>
        <el-table-column
          prop="checkTime"
          label="检查时间"
          width
        ></el-table-column>
             <el-table-column
          prop="rectificationPerson"
          label="整改人"
          width
        ></el-table-column>
                <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
          width
        ></el-table-column>
         <el-table-column
          show-overflow-tooltip="true"
          prop="auditResult"
          label="审核结果"
          width
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" round @click.stop="viewquity(scope.row)" class="textlook"
              >查看</el-button
            >
          </template>
        </el-table-column>
       
      </el-table>
      <div>
        <!--        <Pagination-->
        <!--          @sizeChange="sizeChange"-->
        <!--          @currentChange="qualityCurrentChange"-->
        <!--          :current-page="qualityPage"-->
        <!--          :total="qualityTotal"-->
        <!--        ></Pagination>-->
        <el-pagination
          class="el-pagination"
          v-show="qualityTotal > 0"
          background
          layout="prev, pager, next"
          :current-page.sync="listQuery.pageIndex"
          page-size.sync="10"
          @current-change="loadPageData"
          :total="qualityTotal"
        >
        </el-pagination>
      </div>
    </el-dialog>

    <punchlist ref="punchl" />

    <upvideoDialog
      :dialogupVideoVisible.sync="upVideoVisible"
      @uploadSucc="upvideo"
    />
  </div>
    </div>
</template>

<script>
import punchMixin from "@/utils/punchListMixin";
import upvideoDialog from "./uploadVideo1";
import Pagination from "../../../../components/Pagination";
import ComBox from "../../components/combox";
import BaiMap from "BaiMap";
import echarts from "echarts";
import { getPageTtQualitysafeManager } from "../../../qualityManager/api/ttQualitysafeManager.js";
import { selectAmount } from "../../../qualityManager/api/ttQualitysafeManager";
import {
  selectPro,
  addOrUpdateTtProject,
} from "../../../sysproject/api/ttProject";
import { selectProgressByType } from "../../../sysproject/api/ttprojectprogress";
import { selectType } from "../../../sysproject/api/ttuploadfile";
import {
  selectNowSelect,
  selectRed,
  hjjcSelect,
} from "../../../digitalConstructionSite/ycjc/api/ycjcworkdata";

import moment from "moment";
import timeButton from "../aModules/timeButton";


export default {
  name: "describe",
  mixins: [punchMixin],
  components: { ComBox, Pagination, upvideoDialog,timeButton }, //uploadMd
  data() {
    return {
      valueHuanJin: null,
      optionsHuanJin: [],
      upVideoVisible: false,
      threshold: [],
      form: {
        zgtype: "安全管理",
        checkdate: "2020-07-24",
        cjperson: "杨凡",
        jcbw: "检查部位",
        url: "../../../../assets/bigevent/bigevent1.jpg",
        zgcuoshi: "整改措施",
        zgfuzeren: "李胜利",
        yinhuanjb: "1级",
        zhenggsx: "3天",
        fuheqk: "",
        riqi: "2020-07-24",
      },
        temp:{
          ssManagerUser:[
          {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',},
          {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',}
        ]
      },
 
            arr:[
        "东北偏北",
        "东北",
        "东北偏东",
        "东",
        "东南偏东",
        "东南",
        "东南偏南",
        "南",
        "西南偏南",
        "西南",
        "西南偏西",
        "西",
        "西北偏西",
        "西北",
        "西北偏北",
        "北",
      ],
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        checkTime: "",
        dataType:"",
      },
      form2: {
        checkPerson: "",
        checkTime: "",
      },
      form3: {
        checkPerson: "",
        checkTime: "",
        subcontractors:"",
      },
      playerOptions: {
        autoplay: true,
        muted: true,
        language: "en",
        preload: "auto",
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        sources: [
          {
            type: "video/mp4",
            src: null,
          },
        ],
      },
      center: { lng: "", lat: "" },
      zoom: 16,
      labels: [
        {
          title: "",
          center: { lng: "", lat: "" },
        },
      ],
      mapLabelStyle: {
        // 设置label的样式
        color: "#d1e0e3",
        fontSize: "15px",
        boxShadow: "0 0 4px #40bfe8",
        borderRadius: "3px",
        background: "rgba(0,0,0,0.2)",
        padding: "5px 15px",
        border: "1px solid #40bfe8",
      },
      pm2Value: "",
      pm10Value: "",
      noise: "",
      speed: "",
      direction: "",
      temps: "",
      humidity: "",
      projectSurvey: "", //项目概况信息
      projectPicture: "", //项目概况图片
      qualityList: [], //质量检查
      safeList: [], //安全隐患
      colorArr: [
        "#218de0",
        "#01cbb3",
        "#85e647",
        "#5d5cda",
        "#05c5b0",
        "#c29927",
      ],
      colorAlpha: [
        "rgba(60,170,211,0.05)",
        "rgba(1,203,179,0.05)",
        "rgba(133,230,71,0.05)",
        "rgba(93,92,218,0.05)",
        "rgba(5,197,176,0.05)",
        "rgba(194,153,39,0.05)",
      ],
      projectSurveyPath: "",
      dialogSafe: false,
      dialogQuality: false,
      safeTable: [],
      safePage: 1,
      safeTotal: 1,
      qualityTable: [],
      qualityPage: 1,
      qualityTotal: 1,
      //项目进度录入弹窗数据
      startDate: "",
      endDate: "",
      tableData1: [],
      tableData: [],
      filePath: "",
      map: null,
      projectId: this.$store.getters.projectId,
      id: null,
      seftvisible:false,
      quilyvisible:false,
    };
  },
  computed: {
    getColor() {
      return this.pm2Value > this.threshold.pm2Value ? "red" : "#00BD2C";
    },
    getColor1() {
      return this.pm10Value > this.threshold.pm10Value ? "red" : "#00BD2C";
    },
    getColor2() {
      return this.noise > this.threshold.noise ? "red" : "#00BD2C";
    },
    getColor3() {
      return this.temps > this.threshold.temp ? "red" : "#00BD2C";
    },
    getColor4() {
      return this.humidity > this.threshold.humidity ? "red" : "#00BD2C";
    },
    getColor5() {
      return this.speed > this.threshold.speed ? "red" : "#00BD2C";
    },
  },
  created() {},
  mounted() {

    this.selectPro(); //获取项目信息
    this.selectBigEvent(); //查询大事记
    this.hjjcSelect(); //查询环境监测  下拉框
    this.loadPageData();
    this.initQualitySafe(); //质量安全图表
    this.selectEvent(); //查询项目进度
  },
  destroyed() {
    clearInterval(this.tableTimer);
  },
  methods: {


   viewDetailed(row) {
      this.temp = row
      console.log("查看",this.temp);
      this.seftvisible = true;
    }, 
    viewquity(row){
       this.temp = row
      console.log("查看",this.temp);
      this.quilyvisible = true;
    },
    //搜索
    search() {
      this.listQuery.pageIndex =1
       this.listQuery.dataType = 1
      this.loadPageData()
    },
    search1(){
       this.listQuery.pageIndex =1
        this.listQuery.dataType = 0
      this.loadPageData()
    },
    changeSelectaa(item) {
      this.valueHuanJin = item;
      this.initEnvironment(); //查询环境监测
    },
    //hjjcSelect 环境监测的下拉框数据
    hjjcSelect() {
      hjjcSelect({ pageSize: -1 }).then((res) => {
        console.log("环境监测", res);
        this.optionsHuanJin = res.data.records;
        if (res.data.records.length > 0) {
          this.valueHuanJin = res.data.records[0];
          this.initEnvironment(); //查询环境监测
        }
      });
    },
    selectBigEvent() {
      selectType(7).then((res) => {
        if (res.code == "success") {
          this.tableData = res.data;
        }
      });
    },
lookseft(){
  this.dialogSafe = true;
  this.listQuery.dataType = 1
      this.loadPageData();
 
},
reset(){
  this.listQuery.checkTime =""
  this.listQuery.dataType = 1
  this.loadPageData()
},
reset1(){
  this.listQuery.checkTime =""
  this.listQuery.dataType = 0
  this.loadPageData()
},
lookenter(){
     this.dialogQuality = true;
    this.listQuery.dataType = 0
      this.loadPageData();
},
    checkStartDate(start) {
      return moment(start).isAfter(moment().format("YYYY-MM-DD"));
    },
    checkworkingPro(s, e) {
      return (
        moment().isAfter(s) && moment(e).isAfter(moment().format("YYYY-MM-DD"))
      );
    },
    upvideo(path) {
      addOrUpdateTtProject({
        projectVideo: path,
        id: this.id,
      }).then((res) => {
        if (res.code == "success") {
          this.$message.success("上传成功!");
          this.selectPro();
        }
      });
    },
    exportExcel() {
      //安全
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-qualitysafe-manager/exportManager?proId=" +
        this.projectId +
        "&dataType=1&checkPerson=" +
        this.form2.checkPerson +
        "&checkTime=" +
        this.form2.checkTime;
    },
    exportExcel1() {
      //质量
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-qualitysafe-manager/exportManager?proId=" +
        this.projectId +
        "&dataType=0&checkPerson=" +
        this.form3.checkPerson +
        "&checkTime=" +
        this.form3.checkTime;
      // +
      //   "&subcontractors=" +
      //   this.form3.subcontractors;
    },
    openVideo() {
      //点击设置打开宣传视频上传页面
      this.upVideoVisible = true;
    },
    scrollAnima() {
      //轮播项目概况
      let elem = document.querySelector(".scroll-anim");
      let tablebox = elem.getElementsByTagName("span")[0];
      this.tableTimer = setInterval(function () {
        elem.scrollTop++;
        if (elem.scrollTop + elem.offsetHeight >= tablebox.offsetHeight + 25) {
          elem.scrollTop = 0;
        }
      }, 70);
    },
    sizeChange() {},
    handleSelectionChange() {},
    pagechangeyh(page) {
        let param = { dataType: 0, pageIndex: page, pageSize: 10,...this.form3 };
      this.loadPageData(param);
    },
    pagechangezl(page) {
      let param = { dataType: 0, pageIndex: page, pageSize: 10,...this.form3 };
      this.loadPageData(param);
    },

    //查询质量安全页面
    loadPageData() {
      getPageTtQualitysafeManager(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            if (this.listQuery.dataType == 0) {
              this.qualityTable = res.data.records;
              this.qualityTotal = res.data.total;
            } else {
              this.safeTable = res.data.records;
              this.safeTotal = res.data.total;
            }
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    safeCurrentChange(val) {
      this.safePage = val;
      let param = { dataType: 1, pageIndex: val, pageSize: 10 };
      this.loadPageData(param);
    },
    qualityCurrentChange(val) {
      this.qualityPage = val;
      let param = { dataType: 0, pageIndex: val, pageSize: 10 };
      this.loadPageData(param);
    },
    clickSafe() {
      //单击安全隐患图表(待完成)
      let param = { dataType: 1, pageIndex: this.safePage, pageSize: 10 };
      this.loadPageData(param);
    },
    clickQuality() {
      //单击质量检查图表(待完成)
 
    },
    selectEvent() {
      //查询项目进度
      selectProgressByType(0).then((res) => {
        this.tableData1 = res.data;
      });
    },

    onPlayerPlay(e) {
      e;
    },
    initMap() {
      //初始化地图
      this.map = new BaiMap.Map("mapBOX");
      let point = new BaiMap.Point(this.center.lng, this.center.lat);
      this.map.centerAndZoom(point, this.zoom);
      this.map.setMapType(BMAP_EARTH_MAP);
      this.map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
      this.map.enableKeyboard(true); //启用键盘操作，默认禁用。
      this.map.enableDragging(); //启用地图拖拽，默认启用
      this.map.enableDoubleClickZoom(); //启用双击放大，默认启用
      this.map.setMapStyleV2({
        styleId: "f3424686c2ea291f79d73af9d36314bd",
      });
      this.addLabel(this.map);
    },
    setMapType(type) {
      let code = type === 0 ? BMAP_EARTH_MAP : BMAP_NORMAL_MAP;
      this.map.setMapType(code);
    },
    addLabel(map) {
      this.labels.forEach((item) => {
        let point = new BaiMap.Point(item.center.lng, item.center.lat);
        let label = new BaiMap.Label(item.title, {
          // 创建文本标注
          position: point,
          offset: new BaiMap.Size(0, 0),
        });
        map.addOverlay(label); // 将标注添加到地图中
        label.setStyle(this.mapLabelStyle);
      });
    },
    initSafe() {
      //初始化安全隐患图表
      let option = {
        // backgroundColor: "#090e36",
        grid: {
          // left: -100,
          // top: 50,
          // bottom: 10,
          // right: 10,
          // width:'auto',
          // height:'auto',
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
          
        },
        legend: {
          show: false,
        },

        polar: {},
        angleAxis: {
          interval: 1,
          type: "category",
          data: [],
          z: 10,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B4A6B",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            interval: 0,
            show: true,
            color: "#0B4A6B",
            margin: 8,
            fontSize: 16,
          },
        },
        radiusAxis: {
          min: 20,
          max: 120,
          interval: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B3E5E",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            formatter: "{value} %",
            show: false,
            padding: [0, 0, 20, 0],
            color: "#0B3E5E",
            fontSize: 16,
          },
          splitLine: {
            lineStyle: {
              color: "#07385e",
              width: 1,
              type: "solid",
            },
          },
        },
        calculable: true,
        series: [
          {
            stack: "a",
            type: "pie",
            radius: "50%",
            roseType: "radius",
            zlevel: 10,
            startAngle: 100,
            center: ["50%", "50%"],
            label: {
              normal: {
                formatter: ["{b|{b}}", "{d|{d}%}"].join("\n"),
                rich: {
                  b: {
                    color: "#3bd2fe",
                    fontSize: 14,
                    lineHeight: 20,
                  },
                  d: {
                    color: "#d0fffc",
                    fontSize: 14,
                    height: 20,
                  },
                },
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 8,
                length2: 10,
                lineStyle: {
                  color: "#0096b1",
                },
              },
              emphasis: {
                show: false,
              },
            },
            data: this.safeList,
          },
        ],
      };
      echarts.init(document.getElementById("safe")).setOption(option);
      echarts.init(document.getElementById("safe")).on("click", (params) => {
        this.clickSafe();
      });
    },
    initQuality() {
      //初始化质量管理图表
      let option = {
        // backgroundColor: "#090e36",
        grid: {
          left: -100,
          top: 50,
          bottom: 10,
          right: 10,
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          show: false,
        },

        polar: {},
        angleAxis: {
          interval: 1,
          type: "category",
          data: [],
          z: 10,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B4A6B",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            interval: 0,
            show: true,
            color: "#0B4A6B",
            margin: 8,
            fontSize: 16,
          },
        },
        radiusAxis: {
          min: 20,
          max: 120,
          interval: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B3E5E",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            formatter: "{value} %",
            show: false,
            padding: [0, 0, 20, 0],
            color: "#0B3E5E",
            fontSize: 16,
          },
          splitLine: {
            lineStyle: {
              color: "#07385e",
              width: 1,
              type: "solid",
            },
          },
        },
        calculable: true,
        series: [
          {
            stack: "a",
            type: "pie",
            radius: "50%",
            roseType: "radius",
            zlevel: 10,
            startAngle: 100,
            label: {
              normal: {
                formatter: ["{b|{b}}", "{d|{d}%}"].join("\n"),
                rich: {
                  b: {
                    color: "#3bd2fe",
                    fontSize: 14,
                    lineHeight: 20,
                  },
                  d: {
                    color: "#d0fffc",
                    fontSize: 14,
                    height: 20,
                  },
                },
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 8,
                length2: 10,
                lineStyle: {
                  color: "#0096b1",
                },
              },
              emphasis: {
                show: false,
              },
            },
            data: this.qualityList,
          },
        ],
      };
      echarts.init(document.getElementById("quality")).setOption(option);
      echarts.init(document.getElementById("quality")).on("click", (params) => {
        console.log(params);
        this.clickQuality();
      });
    },
    initEnvironment() {
      //初始化环境检测数据
      let that = this;
      console.log(this.valueHuanJin);
      selectNowSelect({ machineNum: this.valueHuanJin.machineNumber }).then(
        (res) => {
          console.log("初始化环境检测数据", res);
          if (res.data) {
            that.pm2Value = res.data.pm2Value;
            that.pm10Value = res.data.pm10Value;
            that.noise = res.data.noise;
            that.speed = res.data.speed;
            that.direction = res.data.direction;
            that.temps = res.data.temp;
            that.humidity = res.data.humidity;
          } else {
            that.pm2Value = "";
            that.pm10Value = "";
            that.noise = "";
            that.speed = "";
            that.direction = "";
            that.temps = "";
            that.humidity = "";
          }
        }
      );
      selectRed()
        .then((res) => {
          console.log("查询阀值", res);
          if (res.code == "success") {
            if (res.data) {
              this.threshold = res.data;
            }
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    selectPro() {
      //初始化当前项目信息
      let that = this;
      selectPro().then((res) => {
        if (res.data) {
          that.labels[0].center.lng = res.data.xaxis;
          that.labels[0].center.lat = res.data.yaxis;
          that.center.lng = res.data.xaxis;
          that.center.lat = res.data.yaxis;
          that.projectSurvey = res.data.projectSurvey;
          that.projectPicture = res.data.projectPicture;
          that.labels[0].title =
            '<a></a><i class="el-icon-office-building"></i>' +
            this.$store.getters.projectName;
          that.id = res.data.id;
          that.playerOptions.sources[0].src = res.data.projectVideo;

          this.scrollAnima();
          this.initMap(); //初始化项目位置地图
        }
      });
    },
    initQualitySafe() {
      //初始化质量安全图表
      let that = this;
      selectAmount().then((res) => {
        that.qualityList = [];
        console.log("名称",res.data);
        for (let i = 0; i < res.data.qualityList.length; i++) {
            that.qualityList.push({
              value: res.data.qualityList[i].value,
              name: res.data.qualityList[i].name,
              itemStyle: {
                borderColor: that.colorArr[i],
                borderWidth: 2,
                shadowBlur: 20,
                shadowColor: that.colorArr[i],
                shadowOffsetx: 25,
                shadowOffsety: 20,
                color: that.colorAlpha[i],
              },
            });
        }
        that.initQuality(); //初始化质量检查图表
        that.safeList = [];
        for (let i = 0; i < res.data.safeList.length; i++) {
          if (res.data.safeList[i].name){
            that.safeList.push({
              value: res.data.safeList[i].value,
              name: res.data.safeList[i].name,
              itemStyle: {
                borderColor: that.colorArr[i],
                borderWidth: 2,
                shadowBlur: 20,
                shadowColor: that.colorArr[i],
                shadowOffsetx: 25,
                shadowOffsety: 20,
                color: that.colorAlpha[i],
              },
            });
          }
        }
        that.initSafe(); //初始化安全隐患图表
      });
    },
    //适应不同尺寸charts重置
    initSize() {
      setTimeout(() => {
        window.addEventListener("resize", () => {
          echarts.resize();
        });
      }, 20);
    },
  },
  //定时清除init带来的定时器
  destroyed() {
    window.removeEventListener("resize", this.init, 20);
  },
};
</script>

<style scoped lang="less">
#safe,
#quality {
  height: 22vh;
}
.top{
  display: flex;
  justify-content: end;
  align-items: center;
}
.icon-document {
  //项目概况样式
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  height: calc(100% - 45px);
  img {
    width: 100%;
    height: 100%;
  }
  p {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.58);
    margin: 0;
    padding: 14px 10px;
    height: 60px;
    overflow: hidden;
  }
}

.site-right {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #0183bc;
}
.site-right {
  i {
    display: inline-block;
    font-size: 17px;
    margin-left: 10px;
    color: @fcolor;
  }
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
}
.content-left {
  width: 360px;
  display: flex;
  flex-direction: column;
}
.content-mid {
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  width: calc(100% - 720px);
  align-items: stretch;
}
.content-mid-top {
  // flex: 2 46px;
  flex: 2 80px;
  min-height: 493px;
}
.content-mid-bottom {
  flex: 1;
  margin-bottom: 0;
}
.content-right {
  width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-left-top {
  flex: 1;
  width: 100%;
}
.content-left-mid {
  flex: 1;
  width: 100%;
  /deep/.cb-head {
    position: relative;
    z-index: 2;
  }
  .map-btn-pro {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
    i {
      display: inline-block;
      padding: 3px 5px;
      background: #000e2b;
      margin-left: 5px;
      font-size: 20px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
.content-left-bottom {
  flex: 1;
  margin-bottom: 0;
  position: relative;
  img{
    position: absolute;
    top:5%;
    right: 2%;
  }
}
.content-right-top {
  flex: 1;
}
.content-right-mid {
  flex: 1;
  .selectBox {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 30px !important;
    /deep/.el-input {
      height: 30px !important;
    }
    /deep/.el-input__inner {
      height: 30px !important;
    }
    /deep/.el-input--medium .el-input__icon {
      line-height: 30px !important;
    }
  }
}
.content-right-bottom {
  flex: 1;
  margin-bottom: 0;
  position: relative;
  img{
     position: absolute;
    top:5%;
    right: 2%;
  }
}
.present {
  width: 100%;
  height: 100%;
}
.present-left {
  width: 50%;
  height: 100%;
}
.present-right {
  width: 50%;
  height: 100%;
}

.bm-view {
  width: 100%;
  height: 100%;
  position: absolute !important;
  left: 0;
  top: 0;
  z-index: 1;
}
.videoBox {
  //  -webkit-height: 50.8vh; //50.4vh
  //  height: 50.4vh;
  height: 100%;
  .video-player {
    height: 100%;
    /deep/.video-js {
      width: 100%;
      height: 100%;
    }
    /deep/.video-js .vjs-big-play-button {
      left: 50%;
      top: 50%;
    }
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
    background: url("../../../../assets/viewplate/map_label_ico.png") no-repeat;
  }
}
/deep/.el-carousel__container {
  height: 100%;
}
/deep/.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
  }
  p {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px;
    background: rgba(0, 0, 0, 0.58);
    margin: 0;
  }
}
.huanjingjc {
  display: flex;
  flex-wrap: wrap;
  padding-top: 15px;
  > div {
    width: 50%;
    height: 5vh;
    text-align: left;
    position: relative;
    b {
      color: #26d1ff;
      font-weight: 400;
      text-align: center;
      width: 5vw;
      display: block;
      i {
        display: block;
        font-size: 19px;
        position: relative;
        left: -8px;
      }
    }
    span {
      font-size: 31px;
      position: absolute;
      right: 16px;
      top: 11px;
      font-family: "dzfont";
    }
  }
}
.project-js {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  overflow-x: auto;
  ul {
    margin: 15px 0 0 5px;
    padding: 0;
    overflow: hidden;
    background-position: 1vw 4vh;
    li {
      float: left;
      width: 190px;
      text-align: center;
      color: @scolor;
      position: relative;
      h3 {
        margin-bottom: 7vh;
        font-weight: 400;
      }
      &::before {
        content: "";
        position: absolute;
        left: 80px;
        top: 67px;
        width: 100%;
        height: 10px;
        // background: linear-gradient(to right,aqua 90%,rgb(192, 255, 236) 10%);
        background: aqua;
      }
      &::after {
        content: "\2714";
        position: absolute;
        left: 80px;
        text-align: center;
        top: 57px;
        width: 30px;
        height: 30px;
        background: #149e9e;
        border-radius: 50%;
        line-height: 30px;
        font-size: 19px;
      }
    }
    li.firstjd {
      &::before {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }
    li.noneStart {
      &::before {
        background: #72757a;
      }
      &::after {
        content: "\2610";
        background: #56595e;
      }
    }
    li.workingPro {
      &::before {
        background: #ded892;
      }
      &::after {
        content: "\27B2";
        background: #cec774;
        color: #fff;
      }
    }
  }
}

// 大事记样式
.el-carousel__item {
  display: flex;
  justify-content: space-around;
  div {
    position: relative;
    flex: 1;
    max-width: 400px;
    height: 100%;
    margin: 2px;
    p {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
      background: rgba(0, 0, 0, 0.58);
      margin: 0;
    }
    img {
      width: 100%;
      height: 100%;
      &:hover {
        transform: scale(1.2);
        transition: 0.5s;
      }
    }
  }
}
.el-table__body img {
  height: 100px;
  width: 100px;
}



.dig-bodyTop {
  width: 100%;
  overflow: hidden;
  .topImg {
    float: left;
    width: 23%;
    span {
      margin: 20px;
    }
  }
  .topText {
    float: left;
    width: 49%;
  }
  .topSet {
    float: left;
    width: 24%;
    text-align: center;
    .addbox {
      margin-top: 15%;
      button {
        padding: 10px 15px !important;
      }
    }
  }
}
.content-mid-bottom {
  .site-right {
    position: absolute;
    right: 0;
    top: -27px;
    color: #0183bc;
  }
}
@media screen and(max-width:1024px) {
  .content-left,
  .content-right {
    width: 320px !important;
  }
}
</style>

<style lang="less">
.dig-bodyTop .topText .el-textarea .el-textarea__inner {
  background-color: #000b28;
  margin-top: 5px;
  color: #ffffff;
  height: 100px;
}

.bbb .has-gutter {
  display: none;
}
@media screen and (max-width: 1024px) {
  p,
  b,
  label,
  i {
    transform: scaleY(0.9);
  }
  .scroll-anim {
    transform-origin: left bottom;
  }
  .combox-title {
    transform: scaleY(0.9);
  }
  #safe,
  #quality {
    // transform: scaleY(0.8);
  }

  .vjs-custom-skin {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // width: 100%;
    // height: 100%;
    // transform: translate(-50%,-50%);
  }

  .content-left-bottom {
    flex: 1;
    margin-bottom: 0;
    height: 0vh;
  }
  .content-mid {
    transform: scale(1);
    width: 100%;
  }
  .content-mid-top {
    // min-height: 490px !important;
    // flex: 2;
    // height: 0vh;
  }
  .content-mid-bottom {
    // height: 2vh;
    // flex: 2;
  }

  .content-right-top,
  .content-right-mid,
  .content-right-bottom {
    height: 0vh;
  }
  video,
  .video-player,
  .vjs-tech {
    object-fit: fill !important;
  }
  .huanjingjc div {
    transform: scale(0.9);
    height: 6vh !important;
    b {
      width: 8vw !important;
    }
  }
}
</style>
