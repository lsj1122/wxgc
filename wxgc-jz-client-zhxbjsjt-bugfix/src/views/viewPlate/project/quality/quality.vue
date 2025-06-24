<template>
<div class="boot" style="height:100%">
 <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>
  <div class="security">

    <div class="leftbox">
      <combox title="质量问题统计" style="flex: 1">
        <div id="aq_tj_Chart" class="chart-box" @click="showQua"></div>
      </combox>
      <combox title="质量工艺展示" style="flex: 1">
        <gyshow ref="gys"/>
      </combox>
      <combox title="质量知识库" style="flex: 1; margin: 0">
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
    <div class="contentbox">
      <combox :title="contentboxTitle" style="flex: 2 80px" class="shipingjjk">
        <!--        <div class="site-right">-->
        <!--          <i class="iconfont iconshezhi" @click="openVideo"></i>-->
        <!--        </div>-->
        <el-select v-if="valueoptionsShow" v-model="valueoptions" placeholder="请选择" @change='valueoptionsChange'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>

        <div class="videoBox">
          <video-player
            class="vjs-custom-skin"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            @play="onPlayerPlay($event)"
          ></video-player>
        </div>
      </combox>
      <combox title="质量图片轮播" style="flex: 1; margin: 0">
        <div class="zhuap_r">
          <el-carousel height="21vh">
            <el-carousel-item
              v-for="(items, index) in pictureMerge"
              :key="index"
            >
              <div v-for="(item, index) in items" :key="index">
<!--                <p>{{ item.text }}</p>-->
                <img :src="item.pictureFilePath" alt srcset/>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </combox>
    </div>
    <div class="rightbox">
      <combox title="质量问题整改率 (%)" style="flex: 1">
        <!-- <template #head>
          <el-button-group>
            <el-button type="primary" size="mini" @click="changeThirty(0)"
            >30日
            </el-button
            >
            <el-button type="primary" size="mini" @click="changeThirty(1)"
            >累计
            </el-button
            >
          </el-button-group>
        </template> -->
        <div id="gaugebox" class="chart-box"></div>
      </combox>
      <combox
        title="技术交底及质量事故应急预案"
        style="flex: 1"
        class="yingjiyuan chart-box"
      >
        <ul class="zhiliangyb">
          <li
            v-for="item in qualityData"
            :key="item.id"
           @click="openFile(item.otherFilePath)"
          >
            <span>{{ item.otherFilePath.split("/").pop() }}</span>
            <span>{{ item.createTime.split(" ").shift() }}</span>
          </li>
        </ul>
      </combox>
      <combox title="送检提醒" style="flex: 1; margin: 0">
        <div class="songjian chart-box">
          <div v-for="item in songjList" :key="item.id">
            <div
              :class="{ chaochusj: item.dayCount > 0 && item.checkType === 0 }"
            >
              <a class="yinca" :title="item.code">编号{{ item.code }}</a>
              &emsp;&emsp;
              <a class="yinca" :title="item.type">{{ item.type }}</a>
              &emsp;&emsp;
              <span v-if="item.dayCount > 0" class="yinca2"
              >已超过送检日{{ item.dayCount }}天</span
              >
              <span v-if="item.dayCount <= 0" class="yinca2"
              >距送检日{{ Math.abs(item.dayCount) }}天</span
              >
              <i v-if="item.checkType === 1" class="yisongjian">已送检</i>
              <i
                v-if="item.checkType === 0"
                style="cursor: pointer"
                @click="songjian(item)"
              >需送检</i
              >
            </div>
          </div>
        </div>
      </combox>
    </div>

    <el-dialog
      title="知识库"
      width="1000px"
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
      title="质量检查"
      width="1500px"
      :visible.sync="dialogQuality"
      :modal-append-to-body="false"
    >
      <el-table
        :data="quaTable"
        height="500px"
        style="width: 100%; border-radius: 10px"
        @selection-change="handleSelectionChange"
        @row-click="rowdbclickFn"
      >
           <el-table-column
          prop="problemType"
          label="问题类型"
          width
        ></el-table-column>
  <el-table-column prop="createBy" label="检查人" width></el-table-column>
        <el-table-column
          prop="createTime"
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
          prop="auditResult"
          label="审核结果"
          width
        ></el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="el-pagination"
          v-show="total1 > 0"
          background
          layout="prev, pager, next"
          :current-page.sync="listQuery.pageIndex"
          :page-size.sync="listQuery.pageSize"
          @current-change="getListQua"
          :total="total1"
        >
        </el-pagination>
      </div>
    </el-dialog>

    <edit-video-dialog ref="evi" :type="4" @getVideoData="getvideoList"/>
    <sendreminder ref="remi" @submitSuccess="querySongj"/>
    <punchlist ref="punchl"/>
    <upvideoDialog
      :dialogupVideoVisible.sync="upVideoVisible"
      @uploadSucc="upvideo"
    />
    <fileView ref="fileView" title="文件预览"></fileView>
  </div>
  </div>
