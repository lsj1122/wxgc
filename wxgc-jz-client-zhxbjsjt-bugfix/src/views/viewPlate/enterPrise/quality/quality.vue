<template>
 <div class="content">
    <timeButton @zongLanChoose="Handover"></timeButton>
    <div class="content-box">
      <!--  -->

      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'质量问题统计'"
          :title2="'Quality problem statistics'"
        >
          <div class="icon-document">
            <div class="safetyPro" style="height: 100%">
              <qualityEcharts ref="spEcharts"></qualityEcharts>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'质量问题整改'"
          :title2="'Rectification of quality problems'"
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
                @click="statistics"
              />
            </el-tooltip>
          </template>

          <div class="icon-document">
            <div class="safetyMend" style="height: 100%">
              <qualityProblems ref="smend"></qualityProblems>
            </div>
          </div>
        </com-line>
      </div>
      <!--  -->
      <div class="content-mid">
        <com-line
          class="content-left-top"
          :title="'质量检查'"
          :title2="'quality testing'"
        >

          <div class="icon-document">
            <div class="dangerEcharts" style="height: 100%">
              <testing ref="dangerEcharts"></testing>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'技术交底文件'"
          :title2="'Technical disclosure documents'"
        >

          <div class="icon-document">
            <div class="equipmentEcharts" style="height: 100%">
              <disclosure ref="equipEcharts"></disclosure>
            </div>
          </div>
        </com-line>
      </div>

      <div class="content-right">
          <com-line
          class="content-left-top"
          :title="'质量样板集'"
          :title2="'Quality Template Set'"
        >


          <div class="icon-document">
            <div class="safetyEducation" style="height: 100%;">
              <Template ref="sEducation"></Template>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'质量知识库'"
          :title2="'Quality knowledge base'"
        >
          <div class="icon-document" >
            <knowledge></knowledge>
          </div>
        </com-line>
      </div>
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
import qualityEcharts from "./module/qualityEcharts.vue";
import qualityProblems from "./module/qualityProblems.vue";
import Sendreminder from "./module/sendreminder.vue";
import testing from "./module/testing.vue";
import disclosure from "./module/disclosure.vue";
import Template from "./module/Template.vue";
import knowledge from "./module/knowledge.vue";
import {
  getPageTtQualitysafeManager,
  selectStateAmount,
} from "@/views/qualityManager/api/ttQualitysafeManager";
import ComLine from "../../components/comline";
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
    ComLine,
    timeButton,
    qualityEcharts,
    qualityProblems,
    testing,
    disclosure,
    Template,
    knowledge
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
    statistics(){
      this.$refs.smend.qualityDialog = true
    },

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
        this.race = this.race2;
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
        that.race = that.race2;
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
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // min-height: 830px;
  // overflow:auto;
  display: flex;
  flex-direction: column;
  .content-box {
    display: flex;
  }
}
.content-left-top{
  margin-bottom: 20px;
}
/*   内容的左边 */
.content-left {
  // width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  //    border: 2px solid pink;
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 中间 */
.content-mid {
  //    border: 2px solid pink;
  position: relative;
  // width: 600px;
  flex: 1;
  min-width: 600px;
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 右边 */
.content-right {
  //    border: 2px solid pink;
  // width: 600px;
  flex: 1;
    min-width: 600px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
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
/deep/ .el-dialog .el-dialog__header {
  margin-top: 20px;
  .el-dialog__title {
    color: #fff;
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
</style>
