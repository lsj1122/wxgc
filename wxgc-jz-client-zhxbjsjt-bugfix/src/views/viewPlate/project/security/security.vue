<template>
  <div class="security">
    <div class="leftbox">
      <combox title="安全问题统计" style="flex: 1">
        <div id="aq_tj_Chart" class="chart-box"></div>
      </combox>
      <combox title="教育交底人数统计" style="flex: 1">
        <template #head>
          <el-button-group>
            <el-button type="primary" size="mini" @click="wifiChoose(0)"
            >图表
            </el-button
            >
            <el-button type="primary" size="mini" @click="wifiChoose(1)"
            >图片
            </el-button
            >
          </el-button-group>
        </template>

        <problem-trend :wifiChooseShow="wifiChooseShow" ref="wifi"/>
      </combox>
      <combox title="机械汇总" style="flex: 1; margin: 0">
        <div id="gaojingfenx" class="chart-box"></div>
      </combox>
    </div>
    <div class="contentbox">
      <combox title="视频监控" style="flex: 2 80px" class="shipingjjk">
        <template #head>
          <div class="video-top">
            <i class="iconfont icondangexianshi" @click="changeVideoBox(1)"></i>
<!--            <i class="iconfont iconshipinshuangxian" @click="changeVideoBox(2)" style="font-size: 15px" ></i>-->

            <i class="el-icon-menu" @click="changeVideoBox(2)"></i>
            <i class="el-icon-s-grid" @click="changeVideoBox(3)"></i>
            <i class="ich4" @click="changeVideoBox(4)"></i>

            <i class="iconfont iconshezhi" @click="addVideo"></i>
            <!-- <i class="iconfont iconshuaxin2"></i> -->
          </div>
        </template>

        <div class="video-jk">
          <HikvisionWsPlayer ref="hkPlayer" :splitNum="splitNum" :type="true" :resourceTitles="resourceTitles" :resourceIds="resourceIds" />
        </div>
      </combox>
      <combox title="设备告警" style="flex: 1; margin: 0">
        <template #head>
          <el-button plain size="mini" class="export-btn" @click="exportExcel"
          >导出Excel
          </el-button
          >
        </template>
        <el-table
          :data="tableData3"
          style="width: 100%; border-radius: 10px"
          height="200"
          class="scrollTable"
        >
          <el-table-column prop="uploadDate" label="告警时间" width="180">
            <template slot-scope="scope">{{
                scope.row.uploadDate | dateformat
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="machineName"
            label="设备名称"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="machineNumber"
            label="设备编号"
            width="130"
          ></el-table-column>
          <el-table-column
            prop="machineType"
            label="设备类型"
            width="130"
          ></el-table-column>
          <el-table-column prop="warning" label="告警内容" width="130">
            <template slot-scope="scope">
              <a style="color: #ff0000">{{ scope.row.warning }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="司机姓名"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="司机电话"
            width="120"
          ></el-table-column>
        </el-table>
      </combox>
    </div>
    <div class="rightbox">
      <combox title="安全问题整改率 (%)" style="flex: 1">

        <div id="gaugebox" class="chart-box"></div>
      </combox>
      <combox title="安全培训和交底" style="flex: 1">
        <security-incident/>
      </combox>
      <combox title="安全知识库" style="flex: 1; margin: 0">
        <ul class="aqzsk">
          <li v-for="item in boardList" :key="item.knowledgeBaseId">
            <span @click="getFileList(item.knowledgeBaseId)">
              <h5>{{ item.knowledgeBaseName }}</h5>
              <span>
                <i v-for="(n, ind) in item.count.split('')" :key="ind">{{
                    n
                  }}</i>
              </span>
            </span>
          </li>
        </ul>
      </combox>
    </div>
    <el-dialog title="视频监控" height="500" :visible.sync="dialogVideo">
      <el-table :data="videoArr" row-key="id" style="width: 100%" height="450px">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="videoUrl" label="URL"></el-table-column>
        <el-table-column
          prop="videoName"
          label="名称"
          width="220"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              class="el-icon-upload2 jiantou"
              v-if="scope.$index != 0"
              @click="clickUp(scope)"
            ></el-button>
            <el-button
              class="el-icon-download jiantou2"
              v-if="scope.$index != videoArr.length - 1"
              @click="clickDown(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <br/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reloadVideoBox">重 置</el-button>
        <el-button @click="cancelVideoBox">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="知识库"
      width="1000px"
      height="500"
      :visible.sync="dialogKnowledge"
      :modal-append-to-body="false"
    >
      <el-table
        :data="tableData_bot"
        height="500"
        style="width: 100%; border-radius: 10px"
        @selection-change="hanSeleChange_bot"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="fileSize"
          label="文件大小"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createBy"
          label="上传人"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="上传时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <a
              :href="
                '/wxgc-api/wxgc/plus/tt-file/downLoadFile?filePath=' +
                scope.row.filePath
              "
            >下载</a
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="el-pagination"
          background
          layout="prev, pager, next"
          :current-page.sync="page"
          page-size.sync="10"
          @current-change="currentChange"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="安全问题统计"
      width="1500px"
      :visible.sync="dialogSecurity"
      :modal-append-to-body="false"
    >
      <el-table
        :data="securityTable"
        height="500px"
        style="width: 100%; border-radius: 10px"
        @selection-change="handleSelectionChange2"
        @row-click="rowdbclickFn"
      >
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="createTime"
          label="检查时间"
          width
        ></el-table-column>
        <el-table-column prop="createBy" label="检查人" width></el-table-column>
        <el-table-column
          prop="problemArea"
          label="问题部位"
          width
        ></el-table-column>
        <el-table-column
          prop="problemType"
          label="问题类型"
          width
        ></el-table-column>
        <el-table-column
          prop="influenceLevel"
          label="影响级别"
          width
        ></el-table-column>
        <el-table-column
          prop="problemDescribe"
          label="问题描述"
          width
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="subcontractors"
          label="分包单位"
          width
        ></el-table-column>
        <el-table-column
          prop="rectificationPerson"
          label="整改人"
          width
        ></el-table-column>
        <el-table-column
          prop="rectificationRequirement"
          label="整改要求"
          width
        ></el-table-column>
        <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
          width
        ></el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          width
        ></el-table-column>
        <el-table-column
          prop="reviewOverTime"
          label="复查超时"
          width
        ></el-table-column>
        <el-table-column
          prop="auditResult"
          label="核验结果"
          width
        ></el-table-column>
        <el-table-column
          prop="reviewPersonAll"
          label="核验人"
          width
        ></el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="el-pagination"
          background
          layout="prev, pager, next"
          :current-page.sync="page1"
          page-size.sync="10"
          @current-change="currentChange1"
          :total="total1"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <punchlist ref="punchl"/>
  </div>
</template>


<script>
import JGHikvision from "@components/JGHikvision";
import {videoPlayer} from "vue-video-player";

import "videojs-contrib-hls";
import {getoption} from "../quality/module/zglChartOption.js";
import Pagination from "../../../../components/Pagination";
import echarts from "echarts";
import punchMixin from "@/utils/punchListMixin";
import SecurityIncident from "./module/SecurityIncident.vue";
import ProblemTrend from "./module/ProblemTrend.vue";
import {
  getPageTtQualitysafeManager,
  selectMachineCount,
  selectMachineWarn,
  selectStateAmount,
} from "@/views/qualityManager/api/ttQualitysafeManager";
import {getPageTtKnowledgeBaseFile} from "@/views/safeManager/api/ttknowledgebasefile";
import {selectKnowledgeCount} from "@/views/safeManager/api/ttknowledgebase";
import {
  addOpenVideo,
  controlVideo,
  selectTtVideoByPro,
  updateTtVideoDown,
  updateTtVideoUp,
} from "@/views/digitalConstructionSite/spjk/api/ttvideo";
import HikvisionWsPlayer from '@/components/HikvisionWsPlayer'

export default {
  name: "security",
  components: {
    Pagination,
    SecurityIncident,
    ProblemTrend,
    videoPlayer,
    JGHikvision,
    HikvisionWsPlayer
  },
  mixins: [punchMixin],
  data() {
    return {
      wifiChooseShow: true,
      playerOptions: [],
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        knowledgeBaseFileId: undefined,
        knowledgeBaseType: 1,
      },
      dialogSecurity: false,
      securityTable: [],
      videobox: [],
      videoArr: [],
      videoWidth: "100%",
      videoheight: "100%",
      safeList: [], //安全问题统计数据
      tableData3: [],
      race: "",
      race1: "",
      race2: "",
      id: "",
      boardList: [], //安全知识库数量
      dialogKnowledge: false,
      tableData_bot: [], //知识库列表
      page: 1,
      page1: 1,
      total: 10,
      total1: 10,
      knowledgeBaseId: "",
      //video数据
      dialogVideo: false,
      projectId: this.$store.getters.projectId,
      machineCount: [], //机械汇总数据
      resourceIds: [],
      resourceTitles: [],
      splitNum: 2,
    };
  },
  created() {
    this.selectVideo2(); //查询监控
  },
  mounted() {
    this.initQualitySafe(); //初始化安全问题统计/安全问题整改率
    this.selectBoard(); //初始化安全知识库
    this.getWarrList(); //初始化设备告警数据
    this.selectMachineCount(); //初始化机械汇总数据
  },
  destroyed() {
    clearInterval(this.tableTimer);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player; //自定义播放
    },
  },
  methods: {
    clickUp(data) {
      let param = data.row;
      updateTtVideoUp(param).then((res) => {
        if ((res.code = "success")) {
          this.selectVideo();
        }
      });
    },
    clickDown(data) {
      let param = data.row;
      updateTtVideoDown(param).then((res) => {
        if ((res.code = "success")) {
          this.selectVideo();
        }
      });
    },
    onPlayerPlay(e) {
      console.log("自动播放后执行");
    },
    wifiChoose(data) {
      if (data == 0) {
        this.wifiChooseShow = true;
      } else {
        this.wifiChooseShow = false;
      }
    },
    controlVideo(ds, bd, dir) {
      controlVideo(ds, bd, dir).then((res) => {
      });
    },
    selectMachineCount() {
      selectMachineCount().then((res) => {
        this.machineCount = res.data;
        this.gjlxfenxi();
      });
    },
    exportExcel() {
      window.location =
        "/api/system/company-board/exportProjectExcel?projectId=" +
        this.projectId;
    },
    selectVideo() {
      let that = this;
      selectTtVideoByPro().then((res) => {
        res.data.forEach((item) => {
          item.loading = false;
        });
        that.videoArr = res.data; //这是所有的视屏
      });
    },
    selectVideo2() {
      let that = this;
      selectTtVideoByPro().then((res) => {
        res.data.forEach((item) => {
          item.loading = false;
          that.resourceIds.push(item.videoUrl);
          that.resourceTitles.push(item.videoName);
        });

        that.videoArr = res.data; //这是所有的视屏
        //查询播放数据
        this.getPlayVideo();
      });
    },
    addVideo() {
      this.dialogVideo = true;
      document.getElementById("editVideo").style.display = "none";
    },
    cancelVideoBox() {
      this.dialogVideo = false;
      //查询播放数据
      // this.getPlayVideo();
    },
    reloadVideoBox(){
      this.resourceIds = this.videoArr.map((e) => {
        return e.videoUrl;
      });
      this.dialogVideo = false;
    },
    getList() {
      getPageTtQualitysafeManager({
        pageIndex: this.page1,
        pageSize: 10,
        dataType: 1, //安全为1
        //检查结果
      }).then((res) => {
        this.total1 = res.data.total;
        this.securityTable = res.data.records;
      });
    },
    scrollAnima() {
      if (this.$store.getters.projectId !== "4d28a604aa03a3a0008bf578ce976749") {
        let parentEl = document.querySelector(".scrollTable ");
        let elem = parentEl.querySelector(".el-table__body-wrapper");
        let tablebox = elem.querySelector(".el-table__body");
        this.tableTimer = setInterval(function () {
          elem.scrollTop++;
          if (elem.scrollTop + elem.offsetHeight === tablebox.offsetHeight) {
            elem.scrollTop = 0;
          }
        }, 60);
      }
    },
    getWarrList() {
      //请求告警详情数据
      selectMachineWarn().then((res) => {
        // 萝岗数据要求 替换假数据
        if (this.$store.getters.projectId === "4d28a604aa03a3a0008bf578ce976749") {
          this.tableData3 = [];
        } else {
          this.tableData3 = res;
        }

        this.$nextTick(function () {
          this.scrollAnima();
        });
      });
    },
    playHandle(item) {
      item.load = true;
    },
    handleSelectionChange() {
    },
    changeThirty(type) {
      let that = this;
      if (type === 0) {
        this.race = this.race2 == 0 ? 100 : this.race2;
      } else {
        this.race = this.race1 == 0 ? 100 : this.race1;
      }
      that.loadGauge();
    },
    handleSelectionChange2() {
    },
    hanSeleChange_bot() {
    },
    sizeChange() {
    },
    currentChange() {
      this.getFileList(this.knowledgeBaseId);
    },
    sizeChange1() {
      alert("size");
    },
    currentChange1(res) {
      this.page1 = res;
      this.getList();
    },
    clickKnowledge() {
      //打开弹窗
      this.dialogKnowledge = true;
    },
    getFileList(id) {
      //获取知识库列表
      this.knowledgeBaseId = id;
      this.dialogKnowledge = true;
      getPageTtKnowledgeBaseFile({
        pageIndex: this.page,
        pageSize: 10,
        knowledgeBaseId: id,
      }).then((res) => {
        this.total = res.data.total;
        if (res.code == "success") {
          this.tableData_bot = res.data.records;
        }
      });
    },
    handlePlay(item, status) {
      return;
      console.log(this.videobox);
      console.log("-------10001--------", item);
      this.videoArr.forEach((n, i) => {
        if (n.id === item.id) {
          item.played = status;
          item.loading = false;
          this.videoArr.splice(i, 1, item);
        }
      });
      // this.getStream()
      console.log("------this.videoArr-------", this.videoArr);
    },
    closeVideo(item, index) {
      console.log(item, index);

      // this.playerOptions[index].sources[0].src = "";

      this.$set(this.playerOptions[index].sources, 0, {
        withCredentials: false,
        type: "application/x-mpegURL",
        src: "",
      });
    },
    getPlayVideo() {
      this.changeVideoBox(this.num);
    },
    changeVideoBox(n) {
      // this.splitNum = n
      this.num = n;
      let config = {
        splitNum: this.num,
        resourceIds: this.resourceIds,
        resourceTitles: this.resourceTitles
      }
      this.$store.state.hkPlayerConfig = config
      this.$refs.hkPlayer.loadConfig();
      this.$refs.hkPlayer.showConfig();
      this.$refs.hkPlayer.createPlayer();

    },
    viewVideo(row) {
      //查看监控
      row.loading = true;
      console.log("查看监控", row);
      console.log(this.videobox.entries());

      for (let [index, item] of this.playerOptions.entries()) {
        //entries()  类似于for in
        console.log(index, item);

        if (item.sources[0].src == undefined || item.sources[0].src == "") {
          // this.playerOptions[i].sources[0].src = "";
          // 替换 videobox
          this.videobox.splice(index, 1, row);
          // 替换资源路径
          this.playerOptions[index].sources[0].src = row.videoUrl;
          break;
        }
      }
      console.log(this.videobox);
      //提交到后台
      this.putPlayList(this.videobox);
    },
    putPlayList(data) {
      addOpenVideo(data).then((res) => {
        if (res.code == "success") {
          //this.$message.success('展示成功！')
        }
      });
    },
    aqwtTongji() {
      let _this = this;
      let img =
        "data:image/png;base64,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";
      let trafficWay = this.safeList;
      console.log("trafficWay", trafficWay);

      let data = [];
      let color = ["#FFAA02", "#FF004E", "#0F8DFF"];
      for (let i = 0; i < trafficWay.length; i++) {
        data.push(
          {
            value: trafficWay[i].value,
            name: trafficWay[i].name,
            itemStyle: {
              normal: {
                borderWidth: 8,
                shadowBlur: 20,
                borderColor: color[i],
                shadowColor: color[i],
              },
            },
          },
          {
            value: 2,
            name: "",
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0,
              },
            },
          }
        );
      }
      let seriesOption = null;
      //判断 是否是 合肥科技馆的账号
      if (
        this.$store.state.user.name == "hfkjg" ||
        this.$store.state.project.projectName ==
        "合肥市科技馆新馆（自然博物馆）"
      ) {
        seriesOption = [
          {
            name: "",
            type: "pie",
            clockWise: false,
            radius: [60, 61],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "outside",
                  color: "#ddd",
                  formatter: function (params) {
                    let percent = 0;
                    percent = params.value;
                    if (params.name !== "") {
                      return params.name + "\n";
                    } else {
                      return "";
                    }
                  },
                },
                labelLine: {
                  length: 10,
                  length2: 10,
                  show: true,
                  color: "#00ffff",
                },
              },
            },
            data: data,
          },
        ];
      } else {
        seriesOption = [
          {
            name: "",
            type: "pie",
            clockWise: false,
            radius: [60, 61],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "outside",
                  color: "#ddd",
                  formatter: function (params) {
                    let percent = 0;
                    percent = params.value;
                    if (params.name !== "") {
                      return params.name + "\n" + "\n" + "数量：" + percent;
                    } else {
                      return "";
                    }
                  },
                },
                labelLine: {
                  length: 10,
                  length2: 10,
                  show: true,
                  color: "#00ffff",
                },
              },
            },
            data: data,
          },
        ];
      }

      let option = {
        color: color,
        title: {
          text: "",
          top: "48%",
          textAlign: "center",
          left: "49%",
          textStyle: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "400",
          },
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: img,
                width: 0,
                height: 0,
              },
              left: "center",
              top: "center",
              position: [100, 100],
            },
          ],
        },
        tooltip: {
          show: false,
        },
        toolbox: {
          show: false,
        },
        series: seriesOption,
      };
      echarts.init(document.getElementById("aq_tj_Chart")).setOption(option);
      echarts
        .init(document.getElementById("aq_tj_Chart"))
        .on("click", function (params) {
          // 在用户点击后控制台打印数据的名称

          _this.showDialog();
        });
    },
    loadGauge() {
      let mychart = echarts.init(document.getElementById("gaugebox"));
      let angle = 0;
      let draw = () => {
        angle += 3;
        mychart.setOption(getoption(angle, this.race), true);
        this.timerLv = setTimeout(draw, 100);
      };
      if (this.timerLv) {
        clearTimeout(this.timerLv)
      }
      this.timerLv = setTimeout(draw, 100);
      return;
      let option = {
        tooltip: {
          formatter: "{a} <br/>{c} {b}",
        },
        series: [
          {
            type: "gauge",
            min: 0,
            max: 100,
            splitNumber: 10,
            radius: "100%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.09, "lime"],
                  [0.82, "#1e90ff"],
                  [1, "#ff4500"],
                ],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10,
              },
            },
            axisLabel: {
              // 坐标轴小标记
              fontWeight: "bolder",
              color: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 10,
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10,
              },
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10,
              },
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10,
              },
            },
            detail: {
              backgroundColor: "rgba(30,144,255,0.8)",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              detail: {formatter: "{value}"},
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff",
              },
            },
            data: [{value: this.race}],
          },
        ],
      };
      echarts.init(document.getElementById("gaugebox")).setOption(option);
    },
    gjlxfenxi() {
      let option = {
        title: {
          text: "",
          x: "center",
          y: "4%",
          textStyle: {
            color: "#fff",
            fontSize: "22",
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "16%",
          right: "3%",
          left: "8%",
          bottom: "16%",
        },
        xAxis: [
          {
            type: "category",
            data: ["塔机", "升降机", "视频监控", "环境监测"],
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
            axisLabel: {
              margin: 10,
              color: "#e2e9ff",
              textStyle: {
                fontSize: 14,
              },
            },
          },
        ],
        yAxis: [
          {
            name: "台",
            axisLabel: {
              formatter: "{value}",
              color: "#e2e9ff",
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(255,255,255,1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            data: this.machineCount,
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: function (params) {
                  // 颜色定制显示（按顺序）
                  var colorList = [
                    "#ea9ef3",
                    "yellowgreen",
                    "#4a5eea",
                    "#00a0e9",
                    "#8957a1",
                    "#80f1b0",
                    "#ff6692",
                    "#f29b76",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              normal: {
                show: true,
                position: "top", // top, right, inside, insideTop,...
                textStyle: {
                  color: "white",
                  fontSize: 16,
                },
                formatter: "{c}",
              },
            },
          },
        ],
        //     dataZoom: [
        //   {
        //     id: 'dataZoomX',
        //     type: 'inside',
        //     xAxisIndex: [0],
        //     filterMode: 'none',
        //     start: 0,
        //     end: 50
        //   }
        // ]
      };
      echarts.init(document.getElementById("gaojingfenx")).setOption(option);
    },
    initQualitySafe() {
      let that = this;
      selectStateAmount(1).then((res) => {
        that.safeList = res.data.list;
        that.race1 =
          that.safeList[0].value == 0
            ? 0
            : ((that.safeList[2].value / that.safeList[0].value) * 100).toFixed(
              0
            );
        that.race2 =
          res.data.thirtyList[0].value == 0
            ? 0
            : (
              (res.data.thirtyList[1].value / res.data.thirtyList[0].value) *
              100
            ).toFixed(0);
        that.race = that.race1;
        console.log("race1:" + that.race1);
        console.log("race2:" + that.race2);
        // 萝岗数据要求 替换假数据
        if (this.$store.getters.projectId == "4d28a604aa03a3a0008bf578ce976749") {
          that.safeList = [
            {
              name: "检查总数",
              proName: null,
              number: null,
              date: null,
              type: null,
              value: 154,
              amount: null,
              urgency: null,
              noPass: null,
            },
            {
              name: "待整改",
              proName: null,
              number: null,
              date: null,
              type: null,
              value: 0,
              amount: null,
              urgency: null,
              noPass: null,
            },
            {
              name: "已整改",
              proName: null,
              number: null,
              date: null,
              type: null,
              value: 154,
              amount: null,
              urgency: null,
              noPass: null,
            },
          ];
        }
        this.aqwtTongji();
        this.loadGauge();
      });
    },
    selectBoard() {
      selectKnowledgeCount(1).then((res) => {
        if (res.length !== 0) {
          res.forEach((item) => {
            item.count = this.padding4(item.count, 4);
          });
        }
        this.boardList = res;
        console.log("111111111", this.boardList);
      });
    },
    padding4(num, length) {
      //这里用slice和substr均可
      return (Array(length).join("0") + num).slice(-length);
    },

    refreshEvent() {
      this.selectEvent();
    },
    showDialog() {
      this.getList();
      this.dialogSecurity = true;
    },
  },
};
</script>

<style lang="less" scoped>
.ich4 {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url("../../../../assets/compent/sixteen.png") no-repeat;
  background-size: 100% 100%;
}

.demo {
  height: 100% !important;
  padding-top: 2% !important;
  padding-left: 10px;
}

.demo {
  height: 100% !important;
  padding-top: 2% !important;
  padding-left: 10px;
}

.jiantou {
  border: 0;
  font-size: 23px;
  padding: 10px 12px;
}

.jiantou2 {
  border: 0;
  font-size: 23px;
  padding: 10px 12px;
  margin-left: 0px;
}

.video-player {
  height: 100%;
}

.vjs-custom-skin > .video-js {
  width: 100%;
  height: 98%;
  font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI",
  "Microsoft YaHei", "微软雅黑", sans-serif;
}

.security {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;

  .leftbox {
    width: 24%;
    display: flex;
    flex-direction: column;
  }

  .contentbox {
    // flex: 3;
    display: flex;
    flex-direction: column;
    margin: 0 18px;
    width: 55%;
  }

  .rightbox {
    display: flex;
    flex-direction: column;
    width: 24%;
  }

  .chart-box {
    width: 100%;
    height: 98%;
  }
}

.zhuap_l {
  width: 40%;
  float: left;
  height: 100%;

  ul {
    padding: 14px 0 0 15px;
    margin: 0;
    height: 100%;
    list-style: none;

    li {
      width: 50%;
      float: left;
      height: 10vh;

      span {
        display: block;
        width: 80px;
        height: 70px;
        float: left;
        background: url("../../../../assets/viewplate/aqzp_ico.png") no-repeat;
      }

      h4 {
        display: block;
        float: left;
        font-weight: 400;
        color: #c3e9fc;

        i {
          display: block;
          color: #eee;
          font-style: normal;
        }
      }
    }
  }
}

.zhuap_r {
  width: 60%;
  height: 100%;
  float: left;

  div.zhuap_r_item {
    flex: 1;
    margin-left: 5px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.aqzsk {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  height: 98%;
  overflow-y: auto;

  li {
    float: left;
    width: 50%;
    margin-bottom: 15px;

    h5 {
      font-size: 13px;
      font-weight: 400;
      color: #90a3b3;
      margin-top: 0;
      margin-bottom: 10px;
    }

    span {
      display: block;

      i {
        padding: 6px 6px;
        margin-right: 12px;
        background: #233364;
        color: #fff;
        font-size: 18px;
      }
    }
  }
}

.aqshijian-l,
.aqshijian-r {
  width: 47%;
  float: left;
  height: 100%;
  text-align: right;
  padding-right: 3%;

  p {
    color: #ccc;
  }
}

.aqshijian-r {
  background: url("../../../../assets/viewplate/timeline_bg.png") no-repeat;
  background-position: 0 0;
  text-align: left;
  width: 45%;
  padding-right: 0;
  padding-left: 5%;
}

.video-jk {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-content: stretch;
  width: 100%;
  height: 90%;
  margin-top: 10px;
  padding-right: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .video-item {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
    height: 100%;

    .videokz {
      position: absolute;
      left: 15px;
      top: 18px;
      z-index: 999;
      display: flex;

      i {
        margin-right: 10px;
        padding: 5px;
        background: #d7dee49e;
        font-size: 20px;
        border-radius: 2px;
        cursor: pointer;
      }
    }

    .closeDiv {
      left: auto;
      top: 18px;
      right: 0;

      i {
        font-size: 14px;
      }
    }

    video::-webkit-media-controls-play-button {
      display: none;
    }

    video::-webkit-media-controls-timeline {
      display: none;
    }

    video::-webkit-media-controls-current-time-display {
      display: none;
    }

    video::-webkit-media-controls-time-remaining-display {
      display: none;
    }

    video::-webkit-media-controls-mute-button {
      display: none;
    }

    video::-webkit-media-controls-toggle-closed-captions-button {
      display: none;
    }

    video::-webkit-media-controls-volume-slider {
      display: none;
    }

    .video-main {
      flex: 1;
      outline: none;
      width: 98%;
      margin: 10px 0 0 10px;
      background: #000;
      position: absolute;
    }
  }
}

.shipingjjk {
  padding-left: 0;
  min-height: 493px;

  /deep/ .cb-content {
    height: 98% !important;
  }

  /deep/ .cb-head .combox-title {
    margin-left: 15px;
  }
}

.video-top {
  i {
    font-size: 18px;
    margin-left: 7px;
    color: #01b9ff;
  }
}

.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.is-active {
  transform: translateX(161px) scale(0.83) !important;
}

.icondangexianshi {
  font-size: 15px !important;
}

.site-right {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #0183bc;
}

#gaojingfenx {
  width: 100%;
  height: 100%;
}

.videoClose {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 2%;
  margin-left: 10px;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

@media screen and(max-width: 1024px) {
  .shipingjjk {
    min-height: 0 !important;
  }

  .video-jk {
    width: 100%;
    // transform: scale(1.1);
  }

  .leftbox,
  .rightbox {
    width: 320px !important;

    .com-box {
      // height: 33vh;
    }
  }

  .security .contentbox {
    width: calc(100% - 740px);
    flex: 2;
  }

  // #aq_tj_Chart,
  // #gaugebox,
  // #gaojingfenx {
  //   transform: scaleY(0.85);
  // }
}

iframe {
  width: 100%;
  height: 100% !important;
  padding: 0;
  margin: 0;
}

#wrap {
  width: 100%;
  height: 100% !important;
}

iframe {
  border: none !important;
}

.vjs-custom-skin {
  height: 90% !important;
}
</style>
<style>
@media screen and (max-width: 1024px) {
  .security .el-dialog {
    /* margin-top: 0vh !important; */
    /* transform: scaleX(1.05); */
    transform: scale(0.8);
    transform-origin: 25% 0%;
  }

  video,
  .video-player,
  .vjs-tech,
  .vjs-custom-skin,
  .video-main,
  .video-item {
    object-fit: fill !important;
  }
}
</style>