</template>

<script>
import pdfobject from "pdfobject";
import EditVideoDialog from "./module/editVideoDialog.vue";
import Pagination from "../../../../components/Pagination";
import punchMixin from "@/utils/punchListMixin";
import {getoption} from "./module/zglChartOption.js";
import echarts from "echarts";
import Gyshow from "./module/gyshow.vue";
import Sendreminder from "./module/sendreminder.vue";
import {
  getPageTtQualitysafeManager,
  selectStateAmount,
} from "@/views/qualityManager/api/ttQualitysafeManager";
import {
  selectTtCheckDateByPro,
  updateTtCheckDate,
} from "@/views/qualityManager/api/ttcheckdate";
import {
  addTtUploadFile,
  selectType,
  gongchengSelect,
  updateTtUploadFile,
} from "@/views/sysproject/api/ttuploadfile";
import {selectKnowledgeCount} from "@/views/safeManager/api/ttknowledgebase";
import {getPageTtKnowledgeBaseFile} from "@/views/safeManager/api/ttknowledgebasefile";
import upvideoDialog from "@/views/viewPlate/project/projectDescribe/uploadVideo1";
import fileView from "@/components/filePreview/filePreview.vue";
import timeButton from "../aModules/timeButton";

export default {
  name: "quality",
  mixins: [punchMixin],
  components: {
    Pagination,
    Gyshow,
    Sendreminder,
    EditVideoDialog,
    upvideoDialog,
    fileView,
    timeButton
  },
  data() {
    return {
      valueoptionsShow: false,
      options: [{
        value: '高支模搭设',
      }, {
        value: '斜屋面质量控制',

      }, {
        value: '网架',

      }, {
        value: '采光顶',

      }],
      valueoptions: '高支模搭设',

      contentboxTitle: '工程质量样板',
      upVideoVisible: false,
      listQuery: {
        dataType: 0,
        pageIndex: 1,
        pageSize: 10,
      },
      playerOptions: {
        autoplay: true,
        muted: true,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            src: "",
            // src:''
          },
        ],
      },
      quaTable: [],
      dialogQuality: false,
      songjList: [],
      qualityList: [], //质量问题统计数据
      race: "",
      race1: "",
      race2: "",
      qualityData: [], //质量月报数据
      id: "",
      boardList: [], //质量知识库个数
      tableData_bot: [], //知识库列表
      dialogKnowledge: false,
      page: 1,
      total: 10,
      total1: 1,
      knowledgeBaseId: "",

      // 质量图片轮播数据
      pictureData: [],
      pictureMerge: [],
      pictureText: "",
      videoId: null,
    };
  },
  updated() {
  },
  created() {
    if (this.$store.state.user.name == "hfkjg" ||
      this.$store.state.project.projectName == '合肥市科技馆新馆（自然博物馆）') {
      this.contentboxTitle = 'BIM宣传视频'
      this.valueoptionsShow = true
      this.playerOptions.sources[0].src = 'https://zhuochuangpingtai.oss-cn-beijing.aliyuncs.com/原片合肥市科技馆新馆（自然博物馆）——高支模搭设动画展示3.0.mp4'
    } else {
      this.contentboxTitle = '工程质量样板'
      this.valueoptionsShow = false
      this.playerOptions.sources[0].src = 'https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210422/虚拟质量样板录屏.mp4'
    }
    this.querySongj(); //初始化送检提醒
    this.queryYBvideo(); //初始化工程质量样板(之前的代码)

    // this.gongchengPlay()  //工程质量样板 视频接口数据
  },
  mounted() {
    this.initQualitySafe(); //初始化质量问题统计/质量问题整改率
    this.selectEvent(); //初始化技术交底
    this.selectBoard(); //初始化质量知识库
    this.selectPicture(); //初始化质量图片
  },
  destroyed() {
    clearTimeout(this.timerLv);
  },

  methods: {
    valueoptionsChange() {

      if (this.valueoptions == '高支模搭设') {
        this.playerOptions.sources[0].src = 'https://zhuochuangpingtai.oss-cn-beijing.aliyuncs.com/原片合肥市科技馆新馆（自然博物馆）——高支模搭设动画展示3.0.mp4'
      }
      if (this.valueoptions == '斜屋面质量控制') {
        this.playerOptions.sources[0].src = 'https://zhuochuangpingtai.oss-cn-beijing.aliyuncs.com/原片合肥市科技馆新馆（自然博物馆）——斜屋面质量控制3.0.mp4'
      }
      if (this.valueoptions == '网架') {
        this.playerOptions.sources[0].src = 'https://zhuochuangpingtai.oss-cn-beijing.aliyuncs.com/网架（无水印）.mp4'
      }
      if (this.valueoptions == '采光顶') {
        this.playerOptions.sources[0].src = 'https://zhuochuangpingtai.oss-cn-beijing.aliyuncs.com/采光顶（无水印）.mp4'
      }
    },
    openVideo() {
      //点击设置打开宣传视频上传页面
      this.upVideoVisible = true;
    },
    gongchengPlay() {
      gongchengSelect().then(res => {

        if (res.data.url != null && res.data.url.length > 0) {
          this.playerOptions.sources[0].src = res.data.url

        }
      })
    },
    queryYBvideo() {
      selectType(5).then((res) => {
        console.log(437, res)
        if (res.data.length > 0) {
          this.playerOptions.sources[0].src = res.data[0].videoFilePath;
          this.videoId = res.data[0].id;
        }
      });
    },
    upvideo(filePath) {
      if (this.videoId) {
        updateTtUploadFile({
          type: 5,
          id: this.videoId,
          videoFilePath: filePath,
        }).then((res) => {
          if (res.code == "success") {
            this.$message.success("添加成功！");
            this.queryYBvideo();
          }
        });
      } else {
        addTtUploadFile({
          type: 5,
          videoFilePath: filePath,
        }).then((res) => {
          if (res.code == "success") {
            this.$message.success("添加成功！");
            this.queryYBvideo();
          }
        });
      }
    },
    getvideoList({data}) {
      this.$refs.gys.loadData([...data]);
    },
    songjian(row) {
      let params = {
        id: row.id,
        checkType: 1,
      };
      updateTtCheckDate(params).then((res) => {
        if (res.code == "success") {
          this.$message.success("送检成功！");
          this.querySongj();
        }
      });
    },
    querySongj() {
      selectTtCheckDateByPro().then((res) => {
        if (res.code == "success") {
          this.songjList = res.data;
        }
      });
    },
    onPlayerPlay(e) {
      e;
    },
    getListQua() {

      getPageTtQualitysafeManager(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.quaTable = res.data.records;
            this.total1 = res.data.total;
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    showQua() {
      this.dialogQuality = true;
      this.getListQua();
    },
    handleSelectionChange() {
    },
   openFile(url) {
      console.log('打开文件', url);
      var b64Encoded = Base64.encode(url);
      window.open('/view-api/onlinePreview?url=' + encodeURIComponent(b64Encoded));
    },
    playReady() {
    },
    afkListener() {
    },
    selectPicture() {
      selectType(9).then((res) => {
        if (res.code !== "success") return;
        this.pictureData = res.data;
        // 拼凑轮播数组, 三合一
        this.pictureMerge = []; // 重置
        let pictureObj = [...res.data];
        while (pictureObj.length > 0) {
          this.pictureMerge[this.pictureMerge.length] = pictureObj.splice(0, 3);
        }
      });
    },
    changeThirty(type) {
      let that = this;
      if (type === 0) {
        this.race = this.race1;
      } else {
        this.race = this.race1
      }
      that.loadGauge();
    },
    hanSeleChange_bot() {
    },
    sizeChange() {
    },
    currentChange(page) {
      this.page = page;
      this.getFileList(this.knowledgeBaseId);
    },
    sizeChange1() {
    },
    currentChange1(res) {
    },
    clickKnowledge() {
      //打开弹窗
      this.dialogKnowledge = true;
    },
    getFileList(id) {
      //获取知识库列表
      this.dialogKnowledge = true;
      this.knowledgeBaseId = id;
      getPageTtKnowledgeBaseFile({
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        knowledgeBaseFileId: undefined,
        knowledgeBaseId: id,
      }).then((res) => {
        if (res.code == "success") {
          this.total = res.data.total;
          this.tableData_bot = res.data.records;
          this.total_bot = res.data.total;
        }
      });
    },
    aqwtTongji() {
      let img =
        "data:image/png;base64,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";
      let trafficWay = this.qualityList;
console.log("质量检查",trafficWay);
      let data = [];
      let color = ["#0037FF", "#F508EE", "#03FF98"];
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
      // //判断 是否是 合肥科技馆的账号
      let seriesOption;
      if (this.$store.state.user.name == "hfkjg" ||
        this.$store.state.project.projectName == '合肥市科技馆新馆（自然博物馆）') {
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
    },
    loadGauge() {
      let mychart = echarts.init(document.getElementById("gaugebox"));
      let angle = 0;
      let draw = () => {
        angle += 3;
        mychart.setOption(getoption(angle, this.race), true);
        this.timerLv = setTimeout(draw, 100);
      };

      this.timerLv = setTimeout(draw, 100);
    },
    padding4(num, length) {
      //这里用slice和substr均可
      return (Array(length).join("0") + num).slice(-length);
    },
    initQualitySafe() {
      let that = this;
      selectStateAmount(0).then((res) => {
        if (res.code !== "success") {
          return;
        }
        that.qualityList = res.data.list;
        console.log("质量",that.qualityList);
        // 萝岗数据要求 替换假数据
        if (this.$store.getters.projectId === "4d28a604aa03a3a0008bf578ce976749") {
          that.qualityList = [
            {
              "name": "检查总数",
              "proName": null,
              "number": null,
              "date": null,
              "type": null,
              "value": 124,
              "amount": null,
              "urgency": null,
              "noPass": null
            },
            {
              "name": "待整改",
              "proName": null,
              "number": null,
              "date": null,
              "type": null,
              "value": 0,
              "amount": null,
              "urgency": null,
              "noPass": null
            },
            {
              "name": "已整改",
              "proName": null,
              "number": null,
              "date": null,
              "type": null,
              "value": 124,
              "amount": null,
              "urgency": null,
              "noPass": null
            }
          ]
        }
        that.race1 =
          that.qualityList[0].value == 0
            ? 0
            : (
              (that.qualityList[2].value / that.qualityList[0].value) *
              100
            ).toFixed(0);
        that.race2 =
          res.data.thirtyList[0].value == 0
            ? 0
            : (
              (res.data.thirtyList[1].value / res.data.thirtyList[0].value) *
              100
            ).toFixed(0);
        that.race = that.race1;
        this.aqwtTongji();
        this.loadGauge();
      });
    },
    selectBoard() {
      selectKnowledgeCount(0).then((res) => {
        res.forEach((item) => {
          item.count = this.padding4(item.count, 4);
        });
        this.boardList = res;
      });
    },
    selectEvent() {
      selectType(8).then((res) => {
        if (res.code !== "success") return;
        this.qualityData = res.data;
      });
    },
    refreshEvent() {
      this.selectEvent();
    },
    preview(path) {
      console.log(path)
      let type = path.split(".").pop();
      let htmls = "";
      if (type == "pdf") {
        htmls = `<div style="width:100%;height:650px" id="prepdf"></div>`;
        setTimeout(() => {
          pdfobject.embed(path, "#prepdf");
        }, 200);
        this.$alert(htmls, "预览", {
          dangerouslyUseHTMLString: true,
          customClass: "preWord",
        });
      } else {
        this.$refs.fileView.show(path, type); //(文件地址,文件类型)
        // htmls = `<iframe src='https://view.officeapps.live.com/op/view.aspx?src=${path}' width='100%' height='650' frameborder='0'></iframe>`;
      }

    },
  },
};
</script>

<style lang="less" scoped>
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

.container {
  height: 100%;
}

#data {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#player {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
  overflow-y: hidden;
}

.security {
  width: 100%;
  height: 95%;
  display: flex;
  align-items: stretch;

  .leftbox {
    // flex: 1;
    width: 22%;
    display: flex;
    flex-direction: column;
  }

  .contentbox {
    width: 55%;
    display: flex;
    flex-direction: column;
    margin: 0 18px;
  }

  .rightbox {
    display: flex;
    flex-direction: column;
    width: 22%;
  }

  .chart-box {
    width: 100%;
    height: 20vh;
  }
}

.jishuguanli {
  ul {
    margin: 0;
    padding: 0;

    li {
      margin-bottom: 10px;
      overflow: hidden;

      h3 {
        font-size: 14px;
        font-weight: 400;
        margin-top: 4px;
        float: left;
        margin: 0;
        color: @scolor;

        i {
          margin-right: 8px;
        }
      }

      span {
        display: block;
        float: right;

        i {
          color: @fcolor;
          font-family: "dzfont";
          font-size: 21px;
          margin-right: 5px;
        }
      }
    }
  }
}

.songjian {
  overflow: auto;
  height: 350px;

  > div {
    display: flex;
    font-size: 12px;
    height: 33px;
    align-items: center;
    justify-content: space-between;

    i {
      font-style: normal;
      padding: 3px 5px;
      color: rgb(170, 170, 170);
      border: 1px solid #a1a1a1;
      border-radius: 3px;
      margin: 0 5px;
    }

    i.yisongjian {
      color: rgb(0, 184, 122);
      border: 1px solid #00bb8c;
    }

    a {
      margin-left: 5px;
    }

    a.yinca {
      display: inline-block;
      max-width: 5vw;
      width: 4vw;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    span.yinca2 {
      display: inline-block;
      width: 102px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  div.chaochusj {
    span,
    a {
      color: rgb(255, 52, 52);
    }
  }
}

.zhiliangyb {
  margin: 5px 0 0 0;
  padding: 0;

  li {
    margin-bottom: 10px;
    display: flex;
    cursor: pointer;
    justify-content: space-between;

    &:hover {
      opacity: 0.8;
    }

    span:first-child {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.videoBox {
  height: 50.4vh;

  .video-player {
    height: 100%;

    /deep/ .video-js {
      width: 100%;
      height: 100%;
    }

    /deep/ .video-js .vjs-big-play-button {
      left: 50%;
      top: 50%;
    }
  }
}

.xuniyangban-main {
  text-align: center;
  position: relative;
  height: 93%;

  img {
    height: 48vh;
  }

  .msg-dig {
    position: absolute;
    right: 1vw;
    top: 0.9vh;
    z-index: 10;
    text-align: left;
    padding: 20px;
    border: 1px solid #1f8bb5;
    box-shadow: inset 0 0 22px #2a9dd4;
    background: rgba(0, 25, 37, 0.73);
    border-radius: 10px;

    img {
      width: 100px;
      height: 100px;
    }
  }

  .btns-box-yangban {
    position: absolute;
    bottom: 0;
    z-index: 9;
    left: 24vw;
  }

  .right-btns-box {
    position: absolute;
    right: 1vw;
    bottom: 2vw;
    z-index: 9;

    /deep/ .el-button {
      display: block;
      margin: 0 0 10px 0;
    }
  }
}

.aqzsk {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  overflow-y: auto;
  height: 21vh;

  li {
    float: left;
    width: 50%;
    margin-bottom: 15px;

    h5 {
      font-size: 13px;
      font-weight: 400;
      color: #90a3b3;
      /*color: #0000FF;*/
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

// 质量图片轮播样式
.el-carousel__item {
  display: flex;
  justify-content: center;

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

    &:hover {
      z-index: 9;
    }
  }
}

.el-table__body img {
  height: 100px;
  width: 100px;
}

.el-dialog .el-dialog__body .el-form {
  display: flex;
  justify-content: space-around;

  .el-form-item {
    margin: 5px;
    text-align: left;

    /deep/ .el-form-item__label {
      float: none;
    }

    .el-textarea,
    .el-image {
      height: 100px;
    }

    .el-textarea {
      width: 400px;

      /deep/ .el-textarea__inner {
        background-color: #000b28;
        color: white;
      }
    }
  }
}

/deep/ .el-table__body tr.hover-row > td {
  background: #1c2731;
}

/deep/ .yingjiyuan {
  .cb-content {
    overflow: hidden;
    overflow-y: auto;
    height: 22vh;
  }
}

.shipingjjk {
  position: relative;

  /deep/ .el-select {
    position: absolute;
    top: 5px;
    left: 160px;

    input {
      height: 30px !important;
    }

    /deep/ .el-input--medium .el-input__icon {
      line-height: 30px !important;
    }

    /deep/ .el-select .el-input .el-select__caret {
      line-height: 30px !important;
    }
  }
}


@media screen and(max-width: 1024px) {
  .leftbox,
  .rightbox {
    width: 320px !important;
  }

  .el-dialog {
    transform: scale(0.8) !important;
    transform-origin: 25% 0% !important;
  }
}
</style>
<style>
.preWord {
  width: 1120px;
}
</style>
